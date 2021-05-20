<template>
    <div class="page-centered page-logout">
        <div class="logout-box">
            <div class="box-header">Goodbye</div>
            <div class="box-content">
                You were successfully logged out!<br />
                Thank you for visiting myGarage.games!
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Logout',
        components: {
        },
        mounted: function() {
            // this.logout();
        },
        methods: {
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

<style lang="less" scoped>
    .page-logout {
        background: url('../../assets/img/patternLight.png') center #ffd332;

        & .logout-box {
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
                text-align: center;
                line-height: 1.5em;
            }
        }
    }
</style>