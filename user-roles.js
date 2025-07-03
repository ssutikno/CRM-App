// This file defines the user roles and their permissions within the CRM.
// In a real application, this would come from a backend API.

const USER_ROLES = {
    telesales: { name: 'Telesales', permissions: ['dashboard', 'leads', 'tasks'] },
    sales: { name: 'Sales', permissions: ['dashboard', 'leads', 'pipeline', 'quotes', 'products', 'customers', 'tasks'] },
    sales_manager: { name: 'Sales Manager', permissions: ['dashboard', 'leads', 'pipeline', 'quotes', 'analytics', 'products', 'customers', 'tasks'] },
    product_manager: { name: 'Product Manager', permissions: ['dashboard', 'products', 'product-requests'] },
    supervisor: { name: 'Supervisor', permissions: ['dashboard', 'leads', 'pipeline', 'quotes', 'analytics', 'products', 'product-requests', 'customers', 'tasks', 'integrations'] }
};

// Centralized data for Lead Sources
const LEAD_SOURCES = ['Web Form', 'Referral', 'Cold Call', 'Trade Show', 'Advertisement', 'Partner'];

// Mock Product Requests Data
const MOCK_PRODUCT_REQUESTS = [
    { id: 1, requestedProduct: 'GEAR Velocity pro - 128GB RAM', requestedBy: 'John Doe', dealId: 1, date: '2025-07-01', status: 'Pending', specs: 'Customer requires a configuration with 128GB of DDR5 RAM and a 4TB NVMe SSD for high-performance computing tasks.', attachments: [{ name: 'customer_rfp.pdf', url: '#' }] },
    { id: 2, requestedProduct: 'GEAR Nomad 16" Laptop', requestedBy: 'Jane Smith', dealId: 4, date: '2025-07-02', status: 'Pending', specs: 'Need a 16-inch version of the Nomad laptop line with a dedicated GPU for light video editing.', attachments: [] }
];

// Mock Leads Data with more detail
const MOCK_LEADS = [
    { id: 1, name: 'John Miller', company: 'ACME Corp', status: 'Converted', source: 'Web Form', customerId: 1, owner: 'John Doe', score: 95, email: 'j.miller@acmecorp.com', phone: '555-0101', tags: ['Hot Lead', 'GEAR Velocity pro'], comments: 'Expressed strong interest in the new workstation line. Follow up regarding bulk discount.' },
    { id: 2, name: 'Emily White', company: 'Synergy Group', status: 'Converted', source: 'Referral', customerId: 2, owner: 'John Doe', score: 88, email: 'e.white@synergy.com', phone: '555-0201', tags: ['Enterprise', 'High-Value'], comments: 'Referred by an existing client. Looking for a full-suite solution.' },
    { id: 3, name: 'Peter Chan', company: 'Global Innovations', status: 'Converted', source: 'Trade Show', customerId: 3, owner: 'Jane Smith', score: 85, email: 'p.chan@globalinnovations.net', phone: '555-0301', tags: ['International', 'Follow-up Q3'], comments: '' },
    { id: 4, name: 'David Green', company: 'NextGen Enterprises', status: 'Lost', source: 'Cold Call', customerId: null, owner: 'Jane Smith', score: 30, email: 'd.green@nextgen.com', phone: '555-0401', tags: ['Budget Conscious'], comments: 'Lost to a competitor with lower pricing.' },
    { id: 5, name: 'Maria Garcia', company: 'Data Systems Co.', status: 'Contacted', source: 'Web Form', customerId: null, owner: 'Mike Ross', score: 75, email: 'm.garcia@datasystems.com', phone: '555-0501', tags: ['Needs Demo'], comments: 'Scheduled a product demo for next week.' },
    { id: 6, name: 'Bob Smith', company: 'Tech Solutions Inc.', status: 'New', source: 'Advertisement', customerId: null, owner: 'John Doe', score: 65, email: 'b.smith@techsolutions.com', phone: '555-0601', tags: ['Laptop Inquiry'], comments: '' }
];


// Mock Customer Data
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


// Mock Deals/Opportunities Data with customerId and dates
const MOCK_DEALS = [
    { id: 1, customerId: 1, owner: 'John Doe', name: 'ACME Corp - Workstation Upgrade', value: 50400, stage: 'proposal', createdDate: '2025-06-15', closeDate: '2025-07-25' },
    { id: 2, customerId: null, owner: 'John Doe', name: 'Tech Solutions - New Laptops', value: 15000, stage: 'new', createdDate: '2025-06-30', closeDate: '2025-08-15' },
    { id: 3, customerId: null, owner: 'Jane Smith', name: 'Innovate LLC - Server Setup', value: 8000, stage: 'new', createdDate: '2025-07-01', closeDate: '2025-08-20' },
    { id: 4, customerId: 3, owner: 'Jane Smith', name: 'Global Innovations - Support Contract', value: 25000, stage: 'qualifying', createdDate: '2025-06-20', closeDate: '2025-07-30' },
    { id: 5, customerId: null, owner: 'Mike Ross', name: 'Data Systems - Full Office IT', value: 30000, stage: 'qualifying', createdDate: '2025-07-02', closeDate: '2025-08-05' },
    { id: 6, customerId: 2, owner: 'John Doe', name: 'Synergy Group - Enterprise Deal', value: 100000, stage: 'won', createdDate: '2025-05-10', closeDate: '2025-06-20' },
    { id: 7, customerId: null, owner: 'Jane Smith', name: 'NextGen - Initial Quote', value: 45000, stage: 'lost', createdDate: '2025-05-20', closeDate: '2025-06-15' },
    { id: 8, customerId: 1, owner: 'John Doe', name: 'ACME Corp - Laptop Refresh', value: 25000, stage: 'won', createdDate: '2025-06-10', closeDate: '2025-07-01' }
];


// Mock product data.
const MOCK_PRODUCTS = [
    { id: 1, name: 'GEAR Velocity pro Workstation', sku: 'GV-WS-001', category: 'Workstations', price: '2,499.00', status: 'Active', description: 'High-performance workstation powered by Intel vPro technology, designed for professionals who demand power and reliability.', attachments: [{name: 'datasheet.pdf', size: '2.5MB', url: 'https://www.intel.com/content/dam/www/public/us/en/documents/product-briefs/vpro-platform-brief.pdf'}, {name: 'product_image.jpg', size: '1.2MB', url: 'https://placehold.co/800x600/1a2229/white?text=Workstation+Image'}], versions: [{version: '1.1', date: '2025-02-20', author: 'Admin'}, {version: '1.0', date: '2025-01-15', author: 'Admin'}] },
    { id: 2, name: 'GEAR Velocity pro Laptop', sku: 'GV-LP-003', category: 'Laptops', price: '1,899.00', status: 'Active', description: 'Secure and manageable laptop for the modern workforce, featuring Intel vPro for remote management.', attachments: [{name: 'datasheet_laptop.pdf', size: '2.8MB', url: 'https://www.intel.com/content/dam/www/public/us/en/documents/solution-briefs/vpro-enterprise-solution-brief.pdf'}], versions: [{version: '1.0', date: '2025-02-01', author: 'Admin'}] },
    { id: 3, name: 'Enterprise Support Package', sku: 'SUP-ENT-YR', category: 'Services', price: '1,200.00', status: 'Active', description: '24/7 premium support for all your enterprise products.', attachments: [], versions: [] },
    { id: 4, name: 'Standard On-site Installation', sku: 'SRV-INST-STD', category: 'Services', price: '500.00', status: 'Phasing Out', description: 'Standard installation service for new hardware purchases.', attachments: [], versions: [] },
    { id: 5, name: 'Legacy Server Rack', sku: 'HW-SRV-L01', category: 'Hardware', price: '3,200.00', status: 'Discontinued', description: 'A legacy server rack model.', attachments: [], versions: [] },
    { id: 6, name: 'GEAR PowerServe R2', sku: 'GS-R2-001', category: 'Servers', price: '4,500.00', status: 'Active', description: 'Robust 2U rack server for small to medium businesses.', attachments: [], versions: [] },
    { id: 7, name: 'GEAR Vision 27" 4K Monitor', sku: 'GM-27-4K', category: 'Monitors', price: '750.00', status: 'Active', description: 'Color-accurate 4K UHD monitor for creative professionals.', attachments: [], versions: [] },
    { id: 8, name: 'GEAR Mobile Docking Station', sku: 'GA-DS-005', category: 'Accessories', price: '250.00', status: 'Active', description: 'Universal USB-C docking station for mobile professionals.', attachments: [], versions: [] },
    { id: 9, name: 'GEAR SilentKey Pro Keyboard', sku: 'GA-KBD-010', category: 'Accessories', price: '99.00', status: 'Active', description: 'Mechanical keyboard with silent switches for office environments.', attachments: [], versions: [] },
    { id: 10, name: 'GEAR Velocity pro Mini-PC', sku: 'GV-MPC-002', category: 'Workstations', price: '1,599.00', status: 'Active', description: 'Compact and powerful mini-PC with Intel vPro technology.', attachments: [], versions: [] },
    { id: 11, name: 'Cloud Storage - 1TB Plan', sku: 'CS-1TB-YR', category: 'Services', price: '200.00', status: 'Active', description: '1TB annual cloud storage subscription.', attachments: [], versions: [] },
    { id: 12, name: 'GEAR Vision 34" Ultrawide', sku: 'GM-34-UW', category: 'Monitors', price: '950.00', status: 'Active', description: '34-inch ultrawide curved monitor for immersive productivity.', attachments: [], versions: [] },
    { id: 13, name: 'GEAR PowerServe T1', sku: 'GS-T1-001', category: 'Servers', price: '2,800.00', status: 'Active', description: 'Quiet and compact tower server for small office use.', attachments: [], versions: [] },
    { id: 14, name: 'GEAR Nomad 14" Laptop', sku: 'GN-LP-14', category: 'Laptops', price: '999.00', status: 'Active', description: 'Lightweight and affordable laptop for students and home users.', attachments: [], versions: [] },
    { id: 15, name: 'Extended Hardware Warranty', sku: 'WAR-EXT-3Y', category: 'Services', price: '350.00', status: 'Active', description: '3-year extended warranty for hardware purchases.', attachments: [], versions: [] },
    { id: 16, name: 'GEAR Precision Mouse', sku: 'GA-MSE-007', category: 'Accessories', price: '79.00', status: 'Out of Stock', description: 'High-precision wireless mouse with ergonomic design.', attachments: [], versions: [] }
];

// Mock task data with customerId and dealId
const MOCK_TASKS = [
    { id: 1, customerId: null, dealId: 2, title: 'Follow up call with <strong>Bob Smith (Tech Solutions Inc.)</strong>', dueDate: '2025-07-03', priority: 'High', status: 'upcoming', action: { type: 'stage_change', newStage: 'qualifying' } },
    { id: 2, customerId: 3, dealId: 4, title: 'Prepare proposal for <strong>Global Innovations</strong>', dueDate: '2025-07-04', priority: 'Medium', status: 'upcoming', action: { type: 'stage_change', newStage: 'proposal' } },
    { id: 3, customerId: 1, dealId: 1, title: 'Send datasheet for GEAR Velocity pro to <strong>ACME Corp</strong>', dueDate: '2025-07-05', priority: 'Low', status: 'upcoming', action: null },
    { id: 4, customerId: null, dealId: 5, title: 'Confirm meeting time with <strong>Data Systems Co.</strong>', dueDate: '2025-07-01', priority: 'High', status: 'overdue', action: { type: 'stage_change', newStage: 'qualifying' } },
    { id: 5, customerId: null, dealId: 3, title: 'Update contact info for <strong>Innovate LLC</strong>', dueDate: '2025-06-28', priority: 'Low', status: 'overdue', action: null },
    { id: 6, customerId: 1, dealId: 1, title: 'Logged call with <strong>ACME Corp</strong>', dueDate: '2025-06-29', priority: 'Medium', status: 'completed', action: null },
    { id: 7, customerId: 2, dealId: 6, title: 'Sent initial email to <strong>Synergy Group</strong>', dueDate: '2025-06-27', priority: 'Low', status: 'completed', action: null },
];
