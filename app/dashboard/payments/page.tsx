'use client';

import React, { useState } from 'react';
import Card from '@/src/components/Card';
import Button from '@/src/components/Button';
import Table from '@/src/components/Table';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/solid';

interface Payment {
  id: string;
  transactionId: string;
  customerName: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded' | 'processing';
  method: 'credit_card' | 'bank_transfer' | 'paypal' | 'check' | 'cash';
  date: string;
  dueDate?: string;
  gateway: string;
  notes?: string;
}

const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      transactionId: 'TXN-001',
      customerName: 'John Smith',
      invoiceNumber: 'INV-001',
      amount: 250.00,
      currency: 'USD',
      status: 'completed',
      method: 'credit_card',
      date: '2023-04-12',
      gateway: 'Stripe',
      notes: 'Payment for web design services'
    },
    {
      id: '2',
      transactionId: 'TXN-002',
      customerName: 'Sarah Johnson',
      invoiceNumber: 'INV-002',
      amount: 1250.00,
      currency: 'USD',
      status: 'processing',
      method: 'bank_transfer',
      date: '2023-04-11',
      dueDate: '2023-04-18',
      gateway: 'Bank Transfer',
      notes: 'Monthly subscription payment'
    },
    {
      id: '3',
      transactionId: 'TXN-003',
      customerName: 'Mike Williams',
      invoiceNumber: 'INV-003',
      amount: 500.00,
      currency: 'USD',
      status: 'pending',
      method: 'paypal',
      date: '2023-04-10',
      dueDate: '2023-04-17',
      gateway: 'PayPal',
      notes: 'Service contract payment'
    },
    {
      id: '4',
      transactionId: 'TXN-004',
      customerName: 'Emma Davis',
      invoiceNumber: 'INV-004',
      amount: 75.00,
      currency: 'USD',
      status: 'failed',
      method: 'credit_card',
      date: '2023-04-09',
      gateway: 'Stripe',
      notes: 'Insufficient funds'
    },
    {
      id: '5',
      transactionId: 'TXN-005',
      customerName: 'Robert Brown',
      invoiceNumber: 'INV-005',
      amount: 850.00,
      currency: 'USD',
      status: 'refunded',
      method: 'credit_card',
      date: '2023-04-08',
      gateway: 'Stripe',
      notes: 'Refund issued for cancelled service'
    },
    {
      id: '6',
      transactionId: 'TXN-006',
      customerName: 'Lisa Wilson',
      invoiceNumber: 'INV-006',
      amount: 320.50,
      currency: 'USD',
      status: 'completed',
      method: 'check',
      date: '2023-04-07',
      gateway: 'Check',
      notes: 'Quarterly maintenance fee'
    },
    {
      id: '7',
      transactionId: 'TXN-007',
      customerName: 'David Miller',
      invoiceNumber: 'INV-007',
      amount: 1500.00,
      currency: 'USD',
      status: 'completed',
      method: 'bank_transfer',
      date: '2023-04-06',
      gateway: 'Bank Transfer',
      notes: 'Annual subscription payment'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      case 'failed': return 'Failed';
      case 'refunded': return 'Refunded';
      case 'processing': return 'Processing';
      default: return status;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card': return <CreditCardIcon className="h-4 w-4" />;
      case 'bank_transfer': return <BanknotesIcon className="h-4 w-4" />;
      case 'paypal': return <ArrowDownTrayIcon className="h-4 w-4" />;
      case 'check': return <ArrowUpTrayIcon className="h-4 w-4" />;
      case 'cash': return <CurrencyDollarIcon className="h-4 w-4" />;
      default: return <CreditCardIcon className="h-4 w-4" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.gateway.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const columns = [
    {
      key: 'transactionId',
      title: 'Transaction ID',
      render: (value: string) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: 'customerName',
      title: 'Customer',
      render: (value: string, record: Payment) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-gray-500 text-sm">{record.invoiceNumber}</div>
        </div>
      )
    },
    {
      key: 'amount',
      title: 'Amount',
      render: (value: number, record: Payment) => (
        <div className="font-medium">${value.toFixed(2)} {record.currency}</div>
      )
    },
    {
      key: 'method',
      title: 'Method',
      render: (value: string) => (
        <div className="flex items-center">
          {getMethodIcon(value)}
          <span className="ml-2 capitalize">{value.replace('_', ' ')}</span>
        </div>
      )
    },
    {
      key: 'date',
      title: 'Date',
      render: (value: string) => (
        <div>{new Date(value).toLocaleDateString()}</div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: string) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(value)}`}>
          {getStatusText(value)}
        </span>
      )
    },
    {
      key: 'gateway',
      title: 'Gateway',
      render: (value: string) => (
        <div className="capitalize">{value}</div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, record: Payment) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-900">
            <EyeIcon className="h-4 w-4" />
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            <PencilIcon className="h-4 w-4" />
          </button>
          <button className="text-red-600 hover:text-red-900">
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const totalPayments = payments.length;
  const completedPayments = payments.filter(p => p.status === 'completed').length;
  const totalRevenue = payments
    .filter(p => p.status === 'completed' || p.status === 'processing')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingPayments = payments.filter(p => p.status === 'pending').length;

  // Get unique payment methods for the filter dropdown
  const methods = ['all', ...Array.from(new Set(payments.map(p => p.method)))];

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track and manage all payment transactions
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button variant="primary" icon={<PlusIcon className="h-4 w-4" />}>
              Record Payment
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <CreditCardIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-semibold text-gray-900">{totalPayments}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <CurrencyDollarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <BanknotesIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{completedPayments}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
              <ArrowDownTrayIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingPayments}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative rounded-md shadow-sm flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select 
              className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <select 
              className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
            >
              <option value="all">All Methods</option>
              {methods.slice(1).map(method => (
                <option key={method} value={method}>{method.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Payments Table */}
      <Card title={`Payments (${filteredPayments.length})`}>
        <Table
          columns={columns}
          data={filteredPayments}
          rowKey="id"
          onRowClick={(record) => console.log('View payment:', record)}
        />
      </Card>
    </div>
  );
};

export default PaymentsPage;