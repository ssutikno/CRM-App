// This file contains all logic related to the Product Request module.

window.productRequestController = {
    /**
     * Initializes the product requests page.
     */
    init: function() {
        this.populateAndInitTable();
        this.setupEventListeners();
    },

    /**
     * Sets up event listeners for the product requests page and its modals.
     */
    setupEventListeners: function() {
        const mainContent = $('#main-content');
        const appModal = $('#app-modal');

        mainContent.off('click', '.review-request-btn').on('click', '.review-request-btn', (e) => this.showReviewModal($(e.currentTarget).data('request-id')));
        
        appModal.off('click', '#submit-request-btn').on('click', '#submit-request-btn', () => this.submitRequest());
        appModal.off('click', '#reject-request-btn').on('click', '#reject-request-btn', (e) => this.rejectRequest($(e.currentTarget).data('request-id')));
        appModal.off('click', '#approve-request-btn').on('click', '#approve-request-btn', (e) => this.approveRequest($(e.currentTarget).data('request-id')));
        
        // Listeners for attachment handling in the request modal
        appModal.off('change', '#req-attachment-input').on('change', '#req-attachment-input', this.addAttachmentRow);
        appModal.off('click', '.remove-req-attachment-btn').on('click', '.remove-req-attachment-btn', this.removeAttachmentRow);
    },

    /**
     * Populates the product requests table and initializes DataTables.
     */
    populateAndInitTable: function() {
        const table = $('#product-requests-table');
        if (!table.length) return;
        if ($.fn.DataTable.isDataTable(table)) table.DataTable().destroy();

        const tableHtml = MOCK_PRODUCT_REQUESTS.map(req => {
            const deal = MOCK_DEALS.find(d => d.id === req.dealId);
            const statusColor = req.status === 'Pending' ? 'bg-warning text-dark' : req.status === 'Approved' ? 'bg-success' : 'bg-danger';
            return `<tr>
                        <td><strong>${req.requestedProduct}</strong></td>
                        <td>${req.requestedBy}</td>
                        <td>${deal ? deal.name : 'N/A'}</td>
                        <td>${req.date}</td>
                        <td><span class="badge ${statusColor}">${req.status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary review-request-btn" data-request-id="${req.id}"><i class="fas fa-search"></i> Review</button>
                        </td>
                    </tr>`;
        }).join('');
        table.find('tbody').html(tableHtml);

        table.DataTable({ responsive: true, pagingType: "simple_numbers", order: [[3, 'desc']], columnDefs: [{ orderable: false, targets: 5 }] });
    },

    /**
     * Shows the modal for a salesperson to create a new product request.
     */
    showRequestModal: function() {
        const dealOptions = MOCK_DEALS.filter(d => d.owner === 'John Doe' && d.stage !== 'won' && d.stage !== 'lost')
            .map(d => `<option value="${d.id}">${d.name}</option>`).join('');

        const modalContent = `
            <div class="modal-header"><h5 class="modal-title">Request New Product</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <div class="modal-body">
                <form id="product-request-form">
                    <div class="mb-3"><label class="form-label">Requested Product Name</label><input type="text" class="form-control" id="req-product-name" required></div>
                    <div class="mb-3"><label class="form-label">Associated Deal (Optional)</label><select class="form-select" id="req-deal-id"><option value="">None</option>${dealOptions}</select></div>
                    <div class="mb-3"><label class="form-label">Required Specifications & Notes</label><textarea class="form-control" id="req-specs" rows="4" required></textarea></div>
                    <hr>
                    <div class="mb-3">
                        <h6 class="form-label"><i class="fas fa-paperclip me-2"></i>Attachments</h6>
                        <ul class="list-group mb-2" id="req-attachment-list">
                           <li class="list-group-item text-muted">No attachments added.</li>
                        </ul>
                        <label for="req-attachment-input" class="btn btn-secondary btn-sm"><i class="fas fa-plus me-1"></i> Add File</label>
                        <input type="file" id="req-attachment-input" class="d-none" multiple>
                    </div>
                </form>
            </div>
            <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button type="button" class="btn btn-primary" id="submit-request-btn">Submit Request</button></div>`;
        $('#app-modal .modal-content').html(modalContent);
        window.appModal.show();
    },
    
    /**
     * Shows the modal for a product manager to review a request.
     * @param {number} requestId - The ID of the request to review.
     */
    showReviewModal: function(requestId) {
        const request = MOCK_PRODUCT_REQUESTS.find(r => r.id == requestId);
        if (!request) return;
        
        const deal = MOCK_DEALS.find(d => d.id === request.dealId);
        const footerButtons = request.status === 'Pending' 
            ? `<button type="button" class="btn btn-danger" id="reject-request-btn" data-request-id="${request.id}">Reject</button><button type="button" class="btn btn-success" id="approve-request-btn" data-request-id="${request.id}">Approve & Create Product</button>`
            : ``;

        const attachmentsHtml = request.attachments.map(a => `<li><a href="${a.url}" target="_blank">${a.name} <i class="fas fa-external-link-alt fa-xs"></i></a></li>`).join('');

        const modalContent = `
            <div class="modal-header"><h5 class="modal-title">Review Product Request</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <div class="modal-body">
                <p><strong>Requested Product:</strong> ${request.requestedProduct}</p>
                <p><strong>Requested By:</strong> ${request.requestedBy}</p>
                <p><strong>Associated Deal:</strong> ${deal ? deal.name : 'N/A'}</p>
                <p><strong>Date:</strong> ${request.date}</p>
                <p><strong>Status:</strong> ${request.status}</p>
                <hr>
                <h6>Specifications & Notes:</h6>
                <p class="bg-light p-2 rounded">${request.specs}</p>
                <hr>
                <h6><i class="fas fa-paperclip me-2"></i>Attachments</h6>
                <ul>${attachmentsHtml || '<li>No attachments provided.</li>'}</ul>
            </div>
            <div class="modal-footer justify-content-between">
                <div>${footerButtons}</div>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>`;
        $('#app-modal .modal-content').html(modalContent);
        window.appModal.show();
    },

    addAttachmentRow: function() {
        if (this.files.length > 0) {
            const file = this.files[0];
            $('#req-attachment-list .text-muted').remove();
            const newAttachmentHtml = `<li class="list-group-item d-flex justify-content-between align-items-center" data-file-name="${file.name}">
                                        ${file.name}
                                        <button type="button" class="btn btn-sm btn-outline-danger remove-req-attachment-btn"><i class="fas fa-trash-alt"></i></button>
                                       </li>`;
            $('#req-attachment-list').append(newAttachmentHtml);
        }
    },

    removeAttachmentRow: function() {
        $(this).closest('li').remove();
        if ($('#req-attachment-list li').length === 0) {
            $('#req-attachment-list').html('<li class="list-group-item text-muted">No attachments added.</li>');
        }
    },

    submitRequest: function() {
        const attachments = [];
        $('#req-attachment-list li').each(function() {
            if($(this).data('file-name')) {
                attachments.push({ name: $(this).data('file-name'), url: '#' });
            }
        });

        const newRequest = {
            id: Date.now(),
            requestedProduct: $('#req-product-name').val(),
            requestedBy: 'John Doe', // Hardcoded for demo
            dealId: $('#req-deal-id').val(),
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            specs: $('#req-specs').val(),
            attachments: attachments
        };
        MOCK_PRODUCT_REQUESTS.push(newRequest);
        console.log("New product request submitted.");
        window.appModal.hide();
        
        const pendingRequests = MOCK_PRODUCT_REQUESTS.filter(r => r.status === 'Pending').length;
        $('#product-request-count').text(pendingRequests > 0 ? pendingRequests : '').toggle(pendingRequests > 0);
    },

    approveRequest: function(requestId) {
        const request = MOCK_PRODUCT_REQUESTS.find(r => r.id == requestId);
        if (request) request.status = 'Approved';
        console.log(`Request ${requestId} approved.`);
        window.appModal.hide();
        this.init();
        const pendingRequests = MOCK_PRODUCT_REQUESTS.filter(r => r.status === 'Pending').length;
        $('#product-request-count').text(pendingRequests > 0 ? pendingRequests : '').toggle(pendingRequests > 0);
    },

    rejectRequest: function(requestId) {
        const request = MOCK_PRODUCT_REQUESTS.find(r => r.id == requestId);
        if (request) request.status = 'Rejected';
        console.log(`Request ${requestId} rejected.`);
        window.appModal.hide();
        this.init();
        const pendingRequests = MOCK_PRODUCT_REQUESTS.filter(r => r.status === 'Pending').length;
        $('#product-request-count').text(pendingRequests > 0 ? pendingRequests : '').toggle(pendingRequests > 0);
    }
};
