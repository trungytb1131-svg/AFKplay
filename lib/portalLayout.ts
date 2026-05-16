/** Kích thước ô lưới — Logo / Rank / spacer */

export const fixedSidebarWrapperClass =
  "fixed z-[200] flex flex-col gap-[10px] top-[10px] left-[10px] w-[calc((100vw-40px)/3)] lg:top-[16px] lg:left-[16px] lg:w-[calc((100vw-180px)/17*2+10px)]";

export const fixedLogoSlotClass =
  "shrink-0 w-full h-[calc((100vw-40px)/3)] lg:h-[calc((100vw-180px)/17)]";

export const fixedRankSlotClass = fixedLogoSlotClass;

export const logoSpacerClass =
  "w-full min-h-[calc((100vw-40px)/3)] lg:min-h-[calc((100vw-180px)/17)]";

export const rankSpacerClass = logoSpacerClass;

export const miniGameSpacerClass = logoSpacerClass;

export const sidebarOffsetGridClass =
  "grid grid-cols-3 lg:grid-cols-17 gap-[10px] w-full";

export const sidebarOffsetSpacerClass =
  "col-span-1 lg:col-span-2 invisible shrink-0";

export const playSidebarAsideClass =
  "col-span-2 flex flex-col gap-[10px] shrink-0 pointer-events-none";
