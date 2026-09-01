/**
 * Intelligent Combinatorial Optimization and Decision System
 * Frontend JavaScript Controller (Dynamic DOM, Form Validation, & Fetch API)
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. KNAPSACK MODULE CONTROLLER
    // -------------------------------------------------------------
    const knapsackTableBody = document.getElementById('knapsack-tbody');
    const btnAddPackage = document.getElementById('btn-add-package');
    const btnSolveKnapsack = document.getElementById('btn-solve-knapsack');
    const btnClearKnapsack = document.getElementById('btn-clear-knapsack');
    const knapsackResults = document.getElementById('knapsack-results');
    const knapsackAlert = document.getElementById('knapsack-alert');

    if (btnAddPackage) {
        btnAddPackage.addEventListener('click', () => {
            const rowCount = knapsackTableBody.querySelectorAll('tr').length + 1;
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td><input type="text" class="form-control pkg-id" value="P${rowCount}" required></td>
                <td><input type="number" class="form-control pkg-weight" min="1" step="1" placeholder="e.g. 3" required></td>
                <td><input type="number" class="form-control pkg-profit" min="0" step="any" placeholder="e.g. 40" required></td>
                <td class="text-center">
                    <button type="button" class="btn btn-danger btn-sm btn-remove-pkg">✕</button>
                </td>
            `;
            knapsackTableBody.appendChild(newRow);
            attachKnapsackRemoveEvents();
        });
    }

    function attachKnapsackRemoveEvents() {
        if (!knapsackTableBody) return;
        knapsackTableBody.querySelectorAll('.btn-remove-pkg').forEach(btn => {
            btn.onclick = function () {
                const rows = knapsackTableBody.querySelectorAll('tr');
                if (rows.length > 1) {
                    this.closest('tr').remove();
                } else {
                    showAlert(knapsackAlert, 'At least one package is required.', 'danger');
                }
            };
        });
    }
    attachKnapsackRemoveEvents();

    const btnLoad20Sample = document.getElementById('btn-load-20-sample');
    if (btnLoad20Sample) {
        btnLoad20Sample.addEventListener('click', () => {
            const sample20 = [
                {id:'P1',weight:2,profit:30}, {id:'P2',weight:3,profit:40}, {id:'P3',weight:4,profit:50}, {id:'P4',weight:5,profit:60},
                {id:'P5',weight:1,profit:20}, {id:'P6',weight:6,profit:75}, {id:'P7',weight:3,profit:45}, {id:'P8',weight:2,profit:35},
                {id:'P9',weight:7,profit:90}, {id:'P10',weight:4,profit:55}, {id:'P11',weight:5,profit:65}, {id:'P12',weight:1,profit:25},
                {id:'P13',weight:6,profit:80}, {id:'P14',weight:3,profit:50}, {id:'P15',weight:2,profit:40}, {id:'P16',weight:7,profit:95},
                {id:'P17',weight:4,profit:60}, {id:'P18',weight:5,profit:70}, {id:'P19',weight:2,profit:45}, {id:'P20',weight:6,profit:85}
            ];
            document.getElementById('knapsack-capacity').value = '20';
            knapsackTableBody.innerHTML = sample20.map(p => `
                <tr>
                    <td><input type="text" class="form-control pkg-id" value="${p.id}" required></td>
                    <td><input type="number" class="form-control pkg-weight" value="${p.weight}" min="1" required></td>
                    <td><input type="number" class="form-control pkg-profit" value="${p.profit}" min="0" required></td>
                    <td class="text-center"><button type="button" class="btn btn-danger btn-sm btn-remove-pkg">✕</button></td>
                </tr>
            `).join('');
            attachKnapsackRemoveEvents();
            showAlert(knapsackAlert, 'Loaded 20 packages dataset with default capacity W=20. Click "Solve" to run!', 'info');
        });
    }

    if (btnClearKnapsack) {
        btnClearKnapsack.addEventListener('click', () => {
            document.getElementById('knapsack-capacity').value = '';
            knapsackTableBody.innerHTML = `
                <tr>
                    <td><input type="text" class="form-control pkg-id" value="P1" required></td>
                    <td><input type="number" class="form-control pkg-weight" value="2" min="1" required></td>
                    <td><input type="number" class="form-control pkg-profit" value="30" min="0" required></td>
                    <td class="text-center"><button type="button" class="btn btn-danger btn-sm btn-remove-pkg">✕</button></td>
                </tr>
            `;
            attachKnapsackRemoveEvents();
            if (knapsackResults) knapsackResults.style.display = 'none';
            hideAlert(knapsackAlert);
        });
    }

    if (btnSolveKnapsack) {
        btnSolveKnapsack.addEventListener('click', async () => {
            hideAlert(knapsackAlert);
            const capacityInput = document.getElementById('knapsack-capacity').value;
            const capacity = parseFloat(capacityInput);

            if (isNaN(capacity) || capacity <= 0) {
                showAlert(knapsackAlert, 'Please enter a valid positive vehicle capacity.', 'danger');
                return;
            }

            const packages = [];
            const rows = knapsackTableBody.querySelectorAll('tr');
            for (let row of rows) {
                const id = row.querySelector('.pkg-id').value.trim();
                const weight = parseFloat(row.querySelector('.pkg-weight').value);
                const profit = parseFloat(row.querySelector('.pkg-profit').value);

                if (!id) {
                    showAlert(knapsackAlert, 'Package ID cannot be empty.', 'danger');
                    return;
                }
                if (isNaN(weight) || weight <= 0) {
                    showAlert(knapsackAlert, `Package ${id} must have a weight > 0.`, 'danger');
                    return;
                }
                if (isNaN(profit) || profit < 0) {
                    showAlert(knapsackAlert, `Package ${id} must have profit ≥ 0.`, 'danger');
                    return;
                }

                packages.push({ id, weight, profit });
            }

            // Send request to Flask API
            btnSolveKnapsack.disabled = true;
            btnSolveKnapsack.innerText = 'Calculating...';

            try {
                const res = await fetch('/api/knapsack', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ capacity, packages })
                });
                const result = await res.json();

                if (!result.success) {
                    showAlert(knapsackAlert, result.error, 'danger');
                } else {
                    renderKnapsackResults(result.data);
                    // Save execution time benchmark
                    sessionStorage.setItem('time_knapsack', result.data.execution_time);
                }
            } catch (err) {
                showAlert(knapsackAlert, 'Server error: ' + err.message, 'danger');
            } finally {
                btnSolveKnapsack.disabled = false;
                btnSolveKnapsack.innerText = 'Solve 0/1 Knapsack';
            }
        });
    }

    function renderKnapsackResults(data) {
        if (!knapsackResults) return;
        document.getElementById('res-knapsack-profit').innerText = `$${data.max_profit}`;
        document.getElementById('res-knapsack-weight').innerText = `${data.total_weight} / ${data.capacity} units`;
        document.getElementById('res-knapsack-time').innerText = `${data.execution_time.toFixed(6)} s`;
        
        const selectedList = document.getElementById('res-knapsack-selected');
        if (data.selected_packages.length === 0) {
            selectedList.innerHTML = '<em>No packages selected (exceeds capacity)</em>';
        } else {
            selectedList.innerHTML = data.selected_packages
                .map(p => `<span class="badge badge-dp" style="margin-right: 6px; font-size: 0.95rem;">${p.id} (w=${p.weight}, p=${p.profit})</span>`)
                .join('');
        }

        // Render DP Table
        const dpThead = document.getElementById('dp-table-head');
        const dpTbody = document.getElementById('dp-table-body');
        
        // Header
        let headHtml = '<tr><th>Item / Capacity</th>';
        data.column_headers.forEach(w => {
            headHtml += `<th>w = ${w}</th>`;
        });
        headHtml += '</tr>';
        dpThead.innerHTML = headHtml;

        // Body
        let bodyHtml = '';
        data.dp_table.forEach((row, i) => {
            bodyHtml += `<tr><td><strong>${data.row_labels[i]}</strong></td>`;
            row.forEach(val => {
                bodyHtml += `<td>${val}</td>`;
            });
            bodyHtml += '</tr>';
        });
        dpTbody.innerHTML = bodyHtml;

        knapsackResults.style.display = 'block';
        knapsackResults.scrollIntoView({ behavior: 'smooth' });
    }


    // -------------------------------------------------------------
    // 2. JOB SEQUENCING MODULE CONTROLLER
    // -------------------------------------------------------------
    const jobTableBody = document.getElementById('job-tbody');
    const btnAddJob = document.getElementById('btn-add-job');
    const btnSolveJob = document.getElementById('btn-solve-job');
    const btnClearJob = document.getElementById('btn-clear-job');
    const jobResults = document.getElementById('job-results');
    const jobAlert = document.getElementById('job-alert');

    if (btnAddJob) {
        btnAddJob.addEventListener('click', () => {
            const rowCount = jobTableBody.querySelectorAll('tr').length + 1;
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td><input type="text" class="form-control job-id" value="J${rowCount}" required></td>
                <td><input type="number" class="form-control job-deadline" min="1" step="1" placeholder="e.g. 2" required></td>
                <td><input type="number" class="form-control job-profit" min="0" step="any" placeholder="e.g. 50" required></td>
                <td class="text-center">
                    <button type="button" class="btn btn-danger btn-sm btn-remove-job">✕</button>
                </td>
            `;
            jobTableBody.appendChild(newRow);
            attachJobRemoveEvents();
        });
    }

    function attachJobRemoveEvents() {
        if (!jobTableBody) return;
        jobTableBody.querySelectorAll('.btn-remove-job').forEach(btn => {
            btn.onclick = function () {
                const rows = jobTableBody.querySelectorAll('tr');
                if (rows.length > 1) {
                    this.closest('tr').remove();
                } else {
                    showAlert(jobAlert, 'At least one job is required.', 'danger');
                }
            };
        });
    }
    attachJobRemoveEvents();

    if (btnClearJob) {
        btnClearJob.addEventListener('click', () => {
            jobTableBody.innerHTML = `
                <tr>
                    <td><input type="text" class="form-control job-id" value="J1" required></td>
                    <td><input type="number" class="form-control job-deadline" value="2" min="1" required></td>
                    <td><input type="number" class="form-control job-profit" value="100" min="0" required></td>
                    <td class="text-center"><button type="button" class="btn btn-danger btn-sm btn-remove-job">✕</button></td>
                </tr>
            `;
            attachJobRemoveEvents();
            if (jobResults) jobResults.style.display = 'none';
            hideAlert(jobAlert);
        });
    }

    if (btnSolveJob) {
        btnSolveJob.addEventListener('click', async () => {
            hideAlert(jobAlert);
            const jobs = [];
            const rows = jobTableBody.querySelectorAll('tr');

            for (let row of rows) {
                const id = row.querySelector('.job-id').value.trim();
                const deadline = parseInt(row.querySelector('.job-deadline').value, 10);
                const profit = parseFloat(row.querySelector('.job-profit').value);

                if (!id) {
                    showAlert(jobAlert, 'Job ID cannot be empty.', 'danger');
                    return;
                }
                if (isNaN(deadline) || deadline <= 0) {
                    showAlert(jobAlert, `Job ${id} must have a positive integer deadline.`, 'danger');
                    return;
                }
                if (isNaN(profit) || profit < 0) {
                    showAlert(jobAlert, `Job ${id} must have profit ≥ 0.`, 'danger');
                    return;
                }

                jobs.push({ id, deadline, profit });
            }

            btnSolveJob.disabled = true;
            btnSolveJob.innerText = 'Sequencing...';

            try {
                const res = await fetch('/api/job-sequencing', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ jobs })
                });
                const result = await res.json();

                if (!result.success) {
                    showAlert(jobAlert, result.error, 'danger');
                } else {
                    renderJobResults(result.data);
                    sessionStorage.setItem('time_job', result.data.execution_time);
                }
            } catch (err) {
                showAlert(jobAlert, 'Server error: ' + err.message, 'danger');
            } finally {
                btnSolveJob.disabled = false;
                btnSolveJob.innerText = 'Solve Job Sequencing';
            }
        });
    }

    function renderJobResults(data) {
        if (!jobResults) return;
        document.getElementById('res-job-profit').innerText = `$${data.total_profit}`;
        document.getElementById('res-job-count').innerText = `${data.selected_jobs.length} Scheduled`;
        document.getElementById('res-job-time').innerText = `${data.execution_time.toFixed(6)} s`;

        // Sorted Jobs Table
        const sortedTbody = document.getElementById('sorted-jobs-tbody');
        sortedTbody.innerHTML = data.sorted_jobs.map((j, idx) => `
            <tr>
                <td>${idx + 1}</td>
                <td><strong>${j.id}</strong></td>
                <td>${j.deadline}</td>
                <td>$${j.profit}</td>
            </tr>
        `).join('');

        // Timeline Schedule Table
        const timelineTbody = document.getElementById('timeline-tbody');
        timelineTbody.innerHTML = data.timeline_slots.map(slot => {
            const jobBadge = slot.assigned_job 
                ? `<span class="badge badge-greedy">${slot.assigned_job.id} (Profit: $${slot.assigned_job.profit}, Deadline: ${slot.assigned_job.deadline})</span>`
                : '<span style="color: #94a3b8;"><em>[Unassigned / Idle Slot]</em></span>';
            return `
                <tr>
                    <td><strong>Slot ${slot.slot_number}</strong></td>
                    <td>${slot.time_interval}</td>
                    <td>${jobBadge}</td>
                </tr>
            `;
        }).join('');

        jobResults.style.display = 'block';
        jobResults.scrollIntoView({ behavior: 'smooth' });
    }


    // -------------------------------------------------------------
    // 3. TSP BACKTRACKING MODULE CONTROLLER
    // -------------------------------------------------------------
    const tspCountSelect = document.getElementById('tsp-count');
    const btnGenerateMatrix = document.getElementById('btn-generate-matrix');
    const btnSolveTsp = document.getElementById('btn-solve-tsp');
    const btnClearTsp = document.getElementById('btn-clear-tsp');
    const matrixContainer = document.getElementById('tsp-matrix-container');
    const tspResults = document.getElementById('tsp-results');
    const tspAlert = document.getElementById('tsp-alert');

    // Default Sample Matrices
    const defaultMatrices = {
        4: [
            [0, 10, 15, 20],
            [10, 0, 35, 25],
            [15, 35, 0, 30],
            [20, 25, 30, 0]
        ],
        5: [
            [0, 12, 10, 19, 8],
            [12, 0, 3, 7, 2],
            [10, 3, 0, 6, 20],
            [19, 7, 6, 0, 4],
            [8, 2, 20, 4, 0]
        ]
    };

    function generateMatrixGrid(n) {
        if (!matrixContainer) return;
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const labels = Array.from({ length: n }, (_, i) => alphabet[i] || `D${i+1}`);
        const defaultVals = defaultMatrices[n] || null;

        let tableHtml = '<table class="data-table"><thead><tr><th>Dest</th>';
        labels.forEach(l => { tableHtml += `<th class="text-center">${l}</th>`; });
        tableHtml += '</tr></thead><tbody>';

        for (let i = 0; i < n; i++) {
            tableHtml += `<tr><td><strong>${labels[i]}</strong></td>`;
            for (let j = 0; j < n; j++) {
                const isDiag = (i === j);
                const val = isDiag ? 0 : (defaultVals ? defaultVals[i][j] : (i < j ? (i + j) * 5 + 5 : 0));
                const readonlyAttr = isDiag ? 'readonly style="background-color: #f1f5f9; color: #94a3b8;"' : '';
                tableHtml += `
                    <td class="text-center">
                        <input type="number" class="form-control matrix-input tsp-cell" 
                               data-row="${i}" data-col="${j}" value="${val}" min="0" step="any" ${readonlyAttr} required>
                    </td>
                `;
            }
            tableHtml += '</tr>';
        }
        tableHtml += '</tbody></table>';
        matrixContainer.innerHTML = tableHtml;
    }

    if (btnGenerateMatrix && tspCountSelect) {
        btnGenerateMatrix.addEventListener('click', () => {
            const count = parseInt(tspCountSelect.value, 10);
            generateMatrixGrid(count);
            if (tspResults) tspResults.style.display = 'none';
            hideAlert(tspAlert);
        });
        // Initial build
        generateMatrixGrid(parseInt(tspCountSelect.value, 10));
    }

    if (btnClearTsp) {
        btnClearTsp.addEventListener('click', () => {
            if (tspCountSelect) {
                tspCountSelect.value = "4";
                generateMatrixGrid(4);
            }
            if (tspResults) tspResults.style.display = 'none';
            hideAlert(tspAlert);
        });
    }

    if (btnSolveTsp) {
        btnSolveTsp.addEventListener('click', async () => {
            hideAlert(tspAlert);
            const n = parseInt(tspCountSelect.value, 10);
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const destinations = Array.from({ length: n }, (_, i) => alphabet[i] || `D${i+1}`);

            const matrix = Array.from({ length: n }, () => Array(n).fill(0));
            const cells = matrixContainer.querySelectorAll('.tsp-cell');

            for (let cell of cells) {
                const r = parseInt(cell.getAttribute('data-row'), 10);
                const c = parseInt(cell.getAttribute('data-col'), 10);
                const val = parseFloat(cell.value);

                if (isNaN(val) || val < 0) {
                    showAlert(tspAlert, `Distance [${destinations[r]} → ${destinations[c]}] must be a non-negative number.`, 'danger');
                    return;
                }
                if (r === c && val !== 0) {
                    showAlert(tspAlert, `Diagonal distance for [${destinations[r]} → ${destinations[r]}] must be 0.`, 'danger');
                    return;
                }
                matrix[r][c] = val;
            }

            btnSolveTsp.disabled = true;
            btnSolveTsp.innerText = 'Backtracking & Pruning...';

            try {
                const res = await fetch('/api/tsp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ destinations, distance_matrix: matrix })
                });
                const result = await res.json();

                if (!result.success) {
                    showAlert(tspAlert, result.error, 'danger');
                } else {
                    renderTspResults(result.data);
                    sessionStorage.setItem('time_tsp', result.data.execution_time);
                }
            } catch (err) {
                showAlert(tspAlert, 'Server error: ' + err.message, 'danger');
            } finally {
                btnSolveTsp.disabled = false;
                btnSolveTsp.innerText = 'Solve TSP (Backtracking + Pruning)';
            }
        });
    }

    function renderTspResults(data) {
        if (!tspResults) return;
        document.getElementById('res-tsp-route').innerText = data.best_route;
        document.getElementById('res-tsp-cost').innerText = `${data.min_cost} units`;
        document.getElementById('res-tsp-possible').innerText = data.total_possible_routes.toLocaleString();
        document.getElementById('res-tsp-explored').innerText = data.routes_explored.toLocaleString();
        document.getElementById('res-tsp-pruned').innerText = data.routes_pruned.toLocaleString();
        document.getElementById('res-tsp-time').innerText = `${data.execution_time.toFixed(6)} s`;

        // Render Route Exploration Table
        const logTbody = document.getElementById('tsp-log-tbody');
        logTbody.innerHTML = data.search_logs.map(log => {
            let badgeClass = 'badge-explored';
            if (log.status.includes('Pruned')) badgeClass = 'badge-pruned';
            else if (log.status.includes('Optimal')) badgeClass = 'badge-optimal';

            return `
                <tr>
                    <td><code>${log.route}</code></td>
                    <td><strong>${log.cost}</strong></td>
                    <td><span class="badge ${badgeClass}">${log.status}</span></td>
                </tr>
            `;
        }).join('');

        tspResults.style.display = 'block';
        tspResults.scrollIntoView({ behavior: 'smooth' });
    }


    // -------------------------------------------------------------
    // 4. COMPLEXITY BENCHMARK CONTROLLER
    // -------------------------------------------------------------
    const benchKnapsack = document.getElementById('bench-knapsack-time');
    const benchJob = document.getElementById('bench-job-time');
    const benchTsp = document.getElementById('bench-tsp-time');

    if (benchKnapsack) {
        const tK = sessionStorage.getItem('time_knapsack');
        const tJ = sessionStorage.getItem('time_job');
        const tT = sessionStorage.getItem('time_tsp');

        benchKnapsack.innerText = tK ? `${parseFloat(tK).toFixed(6)} sec` : 'Not run yet (execute Knapsack module)';
        benchJob.innerText = tJ ? `${parseFloat(tJ).toFixed(6)} sec` : 'Not run yet (execute Job module)';
        benchTsp.innerText = tT ? `${parseFloat(tT).toFixed(6)} sec` : 'Not run yet (execute TSP module)';
    }


    // -------------------------------------------------------------
    // HELPER FUNCTIONS
    // -------------------------------------------------------------
    function showAlert(element, message, type = 'danger') {
        if (!element) return;
        element.className = `alert alert-${type}`;
        element.innerHTML = `<strong>${type.toUpperCase()}:</strong> ${message}`;
        element.style.display = 'block';
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function hideAlert(element) {
        if (!element) return;
        element.style.display = 'none';
    }
});
