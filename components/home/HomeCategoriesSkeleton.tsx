import { placeholderIds } from "@/lib/placeholders";
import { TILE_COLUMNS, tileGridWidth } from "./tileGrid";

const TILE_COUNT = 8;
const ROWS = Math.ceil(TILE_COUNT / TILE_COLUMNS);
const TILE_IDS = placeholderIds("tile", TILE_COUNT);

export default function HomeCategoriesSkeleton() {
  return (
    <section className="flex-1 min-h-0 ew-bg-purple py-10 px-5 flex flex-col relative">
      <div className="max-w-6xl mx-auto text-center relative z-2 w-full flex-1 min-h-0 flex flex-col">
        <div className="shrink-0">
          <div className="h-10 w-96 mx-auto rounded-lg bg-white/10 animate-pulse mb-5" />
          <div className="h-5 w-72 mx-auto rounded bg-white/10 animate-pulse" />
        </div>
        <div className="mt-6 flex-1 min-h-0 flex flex-col">
          <div className="shrink-0 h-8 w-80 mx-auto rounded bg-white/10 animate-pulse mb-6" />
          <div className="flex-1 min-h-0 [container-type:size]">
            <div
              className="flex justify-center gap-0 flex-wrap mx-auto"
              style={{ width: tileGridWidth(ROWS) }}
            >
              {TILE_IDS.map((id) => (
                <div key={id} className="aspect-square basis-1/4 grow-0 min-w-0 p-2 flex">
                  <div className="w-full rounded-xl flex items-center justify-center flex-col gap-2 p-3 border-2 border-white/20 animate-pulse">
                    <div className="w-[45%] max-w-20 aspect-square rounded-full bg-white/15" />
                    <div className="h-4 w-16 rounded bg-white/15" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
