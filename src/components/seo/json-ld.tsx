// Characters that must not appear raw inside an inline <script>, with their JSON escapes.
const ESCAPES: ReadonlyArray<[string, string]> = [
  ["<", "u003c"],
  [">", "u003e"],
  ["&", "u0026"],
  [String.fromCharCode(0x2028), "u2028"],
  [String.fromCharCode(0x2029), "u2029"],
];

/**
 * Serializes structured data for a <script> tag. Escapes <, > and & (and the
 * JavaScript line separators) so no value can close the script element.
 */
export function serializeJsonLd(data: object): string {
  let json = JSON.stringify(data);
  for (const [char, code] of ESCAPES) json = json.split(char).join(`${String.fromCharCode(92)}${code}`);
  return json;
}

/** Renders schema.org JSON-LD for search engines. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
