// This file contains all logic related to the Product module.

window.productController = {
    /**
     * Initializes the product page.
     */
    init: function() {
        this.populateAndInitTable();
        this.setupEventListeners();
    },

    /**
     * Sets up event listeners for the product page and its modals.
     */
    setupEventListeners: function() {
        const mainContent = $('#main-content');
        const appModal = $('#app-modal');

        mainContent.off('click', '#add-product-btn').on('click', '#add-product-btn', () => this.showEditModal(null));
        mainContent.off('click', '#request-product-btn').on('click', '#request-product-btn', () => productRequestController.showRequestModal());
        mainContent.off('click', '.view-product-btn').on('click', '.view-product-btn', (e) => this.showViewModal($(e.currentTarget).data('product-id')));
        mainContent.off('click', '.edit-product-btn').on('click', '.edit-product-btn', (e) => this.showEditModal($(e.currentTarget).data('product-id')));
        mainContent.off('click', '.delete-product-btn').on('click', '.delete-product-btn', (e) => this.showDeleteModal($(e.currentTarget).data('product-id')));
    
        appModal.off('click', '#save-product-btn').on('click', '#save-product-btn', () => this.save());
        appModal.off('click', '#confirm-delete-btn').on('click', '#confirm-delete-btn', (e) => this.delete($(e.currentTarget).data('product-id')));
        appModal.off('change', '#add-attachment-input').on('change', '#add-attachment-input', this.addAttachmentRow);
        appModal.off('click', '.remove-attachment-btn').on('click', '.remove-attachment-btn', this.removeAttachmentRow);
    },

    /**
     * Populates the products table and initializes DataTables.
     */
    populateAndInitTable: function() {
        const table = $('#products-table');
        if (!table.length) return;
        if ($.fn.DataTable.isDataTable(table)) table.DataTable().destroy();

        const tableHtml = MOCK_PRODUCTS.map(p => {
            const statusMap = { 'Active': 'bg-success', 'Phasing Out': 'bg-warning text-dark', 'Discontinued': 'bg-danger', 'Out of Stock': 'bg-secondary' };
            return `<tr>
                        <td><strong>${p.name}</strong></td>
                        <td>${p.sku}</td>
                        <td>${p.category}</td>
                        <td>$${p.price}</td>
                        <td><span class="badge ${statusMap[p.status]}">${p.status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary view-product-btn" title="View" data-product-id="${p.id}"><i class="fas fa-eye"></i></button>
                            <button class="btn btn-sm btn-outline-secondary edit-product-btn" title="Edit" data-product-id="${p.id}" data-role-access='["product_manager", "supervisor"]'><i class="fas fa-edit"></i></button>
                            <button class="btn btn-sm btn-outline-danger delete-product-btn" title="Delete" data-product-id="${p.id}" data-role-access='["product_manager", "supervisor"]'><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>`;
        }).join('');
        table.find('tbody').html(tableHtml);

        const dataTable = table.DataTable({ responsive: true, pagingType: "simple_numbers", columnDefs: [{ orderable: false, targets: 5 }] });
        dataTable.on('draw', window.applyRoleVisibility);
    },

    /**
     * Displays the read-only product view modal.
     * @param {number} productId - The ID of the product to view.
     */
    showViewModal: function(productId) {
        const product = MOCK_PRODUCTS.find(p => p.id == productId);
        if (!product) return;
        const attachmentsHtml = product.attachments.map(a => `<li><a href="${a.url}" target="_blank">${a.name} <i class="fas fa-external-link-alt fa-xs"></i></a> (${a.size})</li>`).join('');
        const versionsHtml = product.versions.map(v => `<li>Version ${v.version} (${v.date}) by ${v.author}</li>`).join('');

        const modalContent = `
            <div class="modal-header">
                <h5 class="modal-title">${product.name}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <p><strong>SKU:</strong> ${product.sku}</p>
                <p><strong>Category:</strong> ${product.category}</p>
                <p><strong>Price:</strong> $${product.price}</p>
                <p><strong>Description:</strong> ${product.description}</p>
                <hr>
                <h6><i class="fas fa-paperclip me-2"></i>Attachments</h6>
                <ul>${attachmentsHtml || '<li>No attachments</li>'}</ul>
                <hr>
                <h6><i class="fas fa-history me-2"></i>Version History</h6>
                <ul>${versionsHtml || '<li>No version history</li>'}</ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>`;
        $('#app-modal .modal-content').html(modalContent);
        window.appModal.show();
    },

    /**
     * Shows the modal for adding or editing a product.
     * @param {number|null} productId - The ID of the product to edit, or null for a new one.
     * @param {function|null} onSaveCallback - An optional function to call after saving.
     * @param {string} prefilledName - An optional name to pre-fill in the form.
     */
    showEditModal: function(productId, onSaveCallback = null, prefilledName = '') {
        const isNew = productId === null;
        const product = isNew ? { id: null, name: prefilledName, sku: '', category: '', price: '0.00', status: 'Active', description: '', attachments: [] } : MOCK_PRODUCTS.find(p => p.id == productId);
        const modalTitle = isNew ? 'Add New Product' : 'Edit Product';
        const modalContent = `
            <div class="modal-header"><h5 class="modal-title">${modalTitle}</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <div class="modal-body">
                <form id="product-form">
                    <input type="hidden" id="product-id" value="${product.id || ''}">
                    <div class="mb-3"><label class="form-label">Product Name</label><input type="text" class="form-control" id="product-name" value="${product.name}" required></div>
                    <div class="row">
                        <div class="col-md-6 mb-3"><label class="form-label">SKU</label><input type="text" class="form-control" id="product-sku" value="${product.sku}" required></div>
                        <div class="col-md-6 mb-3"><label class="form-label">Category</label><input type="text" class="form-control" id="product-category" value="${product.category}" required></div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3"><label class="form-label">Price</label><input type="text" class="form-control" id="product-price" value="${product.price}" required></div>
                        <div class="col-md-6 mb-3"><label class="form-label">Status</label><select class="form-select" id="product-status"><option>Active</option><option>Phasing Out</option><option>Discontinued</option><option>Out of Stock</option></select></div>
                    </div>
                </form>
            </div>
            <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button type="button" class="btn btn-primary" id="save-product-btn">Save</button></div>`;
        $('#app-modal .modal-content').html(modalContent);
        
        $('#save-product-btn').data('onSaveCallback', onSaveCallback);

        window.appModal.show();
    },

    /**
     * Displays the confirmation modal for deleting a product.
     * @param {number} productId - The ID of the product to delete.
     */
    showDeleteModal: function(productId) {
        const product = MOCK_PRODUCTS.find(p => p.id == productId);
        if (!product) return;
        const modalContent = `<div class="modal-header"><h5 class="modal-title">Confirm Deletion</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body"><p>Are you sure you want to delete <strong>${product.name}</strong>?</p></div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button type="button" class="btn btn-danger" id="confirm-delete-btn" data-product-id="${product.id}">Delete</button></div>`;
        $('#app-modal .modal-content').html(modalContent);
        window.appModal.show();
    },
    
    addAttachmentRow: function() {
        if (this.files.length > 0) {
            const file = this.files[0];
            $('#attachment-list .text-muted').remove();
            const newAttachmentHtml = `<li class="list-group-item d-flex justify-content-between align-items-center">${file.name} (new)<button type="button" class="btn btn-sm btn-outline-danger remove-attachment-btn"><i class="fas fa-trash-alt"></i></button></li>`;
            $('#attachment-list').append(newAttachmentHtml);
        }
    },

    removeAttachmentRow: function() {
        $(this).closest('li').remove();
        if ($('#attachment-list li').length === 0) {
            $('#attachment-list').html('<li class="list-group-item text-muted">No attachments yet.</li>');
        }
    },

    /**
     * Saves a new or existing product and executes a callback if provided.
     */
    save: function() {
        const productId = $('#product-id').val();
        const productData = {
            name: $('#product-name').val(),
            sku: $('#product-sku').val(),
            category: $('#product-category').val(),
            price: $('#product-price').val(),
            status: $('#product-status').val(),
            description: '', // This would be gathered from a form field if it existed
            attachments: [],
            versions: []
        };

        if (productId) {
            const index = MOCK_PRODUCTS.findIndex(p => p.id == productId);
            if (index > -1) {
                MOCK_PRODUCTS[index] = { ...MOCK_PRODUCTS[index], ...productData };
            }
        } else {
            productData.id = Date.now();
            MOCK_PRODUCTS.push(productData);
        }
        
        console.log("Saving product data...");
        
        const onSaveCallback = $('#save-product-btn').data('onSaveCallback');
        
        window.appModal.hide();

        $(window.appModalElement).one('hidden.bs.modal', () => {
             if (typeof onSaveCallback === 'function') {
                onSaveCallback(productData);
            } else {
                this.init();
            }
        });
    },

    /**
     * Deletes a product from the mock data.
     * @param {number} productId - The ID of the product to delete.
     */
    delete: function(productId) {
        console.log(`Deleting product with ID: ${productId}`);
        const index = MOCK_PRODUCTS.findIndex(p => p.id == productId);
        if (index > -1) MOCK_PRODUCTS.splice(index, 1);
        window.appModal.hide();
        this.init();
    }
};
