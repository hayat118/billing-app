'use client';

import React, { useState } from 'react';
import Card from '@/src/components/Card';
import Button from '@/src/components/Button';
import Input from '@/src/components/Input';
import Table from '@/src/components/Table';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  customerEmail: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
}

interface InvoiceFormData {
  customer: string;
  customerEmail: string;
  amount: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
}

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-001',
      customer: 'John Smith',
      customerEmail: 'john@example.com',
      amount: 250.00,
      date: '2023-04-12',
      dueDate: '2023-05-12',
      status: 'paid'
    },
    {
      id: '2',
      invoiceNumber: 'INV-002',
      customer: 'Sarah Johnson',
      customerEmail: 'sarah@example.com',
      amount: 1250.00,
      date: '2023-04-11',
      dueDate: '2023-05-11',
      status: 'sent'
    },
    {
      id: '3',
      invoiceNumber: 'INV-003',
      customer: 'Mike Williams',
      customerEmail: 'mike@example.com',
      amount: 500.00,
      date: '2023-04-10',
      dueDate: '2023-05-10',
      status: 'overdue'
    },
    {
      id: '4',
      invoiceNumber: 'INV-004',
      customer: 'Emma Davis',
      customerEmail: 'emma@example.com',
      amount: 75.00,
      date: '2023-04-09',
      dueDate: '2023-05-09',
      status: 'draft'
    },
    {
      id: '5',
      invoiceNumber: 'INV-005',
      customer: 'Robert Brown',
      customerEmail: 'robert@example.com',
      amount: 850.00,
      date: '2023-04-08',
      dueDate: '2023-05-08',
      status: 'cancelled'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<InvoiceFormData>({
    customer: '',
    customerEmail: '',
    amount: '',
    dueDate: '',
    status: 'draft'
  });
  const [formErrors, setFormErrors] = useState<{customer?: string; customerEmail?: string; amount?: string; dueDate?: string}>({});

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'sent': return 'Sent';
      case 'overdue': return 'Overdue';
      case 'draft': return 'Draft';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const newErrors: {customer?: string; customerEmail?: string; amount?: string; dueDate?: string} = {};
    
    if (!formData.customer.trim()) {
      newErrors.customer = 'Customer name is required';
    }
    
    if (!formData.customerEmail) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const nextInvoiceNumber = `INV-${String(invoices.length + 1).padStart(3, '0')}`;
    
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: nextInvoiceNumber,
      customer: formData.customer,
      customerEmail: formData.customerEmail,
      amount: Number(formData.amount),
      date: today,
      dueDate: formData.dueDate,
      status: formData.status
    };
    
    setInvoices([...invoices, newInvoice]);
    setIsModalOpen(false);
    setFormData({
      customer: '',
      customerEmail: '',
      amount: '',
      dueDate: '',
      status: 'draft'
    });
    setFormErrors({});
  };

  const handleInputChange = (field: keyof InvoiceFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const columns = [
    {
      key: 'invoiceNumber',
      title: 'Invoice #',
      render: (value: string, record: Invoice) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: 'customer',
      title: 'Customer',
      render: (value: string, record: Invoice) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-gray-500 text-sm">{record.customerEmail}</div>
        </div>
      )
    },
    {
      key: 'amount',
      title: 'Amount',
      render: (value: number) => (
        <div className="font-medium">${value.toFixed(2)}</div>
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
      key: 'dueDate',
      title: 'Due Date',
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
      key: 'actions',
      title: 'Actions',
      render: (_: any, record: Invoice) => (
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

  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track all your invoices
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button 
              variant="primary" 
              icon={<PlusIcon className="h-4 w-4" />}
              onClick={() => setIsModalOpen(true)}
            >
              Create Invoice
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <DocumentTextIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-semibold text-gray-900">{totalInvoices}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <CurrencyDollarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-semibold text-gray-900">${totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Paid Invoices</p>
              <p className="text-2xl font-semibold text-gray-900">{paidInvoices}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-100 text-red-600">
              <ExclamationCircleIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-semibold text-gray-900">{overdueInvoices}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative rounded-md shadow-sm flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-3">
            <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option>All Statuses</option>
              <option>Paid</option>
              <option>Sent</option>
              <option>Overdue</option>
              <option>Draft</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Invoices Table */}
      <Card title={`Invoices (${filteredInvoices.length})`}>
        <Table
          columns={columns}
          data={filteredInvoices}
          rowKey="id"
          onRowClick={(record) => console.log('View invoice:', record)}
        />
      </Card>

      {/* Create Invoice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal panel */}
            <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg relative z-[10000]">
              <div className="flex justify-between items-center mb-6 px-6 pt-6">
                <h3 className="text-xl font-bold text-gray-900">Create New Invoice</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-6">
                {/* Customer Name */}
                <div>
                  <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    id="customer"
                    value={formData.customer}
                    onChange={(e) => handleInputChange('customer', e.target.value)}
                    className={`block w-full px-3 py-2 border ${
                      formErrors.customer ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="John Doe"
                  />
                  {formErrors.customer && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.customer}</p>
                  )}
                </div>

                {/* Customer Email */}
                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Email *
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    className={`block w-full px-3 py-2 border ${
                      formErrors.customerEmail ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="john@example.com"
                  />
                  {formErrors.customerEmail && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.customerEmail}</p>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount ($)*
                  </label>
                  <input
                    type="number"
                    id="amount"
                    step="0.01"
                    min="0.01"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className={`block w-full px-3 py-2 border ${
                      formErrors.amount ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="0.00"
                  />
                  {formErrors.amount && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.amount}</p>
                  )}
                </div>

                {/* Due Date */}
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className={`block w-full px-3 py-2 border ${
                      formErrors.dueDate ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {formErrors.dueDate && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.dueDate}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as any)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                  >
                    Create Invoice
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesPage;