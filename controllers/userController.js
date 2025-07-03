// This file contains all logic related to the User Management module.

window.userController = {
    /**
     * Initializes the user management page.
     */
    init: function() {
        this.populateAndInitTable();
        this.setupEventListeners();
    },

    /**
     * Sets up event listeners for the user page and its modals.
     */
    setupEventListeners: function() {
        const mainContent = $('#main-content');
        const appModal = $('#app-modal');

        mainContent.off('click', '#add-user-btn').on('click', '#add-user-btn', () => this.showEditModal(null));
        mainContent.off('click', '.edit-user-btn').on('click', '.edit-user-btn', (e) => this.showEditModal($(e.currentTarget).data('user-id')));
        
        appModal.off('click', '#save-user-btn').on('click', '#save-user-btn', () => this.save());
    },

    /**
     * Populates the users table and initializes DataTables.
     */
    populateAndInitTable: function() {
        const table = $('#users-table');
        if (!table.length) return;
        if ($.fn.DataTable.isDataTable(table)) table.DataTable().destroy();

        const tableHtml = MOCK_USERS.map(user => {
            const roleName = USER_ROLES[user.role] ? USER_ROLES[user.role].name : 'Unknown';
            const statusColor = user.status === 'Active' ? 'bg-success' : 'bg-secondary';
            return `<tr>
                        <td><strong>${user.name}</strong></td>
                        <td>${user.email}</td>
                        <td>${roleName}</td>
                        <td><span class="badge ${statusColor}">${user.status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline-secondary edit-user-btn" title="Edit User" data-user-id="${user.id}"><i class="fas fa-edit"></i></button>
                        </td>
                    </tr>`;
        }).join('');
        table.find('tbody').html(tableHtml);

        table.DataTable({ responsive: true, pagingType: "simple_numbers", columnDefs: [{ orderable: false, targets: 4 }] });
    },

    /**
     * Shows the modal for adding or editing a user.
     * @param {number|null} userId - The ID of the user to edit, or null for a new user.
     */
    showEditModal: function(userId) {
        const isNew = userId === null;
        const user = isNew ? { id: null, name: '', email: '', role: 'sales', status: 'Active' } : MOCK_USERS.find(u => u.id == userId);
        const modalTitle = isNew ? 'Add New User' : 'Edit User';

        const roleOptions = Object.entries(USER_ROLES).map(([key, value]) => `<option value="${key}" ${user.role === key ? 'selected' : ''}>${value.name}</option>`).join('');

        const modalContent = `
            <div class="modal-header"><h5 class="modal-title">${modalTitle}</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <div class="modal-body">
                <form id="user-form">
                    <input type="hidden" id="user-id" value="${user.id || ''}">
                    <div class="row">
                        <div class="col-md-6 mb-3"><label class="form-label">Full Name</label><input type="text" class="form-control" id="user-name" value="${user.name}" required></div>
                        <div class="col-md-6 mb-3"><label class="form-label">Email Address</label><input type="email" class="form-control" id="user-email" value="${user.email}" required></div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3"><label class="form-label">Role</label><select class="form-select" id="user-role">${roleOptions}</select></div>
                        <div class="col-md-6 mb-3"><label class="form-label">Status</label><select class="form-select" id="user-status"><option>Active</option><option>Inactive</option></select></div>
                    </div>
                    ${!isNew ? '<button type="button" class="btn btn-outline-warning">Send Password Reset</button>' : ''}
                </form>
            </div>
            <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button type="button" class="btn btn-primary" id="save-user-btn">Save</button></div>`;
        $('#app-modal .modal-content').html(modalContent);
        $('#user-status').val(user.status);
        window.appModal.show();
    },

    /**
     * Saves a new or existing user.
     */
    save: function() {
        const userId = $('#user-id').val();
        const userData = {
            name: $('#user-name').val(),
            email: $('#user-email').val(),
            role: $('#user-role').val(),
            status: $('#user-status').val()
        };

        if (userId) {
            const index = MOCK_USERS.findIndex(u => u.id == userId);
            if (index > -1) {
                MOCK_USERS[index] = { ...MOCK_USERS[index], ...userData };
            }
        } else {
            MOCK_USERS.push({ id: Date.now(), ...userData });
        }
        
        console.log("Saving user data...");
        window.appModal.hide();
        this.init();
    }
};
