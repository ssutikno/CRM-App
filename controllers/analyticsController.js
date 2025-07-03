// This file contains all logic related to the Analytics module.

window.analyticsController = {
    /**
     * Initializes the analytics page by generating all charts and stats.
     */
    init: function() {
        this.renderRevenueChart();
        this.renderWinLossChart();
        this.renderLeaderboard();
        this.calculateAndDisplayAvgCycleTime();
    },

    /**
     * Calculates and renders the quarterly revenue chart based on live deal data.
     */
    renderRevenueChart: function() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        // For this demo, we'll assume "this quarter" is Q3 2025 (July, Aug, Sep)
        const quarterMonths = { 'Jul': 0, 'Aug': 0, 'Sep': 0 };
        const actuals = { ...quarterMonths };
        const forecast = { ...quarterMonths };
        
        MOCK_DEALS.forEach(deal => {
            const closeDate = new Date(deal.closeDate);
            const month = closeDate.toLocaleString('default', { month: 'short' });

            // Check if the deal belongs to the current quarter
            if (quarterMonths[month] !== undefined) {
                if (deal.stage === 'won') {
                    actuals[month] += deal.value;
                } else if (deal.stage === 'proposal' || deal.stage === 'qualifying') {
                    forecast[month] += deal.value;
                }
            }
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(quarterMonths),
                datasets: [{
                    label: 'Actual Revenue',
                    data: Object.values(actuals),
                    backgroundColor: 'rgba(92, 184, 92, 0.7)',
                    borderColor: 'rgba(92, 184, 92, 1)',
                    borderWidth: 1
                }, {
                    label: 'Forecasted Revenue',
                    data: Object.values(forecast),
                    backgroundColor: 'rgba(2, 117, 216, 0.5)',
                    borderColor: 'rgba(2, 117, 216, 1)',
                    borderWidth: 1
                }]
            },
            options: { 
                scales: { 
                    y: { 
                        beginAtZero: true, 
                        ticks: { 
                            callback: value => `$${value / 1000}k` 
                        } 
                    } 
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    },

    /**
     * Calculates and renders the win/loss analysis pie chart.
     */
    renderWinLossChart: function() {
        const ctx = document.getElementById('winLossChart');
        if (!ctx) return;

        const wonCount = MOCK_DEALS.filter(d => d.stage === 'won').length;
        const lostCount = MOCK_DEALS.filter(d => d.stage === 'lost').length;
        const inProgressCount = MOCK_DEALS.filter(d => d.stage !== 'won' && d.stage !== 'lost').length;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Won', 'Lost', 'In Progress'],
                datasets: [{
                    data: [wonCount, lostCount, inProgressCount],
                    backgroundColor: ['#5cb85c', '#d9534f', '#f0ad4e'],
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    },

    /**
     * Calculates and renders the team performance leaderboard.
     */
    renderLeaderboard: function() {
        const tableBody = $('#leaderboard-table tbody');
        if (!tableBody.length) return;

        const salesData = {};
        MOCK_DEALS.filter(d => d.stage === 'won').forEach(deal => {
            if (!salesData[deal.owner]) {
                salesData[deal.owner] = { dealsWon: 0, revenue: 0 };
            }
            salesData[deal.owner].dealsWon++;
            salesData[deal.owner].revenue += deal.value;
        });

        const leaderboard = Object.entries(salesData)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.revenue - a.revenue);

        const tableHtml = leaderboard.map((person, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${person.name}</td>
                <td>${person.dealsWon}</td>
                <td>$${person.revenue.toLocaleString()}</td>
            </tr>
        `).join('');
        
        tableBody.html(tableHtml || '<tr><td colspan="4">No deals won yet.</td></tr>');
    },

    /**
     * Calculates and displays the average sales cycle time.
     */
    calculateAndDisplayAvgCycleTime: function() {
        const cycleTimeEl = $('#avg-cycle-time');
        if (!cycleTimeEl.length) return;

        const closedDeals = MOCK_DEALS.filter(d => d.stage === 'won' || d.stage === 'lost');
        if (closedDeals.length === 0) {
            cycleTimeEl.text('N/A');
            return;
        }

        const totalCycleDays = closedDeals.reduce((total, deal) => {
            const startDate = new Date(deal.createdDate);
            const closeDate = new Date(deal.closeDate);
            const diffTime = Math.abs(closeDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return total + diffDays;
        }, 0);

        const avgDays = Math.round(totalCycleDays / closedDeals.length);
        cycleTimeEl.text(`${avgDays} Days`);
    }
};
