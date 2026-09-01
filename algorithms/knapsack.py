import time

def solve_knapsack(packages, capacity):
    """
    Solves 0/1 Knapsack Problem using Dynamic Programming.
    
    Parameters:
    - packages: list of dicts [{'id': 'P1', 'weight': 2, 'profit': 30}, ...]
    - capacity: int/float vehicle capacity
    
    Returns:
    - dict containing max_profit, selected_packages, total_weight, dp_table, execution_time
    """
    start_time = time.perf_counter()
    
    n = len(packages)
    W = int(capacity)
    
    # Extract weights and profits
    weights = [int(p['weight']) for p in packages]
    profits = [float(p['profit']) for p in packages]
    
    # Initialize DP table ( (n+1) x (W+1) )
    dp = [[0.0 for _ in range(W + 1)] for _ in range(n + 1)]
    
    # Build DP table in bottom-up manner
    for i in range(1, n + 1):
        w_i = weights[i - 1]
        p_i = profits[i - 1]
        for w in range(W + 1):
            if w_i <= w:
                dp[i][w] = max(dp[i - 1][w], p_i + dp[i - 1][w - w_i])
            else:
                dp[i][w] = dp[i - 1][w]
                
    max_profit = dp[n][W]
    
    # Backtrack through DP table to identify selected items
    selected_packages = []
    w = W
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i - 1][w]:
            selected_packages.append(packages[i - 1])
            w -= weights[i - 1]
            
    selected_packages.reverse()  # Maintain original order
    total_weight = sum(p['weight'] for p in selected_packages)
    
    end_time = time.perf_counter()
    execution_time = end_time - start_time
    
    # Prepare row labels and column headers for UI display
    column_headers = list(range(W + 1))
    row_labels = ["0 (Initial)"] + [f"{p['id']} (w={p['weight']}, p={p['profit']})" for p in packages]
    
    return {
        'max_profit': round(max_profit, 2),
        'selected_packages': selected_packages,
        'total_weight': total_weight,
        'capacity': capacity,
        'dp_table': dp,
        'column_headers': column_headers,
        'row_labels': row_labels,
        'execution_time': execution_time
    }
