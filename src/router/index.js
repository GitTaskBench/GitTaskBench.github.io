import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/Home.vue'
import LeaderBoard from '../views/LeaderBoard.vue'

const routes = [
  {
    path: '/',
    redirect: '/leaderboard'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/leaderboard',
    name: 'LeaderBoard',
    component: LeaderBoard
  }
]

const router = createRouter({
  history: createWebHistory(process.env.NODE_ENV === 'production' ? '/GitTaskBench.github.io/' : '/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
