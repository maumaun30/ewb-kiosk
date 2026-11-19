"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface MechanicsCollapseProps {
  html: string;
  /** Height (px) shown while collapsed. */
  collapsedHeight?: number;
}

export default function MechanicsCollapse({
  html,
  collapsedHeight = 320,
}: MechanicsCollapseProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) {
      return;
    }
    const observer = new ResizeObserver(() => {
      setContentHeight(el.scrollHeight);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Only offer the toggle when the content is clearly taller than the preview
  const overflows = contentHeight !== null && contentHeight > collapsedHeight + 40;

  const collapsed = overflows && !expanded;

  return (
    <div>
      <div
        className="relative overflow-hidden transition-[max-height] duration-500 ease-in-out"
        style={{
          // Start collapsed until measured to avoid a flash of the full text
          maxHeight:
            contentHeight === null || collapsed ? collapsedHeight : contentHeight,
        }}
      >
        <div
          ref={contentRef}
          className="promo-mechanics-body"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {collapsed && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-(--background)" />
        )}
      </div>

      {overflows && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((e) => !e)}
          className="mt-6 mx-auto flex items-center gap-3 rounded-4xl border-2 border-(--purple) px-8 py-3 font-semibold ew-text-purple bg-white"
        >
          {expanded ? "Show less" : "Read full mechanics"}
          <ChevronDown
            size={22}
            className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </div>
  );
}
