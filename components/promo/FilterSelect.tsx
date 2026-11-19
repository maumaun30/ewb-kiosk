"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export interface FilterOption<T extends string> {
  value: T;
  label: string;
}

interface FilterSelectProps<T extends string> {
  label: string;
  value: T;
  options: FilterOption<T>[];
  onChange: (value: T) => void;
  /** Which edge the dropdown panel aligns to (use "right" near the right edge of the screen). */
  align?: "left" | "right";
}

export default function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  align = "left",
}: FilterSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();
  const labelId = `${id}-label`;
  const listId = `${id}-list`;

  const selected = options.find((o) => o.value === value) ?? options[0];

  // Close on outside tap or Escape
  useEffect(() => {
    if (!open) {return;}

    const handlePointerDown = (e: PointerEvent) => {
      if (e.target instanceof Node && !rootRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {setOpen(false);}
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Bring the selected option into view when opening
  useEffect(() => {
    if (!open) {return;}
    listRef.current
      ?.querySelector<HTMLElement>('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [open]);

  const handleSelect = (next: T) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative flex-1 min-w-0">
      <span id={labelId} className="block mb-2">
        {label}
      </span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelId} ${id}-value`}
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-2 border rounded-4xl px-5 py-3 text-left bg-white transition-colors focus:outline-none focus-visible:ring-3 focus-visible:ring-(--pink) ${
          open ? "border-(--pink) ring-3 ring-(--pink)/30" : "border-black"
        }`}
      >
        <span id={`${id}-value`} className="truncate">
          {selected?.label}
        </span>
        <ChevronDown
          size={22}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          className={`absolute top-full z-40 mt-2 min-w-full w-max max-w-[min(24rem,90vw)] max-h-96 overflow-y-auto overscroll-contain rounded-3xl bg-white p-2 shadow-xl ring-1 ring-black/10 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                tabIndex={-1}
                onClick={() => handleSelect(option.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect(option.value);
                  }
                }}
                className={`flex items-center justify-between gap-4 rounded-2xl px-4 py-3 cursor-pointer select-none ${
                  isSelected
                    ? "ew-bg-purple text-white font-semibold"
                    : "text-black active:bg-gray-100 hover:bg-gray-100"
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <Check size={20} className="shrink-0 ew-text-green" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
