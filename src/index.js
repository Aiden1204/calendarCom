import Vue from 'vue'
import c_calendar from './components/calendar';
import '../public/css/reset.css'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n);

const components = [
  c_calendar,
];

import VueTouch from "./fun/VueTouch.js"
const install = function (Vue, opts = {}) {
  // 注册相关touch指令
  for(let x of ["tap","swipe","swipeleft","swiperight","swipedown","swipeup","longtap"]){
    Vue.directive(x, {
      bind: function (el, binding) {
        new VueTouch(el, binding, x);
      }
    });
  }
  Vue.prototype._i18n = new VueI18n({
    locale: localStorage.getItem('locale') || 'zh-CN',    // 语言标识
    messages: {
      'zh-CN': require('./lang/zh'),   // 中文语言包
      'en-US': require('./lang/en')    // 英文语言包
    }
  });
  components.map(component => {
    Vue.component(component.name, component);
  })
};

/* 支持使用标签的方式引入 */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  c_calendar,
}
