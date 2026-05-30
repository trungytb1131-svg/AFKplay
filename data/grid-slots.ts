/**
 * Grid slot configuration.
 * Mỗi slot được đánh số 1, 2, 3... với size cố định.
 * PIN_MAP: chủ web gán game vào slot, game khác tự đẩy xuống.
 */
export interface GridSlot {
  num: number;
  size: "3x3" | "2x2" | "1x1";
  mSize: "1x1" | "2x2";
  colStart?: number;
}

export const GRID_SLOTS: GridSlot[] = (() => {
  const slots: GridSlot[] = [];
  const colStarts = [3, 6, 9, 12, 15];
  for (let i = 0; i < 5; i++) {
    slots.push({
      num: i + 1,
      size: "3x3",
      mSize: "1x1",
      colStart: colStarts[i],
    });
  }
  for (let i = 6; i <= 85; i++) {
    slots.push({ num: i, size: "2x2", mSize: "1x1" });
  }
  for (let i = 86; i <= 100; i++) {
    slots.push({ num: i, size: "1x1", mSize: "1x1" });
  }
  return slots;
})();

export const BATCH3_MOBILE_2X2 = new Set([
  "blueprint-idle",
  "chrome-dino",
  "feed-the-flames",
  "google-the-game",
  "island-not-found",
  "offline-paradise",
  "point-generation",
  "quickclick",
  "rs-clicker",
  "society-fail",
  "tower-defense",
]);

/** ⭐ CHỦ WEB: muốn game nào đứng slot nào thì sửa ở đây */
export const PIN_MAP: Record<number, string> = {
  // 1: "adventures-with-anxiety",
  // 2: "2048",
  // 3: "chrome-dino",
  6: "we-become-what-we-behold",
};

export function getSlotClasses(slot: GridSlot): string {
  let c = "relative ";
  c +=
    slot.mSize === "2x2" ? "col-span-2 row-span-2 " : "col-span-1 row-span-1 ";
  if (slot.size === "3x3" && slot.colStart != null) {
    c += `lg:col-span-3 lg:row-span-3 lg:col-start-${slot.colStart} lg:row-start-1 `;
  } else if (slot.size === "3x3") {
    c += "lg:col-span-3 lg:row-span-3 ";
  } else if (slot.size === "2x2") {
    c += "lg:col-span-2 lg:row-span-2 ";
  } else {
    c += "lg:col-span-1 lg:row-span-1 ";
  }
  return c;
}
