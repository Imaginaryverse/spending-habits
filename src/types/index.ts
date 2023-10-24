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
