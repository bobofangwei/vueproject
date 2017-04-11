// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import goods from '@/components/goods/goods.vue';
import sellers from '@/components/sellers/sellers.vue';
import ratings from '@/components/ratings/ratings.vue';
import VueResource from 'vue-resource';

import '@/common/scss/index.scss';

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(VueResource);
/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   template: '<App/>',
//   components: { App }
// });

const routes = [{
    path: '/goods',
    component: goods
}, {
    path: '/ratings',
    component: ratings
}, {
    path: '/sellers',
    component: sellers
}];
const router = new VueRouter({
    routes: routes,
    linkActiveClass: 'active'
});

new Vue({
    template: '<app></app>',
    router: router,
    components: {
        App
    }
}).$mount('#app');

router.push({
    path: '/goods'
});