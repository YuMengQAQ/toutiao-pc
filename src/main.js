import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//导入主要样式
import "./styles/index.less";

//导入elementUI
import "./plugIn/element";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
