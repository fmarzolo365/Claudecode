#!/usr/bin/env node
/**
 * MCP server exposing Doctolib search, availability lookup, and booking
 * deep-links as tools. Booking confirmation itself stays with the user —
 * automating the authenticated booking step would require their Doctolib
 * login and violate the platform's terms, so the flow ends with a link
 * that opens the practitioner's page with the chosen slot to confirm.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { Country, DoctolibClient, DoctolibError } from "./doctolib.js";

const countrySchema = z
  .enum(["de", "fr", "it"])
  .default((process.env.DOCTOLIB_COUNTRY as Country) || "de")
  .describe("Doctolib country site to query: de (doctolib.de), fr, or it");

const server = new McpServer({ name: "doctolib", version: "0.1.0" });

function ok(payload: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }] };
}

function fail(error: unknown) {
  const message =
    error instanceof DoctolibError
      ? error.message
      : error instanceof Error
        ? `Unexpected error: ${error.message}`
        : String(error);
  return { content: [{ type: "text" as const, text: message }], isError: true };
}

server.registerTool(
  "search_doctors",
  {
    title: "Search Doctolib practitioners",
    description:
      "Free-text search on Doctolib for practitioners and specialities (e.g. 'hautarzt', a doctor's name, " +
      "or a clinic). Returns practitioner names with profile slugs, plus matching speciality slugs. " +
      "To list practitioners of a speciality in a city, pass the speciality slug and city via " +
      "'speciality_slug' and 'place' instead of (or in addition to) the free-text query.",
    inputSchema: {
      query: z.string().optional().describe("Free text: doctor name, clinic, or speciality"),
      speciality_slug: z
        .string()
        .optional()
        .describe("Speciality slug for directory search, e.g. 'hautarzt' — combine with 'place'"),
      place: z
        .string()
        .optional()
        .describe("City slug for directory search, lowercase, e.g. 'berlin' or 'langenfeld'"),
      country: countrySchema,
    },
  },
  async ({ query, speciality_slug, place, country }) => {
    try {
      const client = new DoctolibClient(country);
      if (speciality_slug && place) {
        return ok(await client.searchDirectory(speciality_slug, place.toLowerCase()));
      }
      if (query) {
        return ok(await client.search(query));
      }
      return fail("Provide either 'query', or 'speciality_slug' + 'place'.");
    } catch (e) {
      return fail(e);
    }
  }
);

server.registerTool(
  "get_booking_options",
  {
    title: "Get a practitioner's booking options",
    description:
      "Fetch a practitioner's booking configuration: visit motives (reasons for the appointment, " +
      "in Germany often split by public/private insurance), practice locations, and agenda IDs. " +
      "Use the returned visit motive ID with get_availabilities.",
    inputSchema: {
      slug: z.string().describe("Practitioner slug from search_doctors, e.g. 'max-mustermann'"),
      country: countrySchema,
    },
  },
  async ({ slug, country }) => {
    try {
      return ok(await new DoctolibClient(country).bookingOptions(slug));
    } catch (e) {
      return fail(e);
    }
  }
);

server.registerTool(
  "get_availabilities",
  {
    title: "Get open appointment slots",
    description:
      "List open appointment slots for a practitioner and visit motive from a start date. " +
      "Pass the practitioner slug and the visit_motive_id chosen from get_booking_options " +
      "(agenda and practice IDs are resolved automatically). If the range has no slots, " +
      "Doctolib's next known free slot is returned instead.",
    inputSchema: {
      slug: z.string().describe("Practitioner slug from search_doctors"),
      visit_motive_id: z
        .number()
        .optional()
        .describe("Visit motive ID from get_booking_options; defaults to the first motive"),
      start_date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
        .describe("First day to check, YYYY-MM-DD"),
      days: z.number().min(1).max(15).default(7).describe("Number of days to check (max 15)"),
      country: countrySchema,
    },
  },
  async ({ slug, visit_motive_id, start_date, days, country }) => {
    try {
      const client = new DoctolibClient(country);
      const options = await client.bookingOptions(slug);
      if (options.visitMotives.length === 0) {
        return fail(
          `No online-bookable visit motives found for '${slug}'. ` +
            `The practitioner may not accept online booking; profile: ${options.profileUrl}`
        );
      }
      const motive = visit_motive_id
        ? options.visitMotives.find((m) => m.id === visit_motive_id)
        : options.visitMotives[0];
      if (!motive) {
        return fail(
          `Visit motive ${visit_motive_id} not found. Available: ` +
            options.visitMotives.map((m) => `${m.id} (${m.name})`).join(", ")
        );
      }
      const agendaIds = motive.agendaIds.length > 0 ? motive.agendaIds : options.agendas.map((a) => a.id);
      const practiceIds = [
        ...new Set(
          options.agendas
            .filter((a) => agendaIds.includes(a.id))
            .map((a) => a.practiceId)
            .filter((p): p is number => p !== undefined)
        ),
      ];
      const availability = await client.availabilities({
        visitMotiveId: motive.id,
        agendaIds,
        practiceIds:
          practiceIds.length > 0 ? practiceIds : options.places.flatMap((p) => p.practiceIds),
        startDate: start_date,
        limit: days,
      });
      return ok({
        practitioner: options.name,
        visitMotive: { id: motive.id, name: motive.name, insuranceSector: motive.insuranceSector },
        ...availability,
        bookingUrl: options.profileUrl,
      });
    } catch (e) {
      return fail(e);
    }
  }
);

server.registerTool(
  "get_booking_link",
  {
    title: "Get the link to confirm a booking",
    description:
      "Return the practitioner's Doctolib page URL where the user completes the booking themselves " +
      "(login + confirmation happen on Doctolib). Include the chosen slot time in your reply so the " +
      "user knows which slot to pick.",
    inputSchema: {
      slug: z.string().describe("Practitioner slug from search_doctors"),
      country: countrySchema,
    },
  },
  async ({ slug, country }) => {
    try {
      const options = await new DoctolibClient(country).bookingOptions(slug);
      return ok({
        practitioner: options.name,
        bookingUrl: options.profileUrl,
        note: "Open this URL, pick the agreed slot, and confirm while logged in to Doctolib.",
      });
    } catch (e) {
      return fail(e);
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("doctolib-mcp server running on stdio");
