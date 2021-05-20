import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
    storage: window.localStorage
});

export default new Vuex.Store({
    state: {
        uiMode: "light",
        userToken: null,
        userData: null,
        userRoles: null
    },
    mutations: {
        SET_MODE(state, uiMode) {
            state.uiMode = uiMode;
        },
        SET_USER(state, userResponse) {
            state.userToken = userResponse.token;
            state.userData = userResponse.userData;
            state.userRoles = userResponse.roles;
        }
    },
    actions: {
        refreshUser(context, userResponse) {
            context.commit('SET_USER', userResponse);
        },
        setMode(context, uiMode) {
            context.commit('SET_MODE', uiMode);
        }
    },
    plugins: [vuexLocal.plugin]
});