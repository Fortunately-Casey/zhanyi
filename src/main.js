import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import BaiduMap from "vue-baidu-map";
import Mint from 'mint-ui';
import "mint-ui/lib/style.css";
import 'lib-flexible/flexible.js'
Vue.use(Mint);
Vue.use(BaiduMap, {
  ak: "Ocm4ieXqGPaZZgblGHi4GTnDfGfZcBbv"
});
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
