import Vue from 'vue'
import App from './App.vue'
import router from './router'

import(`../public/css/reset.css`);

import VueI18n from 'vue-i18n'

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: localStorage.getItem('locale') || 'zh-CN',    // 语言标识
  messages: {
    'zh-CN': require('./lang/zh'),   // 中文语言包
    'en-US': require('./lang/en')    // 英文语言包
  }
});

// 注册相关touch指令
import VueTouch from "./fun/VueTouch.js"
for(let x of ["tap","swipe","swipeleft","swiperight","swipedown","swipeup","longtap"]){
  Vue.directive(x, {
    bind: function (el, binding) {
      new VueTouch(el, binding, x);
    }
  });
}

Vue.config.productionTip = false;

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app');
