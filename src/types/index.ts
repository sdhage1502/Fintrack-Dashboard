export type Role = "admin" | "user" | "viewer";
export type TransactionType = "Income" | "Expense";

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  date: string; // ISO String format
  category: string;
  type: TransactionType;
  description: string;
  createdAt?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}

export interface DailyBalance {
  date: string;
  balance: number;
}
