"use client";
import React from "react";
import Link from "next/link";

interface CategoryCardProps {
  category: {
    slug: string;
    name: string;
    color: string;
    icon?: string;
  };
  /** PC: true = ô vuông (flex-col), false = chữ nhật ngang (flex-row).
   *  Mobile: luôn hiển thị dạng chữ nhật ngang (flex-row) bất kể giá trị này. */
  isSquare?: boolean;
}

export default function CategoryCard({
  category,
  isSquare,
}: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className={`group relative w-full h-full flex transition-all duration-300 shadow-sm border-b-4 border-black/10 overflow-hidden
        flex-row justify-start items-center px-4 rounded-2xl
        ${
          isSquare
            ? "lg:flex-col lg:justify-center lg:items-center lg:p-2 lg:rounded-[2rem]"
            : "lg:flex-row lg:justify-start lg:items-center lg:px-4 lg:rounded-2xl"
        }
      `}
      style={{ backgroundColor: category.color }}
    >
      <div
        className={`text-white drop-shadow-md transform group-hover:rotate-12 transition-transform
          text-2xl mr-3
          ${isSquare ? "lg:text-4xl lg:mb-2 lg:mr-0" : "lg:text-2xl lg:mr-3"}
        `}
      >
        {category.icon || "🎮"}
      </div>
      <span
        className={`text-white font-black uppercase tracking-tighter italic truncate
          text-[10px]
          ${isSquare ? "lg:text-[14px] lg:leading-tight lg:text-center" : "lg:text-[13px]"}
        `}
      >
        {category.name}
      </span>
    </Link>
  );
}
