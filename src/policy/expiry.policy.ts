import { CategoryGroup } from "@prisma/client";

// 식품 유형별 소비기한 (일 단위)
export const ShelfLifeDaysByCategory: Record<CategoryGroup, number> = {
  MEAT: 27,          // 육류
  SEAFOOD: 60,       // 수산물
  NOODLES: 45,       // 면류
  VEGETABLES: 14,    // 채소류
  DAIRY: 28,         // 유제품
  EGGS: 25,          // 난류
  PROCESSED: 60,     // 가공식품
  SAUCES: 90,        // 소스류
  SEASONINGS: 120,   // 조미료
  SOUPS: 30,         // 탕/국류
  BROTH_BASE: 30,    // 육수 베이스
};

// 소비기한 계산 함수
export const calcExpiryDate = (group: CategoryGroup, storeDate: Date): Date => {
  const days = ShelfLifeDaysByCategory[group] ?? 30;
  const expiry = new Date(storeDate);
  expiry.setDate(storeDate.getDate() + days);
  return expiry;
};