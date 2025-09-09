<template>
  <div class="leaderboard">
    <!-- Header Section -->
    <section class="leaderboard-header">
      <div class="container">
        <div class="header-content fade-in-up">
          <h1 class="page-title">
            <i class="fas fa-trophy"></i>
            <span class="gradient-text">LeaderBoard</span>
          </h1>
          <p class="page-description">
            Performance rankings of AI models on GitTaskBench evaluation tasks
          </p>
        </div>
      </div>
    </section>

    <!-- Filters Section -->
    <section class="filters-section">
      <div class="container">
        <div class="filters-container card">
          <div class="filter-group">
            <label for="domain-filter">Domain:</label>
            <select id="domain-filter" v-model="selectedDomain" @change="filterResults">
              <option value="all">All Domains</option>
              <option v-for="domain in domains" :key="domain" :value="domain">
                {{ domain }}
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="metric-filter">Metric:</label>
            <select id="metric-filter" v-model="selectedMetric" @change="filterResults">
              <option value="overall">Overall Score</option>
              <option value="pass_rate">Pass Rate</option>
              <option value="code_quality">Code Quality</option>
              <option value="execution_time">Execution Time</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="model-type">Model Type:</label>
            <select id="model-type" v-model="selectedModelType" @change="filterResults">
              <option value="all">All Models</option>
              <option value="open-source">Open Source</option>
              <option value="proprietary">Proprietary</option>
            </select>
          </div>
          
          <button class="btn btn-secondary reset-btn" @click="resetFilters">
            <i class="fas fa-refresh"></i>
            Reset Filters
          </button>
        </div>
      </div>
    </section>

    <!-- Leaderboard Table -->
    <section class="leaderboard-table-section">
      <div class="container">
        <div class="table-container card">
          <div class="table-header">
            <h2>Model Performance Rankings</h2>
            <div class="table-info">
              <span class="result-count">{{ filteredResults.length }} models</span>
              <span class="last-updated">Last updated: {{ lastUpdated }}</span>
            </div>
          </div>
          
          <div class="table-wrapper">
            <table class="leaderboard-table">
              <thead>
                <tr>
                  <th class="rank-col">Rank</th>
                  <th class="model-col">Model</th>
                  <th class="score-col" @click="sortBy('overall_score')">
                    Overall Score
                    <i class="fas fa-sort" :class="getSortIcon('overall_score')"></i>
                  </th>
                  <th class="metric-col" @click="sortBy('pass_rate')">
                    Pass Rate
                    <i class="fas fa-sort" :class="getSortIcon('pass_rate')"></i>
                  </th>
                  <th class="metric-col" @click="sortBy('code_quality')">
                    Code Quality
                    <i class="fas fa-sort" :class="getSortIcon('code_quality')"></i>
                  </th>
                  <th class="metric-col" @click="sortBy('execution_time')">
                    Avg. Time (s)
                    <i class="fas fa-sort" :class="getSortIcon('execution_time')"></i>
                  </th>
                  <th class="action-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(model, index) in filteredResults" :key="model.id" class="model-row">
                  <td class="rank-col">
                    <div class="rank-badge" :class="getRankClass(index + 1)">
                      <span v-if="index < 3" class="rank-icon">
                        <i :class="getRankIcon(index + 1)"></i>
                      </span>
                      {{ index + 1 }}
                    </div>
                  </td>
                  <td class="model-col">
                    <div class="model-info">
                      <div class="model-name">{{ model.name }}</div>
                      <div class="model-details">
                        <span class="model-type" :class="model.type">{{ model.type }}</span>
                        <span class="model-version">{{ model.version }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="score-col">
                    <div class="score-display">
                      <span class="score-value">{{ model.overall_score.toFixed(2) }}</span>
                      <div class="score-bar">
                        <div class="score-fill" :style="{ width: model.overall_score + '%' }"></div>
                      </div>
                    </div>
                  </td>
                  <td class="metric-col">
                    <span class="metric-value">{{ (model.pass_rate * 100).toFixed(1) }}%</span>
                  </td>
                  <td class="metric-col">
                    <span class="metric-value">{{ model.code_quality.toFixed(2) }}</span>
                  </td>
                  <td class="metric-col">
                    <span class="metric-value">{{ model.execution_time.toFixed(2) }}</span>
                  </td>
                  <td class="action-col">
                    <button class="btn-icon" @click="viewDetails(model)" title="View Details">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" @click="compareModel(model)" title="Compare">
                      <i class="fas fa-balance-scale"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="statistics-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card card">
            <div class="stat-icon">
              <i class="fas fa-robot"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ totalModels }}</div>
              <div class="stat-label">Models Evaluated</div>
            </div>
          </div>
          
          <div class="stat-card card">
            <div class="stat-icon">
              <i class="fas fa-tasks"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ totalTasks }}</div>
              <div class="stat-label">Benchmark Tasks</div>
            </div>
          </div>
          
          <div class="stat-card card">
            <div class="stat-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ averageScore.toFixed(1) }}</div>
              <div class="stat-label">Average Score</div>
            </div>
          </div>
          
          <div class="stat-card card">
            <div class="stat-icon">
              <i class="fas fa-crown"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ topScore.toFixed(1) }}</div>
              <div class="stat-label">Highest Score</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'LeaderBoard',
  data() {
    return {
      selectedDomain: 'all',
      selectedMetric: 'overall',
      selectedModelType: 'all',
      sortColumn: 'overall_score',
      sortDirection: 'desc',
      lastUpdated: '2024-01-15',
      
      domains: [
        'Machine Learning',
        'Web Development',
        'Data Processing',
        'Computer Vision',
        'Natural Language Processing',
        'System Utilities',
        'API Development',
        'Database Management'
      ],
      
      leaderboardData: [
        {
          id: 1,
          name: 'GPT-4 Turbo',
          version: 'v1.0',
          type: 'proprietary',
          overall_score: 89.5,
          pass_rate: 0.87,
          code_quality: 4.2,
          execution_time: 2.3
        },
        {
          id: 2,
          name: 'Claude-3 Opus',
          version: 'v3.0',
          type: 'proprietary',
          overall_score: 87.2,
          pass_rate: 0.85,
          code_quality: 4.1,
          execution_time: 2.1
        },
        {
          id: 3,
          name: 'CodeLlama-34B',
          version: 'v2.0',
          type: 'open-source',
          overall_score: 82.7,
          pass_rate: 0.79,
          code_quality: 3.8,
          execution_time: 3.2
        },
        {
          id: 4,
          name: 'Gemini Pro',
          version: 'v1.5',
          type: 'proprietary',
          overall_score: 81.3,
          pass_rate: 0.78,
          code_quality: 3.9,
          execution_time: 2.8
        },
        {
          id: 5,
          name: 'StarCoder-15B',
          version: 'v1.0',
          type: 'open-source',
          overall_score: 76.8,
          pass_rate: 0.72,
          code_quality: 3.6,
          execution_time: 4.1
        },
        {
          id: 6,
          name: 'DeepSeek-Coder',
          version: 'v1.3',
          type: 'open-source',
          overall_score: 74.2,
          pass_rate: 0.69,
          code_quality: 3.5,
          execution_time: 3.8
        },
        {
          id: 7,
          name: 'WizardCoder-15B',
          version: 'v1.0',
          type: 'open-source',
          overall_score: 71.5,
          pass_rate: 0.65,
          code_quality: 3.3,
          execution_time: 4.5
        },
        {
          id: 8,
          name: 'PaLM-Coder',
          version: 'v2.0',
          type: 'proprietary',
          overall_score: 69.8,
          pass_rate: 0.63,
          code_quality: 3.4,
          execution_time: 3.1
        }
      ]
    }
  },
  
  computed: {
    filteredResults() {
      let results = [...this.leaderboardData]
      
      // Filter by model type
      if (this.selectedModelType !== 'all') {
        results = results.filter(model => model.type === this.selectedModelType)
      }
      
      // Sort results
      results.sort((a, b) => {
        const aVal = a[this.sortColumn]
        const bVal = b[this.sortColumn]
        
        if (this.sortDirection === 'desc') {
          return bVal - aVal
        } else {
          return aVal - bVal
        }
      })
      
      return results
    },
    
    totalModels() {
      return this.leaderboardData.length
    },
    
    totalTasks() {
      return 164
    },
    
    averageScore() {
      const sum = this.leaderboardData.reduce((acc, model) => acc + model.overall_score, 0)
      return sum / this.leaderboardData.length
    },
    
    topScore() {
      return Math.max(...this.leaderboardData.map(model => model.overall_score))
    }
  },
  
  methods: {
    filterResults() {
      // Filter logic would be implemented here
      console.log('Filtering results...')
    },
    
    resetFilters() {
      this.selectedDomain = 'all'
      this.selectedMetric = 'overall'
      this.selectedModelType = 'all'
    },
    
    sortBy(column) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'desc' ? 'asc' : 'desc'
      } else {
        this.sortColumn = column
        this.sortDirection = 'desc'
      }
    },
    
    getSortIcon(column) {
      if (this.sortColumn !== column) return ''
      return this.sortDirection === 'desc' ? 'fa-sort-down' : 'fa-sort-up'
    },
    
    getRankClass(rank) {
      if (rank === 1) return 'gold'
      if (rank === 2) return 'silver'
      if (rank === 3) return 'bronze'
      return ''
    },
    
    getRankIcon(rank) {
      if (rank === 1) return 'fas fa-crown'
      if (rank === 2) return 'fas fa-medal'
      if (rank === 3) return 'fas fa-award'
      return ''
    },
    
    viewDetails(model) {
      console.log('Viewing details for:', model.name)
      // Would open a modal or navigate to detail page
    },
    
    compareModel(model) {
      console.log('Comparing model:', model.name)
      // Would add to comparison list
    }
  }
}
</script>

<style scoped>
.leaderboard {
  min-height: 100vh;
  padding-bottom: 80px;
}

/* Header Section */
.leaderboard-header {
  padding: 120px 0 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.leaderboard-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 30% 30%, rgba(120, 119, 198, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(255, 119, 198, 0.2) 0%, transparent 50%);
  z-index: -1;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.page-title i {
  font-size: 2.5rem;
  color: #ffd700;
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-description {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto;
}

/* Filters Section */
.filters-section {
  padding: 0 0 40px;
}

.filters-container {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  color: white;
  font-weight: 500;
  white-space: nowrap;
}

.filter-group select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 8px 12px;
  color: white;
  font-size: 14px;
  min-width: 150px;
}

.filter-group select option {
  background: #333;
  color: white;
}

.reset-btn {
  margin-left: auto;
}

/* Leaderboard Table */
.leaderboard-table-section {
  padding: 40px 0;
}

.table-container {
  padding: 0;
  overflow: hidden;
}

.table-header {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.table-header h2 {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.table-info {
  display: flex;
  gap: 24px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.table-wrapper {
  overflow-x: auto;
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
}

.leaderboard-table th {
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-weight: 600;
  padding: 16px 12px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: background 0.3s ease;
  white-space: nowrap;
}

.leaderboard-table th:hover {
  background: rgba(255, 255, 255, 0.1);
}

.leaderboard-table th i {
  margin-left: 4px;
  opacity: 0.5;
}

.leaderboard-table td {
  padding: 16px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
}

.model-row:hover {
  background: rgba(255, 255, 255, 0.02);
}

.rank-col {
  width: 80px;
  text-align: center;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
}

.rank-badge.gold {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #333;
}

.rank-badge.silver {
  background: linear-gradient(135deg, #c0c0c0, #e5e5e5);
  color: #333;
}

.rank-badge.bronze {
  background: linear-gradient(135deg, #cd7f32, #deb887);
  color: #333;
}

.model-col {
  min-width: 200px;
}

.model-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.model-name {
  font-weight: 600;
  color: white;
}

.model-details {
  display: flex;
  gap: 8px;
  align-items: center;
}

.model-type {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.model-type.open-source {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.model-type.proprietary {
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
}

.model-version {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.score-col {
  min-width: 150px;
}

.score-display {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.score-value {
  font-weight: 600;
  color: white;
}

.score-bar {
  width: 100px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.metric-col {
  min-width: 100px;
  text-align: center;
}

.metric-value {
  font-weight: 500;
}

.action-col {
  width: 100px;
  text-align: center;
}

.btn-icon {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  padding: 8px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 2px;
}

.btn-icon:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-1px);
}

/* Statistics Section */
.statistics-section {
  padding: 80px 0;
  background: rgba(255, 255, 255, 0.02);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 4px;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
    flex-direction: column;
    gap: 8px;
  }
  
  .filters-container {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
  }
  
  .filter-group select {
    min-width: auto;
  }
  
  .table-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .table-info {
    justify-content: space-between;
  }
  
  .leaderboard-table th,
  .leaderboard-table td {
    padding: 12px 8px;
    font-size: 14px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 20px;
    gap: 16px;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
}
</style>
