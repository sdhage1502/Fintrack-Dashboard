import { 
  collection, doc, addDoc, updateDoc, deleteDoc, 
  getDocs, getDoc, query, where, orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
import { Transaction } from '@/types';

// ─── Transaction Operations ───

export const addTransaction = async (
  userId: string, 
  data: Omit<Transaction, "id" | "userId" | "createdAt">
) => {
  const transactionsRef = collection(db, 'transactions');
  const newTransaction = {
    ...data,
    userId,
    createdAt: new Date().toISOString()
  };
  
  const docRef = await addDoc(transactionsRef, newTransaction);
  return { id: docRef.id, ...newTransaction };
};

export const getUserTransactions = async (userId: string) => {
  const transactionsRef = collection(db, 'transactions');
  const q = query(
    transactionsRef, 
    where("userId", "==", userId), 
    orderBy("createdAt", "desc")
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => ({
    id: d.id,
    ...d.data()
  })) as Transaction[];
};

export const getAllTransactions = async () => {
  const transactionsRef = collection(db, 'transactions');
  const q = query(transactionsRef, orderBy("createdAt", "desc"));
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => ({
    id: d.id,
    ...d.data()
  })) as Transaction[];
};

export const updateTransaction = async (
  transactionId: string, 
  data: Partial<Omit<Transaction, "id">>
) => {
  const transactionRef = doc(db, 'transactions', transactionId);
  await updateDoc(transactionRef, data);
};

export const deleteTransaction = async (transactionId: string) => {
  const transactionRef = doc(db, 'transactions', transactionId);
  await deleteDoc(transactionRef);
};

// ─── User Operations ───

export const getUserProfile = async (userId: string) => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    return { uid: userDoc.id, ...userDoc.data() };
  }
  return null;
};

export const getAllUsers = async () => {
  const snapshot = await getDocs(collection(db, 'users'));
  return snapshot.docs.map(d => ({
    uid: d.id,
    ...d.data()
  }));
};

export const updateUserRole = async (userId: string, role: 'admin' | 'user') => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { role });
};
