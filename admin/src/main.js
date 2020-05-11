import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from './plugins/axios'
import moment from 'moment'
import VueClipboard from 'vue-clipboard2'
import 'babel-polyfill'
import 'moment/locale/zh-cn'
import 'view-design/dist/styles/iview.css';
import './plugins/jsencryptKey'
import './plugins/ViewUI';
import './assets/font/font.css'

Vue.use(VueClipboard)

Vue.config.productionTip = false
Vue.prototype.$http = axios;

moment.locale('zh-cn')
Vue.prototype.$moment = moment;

Vue.filter('dateformat', function (dataStr, pattern = 'YYYY-MM-DD HH:mm') {
  return moment(dataStr).format(pattern)
})

Vue.prototype.$getUser = JSON.parse(localStorage.getItem(window.$project));

//退出登录
Vue.prototype.$logout = function (status, text) {
  if (status == 401) {
    this.$Message.error(text);
    localStorage.clear();
    this.$router.push("/login");
    return
  }
}

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
