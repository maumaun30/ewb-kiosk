/** Stable ids for rendering a fixed number of skeleton placeholders (avoids index keys). */
export function placeholderIds(prefix: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `${prefix}-${i + 1}`);
}
