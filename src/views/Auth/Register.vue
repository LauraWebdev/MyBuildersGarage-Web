<template>
    <div class="page-centered page-register">
        <div class="register-box">
            <div class="box-header">Create a new account</div>
            <div class="box-content">
                <input class="input" type="text" v-model="userName" placeholder="Username" />
                <span>Allowed characters: a-z, A-Z, 0-9, hyphens, underscores</span>
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
            }
        },
        created: function() {
            this.$data.apiRef = new MGGApi(true);
        },
        methods: {
            register: async function() {
                if(this.$data.userName == "" || this.$data.userPass == "" || this.$data.userPass2 == "" || this.$data.userMail == "") {
                    this.$root.$emit('addSnackbar', {
                        type: "error",
                        icon: "key",
                        text: "All fields must be filled out.",
                        stay: false,
                    });
                    return;
                }

                if(!this.$data.userMail.includes("@")) {
                    this.$root.$emit('addSnackbar', {
                        type: "error",
                        icon: "key",
                        text: "Please use a valid email adress.",
                        stay: false,
                    });
                    return;
                }

                if(this.$data.userPass != this.$data.userPass2) {
                    this.$root.$emit('addSnackbar', {
                        type: "error",
                        icon: "key",
                        text: "The entered passwords are not identical.",
                        stay: false,
                    });
                    return;
                }

                try {
                    const registerResponse = await this.$data.apiRef.authRegister(this.$data.userName, this.$data.userPass, this.$data.userMail);
                    
                    this.$root.$emit('addSnackbar', {
                        type: "success",
                        icon: "key",
                        text: "Successfully created a new account.",
                        stay: false,
                    });
                    this.$router.push({ name: 'Login' });
                } catch(error) {
                    console.error(error);

                    switch(error.name) {
                        default:
                            this.$root.$emit('addSnackbar', {
                                type: "error",
                                icon: "key",
                                text: "Could not create account due to a server error. Please try again later.",
                                stay: false,
                            });
                            break;
                        case "UsernameInvalidException":
                            this.$root.$emit('addSnackbar', {
                                type: "error",
                                icon: "key",
                                text: "This username contains forbidden characters. Allowed characters are a-z, A-Z, 0-9, hyphens and underscores.",
                                stay: false,
                            });
                            break;
                        case "UsernameEmailConflictException":
                            this.$root.$emit('addSnackbar', {
                                type: "error",
                                icon: "key",
                                text: "This username or email is already in use!",
                                stay: false,
                            });
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
            & .box-content {
                padding: 20px;
                display: grid;
                grid-gap: 15px;

                & button {
                    justify-self: right;
                }
            }

            & span {
                margin-top: -8px;
                margin-bottom: 8px;
                font-size: 10px;
            }
        }
    }
</style>