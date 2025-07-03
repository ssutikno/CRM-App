// This file contains all logic related to the Task module.

window.taskController = {
    /**
     * Initializes the tasks page, populates the list, and sets up event listeners.
     */
    init: function() {
        this.populateTasks('upcoming');
        const overdueCount = MOCK_TASKS.filter(t => t.status === 'overdue').length;
        $('#overdue-count').text(overdueCount || '');
        this.setupEventListeners();
    },

    /**
     * Sets up all event listeners specific to the tasks page and its modals.
     */
    setupEventListeners: function() {
        const mainContent = $('#main-content');
        const appModal = $('#app-modal');

        // Page-level listeners
        mainContent.off('click', '#task-tabs .nav-link').on('click', '#task-tabs .nav-link', (e) => {
            e.preventDefault();
            this.populateTasks($(e.currentTarget).data('task-filter'));
        });
        mainContent.off('click', '.manage-task-btn').on('click', '.manage-task-btn', (e) => {
            this.showManageModal($(e.currentTarget).data('task-id'));
        });
        mainContent.off('click', '#add-task-btn').on('click', '#add-task-btn', () => {
            this.showManageModal(null);
        });

        // Modal-level listeners
        appModal.off('click', '#save-task-btn').on('click', '#save-task-btn', () => this.save());
        appModal.off('click', '#mark-complete-btn').on('click', '#mark-complete-btn', (e) => this.showCompleteConfirmModal($(e.currentTarget).data('task-id')));
        appModal.off('click', '#confirm-complete-btn').on('click', '#confirm-complete-btn', (e) => this.complete($(e.currentTarget).data('task-id')));
    },

    populateTasks: function(filter) {
        const taskContainer = $('#task-list-container');
        if (!taskContainer.length) return;
        
        $('#task-tabs .nav-link').removeClass('active');
        $(`#task-tabs .nav-link[data-task-filter="${filter}"]`).addClass('active');

        let filteredTasks = MOCK_TASKS.filter(task => task.status === filter);
        filteredTasks.sort((a, b) => new Date(filter === 'completed' ? b.dueDate : a.dueDate) - new Date(filter === 'completed' ? a.dueDate : b.dueDate));
        
        const priorityMap = { 'High': 'bg-danger', 'Medium': 'bg-warning text-dark', 'Low': 'bg-success' };
        const tasksHtml = filteredTasks.map(task => {
            const isCompleted = task.status === 'completed';
            const actionButton = isCompleted ? `<button class="btn btn-sm btn-outline-secondary" disabled><i class="fas fa-check"></i> Completed</button>` : `<button class="btn btn-sm btn-outline-primary manage-task-btn" title="Manage Task" data-task-id="${task.id}"><i class="fas fa-edit"></i> Manage</button>`;
            return `<li class="list-group-item d-flex justify-content-between align-items-center"><div><label class="form-check-label ${isCompleted ? 'text-decoration-line-through text-muted' : ''}">${task.title}</label><small class="d-block text-muted">Due: ${task.dueDate}</small></div><div><span class="badge ${priorityMap[task.priority]} me-2">${task.priority} Priority</span>${actionButton}</div></li>`;
        }).join('');
        
        taskContainer.html(tasksHtml || '<li class="list-group-item text-center">No tasks in this category.</li>');
    },

    /**
     * Shows the modal for adding or editing a task.
     * @param {number|null} taskId - The ID of the task to edit, or null for a new one.
     * @param {number|null} dealId - An optional deal ID to pre-link the task.
     */
    showManageModal: function(taskId, dealId = null) {
        const isNew = taskId === null;
        const task = isNew ? { id: null, title: '', dueDate: '', priority: 'Medium', dealId: dealId } : MOCK_TASKS.find(t => t.id == taskId);
        if (!task) return;

        const modalTitle = isNew ? 'Add New Task' : 'Manage Task';
        const completeButton = isNew ? '' : `<button type="button" class="btn btn-success" id="mark-complete-btn" data-task-id="${task.id}"><i class="fas fa-check-circle me-2"></i>Mark as Complete</button>`;

        const modalContent = `
            <div class="modal-header">
                <h5 class="modal-title">${modalTitle}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="task-form">
                    <input type="hidden" id="task-id" value="${task.id}">
                    <input type="hidden" id="task-deal-id" value="${task.dealId || ''}">
                    <div class="mb-3">
                        <label for="task-title" class="form-label">Task Title</label>
                        <input type="text" class="form-control" id="task-title" value="${task.title.replace(/<[^>]*>?/gm, '')}" required>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="task-due-date" class="form-label">Due Date</label>
                            <input type="date" class="form-control" id="task-due-date" value="${task.dueDate}" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="task-priority" class="form-label">Priority</label>
                            <select class="form-select" id="task-priority">
                                <option ${task.priority === 'High' ? 'selected' : ''}>High</option>
                                <option ${task.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                                <option ${task.priority === 'Low' ? 'selected' : ''}>Low</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer justify-content-between">
                ${completeButton}
                <div>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="save-task-btn">Save Changes</button>
                </div>
            </div>`;
        $('#app-modal .modal-content').html(modalContent);
        window.appModal.show();
    },

    showCompleteConfirmModal: function(taskId) {
        const task = MOCK_TASKS.find(t => t.id == taskId);
        if (!task) return;

        const modalContent = `
            <div class="modal-header">
                <h5 class="modal-title">Confirm Task Completion</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to mark the following task as complete?</p>
                <p><strong>${task.title.replace(/<[^>]*>?/gm, '')}</strong></p>
                ${task.action ? '<p class="text-info"><i class="fas fa-info-circle me-1"></i> This will also update the linked deal status.</p>' : ''}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-success" id="confirm-complete-btn" data-task-id="${taskId}">Confirm & Complete</button>
            </div>`;
        $('#app-modal .modal-content').html(modalContent);
        window.appModal.show();
    },

    save: function() {
        const taskId = $('#task-id').val();
        const dealId = $('#task-deal-id').val() ? parseInt($('#task-deal-id').val()) : null;
        
        const taskData = {
            title: `<strong>${$('#task-title').val()}</strong>`,
            dueDate: $('#task-due-date').val(),
            priority: $('#task-priority').val(),
            dealId: dealId
        };
        
        if (taskId && taskId !== 'null') {
            const task = MOCK_TASKS.find(t => t.id == taskId);
            if (task) {
                Object.assign(task, taskData);
            }
        } else {
            MOCK_TASKS.push({ id: Date.now(), status: 'upcoming', action: null, ...taskData });
        }
        window.appModal.hide();
        
        // Refresh the page we came from
        const currentPage = $('#main-content').data('current-page');
        window.loadContent(currentPage);
    },

    complete: function(taskId) {
        const task = MOCK_TASKS.find(t => t.id == taskId);
        if (task) {
            task.status = 'completed';
            if (task.action && task.action.type === 'stage_change') {
                const deal = MOCK_DEALS.find(d => d.id === task.dealId);
                if (deal) deal.stage = task.action.newStage;
            }
        }
        window.appModal.hide();
        const currentPage = $('#main-content').data('current-page');
        window.loadContent(currentPage);
    }
};
