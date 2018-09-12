// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.components.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'common/stylus/index.styl'
import fastclick from 'fastclick'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import {DatePicker} from 'element-ui'

fastclick.attach(document.body)
Vue.use(DatePicker)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
export const _router = router
