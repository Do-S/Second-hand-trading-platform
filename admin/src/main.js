import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from './plugins/axios'
import moment from 'moment'
import 'moment/locale/zh-cn'
import 'view-design/dist/styles/iview.css';
import './plugins/ViewUI';
import './assets/font/font.css'

Vue.config.productionTip = false
Vue.prototype.$http = axios;
moment.locale('zh-cn')
Vue.prototype.$moment = moment;
Vue.filter('dateformat', function (dataStr, pattern = 'YYYY-MM-DD HH:mm') {
  return moment(dataStr).format(pattern)
})
Vue.prototype.$getUser = JSON.parse(localStorage.getItem(window.$project));

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
