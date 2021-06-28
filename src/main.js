import Vue from 'vue'
import VueMeta from 'vue-meta'
import VueI18n from 'vue-i18n'
import VueNL2BR from 'vue-nl2br'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import messages from './locales/index';

Vue.config.productionTip = false;

Vue.use(VueMeta);
Vue.use(VueI18n);

Vue.component('nl2br', VueNL2BR);

let i18n = new VueI18n({
  locale: store.state.language,
  fallbackLocale: 'en',
  messages
});

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
