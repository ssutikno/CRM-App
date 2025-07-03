// This file contains all logic related to the Dashboard module.

window.dashboardController = {
    /**
     * Initializes the dashboard page, populates stats and charts.
     */
    init: function() {
        this.populateStats();
        this.renderSalesChart();
        this.populateRecentActivity();
        this.setupEventListeners();
    },

    /**
     * Sets up event listeners for the dashboard page.
     */
    setupEventListeners: function() {
        // Use event delegation for links inside the dynamically loaded dashboard
        $('#main-content').on('click', '[data-content]', function(e) {
            e.preventDefault();
            const contentFile = $(this).data('content');
            
            // Navigate to the new page
            window.loadContent(contentFile);
            
            // Update the active state in the sidebar
            $('.list-group-item').removeClass('active');
            $(`.list-group-item[data-content="${contentFile}"]`).addClass('active');
        });
    },

    /**
     * Calculates and displays the key stat cards.
     */
    populateStats: function() {
        const newLeads = MOCK_LEADS.filter(l => l.status === 'New').length;
        const openDealsValue = MOCK_DEALS.filter(d => d.stage !== 'won' && d.stage !== 'lost')
                                        .reduce((sum, deal) => sum + deal.value, 0);
        
        const today = new Date('2025-07-03'); // Hardcoded "today" for consistent demo
        const tasksDue = MOCK_TASKS.filter(t => t.status === 'upcoming' && new Date(t.dueDate).toDateString() === today.toDateString()).length;
        
        const dealsClosingSoon = MOCK_DEALS.filter(d => {
            const closeDate = new Date(d.closeDate);
            const diffTime = closeDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays >= 0 && diffDays <= 7;
        }).length;

        $('#dashboard-new-leads').text(newLeads);
        $('#dashboard-open-deals').text(`$${(openDealsValue / 1000).toFixed(0)}k`);
        $('#dashboard-tasks-due').text(tasksDue);
        $('#dashboard-deals-closing').text(dealsClosingSoon);
    },

    /**
     * Renders the sales area chart.
     */
    renderSalesChart: function() {
        const ctx = document.getElementById("myAreaChart");
        if (!ctx) return;

        // Mock data for the chart
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["Mar 1", "Mar 5", "Mar 10", "Mar 15", "Mar 20", "Mar 25", "Mar 30"],
                datasets: [{
                    label: "Revenue",
                    lineTension: 0.3,
                    backgroundColor: "rgba(2,117,216,0.2)",
                    borderColor: "rgba(2,117,216,1)",
                    pointRadius: 5,
                    pointBackgroundColor: "rgba(2,117,216,1)",
                    pointBorderColor: "rgba(255,255,255,0.8)",
                    data: [10000, 15000, 26263, 18394, 28287, 28682, 31274],
                }],
            },
            options: {
                scales: {
                    xAxes: [{ time: { unit: 'date' }, gridLines: { display: false } }],
                    yAxes: [{ ticks: { min: 0, max: 40000, maxTicksLimit: 5 }, gridLines: { color: "rgba(0, 0, 0, .125)" } }],
                },
                legend: { display: false }
            }
        });
    },

    /**
     * Populates the recent activity feed.
     */
    populateRecentActivity: function() {
        const container = $('#dashboard-recent-activity');
        if (!container.length) return;

        // Combine and sort recent activities from different sources
        const allActivities = [
            ...MOCK_DEALS.map(d => ({ date: d.createdDate, text: `New Deal: <strong>${d.name}</strong> was created.` })),
            ...MOCK_LEADS.map(l => ({ date: '2025-07-01', text: `New Lead: <strong>${l.name}</strong> from ${l.company}.` })),
            ...MOCK_TASKS.filter(t => t.status === 'completed').map(t => ({ date: t.dueDate, text: `Task Completed: ${t.title.replace(/<[^>]*>?/gm, '')}` }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5); // Get latest 5

        const activityHtml = `<ul class="list-group list-group-flush">${allActivities.map(act => `<li class="list-group-item">${act.text}<span class="text-muted float-end small">${act.date}</span></li>`).join('')}</ul>`;
        container.html(activityHtml);
    }
};
