import time

def solve_job_sequencing(jobs):
    """
    Solves Job Sequencing with Deadlines using a Greedy approach.
    
    Parameters:
    - jobs: list of dicts [{'id': 'J1', 'deadline': 2, 'profit': 100}, ...]
    
    Returns:
    - dict containing sorted_jobs, selected_jobs, timeline_slots, total_profit, execution_time, greedy_note
    """
    start_time = time.perf_counter()
    
    # Format & validate inputs
    formatted_jobs = []
    for j in jobs:
        formatted_jobs.append({
            'id': str(j['id']),
            'deadline': int(j['deadline']),
            'profit': float(j['profit'])
        })
        
    # Step 1: Sort jobs in decreasing order of profit
    sorted_jobs = sorted(formatted_jobs, key=lambda x: x['profit'], reverse=True)
    
    # Step 2: Find maximum deadline to determine total slots
    max_deadline = max(j['deadline'] for j in formatted_jobs) if formatted_jobs else 0
    
    # Step 3: Initialize time slots array
    slots = [None] * max_deadline
    selected_jobs = []
    total_profit = 0.0
    
    # Step 4 & 5: Slot allocation for each job
    for job in sorted_jobs:
        # Find latest available slot before or at its deadline (1-based index to 0-based)
        for t in range(min(max_deadline, job['deadline']) - 1, -1, -1):
            if slots[t] is None:
                slots[t] = job
                selected_jobs.append(job)
                total_profit += job['profit']
                break
                
    # Prepare slot sequence summary for UI
    timeline_slots = []
    for i in range(max_deadline):
        timeline_slots.append({
            'slot_number': i + 1,
            'time_interval': f"Time {i} - {i + 1}",
            'assigned_job': slots[i]
        })
        
    end_time = time.perf_counter()
    execution_time = end_time - start_time
    
    return {
        'sorted_jobs': sorted_jobs,
        'selected_jobs': selected_jobs,
        'timeline_slots': timeline_slots,
        'total_profit': round(total_profit, 2),
        'max_deadline': max_deadline,
        'execution_time': execution_time,
        'greedy_note': "Greedy gives an optimal solution for the standard Job Sequencing with Deadlines formulation, but greedy algorithms do not guarantee optimality for every optimization problem."
    }
