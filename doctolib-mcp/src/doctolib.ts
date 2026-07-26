/**
 * Client for Doctolib's undocumented public JSON endpoints — the same ones the
 * booking widget on doctolib.de/.fr/.it calls without authentication.
 *
 * These endpoints are not an official API: response shapes can change without
 * notice, so all parsing here is defensive (unknown fields ignored, missing
 * fields tolerated). Requests sit behind Datadome bot protection; browser-like
 * headers are enough at low, human-paced volume.
 */

export type Country = "de" | "fr" | "it";

const DOMAINS: Record<Country, string> = {
  de: "www.doctolib.de",
  fr: "www.doctolib.fr",
  it: "www.doctolib.it",
};

const ACCEPT_LANGUAGE: Record<Country, string> = {
  de: "de-DE,de;q=0.9,en;q=0.8",
  fr: "fr-FR,fr;q=0.9,en;q=0.8",
  it: "it-IT,it;q=0.9,en;q=0.8",
};

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

export interface SearchResult {
  kind: "practitioner" | "speciality" | "other";
  name: string;
  speciality?: string;
  location?: string;
  /** Path or absolute URL to the profile / search page on Doctolib. */
  link?: string;
  /** Slug usable with get_booking_options / get_availabilities. */
  slug?: string;
}

export interface VisitMotive {
  id: number;
  name: string;
  /** Doctolib splits motives by insurance sector in DE (public/private). */
  insuranceSector?: string;
  agendaIds: number[];
}

export interface BookingOptions {
  name: string;
  speciality?: string;
  profileUrl?: string;
  places: { id?: string; name?: string; address?: string; practiceIds: number[] }[];
  visitMotives: VisitMotive[];
  agendas: { id: number; practiceId?: number; visitMotiveIds: number[] }[];
}

export interface DaySlots {
  date: string;
  slots: string[];
}

export interface Availabilities {
  days: DaySlots[];
  total?: number;
  /** Doctolib returns the next available slot when the queried range is empty. */
  nextSlot?: string;
}

export class DoctolibError extends Error {}

export class DoctolibClient {
  constructor(private country: Country = "de") {}

  private base(): string {
    return `https://${DOMAINS[this.country]}`;
  }

  private async getJson(path: string): Promise<unknown> {
    const url = `${this.base()}${path}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
        "Accept-Language": ACCEPT_LANGUAGE[this.country],
        Referer: `${this.base()}/`,
      },
    });
    if (res.status === 403) {
      throw new DoctolibError(
        `Doctolib returned 403 for ${url} — likely Datadome bot protection. ` +
          `Retry later, slow down request rate, or open the page in a browser once from this IP.`
      );
    }
    if (!res.ok) {
      throw new DoctolibError(`Doctolib returned HTTP ${res.status} for ${url}`);
    }
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("json")) {
      throw new DoctolibError(
        `Expected JSON from ${url} but got "${contentType}" — the endpoint shape may have changed or the request was challenged.`
      );
    }
    return res.json();
  }

  /** Free-text search via the searchbar autocomplete endpoint. */
  async search(query: string): Promise<SearchResult[]> {
    const data = (await this.getJson(
      `/api/searchbar/autocomplete.json?search=${encodeURIComponent(query)}`
    )) as Record<string, unknown>;

    const results: SearchResult[] = [];

    for (const profile of asArray(data.profiles ?? data.doctors)) {
      const p = profile as Record<string, unknown>;
      results.push({
        kind: "practitioner",
        name: str(p.name_with_title ?? p.name) ?? "(unknown)",
        speciality: str(p.speciality ?? p.speciality_name),
        location: str(p.city ?? p.address),
        link: str(p.link ?? p.url),
        slug: slugFromLink(str(p.link ?? p.url)),
      });
    }
    for (const spec of asArray(data.specialities)) {
      const s = spec as Record<string, unknown>;
      results.push({
        kind: "speciality",
        name: str(s.name) ?? "(unknown)",
        slug: str(s.slug),
      });
    }
    return results;
  }

  /**
   * Directory search: practitioners of a speciality in a place, using the
   * JSON twin of the public results page, e.g. /hautarzt/berlin.json.
   * Slugs come from search() speciality results and city names in lowercase.
   */
  async searchDirectory(specialitySlug: string, placeSlug: string): Promise<SearchResult[]> {
    const data = (await this.getJson(
      `/${encodeURIComponent(specialitySlug)}/${encodeURIComponent(placeSlug)}.json`
    )) as Record<string, unknown>;

    const payload = (data.data ?? data) as Record<string, unknown>;
    const results: SearchResult[] = [];
    for (const doc of asArray(payload.doctors ?? payload.profiles)) {
      const d = doc as Record<string, unknown>;
      results.push({
        kind: "practitioner",
        name: str(d.name_with_title ?? d.name) ?? "(unknown)",
        speciality: str(d.speciality ?? d.speciality_name),
        location: [str(d.address), str(d.zipcode), str(d.city)].filter(Boolean).join(", ") || undefined,
        link: str(d.link ?? d.url),
        slug: slugFromLink(str(d.link ?? d.url)),
      });
    }
    return results;
  }

  /**
   * Booking configuration for one practitioner: visit motives, agendas and
   * practices — the IDs needed to query availabilities.
   */
  async bookingOptions(slug: string): Promise<BookingOptions> {
    const data = (await this.getJson(`/booking/${encodeURIComponent(slug)}.json`)) as Record<
      string,
      unknown
    >;
    const payload = (data.data ?? data) as Record<string, unknown>;

    const profile = (payload.profile ?? {}) as Record<string, unknown>;

    const agendas = asArray(payload.agendas).map((a) => {
      const r = a as Record<string, unknown>;
      return {
        id: num(r.id) ?? 0,
        practiceId: num(r.practice_id),
        visitMotiveIds: asArray(r.visit_motive_ids ?? r.visit_motive_ids_by_practice_id)
          .map(num)
          .filter((n): n is number => n !== undefined),
      };
    });

    const visitMotives: VisitMotive[] = asArray(payload.visit_motives).map((m) => {
      const r = m as Record<string, unknown>;
      const id = num(r.id) ?? 0;
      return {
        id,
        name: str(r.name) ?? "(unknown)",
        insuranceSector: str(r.insurance_sector),
        agendaIds: agendas.filter((a) => a.visitMotiveIds.includes(id)).map((a) => a.id),
      };
    });

    const places = asArray(payload.places).map((pl) => {
      const r = pl as Record<string, unknown>;
      return {
        id: str(r.id),
        name: str(r.name),
        address: [str(r.address), str(r.zipcode), str(r.city)].filter(Boolean).join(", ") || undefined,
        practiceIds: asArray(r.practice_ids).map(num).filter((n): n is number => n !== undefined),
      };
    });

    const link = str(profile.link);
    return {
      name: str(profile.name_with_title ?? profile.name) ?? slug,
      speciality: str(profile.speciality),
      profileUrl: link ? this.absolute(link) : `${this.base()}/booking/${slug}`,
      places,
      visitMotives,
      agendas,
    };
  }

  /** Open slots for a motive over a date range. */
  async availabilities(params: {
    visitMotiveId: number;
    agendaIds: number[];
    practiceIds: number[];
    startDate: string;
    limit?: number;
  }): Promise<Availabilities> {
    const q = new URLSearchParams({
      visit_motive_ids: String(params.visitMotiveId),
      agenda_ids: params.agendaIds.join("-"),
      practice_ids: params.practiceIds.join("-"),
      start_date: params.startDate,
      limit: String(params.limit ?? 15),
    });
    const data = (await this.getJson(`/availabilities.json?${q.toString()}`)) as Record<
      string,
      unknown
    >;

    const days: DaySlots[] = asArray(data.availabilities).map((day) => {
      const d = day as Record<string, unknown>;
      return {
        date: str(d.date) ?? "",
        slots: asArray(d.slots)
          .map((s) =>
            typeof s === "string" ? s : str((s as Record<string, unknown>).start_date)
          )
          .filter((s): s is string => Boolean(s)),
      };
    });

    const nextSlot = data.next_slot;
    return {
      days,
      total: num(data.total),
      nextSlot:
        typeof nextSlot === "string"
          ? nextSlot
          : str((nextSlot as Record<string, unknown> | undefined)?.start_date),
    };
  }

  absolute(link: string): string {
    return link.startsWith("http") ? link : `${this.base()}${link}`;
  }
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function num(v: unknown): number | undefined {
  return typeof v === "number" ? v : undefined;
}

/** Profile links look like /hautarzt/berlin/max-mustermann — the slug is the last segment. */
function slugFromLink(link: string | undefined): string | undefined {
  if (!link) return undefined;
  try {
    const path = link.startsWith("http") ? new URL(link).pathname : link;
    const segments = path.split("/").filter(Boolean);
    return segments.length > 0 ? segments[segments.length - 1] : undefined;
  } catch {
    return undefined;
  }
}
