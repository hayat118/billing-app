// User types
export interface AppUser {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Customer types
export interface Customer {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  status: 'active' | 'inactive' | 'pending';
  totalInvoices: number;
  totalSpent: number;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Product types
export interface Product {
  id: string;
  userId: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  status: 'active' | 'inactive' | 'discontinued';
  taxRate: number;
  createdAt: Date;
  updatedAt: Date;
}

// Invoice types
export interface InvoiceItem {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  userId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  total: number;
  amount: number; // For backward compatibility
  date: Date;
  dueDate: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Payment types
export interface Payment {
  id: string;
  userId: string;
  transactionId: string;
  customerId: string;
  customerName: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded' | 'processing';
  method: 'credit_card' | 'bank_transfer' | 'paypal' | 'check' | 'cash';
  date: Date;
  dueDate?: Date;
  gateway: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Settings types
export interface CompanySettings {
  id: string;
  userId: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  taxId: string;
  website: string;
  logoUrl?: string;
  updatedAt: Date;
}

export interface BillingSettings {
  id: string;
  userId: string;
  currency: string;
  taxRate: number;
  invoicePrefix: string;
  invoiceNumbering: 'sequential' | 'chronological' | 'custom';
  paymentTerms: number;
  lateFeePercentage: number;
  autoSendReminders: boolean;
  reminderDays: number;
  updatedAt: Date;
}
