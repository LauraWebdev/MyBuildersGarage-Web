import Vue from 'vue';
import VueRouter from 'vue-router';
import Store from '../store/index';
import MGGApi from '../modules/api';
import Index from '../views/Index.vue';
import Search from '../views/Search.vue';
import AllChannels from '../views/Channel/AllChannels.vue';
import ChannelDetail from '../views/Channel/ChannelDetail.vue';
import UserDetail from '../views/User/UserDetail.vue';
import GameDetail from '../views/Game/GameDetail.vue';
import PlaylistDetail from '../views/Playlist/PlaylistDetail.vue';
import Legal from '../views/Legal.vue';

Vue.use(VueRouter);

const routes = [{
    path: '/',
    name: 'Index',
    component: Index,
    meta: {
        title: 'Discover & share game projects',
    }
}, {
    path: '/search/:query',
    name: 'Search',
    component: Search,
    meta: {
        title: 'Search results',
    }
}, {
    path: '/channel/all',
    name: 'AllChannels',
    component: AllChannels,
    meta: {
        title: 'Channels',
    }
}, {
    path: '/channel/:id',
    name: 'ChannelDetail',
    component: ChannelDetail,
    meta: {
        title: 'Channel',
    }
}, {
    path: '/user/:id',
    name: 'UserDetail',
    component: UserDetail,
    meta: {
        title: 'User profile',
    }
}, {
    path: '/game/:id',
    name: 'GameDetail',
    component: GameDetail,
    meta: {
        title: 'Game page',
    }
}, {
    path: '/playlist/:id',
    name: 'PlaylistDetail',
    component: PlaylistDetail,
    meta: {
        title: 'Playlist',
    }
}, {
    path: '/legal',
    name: 'Legal',
    component: Legal,
    meta: {
        title: 'Legal information',
    }
}];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach(async (to, from, next) => {
    const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
    if(nearestWithTitle) {
        document.title = nearestWithTitle.meta.title + " ~ MyGarage.games";
    } else {
        document.title = "MyGarage.games";
    }

    try {
        let mggApi = new MGGApi(true);
        let verifyResponse = await mggApi.authVerify(Store.state.userToken);

        Store.dispatch('refreshUser', verifyResponse);
        
        next();
    } catch(error) {
        Store.dispatch('refreshUser', {
            userData: null,
            roles: null,
            token: null
        });

        next();
    }
});

export default router;