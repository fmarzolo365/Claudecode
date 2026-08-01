/* Repository-wide conflict-marker gate.
   An unresolved merge leaves `<<<<<<<` / `=======` / `>>>>>>>` lines behind.
   docs/EXPANSION.md shipped with a full set of them committed, so this is a
   real failure mode here, not a hypothetical one.

   Run directly (`node test/conflict-markers.js`) or import scanConflictMarkers.
   Dependency-free, like everything else in this repo (ADR-3). */
const fs = require("fs");
const path = require("path");

// built from repeats so this file never contains a literal marker and can be
// scanned by its own gate
const OPEN = "<".repeat(7);
const MIDDLE = "=".repeat(7);
const CLOSE = ">".repeat(7);

const SKIP_DIRS = new Set([".git", "node_modules"]);
const BINARY = /\.(png|jpe?g|gif|webp|avif|ico|svgz|mp3|mp4|webm|wav|woff2?|ttf|otf|eot|pdf|zip|gz|bundle)$/i;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name), out);
    } else if (entry.isFile() && !BINARY.test(entry.name)) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

/* A line is a marker when it starts with a seven-character run followed by a
   space or the end of the line. `=======` alone is also a valid Markdown
   setext heading underline, so it only counts inside a file that already has
   an opening or closing marker - that keeps headings from failing the gate
   while still catching every real conflict. */
function scanFile(file) {
  let text;
  try { text = fs.readFileSync(file, "utf8"); } catch (e) { return []; }
  if (text.indexOf("\0") !== -1) return []; // binary without a known extension
  const lines = text.split("\n");
  const isMarker = (line, run) => line.startsWith(run) && (line.length === run.length || line[run.length] === " ");
  const found = [];
  let hasFence = false;
  lines.forEach((line, i) => {
    if (isMarker(line, OPEN) || isMarker(line, CLOSE)) { hasFence = true; found.push({ line: i + 1, text: line.slice(0, 60) }); }
  });
  if (!hasFence) return [];
  lines.forEach((line, i) => {
    if (isMarker(line, MIDDLE)) found.push({ line: i + 1, text: line.slice(0, 60) });
  });
  return found.sort((a, b) => a.line - b.line);
}

function scanConflictMarkers(root) {
  const base = root || path.join(__dirname, "..");
  const hits = [];
  for (const file of walk(base)) {
    const found = scanFile(file);
    if (found.length) hits.push({ file: path.relative(base, file), markers: found });
  }
  return hits;
}

module.exports = { scanConflictMarkers };

if (require.main === module) {
  const hits = scanConflictMarkers();
  if (!hits.length) {
    console.log("ok  no conflict markers in the repository");
    process.exit(0);
  }
  for (const h of hits) for (const m of h.markers) console.error(`${h.file}:${m.line}: ${m.text}`);
  console.error(`\nFAIL  unresolved conflict markers in ${hits.length} file(s)`);
  process.exit(1);
}
