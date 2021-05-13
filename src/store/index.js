import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

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
        authLogin(context, { username, password }) {
            axios.post('http://localhost:1337/api/v1/auth/login', {
                "username": username,
                "password": password
            }).then(response => {
                context.commit('SET_USER', response.data);
            }).catch(error => {
                console.error(error);
            });
        },
        authLogout(context) {
            context.commit('SET_USER', {
                token: null,
                userData: null,
                roles: null
            });
        },
        authVerify(context) {
            axios.post('http://localhost:1337/api/v1/auth/verify', {
                "token": context.state.token
            }).then(response => {
                console.log(response.data);
            }).catch(error => {
                console.error(error);
            });
        }
    },
    modules: {
        getUserToken(state) {
            return state.userToken;
        },
        getUserData(state) {
            if(userData === null) { return {}; }

            return state.userData;
        },
        getUserRoles(state) {
            if(userData === null) { return []; }

            return state.userRoles;
        },
        getUserPlaylists(state) {
            if(userData === null) { return []; }

            return state.userData.playlists;
        }
    }
});