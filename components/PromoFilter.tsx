"use client";

import { useState, useMemo } from "react";

import type { Category, Promo, Location, CardType } from "@/lib/types";

import Link from "next/link";
import Image from "next/image";

import { ArrowRight } from "lucide-react";

interface PromoFilterProps {
  categories: Category[];
  promos: Promo[];
  locations: Location[];
  card_types: CardType[];
}

const ITEMS_PER_PAGE = 9;

type SortOption = "date_desc" | "date_asc" | "name_asc" | "name_desc";

export default function PromoFilter({
  categories,
  promos,
  locations,
  card_types,
}: PromoFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCardType, setSelectedCardType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("date_desc");

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

  const isFiltered =
    selectedCategory ||
    selectedCardType ||
    selectedLocation ||
    searchQuery ||
    sortOption !== "date_desc";

  return (
    <>
      {/* Filters */}
      <div className="max-w-5xl mx-auto mb-10 flex flex-wrap gap-4 items-center justify-end">
        {/* Search */}
        <input
          type="text"
          placeholder="Search promos..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />

        <span className="text-sm text-gray-500 mr-auto">
          {filteredPromos.length} result{filteredPromos.length !== 1 ? "s" : ""}
        </span>

        {isFiltered && (
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            ✕ Reset Filters
          </button>
        )}

        <select
          name="categories"
          id="categories"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories?.map((category) => (
            <option key={category.tid} value={category.tid}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          name="card_types"
          id="card_types"
          value={selectedCardType}
          onChange={handleCardTypeChange}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Card Types</option>
          {card_types?.map((card_type) => (
            <option key={card_type.tid} value={card_type.tid}>
              {card_type.name}
            </option>
          ))}
        </select>

        <select
          name="locations"
          id="locations"
          value={selectedLocation}
          onChange={handleLocationChange}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Locations</option>
          {locations?.map((location) => (
            <option key={location.tid} value={location.tid}>
              {location.name}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          name="sort"
          id="sort"
          value={sortOption}
          onChange={handleSortChange}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="date_desc">Date: Newest First</option>
          <option value="date_asc">Date: Oldest First</option>
          <option value="name_asc">Name: A → Z</option>
          <option value="name_desc">Name: Z → A</option>
        </select>
      </div>

      {/* Promo Grid */}
      <div className="max-w-5xl mx-auto">
        {paginatedPromos.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No promos found for the selected filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPromos?.map((promo) => {
              const promoTags = [
                ...(promo.field_categories_reference?.map((t) => ({
                  ...t,
                  style: "border-(--purple) bg-[rgba(84,39,133,.2)]",
                })) ?? []),
                ...(promo.field_card_type?.map((t) => ({
                  ...t,
                  style: "border-(--pink) bg-[rgba(178,0,110,0.2)]",
                })) ?? []),
                ...(promo.field_locations?.map((t) => ({
                  ...t,
                  style: "border-(--green) bg-[rgba(214,224,77,0.2)]",
                })) ?? []),
              ];

              return (
                <div
                  key={promo.nid}
                  className="relative border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col"
                >
                  <Link
                    href={`/promo/${promo.nid}`}
                    className="absolute inset-0 h-full w-full z-1"
                  ></Link>
                  {promo.field_featured_image && (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${promo.field_featured_image}`}
                      alt={promo.title}
                      height={0}
                      width={0}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4 grow flex flex-col gap-2">
                    <h3 className="font-semibold text-gray-800 text-lg leading-snug capitalize">
                      {promo.title}
                    </h3>
                    {promo.field_excerpt && (
                      <div
                        className="mb-2"
                        dangerouslySetInnerHTML={{
                          __html: promo.field_excerpt,
                        }}
                      />
                    )}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {promoTags.map((tag) => (
                        <span
                          key={tag.tid}
                          className={`border ${tag.style} px-4 py-1 rounded-full text-black text-[10px] text-nowrap`}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto">
                      <Link
                        href={`/promo/${promo.nid}`}
                        className="flex justify-center items-center gap-4 ew-bg-pink rounded-4xl py-2 px-4"
                      >
                        <span className="text-white font-semibold">
                          Check It Out
                        </span>
                        <ArrowRight color="white" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="max-w-5xl mx-auto mt-10 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-md border border-gray-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          >
            ← Prev
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
                <span key={`ellipsis-${page}`} className="px-2 text-gray-400">
                  …
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-md border text-sm transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-100 text-gray-700"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-md border border-gray-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </>
  );
}
