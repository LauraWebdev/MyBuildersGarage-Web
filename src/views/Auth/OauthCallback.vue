<template>
    <div class="page-centered page-login">
        <div class="login-box">
            <div class="box-header">Login</div>
            <div class="box-content">
                <LoadingCircle />
            </div>
        </div>
    </div>
</template>

<script>
    import MGGApi from '../../modules/api';

    import LoadingCircle from '@/components/General/LoadingCircle';

    export default {
        name: 'OauthCallback',
        props: ['method'],
        components: {
            LoadingCircle,
        },
        data: function() {
            return {
                apiRef: null,
            }
        },
        created: function() {
            this.$data.apiRef = new MGGApi(true);
        },
        mounted: function() {
            if(this.$router.currentRoute.query.code == undefined) {
                this.$root.$emit('addSnackbar', {
                    type: "error",
                    icon: "key",
                    text: "Couldn't log you in. Please try again later.",
                    stay: true,
                });

                this.$router.push({name: 'Login'});
            } else {
                switch(this.$props.method) {
                    case "discord":
                        this.processDiscord();
                        break;
                }
            }
        },
        methods: {
            processDiscord: async function() {
                try {
                    const loginResponse = await this.$data.apiRef.oauthDiscordCallback( window.location );

                    this.$store.dispatch('refreshUser', loginResponse);

                    this.$root.$emit('addSnackbar', {
                        type: "success",
                        icon: "key",
                        text: "Welcome back, " + loginResponse.userData.username,
                        stay: false,
                    });

                    this.$router.push({ name: 'Index' });
                } catch(error) {
                    switch(error.name) {
                        default:
                            this.$root.$emit('addSnackbar', {
                                type: "error",
                                icon: "key",
                                text: "There was a server error logging you in. Please try again later.",
                                stay: false,
                            });
                            break;
                    }

                    this.$router.push({name: 'Login'});
                }
            },
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
            & .box-content {
                padding: 20px;
                display: grid;
                grid-gap: 15px;
                justify-content: center;
                padding: 50px 20px;
            }
        }
    }
</style>