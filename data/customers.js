// This file contains mock data for Customers.

const MOCK_CUSTOMERS = [
    { 
        id: 1, 
        name: 'ACME Corp', 
        industry: 'Technology', 
        owner: 'John Doe',
        address: '123 Innovation Drive',
        city: 'Techville',
        country: 'USA',
        website: 'www.acmecorp.com',
        contacts: [
            { id: 101, name: 'John Miller', email: 'j.miller@acmecorp.com', phone: '555-0101' },
            { id: 102, name: 'Susan Bee', email: 's.bee@acmecorp.com', phone: '555-0102' }
        ],
        recentActivities: [
            { date: '2025-07-01', description: 'Proposal sent for Workstation Upgrade deal.' },
            { date: '2025-06-29', description: 'Logged call with John Miller about project timeline.' },
        ]
    },
    { 
        id: 2, 
        name: 'Synergy Group', 
        industry: 'Finance', 
        owner: 'John Doe',
        address: '456 Financial Plaza',
        city: 'Metropolis',
        country: 'USA',
        website: 'www.synergy.com',
        contacts: [
            { id: 201, name: 'Emily White', email: 'e.white@synergy.com', phone: '555-0201' }
        ],
        recentActivities: [
            { date: '2025-06-20', description: 'Contract signed for Enterprise Deal.' },
        ]
    },
    { 
        id: 3, 
        name: 'Global Innovations', 
        industry: 'Manufacturing', 
        owner: 'Jane Smith',
        address: '789 Factory Rd',
        city: 'Industria',
        country: 'Germany',
        website: 'www.globalinnovations.net',
        contacts: [
            { id: 301, name: 'Peter Chan', email: 'p.chan@globalinnovations.net', phone: '555-0301' },
            { id: 302, name: 'Wei Zhang', email: 'w.zhang@globalinnovations.net', phone: '555-0302' }
        ],
        recentActivities: [
            { date: '2025-07-04', description: 'Prepared proposal for Support Contract.' },
            { date: '2025-06-28', description: 'Follow-up call with Peter Chan.' },
        ]
    }
];
