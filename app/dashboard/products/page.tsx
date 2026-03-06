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
  CubeIcon,
  CurrencyDollarIcon,
  TagIcon,
  ChartBarIcon
} from '@heroicons/react/24/solid';

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  status: 'active' | 'inactive' | 'discontinued';
  taxRate: number;
  createdAt: string;
  updatedAt: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Web Design Service',
      sku: 'WD-001',
      description: 'Custom website design service including responsive layouts',
      category: 'Services',
      price: 1200.00,
      cost: 600.00,
      stock: 0,
      status: 'active',
      taxRate: 8.5,
      createdAt: '2023-01-15',
      updatedAt: '2023-04-10'
    },
    {
      id: '2',
      name: 'Logo Design Package',
      sku: 'LG-002',
      description: 'Complete branding package with logo variations',
      category: 'Design',
      price: 450.00,
      cost: 150.00,
      stock: 0,
      status: 'active',
      taxRate: 8.5,
      createdAt: '2023-02-20',
      updatedAt: '2023-04-05'
    },
    {
      id: '3',
      name: 'Premium Hosting',
      sku: 'HOST-003',
      description: 'Cloud hosting with 99.9% uptime guarantee',
      category: 'Hosting',
      price: 49.99,
      cost: 15.00,
      stock: 1000,
      status: 'active',
      taxRate: 5.0,
      createdAt: '2023-03-10',
      updatedAt: '2023-04-12'
    },
    {
      id: '4',
      name: 'SEO Optimization',
      sku: 'SEO-004',
      description: 'Complete SEO package for improved rankings',
      category: 'Marketing',
      price: 750.00,
      cost: 200.00,
      stock: 0,
      status: 'inactive',
      taxRate: 8.5,
      createdAt: '2023-01-25',
      updatedAt: '2023-03-28'
    },
    {
      id: '5',
      name: 'Basic Business Plan',
      sku: 'BP-005',
      description: 'Essential business plan with basic features',
      category: 'Software',
      price: 29.99,
      cost: 8.00,
      stock: 500,
      status: 'active',
      taxRate: 7.0,
      createdAt: '2023-04-01',
      updatedAt: '2023-04-14'
    },
    {
      id: '6',
      name: 'Consultation Hour',
      sku: 'CONS-006',
      description: 'One hour of expert consultation',
      category: 'Services',
      price: 150.00,
      cost: 50.00,
      stock: 0,
      status: 'active',
      taxRate: 8.5,
      createdAt: '2023-03-15',
      updatedAt: '2023-04-08'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'discontinued': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      case 'discontinued': return 'Discontinued';
      default: return status;
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const columns = [
    {
      key: 'name',
      title: 'Product',
      render: (value: string, record: Product) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-gray-500 text-sm">{record.sku}</div>
        </div>
      )
    },
    {
      key: 'category',
      title: 'Category',
      render: (value: string) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: 'price',
      title: 'Price',
      render: (value: number) => (
        <div className="font-medium">${value.toFixed(2)}</div>
      )
    },
    {
      key: 'cost',
      title: 'Cost',
      render: (value: number) => (
        <div className="text-gray-900">${value.toFixed(2)}</div>
      )
    },
    {
      key: 'profitMargin',
      title: 'Profit',
      render: (_: any, record: Product) => {
        const profit = record.price - record.cost;
        const margin = ((profit / record.price) * 100).toFixed(1);
        return (
          <div>
            <div className="font-medium">${profit.toFixed(2)}</div>
            <div className="text-sm text-gray-500">{margin}%</div>
          </div>
        );
      }
    },
    {
      key: 'stock',
      title: 'Stock',
      render: (value: number) => (
        <div className={`font-medium ${value < 10 ? 'text-red-600' : 'text-gray-900'}`}>
          {value}
        </div>
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
      render: (_: any, record: Product) => (
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

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const totalInventoryValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const lowStockItems = products.filter(p => p.stock < 10 && p.stock > 0).length;

  // Get unique categories for the filter dropdown
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products & Services</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your products and services inventory
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button variant="primary" icon={<PlusIcon className="h-4 w-4" />}>
              Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <CubeIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-semibold text-gray-900">{totalProducts}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <TagIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Items</p>
              <p className="text-2xl font-semibold text-gray-900">{activeProducts}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <CurrencyDollarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inventory Value</p>
              <p className="text-2xl font-semibold text-gray-900">${totalInventoryValue.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
              <ChartBarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-semibold text-gray-900">{lowStockItems}</p>
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
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select 
              className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select 
              className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card title={`Products & Services (${filteredProducts.length})`}>
        <Table
          columns={columns}
          data={filteredProducts}
          rowKey="id"
          onRowClick={(record) => console.log('View product:', record)}
        />
      </Card>
    </div>
  );
};

export default ProductsPage;