// This file is the main entry point and controller for the CRM application.
// It handles core functionality like initialization, page loading, and role management.
// It now loads feature controllers on-demand for better performance.

$(document).ready(function() {
    // =========================================================================
    // --- GLOBAL STATE & CONFIGURATION ---
    // =========================================================================
    let currentUserRole = 'sales'; // Default role on application load
    window.appModal = new bootstrap.Modal(document.getElementById('app-modal'));
    window.appModalElement = document.getElementById('app-modal');


    // A map to link content pages to their controller files and objects.
    const CONTROLLER_MAP = {
        'dashboard.html': { path: 'controllers/dashboardController.js', object: 'dashboardController' },
        'customers.html': { path: 'controllers/customerController.js', object: 'customerController' },
        'products.html': { path: 'controllers/productController.js', object: 'productController' },
        'product-requests.html': { path: 'controllers/productRequestController.js', object: 'productRequestController' },
        'pipeline.html': { path: 'controllers/pipelineController.js', object: 'pipelineController' },
        'tasks.html': { path: 'controllers/taskController.js', object: 'taskController' },
        'analytics.html': { path: 'controllers/analyticsController.js', object: 'analyticsController' },
        'leads.html': { path: 'controllers/leadController.js', object: 'leadController' },
        'quotes.html': { path: 'controllers/quoteController.js', object: 'quoteController' },
        'users.html': { path: 'controllers/userController.js', object: 'userController' }
    };

    // =========================================================================
    // --- CORE APPLICATION & UI FUNCTIONS ---
    // =========================================================================

    function initializeApp() {
        $('#sidebar-wrapper').load('sidebar.html', function() {
            setupRole(currentUserRole);
            setupEventListeners();
        });
    }

    function setupRole(role) {
        currentUserRole = role;
        window.currentUserRole = role;
        const roleData = USER_ROLES[role];

        // Update the role switcher dropdown text
        $('#current-role-text').text(roleData.name);
        $('#role-switcher .dropdown-item').removeClass('active');
        $(`#role-switcher .dropdown-item[data-role="${role}"]`).addClass('active');
        
        // Update the logged-in user name based on the first user with that role
        const userForRole = MOCK_USERS.find(user => user.role === role);
        $('#current-user-name').text(userForRole ? userForRole.name : 'Current User');

        // Update sidebar visibility
        $('.list-group-item[data-content]').each(function() {
            const accessList = $(this).data('role-access');
            $(this).toggle(accessList && accessList.includes(role));
        });
        
        const pendingRequests = MOCK_PRODUCT_REQUESTS.filter(r => r.status === 'Pending').length;
        $('#product-request-count').text(pendingRequests > 0 ? pendingRequests : '').toggle(pendingRequests > 0);

        const currentPage = $('#main-content').data('current-page');
        const isCurrentPageVisible = $(`.list-group-item[data-content="${currentPage}"]:visible`).length > 0;
        
        if (!isCurrentPageVisible) {
            loadContent(roleData.permissions[0] + '.html');
        } else {
            loadContent(currentPage);
        }
    }

    window.applyRoleVisibility = function() {
        $('[data-role-access]').each(function() {
            const accessList = $(this).data('role-access');
            $(this).toggle(accessList && accessList.includes(currentUserRole));
        });
    }

    /**
     * Loads a new content page into the main area. Made globally accessible for controllers.
     * @param {string} contentFile - The HTML file to load.
     */
    window.loadContent = function(contentFile) {
        if (!contentFile) return;
        $('#main-content').data('current-page', contentFile);

        const spinnerHtml = `<div class="d-flex justify-content-center align-items-center" style="height: 50vh;"><div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status"><span class="visually-hidden">Loading...</span></div></div>`;
        $('#main-content').html(spinnerHtml);

        $('#main-content').load(contentFile, function(response, status, xhr) {
            if (status === "error") {
                $(this).html(`<div class="alert alert-danger">Sorry, could not load the page: ${xhr.status} ${xhr.statusText}</div>`);
            } else {
                loadControllerForPage(contentFile);
            }
        });
    }

    /**
     * Loads the required controller script(s) for the current page on-demand.
     * @param {string} contentFile The page that was just loaded.
     */
    function loadControllerForPage(contentFile) {
        const controllerInfo = CONTROLLER_MAP[contentFile];

        if (controllerInfo) {
            $.getScript(controllerInfo.path)
                .done(function() {
                    const controller = window[controllerInfo.object];
                    if (controller && typeof controller.init === 'function') {
                        controller.init();
                    }
                    
                    const dependencies = {
                        'products.html': ['controllers/productRequestController.js'],
                        'pipeline.html': ['controllers/taskController.js'],
                        'quotes.html': ['controllers/productController.js']
                    };

                    if (dependencies[contentFile]) {
                        $.when(...dependencies[contentFile].map(dep => $.getScript(dep))).done(applyRoleVisibility);
                    } else {
                         applyRoleVisibility();
                    }
                })
                .fail(function() {
                    console.error(`Failed to load controller: ${controllerInfo.path}`);
                    $('#main-content').html(`<div class="alert alert-danger">Error loading page logic.</div>`);
                });
        } else {
            applyRoleVisibility();
        }
    }

    // =========================================================================
    // --- GLOBAL EVENT LISTENERS ---
    // =========================================================================
    function setupEventListeners() {
        // --- Navigation (Global) ---
        $('#sidebar-wrapper').on('click', '.list-group-item[data-content]', function(e) { 
            e.preventDefault(); 
            window.loadContent($(this).data('content')); 
            $('.list-group-item').removeClass('active'); 
            $(this).addClass('active'); 
        });
        $('#role-switcher').on('click', '.dropdown-item', function(e) { e.preventDefault(); setupRole($(this).data('role')); });
        $("#menu-toggle").click(function(e) { e.preventDefault(); $("#wrapper").toggleClass("toggled"); });
    }

    // =========================================================================
    // --- APPLICATION START ---
    // =========================================================================
    initializeApp();
});
