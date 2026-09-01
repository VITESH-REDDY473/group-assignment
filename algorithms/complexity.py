def get_complexity_analysis():
    """
    Returns comparative data, time/space complexities, and computational complexity
    classifications for all four system optimization modules.
    """
    return {
        'modules': [
            {
                'id': 'knapsack',
                'name': '0/1 Knapsack Problem',
                'technique': 'Dynamic Programming',
                'time_complexity': 'O(n × W)',
                'space_complexity': 'O(n × W)',
                'optimization_class': 'NP-Hard',
                'decision_class': 'NP-Complete',
                'nature': 'Pseudo-Polynomial Time',
                'description': (
                    'The 0/1 Knapsack problem is solved via 2D Dynamic Programming. '
                    'While its time complexity is expressed as O(nW), W is the numerical capacity value '
                    'rather than the input length in bits. Thus, it is classified as pseudo-polynomial. '
                    'The decision version is NP-Complete, and the optimization version is NP-Hard.'
                )
            },
            {
                'id': 'job_sequencing',
                'name': 'Job Sequencing with Deadlines',
                'technique': 'Greedy Algorithm',
                'time_complexity': 'O(n log n + n × D)',
                'space_complexity': 'O(D)',
                'optimization_class': 'P',
                'decision_class': 'P',
                'nature': 'Polynomial Time',
                'description': (
                    'Jobs are sorted by profit in O(n log n) time. Allocation across maximum deadline D '
                    'takes at most O(n × D) steps (which can be optimized to O(n α(D)) using Disjoint Set Union). '
                    'This standard formulation belongs to Class P as it is solvable in polynomial time.'
                )
            },
            {
                'id': 'tsp',
                'name': 'Travelling Salesperson Problem (TSP)',
                'technique': 'Backtracking + Pruning',
                'time_complexity': 'O((n-1)!) worst-case',
                'space_complexity': 'O(n) recursion stack',
                'optimization_class': 'NP-Hard',
                'decision_class': 'NP-Complete',
                'nature': 'Factorial Time',
                'description': (
                    'TSP visits every vertex once and returns to origin. Backtracking explores the search tree of size (n-1)!. '
                    'Bounding/pruning prunes suboptimal branches early when current cost ≥ best cost. '
                    'The decision variant ("Is there a tour of cost ≤ K?") is NP-Complete, making optimization NP-Hard.'
                )
            }
        ],
        'classifications': {
            'P': {
                'title': 'Class P (Polynomial Time)',
                'definition': 'Decision problems that can be solved by a deterministic Turing Machine in polynomial time O(n^k).',
                'example': 'Job Sequencing with Deadlines, Shortest Path (Dijkstra), Minimum Spanning Tree (Kruskal/Prim).'
            },
            'NP': {
                'title': 'Class NP (Nondeterministic Polynomial Time)',
                'definition': 'Decision problems for which a given certificate/solution can be verified in polynomial time by a deterministic Turing Machine.',
                'example': '0/1 Knapsack Decision, TSP Decision, Graph Coloring, Hamiltonian Cycle.'
            },
            'NP_Hard': {
                'title': 'NP-Hard (Nondeterministic Polynomial-Time Hard)',
                'definition': 'Problems at least as hard as the hardest problems in NP. Every problem in NP can be reduced to an NP-Hard problem in polynomial time. They do not need to be in NP.',
                'example': 'TSP Optimization, 0/1 Knapsack Optimization, Halting Problem.'
            },
            'NP_Complete': {
                'title': 'NP-Complete (Nondeterministic Polynomial-Time Complete)',
                'definition': 'Problems that belong to BOTH Class NP and Class NP-Hard. They represent the most difficult problems in NP.',
                'example': '0/1 Knapsack Decision Variant, TSP Decision Variant ("Is cost ≤ K?"), 3-SAT, Clique Problem.'
            }
        },
        'tsp_explanation': {
            'optimization': 'TSP Optimization: "Find the tour with absolute minimum total distance." -> NP-Hard',
            'decision': 'TSP Decision: "Given budget K, does there exist a tour with total distance ≤ K?" -> NP-Complete'
        }
    }
