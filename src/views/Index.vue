<template>
    <div class="home">
        <div v-if="$store.state.userToken !== null">
            <b>UserData</b><br />
            UserToken: {{ $store.state.userToken }}<br />
            UserName: {{ $store.state.userData.username }}<br /><br />
            <button v-on:click="logout()">Logout</button>
        </div>
        <hr />
        Username: <input type="text" v-model="userName" /><br />
        Password: <input type="password" v-model="userPass" /><br /><br />
        <button v-on:click="login()">Login</button>
    </div>
</template>

<script>
    export default {
        name: 'Index',
        components: {
        },
        data: function() {
            return {
                userName: "",
                userPass: ""
            }
        },
        methods: {
            login() {
                this.$store.dispatch('authLogin', {
                    username: this.$data.userName,
                    password: this.$data.userPass
                });
            },
            logout() {
                this.$store.dispatch('authLogout');
            }
        }
    }
</script>
