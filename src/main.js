import Vue from 'vue';
import axios from 'axios';
import {
    sync
} from 'vuex-router-sync';
import {
    createStore
} from './store';
import {
    createRouter
} from './router';
import injectComponents from './components';

import App from './app.vue';

import 'iview/dist/styles/iview.css';

import VueI18n from 'vue-i18n';
import Locales from './locale';
import zhLocale from 'iview/src/locale/lang/zh-CN';
import enLocale from 'iview/src/locale/lang/en-US';

// 引入Echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts; 

Vue.use(VueI18n);

// 自动设置语言
const navLang = navigator.language;
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false;
const lang = window.localStorage.getItem('language') || localLang || 'zh-CN';

Vue.config.lang = lang;

// 多语言配置
const locales = Locales;
const mergeZH = Object.assign(zhLocale, locales['zh-CN']);
const mergeEN = Object.assign(enLocale, locales['en-US']);
Vue.locale('zh-CN', mergeZH);
Vue.locale('en-US', mergeEN);

// 注入自定义组件
injectComponents(Vue);

// Store配置
const store = createStore();

// 路由配置
const router = createRouter();


// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)

const app = new Vue({
    router,
    store,
    render: h => h(App)
});

// wait until router has resolved all async before hooks
// and async components...
router.onReady(() => {
    // Add router hook for handling asyncData.
    // Doing it after initial route is resolved so that we don't double-fetch
    // the data that we already have. Using router.beforeResolve() so that all
    // async components are resolved.
    router.beforeResolve((to, from, next) => {
      const matched = router.getMatchedComponents(to)
      const prevMatched = router.getMatchedComponents(from)
      let diffed = false
      const activated = matched.filter((c, i) => {
        return diffed || (diffed = (prevMatched[i] !== c))
      })
      const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
      if (!asyncDataHooks.length) {
        return next()
      }

      axios.all(asyncDataHooks.map(hook => hook({ store, route: to })))
        .then(() => {
          next()
        })
        .catch(next)
    })
  
    // actually mount to DOM
    app.$mount('#app')
  })
  