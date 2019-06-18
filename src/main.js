import 'babel-polyfill';
import promise from 'es6-promise';
promise.polyfill();
// import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI, { Message } from 'element-ui';
import VueAxios from 'vue-axios';
import axios from 'axios';
import store from './store/store';
/* eslint-disable  */
import * as types from './store/types';
import '../static/css/index.less';
// import 'element-ui/lib/theme-chalk/index.css'
import '../static/font/iconfont.css';
import '../theme/index.css';

import vueOfficeHeader from '@gic-test/vue-office-header';
import vueOfficeAside from '@gic-test/vue-office-aside';
import vueOfficeArea from '@gic-test/vue-office-area';
// 新增公共 footer插件
import vueGicFooter from '@gic-test/vue-gic-footer';
import vueGicImgPreview from '@gic-test/vue-gic-img-preview';
import vueOfficeUploadImage from '@gic-test/vue-office-upload-image';
import htmlToPdf from '@/components/utils/htmlToPdf';

Vue.use(htmlToPdf);
Vue.use(vueGicImgPreview);
Vue.use(vueOfficeUploadImage);
Vue.use(vueGicFooter);
Vue.use(vueOfficeArea);
Vue.use(vueOfficeAside);
Vue.use(vueOfficeHeader);

Vue.config.productionTip = false;
Vue.use(ElementUI, { size: 'large' });
Vue.use(VueAxios, axios);

Vue.axios.defaults.withCredentials = true; // 跨域cookie访问

/*
 * 路由守护
 */
router.beforeEach((to, from, next) => {
  let baseUrl;
  let host = window.location.origin;
  if (host.indexOf('localhost') != -1) {
    baseUrl = 'http://www.gicdev.com';
  } else {
    baseUrl = host;
  }
  if (!localStorage.getItem('userInfo')) {
    axios
      .get(`${baseUrl}/haoban-manage-web/emp/get-user-info`, {})
      .then(res => {
        let resData = res.data;
        if (resData.errorCode == 1) {
          localStorage.setItem('userInfo', JSON.stringify(resData.result));
          return;
        }
        // Message.error({
        //    duration: 1000,
        //    message: resData.message
        //  })
      })
      .catch(function(error) {
        Message.error({
          duration: 1000,
          message: error.message
        });
      });
  }
  if (to.path == '/') {
    next({ path: '/login' });
  } else {
    next();
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
