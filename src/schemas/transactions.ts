import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z.coerce.number().positive({ message: "Amount must be a positive number" }),
  category: z.string().min(1, { message: "Category is required" }),
  type: z.enum(["income", "expense"]),
  date: z.string().min(1, { message: "Date is required" }),
  description: z.string().optional(),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
