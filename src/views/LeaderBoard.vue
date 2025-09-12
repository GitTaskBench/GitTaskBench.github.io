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
            Performance rankings of AI agents on GitTaskBench evaluation tasks
          </p>
        </div>
      </div>
    </section>

    <!-- Content Blocks Section -->
    <section class="content-blocks-section">
      <div class="container">
        <div class="content-blocks-grid">
          <!-- Paper Block -->
          <a href="https://arxiv.org/pdf/2508.18993" class="content-block card" target="_blank"
            rel="noopener noreferrer">
            <div class="content-icon">
              <i class="fas fa-file-alt"></i>
            </div>
            <div class="content-text">
              <h3>Research Paper</h3>
              <p>Methodology and results</p>
            </div>
          </a>

          <!-- HuggingFace Block -->
          <a href="https://huggingface.co/datasets/Nicole-Yi/GitTaskBench" class="content-block card" target="_blank"
            rel="noopener noreferrer">
            <div class="content-icon">
              <i class="fas fa-heart"></i>
            </div>
            <div class="content-text">
              <h3>HuggingFace</h3>
              <p>Datasets and models</p>
            </div>
          </a>

          <!-- Submit Model Block -->
          <a href="#" class="content-block card">
            <div class="content-icon">
              <i class="fas fa-upload"></i>
            </div>
            <div class="content-text">
              <h3>Submit Model</h3>
              <p>Submit for evaluation</p>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Chart Section -->
    <section class="chart-section">
      <div class="container">
        <div class="chart-container card">
          <div class="chart-header">
          </div>
          <div class="chart-wrapper">
            <div ref="chartContainer" class="chart" style="width: 100%; height: 350px;"></div>
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
                  Exec Completion
                </div>
                <div class="dropdown-option" value="tpr" @click.stop="selectSortColumn('tpr')"
                  :class="{ 'selected': sortColumn === 'tpr' }">
                  Task Pass
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
                  <th class="type-col">Type</th>
                  <th class="model-col">Framework+LLM</th>
                  <th class="org-col">ORG</th>
                  <th class="metric-col" @click="sortBy('ecr')">
                    Exec Completion (%)
                    <i class="fas fa-sort" :class="getSortIcon('ecr')"></i>
                  </th>
                  <th class="metric-col" @click="sortBy('tpr')">
                    Task Pass (%)
                    <i class="fas fa-sort" :class="getSortIcon('tpr')"></i>
                  </th>
                  <th class="metric-col" @click="sortBy('cost')">
                    Cost ($)
                    <i class="fas fa-sort" :class="getSortIcon('cost')"></i>
                  </th>
                  <th class="date-col">Commit Date</th>
                  <th class="site-col">Site</th>
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
                  <td class="type-col">
                    <div class="type-icon" :class="model.type">
                      <i :class="getTypeIcon(model.type)"></i>
                    </div>
                  </td>
                  <td class="model-col">
                    <div class="model-info">
                      <div class="model-name">
                        {{ model.name }}
                      </div>
                    </div>
                  </td>
                  <td class="org-col">
                    <div class="org-icons">
                      <img :src="frameworkLogos[model.framework]" :alt="model.framework" class="framework-icon-small"
                        v-if="frameworkLogos[model.framework]" />
                      <img :src="llmLogos[model.llm]" :alt="model.llm" class="llm-icon-small"
                        v-if="llmLogos[model.llm]" />
                    </div>
                  </td>
                  <td class="metric-col">
                    <span class="metric-value">{{ model.ecr.toFixed(2) }}%</span>
                  </td>
                  <td class="metric-col">
                    <span class="metric-value">{{ model.tpr.toFixed(2) }}%</span>
                  </td>
                  <td class="metric-col">
                    <span class="metric-value">{{ model.cost === '-' ? '-' : '$' + model.cost }}</span>
                  </td>
                  <td class="date-col">
                    <span class="date-value">{{ model.commitDate }}</span>
                  </td>
                  <td class="site-col">
                    <a :href="getFrameworkSiteUrl(model.framework)" target="_blank" rel="noopener noreferrer" class="site-link"
                      :title="'Visit ' + model.framework + ' Site'">
                      <i class="fas fa-external-link-alt"></i>
                    </a>
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
import aiderLogo from '@/assets/logos/aider.png'
import sweLogo from '@/assets/logos/swe.png'
import openhandsLogo from '@/assets/logos/openhands.png'
import claudeLogo from '@/assets/logos/claude.svg'
import deepseekLogo from '@/assets/logos/deepseek.svg'
import geminiLogo from '@/assets/logos/gemini.svg'
import gptLogo from '@/assets/logos/gpt.png'
// import grokLogo from '@/assets/logos/grok.svg'
import llamaLogo from '@/assets/logos/llama.svg'
// import qaLogo from '@/assets/logos/qa.png'
import qwenLogo from '@/assets/logos/qwen.png'
import qaBaseLogo from '@/assets/logos/qa-base.png'

export default {
  name: 'LeaderBoard',
  data() {
    return {
      selectedDomain: 'all',
      selectedFramework: 'all',
      selectedMetric: 'overall',
      selectedModelType: 'all',
      sortColumn: 'tpr',
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
        { Framework: 'Aider', LLM: 'GPT-4o', ECR: 5.56, TPR: 1.85, InputTokens: 10.67, OutputTokens: 492.67, Cost: 0.0316, CommitDate: '2025-08-09', SiteUrl: 'https://openai.com/research/gpt-4' },
        { Framework: 'Aider', LLM: 'GPT-4.1', ECR: 11.11, TPR: 7.41, InputTokens: 14.83, OutputTokens: 734.17, Cost: 0.0355, CommitDate: '2025-08-09', SiteUrl: 'https://openai.com/research/gpt-4' },
        { Framework: 'Aider', LLM: 'Claude 3.5', ECR: 16.67, TPR: 12.96, InputTokens: 7.48, OutputTokens: 534.00, Cost: 0.0304, CommitDate: '2025-08-09', SiteUrl: 'https://github.com/anthropics/anthropic-sdk-python' },
        { Framework: 'Aider', LLM: 'DeepSeekV3', ECR: 20.37, TPR: 16.67, InputTokens: 7.51, OutputTokens: 599.64, Cost: 0.00269, CommitDate: '2025-08-09', SiteUrl: 'https://github.com/deepseek-ai/DeepSeek-V3' },
        { Framework: 'SWE-Agent', LLM: 'GPT-4o', ECR: 17.58, TPR: 10.19, InputTokens: 275.53, OutputTokens: 1282.70, Cost: 0.778, CommitDate: '2025-05-22', SiteUrl: 'https://openai.com/research/gpt-4' },
        { Framework: 'SWE-Agent', LLM: 'GPT-4.1', ECR: 38.89, TPR: 31.48, InputTokens: 301.11, OutputTokens: 2098.33, Cost: 0.661, CommitDate: '2025-05-22', SiteUrl: 'https://openai.com/research/gpt-4' },
        { Framework: 'SWE-Agent', LLM: 'o3-mini', ECR: 25.93, TPR: 20.37, InputTokens: 158.45, OutputTokens: 215.20, Cost: 0.175, CommitDate: '2025-05-22', SiteUrl: 'https://openai.com/research/gpt-4' },
        { Framework: 'SWE-Agent', LLM: 'Claude 3.5', ECR: 41.67, TPR: 22.23, InputTokens: 455.34, OutputTokens: 943.30, Cost: 1.38, CommitDate: '2025-05-22', SiteUrl: 'https://github.com/anthropics/anthropic-sdk-python' },
        { Framework: 'SWE-Agent', LLM: 'Claude 3.7', ECR: 64.81, TPR: 42.59, InputTokens: 552.79, OutputTokens: 807.63, Cost: 1.67, CommitDate: '2025-05-22', SiteUrl: 'https://github.com/anthropics/anthropic-sdk-python' },
        { Framework: 'SWE-Agent', LLM: 'DeepSeekV3', ECR: 18.52, TPR: 12.04, InputTokens: 412.65, OutputTokens: 1649.82, Cost: 0.113, CommitDate: '2025-05-22', SiteUrl: 'https://github.com/deepseek-ai/DeepSeek-V3' },
        { Framework: 'SWE-Agent', LLM: 'Qwen3-32b*', ECR: 7.41, TPR: 3.70, InputTokens: 1445.97, OutputTokens: 2405.00, Cost: '-', CommitDate: '2025-05-22', SiteUrl: 'https://github.com/QwenLM/Qwen3' },
        { Framework: 'SWE-Agent', LLM: 'Qwen3-32b*†', ECR: 16.67, TPR: 11.11, InputTokens: 124.15, OutputTokens: 559.11, Cost: '-', CommitDate: '2025-05-22', SiteUrl: 'https://github.com/QwenLM/Qwen3' },
        { Framework: 'SWE-Agent', LLM: 'Llama3.3-70b*', ECR: 25.83, TPR: 18.52, InputTokens: 397.03, OutputTokens: 1985.64, Cost: '-', CommitDate: '2025-05-22', SiteUrl: 'https://github.com/meta-llama/llama3.3' },
        { Framework: 'OpenHands', LLM: 'GPT-4o', ECR: 21.30, TPR: 14.82, InputTokens: 760.53, OutputTokens: 3990.31, Cost: 1.94, CommitDate: '2025-09-09', SiteUrl: 'https://openai.com/research/gpt-4' },
        { Framework: 'OpenHands', LLM: 'GPT-4.1', ECR: 55.56, TPR: 42.59, InputTokens: 465.94, OutputTokens: 1535.47, Cost: 0.942, CommitDate: '2025-09-09', SiteUrl: 'https://openai.com/research/gpt-4' },
        { Framework: 'OpenHands', LLM: 'o3-mini', ECR: 29.63, TPR: 22.22, InputTokens: 2523.53, OutputTokens: 183637.53, Cost: 3.58, CommitDate: '2025-09-09', SiteUrl: 'https://openai.com/research/gpt-4' },
        { Framework: 'OpenHands', LLM: 'Claude 3.5', ECR: 53.70, TPR: 40.74, InputTokens: 2858.00, OutputTokens: 24929.47, Cost: 8.95, CommitDate: '2025-09-09', SiteUrl: 'https://github.com/anthropics/anthropic-sdk-python' },
        { Framework: 'OpenHands', LLM: 'Claude 3.7', ECR: 72.22, TPR: 48.15, InputTokens: 9501.25, OutputTokens: 85033.05, Cost: 29.8, CommitDate: '2025-09-09', SiteUrl: 'https://github.com/anthropics/anthropic-sdk-python' },
        { Framework: 'OpenHands', LLM: 'Gemini-2.5-pro', ECR: 51.85, TPR: 35.19, InputTokens: 760.88, OutputTokens: 35173.29, Cost: 2.18, CommitDate: '2025-09-09', SiteUrl: 'https://github.com/google/generative-ai-python' },
        { Framework: 'OpenHands', LLM: 'DeepSeekV3', ECR: 45.37, TPR: 26.85, InputTokens: 4717.78, OutputTokens: 31957.67, Cost: 1.31, CommitDate: '2025-09-09', SiteUrl: 'https://github.com/deepseek-ai/DeepSeek-V3' },
        { Framework: 'OpenHands', LLM: 'Qwen3-8b*', ECR: 1.85, TPR: 1.85, InputTokens: 846.26, OutputTokens: 2045.00, Cost: '-', CommitDate: '2025-09-09', SiteUrl: 'https://github.com/QwenLM/Qwen3' },
        { Framework: 'OpenHands', LLM: 'Qwen3-14b*', ECR: 11.11, TPR: 5.56, InputTokens: 339.42, OutputTokens: 2540.17, Cost: '-', CommitDate: '2025-09-09', SiteUrl: 'https://github.com/QwenLM/Qwen3' },
        { Framework: 'OpenHands', LLM: 'Qwen3-32b*', ECR: 35.19, TPR: 25.93, InputTokens: 591.02, OutputTokens: 2097.89, Cost: '-', CommitDate: '2025-09-09', SiteUrl: 'https://github.com/QwenLM/Qwen3' },
        { Framework: 'OpenHands', LLM: 'Qwen3-32b*†', ECR: 44.44, TPR: 29.63, InputTokens: 208.00, OutputTokens: 8755.35, Cost: '-', CommitDate: '2025-09-09', SiteUrl: 'https://github.com/QwenLM/Qwen3' },
        { Framework: 'OpenHands', LLM: 'Llama3.3-70b*', ECR: 27.78, TPR: 20.37, InputTokens: 132.69, OutputTokens: 872.93, Cost: '-', CommitDate: '2025-09-09', SiteUrl: 'https://github.com/meta-llama/llama3.3' },
        { Framework: 'RepoMaster', LLM: 'GPT-4o', ECR: 48.14, TPR: 40.74, InputTokens: 248.8, OutputTokens: 1231, Cost: 0.70, CommitDate: '2025-08-28', SiteUrl: 'https://openai.com/research/gpt-4' },
        { Framework: 'RepoMaster', LLM: 'Claude 3.5', ECR: 75.92, TPR: 62.96, InputTokens: 153.2, OutputTokens: 827, Cost: 0.48, CommitDate: '2025-08-28', SiteUrl: 'https://github.com/anthropics/anthropic-sdk-python' },
        { Framework: 'RepoMaster', LLM: 'DeepSeekV3', ECR: 61.11, TPR: 44.44, InputTokens: 253.6, OutputTokens: 1366, Cost: 0.07, CommitDate: '2025-08-28', SiteUrl: 'https://github.com/deepseek-ai/DeepSeek-V3' }
      ],

      // 从CSV数据生成表格数据
      leaderboardData: [],

      // Framework logo mapping
      frameworkLogos: {
        'Aider': aiderLogo,
        'SWE-Agent': sweLogo,
        'OpenHands': openhandsLogo,
        'RepoMaster': qaBaseLogo
      },

      // Framework website URL mapping
      frameworkSiteUrls: {
        'Aider': 'https://github.com/Aider-AI/aider',
        'SWE-Agent': 'https://github.com/SWE-agent/SWE-agent',
        'OpenHands': 'https://github.com/All-Hands-AI/OpenHands',
        'RepoMaster': 'https://github.com/QuantaAlpha/RepoMaster'
      },

      // LLM logo mapping
      llmLogos: {
        'GPT-4o': gptLogo,
        'GPT-4.1': gptLogo,
        'o3-mini': gptLogo,
        'Claude 3.5': claudeLogo,
        'Claude 3.7': claudeLogo,
        'DeepSeekV3': deepseekLogo,
        'Gemini-2.5-pro': geminiLogo,
        'Qwen3-8b*': qwenLogo,
        'Qwen3-14b*': qwenLogo,
        'Qwen3-32b*': qwenLogo,
        'Qwen3-32b*†': qwenLogo,
        'Llama3.3-70b*': llamaLogo
      }
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
        commitDate: item.CommitDate,
        siteUrl: item.SiteUrl,
        type: this.getModelType(item.LLM)
      }))
    },

    // 图表数据 - 按TPR排序（从低到高）
    chartData() {
      const sortedData = [...this.csvData].sort((a, b) => a.TPR - b.TPR)

      return {
        categories: sortedData.map(item => `${item.Framework}+${item.LLM}`),
        tprValues: sortedData.map(item => item.TPR),
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

    // 根据框架类型获取对应的基础色
    getFrameworkColor(framework) {
      const frameworkColors = {
        'Aider': '#4CAF50',        // 亮绿 - 对应Aider图标
        'SWE-Agent': '#6C757D',    // 高级灰 - 对应SWE-Agent图标
        'OpenHands': '#D4A574',    // 高级金 - 对应OpenHands图标
        'RepoMaster': '#4A6FA5'    // 高级深蓝 - 对应RepoMaster图标
      }
      return frameworkColors[framework] || '#8B9DC3' // 默认柔和蓝
    },

    // 获取框架网站URL
    getFrameworkSiteUrl(framework) {
      return this.frameworkSiteUrls[framework] || '#'
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
          text: 'Task pass rate performance comparison',
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
                  <span style="color: #4a5568; font-weight: 500; font-size: 13px;">TPR:</span>
                  <span style="font-weight: 600; color: #2d3748; font-size: 13px;">${data.TPR}%</span>
                </div>
                <div style="margin: 8px 0; display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
                  <span style="color: #4a5568; font-weight: 500; font-size: 13px;">ECR:</span>
                  <span style="font-weight: 600; color: #2d3748; font-size: 13px;">${data.ECR}%</span>
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
        dataZoom: [],
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
          name: 'TPR (%)',
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
          name: 'TPR',
          type: 'bar',
          data: this.chartData.tprValues.map((value, index) => {
            const framework = this.chartData.fullData[index].Framework
            const baseColor = this.getFrameworkColor(framework)
            return {
              value: value,
              itemStyle: {
                color: baseColor,
                borderRadius: [4, 4, 0, 0]
              }
            }
          }),
          label: {
            show: false
          },
          emphasis: {
            itemStyle: {
              color: (params) => {
                const framework = this.chartData.fullData[params.dataIndex].Framework
                return this.getFrameworkColor(framework)
              }
            }
          },
        }],
        animation: false
      }

      this.chartInstance.setOption(option)

      // 添加框架图标
      this.addFrameworkIcons()
    },

    // 添加框架图标
    addFrameworkIcons() {
      if (!this.chartInstance) return

      // 延迟执行，确保图表完全渲染
      setTimeout(() => {
        const chartContainer = this.$refs.chartContainer
        if (!chartContainer) return

        // 清除之前的图标
        const existingIcons = chartContainer.querySelectorAll('.framework-icon')
        existingIcons.forEach(icon => icon.remove())

        // 确保图表容器有相对定位
        chartContainer.style.position = 'relative'

        // 获取ECharts实例的坐标转换器
        const convertToPixel = this.chartInstance.convertToPixel.bind(this.chartInstance)

        this.chartData.fullData.forEach((item, index) => {
          const logo = this.frameworkLogos[item.Framework]
          if (!logo) return

          // 使用ECharts的坐标转换获取柱子的实际位置
          const pixelPos = convertToPixel('grid', [index, item.TPR])
          if (!pixelPos) return

          // 创建图标元素
          const iconElement = document.createElement('div')
          iconElement.className = 'framework-icon'
          iconElement.style.cssText = `
            position: absolute;
            top: ${pixelPos[1] - 20}px;
            left: ${pixelPos[0] - 8}px;
            width: 16px;
            height: 16px;
            background-image: url(${logo});
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            z-index: 10;
            pointer-events: none;
          `

          chartContainer.appendChild(iconElement)
        })
      }, 100)
    },

    // 处理窗口大小变化
    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize()
        // 重新添加图标
        this.addFrameworkIcons()
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

    getTypeIcon(type) {
      if (type === 'open-source') return 'fas fa-unlock'
      if (type === 'proprietary') return 'fas fa-lock'
      return 'fas fa-question'
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
        'ecr': 'Exec Completion',
        'tpr': 'Task Pass',
        'inputTokens': 'Input Tokens',
        'outputTokens': 'Output Tokens',
        'cost': 'Cost'
      }
      return sortMap[this.sortColumn] || 'Task Pass'
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
  padding: 40px 0 30px;
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
  margin-bottom: 12px;
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
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.4;
}

/* Filters Section */
.filters-section {
  padding: 0 0 20px;
}

.filters-container {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
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
  padding: 20px 0 40px 0;
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

.org-col {
  width: 80px;
  text-align: center;
}

.org-icons {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.model-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.model-name {
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.framework-icon-small {
  width: 16px;
  height: 16px;
  object-fit: contain;
  flex-shrink: 0;
}

.llm-icon-small {
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
  margin: 0 4px;
  vertical-align: middle;
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

.leaderboard-table th.metric-col {
  text-align: center;
}

.date-col {
  min-width: 120px;
  text-align: center;
}

.leaderboard-table th.date-col {
  text-align: center;
}

.site-col {
  min-width: 80px;
  text-align: center;
}

.leaderboard-table th.site-col {
  text-align: center;
}

.date-value {
  font-weight: 500;
  color: #666;
  font-size: 14px;
}

.site-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 12px;
}

.site-link:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  color: white;
  text-decoration: none;
}

.site-link i {
  font-size: 10px;
}

.type-col {
  min-width: 80px;
  text-align: center;
}

.leaderboard-table th.type-col {
  text-align: center;
}

.type-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  font-size: 12px;
  transition: all 0.3s ease;
}

.type-icon.open-source {
  background: rgba(34, 197, 94, 0.15);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.type-icon.open-source:hover {
  background: rgba(34, 197, 94, 0.25);
  border-color: rgba(34, 197, 94, 0.5);
  transform: scale(1.1);
}

.type-icon.proprietary {
  background: rgba(156, 163, 175, 0.15);
  color: #9ca3af;
  border: 1px solid rgba(156, 163, 175, 0.3);
}

.type-icon.proprietary:hover {
  background: rgba(156, 163, 175, 0.25);
  border-color: rgba(156, 163, 175, 0.5);
  transform: scale(1.1);
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
  padding: 20px 0;
}

.chart-container {
  padding: 16px;
}

.chart-header {
  text-align: center;
  margin-bottom: 16px;
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
  min-height: 350px;
  position: relative;
}

/* Content Blocks Section */
.content-blocks-section {
  padding: 20px 0;
  background: #f8f9fa;
}

.content-blocks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  max-width: 900px;
  margin: 0 auto;
}

.content-block {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  padding: 16px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
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
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  margin-right: 16px;
  flex-shrink: 0;
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
  align-items: flex-start;
  justify-content: center;
}

.content-text h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}


.content-text p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
}


/* Statistics Section */
.statistics-section {
  padding: 40px 0;
  background: #f8f9fa;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.8rem;
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
    padding: 12px8px;
    font-size: 14px;
  }

  .date-col,
  .site-col {
    min-width: 100px;
  }

  .site-link {
    width: 20px;
    height: 20px;
    font-size: 10px;
  }

  .site-link i {
    font-size: 8px;
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
    gap: 20px;
  }

  .content-block {
    padding: 16px;
    flex-direction: column;
    text-align: center;
  }

  .content-icon {
    width: 45px;
    height: 45px;
    font-size: 18px;
    margin-right: 0;
    margin-bottom: 12px;
  }

  .content-text {
    align-items: center;
  }

  .content-text h3 {
    font-size: 1.2rem;
  }

  .content-text p {
    font-size: 0.85rem;
  }
}
</style>
