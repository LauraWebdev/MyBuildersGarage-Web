import Vue from 'vue';
import VueRouter from 'vue-router';
import Store from '../store/index';
import Index from '../views/Index.vue';

Vue.use(VueRouter);

const routes = [{
    path: '/',
    name: 'Index',
    component: Index,
    meta: {
        title: 'Discover & share game projects',
    }
}];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
    if(nearestWithTitle) {
        document.title = nearestWithTitle.meta.title + " ~ MyGarage.games";
    } else if(previousNearestWithMeta) {
        document.title = previousNearestWithMeta.meta.title + " ~ MyGarage.games";
    }

    Store.commit('authVerify');

    next();
});

export default router;