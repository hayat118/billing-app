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
  UserGroupIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/solid';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  status: 'active' | 'inactive' | 'pending';
  totalInvoices: number;
  totalSpent: number;
  lastActivity: string;
  createdAt: string;
}

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      company: 'Tech Solutions Inc.',
      address: '123 Main St, New York, NY 10001',
      status: 'active',
      totalInvoices: 12,
      totalSpent: 3250.00,
      lastActivity: '2023-04-15',
      createdAt: '2023-01-15'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      phone: '+1 (555) 987-6543',
      company: 'Global Enterprises',
      address: '456 Oak Avenue, Los Angeles, CA 90210',
      status: 'active',
      totalInvoices: 8,
      totalSpent: 1850.75,
      lastActivity: '2023-04-14',
      createdAt: '2023-02-20'
    },
    {
      id: '3',
      name: 'Mike Williams',
      email: 'mike.w@startup.io',
      phone: '+1 (555) 456-7890',
      company: 'Innovation Labs',
      address: '789 Pine Road, Chicago, IL 60601',
      status: 'pending',
      totalInvoices: 3,
      totalSpent: 450.00,
      lastActivity: '2023-04-10',
      createdAt: '2023-04-01'
    },
    {
      id: '4',
      name: 'Emma Davis',
      email: 'emma.davis@business.com',
      phone: '+1 (555) 321-0987',
      company: 'Premium Services LLC',
      address: '321 Elm Street, Miami, FL 33101',
      status: 'inactive',
      totalInvoices: 15,
      totalSpent: 4200.50,
      lastActivity: '2023-03-28',
      createdAt: '2022-11-10'
    },
    {
      id: '5',
      name: 'Robert Brown',
      email: 'robert.b@consulting.com',
      phone: '+1 (555) 654-3210',
      company: 'Business Consulting Group',
      address: '654 Maple Drive, Seattle, WA 98101',
      status: 'active',
      totalInvoices: 7,
      totalSpent: 1950.25,
      lastActivity: '2023-04-12',
      createdAt: '2023-01-25'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      case 'pending': return 'Pending';
      default: return status;
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'name',
      title: 'Customer',
      render: (value: string, record: Customer) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-gray-500 text-sm">{record.company}</div>
        </div>
      )
    },
    {
      key: 'email',
      title: 'Contact',
      render: (value: string, record: Customer) => (
        <div>
          <div className="text-gray-900">{value}</div>
          <div className="text-gray-500 text-sm">{record.phone}</div>
        </div>
      )
    },
    {
      key: 'totalSpent',
      title: 'Total Spent',
      render: (value: number) => (
        <div className="font-medium">${value.toFixed(2)}</div>
      )
    },
    {
      key: 'totalInvoices',
      title: 'Invoices',
      render: (value: number) => (
        <div className="font-medium text-gray-900">{value}</div>
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
      key: 'lastActivity',
      title: 'Last Activity',
      render: (value: string) => (
        <div>{new Date(value).toLocaleDateString()}</div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, record: Customer) => (
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

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const pendingCustomers = customers.filter(c => c.status === 'pending').length;

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your customer relationships and track their activity
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button variant="primary" icon={<PlusIcon className="h-4 w-4" />}>
              Add Customer
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <UserGroupIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-semibold text-gray-900">{totalCustomers}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Customers</p>
              <p className="text-2xl font-semibold text-gray-900">{activeCustomers}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <CurrencyDollarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
              <XCircleIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingCustomers}</p>
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
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-3">
            <select 
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Customers Table */}
      <Card title={`Customers (${filteredCustomers.length})`}>
        <Table
          columns={columns}
          data={filteredCustomers}
          rowKey="id"
          onRowClick={(record) => console.log('View customer:', record)}
        />
      </Card>
    </div>
  );
};

export default CustomersPage;