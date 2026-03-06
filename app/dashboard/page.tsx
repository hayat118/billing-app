'use client';

import React from 'react';
import Card from '@/src/components/Card';
import { 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/solid';

const DashboardPage = () => {
  // Mock data for dashboard
  const stats = [
    { name: 'Total Revenue', value: '$45,231.89', change: '+20.1%', changeType: 'positive', icon: CurrencyDollarIcon },
    { name: 'Subscriptions', value: '+2350', change: '+180.1%', changeType: 'positive', icon: UserGroupIcon },
    { name: 'Sales', value: '$12,263.42', change: '+19%', changeType: 'positive', icon: DocumentTextIcon },
    { name: 'Active Now', value: '573', change: '-12%', changeType: 'negative', icon: ArrowTrendingUpIcon },
  ];

  const recentInvoices = [
    { id: '#INV-001', customer: 'John Smith', amount: '$250.00', date: '2023-04-12', status: 'Paid' },
    { id: '#INV-002', customer: 'Sarah Johnson', amount: '$1,250.00', date: '2023-04-11', status: 'Pending' },
    { id: '#INV-003', customer: 'Mike Williams', amount: '$500.00', date: '2023-04-10', status: 'Overdue' },
    { id: '#INV-004', customer: 'Emma Davis', amount: '$75.00', date: '2023-04-09', status: 'Paid' },
  ];

  const StatCard = ({ stat }: { stat: typeof stats[0] }) => {
    const Icon = stat.icon;
    return (
      <Card className="flex items-center p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
            <Icon className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{stat.name}</p>
            <div className="flex items-baseline mt-1">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <span className={`ml-2 text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back! Here's what's happening with your billing today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Recent Invoices" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentInvoices.map((invoice, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === 'Paid' 
                          ? 'bg-green-100 text-green-800' 
                          : invoice.status === 'Pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;