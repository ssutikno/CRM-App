$(document).ready(function() {
    // -- INITIALIZATION --

    // Load sidebar, modals, and initial page content
    $("#sidebar-wrapper").load("sidebar.html", function() {
        // Must re-attach nav listeners after sidebar loads
        attachNavListeners(); 
        // Set initial active state
        $('.list-group-item[data-page="dashboard.html"]').addClass('active').siblings().removeClass('active');
    });
    $("#modal-container").load("modals.html");
    $("#main-content").load("dashboard.html");


    // -- EVENT LISTENERS --

    // Sidebar toggle
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    /**
     * Attaches click listeners to the navigation links in the sidebar.
     * This needs to be a separate function because the sidebar is loaded dynamically.
     */
    function attachNavListeners() {
        $(".list-group-item").click(function(e) {
            e.preventDefault();

            // Get the page to load
            const page = $(this).data("page");

            // Update active class on sidebar
            $(this).addClass("active").siblings().removeClass("active");

            // Load the new content
            if (page) {
                $("#main-content").fadeOut(200, function() {
                    $(this).load(page, function() {
                        $(this).fadeIn(200);
                    });
                });
            }
        });
    }
});