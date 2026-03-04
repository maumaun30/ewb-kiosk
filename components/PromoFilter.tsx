"use client";

import { useState, useMemo, useRef } from "react";

import type { Category, Promo, Location, CardType } from "@/lib/types";

import { ArrowRight, ArrowLeft } from "lucide-react";

import PromoCard from "@/components/PromoCard";

interface PromoFilterProps {
  categories: Category[];
  promos: Promo[];
  locations: Location[];
  card_types: CardType[];
  initialCategory?: string;
}

const ITEMS_PER_PAGE = 9;

type SortOption = "date_desc" | "date_asc" | "name_asc" | "name_desc";

export default function PromoFilter({
  categories,
  promos,
  locations,
  card_types,
  initialCategory = "",
}: PromoFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCardType, setSelectedCardType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("date_desc");

  // Ref attached to the top of the promo grid — used to scroll into view on page change
  const gridRef = useRef<HTMLDivElement>(null);

  const scrollToGrid = () => {
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filteredPromos = useMemo(() => {
    const filtered = promos.filter((promo) => {
      const matchesCategory =
        !selectedCategory ||
        promo.field_categories_reference?.some(
          (c) => c.tid === selectedCategory,
        );
      const matchesCardType =
        !selectedCardType ||
        promo.field_card_type?.some((ct) => ct.tid === selectedCardType);
      const matchesLocation =
        !selectedLocation ||
        promo.field_locations?.some((loc) => loc.tid === selectedLocation);
      const matchesSearch =
        !searchQuery ||
        promo.title.toLowerCase().includes(searchQuery.toLowerCase());
      return (
        matchesCategory && matchesCardType && matchesLocation && matchesSearch
      );
    });

    return filtered.sort((a, b) => {
      switch (sortOption) {
        case "date_asc":
          return (
            new Date(a.authored_on).getTime() -
            new Date(b.authored_on).getTime()
          );
        case "date_desc":
          return (
            new Date(b.authored_on).getTime() -
            new Date(a.authored_on).getTime()
          );
        case "name_asc":
          return a.title.localeCompare(b.title);
        case "name_desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }, [
    promos,
    selectedCategory,
    selectedCardType,
    selectedLocation,
    searchQuery,
    sortOption,
  ]);

  const totalPages = Math.ceil(filteredPromos.length / ITEMS_PER_PAGE);
  const paginatedPromos = filteredPromos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleCardTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCardType(e.target.value);
    setCurrentPage(1);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as SortOption);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSelectedCategory("");
    setSelectedCardType("");
    setSelectedLocation("");
    setSearchQuery("");
    setSortOption("date_desc");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToGrid();
  };

  const isFiltered =
    selectedCategory ||
    selectedCardType ||
    selectedLocation ||
    searchQuery ||
    sortOption !== "date_desc";

  return (
    <>
      {/* Filters */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-wrap gap-4 items-center justify-end">
        <input
          type="text"
          placeholder="Search a promo here"
          value={searchQuery}
          onChange={handleSearchChange}
          className="border border-black rounded-4xl px-5 py-3 text-md bg-white focus:outline-none focus:ring-3 focus:ring-(--pink) w-full mb-10"
        />

        <div>
          <label htmlFor="categories" className="block mb-2">
            Category
          </label>
          <select
            name="categories"
            id="categories"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border border-black rounded-4xl px-5 py-3 text-md bg-white focus:outline-none focus:ring-3 focus:ring-(--pink)"
          >
            <option value="">All</option>
            {categories?.map((category) => (
              <option key={category.tid} value={category.tid}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="card_types" className="block mb-2">
            Card Type
          </label>
          <select
            name="card_types"
            id="card_types"
            value={selectedCardType}
            onChange={handleCardTypeChange}
            className="border border-black rounded-4xl px-5 py-3 text-md bg-white focus:outline-none focus:ring-3 focus:ring-(--pink)"
          >
            <option value="">All Cards</option>
            {card_types?.map((card_type) => (
              <option key={card_type.tid} value={card_type.tid}>
                {card_type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="locations" className="block mb-2">
            Location
          </label>
          <select
            name="locations"
            id="locations"
            value={selectedLocation}
            onChange={handleLocationChange}
            className="border border-black rounded-4xl px-5 py-3 text-md bg-white focus:outline-none focus:ring-3 focus:ring-(--pink)"
          >
            <option value="">All</option>
            {locations?.map((location) => (
              <option key={location.tid} value={location.tid}>
                {location.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sort" className="block mb-2">
            Sort by
          </label>
          <select
            name="sort"
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
            className="border border-black rounded-4xl px-5 py-3 text-md bg-white focus:outline-none focus:ring-3 focus:ring-(--pink)"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="name_asc">A → Z</option>
            <option value="name_desc">Z → A</option>
          </select>
        </div>

        {isFiltered && (
          <div>
            <label htmlFor="reset_filters" className="block mb-2">
              Filters
            </label>
            <button
              id="reset_filters"
              onClick={handleReset}
              className="px-5 py-3 text-md rounded-4xl border border-black bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            >
              ✕ Reset
            </button>
          </div>
        )}
      </div>

      {/* Scroll anchor sits just above the grid */}
      <div ref={gridRef} className="max-w-6xl mx-auto">
        {paginatedPromos.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No promos found for the selected filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPromos.map((promo) => (
              <PromoCard key={promo.nid} promo={promo} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="max-w-6xl mx-auto mt-10 flex justify-center items-center gap-5">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-3 rounded-full aspect-square text-sm disabled:hidden ew-bg-pink"
          >
            <ArrowLeft color="white" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            const showPage =
              page === 1 ||
              page === totalPages ||
              Math.abs(page - currentPage) <= 1;
            const showEllipsisBefore =
              page === currentPage - 2 && currentPage - 2 > 1;
            const showEllipsisAfter =
              page === currentPage + 2 && currentPage + 2 < totalPages;

            if (!showPage && !showEllipsisBefore && !showEllipsisAfter)
              return null;
            if (showEllipsisBefore || showEllipsisAfter) {
              return (
                <span key={`ellipsis-${page}`} className="px-2 text-black">
                  …
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`bg-transparent border-0 text-md ${
                  currentPage === page
                    ? "ew-text-pink underline font-semibold"
                    : "text-black"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="p-3 rounded-full aspect-square text-sm disabled:hidden ew-bg-pink"
          >
            <ArrowRight color="white" />
          </button>
        </div>
      )}
    </>
  );
}