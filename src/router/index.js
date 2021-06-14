import Vue from 'vue';
import VueRouter from 'vue-router';
import Store from '../store/index';
import MGGApi from '../modules/api';
import Index from '../views/Index.vue';
import DiscoveryIndex from '../views/Discovery/DiscoveryIndex.vue';
import DiscoveryNewest from '../views/Discovery/DiscoveryNewest.vue';
import DiscoveryHotThisWeek from '../views/Discovery/DiscoveryHotThisWeek.vue';
import DiscoveryPopular from '../views/Discovery/DiscoveryPopular.vue';
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
import Talk from '../views/Talk.vue';
import Login from '../views/Auth/Login.vue';
import OauthCallback from '../views/Auth/OauthCallback.vue';
import Register from '../views/Auth/Register.vue';
import Logout from '../views/Auth/Logout.vue';

Vue.use(VueRouter);

const routes = [{
    path: '/',
    name: 'Index',
    component: Index,
    children: [
        {
            path: '/',
            redirect: '/discovery/index',
        }, {
            path: '/discovery/index',
            name: 'DiscoveryIndex',
            component: DiscoveryIndex,
        }, {
            path: '/discovery/hotThisWeek',
            name: 'DiscoveryHotThisWeek',
            component: DiscoveryHotThisWeek,
        }, {
            path: '/discovery/newest',
            name: 'DiscoveryNewest',
            component: DiscoveryNewest,
        }, {
            path: '/discovery/popular',
            name: 'DiscoveryPopular',
            component: DiscoveryPopular,
        }
    ]
}, {
    path: '/search/:query?',
    name: 'Search',
    component: Search,
}, {
    path: '/channel/overview',
    name: 'ChannelOverview',
    component: ChannelOverview,
}, {
    path: '/channel/:id',
    name: 'ChannelDetail',
    component: ChannelDetail,
}, {
    path: '/user/:id',
    name: 'UserDetail',
    component: UserDetail,
}, {
    path: '/user/:id/edit',
    name: 'UserEdit',
    component: UserEdit,
}, {
    path: '/game/add',
    name: 'GameAdd',
    component: GameAdd,
}, {
    path: '/game/:id/edit',
    name: 'GameEdit',
    component: GameEdit,
}, {
    path: '/game/:id/delete',
    name: 'GameDelete',
    component: GameDelete,
}, {
    path: '/game/:id',
    name: 'GameDetail',
    component: GameDetail,
}, {
    path: '/playlist/:id',
    name: 'PlaylistDetail',
    component: PlaylistDetail,
}, {
    path: '/legal',
    name: 'Legal',
    component: Legal,
}, {
    path: '/talk',
    name: 'Talk',
    component: Talk,
}, {
    path: '/auth/login',
    name: 'Login',
    component: Login,
}, {
    path: '/auth/register',
    name: 'Register',
    component: Register,
}, {
    path: '/auth/logout',
    name: 'Logout',
    component: Logout,
}, {
    path: '/auth/callback/discord',
    name: 'OauthCallbackDiscord',
    component: OauthCallback,
    props: { method: 'discord' },
}];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach(async (to, from, next) => {
    if(Store.state.userToken === undefined || Store.state.userToken === null) {
        next();
        return;
    }

    try {
        let mggApi = new MGGApi();
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