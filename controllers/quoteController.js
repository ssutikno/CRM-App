// This file contains all logic related to the Quotes module.

window.quoteController = {
    /**
     * Initializes the quotes page.
     */
    init: function() {
        this.populateAndInitTable();
        this.setupEventListeners();
    },

    /**
     * Sets up all event listeners for the quotes page and its modals.
     */
    setupEventListeners: function() {
        const mainContent = $('#main-content');
        const appModal = $('#app-modal');

        mainContent.off('click', '#create-quote-btn').on('click', '#create-quote-btn', () => this.showCreateModal(null));
        mainContent.off('click', '.view-pdf-btn').on('click', '.view-pdf-btn', (e) => this.viewPdf($(e.currentTarget).data('quote-id')));
        mainContent.off('click', '.edit-quote-btn').on('click', '.edit-quote-btn', (e) => this.showCreateModal($(e.currentTarget).data('quote-id')));

        appModal.off('change', '#quote-product-select').on('change', '#quote-product-select', (e) => this.addProductLineItem($(e.currentTarget).val()));
        appModal.off('input', '.line-item-qty').on('input', '.line-item-qty', () => this.updateTotals());
        appModal.off('click', '.remove-line-item-btn').on('click', '.remove-line-item-btn', (e) => this.removeProductLineItem(e));
        appModal.off('click', '#save-quote-btn').on('click', '#save-quote-btn', () => this.save());
    },

    /**
     * Populates the quotes table and initializes DataTables.
     */
    populateAndInitTable: function() {
        const table = $('#quotes-table');
        if (!table.length) return;
        if ($.fn.DataTable.isDataTable(table)) table.DataTable().destroy();

        const tableHtml = MOCK_QUOTES.map(quote => {
            const deal = MOCK_DEALS.find(d => d.id === quote.dealId);
            const customer = MOCK_CUSTOMERS.find(c => c.id === quote.customerId);
            const statusMap = { 'Draft': 'bg-secondary', 'Sent': 'bg-primary', 'Accepted': 'bg-success', 'Declined': 'bg-danger' };

            return `<tr>
                        <td><strong>${quote.id}</strong></td>
                        <td>${customer ? customer.name : 'N/A'}</td>
                        <td>${deal ? deal.name : 'N/A'}</td>
                        <td>$${quote.total.toLocaleString()}</td>
                        <td>${quote.date}</td>
                        <td><span class="badge ${statusMap[quote.status]}">${quote.status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary view-pdf-btn" title="View PDF" data-quote-id="${quote.id}"><i class="fas fa-file-pdf"></i></button>
                            <button class="btn btn-sm btn-outline-secondary edit-quote-btn" title="Edit Quote" data-quote-id="${quote.id}"><i class="fas fa-edit"></i></button>
                        </td>
                    </tr>`;
        }).join('');
        table.find('tbody').html(tableHtml);

        table.DataTable({ responsive: true, pagingType: "simple_numbers", order: [[4, 'desc']], columnDefs: [{ orderable: false, targets: 6 }] });
    },

    /**
     * Shows the modal for creating or editing a quote.
     * @param {string|null} quoteId - The ID of the quote to edit, or null for a new quote.
     */
    showCreateModal: function(quoteId) {
        const isNew = quoteId === null;
        const quote = isNew ? { id: null, dealId: MOCK_DEALS[0].id, date: new Date().toISOString().split('T')[0], lineItems: [] } : MOCK_QUOTES.find(q => q.id === quoteId);
        if (!quote) return;

        const modalTitle = isNew ? 'Create New Quote' : `Edit Quote: ${quote.id}`;
        const activeQuote = quote;

        const dealOptions = MOCK_DEALS.filter(d => d.stage !== 'won' && d.stage !== 'lost').map(d => `<option value="${d.id}" ${d.id === activeQuote.dealId ? 'selected' : ''}>${d.name}</option>`).join('');
        const productOptions = MOCK_PRODUCTS.filter(p => p.status === 'Active').map(p => `<option value="${p.id}">${p.name} - $${p.price}</option>`).join('');
        
        const lineItemsHtml = activeQuote.lineItems.map(item => {
            const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
            if (!product) return '';
            return `
                <tr id="line-item-${product.id}" data-product-id="${product.id}" data-price="${product.price}">
                    <td>${product.name}</td>
                    <td><input type="number" class="form-control form-control-sm line-item-qty" value="${item.quantity}" min="1"></td>
                    <td>$${parseFloat(product.price).toFixed(2)}</td>
                    <td class="line-item-total">$${(item.quantity * parseFloat(product.price)).toFixed(2)}</td>
                    <td><button type="button" class="btn btn-sm btn-outline-danger remove-line-item-btn"><i class="fas fa-trash"></i></button></td>
                </tr>`;
        }).join('');

        const modalContent = `
            <div class="modal-header"><h5 class="modal-title">${modalTitle}</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <div class="modal-body">
                <form id="quote-form" data-quote-id="${activeQuote.id || ''}">
                    <div class="row mb-3">
                        <div class="col-md-6"><label class="form-label">Associated Deal</label><select class="form-select" id="quote-deal-id">${dealOptions}</select></div>
                        <div class="col-md-6"><label class="form-label">Quote Date</label><input type="date" class="form-control" id="quote-date" value="${activeQuote.date}"></div>
                    </div>
                    <hr>
                    <h6>Line Items</h6>
                    <table class="table table-sm">
                        <thead><tr><th>Product</th><th>Quantity</th><th>Unit Price</th><th>Total</th><th></th></tr></thead>
                        <tbody id="quote-line-items">${lineItemsHtml}</tbody>
                    </table>
                    <div class="mb-3">
                        <label class="form-label">Add Product</label>
                        <select class="form-select" id="quote-product-select" data-placeholder="Search for an existing product..."><option></option>${productOptions}</select>
                    </div>
                    <hr>
                    <div class="row justify-content-end">
                        <div class="col-md-4">
                            <div class="d-flex justify-content-between"><span>Subtotal:</span> <span id="quote-subtotal">$0.00</span></div>
                            <div class="d-flex justify-content-between"><span>Tax (${CRM_CONFIG.taxRate * 100}%):</span> <span id="quote-tax">$0.00</span></div>
                            <div class="d-flex justify-content-between fw-bold"><span>Total:</span> <span id="quote-total">$0.00</span></div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button type="button" class="btn btn-primary" id="save-quote-btn">Save Quote</button></div>`;
        $('#app-modal .modal-content').html(modalContent);
        
        $('#quote-product-select').select2({ 
            theme: 'bootstrap-5', 
            dropdownParent: $('#app-modal')
        });
        this.updateTotals();
        window.appModal.show();
    },

    addProductLineItem: function(productId) {
        if (!productId) return;

        const product = MOCK_PRODUCTS.find(p => p.id == productId);
        if (product && $(`#line-item-${productId}`).length === 0) {
            const newRow = `
                <tr id="line-item-${productId}" data-product-id="${productId}" data-price="${product.price}">
                    <td>${product.name}</td>
                    <td><input type="number" class="form-control form-control-sm line-item-qty" value="1" min="1"></td>
                    <td>$${parseFloat(product.price).toFixed(2)}</td>
                    <td class="line-item-total">$${parseFloat(product.price).toFixed(2)}</td>
                    <td><button type="button" class="btn btn-sm btn-outline-danger remove-line-item-btn"><i class="fas fa-trash"></i></button></td>
                </tr>`;
            $('#quote-line-items').append(newRow);
            this.updateTotals();
        }
        $('#quote-product-select').val(null).trigger('change');
    },

    removeProductLineItem: function(event) {
        $(event.currentTarget).closest('tr').remove();
        this.updateTotals();
    },

    updateTotals: function() {
        let subtotal = 0;
        $('#quote-line-items tr').each(function() {
            const price = parseFloat($(this).data('price'));
            const qty = parseInt($(this).find('.line-item-qty').val()) || 0;
            const lineTotal = price * qty;
            $(this).find('.line-item-total').text(`$${lineTotal.toFixed(2)}`);
            subtotal += lineTotal;
        });
        const tax = subtotal * CRM_CONFIG.taxRate;
        const total = subtotal + tax;

        $('#quote-subtotal').text(`$${subtotal.toFixed(2)}`);
        $('#quote-tax').text(`$${tax.toFixed(2)}`);
        $('#quote-total').text(`$${total.toFixed(2)}`);
    },

    viewPdf: function(quoteId) {
        const quote = MOCK_QUOTES.find(q => q.id === quoteId);
        if (!quote) return;

        const customer = MOCK_CUSTOMERS.find(c => c.id === quote.customerId);
        const lineItemsHtml = quote.lineItems.map(item => {
            const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
            return `<tr><td>${product.name}</td><td>${item.quantity}</td><td>$${item.price.toFixed(2)}</td><td>$${(item.quantity * item.price).toFixed(2)}</td></tr>`;
        }).join('');

        const quoteTaxPercentage = CRM_CONFIG.taxRate * 100;

        const pdfWindow = window.open('', '_blank');
        pdfWindow.document.write(`
            <html>
                <head><title>Quote ${quote.id}</title><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"></head>
                <body class="p-4">
                    <div class="container">
                        <h1 class="text-center">Quote</h1>
                        <p class="text-center"><strong>Quote ID:</strong> ${quote.id}</p>
                        <hr>
                        <div class="row">
                            <div class="col-6"><strong>To:</strong><br>${customer.name}<br>${customer.address}<br>${customer.city}</div>
                            <div class="col-6 text-end"><strong>Date:</strong> ${quote.date}</div>
                        </div>
                        <hr>
                        <table class="table my-4">
                            <thead class="table-light"><tr><th>Product</th><th>Quantity</th><th>Unit Price</th><th>Total</th></tr></thead>
                            <tbody>${lineItemsHtml}</tbody>
                        </table>
                        <div class="row justify-content-end">
                            <div class="col-4">
                                <p><strong>Subtotal:</strong> <span class="float-end">$${quote.subtotal.toFixed(2)}</span></p>
                                <p><strong>Tax (${quoteTaxPercentage}%):</strong> <span class="float-end">$${quote.tax.toFixed(2)}</span></p>
                                <p class="fw-bold fs-5"><strong>Total:</strong> <span class="float-end">$${quote.total.toFixed(2)}</span></p>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        `);
        pdfWindow.document.close();
    },

    save: function() {
        const quoteId = $('#quote-form').data('quote-id');
        const dealId = parseInt($('#quote-deal-id').val());
        const deal = MOCK_DEALS.find(d => d.id === dealId);
        
        const lineItems = [];
        $('#quote-line-items tr').each(function() {
            lineItems.push({
                productId: $(this).data('product-id'),
                quantity: parseInt($(this).find('.line-item-qty').val()),
                price: parseFloat($(this).data('price'))
            });
        });

        const subtotal = lineItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);
        const tax = subtotal * CRM_CONFIG.taxRate;
        const total = subtotal + tax;

        const quoteData = {
            dealId: dealId,
            customerId: deal.customerId,
            date: $('#quote-date').val(),
            status: 'Draft', // New/edited quotes are saved as Draft
            lineItems: lineItems,
            subtotal: subtotal,
            tax: tax,
            total: total
        };

        if (quoteId) {
            const index = MOCK_QUOTES.findIndex(q => q.id === quoteId);
            if (index > -1) {
                MOCK_QUOTES[index] = { ...MOCK_QUOTES[index], ...quoteData };
            }
        } else {
            const newQuoteId = `QT-${new Date().getFullYear()}-${String(MOCK_QUOTES.length + 13).padStart(4, '0')}`;
            MOCK_QUOTES.push({ id: newQuoteId, ...quoteData });
        }

        console.log("Saving quote...");
        window.appModal.hide();
        this.init();
    }
};
