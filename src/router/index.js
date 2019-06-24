import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    { // layout 显示到 App 根组件的路由出口
      // name: 'layout', //使用 JavaScript 命名路由导航不会渲染默认子路由
      // 在整個項目中，模塊路徑中的 @ 表示 src 目錄
      // 無論當前模塊在哪裡，@ 都可以直接定位到 src
      // 加載一個目錄可以默認加載它的 index.js、index.vue、index.json...
      path: '/',
      component: () => import('@/views/layout'),
      // 嵌套路由：https://router.vuejs.org/zh/guide/essentials/nested-routes.html
      // 所有 children 路由都显示到父路由的 router-view 中
      children: [
        {
          name: 'home',
          path: '', // 父路由的默认内容
          component: () => import('@/views/home')
        },
        {
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})
