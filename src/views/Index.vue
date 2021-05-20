<template>
    <div class="home">
        <div v-if="$store.state.userToken !== null && $store.state.userToken !== undefined">
            <b>UserData</b><br />
            UserToken: {{ $store.state.userToken }}<br />
            UserName: {{ $store.state.userData.username }}<br /><br />
            <button v-on:click="logout()">Logout</button>
        </div>
        <hr />
        <strong v-if="errorMessage != ''">{{ errorMessage }}</strong>
        <hr />
        Username: <input type="text" v-model="userName" /><br />
        Password: <input type="password" v-model="userPass" /><br /><br />
        <button v-on:click="login()">Login</button>
    </div>
</template>

<script>
    import MGGApi from '../modules/api';

    export default {
        name: 'Index',
        components: {
        },
        data: function() {
            return {
                apiRef: null,
                userName: "",
                userPass: "",
                errorMessage: "",
            }
        },
        created: function() {
            this.$data.apiRef = new MGGApi(true);
        },
        methods: {
            async login() {
                this.$data.errorMessage = "";

                try {
                    const loginResponse = await this.$data.apiRef.authLogin(this.$data.userName, this.$data.userPass);
                    this.$store.dispatch('refreshUser', loginResponse);
                } catch(error) {
                    switch(error.name) {
                        case "UserNotFoundException":
                            // Wrong username
                            this.$data.errorMessage = "This user does not exist.";
                            break;
                        case "AuthenticationWrongException":
                            // Wrong Password
                            this.$data.errorMessage = "The password is incorrect.";
                            break;
                    }
                }
            },
            logout() {
                this.$store.dispatch('refreshUser', {
                    userData: null,
                    userRoles: null,
                    userToken: null
                });
            }
        }
    }
</script>
