import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { Customer, Product, Invoice, Payment } from '@/src/types/database';

// Generic collection helpers
const createCollection = (collectionName: string) => {
  return {
    // Get all documents for a user
    getAll: async (userId: string) => {
      const q = query(
        collection(db, collectionName), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Get single document
    getById: async (id: string) => {
      const docRef = doc(db, collectionName, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
      }
      return null;
    },

    // Create new document
    create: async (data: any) => {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date())
      });
      return docRef.id;
    },

    // Update document
    update: async (id: string, data: any) => {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.fromDate(new Date())
      });
    },

    // Delete document
    delete: async (id: string) => {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    }
  };
};

// Customers service
export const customersService = {
  ...createCollection('customers'),
  
  // Get customer stats
  getStats: async (userId: string) => {
    const q = query(collection(db, 'customers'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const customers = snapshot.docs.map(doc => doc.data()) as Customer[];
    
    return {
      total: customers.length,
      active: customers.filter(c => c.status === 'active').length,
      inactive: customers.filter(c => c.status === 'inactive').length,
      pending: customers.filter(c => c.status === 'pending').length,
      totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0)
    };
  }
};

// Products service
export const productsService = {
  ...createCollection('products'),
  
  // Get product stats
  getStats: async (userId: string) => {
    const q = query(collection(db, 'products'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(doc => doc.data()) as Product[];
    
    return {
      total: products.length,
      active: products.filter(p => p.status === 'active').length,
      inventoryValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
      lowStock: products.filter(p => p.stock < 10 && p.stock > 0).length
    };
  }
};

// Invoices service
export const invoicesService = {
  ...createCollection('invoices'),
  
  // Get invoice stats
  getStats: async (userId: string) => {
    const q = query(collection(db, 'invoices'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const invoices = snapshot.docs.map(doc => doc.data()) as Invoice[];
    
    return {
      total: invoices.length,
      totalAmount: invoices.reduce((sum, inv) => sum + inv.total, 0),
      paid: invoices.filter(inv => inv.status === 'paid').length,
      overdue: invoices.filter(inv => inv.status === 'overdue').length,
      pending: invoices.filter(inv => inv.status === 'sent').length
    };
  }
};

// Payments service
export const paymentsService = {
  ...createCollection('payments'),
  
  // Get payment stats
  getStats: async (userId: string) => {
    const q = query(collection(db, 'payments'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const payments = snapshot.docs.map(doc => doc.data()) as Payment[];
    
    return {
      total: payments.length,
      totalRevenue: payments
        .filter(p => p.status === 'completed' || p.status === 'processing')
        .reduce((sum, p) => sum + p.amount, 0),
      completed: payments.filter(p => p.status === 'completed').length,
      pending: payments.filter(p => p.status === 'pending').length
    };
  }
};
