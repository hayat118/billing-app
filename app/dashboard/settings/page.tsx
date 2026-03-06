'use client';

import React, { useState } from 'react';
import Card from '@/src/components/Card';
import Button from '@/src/components/Button';
import Input from '@/src/components/Input';
import { 
  CogIcon,
  UserCircleIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  BellIcon,
  ShieldCheckIcon,
  SwatchIcon,
  GlobeAltIcon,
  CheckIcon
} from '@heroicons/react/24/solid';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  // Form states
  const [companySettings, setCompanySettings] = useState({
    companyName: 'Your Company Name',
    email: 'contact@yourcompany.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    taxId: 'XX-XXXXXXX',
    website: 'www.yourcompany.com'
  });

  const [billingSettings, setBillingSettings] = useState({
    currency: 'USD',
    taxRate: '8.5',
    invoicePrefix: 'INV-',
    invoiceNumbering: 'sequential',
    paymentTerms: '30',
    lateFeePercentage: '2.0',
    autoSendReminders: true,
    reminderDays: '3'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    invoiceCreated: true,
    invoicePaid: true,
    invoiceOverdue: true,
    newCustomer: true,
    lowStockAlert: true,
    dailyDigest: false,
    weeklyReport: true
  });

  const tabs = [
    { id: 'general', name: 'General', icon: <CogIcon className="h-5 w-5" /> },
    { id: 'company', name: 'Company', icon: <BuildingOfficeIcon className="h-5 w-5" /> },
    { id: 'billing', name: 'Billing', icon: <CreditCardIcon className="h-5 w-5" /> },
    { id: 'notifications', name: 'Notifications', icon: <BellIcon className="h-5 w-5" /> },
    { id: 'security', name: 'Security', icon: <ShieldCheckIcon className="h-5 w-5" /> },
    { id: 'appearance', name: 'Appearance', icon: <SwatchIcon className="h-5 w-5" /> }
  ];

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    alert('Settings saved successfully!');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                } w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200`}
              >
                <span className="mr-3">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* General Settings */}
          {activeTab === 'general' && (
            <Card title="General Settings">
              <div className="space-y-6">
                <Input
                  label="Language"
                  type="text"
                  defaultValue="English (US)"
                  helperText="Select your preferred language"
                />
                <Input
                  label="Timezone"
                  type="text"
                  defaultValue="America/New_York (UTC-5)"
                  helperText="Your local timezone"
                />
                <Input
                  label="Date Format"
                  type="text"
                  defaultValue="MM/DD/YYYY"
                  helperText="How dates should be displayed"
                />
                <div className="pt-4">
                  <Button variant="primary" onClick={handleSave} loading={loading}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Company Settings */}
          {activeTab === 'company' && (
            <Card title="Company Information">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Company Name"
                    value={companySettings.companyName}
                    onChange={(e) => setCompanySettings({...companySettings, companyName: e.target.value})}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={companySettings.email}
                    onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                  />
                  <Input
                    label="Phone"
                    value={companySettings.phone}
                    onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                  />
                  <Input
                    label="Website"
                    value={companySettings.website}
                    onChange={(e) => setCompanySettings({...companySettings, website: e.target.value})}
                  />
                </div>
                <Input
                  label="Address"
                  value={companySettings.address}
                  onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    label="City"
                    value={companySettings.city}
                    onChange={(e) => setCompanySettings({...companySettings, city: e.target.value})}
                  />
                  <Input
                    label="State"
                    value={companySettings.state}
                    onChange={(e) => setCompanySettings({...companySettings, state: e.target.value})}
                  />
                  <Input
                    label="ZIP Code"
                    value={companySettings.zipCode}
                    onChange={(e) => setCompanySettings({...companySettings, zipCode: e.target.value})}
                  />
                </div>
                <Input
                  label="Country"
                  value={companySettings.country}
                  onChange={(e) => setCompanySettings({...companySettings, country: e.target.value})}
                />
                <Input
                  label="Tax ID"
                  value={companySettings.taxId}
                  onChange={(e) => setCompanySettings({...companySettings, taxId: e.target.value})}
                  helperText="Your company tax identification number"
                />
                <div className="pt-4">
                  <Button variant="primary" onClick={handleSave} loading={loading}>
                    Save Company Information
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Billing Settings */}
          {activeTab === 'billing' && (
            <Card title="Billing Configuration">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Currency"
                    value={billingSettings.currency}
                    onChange={(e) => setBillingSettings({...billingSettings, currency: e.target.value})}
                    helperText="Default currency for invoices"
                  />
                  <Input
                    label="Tax Rate (%)"
                    value={billingSettings.taxRate}
                    onChange={(e) => setBillingSettings({...billingSettings, taxRate: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Invoice Prefix"
                    value={billingSettings.invoicePrefix}
                    onChange={(e) => setBillingSettings({...billingSettings, invoicePrefix: e.target.value})}
                    helperText="Prefix for invoice numbers"
                  />
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={billingSettings.invoiceNumbering}
                    onChange={(e) => setBillingSettings({...billingSettings, invoiceNumbering: e.target.value})}
                  >
                    <option value="sequential">Sequential Numbering</option>
                    <option value="chronological">Chronological Numbering</option>
                    <option value="custom">Custom Numbering</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Payment Terms (days)"
                    value={billingSettings.paymentTerms}
                    onChange={(e) => setBillingSettings({...billingSettings, paymentTerms: e.target.value})}
                    helperText="Number of days for payment due"
                  />
                  <Input
                    label="Late Fee Percentage (%)"
                    value={billingSettings.lateFeePercentage}
                    onChange={(e) => setBillingSettings({...billingSettings, lateFeePercentage: e.target.value})}
                    helperText="Late fee applied to overdue invoices"
                  />
                </div>
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Automatic Reminders</h3>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={billingSettings.autoSendReminders}
                        onChange={(e) => setBillingSettings({...billingSettings, autoSendReminders: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Automatically send payment reminders</span>
                    </label>
                    <Input
                      label="Send Reminder Before Due Date (days)"
                      value={billingSettings.reminderDays}
                      onChange={(e) => setBillingSettings({...billingSettings, reminderDays: e.target.value})}
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <Button variant="primary" onClick={handleSave} loading={loading}>
                    Save Billing Settings
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <Card title="Notification Preferences">
              <div className="space-y-6">
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                      <label key={key} className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            [key]: e.target.checked
                          })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </label>
                    ))}
                  </div>
                </div>
                <div className="pt-4">
                  <Button variant="primary" onClick={handleSave} loading={loading}>
                    Save Notification Settings
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <Card title="Security Settings">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <Input
                      label="Current Password"
                      type="password"
                      placeholder="Enter current password"
                    />
                    <Input
                      label="New Password"
                      type="password"
                      placeholder="Enter new password"
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
                <div className="pt-4">
                  <Button variant="primary" onClick={handleSave} loading={loading}>
                    Update Security Settings
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <Card title="Appearance Settings">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border-2 border-blue-500 rounded-lg p-4 cursor-pointer">
                      <div className="h-20 bg-white border rounded mb-2"></div>
                      <p className="text-sm font-medium text-gray-900">Light</p>
                    </div>
                    <div className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-300">
                      <div className="h-20 bg-gray-900 border rounded mb-2"></div>
                      <p className="text-sm font-medium text-gray-900">Dark</p>
                    </div>
                    <div className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-300">
                      <div className="h-20 bg-gradient-to-r from-white to-gray-900 border rounded mb-2"></div>
                      <p className="text-sm font-medium text-gray-900">System</p>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Colors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Primary Color"
                      type="color"
                      defaultValue="#2563eb"
                    />
                    <Input
                      label="Secondary Color"
                      type="color"
                      defaultValue="#64748b"
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <Button variant="primary" onClick={handleSave} loading={loading}>
                    Save Appearance Settings
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;