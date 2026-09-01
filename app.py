import os
from flask import Flask, render_template, request, jsonify

# Import algorithm modules
from algorithms.knapsack import solve_knapsack
from algorithms.job_sequencing import solve_job_sequencing
from algorithms.tsp_backtracking import solve_tsp
from algorithms.complexity import get_complexity_analysis

app = Flask(__name__)

# -------------------------------------------------------------
# PAGE ROUTES (Serve HTML Views)
# -------------------------------------------------------------

@app.route('/')
def dashboard():
    return render_template('index.html')

@app.route('/knapsack')
def knapsack_page():
    return render_template('knapsack.html')

@app.route('/job-sequencing')
def job_sequencing_page():
    return render_template('job_sequencing.html')

@app.route('/tsp')
def tsp_page():
    return render_template('tsp.html')

@app.route('/complexity')
def complexity_page():
    return render_template('complexity.html')


# -------------------------------------------------------------
# API ENDPOINTS (Algorithm Solvers with Input Validation)
# -------------------------------------------------------------

@app.route('/api/knapsack', methods=['POST'])
def api_knapsack():
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({'success': False, 'error': 'No input data provided.'}), 400

        capacity = data.get('capacity')
        packages = data.get('packages', [])

        # Validate Capacity
        if capacity is None:
            return jsonify({'success': False, 'error': 'Vehicle capacity is required.'}), 400
        try:
            capacity = float(capacity)
            if capacity <= 0:
                return jsonify({'success': False, 'error': 'Vehicle capacity must be greater than 0.'}), 400
        except ValueError:
            return jsonify({'success': False, 'error': 'Capacity must be a valid number.'}), 400

        # Validate Packages
        if not packages or not isinstance(packages, list):
            return jsonify({'success': False, 'error': 'At least one package is required.'}), 400

        validated_packages = []
        for idx, pkg in enumerate(packages):
            pkg_id = str(pkg.get('id', f'P{idx+1}')).strip()
            if not pkg_id:
                pkg_id = f'P{idx+1}'

            weight = pkg.get('weight')
            profit = pkg.get('profit')

            if weight is None or profit is None:
                return jsonify({'success': False, 'error': f'Package {pkg_id} is missing weight or profit.'}), 400

            try:
                weight = float(weight)
                profit = float(profit)
            except ValueError:
                return jsonify({'success': False, 'error': f'Weight and profit for {pkg_id} must be numeric.'}), 400

            if weight <= 0:
                return jsonify({'success': False, 'error': f'Package {pkg_id}: Weight must be greater than 0.'}), 400
            if profit < 0:
                return jsonify({'success': False, 'error': f'Package {pkg_id}: Profit cannot be negative.'}), 400

            validated_packages.append({
                'id': pkg_id,
                'weight': int(weight),
                'profit': profit
            })

        # Solve Knapsack
        result = solve_knapsack(validated_packages, int(capacity))
        return jsonify({'success': True, 'data': result})

    except Exception as e:
        return jsonify({'success': False, 'error': f'Knapsack computation error: {str(e)}'}), 500


@app.route('/api/job-sequencing', methods=['POST'])
def api_job_sequencing():
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({'success': False, 'error': 'No input data provided.'}), 400

        jobs = data.get('jobs', [])
        if not jobs or not isinstance(jobs, list):
            return jsonify({'success': False, 'error': 'At least one job is required.'}), 400

        validated_jobs = []
        for idx, job in enumerate(jobs):
            job_id = str(job.get('id', f'J{idx+1}')).strip()
            if not job_id:
                return jsonify({'success': False, 'error': f'Job ID cannot be empty at row {idx+1}.'}), 400

            deadline = job.get('deadline')
            profit = job.get('profit')

            if deadline is None or profit is None:
                return jsonify({'success': False, 'error': f'Job {job_id} is missing deadline or profit.'}), 400

            try:
                deadline = int(deadline)
                profit = float(profit)
            except ValueError:
                return jsonify({'success': False, 'error': f'Job {job_id}: Deadline must be an integer and profit a number.'}), 400

            if deadline <= 0:
                return jsonify({'success': False, 'error': f'Job {job_id}: Deadline must be greater than 0.'}), 400
            if profit < 0:
                return jsonify({'success': False, 'error': f'Job {job_id}: Profit cannot be negative.'}), 400

            validated_jobs.append({
                'id': job_id,
                'deadline': deadline,
                'profit': profit
            })

        # Solve Job Sequencing
        result = solve_job_sequencing(validated_jobs)
        return jsonify({'success': True, 'data': result})

    except Exception as e:
        return jsonify({'success': False, 'error': f'Job sequencing computation error: {str(e)}'}), 500


@app.route('/api/tsp', methods=['POST'])
def api_tsp():
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({'success': False, 'error': 'No input data provided.'}), 400

        destinations = data.get('destinations', [])
        distance_matrix = data.get('distance_matrix', [])

        # Validate Destination Count
        if not destinations or not isinstance(destinations, list) or len(destinations) < 2:
            return jsonify({'success': False, 'error': 'TSP requires at least 2 destinations.'}), 400

        n = len(destinations)
        if n > 11:
            return jsonify({
                'success': False,
                'error': 'For interactive execution, maximum destinations supported is 11 due to O((n-1)!) search tree size.'
            }), 400

        # Validate Matrix Shape
        if not distance_matrix or len(distance_matrix) != n:
            return jsonify({'success': False, 'error': f'Distance matrix must have exactly {n} rows.'}), 400

        validated_matrix = []
        for i in range(n):
            row = distance_matrix[i]
            if not isinstance(row, list) or len(row) != n:
                return jsonify({'success': False, 'error': f'Row {i+1} must contain exactly {n} columns.'}), 400

            validated_row = []
            for j in range(n):
                val = row[j]
                try:
                    num_val = float(val)
                except (ValueError, TypeError):
                    return jsonify({'success': False, 'error': f'Matrix cell [{destinations[i]}][{destinations[j]}] must be numeric.'}), 400

                if num_val < 0:
                    return jsonify({'success': False, 'error': f'Distance from {destinations[i]} to {destinations[j]} cannot be negative.'}), 400

                if i == j and num_val != 0:
                    return jsonify({'success': False, 'error': f'Diagonal distance from {destinations[i]} to itself must be 0.'}), 400

                validated_row.append(num_val)
            validated_matrix.append(validated_row)

        # Solve TSP
        result = solve_tsp([str(d).strip() for d in destinations], validated_matrix)
        return jsonify({'success': True, 'data': result})

    except Exception as e:
        return jsonify({'success': False, 'error': f'TSP computation error: {str(e)}'}), 500


@app.route('/api/complexity', methods=['GET'])
def api_complexity():
    try:
        data = get_complexity_analysis()
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': f'Complexity data error: {str(e)}'}), 500


# -------------------------------------------------------------
# SERVER ENTRY POINT
# -------------------------------------------------------------
if __name__ == '__main__':
    # Run development server
    port = int(os.environ.get('PORT', 5000))
    print(f"🚀 Intelligent Optimization System Server running on http://127.0.0.1:{port}/")
    app.run(host='127.0.0.1', port=port, debug=True)
