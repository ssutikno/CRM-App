// This file contains mock data for Quotes.

const MOCK_QUOTES = [
    {
        id: 'QT-2025-0012',
        dealId: 1,
        customerId: 1,
        date: '2025-07-01',
        status: 'Sent',
        lineItems: [
            { productId: 1, quantity: 20, price: 2499.00 },
            { productId: 3, quantity: 1, price: 1200.00 }
        ],
        subtotal: 51180.00,
        tax: 5118.00,
        total: 56298.00
    },
    {
        id: 'QT-2025-0011',
        dealId: 6,
        customerId: 2,
        date: '2025-06-18',
        status: 'Accepted',
        lineItems: [
            { productId: 6, quantity: 10, price: 4500.00 },
            { productId: 13, quantity: 10, price: 2800.00 },
            { productId: 15, quantity: 20, price: 350.00 }
        ],
        subtotal: 80000.00,
        tax: 8000.00,
        total: 88000.00
    }
];
