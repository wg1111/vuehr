import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {postKeyValue} from "./utils/api";
import {postRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import store from './store';
import {initMenu} from "./utils/menus";
import 'font-awesome/css/font-awesome.min.css'


Vue.prototype.postKeyValue = postKeyValue;
Vue.prototype.postRequest = postRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;

Vue.config.productionTip = false


router.beforeEach((to, from, next) => {
  if (to.path=='/'){
    next();
  }else {
    if (window.sessionStorage.getItem("user")) {
      initMenu(router, store);
      next();
    }else {
      // console.log(to)
      alert("请先登录！");
      next("/?redirect=" + to.path);
    }

  }
})

Vue.use(ElementUI,{ size: 'small'});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
