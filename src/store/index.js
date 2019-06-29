/* Vuex：集中式状态（数据）管理
 * 我们把不好进行组件通信交互的组件数据放到这里
 * 使用从这里使用，修改也从这里修改
 * 这里的数据是和任何组件都无关的
 * 这里的数据，任何组件都可以访问和修改
 * 而且这里的数据也是响应式的，数据改变也会影响组件视图更新 */
// 1. npm i vuex
// 2. 下面的代码
import Vue from 'vue'
import Vuex from 'vuex'
import { getUser } from '@/utils/auth'

Vue.use(Vuex)

const store = new Vuex.Store({
  // state 中的数据可以被任何组件访问
  // 在组件中直接 this.$store.state.xxx 进行访问
  state: {
    user: getUser() || {} // user 的初始数据来自于本地存储
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

export default store
