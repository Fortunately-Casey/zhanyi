import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import BaiduMap from "vue-baidu-map";
Vue.use(BaiduMap, {
  ak: "Ocm4ieXqGPaZZgblGHi4GTnDfGfZcBbv"
});
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
