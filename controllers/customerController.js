// This file contains all logic related to the Customer module.

window.customerController = {
    /**
     * Initializes the customer page by populating the data table and setting up listeners.
     */
    init: function() {
        this.populateAndInitTable();
        this.setupEventListeners();
    },

    /**
     * Sets up all event listeners specific to the customers page and its modals.
     */
    setupEventListeners: function() {
        const mainContent = $('#main-content');
        const appModal = $('#app-modal');

        // Page-level listeners
        mainContent.off('click', '#add-customer-btn').on('click', '#add-customer-btn', () => this.showEditModal(null));
        mainContent.off('click', '.edit-customer-btn').on('click', '.edit-customer-btn', (e) => this.showEditModal($(e.currentTarget).data('customer-id')));
        mainContent.off('click', '.view-customer-btn').on('click', '.view-customer-btn', (e) => this.showViewModal($(e.currentTarget).data('customer-id')));

        // Modal-level listeners
        appModal.off('click', '#save-customer-btn').on('click', '#save-customer-btn', () => this.save());
        appModal.off('click', '#add-contact-btn').on('click', '#add-contact-btn', this.addContactRow);
        appModal.off('click', '.remove-contact-btn').on('click', '.remove-contact-btn', this.removeContactRow);
    },

    populateAndInitTable: function() {
        const table = $('#customers-table');
        if (!table.length) return;
        if ($.fn.DataTable.isDataTable(table)) table.DataTable().destroy();

        const tableHtml = MOCK_CUSTOMERS.map(customer => {
            const primaryContact = customer.contacts.length > 0 ? customer.contacts[0].name : 'N/A';
            return `<tr>
                        <td><strong>${customer.name}</strong></td>
                        <td>${customer.industry}</td>
                        <td>${customer.city || 'N/A'}</td>
                        <td>${primaryContact}</td>
                        <td>${customer.owner}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary view-customer-btn" title="View Profile" data-customer-id="${customer.id}"><i class="fas fa-user-circle"></i></button>
                            <button class="btn btn-sm btn-outline-secondary edit-customer-btn" title="Edit Customer" data-customer-id="${customer.id}"><i class="fas fa-edit"></i></button>
                        </td>
                    </tr>`;
        }).join('');
        table.find('tbody').html(tableHtml);

        const dataTable = table.DataTable({ responsive: true, pagingType: "simple_numbers", columnDefs: [{ orderable: false, targets: 5 }] });
        dataTable.on('draw', window.applyRoleVisibility);
    },

    /**
     * Displays the read-only customer profile modal with all related data.
     * @param {number} customerId - The ID of the customer to view.
     */
    showViewModal: function(customerId) {
        const customer = MOCK_CUSTOMERS.find(c => c.id == customerId);
        if (!customer) return;

        // --- Tab Content Generation ---
        const openDeals = MOCK_DEALS.filter(d => d.customerId === customer.id && d.stage !== 'won' && d.stage !== 'lost');
        const relatedTasks = MOCK_TASKS.filter(t => t.customerId === customer.id);
        const relatedLeads = MOCK_LEADS.filter(l => l.customerId === customer.id);

        const dealsHtml = openDeals.map(d => `<tr><td>${d.name}</td><td>$${d.value.toLocaleString()}</td><td><span class="badge bg-primary">${d.stage}</span></td></tr>`).join('') || '<tr><td colspan="3">No open deals found.</td></tr>';
        const tasksHtml = relatedTasks.map(t => `<tr><td>${t.title.replace(/<[^>]*>?/gm, '')}</td><td>${t.dueDate}</td><td><span class="badge bg-info">${t.status}</span></td></tr>`).join('') || '<tr><td colspan="3">No tasks found.</td></tr>';
        const leadsHtml = relatedLeads.map(l => `<tr><td>${l.name}</td><td>${l.source}</td><td><span class="badge bg-secondary">${l.status}</span></td></tr>`).join('') || '<tr><td colspan="3">No related leads found.</td></tr>';
        const activitiesHtml = (customer.recentActivities || []).map(a => `<tr><td>${a.date}</td><td>${a.description}</td></tr>`).join('') || '<tr><td colspan="2">No recent activities.</td></tr>';
        const contactsHtml = customer.contacts.map(c => `<tr><td>${c.name}</td><td>${c.email}</td><td>${c.phone}</td></tr>`).join('') || '<tr><td colspan="3">No contacts found.</td></tr>';

        const modalContent = `
            <div class="modal-header"><h5 class="modal-title">${customer.name}</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <div class="modal-body">
                <ul class="nav nav-tabs" role="tablist">
                    <li class="nav-item" role="presentation"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#details-content" type="button" role="tab">Details</button></li>
                    <li class="nav-item" role="presentation"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#deals-content" type="button" role="tab">Open Deals</button></li>
                    <li class="nav-item" role="presentation"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tasks-content" type="button" role="tab">Tasks</button></li>
                    <li class="nav-item" role="presentation"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#leads-content" type="button" role="tab">Leads</button></li>
                    <li class="nav-item" role="presentation"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#activities-content" type="button" role="tab">Activities</button></li>
                </ul>
                <div class="tab-content pt-3">
                    <div class="tab-pane fade show active" id="details-content" role="tabpanel">
                        <p><strong>Industry:</strong> ${customer.industry}</p><p><strong>Website:</strong> <a href="http://${customer.website}" target="_blank">${customer.website}</a></p><p><strong>Address:</strong> ${customer.address}, ${customer.city}, ${customer.country}</p><p><strong>Account Owner:</strong> ${customer.owner}</p><hr><h5>Contacts</h5>
                        <table class="table table-sm table-bordered"><thead><tr><th>Name</th><th>Email</th><th>Phone</th></tr></thead><tbody>${contactsHtml}</tbody></table>
                    </div>
                    <div class="tab-pane fade" id="deals-content" role="tabpanel"><table class="table table-sm"><thead><tr><th>Deal Name</th><th>Value</th><th>Stage</th></tr></thead><tbody>${dealsHtml}</tbody></table></div>
                    <div class="tab-pane fade" id="tasks-content" role="tabpanel"><table class="table table-sm"><thead><tr><th>Title</th><th>Due Date</th><th>Status</th></tr></thead><tbody>${tasksHtml}</tbody></table></div>
                    <div class="tab-pane fade" id="leads-content" role="tabpanel"><table class="table table-sm"><thead><tr><th>Contact Name</th><th>Source</th><th>Status</th></tr></thead><tbody>${leadsHtml}</tbody></table></div>
                    <div class="tab-pane fade" id="activities-content" role="tabpanel"><table class="table table-sm"><thead><tr><th>Date</th><th>Description</th></tr></thead><tbody>${activitiesHtml}</tbody></table></div>
                </div>
            </div>
            <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button></div>`;
        $('#app-modal .modal-content').html(modalContent);
        window.appModal.show();
    },

    showEditModal: function(customerId) {
        const isNew = customerId === null;
        const customer = isNew ? { id: null, name: '', industry: '', owner: 'John Doe', address: '', city: '', country: '', website: '', contacts: [] } : MOCK_CUSTOMERS.find(c => c.id == customerId);
        if (!customer) return;

        const modalTitle = isNew ? 'Add New Customer' : 'Edit Customer';
        const contactsHtml = customer.contacts.map(c => `<div class="row contact-row mb-2"><div class="col-md-4"><input type="text" class="form-control" placeholder="Name" value="${c.name}"></div><div class="col-md-4"><input type="email" class="form-control" placeholder="Email" value="${c.email}"></div><div class="col-md-3"><input type="tel" class="form-control" placeholder="Phone" value="${c.phone}"></div><div class="col-md-1"><button type="button" class="btn btn-sm btn-outline-danger remove-contact-btn w-100"><i class="fas fa-trash"></i></button></div></div>`).join('');

        const modalContent = `
            <div class="modal-header"><h5 class="modal-title">${modalTitle}</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <div class="modal-body">
                <form id="customer-form">
                    <h5>Company Details</h5>
                    <div class="row"><div class="col-md-6 mb-3"><label class="form-label">Company Name</label><input type="text" class="form-control" id="customer-name" value="${customer.name}" required></div><div class="col-md-6 mb-3"><label class="form-label">Industry</label><input type="text" class="form-control" id="customer-industry" value="${customer.industry}"></div></div>
                    <div class="mb-3"><label class="form-label">Website</label><input type="url" class="form-control" id="customer-website" value="${customer.website}"></div>
                    <div class="mb-3"><label class="form-label">Address</label><input type="text" class="form-control" id="customer-address" value="${customer.address}"></div>
                    <div class="row"><div class="col-md-6 mb-3"><label class="form-label">City</label><input type="text" class="form-control" id="customer-city" value="${customer.city}"></div><div class="col-md-6 mb-3"><label class="form-label">Country</label><input type="text" class="form-control" id="customer-country" value="${customer.country}"></div></div>
                    <hr><h6>Contacts <button type="button" id="add-contact-btn" class="btn btn-sm btn-outline-primary ms-2"><i class="fas fa-plus"></i> Add Contact</button></h6>
                    <div id="contacts-list">${contactsHtml.length > 0 ? contactsHtml : '<p class="text-muted small">No contacts added yet.</p>'}</div>
                </form>
            </div>
            <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button type="button" class="btn btn-primary" id="save-customer-btn">Save Changes</button></div>`;
        $('#app-modal .modal-content').html(modalContent);
        window.appModal.show();
    },
    
    addContactRow: function() {
        $('#contacts-list .text-muted').remove();
        const newRow = `<div class="row contact-row mb-2"><div class="col-md-4"><input type="text" class="form-control" placeholder="Name" required></div><div class="col-md-4"><input type="email" class="form-control" placeholder="Email"></div><div class="col-md-3"><input type="tel" class="form-control" placeholder="Phone"></div><div class="col-md-1"><button type="button" class="btn btn-sm btn-outline-danger remove-contact-btn w-100"><i class="fas fa-trash"></i></button></div></div>`;
        $('#contacts-list').append(newRow);
    },

    removeContactRow: function() {
        $(this).closest('.contact-row').remove();
        if ($('#contacts-list .contact-row').length === 0) {
            $('#contacts-list').html('<p class="text-muted small">No contacts added yet.</p>');
        }
    },

    save: function() {
        console.log("Saving customer data...");
        window.appModal.hide();
        customerController.init();
    }
};
