import { Transaction } from "@/types";

export const getSeedData = (userId: string): Omit<Transaction, 'id'>[] => {
  const today = new Date();
  
  const getDate = (daysAgo: number) => {
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);
    return date.toISOString();
  };

  return [
    {
      description: "Monthly Salary",
      amount: 5500,
      category: "Salary",
      type: "Income",
      date: getDate(30),
      userId
    },
    {
      description: "App Apartment Rent",
      amount: 1800,
      category: "Housing",
      type: "Expense",
      date: getDate(28),
      userId
    },
    {
      description: "Grocery Shopping",
      amount: 120,
      category: "Groceries",
      type: "Expense",
      date: getDate(25),
      userId
    },
    {
      description: "Netflix Subscription",
      amount: 15.99,
      category: "Entertainment",
      type: "Expense",
      date: getDate(24),
      userId
    },
    {
      description: "Freelance UI Project",
      amount: 1200,
      category: "Freelance",
      type: "Income",
      date: getDate(20),
      userId
    },
    {
      description: "Starbucks Coffee",
      amount: 6.50,
      category: "Food & Drink",
      type: "Expense",
      date: getDate(18),
      userId
    },
    {
      description: "Electric Bill",
      amount: 85,
      category: "Utilities",
      type: "Expense",
      date: getDate(15),
      userId
    },
    {
      description: "Nike Store - Shoes",
      amount: 110,
      category: "Shopping",
      type: "Expense",
      date: getDate(12),
      userId
    },
    {
      description: "Internet Service",
      amount: 60,
      category: "Utilities",
      type: "Expense",
      date: getDate(10),
      userId
    },
    {
      description: "Weekly Groceries",
      amount: 145,
      category: "Groceries",
      type: "Expense",
      date: getDate(8),
      userId
    },
    {
      description: "Uber Ride",
      amount: 24,
      category: "Transportation",
      type: "Expense",
      date: getDate(6),
      userId
    },
    {
      description: "Dividend Payout",
      amount: 450,
      category: "Investment",
      type: "Income",
      date: getDate(5),
      userId
    },
    {
      description: "Dinner with Friends",
      amount: 95,
      category: "Food & Drink",
      type: "Expense",
      date: getDate(4),
      userId
    },
    {
      description: "Gym Membership",
      amount: 50,
      category: "Health",
      type: "Expense",
      date: getDate(2),
      userId
    },
    {
      description: "Amazon - Kindle Book",
      amount: 12.99,
      category: "Entertainment",
      type: "Expense",
      date: getDate(1),
      userId
    }
  ];
};
