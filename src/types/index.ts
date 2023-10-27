import { Dayjs } from "dayjs";

export type UserProfile = {
  id: string;
  user_id: string;
  name: string | null;
  monthly_spending_limit: number;
};

export type SpendingCategory = {
  id: string;
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

export type CreateSpendingItem = Omit<SpendingItem, "id" | "category_name">;

export type SpendingItemInput = {
  title: string;
  comment: string;
  category_id: SpendingCategory["id"];
  amount: number;
  created_at: Dayjs | null;
};
