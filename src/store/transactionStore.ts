import { create } from 'zustand';
import { 
  collection, addDoc, updateDoc, deleteDoc, getDocs, 
  query, where, orderBy, doc, onSnapshot, Unsubscribe 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Transaction, TransactionType } from '@/types';
import { writeBatch } from 'firebase/firestore';
import { getSeedData } from '@/utils/mockData';
import toast from 'react-hot-toast';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  searchQuery: string;
  filterType: TransactionType | "All";
  
  setSearchQuery: (query: string) => void;
  setFilterType: (type: TransactionType | "All") => void;
  
  loadTransactions: (userId: string, role: string) => Unsubscribe;
  addTransaction: (userId: string, data: Omit<Transaction, "id" | "userId" | "createdAt">) => Promise<void>;
  editTransaction: (transactionId: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (transactionId: string) => Promise<void>;
  seedMockData: (userId: string) => Promise<void>;
  clearTransactions: () => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  isLoading: true,
  searchQuery: "",
  filterType: "All",
  
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilterType: (filterType) => set({ filterType }),
  
  loadTransactions: (userId: string, role: string) => {
    set({ isLoading: true });
    const transactionsRef = collection(db, 'transactions');
    
    // Admin sees ALL transactions; User sees only their own
    const q = role === "admin"
      ? query(transactionsRef, orderBy("createdAt", "desc"))
      : query(transactionsRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs: Transaction[] = snapshot.docs.map(doc => ({
        id: doc.id,
        userId: doc.data().userId ?? "",
        amount: doc.data().amount ?? 0,
        date: doc.data().date ?? "",
        category: doc.data().category ?? "",
        type: doc.data().type ?? "Expense",
        description: doc.data().description ?? "",
        createdAt: doc.data().createdAt ?? "",
      }));
      set({ transactions: txs, isLoading: false });
    }, (error) => {
      console.error("Error loading transactions:", error);
      set({ isLoading: false });
      toast.error("Failed to load transactions");
    });
    
    return unsubscribe;
  },
  
  addTransaction: async (userId, data) => {
    try {
      await addDoc(collection(db, 'transactions'), {
        ...data,
        userId,
        createdAt: new Date().toISOString(),
      });
      toast.success("Transaction added successfully!");
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Failed to add transaction");
    }
  },
  
  editTransaction: async (transactionId, data) => {
    try {
      const { id, ...updateData } = data as Transaction & { id?: string };
      await updateDoc(doc(db, 'transactions', transactionId), updateData);
      toast.success("Transaction updated!");
    } catch (error) {
      console.error("Error editing transaction:", error);
      toast.error("Failed to update transaction");
    }
  },
  
  deleteTransaction: async (transactionId) => {
    try {
      await deleteDoc(doc(db, 'transactions', transactionId));
      toast.success("Transaction deleted!");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    }
  },

  seedMockData: async (userId) => {
    const loadingToast = toast.loading("Seeding mock data...");
    try {
      const batch = writeBatch(db);
      const seedData = getSeedData(userId);
      const transactionsRef = collection(db, 'transactions');

      seedData.forEach((data) => {
        const newRef = doc(transactionsRef);
        batch.set(newRef, {
          ...data,
          createdAt: new Date().toISOString()
        });
      });

      await batch.commit();
      toast.success("Sample data imported! Dashboard updated.", { id: loadingToast });
    } catch (error) {
      console.error("Error seeding data:", error);
      toast.error("Failed to seed data.", { id: loadingToast });
    }
  },
  
  clearTransactions: () => set({ transactions: [], isLoading: false }),
}));
