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
  created_at: Date;
  title: string;
  comment: string;
  amount: number;
};

export type CreateSpendingItem = Omit<SpendingItem, "id">;

export type SpendingItemInput = {
  title: string;
  comment: string;
  category_id: string;
  amount: number;
  created_at: Dayjs | null;
};
