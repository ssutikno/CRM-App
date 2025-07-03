// This file contains mock data for Tasks.

const MOCK_TASKS = [
    { id: 1, customerId: null, dealId: 2, title: 'Follow up call with <strong>Bob Smith (Tech Solutions Inc.)</strong>', dueDate: '2025-07-03', priority: 'High', status: 'upcoming', action: { type: 'stage_change', newStage: 'qualifying' } },
    { id: 2, customerId: 3, dealId: 4, title: 'Prepare proposal for <strong>Global Innovations</strong>', dueDate: '2025-07-04', priority: 'Medium', status: 'upcoming', action: { type: 'stage_change', newStage: 'proposal' } },
    { id: 3, customerId: 1, dealId: 1, title: 'Send datasheet for GEAR Velocity pro to <strong>ACME Corp</strong>', dueDate: '2025-07-05', priority: 'Low', status: 'upcoming', action: null },
    { id: 4, customerId: null, dealId: 5, title: 'Confirm meeting time with <strong>Data Systems Co.</strong>', dueDate: '2025-07-01', priority: 'High', status: 'overdue', action: { type: 'stage_change', newStage: 'qualifying' } },
    { id: 5, customerId: null, dealId: 3, title: 'Update contact info for <strong>Innovate LLC</strong>', dueDate: '2025-06-28', priority: 'Low', status: 'overdue', action: null },
    { id: 6, customerId: 1, dealId: 1, title: 'Logged call with <strong>ACME Corp</strong>', dueDate: '2025-06-29', priority: 'Medium', status: 'completed', action: null },
    { id: 7, customerId: 2, dealId: 6, title: 'Sent initial email to <strong>Synergy Group</strong>', dueDate: '2025-06-27', priority: 'Low', status: 'completed', action: null },
];
