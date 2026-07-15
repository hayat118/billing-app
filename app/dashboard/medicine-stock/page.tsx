'use client';

import React, { useState } from 'react';
import Card from '@/src/components/Card';
import Table from '@/src/components/Table';
import { 
  MagnifyingGlassIcon,
  BeakerIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/solid';

interface StockItem {
  id: string;
  name: string;
  sku: string;
  category: 'Medicine' | 'Equipment';
  stock: number;
  location: string;
  unit: string;
  price: number;
}

const MedicineStockPage = () => {
  const [stockItems] = useState<StockItem[]>([
    { id: '1', name: 'Paracetamol 500mg', sku: 'MED-001', category: 'Medicine', stock: 250, location: 'Shelf A1', unit: 'Tablets', price: 0.15 },
    { id: '2', name: 'Ibuprofen 400mg', sku: 'MED-002', category: 'Medicine', stock: 180, location: 'Shelf A2', unit: 'Tablets', price: 0.25 },
    { id: '3', name: 'Amoxicillin 250mg Suspension', sku: 'MED-003', category: 'Medicine', stock: 95, location: 'Fridge B', unit: 'Bottles', price: 5.50 },
    { id: '4', name: 'Surgical Masks (Box of 50)', sku: 'EQP-001', category: 'Equipment', stock: 45, location: 'Cabinet C1', unit: 'Boxes', price: 12.00 },
    { id: '5', name: 'Sterile Gloves (Pairs)', sku: 'EQP-002', category: 'Equipment', stock: 350, location: 'Cabinet C2', unit: 'Pairs', price: 1.50 },
    { id: '6', name: 'Syringes 5ml with needle', sku: 'EQP-003', category: 'Equipment', stock: 500, location: 'Cabinet C3', unit: 'Units', price: 0.40 },
    { id: '7', name: 'Cetirizine 10mg', sku: 'MED-004', category: 'Medicine', stock: 320, location: 'Shelf A3', unit: 'Tablets', price: 0.20 },
    { id: '8', name: 'Aspirin 75mg', sku: 'MED-005', category: 'Medicine', stock: 150, location: 'Shelf A4', unit: 'Tablets', price: 0.10 },
    { id: '9', name: 'Digital Thermometer', sku: 'EQP-004', category: 'Equipment', stock: 24, location: 'Cabinet D1', unit: 'Units', price: 15.00 },
    { id: '10', name: 'Blood Pressure Monitor', sku: 'EQP-005', category: 'Equipment', stock: 12, location: 'Cabinet D2', unit: 'Units', price: 45.00 },
    { id: '11', name: 'Atorvastatin 20mg', sku: 'MED-006', category: 'Medicine', stock: 8, location: 'Shelf B1', unit: 'Tablets', price: 1.10 },
    { id: '12', name: 'Metformin 500mg', sku: 'MED-007', category: 'Medicine', stock: 5, location: 'Shelf B2', unit: 'Tablets', price: 0.18 },
    { id: '13', name: 'Stethoscope Premium', sku: 'EQP-006', category: 'Equipment', stock: 3, location: 'Cabinet D3', unit: 'Units', price: 85.00 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Medicine' | 'Equipment'>('All');
  const [stockFilter, setStockFilter] = useState<'All' | 'Low' | 'Normal'>('All');

  // Logic to determine low stock threshold (e.g. less than 15 units)
  const LOW_STOCK_THRESHOLD = 15;

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;

    let matchesStock = true;
    if (stockFilter === 'Low') {
      matchesStock = item.stock < LOW_STOCK_THRESHOLD;
    } else if (stockFilter === 'Normal') {
      matchesStock = item.stock >= LOW_STOCK_THRESHOLD;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  const totalMedicines = stockItems.filter(i => i.category === 'Medicine').length;
  const totalEquipment = stockItems.filter(i => i.category === 'Equipment').length;
  const lowStockCount = stockItems.filter(i => i.stock < LOW_STOCK_THRESHOLD).length;

  const columns = [
    {
      key: 'name',
      title: 'Item Detail',
      render: (name: string, record: StockItem) => (
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            record.category === 'Medicine' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
          }`}>
            {record.category === 'Medicine' ? (
              <BeakerIcon className="h-5 w-5" />
            ) : (
              <WrenchScrewdriverIcon className="h-5 w-5" />
            )}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{name}</div>
            <div className="text-xs text-gray-500 font-mono">{record.sku}</div>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      title: 'Category',
      render: (category: string) => (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
          category === 'Medicine' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
        }`}>
          {category}
        </span>
      )
    },
    {
      key: 'location',
      title: 'Location',
      render: (location: string) => (
        <div className="text-sm font-medium text-gray-600">{location}</div>
      )
    },
    {
      key: 'price',
      title: 'Unit Price',
      render: (price: number) => (
        <div className="text-sm font-medium text-gray-900">${price.toFixed(2)}</div>
      )
    },
    {
      key: 'stock',
      title: 'Available Stock',
      render: (stock: number, record: StockItem) => {
        const isLow = stock < LOW_STOCK_THRESHOLD;
        return (
          <div className="flex items-center space-x-2">
            <span className={`text-lg font-bold ${
              isLow ? 'text-rose-600 font-extrabold' : 'text-emerald-700 font-bold'
            }`}>
              {stock}
            </span>
            <span className="text-xs text-gray-400 font-medium">
              {record.unit}
            </span>
            {isLow ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                <ExclamationTriangleIcon className="mr-1 h-3.5 w-3.5 text-red-500 animate-pulse" />
                Low Stock
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                <CheckCircleIcon className="mr-1 h-3.5 w-3.5 text-green-500" />
                In Stock
              </span>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medicine & Equipment Stock</h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time tracking, stock search, and replenishment status for clinic inventory.
          </p>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <Card className="p-5 flex items-center bg-white border border-gray-200 shadow-sm">
          <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
            <BeakerIcon className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Medicine Types</p>
            <p className="text-2xl font-bold text-gray-900">{totalMedicines}</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center bg-white border border-gray-200 shadow-sm">
          <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
            <WrenchScrewdriverIcon className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Equipment Types</p>
            <p className="text-2xl font-bold text-gray-900">{totalEquipment}</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center bg-white border border-gray-200 shadow-sm">
          <div className="p-3 rounded-lg bg-red-100 text-red-600">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Low Stock Alerts</p>
            <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
          </div>
        </Card>
      </div>

      {/* Search and Filters Section */}
      <Card className="mb-6 bg-white shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search Field */}
          <div className="relative rounded-md shadow-sm flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search medicine name, SKU or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Category Filter */}
            <select
              className="block w-full md:w-auto pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-white"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
            >
              <option value="All">All Categories</option>
              <option value="Medicine">Medicine</option>
              <option value="Equipment">Equipment</option>
            </select>

            {/* Stock Level Filter */}
            <select
              className="block w-full md:w-auto pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-white"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
            >
              <option value="All">All Stock Levels</option>
              <option value="Low">Low Stock (&lt; {LOW_STOCK_THRESHOLD})</option>
              <option value="Normal">Normal Stock</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Main Stock Table */}
      <Card title={`Inventory Items (${filteredItems.length})`} className="shadow-sm border border-gray-200 bg-white">
        <Table
          columns={columns}
          data={filteredItems}
          rowKey="id"
        />
      </Card>
    </div>
  );
};

export default MedicineStockPage;
