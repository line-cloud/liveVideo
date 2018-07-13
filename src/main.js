// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import qs from 'qs';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import '../src/assets/common.css'

import VideoPlayer from 'vue-video-player'

Vue.use(VideoPlayer);
Vue.use(ElementUI);

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// import setClassTimeDialog from './components/Dialog/setClassTimeDialog'

// Vue.component(setClassTimeDialog.name, setClassTimeDialog)

Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.prototype.$qs = qs;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
