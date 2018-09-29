// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import rem from '@/common/js/rem' //
import http from '@/common/js/http' //
import { setMetaTitle,dateFormat } from '@/common/js/util.js'

import '@/common/js/base'

import '@/assets/font/iconfont.css'
import '@/assets/css/reset.css'

import Calendar from 'vue2-datepick';
Vue.use(Calendar);

Vue.config.productionTip = false

//�Զ������
Vue.directive('title', {
  inserted: function (el, binding) {
    setMetaTitle(binding.value)
  }
})
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {
        App,
    },
    data: {
        eventHub: new Vue(),
        http: http //
    },
    template: '<App/>',
})
