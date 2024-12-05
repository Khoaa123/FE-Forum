"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PaginationPage = ({
  totalPages,
  pageNumber,
}: {
  totalPages: number;
  pageNumber: number;
}) => {
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show before and after current page
    const pages = [];

    // Always add page 1
    pages.push(1);

    // Calculate range around current page
    let rangeStart = Math.max(2, pageNumber - delta);
    let rangeEnd = Math.min(totalPages - 1, pageNumber + delta);

    // Add ellipsis after page 1 if needed
    if (rangeStart > 2) {
      pages.push("ellipsis1");
    }

    // Add pages around current page
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push("ellipsis2");
    }

    // Always add last page if not already included
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <Pagination className="my-2 justify-start">
      <PaginationContent>
        <PaginationItem>
          {pageNumber > 1 && (
            <PaginationPrevious
              href={`?page=${pageNumber - 1}`}
              className="rounded-sm border border-gray-200 bg-white hover:bg-gray-100 dark:border-gray-800 dark:bg-[#1d1f20]"
            />
          )}
        </PaginationItem>

        <div className="flex">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === "ellipsis1" || page === "ellipsis2" ? (
                <PaginationItem>
                  <PaginationEllipsis className="rounded-none border border-gray-200 bg-white p-0 dark:bg-[#1d1f20]" />
                </PaginationItem>
              ) : (
                <PaginationItem>
                  <PaginationLink
                    href={`?page=${page}`}
                    isActive={page === pageNumber}
                    className={`rounded-none border border-gray-200 dark:border-gray-800 ${
                      page === pageNumber
                        ? "bg-cyan-200 dark:bg-cyan-800"
                        : "bg-white hover:bg-cyan-200 "
                    }`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )}
            </React.Fragment>
          ))}
        </div>

        <PaginationItem>
          {pageNumber < totalPages && (
            <PaginationNext
              href={`?page=${pageNumber + 1}`}
              className="rounded-sm border border-gray-200 bg-white hover:bg-gray-100 dark:border-gray-800 dark:bg-[#1d1f20]"
            />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationPage;
