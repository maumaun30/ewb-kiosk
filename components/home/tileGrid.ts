export const TILE_COLUMNS = 4;

/**
 * Width for a grid of square tiles so `rows` rows fit inside the nearest
 * size container (100cqh) while never exceeding 42rem or the container width.
 */
export function tileGridWidth(rows: number) {
  return `min(42rem, 100cqw, calc(100cqh * ${TILE_COLUMNS} / ${rows}))`;
}
