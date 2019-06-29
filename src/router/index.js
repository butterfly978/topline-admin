import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'
import { getUser } from '@/utils/auth'

Vue.use(Router)

const router = new Router({
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
        },
        {
          name: 'article',
          path: '/article',
          component: () => import('@/views/article')
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
/* 全局前置守卫
  当你访问路由页面的时候，会先进入这里
  to 要去哪里的相关数据
  from 来自哪里的相关数据
  next 允许通过的方法
*/
router.beforeEach((to, from, next) => {
  // 路由导航前，开启进度条
  nprogress.start()
  const userInfo = getUser()
  if (to.path !== '/login') {
    // 非登录页
    // 没有登录，跳转到登录页
    if (!userInfo) {
      next({ name: 'login' })
      // next('/login')
      // next({ path: '/login' })
    } else {
      // 登录了，允许通过
      next()
    }
  } else {
    // 非登录页
    // 没有登录，允许通过
    if (!userInfo) {
      next()
    } else {
      // 登录了，不允许通过
      // next(false) // 中断当前导航
      // next()
      // next({ name: 'home' })
      // window.location.href = '/#/'
      next({ name: 'home' })
      window.location.reload()
    }
  }
})
router.afterEach((to, from) => {
  // 路由导航完成，结束进度条
  nprogress.done()
})
export default router
