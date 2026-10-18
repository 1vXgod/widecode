/** Replaces `{name}` placeholders in content strings, e.g. fill("nga {price}", { price: "199 €" }). */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = values[key];
    if (value === undefined) throw new Error(`Missing template value "${key}" in "${template}"`);
    return value;
  });
}
