import { Dayjs } from "dayjs";

export const QUERY_KEY = {
  spending_items: "spending_items",
  spending_item: "spending_item",
  spending_categories: "spending_categories",
  user_profiles: "user_profiles",
} as const;

export type UserProfile = {
  id: string;
  user_id: string;
  name: string | null;
  monthly_spending_limit: number;
};

export type SpendingCategory = {
  id: number;
  name: string;
  description: string;
};

export type SpendingItem = {
  id: string;
  user_id: string;
  category_id: SpendingCategory["id"];
  category_name: SpendingCategory["name"];
  created_at: Date;
  title: string;
  comment: string;
  amount: number;
};

export type CreateSpendingItem = Omit<SpendingItem, "id" | "user_id">;

export type SpendingItemInput = {
  title: string;
  comment: string;
  category_id: SpendingCategory["id"];
  amount: number;
  created_at: Dayjs | null;
};
