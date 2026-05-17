"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

interface CategoryCardProps {
  category: {
    slug: string;
    name: string;
    color: string;
    icon?: string;
  };
  thumb?: string;
  isSquare?: boolean;
}

export default function CategoryCard({
  category,
  thumb,
  isSquare,
}: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className={`group relative w-full h-full flex transition-all duration-300 overflow-hidden bg-white rounded-2xl
        flex-row justify-start items-center px-4
        ${
          isSquare
            ? "lg:flex-col lg:justify-center lg:items-center lg:p-3 lg:rounded-[2rem]"
            : "lg:flex-row lg:justify-start lg:items-center lg:px-5 lg:rounded-2xl"
        }`}
    >
      {thumb ? (
        <div
          className={`relative overflow-hidden shrink-0 rounded-xl
            w-12 h-12 mr-3
            ${isSquare ? "lg:w-24 lg:h-24 lg:mb-3 lg:mr-0 lg:rounded-2xl" : "lg:w-16 lg:h-16 lg:mr-4"}
          `}
        >
          <Image
            src={thumb}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            unoptimized
          />
        </div>
      ) : (
        <div
          className={`shrink-0 drop-shadow-md transform group-hover:rotate-12 transition-transform
            text-3xl mr-3
            ${isSquare ? "lg:text-6xl lg:mb-3 lg:mr-0" : "lg:text-4xl lg:mr-4"}
          `}
        >
          {category.icon || "🎮"}
        </div>
      )}
      <span
        className={`font-black uppercase tracking-tighter italic text-slate-800 truncate
          text-sm
          ${isSquare ? "lg:text-xl lg:leading-tight lg:text-center" : "lg:text-lg"}
        `}
      >
        {category.name}
      </span>
    </Link>
  );
}
