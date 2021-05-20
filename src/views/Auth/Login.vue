<template>
    <div class="page-centered page-login">
        <div class="login-box">
            <div class="box-header">Login</div>
            <div class="box-error" v-if="errorMessage">
                {{ errorMessage }}
            </div>
            <div class="box-content">
                <input class="input" type="text" v-model="userName" placeholder="Username" />
                <input class="input" type="password" v-model="userPass" placeholder="Password" />

                <button v-on:click="login()" class="button button-filled">Login</button>
            </div>
        </div>
    </div>
</template>

<script>
    import MGGApi from '../../modules/api';

    export default {
        name: 'Login',
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

                if(this.$data.userName == "" || this.$data.userPass == "") {
                    this.$data.errorMessage = "All fields have to be filled out";
                    return;
                }

                try {
                    const loginResponse = await this.$data.apiRef.authLogin(this.$data.userName, this.$data.userPass);
                    this.$store.dispatch('refreshUser', loginResponse);
                    this.$router.push({ name: 'Index' });
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
            }
        }
    }
</script>

<style lang="less" scoped>
    .page-login {
        background: url('../../assets/img/patternLight.png') center #ffd332;

        & .login-box {
            background: #fff;
            border: 2px solid #222;
            border-radius: 10px;
            width: 90%;
            max-width: 400px;
            overflow: hidden;
            margin: 25px 0px;

            & .box-header {
                background: #222;
                padding: 10px 15px;
                font-size: 12px;
                color: #fff;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 0.15em;
            }
            & .box-error {
                background: #fd084d;
                color: #fff;
                font-weight: bold;
                text-align: center;
                padding: 15px;
            }
            & .box-content {
                padding: 20px;
                display: grid;
                grid-gap: 15px;

                & button {
                    justify-self: right;
                }
            }
        }
    }
</style>