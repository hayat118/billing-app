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
import { Invoice, InvoiceItem } from '@/src/types/database';

const mockMedicines = [
  { id: 'm1', name: 'Paracetamol 650mg', price: 15.00, taxRate: 12, batchNumber: 'PR2309', expiryDate: '2027-12-31' },
  { id: 'm2', name: 'Amoxicillin 500mg', price: 45.00, taxRate: 12, batchNumber: 'AM2402', expiryDate: '2026-08-31' },
  { id: 'm3', name: 'Atorvastatin 10mg', price: 120.00, taxRate: 18, batchNumber: 'AT2311', expiryDate: '2027-05-31' },
  { id: 'm4', name: 'Metformin 500mg', price: 25.50, taxRate: 5, batchNumber: 'MF2308', expiryDate: '2026-11-30' },
  { id: 'm5', name: 'Ibuprofen 400mg', price: 18.00, taxRate: 12, batchNumber: 'IB2401', expiryDate: '2027-02-28' },
];

interface MedicineItemInput {
  id: string;
  medicineId: string;
  name: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discountPercentage: number;
}

interface InvoiceFormData {
  customerName: string;
  customerEmail: string;
  patientAge: string;
  patientGender: 'male' | 'female' | 'other';
  doctorName: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: MedicineItemInput[];
}

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState<any[]>([
    {
      id: '1',
      invoiceNumber: 'INV-001',
      customerName: 'John Smith',
      customerEmail: 'john@example.com',
      patientAge: 45,
      patientGender: 'male',
      doctorName: 'Dr. Robert Carter',
      subtotal: 300.00,
      taxAmount: 36.00,
      discount: 30.00,
      total: 306.00,
      amount: 306.00,
      date: '2023-04-12',
      dueDate: '2023-05-12',
      status: 'paid',
      items: [
        { id: 'i1', description: 'Amoxicillin 500mg', quantity: 2, unitPrice: 150.00, total: 300.00, batchNumber: 'AM2402', expiryDate: '2026-08-31', taxRate: 12 }
      ]
    },
    {
      id: '2',
      invoiceNumber: 'INV-002',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah@example.com',
      patientAge: 29,
      patientGender: 'female',
      doctorName: 'Dr. Amanda Brooks',
      subtotal: 120.00,
      taxAmount: 21.60,
      discount: 0.00,
      total: 141.60,
      amount: 141.60,
      date: '2023-04-11',
      dueDate: '2023-05-11',
      status: 'sent',
      items: [
        { id: 'i2', description: 'Atorvastatin 10mg', quantity: 1, unitPrice: 120.00, total: 120.00, batchNumber: 'AT2311', expiryDate: '2027-05-31', taxRate: 18 }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const emptyRow = (): MedicineItemInput => ({
    id: Date.now().toString() + Math.random().toString(),
    medicineId: '',
    name: '',
    batchNumber: '',
    expiryDate: '',
    quantity: 1,
    unitPrice: 0,
    taxRate: 12,
    discountPercentage: 0
  });

  const [formData, setFormData] = useState<InvoiceFormData>({
    customerName: '',
    customerEmail: '',
    patientAge: '',
    patientGender: 'male',
    doctorName: '',
    dueDate: '',
    status: 'draft',
    items: []
  });

  const [formErrors, setFormErrors] = useState<{
    customerName?: string;
    customerEmail?: string;
    dueDate?: string;
    doctorName?: string;
    items?: string;
  }>({});

  const handleOpenModal = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      patientAge: '',
      patientGender: 'male',
      doctorName: '',
      dueDate: '',
      status: 'draft',
      items: [emptyRow()]
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

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

  const addRow = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, emptyRow()]
    }));
  };

  const removeRow = (index: number) => {
    if (formData.items.length === 1) return;
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index: number, field: keyof MedicineItemInput, value: any) => {
    setFormData(prev => {
      const updatedItems = [...prev.items];
      const item = { ...updatedItems[index], [field]: value };

      if (field === 'medicineId') {
        const selected = mockMedicines.find(m => m.id === value);
        if (selected) {
          item.name = selected.name;
          item.unitPrice = selected.price;
          item.taxRate = selected.taxRate;
          item.batchNumber = selected.batchNumber;
          item.expiryDate = selected.expiryDate;
        }
      }

      updatedItems[index] = item;
      return { ...prev, items: updatedItems };
    });
  };

  const calculateTotals = (items: MedicineItemInput[]) => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    let grandTotal = 0;

    items.forEach(item => {
      const itemSubtotal = item.unitPrice * item.quantity;
      const itemDiscount = itemSubtotal * (item.discountPercentage / 100);
      const netPrice = itemSubtotal - itemDiscount;
      const itemTax = netPrice * (item.taxRate / 100);

      subtotal += itemSubtotal;
      totalDiscount += itemDiscount;
      totalTax += itemTax;
      grandTotal += (netPrice + itemTax);
    });

    return { subtotal, totalDiscount, totalTax, grandTotal };
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.doctorName && invoice.doctorName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || invoice.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const validateForm = () => {
    const newErrors: typeof formErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Patient / Customer name is required';
    }

    if (formData.customerEmail && !/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (!formData.doctorName.trim()) {
      newErrors.doctorName = 'Prescribing doctor name is required';
    }

    const hasInvalidItems = formData.items.some(
      item => !item.name || item.quantity <= 0 || item.unitPrice <= 0
    );

    if (hasInvalidItems) {
      newErrors.items = 'Please select a valid medicine, quantity, and price for all rows';
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
    const { subtotal, totalDiscount, totalTax, grandTotal } = calculateTotals(formData.items);

    const invoiceItems: InvoiceItem[] = formData.items.map((item, idx) => ({
      id: `i-${Date.now()}-${idx}`,
      productId: item.medicineId,
      description: item.name,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      total: (item.unitPrice * item.quantity * (1 - item.discountPercentage / 100) * (1 + item.taxRate / 100)),
      batchNumber: item.batchNumber,

      taxRate: item.taxRate,
      discountPercentage: item.discountPercentage
    }));

    const newInvoice: any = {
      id: Date.now().toString(),
      invoiceNumber: nextInvoiceNumber,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail || 'no-email@example.com',
      patientAge: formData.patientAge ? Number(formData.patientAge) : undefined,
      patientGender: formData.patientGender,
      doctorName: formData.doctorName,
      subtotal,
      taxAmount: totalTax,
      discount: totalDiscount,
      total: grandTotal,
      amount: grandTotal,
      date: today,
      dueDate: formData.dueDate,
      status: formData.status,
      items: invoiceItems
    };

    setInvoices([newInvoice, ...invoices]);
    setIsModalOpen(false);
  };

  const { subtotal, totalDiscount, totalTax, grandTotal } = calculateTotals(formData.items);

  const columns = [
    {
      key: 'invoiceNumber',
      title: 'Bill #',
      render: (value: string) => <div className="font-semibold text-blue-600">{value}</div>
    },
    {
      key: 'customerName',
      title: 'Patient Details',
      render: (value: string, record: any) => (
        <div>
          <div className="font-semibold text-gray-900">{value}</div>
          {record.patientAge && (
            <div className="text-gray-500 text-xs capitalize">
              Age: {record.patientAge} | {record.patientGender}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'doctorName',
      title: 'Prescribed By',
      render: (value: string) => <div className="text-gray-700 text-sm">{value || 'N/A'}</div>
    },
    {
      key: 'total',
      title: 'Net Amount',
      render: (value: number) => <div className="font-semibold text-gray-900">${value.toFixed(2)}</div>
    },
    {
      key: 'date',
      title: 'Billing Date',
      render: (value: string) => <div>{new Date(value).toLocaleDateString()}</div>
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(value)}`}>
          {getStatusText(value)}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-900" title="View details">
            <EyeIcon className="h-4 w-4" />
          </button>
          <button className="text-gray-600 hover:text-gray-900" title="Print/Edit">
            <PencilIcon className="h-4 w-4" />
          </button>
          <button className="text-red-600 hover:text-red-900" title="Delete">
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const totalInvoices = invoices.length;
  const totalAmountSum = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const paidInvoicesCount = invoices.filter(inv => inv.status === 'paid').length;
  const overdueInvoicesCount = invoices.filter(inv => inv.status === 'overdue').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medicine Invoicing</h1>
          <p className="text-sm text-gray-500">
            Create pharmacy invoices, track batch details, and manage medical billing records.
          </p>
        </div>
        <div>
          <Button
            variant="primary"
            icon={<PlusIcon className="h-4 w-4" />}
            onClick={handleOpenModal}
            className="w-full sm:w-auto"
          >
            Create Medicine Bill
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <DocumentTextIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Bills</p>
              <p className="text-2xl font-bold text-gray-900">{totalInvoices}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <CurrencyDollarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Net Sales</p>
              <p className="text-2xl font-bold text-gray-900">${totalAmountSum.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Paid Bills</p>
              <p className="text-2xl font-bold text-gray-900">{paidInvoicesCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-rose-100 text-rose-600">
              <ExclamationCircleIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Overdue Collections</p>
              <p className="text-2xl font-bold text-gray-900">{overdueInvoicesCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative rounded-md shadow-sm flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by Bill #, Patient, Doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Sent">Sent</option>
              <option value="Overdue">Overdue</option>
              <option value="Draft">Draft</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Invoices Table */}
      <Card title={`Billing Ledger (${filteredInvoices.length})`} className="overflow-hidden">
        <Table
          columns={columns}
          data={filteredInvoices}
          rowKey="id"
          onRowClick={(record) => console.log('View invoice details:', record)}
        />
      </Card>

      {/* Create Invoice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Expanded Width for dynamic table */}
            <div className="inline-block w-full max-w-5xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg relative z-[10000]">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">New Medicine Invoice</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Generate prescription bill and verify batch numbers</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {formErrors.items && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {formErrors.items}
                  </div>
                )}

                {/* Grid for Patient and Doctor details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className={`block w-full px-3 py-2 border ${formErrors.customerName ? 'border-red-500' : 'border-gray-300'
                        } rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="e.g. John Doe"
                    />
                    {formErrors.customerName && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                      Patient Age & Gender
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Age"
                        value={formData.patientAge}
                        onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                        className="w-1/3 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <select
                        value={formData.patientGender}
                        onChange={(e) => setFormData({ ...formData, patientGender: e.target.value as any })}
                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                      Prescribed By (Doctor Name) *
                    </label>
                    <input
                      type="text"
                      value={formData.doctorName}
                      onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                      className={`block w-full px-3 py-2 border ${formErrors.doctorName ? 'border-red-500' : 'border-gray-300'
                        } rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Dr. Smith"
                    />
                    {formErrors.doctorName && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.doctorName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                      Patient Email
                    </label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className={`block w-full px-3 py-2 border ${formErrors.customerEmail ? 'border-red-500' : 'border-gray-300'
                        } rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="patient@example.com"
                    />
                    {formErrors.customerEmail && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.customerEmail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                      Due Date *
                    </label>
                     <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className={`block w-full px-3 py-2 border ${formErrors.dueDate ? 'border-red-500' : 'border-gray-300'
                        } rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {formErrors.dueDate && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.dueDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                      Payment Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="draft">Draft / Unpaid</option>
                      <option value="sent">Sent / Pending</option>
                      <option value="paid">Paid</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Medicine Items Table */}
                <div className="border border-gray-200 rounded-lg overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase text-gray-500">Medicine *</th>
                        <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase text-gray-500 w-28">Batch No</th>
                        <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase text-gray-500 w-28">Expiry</th>
                        <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase text-gray-500 w-20">Qty</th>
                        <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase text-gray-500 w-24">MRP ($)</th>
                        <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase text-gray-500 w-20">GST %</th>
                        <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase text-gray-500 w-20">Disc %</th>
                        <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase text-gray-500 w-24">Total</th>
                        <th className="px-2 py-2.5 text-center text-xs font-semibold uppercase text-gray-500 w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {formData.items.map((item, index) => {
                        const itemSubtotal = item.unitPrice * item.quantity;
                        const itemDiscount = itemSubtotal * (item.discountPercentage / 100);
                        const netPrice = itemSubtotal - itemDiscount;
                        const itemTax = netPrice * (item.taxRate / 100);
                        const totalRowAmount = netPrice + itemTax;

                        return (
                           <tr key={item.id}>
                            <td className="p-2">
                              <select
                                value={item.medicineId}
                                onChange={(e) => handleItemChange(index, 'medicineId', e.target.value)}
                                className="block w-full px-2 py-1.5 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                              >
                                <option value="">-- Select Medicine --</option>
                                {mockMedicines.map(m => (
                                  <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                              </select>
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                value={item.batchNumber}
                                onChange={(e) => handleItemChange(index, 'batchNumber', e.target.value)}
                                className="block w-full px-2 py-1.5 border border-gray-300 rounded text-sm text-center text-gray-900"
                                placeholder="B-12"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                value={item.expiryDate}
                                onChange={(e) => handleItemChange(index, 'expiryDate', e.target.value)}
                                className="block w-full px-2 py-1.5 border border-gray-300 rounded text-sm text-center text-gray-900 bg-gray-50"
                                readOnly
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                                className="block w-full px-2 py-1.5 border border-gray-300 rounded text-sm text-center text-gray-900"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={item.unitPrice}
                                onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                                className="block w-full px-2 py-1.5 border border-gray-300 rounded text-sm text-right text-gray-900 bg-gray-50"
                                readOnly
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                value={item.taxRate}
                                onChange={(e) => handleItemChange(index, 'taxRate', Number(e.target.value))}
                                className="block w-full px-2 py-1.5 border border-gray-300 rounded text-sm text-center text-gray-900 bg-gray-50"
                                readOnly
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={item.discountPercentage}
                                onChange={(e) => handleItemChange(index, 'discountPercentage', Number(e.target.value))}
                                className="block w-full px-2 py-1.5 border border-gray-300 rounded text-sm text-center text-gray-900"
                              />
                            </td>
                            <td className="p-2 text-right text-sm font-semibold text-gray-900 pr-4">
                              ${totalRowAmount.toFixed(2)}
                            </td>
                            <td className="p-2 text-center">
                              <button
                                type="button"
                                onClick={() => removeRow(index)}
                                disabled={formData.items.length === 1}
                                className="text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:pointer-events-none"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-start gap-6">
                  <Button
                    type="button"
                    variant="outline"
                    icon={<PlusIcon className="h-4 w-4" />}
                    onClick={addRow}
                    size="sm"
                  >
                    Add Medicine
                  </Button>

                  {/* Calculations Display */}
                  <div className="w-80 bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-red-600">
                      <span>Discount:</span>
                      <span>-${totalDiscount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>GST / Tax:</span>
                      <span>+${totalTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-gray-900 border-t pt-2 mt-2">
                      <span>Grand Total:</span>
                      <span>${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Form Footer */}
                <div className="flex space-x-3 pt-6 border-t border-gray-200">
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
                    Save & Generate Bill
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