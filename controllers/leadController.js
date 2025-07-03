// This file contains all logic related to the Leads module.

window.leadController = {
    /**
     * Initializes the leads page.
     */
    init: function() {
        this.populateAndInitTable();
        this.setupEventListeners();
    },

    /**
     * Sets up all event listeners for the leads page and its modals.
     */
    setupEventListeners: function() {
        const mainContent = $('#main-content');
        const appModal = $('#app-modal');

        mainContent.off('click', '#add-lead-btn').on('click', '#add-lead-btn', () => this.showEditModal(null));
        mainContent.off('click', '.edit-lead-btn').on('click', '.edit-lead-btn', (e) => this.showEditModal($(e.currentTarget).data('lead-id')));
        mainContent.off('click', '.convert-lead-btn').on('click', '.convert-lead-btn', (e) => this.showConvertModal($(e.currentTarget).data('lead-id')));

        appModal.off('click', '#save-lead-btn').on('click', '#save-lead-btn', () => this.save());
        appModal.off('click', '#confirm-convert-btn').on('click', '#confirm-convert-btn', (e) => this.convertLead($(e.currentTarget).data('lead-id')));
        
        // Add a listener for the new customer dropdown
        appModal.off('change', '#lead-customer-id').on('change', '#lead-customer-id', this.handleCustomerChange);
    },

    /**
     * Populates the leads table and initializes DataTables.
     */
    populateAndInitTable: function() {
        const table = $('#leads-table');
        if (!table.length) return;
        if ($.fn.DataTable.isDataTable(table)) table.DataTable().destroy();

        const tableHtml = MOCK_LEADS.map(lead => {
            const scoreColor = lead.score > 80 ? 'bg-success' : lead.score > 60 ? 'bg-warning text-dark' : 'bg-secondary';
            const canConvert = lead.status !== 'Converted' && lead.status !== 'Lost';
            const tagsHtml = lead.tags.map(tag => `<span class="badge bg-info me-1">${tag}</span>`).join('');

            return `<tr>
                        <td><strong>${lead.name}</strong></td>
                        <td>${lead.company}</td>
                        <td><span class="badge ${scoreColor}">${lead.score}</span></td>
                        <td>${lead.source}</td>
                        <td>${tagsHtml}</td>
                        <td>${lead.status}</td>
                        <td>${lead.owner}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-secondary edit-lead-btn" title="Edit Lead" data-lead-id="${lead.id}"><i class="fas fa-edit"></i></button>
                            ${canConvert ? `<button class="btn btn-sm btn-outline-success convert-lead-btn" title="Convert Lead" data-lead-id="${lead.id}"><i class="fas fa-exchange-alt"></i></button>` : ''}
                        </td>
                    </tr>`;
        }).join('');
        table.find('tbody').html(tableHtml);

        table.DataTable({ responsive: true, pagingType: "simple_numbers", columnDefs: [{ orderable: false, targets: 7 }] });
    },

    /**
     * Shows the modal for adding or editing a lead.
     * @param {number|null} leadId - The ID of the lead to edit, or null for a new lead.
     */
    showEditModal: function(leadId) {
        const isNew = leadId === null;
        const lead = isNew ? { id: null, name: '', company: '', email: '', phone: '', source: 'Web Form', owner: 'John Doe', score: 50, status: 'New', tags: [], comments: '', customerId: null } : MOCK_LEADS.find(l => l.id == leadId);
        const modalTitle = isNew ? 'Add New Lead' : 'Edit Lead';

        const leadSourceOptions = LEAD_SOURCES.map(source => `<option value="${source}" ${lead.source === source ? 'selected' : ''}>${source}</option>`).join('');
        const customerOptions = MOCK_CUSTOMERS.map(cust => `<option value="${cust.id}" ${lead.customerId === cust.id ? 'selected' : ''}>${cust.name}</option>`).join('');

        const modalContent = `
            <div class="modal-header"><h5 class="modal-title">${modalTitle}</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <div class="modal-body">
                <form id="lead-form">
                    <input type="hidden" id="lead-id" value="${lead.id}">
                    <div class="mb-3">
                        <label for="lead-customer-id" class="form-label">Existing Customer (Optional)</label>
                        <select class="form-select" id="lead-customer-id" data-placeholder="Search for an existing customer...">
                            <option value="">-- New Customer --</option>
                            ${customerOptions}
                        </select>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3"><label class="form-label">Contact Name</label><input type="text" class="form-control" id="lead-name" value="${lead.name}" required></div>
                        <div class="col-md-6 mb-3"><label class="form-label">Company Name</label><input type="text" class="form-control" id="lead-company" value="${lead.company}" ${lead.customerId ? 'disabled' : ''}></div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3"><label class="form-label">Email</label><input type="email" class="form-control" id="lead-email" value="${lead.email}"></div>
                        <div class="col-md-6 mb-3"><label class="form-label">Phone</label><input type="tel" class="form-control" id="lead-phone" value="${lead.phone}"></div>
                    </div>
                    <div class="row">
                         <div class="col-md-4 mb-3"><label class="form-label">Lead Source</label><select class="form-select" id="lead-source">${leadSourceOptions}</select></div>
                         <div class="col-md-4 mb-3"><label class="form-label">Lead Status</label><select class="form-select" id="lead-status"><option>New</option><option>Contacted</option><option>Qualified</option><option>Lost</option></select></div>
                         <div class="col-md-4 mb-3"><label class="form-label">Owner</label><input type="text" class="form-control" id="lead-owner" value="${lead.owner}"></div>
                    </div>
                    <hr>
                    <div class="mb-3">
                        <label for="lead-tags" class="form-label">Tags (comma-separated)</label>
                        <input type="text" class="form-control" id="lead-tags" value="${lead.tags.join(', ')}">
                    </div>
                     <div class="mb-3">
                        <label for="lead-comments" class="form-label">Internal Comments</label>
                        <textarea class="form-control" id="lead-comments" rows="3">${lead.comments}</textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button type="button" class="btn btn-primary" id="save-lead-btn">Save</button></div>`;
        $('#app-modal .modal-content').html(modalContent);
        window.appModal.show();

        // Initialize Select2 on the customer dropdown
        $('#lead-customer-id').select2({
            theme: 'bootstrap-5',
            dropdownParent: $('#app-modal') // Important: ensures the dropdown appears over the modal
        });
    },

    /**
     * Handles changes to the customer dropdown, auto-filling the company name.
     */
    handleCustomerChange: function() {
        const customerId = $(this).val();
        const companyInput = $('#lead-company');
        if (customerId) {
            const customer = MOCK_CUSTOMERS.find(c => c.id == customerId);
            companyInput.val(customer.name).prop('disabled', true);
        } else {
            companyInput.val('').prop('disabled', false);
        }
    },

    showConvertModal: function(leadId) {
        const lead = MOCK_LEADS.find(l => l.id == leadId);
        if (!lead) return;
        const modalContent = `
            <div class="modal-header"><h5 class="modal-title">Confirm Lead Conversion</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <div class="modal-body">
                <p>Are you sure you want to convert this lead?</p>
                <p><strong>${lead.name}</strong> from <strong>${lead.company}</strong></p>
                <hr>
                <p class="text-info"><i class="fas fa-info-circle me-1"></i>This will create a new <strong>Customer Account</strong> (if needed), a new <strong>Contact</strong>, and a new <strong>Deal</strong> in the sales pipeline.</p>
            </div>
            <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button type="button" class="btn btn-success" id="confirm-convert-btn" data-lead-id="${lead.id}">Convert Lead</button></div>`;
        $('#app-modal .modal-content').html(modalContent);
        window.appModal.show();
    },

    save: function() {
        const leadId = $('#lead-id').val();
        const leadData = {
            name: $('#lead-name').val(),
            company: $('#lead-company').val(),
            email: $('#lead-email').val(),
            phone: $('#lead-phone').val(),
            source: $('#lead-source').val(),
            status: $('#lead-status').val(),
            owner: $('#lead-owner').val(),
            tags: $('#lead-tags').val().split(',').map(tag => tag.trim()).filter(tag => tag),
            comments: $('#lead-comments').val(),
            customerId: $('#lead-customer-id').val() ? parseInt($('#lead-customer-id').val()) : null
        };

        if (leadId && leadId !== 'null') {
            const index = MOCK_LEADS.findIndex(l => l.id == leadId);
            if (index > -1) {
                MOCK_LEADS[index] = { ...MOCK_LEADS[index], ...leadData };
            }
        } else {
            MOCK_LEADS.push({ id: Date.now(), score: 50, ...leadData });
        }
        
        console.log("Saving lead...");
        window.appModal.hide();
        this.init();
    },

    convertLead: function(leadId) {
        const lead = MOCK_LEADS.find(l => l.id == leadId);
        if (!lead) return;

        lead.status = 'Converted';
        
        let customer;
        // Use existing customer if linked, otherwise find by name or create new.
        if (lead.customerId) {
            customer = MOCK_CUSTOMERS.find(c => c.id === lead.customerId);
        } else {
            customer = MOCK_CUSTOMERS.find(c => c.name.toLowerCase() === lead.company.toLowerCase());
            if (!customer) {
                customer = { id: Date.now(), name: lead.company, industry: 'Unknown', owner: lead.owner, contacts: [] };
                MOCK_CUSTOMERS.push(customer);
            }
        }
        lead.customerId = customer.id;

        const newContact = { id: Date.now() + 1, name: lead.name, email: lead.email, phone: lead.phone };
        customer.contacts.push(newContact);

        const newDeal = { id: Date.now() + 2, customerId: customer.id, owner: lead.owner, name: `${lead.company} - New Opportunity`, value: 0, stage: 'qualifying', createdDate: new Date().toISOString().split('T')[0], closeDate: '' };
        MOCK_DEALS.push(newDeal);

        console.log(`Lead ${lead.name} converted.`);
        window.appModal.hide();
        this.init();
    }
};
