"use client";
import React from "react";

export default function GameGridContainer({ children, className }: any) {
  return (
    <div className={className || "grid grid-cols-3 md:grid-cols-6 gap-3 p-3 min-h-[200px]"}>
      {children}
    </div>
  );
}