import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
    storage: window.localStorage
});

export default new Vuex.Store({
    state: {
        userToken: null,
        userData: null,
        userRoles: null
    },
    mutations: {
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
    },
    plugins: [vuexLocal.plugin]
});