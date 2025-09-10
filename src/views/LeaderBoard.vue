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

    <!-- Chart Section -->
    <section class="chart-section">
      <div class="container">
        <div class="chart-container card">
          <div class="chart-header">
            <h2>Performance Comparison Chart</h2>
            <p class="chart-description">ECR (Error Correction Rate) comparison across different Framework+LLM
              combinations</p>
          </div>
          <div class="chart-wrapper">
            <div ref="chartContainer" class="chart" style="width: 100%; height: 500px;"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Blocks Section -->
    <section class="content-blocks-section">
      <div class="container">
        <div class="content-blocks-grid">
          <!-- Paper Block -->
          <div class="content-block card">
            <div class="content-icon">
              <i class="fas fa-file-alt"></i>
            </div>
            <div class="content-text">
              <div class="content-main">
                <h3>Research Paper</h3>
                <p>Explore our detailed research paper to understand GitTaskBench's evaluation methodology and
                  experimental results</p>
              </div>
              <a href="https://arxiv.org/pdf/2508.18993" class="content-link" target="_blank" rel="noopener noreferrer">
                <span>Read Paper</span>
                <i class="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>

          <!-- HuggingFace Block -->
          <div class="content-block card">
            <div class="content-icon">
              <i class="fas fa-heart"></i>
            </div>
            <div class="content-text">
              <div class="content-main">
                <h3>HuggingFace</h3>
                <p>Explore our datasets and models on HuggingFace Hub and join the community discussions</p>
              </div>
              <a href="https://huggingface.co/QuantaAlpha" class="content-link" target="_blank"
                rel="noopener noreferrer">
                <span>Visit Hub</span>
                <i class="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>

          <!-- Submit Model Block -->
          <div class="content-block card">
            <div class="content-icon">
              <i class="fas fa-upload"></i>
            </div>
            <div class="content-text">
              <div class="content-main">
                <h3>Submit Model</h3>
                <p>Submit your model for evaluation and join the GitTaskBench leaderboard to showcase your results</p>
              </div>
              <a href="#" class="content-link">
                <span>Submit Model</span>
                <i class="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters Section -->
    <section class="filters-section">
      <div class="container">
        <div class="filters-container card">
          <div class="filter-group">
            <label for="framework-filter">Framework:</label>
            <div class="custom-dropdown" @click="toggleDropdown('framework')"
              :class="{ 'active': activeDropdown === 'framework' }">
              <div class="dropdown-selected">
                <span>{{ getSelectedFrameworkText() }}</span>
                <i class="fas fa-chevron-down dropdown-arrow"></i>
              </div>
              <div class="dropdown-options" v-show="activeDropdown === 'framework'">
                <div class="dropdown-option" v-for="framework in frameworks" :key="framework" :value="framework"
                  @click.stop="selectFramework(framework)" :class="{ 'selected': selectedFramework === framework }">
                  {{ framework }}
                </div>
                <div class="dropdown-option" value="all" @click.stop="selectFramework('all')"
                  :class="{ 'selected': selectedFramework === 'all' }">
                  All Frameworks
                </div>
              </div>
            </div>
          </div>

          <div class="filter-group">
            <label for="model-type">Model Type:</label>
            <div class="custom-dropdown" @click="toggleDropdown('modelType')"
              :class="{ 'active': activeDropdown === 'modelType' }">
              <div class="dropdown-selected">
                <span>{{ getSelectedModelTypeText() }}</span>
                <i class="fas fa-chevron-down dropdown-arrow"></i>
              </div>
              <div class="dropdown-options" v-show="activeDropdown === 'modelType'">
                <div class="dropdown-option" value="all" @click.stop="selectModelType('all')"
                  :class="{ 'selected': selectedModelType === 'all' }">
                  All Models
                </div>
                <div class="dropdown-option" value="open-source" @click.stop="selectModelType('open-source')"
                  :class="{ 'selected': selectedModelType === 'open-source' }">
                  Open Source
                </div>
                <div class="dropdown-option" value="proprietary" @click.stop="selectModelType('proprietary')"
                  :class="{ 'selected': selectedModelType === 'proprietary' }">
                  Proprietary
                </div>
              </div>
            </div>
          </div>

          <div class="filter-group">
            <label for="metric-filter">Sort By:</label>
            <div class="custom-dropdown" @click="toggleDropdown('sortColumn')"
              :class="{ 'active': activeDropdown === 'sortColumn' }">
              <div class="dropdown-selected">
                <span>{{ getSelectedSortText() }}</span>
                <i class="fas fa-chevron-down dropdown-arrow"></i>
              </div>
              <div class="dropdown-options" v-show="activeDropdown === 'sortColumn'">
                <div class="dropdown-option" value="ecr" @click.stop="selectSortColumn('ecr')"
                  :class="{ 'selected': sortColumn === 'ecr' }">
                  ECR
                </div>
                <div class="dropdown-option" value="tpr" @click.stop="selectSortColumn('tpr')"
                  :class="{ 'selected': sortColumn === 'tpr' }">
                  TPR
                </div>
                <div class="dropdown-option" value="inputTokens" @click.stop="selectSortColumn('inputTokens')"
                  :class="{ 'selected': sortColumn === 'inputTokens' }">
                  Input Tokens
                </div>
                <div class="dropdown-option" value="outputTokens" @click.stop="selectSortColumn('outputTokens')"
                  :class="{ 'selected': sortColumn === 'outputTokens' }">
                  Output Tokens
                </div>
                <div class="dropdown-option" value="cost" @click.stop="selectSortColumn('cost')"
                  :class="{ 'selected': sortColumn === 'cost' }">
                  Cost
                </div>
              </div>
            </div>
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
                  <th class="model-col">Framework+LLM</th>
                  <th class="metric-col" @click="sortBy('ecr')">
                    ECR (%)
                    <i class="fas fa-sort" :class="getSortIcon('ecr')"></i>
                  </th>
                  <th class="metric-col" @click="sortBy('tpr')">
                    TPR (%)
                    <i class="fas fa-sort" :class="getSortIcon('tpr')"></i>
                  </th>
                  <th class="metric-col" @click="sortBy('inputTokens')">
                    Input Tokens (k)
                    <i class="fas fa-sort" :class="getSortIcon('inputTokens')"></i>
                  </th>
                  <th class="metric-col" @click="sortBy('outputTokens')">
                    Output Tokens
                    <i class="fas fa-sort" :class="getSortIcon('outputTokens')"></i>
                  </th>
                  <th class="metric-col" @click="sortBy('cost')">
                    Cost ($)
                    <i class="fas fa-sort" :class="getSortIcon('cost')"></i>
                  </th>
                  <!-- <th class="action-col">Actions</th> -->
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
                        <span class="framework-name">{{ model.framework }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="metric-col">
                    <span class="metric-value">{{ model.ecr.toFixed(2) }}%</span>
                  </td>
                  <td class="metric-col">
                    <span class="metric-value">{{ model.tpr.toFixed(2) }}%</span>
                  </td>
                  <td class="metric-col">
                    <span class="metric-value">{{ model.inputTokens.toFixed(2) }}</span>
                  </td>
                  <td class="metric-col">
                    <span class="metric-value">{{ model.outputTokens.toFixed(0) }}</span>
                  </td>
                  <td class="metric-col">
                    <span class="metric-value">{{ model.cost === '-' ? '-' : '$' + model.cost }}</span>
                  </td>
                  <!-- <td class="action-col">
                    <button class="btn-icon" @click="viewDetails(model)" title="View Details">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" @click="compareModel(model)" title="Compare">
                      <i class="fas fa-balance-scale"></i>
                    </button>
                  </td> -->
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
              <div class="stat-number">{{ averageECR.toFixed(1) }}%</div>
              <div class="stat-label">Average ECR</div>
            </div>
          </div>

          <div class="stat-card card">
            <div class="stat-icon">
              <i class="fas fa-crown"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ topECR.toFixed(1) }}%</div>
              <div class="stat-label">Highest ECR</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'LeaderBoard',
  data() {
    return {
      selectedDomain: 'all',
      selectedFramework: 'all',
      selectedMetric: 'overall',
      selectedModelType: 'all',
      sortColumn: 'ecr',
      sortDirection: 'desc',
      lastUpdated: '2024-01-15',
      chartInstance: null,
      activeDropdown: null,

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

      // CSV数据
      csvData: [
        { Framework: 'Aider', LLM: 'GPT-4o', ECR: 5.56, TPR: 1.85, InputTokens: 10.67, OutputTokens: 492.67, Cost: 0.0316 },
        { Framework: 'Aider', LLM: 'GPT-4.1', ECR: 11.11, TPR: 7.41, InputTokens: 14.83, OutputTokens: 734.17, Cost: 0.0355 },
        { Framework: 'Aider', LLM: 'Claude 3.5', ECR: 16.67, TPR: 12.96, InputTokens: 7.48, OutputTokens: 534.00, Cost: 0.0304 },
        { Framework: 'Aider', LLM: 'DeepSeekV3', ECR: 20.37, TPR: 16.67, InputTokens: 7.51, OutputTokens: 599.64, Cost: 0.00269 },
        { Framework: 'SWE-Agent', LLM: 'GPT-4o', ECR: 17.58, TPR: 10.19, InputTokens: 275.53, OutputTokens: 1282.70, Cost: 0.778 },
        { Framework: 'SWE-Agent', LLM: 'GPT-4.1', ECR: 38.89, TPR: 31.48, InputTokens: 301.11, OutputTokens: 2098.33, Cost: 0.661 },
        { Framework: 'SWE-Agent', LLM: 'o3-mini', ECR: 25.93, TPR: 20.37, InputTokens: 158.45, OutputTokens: 215.20, Cost: 0.175 },
        { Framework: 'SWE-Agent', LLM: 'Claude 3.5', ECR: 41.67, TPR: 22.23, InputTokens: 455.34, OutputTokens: 943.30, Cost: 1.38 },
        { Framework: 'SWE-Agent', LLM: 'Claude 3.7', ECR: 64.81, TPR: 42.59, InputTokens: 552.79, OutputTokens: 807.63, Cost: 1.67 },
        { Framework: 'SWE-Agent', LLM: 'DeepSeekV3', ECR: 18.52, TPR: 12.04, InputTokens: 412.65, OutputTokens: 1649.82, Cost: 0.113 },
        { Framework: 'SWE-Agent', LLM: 'Qwen3-32b*', ECR: 7.41, TPR: 3.70, InputTokens: 1445.97, OutputTokens: 2405.00, Cost: '-' },
        { Framework: 'SWE-Agent', LLM: 'Qwen3-32b*†', ECR: 16.67, TPR: 11.11, InputTokens: 124.15, OutputTokens: 559.11, Cost: '-' },
        { Framework: 'SWE-Agent', LLM: 'Llama3.3-70b*', ECR: 25.83, TPR: 18.52, InputTokens: 397.03, OutputTokens: 1985.64, Cost: '-' },
        { Framework: 'OpenHands', LLM: 'GPT-4o', ECR: 21.30, TPR: 14.82, InputTokens: 760.53, OutputTokens: 3990.31, Cost: 1.94 },
        { Framework: 'OpenHands', LLM: 'GPT-4.1', ECR: 55.56, TPR: 42.59, InputTokens: 465.94, OutputTokens: 1535.47, Cost: 0.942 },
        { Framework: 'OpenHands', LLM: 'o3-mini', ECR: 29.63, TPR: 22.22, InputTokens: 2523.53, OutputTokens: 183637.53, Cost: 3.58 },
        { Framework: 'OpenHands', LLM: 'Claude 3.5', ECR: 53.70, TPR: 40.74, InputTokens: 2858.00, OutputTokens: 24929.47, Cost: 8.95 },
        { Framework: 'OpenHands', LLM: 'Claude 3.7', ECR: 72.22, TPR: 48.15, InputTokens: 9501.25, OutputTokens: 85033.05, Cost: 29.8 },
        { Framework: 'OpenHands', LLM: 'Gemini-2.5-pro', ECR: 51.85, TPR: 35.19, InputTokens: 760.88, OutputTokens: 35173.29, Cost: 2.18 },
        { Framework: 'OpenHands', LLM: 'DeepSeekV3', ECR: 45.37, TPR: 26.85, InputTokens: 4717.78, OutputTokens: 31957.67, Cost: 1.31 },
        { Framework: 'OpenHands', LLM: 'Qwen3-8b*', ECR: 1.85, TPR: 1.85, InputTokens: 846.26, OutputTokens: 2045.00, Cost: '-' },
        { Framework: 'OpenHands', LLM: 'Qwen3-14b*', ECR: 11.11, TPR: 5.56, InputTokens: 339.42, OutputTokens: 2540.17, Cost: '-' },
        { Framework: 'OpenHands', LLM: 'Qwen3-32b*', ECR: 35.19, TPR: 25.93, InputTokens: 591.02, OutputTokens: 2097.89, Cost: '-' },
        { Framework: 'OpenHands', LLM: 'Qwen3-32b*†', ECR: 44.44, TPR: 29.63, InputTokens: 208.00, OutputTokens: 8755.35, Cost: '-' },
        { Framework: 'OpenHands', LLM: 'Llama3.3-70b*', ECR: 27.78, TPR: 20.37, InputTokens: 132.69, OutputTokens: 872.93, Cost: '-' }
      ],

      // 从CSV数据生成表格数据
      leaderboardData: []
    }
  },

  computed: {
    // 从CSV数据生成表格数据
    tableData() {
      return this.csvData.map((item, index) => ({
        id: index + 1,
        name: `${item.Framework}+${item.LLM}`,
        framework: item.Framework,
        llm: item.LLM,
        ecr: item.ECR,
        tpr: item.TPR,
        inputTokens: item.InputTokens,
        outputTokens: item.OutputTokens,
        cost: item.Cost,
        type: this.getModelType(item.LLM)
      }))
    },

    // 图表数据 - 按ECR排序（从低到高）
    chartData() {
      const sortedData = [...this.csvData].sort((a, b) => a.ECR - b.ECR)

      return {
        categories: sortedData.map(item => `${item.Framework}+${item.LLM}`),
        ecrValues: sortedData.map(item => item.ECR),
        fullData: sortedData
      }
    },

    filteredResults() {
      let results = [...this.tableData]

      // Filter by framework
      if (this.selectedFramework !== 'all') {
        results = results.filter(model => model.framework === this.selectedFramework)
      }

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
      return this.tableData.length
    },

    totalTasks() {
      return 164
    },

    averageECR() {
      const validECRs = this.tableData.filter(model => !isNaN(model.ecr))
      const sum = validECRs.reduce((acc, model) => acc + model.ecr, 0)
      return sum / validECRs.length
    },

    topECR() {
      const validECRs = this.tableData.filter(model => !isNaN(model.ecr))
      return Math.max(...validECRs.map(model => model.ecr))
    },

    frameworks() {
      return [...new Set(this.csvData.map(item => item.Framework))]
    }
  },

  methods: {
    // 根据LLM名称判断模型类型
    getModelType(llm) {
      const openSourceModels = ['DeepSeekV3', 'Qwen3-8b*', 'Qwen3-14b*', 'Qwen3-32b*', 'Qwen3-32b*†', 'Llama3.3-70b*']
      return openSourceModels.some(model => llm.includes(model)) ? 'open-source' : 'proprietary'
    },

    // 初始化图表
    initChart() {
      if (!this.$refs.chartContainer) return

      this.chartInstance = echarts.init(this.$refs.chartContainer)
      this.updateChart()
    },

    // 更新图表
    updateChart() {
      if (!this.chartInstance) return

      const option = {
        title: {
          text: 'ECR Performance Comparison',
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333'
          }
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderColor: '#e1e5e9',
          borderWidth: 1,
          textStyle: {
            color: '#2c3e50',
            fontSize: 13
          },
          extraCssText: 'box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12); border-radius: 12px; backdrop-filter: blur(10px);',
          formatter: (params) => {
            const dataIndex = params.dataIndex
            const data = this.chartData.fullData[dataIndex]

            if (!data) return 'No data available'

            return `
              <div style="padding: 16px; min-width: 240px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <div style="font-weight: 600; margin-bottom: 12px; font-size: 15px; color: #1a202c; text-align: center; padding-bottom: 8px; border-bottom: 2px solid #f7fafc;">
                  ${data.Framework} + ${data.LLM}
                </div>
                <div style="margin: 8px 0; display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
                  <span style="color: #4a5568; font-weight: 500; font-size: 13px;">ECR:</span>
                  <span style="font-weight: 600; color: #2d3748; font-size: 13px;">${data.ECR}%</span>
                </div>
                <div style="margin: 8px 0; display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
                  <span style="color: #4a5568; font-weight: 500; font-size: 13px;">TPR:</span>
                  <span style="font-weight: 600; color: #2d3748; font-size: 13px;">${data.TPR}%</span>
                </div>
                <div style="margin: 8px 0; display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
                  <span style="color: #4a5568; font-weight: 500; font-size: 13px;">Input Tokens:</span>
                  <span style="font-weight: 600; color: #2d3748; font-size: 13px;">${data.InputTokens}k</span>
                </div>
                <div style="margin: 8px 0; display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
                  <span style="color: #4a5568; font-weight: 500; font-size: 13px;">Output Tokens:</span>
                  <span style="font-weight: 600; color: #2d3748; font-size: 13px;">${data.OutputTokens}</span>
                </div>
                <div style="margin: 8px 0; display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
                  <span style="color: #4a5568; font-weight: 500; font-size: 13px;">Cost:</span>
                  <span style="font-weight: 600; color: #2d3748; font-size: 13px;">$${data.Cost}</span>
                </div>
              </div>
            `
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.chartData.categories,
          axisLabel: {
            rotate: 45,
            fontSize: 10,
            color: '#666'
          },
          axisLine: {
            lineStyle: {
              color: '#e0e0e0'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: 'ECR (%)',
          nameLocation: 'middle',
          nameGap: 50,
          nameTextStyle: {
            fontSize: 12,
            color: '#666'
          },
          axisLabel: {
            formatter: '{value}%',
            color: '#666'
          },
          axisLine: {
            lineStyle: {
              color: '#e0e0e0'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0'
            }
          }
        },
        series: [{
          name: 'ECR',
          type: 'bar',
          data: this.chartData.ecrValues,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#667eea' },
              { offset: 1, color: '#764ba2' }
            ]),
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#5a6fd8' },
                { offset: 1, color: '#6a4190' }
              ])
            }
          },
          animationDelay: (idx) => idx * 50
        }],
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      }

      this.chartInstance.setOption(option)
    },

    // 处理窗口大小变化
    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize()
      }
    },

    filterResults() {
      // Filter logic would be implemented here
      console.log('Filtering results...')
    },

    resetFilters() {
      this.selectedDomain = 'all'
      this.selectedFramework = 'all'
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
    },

    // 自定义dropdown方法
    toggleDropdown(type) {
      this.activeDropdown = this.activeDropdown === type ? null : type
    },

    selectFramework(framework) {
      this.selectedFramework = framework
      this.activeDropdown = null
      this.filterResults()
    },

    selectModelType(type) {
      this.selectedModelType = type
      this.activeDropdown = null
      this.filterResults()
    },

    selectSortColumn(column) {
      this.sortColumn = column
      this.activeDropdown = null
      this.filterResults()
    },

    getSelectedFrameworkText() {
      return this.selectedFramework === 'all' ? 'All Frameworks' : this.selectedFramework
    },

    getSelectedModelTypeText() {
      const typeMap = {
        'all': 'All Models',
        'open-source': 'Open Source',
        'proprietary': 'Proprietary'
      }
      return typeMap[this.selectedModelType] || 'All Models'
    },

    getSelectedSortText() {
      const sortMap = {
        'ecr': 'ECR',
        'tpr': 'TPR',
        'inputTokens': 'Input Tokens',
        'outputTokens': 'Output Tokens',
        'cost': 'Cost'
      }
      return sortMap[this.sortColumn] || 'ECR'
    },

    closeDropdowns(event) {
      // 检查点击是否在dropdown内部
      if (!event.target.closest('.custom-dropdown')) {
        this.activeDropdown = null
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.initChart()
      window.addEventListener('resize', this.handleResize)
      document.addEventListener('click', this.closeDropdowns)
    })
  },

  beforeUnmount() {
    if (this.chartInstance) {
      this.chartInstance.dispose()
    }
    window.removeEventListener('resize', this.handleResize)
    document.removeEventListener('click', this.closeDropdowns)
  },

  watch: {
    chartData: {
      handler() {
        this.updateChart()
      },
      deep: true
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
    radial-gradient(circle at 30% 30%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
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
  color: #333;
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
  color: #666;
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
  gap: 20px;
  padding: 20px;
  flex-wrap: wrap;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  color: #333;
  font-weight: 500;
  white-space: nowrap;
}


/* 自定义dropdown样式 */
.custom-dropdown {
  position: relative;
  min-width: 160px;
  cursor: pointer;
}

.dropdown-selected {
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 10px 12px;
  color: #374151;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: border-color 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
}

.dropdown-selected:hover {
  border-color: #9ca3af;
}

.custom-dropdown.active .dropdown-selected {
  border-color: #3b82f6;
  outline: none;
}

.dropdown-arrow {
  transition: transform 0.2s ease;
  color: #6b7280;
  font-size: 12px;
}

.custom-dropdown.active .dropdown-arrow {
  transform: rotate(180deg);
  color: #3b82f6;
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-top: none;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-option {
  padding: 10px 12px;
  color: #374151;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f3f4f6;
  position: relative;
}

.dropdown-option:last-child {
  border-bottom: none;
}

.dropdown-option:hover {
  background-color: #f9fafb;
}

.dropdown-option.selected {
  background-color: #eff6ff;
  color: #1d4ed8;
  font-weight: 500;
}

.dropdown-option.selected::after {
  content: '✓';
  position: absolute;
  right: 12px;
  color: #1d4ed8;
  font-weight: bold;
}

/* 滚动条样式 */
.dropdown-options::-webkit-scrollbar {
  width: 4px;
}

.dropdown-options::-webkit-scrollbar-track {
  background: #f9fafb;
}

.dropdown-options::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

.dropdown-options::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
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
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.table-header h2 {
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.table-info {
  display: flex;
  gap: 24px;
  color: #666;
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
  background: #f8f9fa;
  color: #333;
  font-weight: 600;
  padding: 16px 12px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  transition: background 0.3s ease;
  white-space: nowrap;
}

.leaderboard-table th:hover {
  background: #e9ecef;
}

.leaderboard-table th i {
  margin-left: 4px;
  opacity: 0.5;
}

.leaderboard-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #f1f3f4;
  color: #333;
}

.model-row:hover {
  background: #f8f9fa;
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
  color: #333;
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
  color: #666;
  font-size: 12px;
}

.framework-name {
  color: #667eea;
  font-size: 12px;
  font-weight: 500;
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
  color: #333;
}

.score-bar {
  width: 100px;
  height: 4px;
  background: #e9ecef;
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
  background: #e9ecef;
  border: none;
  border-radius: 6px;
  padding: 8px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 2px;
}

.btn-icon:hover {
  background: #dee2e6;
  color: #333;
  transform: translateY(-1px);
}

/* Chart Section */
.chart-section {
  padding: 40px 0;
}

.chart-container {
  padding: 24px;
}

.chart-header {
  text-align: center;
  margin-bottom: 24px;
}

.chart-header h2 {
  color: #333;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.chart-description {
  color: #666;
  font-size: 1rem;
  margin: 0;
}

.chart-wrapper {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart {
  min-height: 500px;
}

/* Content Blocks Section */
.content-blocks-section {
  padding: 60px 0;
  background: #f8f9fa;
}

.content-blocks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  max-width: 1000px;
  margin: 0 auto;
}

.content-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 24px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.content-block::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.content-block:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.content-block:hover::before {
  transform: scaleX(1);
}

.content-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

.content-block:hover .content-icon {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.content-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.content-text h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.content-main {
  text-align: center;
  margin-bottom: 24px;
}

.content-text p {
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  max-width: 280px;
}

.content-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  padding: 12px 24px;
  border: 2px solid #667eea;
  border-radius: 25px;
  transition: all 0.3s ease;
  background: transparent;
}

.content-link:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.content-link i {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.content-link:hover i {
  transform: translateX(4px);
}

/* Statistics Section */
.statistics-section {
  padding: 80px 0;
  background: #f8f9fa;
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
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  color: #666;
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
    gap: 8px;
    min-width: auto;
  }

  .custom-dropdown {
    min-width: auto;
  }

  .dropdown-selected {
    padding: 10px 14px;
    font-size: 13px;
  }

  .dropdown-options {
    max-height: 150px;
  }

  .dropdown-option {
    padding: 10px 14px;
    font-size: 13px;
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

  .content-blocks-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .content-block {
    padding: 32px 20px;
  }

  .content-icon {
    width: 70px;
    height: 70px;
    font-size: 28px;
    margin-bottom: 20px;
  }

  .content-text h3 {
    font-size: 1.3rem;
  }

  .content-text p {
    font-size: 0.9rem;
    max-width: 100%;
  }

  .content-link {
    padding: 10px 20px;
    font-size: 13px;
  }
}
</style>
