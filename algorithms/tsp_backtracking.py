import time
import math

def solve_tsp(destinations, distance_matrix):
    """
    Solves the Travelling Salesperson Problem (TSP) using Backtracking with Pruning.
    
    Parameters:
    - destinations: list of destination names ['A', 'B', 'C', 'D']
    - distance_matrix: 2D list of distances (NxN)
    
    Returns:
    - dict containing best_route, min_cost, total_possible_routes, routes_explored,
      routes_pruned, search_logs, execution_time
    """
    start_time = time.perf_counter()
    
    n = len(destinations)
    if n < 2:
        raise ValueError("TSP requires at least 2 destinations.")
        
    best_cost = float('inf')
    best_route = []
    
    routes_explored = 0
    routes_pruned = 0
    search_logs = []
    
    # Calculate total possible distinct tours starting at origin (index 0)
    total_possible_routes = math.factorial(n - 1) if n > 1 else 1
    
    def backtrack(curr_node, count, current_cost, current_path, visited_mask):
        nonlocal best_cost, best_route, routes_explored, routes_pruned
        
        # Base Case: All destinations visited, return to start
        if count == n:
            return_cost = distance_matrix[curr_node][0]
            total_cost = current_cost + return_cost
            full_path = current_path + [0]
            routes_explored += 1
            
            route_names = " -> ".join([destinations[idx] for idx in full_path])
            
            if total_cost < best_cost:
                best_cost = total_cost
                best_route = full_path
                status = f"New Optimal Route Found (Cost = {best_cost:.2f})"
            else:
                status = "Explored (Completed Tour)"
                
            if len(search_logs) < 250:
                search_logs.append({
                    'route': route_names,
                    'cost': round(total_cost, 2),
                    'status': status
                })
            return
            
        # Recursive Step: Try visiting unvisited destinations
        for next_node in range(n):
            if not (visited_mask & (1 << next_node)):
                edge_cost = distance_matrix[curr_node][next_node]
                new_cost = current_cost + edge_cost
                
                # Format candidate path string for logging
                candidate_path = current_path + [next_node]
                candidate_str = " -> ".join([destinations[idx] for idx in candidate_path])
                
                # --- PRUNING CONDITION ---
                if new_cost >= best_cost:
                    routes_pruned += 1
                    if len(search_logs) < 250:
                        search_logs.append({
                            'route': f"{candidate_str} ...",
                            'cost': round(new_cost, 2),
                            'status': f"Pruned (Current Cost {new_cost:.2f} >= Best {best_cost:.2f})"
                        })
                    continue  # Prune branch
                
                # Recurse
                backtrack(next_node, count + 1, new_cost, candidate_path, visited_mask | (1 << next_node))

    # Start recursion from node 0 (origin)
    initial_path = [0]
    initial_mask = 1  # Bit 0 set
    backtrack(0, 1, 0.0, initial_path, initial_mask)
    
    end_time = time.perf_counter()
    execution_time = end_time - start_time
    
    best_route_names = " -> ".join([destinations[idx] for idx in best_route]) if best_route else ""
    
    return {
        'best_route': best_route_names,
        'best_route_indices': best_route,
        'destinations': destinations,
        'min_cost': round(best_cost, 2) if best_cost != float('inf') else 0,
        'total_possible_routes': total_possible_routes,
        'routes_explored': routes_explored,
        'routes_pruned': routes_pruned,
        'search_logs': search_logs,
        'execution_time': execution_time
    }
