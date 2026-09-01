# Intelligent Combinatorial Optimization and Decision System

A comprehensive B.Tech Computer Science Capstone Project implementing, evaluating, and visualizing core combinatorial optimization algorithms for logistics and supply chain decision support.

---

## 1. Project Objective & Problem Statement

Modern logistics networks face complex operational challenges:
1. **Cargo Selection (0/1 Knapsack):** Choosing an optimal subset of packages to maximize profit without exceeding vehicle payload limits.
2. **Delivery Slot Scheduling (Job Sequencing):** Allocating single-processor time slots to time-constrained delivery tasks to maximize profit before deadlines.
3. **Route Planning (Travelling Salesperson Problem - TSP):** Computing the minimum-distance closed Hamiltonian cycle visiting multiple depots exactly once.
4. **Computational Complexity & Decision Theory:** Classifying and evaluating algorithms across **P, NP, NP-Hard, and NP-Complete** classes, contrasting optimization variants against decision variants, and measuring real-time microsecond performance.

---

## 2. Technologies Used

- **Backend:** Python 3.9+, Flask Web Framework
- **Frontend:** HTML5, CSS3 (Custom Responsive Academic Theme), JavaScript (ES6+ / Fetch API)
- **Development Tool:** Visual Studio Code (VS Code)

---

## 3. Project Structure

```text
Intelligent_Optimization_System/
│
├── app.py                      # Flask Application Server & API Routing
├── requirements.txt            # Python Dependencies
├── README.md                   # Complete Documentation & Viva Guide
│
├── algorithms/                 # Pure Algorithm Implementations (No external solvers)
│   ├── __init__.py
│   ├── knapsack.py             # 0/1 Knapsack DP + Backtracking
│   ├── job_sequencing.py       # Greedy Job Sequencing with Deadlines
│   ├── tsp_backtracking.py     # TSP Backtracking with Branch-and-Bound Pruning
│   └── complexity.py           # Complexity Classifications & Metrics
│
├── templates/                  # Responsive HTML5 Views
│   ├── index.html              # Main Dashboard
│   ├── knapsack.html           # Dynamic Programming Knapsack Interface
│   ├── job_sequencing.html     # Greedy Job Sequencing Interface
│   ├── tsp.html                # TSP Backtracking Interface
│   └── complexity.html         # Theoretical Complexity Matrix & Benchmarks
│
└── static/                     # Styling & Dynamic Client Scripts
    ├── style.css               # Professional CSS3 Academic Design
    └── script.js               # Dynamic Row/Matrix Handler & Fetch Controller
```

---

## 4. Module Descriptions & Algorithms

### Module 1: 0/1 Knapsack Problem (Dynamic Programming)
- **Algorithm:** Bottom-up 2D Matrix Formulation
- **Recurrence:**
  $$dp[i][w] = \max(dp[i-1][w], p_i + dp[i-1][w - w_i]) \quad \text{if } w_i \le w \text{ else } dp[i-1][w]$$
- **Item Extraction:** Backtracks from $dp[n][W]$ to extract selected items.
- **Time Complexity:** $O(n \times W)$ (Pseudo-polynomial)
- **Space Complexity:** $O(n \times W)$

### Module 2: Job Sequencing with Deadlines (Greedy)
- **Algorithm:** Profit-sorted greedy allocation to the latest available slot $t \le \min(D, d_i) - 1$.
- **Time Complexity:** $O(n \log n + n \times D)$
- **Space Complexity:** $O(D)$
- **Classification:** Class P (Polynomial Time)

### Module 3: Travelling Salesperson Problem (Backtracking + Pruning)
- **Algorithm:** Recursive search space traversal starting at Origin.
- **Pruning Condition:** Terminates sub-branch immediately when:
  $$\text{current\_cost} \ge \text{best\_cost}$$
- **Time Complexity:** $O((n-1)!)$ worst-case
- **Space Complexity:** $O(n)$ recursion stack

### Module 4: Complexity Analysis & Classification
- **P:** Solvable in polynomial time $O(n^k)$ by a deterministic Turing Machine.
- **NP:** Verifiable in polynomial time by a deterministic Turing Machine.
- **NP-Hard:** At least as hard as every problem in NP (Polynomial-time reduction $L \le_P H$).
- **NP-Complete:** Both in NP and NP-Hard.

---

## 5. VS Code Setup & How to Run

### Step 1: Clone or Open Project in VS Code
Open VS Code and navigate to `File > Open Folder...` and select `Intelligent_Optimization_System`.

### Step 2: Open Terminal & Create Virtual Environment
Press ``Ctrl + ` `` to open the VS Code Terminal, then execute:

```bash
# Create virtual environment
python -m venv venv

# Activate on Windows
venv\Scripts\activate
```

### Step 3: Install Required Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Run the Flask Web Application
```bash
python app.py
```

### Step 5: Open Web Browser
Open your browser and navigate to:
```text
http://127.0.0.1:5000/
```

---

## 6. Sample Test Inputs & Expected Outputs

### 1. 0/1 Knapsack
- **Capacity:** `7`
- **Packages:**
  - `P1`: Weight = `2`, Profit = `30`
  - `P2`: Weight = `3`, Profit = `40`
  - `P3`: Weight = `4`, Profit = `50`
  - `P4`: Weight = `5`, Profit = `60`
- **Expected Output:**
  - **Max Profit:** `$90.0`
  - **Selected Items:** `P2` and `P3` (Total Weight = `7` units)

### 2. Job Sequencing with Deadlines
- **Jobs:**
  - `J1`: Deadline = `2`, Profit = `100`
  - `J2`: Deadline = `1`, Profit = `80`
  - `J3`: Deadline = `2`, Profit = `60`
  - `J4`: Deadline = `3`, Profit = `70`
  - `J5`: Deadline = `1`, Profit = `40`
- **Expected Output:**
  - **Max Profit:** `$250.0`
  - **Schedule:** Slot 1 &rarr; `J2`, Slot 2 &rarr; `J1`, Slot 3 &rarr; `J4`

### 3. Travelling Salesperson Problem (TSP)
- **Destinations:** `4 (A, B, C, D)`
- **Distance Matrix:**
  ```text
       A   B   C   D
  A    0  10  15  20
  B   10   0  35  25
  C   15  35   0  30
  D   20  25  30   0
  ```
- **Expected Output:**
  - **Optimal Tour:** `A -> B -> D -> C -> A`
  - **Minimum Cost:** `80.0`
  - **Explored Routes:** `4`
  - **Pruned Branches:** `2`

---

## 7. Performance & Complexity Summary

| Algorithm | Paradigm | Time Complexity | Space Complexity | Optimization | Decision |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **0/1 Knapsack** | Dynamic Programming | $O(n \times W)$ | $O(n \times W)$ | NP-Hard | NP-Complete |
| **Job Sequencing** | Greedy | $O(n \log n + nD)$ | $O(D)$ | P | P |
| **TSP** | Backtracking + Pruning | $O((n-1)!)$ | $O(n)$ | NP-Hard | NP-Complete |

---

## 8. Future Enhancements

1. **Meta-Heuristics for Large TSP:** Implementing Genetic Algorithms (GA) and Ant Colony Optimization (ACO) for $n > 50$ destinations.
2. **Multi-Vehicle Routing Problem (VRP):** Extending the knapsack & TSP modules into a unified multi-vehicle dispatch engine.
3. **Disjoint Set Union (DSU) for Job Sequencing:** Optimizing greedy slot search to nearly linear $O(n \alpha(D))$ time.
