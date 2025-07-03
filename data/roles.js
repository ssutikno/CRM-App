// This file contains data related to user roles, permissions, and global configuration.

const USER_ROLES = {
    telesales: { name: 'Telesales', permissions: ['dashboard', 'leads', 'tasks'] },
    sales: { name: 'Sales', permissions: ['dashboard', 'leads', 'pipeline', 'quotes', 'products', 'customers', 'tasks'] },
    sales_manager: { name: 'Sales Manager', permissions: ['dashboard', 'leads', 'pipeline', 'quotes', 'analytics', 'products', 'customers', 'tasks'] },
    product_manager: { name: 'Product Manager', permissions: ['dashboard', 'products', 'product-requests'] },
    supervisor: { name: 'Supervisor', permissions: ['dashboard', 'leads', 'pipeline', 'quotes', 'analytics', 'products', 'product-requests', 'customers', 'tasks', 'users', 'integrations'] }
};

const LEAD_SOURCES = ['Web Form', 'Referral', 'Cold Call', 'Trade Show', 'Advertisement', 'Partner'];

// Global configuration for settings like tax rate.
const CRM_CONFIG = {
    taxRate: 0.11, // Represents an 11% tax rate
    currencySymbol: '$'
};
