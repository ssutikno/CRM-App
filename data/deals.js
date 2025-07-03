// This file contains mock data for Deals/Opportunities.

const MOCK_DEALS = [
    { id: 1, customerId: 1, owner: 'John Doe', name: 'ACME Corp - Workstation Upgrade', company: 'ACME Corp', value: 50400, stage: 'proposal', createdDate: '2025-06-15', closeDate: '2025-07-25' },
    { id: 2, customerId: null, owner: 'John Doe', name: 'Tech Solutions - New Laptops', company: 'Tech Solutions Inc.', value: 15000, stage: 'new', createdDate: '2025-06-30', closeDate: '2025-08-15' },
    { id: 3, customerId: null, owner: 'Jane Smith', name: 'Innovate LLC - Server Setup', company: 'Innovate LLC', value: 8000, stage: 'new', createdDate: '2025-07-01', closeDate: '2025-08-20' },
    { id: 4, customerId: 3, owner: 'Jane Smith', name: 'Global Innovations - Support Contract', company: 'Global Innovations', value: 25000, stage: 'qualifying', createdDate: '2025-06-20', closeDate: '2025-07-30' },
    { id: 5, customerId: null, owner: 'Mike Ross', name: 'Data Systems - Full Office IT', company: 'Data Systems Co.', value: 30000, stage: 'qualifying', createdDate: '2025-07-02', closeDate: '2025-08-05' },
    { id: 6, customerId: 2, owner: 'John Doe', name: 'Synergy Group - Enterprise Deal', company: 'Synergy Group', value: 100000, stage: 'won', createdDate: '2025-05-10', closeDate: '2025-06-20' },
    { id: 7, customerId: null, owner: 'Jane Smith', name: 'NextGen - Initial Quote', company: 'NextGen Enterprises', value: 45000, stage: 'lost', createdDate: '2025-05-20', closeDate: '2025-06-15' },
    { id: 8, customerId: 1, owner: 'John Doe', name: 'ACME Corp - Laptop Refresh', company: 'ACME Corp', value: 25000, stage: 'won', createdDate: '2025-06-10', closeDate: '2025-07-01' },
    // Adding deals to demonstrate urgency indicators
    { id: 9, customerId: 3, owner: 'Jane Smith', name: 'Global Innovations - Rush Order', company: 'Global Innovations', value: 12000, stage: 'qualifying', createdDate: '2025-07-01', closeDate: '2025-07-08' }, // Hot deal (closing within 7 days)
    { id: 10, customerId: null, owner: 'Mike Ross', name: 'Legacy Systems - Maintenance', company: 'Legacy Systems', value: 5000, stage: 'proposal', createdDate: '2025-06-01', closeDate: '2025-06-30' } // Overdue deal
];
