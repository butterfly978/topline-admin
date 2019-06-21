import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      // 在整個項目中，模塊路徑中的 @ 表示 src 目錄
      // 無論當前模塊在哪裡，@ 都可以直接定位到 src
      // 加載一個目錄可以默認加載它的 index.js、index.vue、index.json...
      component: () => import('@/views/home')
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})
