// This file contains all logic related to the Sales Pipeline module.

window.pipelineController = {
    /**
     * Initializes the pipeline page.
     */
    init: function() {
        this.populateAndInit();
        this.setupEventListeners();
    },

    /**
     * Sets up event listeners for the pipeline page.
     */
    setupEventListeners: function() {
        const mainContent = $('#main-content');
        const appModal = $('#app-modal');

        mainContent.off('click', '.deal-card').on('click', '.deal-card', (e) => {
            this.showDealDetailsModal($(e.currentTarget).data('deal-id'));
        });

        // Listener for the "New Task" button inside the deal modal
        appModal.off('click', '#add-task-for-deal-btn').on('click', '#add-task-for-deal-btn', (e) => {
            const dealId = $(e.currentTarget).data('deal-id');
            
            // Chain the modals. When the current modal is hidden, open the new one.
            appModal.one('hidden.bs.modal', function () {
                taskController.showManageModal(null, dealId);
            }).modal('hide');
        });
    },

    /**
     * Populates the pipeline view and sets up drag-and-drop functionality.
     */
    populateAndInit: function() {
        const pipelineContainer = $('#pipeline-container');
        if (!pipelineContainer.length) return;
        const stages = { 'new': { title: 'New', color: 'bg-secondary' }, 'qualifying': { title: 'Qualifying', color: 'bg-info' }, 'proposal': { title: 'Proposal Sent', color: 'bg-primary' }, 'won': { title: 'Closed-Won', color: 'bg-success' }, 'lost': { title: 'Closed-Lost', color: 'bg-danger' } };
        
        pipelineContainer.html(Object.keys(stages).map(stageId => {
            const stage = stages[stageId];
            const dealsInStage = MOCK_DEALS.filter(deal => deal.stage === stageId);
            const dealCardsHtml = dealsInStage.map(deal => {
                const today = new Date('2025-07-03'); // Hardcoding "today" for consistent demo
                const closeDate = new Date(deal.closeDate);
                const diffTime = closeDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                let urgencyIcon = '';
                if (deal.stage !== 'won' && deal.stage !== 'lost') {
                    if (diffDays < 0) {
                        urgencyIcon = `<span class="me-2" title="Overdue"><i class="fas fa-exclamation-triangle text-warning"></i></span>`;
                    } else if (diffDays <= 7) {
                        urgencyIcon = `<span class="me-2" title="Closing Soon"><i class="fas fa-fire-alt text-danger"></i></span>`;
                    }
                }

                return `<div class="card deal-card mb-2" data-deal-id="${deal.id}">
                            <div class="card-body">
                                <h6 class="card-title">${deal.name}</h6>
                                <p class="card-text small mb-1"><strong>Value:</strong> $${deal.value.toLocaleString()}</p>
                                <p class="card-text small mb-2"><strong>Company:</strong> ${deal.company}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <small class="text-muted">Close: ${deal.closeDate}</small>
                                    ${urgencyIcon}
                                </div>
                            </div>
                        </div>`;
            }).join('');
            return `<div class="pipeline-stage"><h5 class="p-3 ${stage.color} text-white rounded-top">${stage.title} (${dealsInStage.length})</h5><div class="stage-cards p-2" data-stage-id="${stageId}">${dealCardsHtml}</div></div>`;
        }).join(''));

        $('.stage-cards').each(function() { 
            new Sortable(this, { 
                group: 'pipelineDeals', 
                animation: 150, 
                ghostClass: 'sortable-ghost', 
                chosenClass: 'sortable-chosen', 
                onEnd: (evt) => { 
                    const deal = MOCK_DEALS.find(d => d.id == $(evt.item).data('deal-id')); 
                    if (deal) { 
                        deal.stage = $(evt.to).data('stage-id'); 
                        pipelineController.init(); // Refresh the view
                    } 
                } 
            }); 
        });
    },

    /**
     * Shows details for a specific deal in a modal, including related tasks.
     * @param {number} dealId - The ID of the deal to view.
     */
    showDealDetailsModal: function(dealId) {
        const deal = MOCK_DEALS.find(d => d.id == dealId);
        if (!deal) return;

        const customer = MOCK_CUSTOMERS.find(c => c.id === deal.customerId);
        const relatedTasks = MOCK_TASKS.filter(t => t.dealId === deal.id);

        const detailsTabContent = `
            <p><strong>Deal Value:</strong> $${deal.value.toLocaleString()}</p>
            <p><strong>Assigned To:</strong> ${deal.owner}</p>
            <p><strong>Expected Close Date:</strong> ${deal.closeDate}</p>
            <hr>
            <h6>Associated Customer</h6>
            <p>${customer ? `<a href="#">${customer.name}</a>` : 'N/A'}</p>
        `;

        const tasksHtml = relatedTasks.length > 0 
            ? relatedTasks.map(t => {
                const statusMap = { 'upcoming': 'bg-primary', 'overdue': 'bg-danger', 'completed': 'bg-success' };
                return `<tr>
                            <td>${t.title.replace(/<[^>]*>?/gm, '')}</td>
                            <td>${t.dueDate}</td>
                            <td><span class="badge ${statusMap[t.status]}">${t.status}</span></td>
                        </tr>`;
            }).join('') 
            : '<tr><td colspan="3">No tasks associated with this deal.</td></tr>';
        
        const tasksTabContent = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="m-0">Associated Tasks</h6>
                <button class="btn btn-sm btn-outline-primary" id="add-task-for-deal-btn" data-deal-id="${deal.id}"><i class="fas fa-plus"></i> New Task</button>
            </div>
            <table class="table table-sm">
                <thead><tr><th>Title</th><th>Due Date</th><th>Status</th></tr></thead>
                <tbody>${tasksHtml}</tbody>
            </table>`;

        const modalContent = `
            <div class="modal-header">
                <h5 class="modal-title">${deal.name}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <ul class="nav nav-tabs mb-3" role="tablist">
                    <li class="nav-item" role="presentation"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#deal-details-content" type="button" role="tab">Details</button></li>
                    <li class="nav-item" role="presentation"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#deal-tasks-content" type="button" role="tab">Tasks</button></li>
                </ul>
                <div class="tab-content">
                    <div class="tab-pane fade show active" id="deal-details-content" role="tabpanel">${detailsTabContent}</div>
                    <div class="tab-pane fade" id="deal-tasks-content" role="tabpanel">${tasksTabContent}</div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Log Activity</button>
            </div>`;
            
        $('#app-modal .modal-content').html(modalContent);
        window.appModal.show();
    }
};
