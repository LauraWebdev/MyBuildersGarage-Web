import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
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
                userToken: null,
                userData: null,
                userRoles: null
            });
        },
        authVerify(context) {
            // TODO: This is broken. Verify / UserToken gets killed every few page transitions.
            // TODO: Export into an API wrapper

            if(context.state.userToken !== null && context.state.userToken !== undefined) {
                console.log(`[Store] Verifying Auth`);

                console.log(context.state.userToken);

                axios.post('http://localhost:1337/api/v1/auth/verify', {
                    "token": context.state.userToken
                }).then(response => {
                    context.commit('SET_USER', {
                        userToken: response.data.token,
                        userData: response.data.userData,
                        userRoles: response.data.roles
                    });

                    console.log(response.data);
                }).catch(error => {
                    if(error.response.data.name === "AUTHENTICATION_WRONG") {
                        // Token Invalid
                        context.commit('SET_USER', {
                            userToken: null,
                            userData: null,
                            userRoles: null
                        });
                    } else {
                        console.error(error);
                    }
                });
            }
        }
    },
    plugins: [vuexLocal.plugin]
});