import Vue from 'vue'
import App from './App.vue'
// 先找文件，沒有就找目錄，找到優先加載目錄中的index
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')