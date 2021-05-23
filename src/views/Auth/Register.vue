<template>
    <div class="page-centered page-register">
        <div class="register-box">
            <div class="box-header">Create a new account</div>
            <div class="box-error" v-if="errorMessage">
                {{ errorMessage }}
            </div>
            <div class="box-content">
                <input class="input" type="text" v-model="userName" placeholder="Username" />
                <input class="input" type="password" v-model="userPass" placeholder="Password" />
                <input class="input" type="password" v-model="userPass2" placeholder="Password (again)" />
                <input class="input" type="email" v-model="userMail" placeholder="Email" />

                <button v-on:click="register()" class="button button-filled">Register</button>
            </div>
        </div>
    </div>
</template>

<script>
    import MGGApi from '../../modules/api';

    export default {
        name: 'Register',
        components: {
        },
        data: function() {
            return {
                apiRef: null,
                userName: "",
                userPass: "",
                userPass2: "",
                userMail: "",
                errorMessage: "",
            }
        },
        created: function() {
            this.$data.apiRef = new MGGApi(true);
        },
        methods: {
            register: async function() {
                this.$data.errorMessage = "";

                if(this.$data.userName == "" || this.$data.userPass == "" || this.$data.userPass2 == "" || this.$data.userMail == "") {
                    this.$data.errorMessage = "All fields have to be filled out";
                    return;
                }

                if(!this.$data.userMail.includes("@")) {
                    this.$data.errorMessage = "Please use a valid email";
                    return;
                }

                if(this.$data.userPass != this.$data.userPass2) {
                    this.$data.errorMessage = "The passwords are not the same.";
                    return;
                }

                try {
                    const registerResponse = await this.$data.apiRef.authRegister(this.$data.userName, this.$data.userPass, this.$data.userMail);
                    console.log(registerResponse);
                    this.$router.push({ name: 'Login' });
                } catch(error) {
                    console.error(error);

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
    .page-register {
        background: url('../../assets/img/patternLight.png') center #ffd332;

        & .register-box {
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