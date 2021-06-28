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
        language: navigator.language,
        userToken: null,
        userData: null,
        userRoles: null
    },
    mutations: {
        SET_MODE(state, newUiMode) {
            state.uiMode = newUiMode;
        },
        SET_LANG(state, newLanguage) {
            state.language = newLanguage;
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
        setLanguage(context, language) {
            context.commit('SET_LANG', language);
        },
        setMode(context, uiMode) {
            context.commit('SET_MODE', uiMode);
        }
    },
    plugins: [vuexLocal.plugin]
});