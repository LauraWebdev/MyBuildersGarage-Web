<template>
    <div class="page-logout">
        You were successfully logged out!
        Thank you for visiting myGarage.games!
    </div>
</template>

<script>
    export default {
        name: 'Logout',
        components: {
        },
        mounted: function() {
            this.logout();
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
