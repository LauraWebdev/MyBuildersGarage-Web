import Vue from 'vue';
import VueRouter from 'vue-router';
import Store from '../store/index';
import MGGApi from '../modules/api';
import Index from '../views/Index.vue';
import Search from '../views/Search.vue';
import ChannelOverview from '../views/Channel/ChannelOverview.vue';
import ChannelDetail from '../views/Channel/ChannelDetail.vue';
import UserDetail from '../views/User/UserDetail.vue';
import UserEdit from '../views/User/UserEdit.vue';
import GameAdd from '../views/Game/GameAdd.vue';
import GameDetail from '../views/Game/GameDetail.vue';
import GameEdit from '../views/Game/GameEdit.vue';
import GameDelete from '../views/Game/GameDelete.vue';
import PlaylistDetail from '../views/Playlist/PlaylistDetail.vue';
import Legal from '../views/Legal.vue';
import Login from '../views/Auth/Login.vue';
import OauthCallback from '../views/Auth/OauthCallback.vue';
import Register from '../views/Auth/Register.vue';
import Logout from '../views/Auth/Logout.vue';

Vue.use(VueRouter);

const routes = [{
    path: '/',
    name: 'Index',
    component: Index,
    meta: {
        title: 'Discover & share game projects',
    }
}, {
    path: '/search/:query?',
    name: 'Search',
    component: Search,
    meta: {
        title: 'Search results',
    }
}, {
    path: '/channel/overview',
    name: 'ChannelOverview',
    component: ChannelOverview,
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
    path: '/user/:id/edit',
    name: 'UserEdit',
    component: UserEdit,
    meta: {
        title: 'Editing a user',
    }
}, {
    path: '/game/add',
    name: 'GameAdd',
    component: GameAdd,
    meta: {
        title: 'Add a new Game',
    }
}, {
    path: '/game/:id/edit',
    name: 'GameEdit',
    component: GameEdit,
    meta: {
        title: 'Editing a game',
    }
}, {
    path: '/game/:id/delete',
    name: 'GameDelete',
    component: GameDelete,
    meta: {
        title: 'Removing a game',
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
}, {
    path: '/auth/login',
    name: 'Login',
    component: Login,
    meta: {
        title: 'Login',
    }
}, {
    path: '/auth/register',
    name: 'Register',
    component: Register,
    meta: {
        title: 'Create a new acount',
    }
}, {
    path: '/auth/logout',
    name: 'Logout',
    component: Logout,
    meta: {
        title: 'Logout',
    }
}, {
    path: '/auth/callback/discord',
    name: 'OauthCallbackDiscord',
    component: OauthCallback,
    props: { method: 'discord' },
    meta: {
        title: 'Login',
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

    if(Store.state.userToken === undefined || Store.state.userToken === null) {
        next();
        return;
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