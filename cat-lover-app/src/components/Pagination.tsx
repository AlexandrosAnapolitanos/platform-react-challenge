"use client";

import { useEffect, useState } from "react";

export default function Pagination({
  length,
  limit,
  handler,
  paginationNumber,
}: {
  length: number;
  limit: number;
  handler: (num: number) => void;
  paginationNumber: number;
}) {
  const [pages, setPages] = useState<number[]>([]);

  useEffect(() => {
    const totalPages = Math.ceil(length / limit);
    setPages(Array.from({ length: totalPages }, (_, i) => i + 1));

    if (paginationNumber > totalPages) {
      handler(Math.max(totalPages, 1)); // Go to the last page or 1 if no pages left
    }
  }, [length, limit, paginationNumber, handler]);

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen">
        <ol className="flex flex-row justify-center items-center space-x-4">
          {pages.map((num) => {
            return (
              <li
                key={num}
                className={`border border-white ${paginationNumber === num ? "border-4" : "border-2"} flex justify-center items-center w-[30px] h-[30px] cursor-pointer`}
                onClick={() => handler(num)}
              >
                <div>{num}</div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
