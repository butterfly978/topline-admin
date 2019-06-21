import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 先找文件，沒有就找目錄，找到優先加載目錄中的index
import router from './router'
// 引入公共樣式文件，最好在 element 文件之後，可以自定義修改 element 內置樣式
import './styles/index.less'

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
