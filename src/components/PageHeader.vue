<template>
    <header>
        <img src="@/assets/img/logoLight.svg" class="logo" />

        <div class="search">
            SEARCH BOX
        </div>

        <div class="actions" v-if="$store.state.userToken !== null">
            <router-link to="/" class="avatar" :style="'background: url(' + $store.state.userData.avatarFileName + ');'"></router-link>
        </div>
        <div class="actions" v-if="$store.state.userToken === null">
            <Button to="/auth/register" filled>Join now!</Button>
            <Button to="/auth/login" class="button">Login</Button>
        </div>
    </header>
</template>

<script>
    import Button from '@/components/Button';

    export default {
        name: 'PageHeader',
        components: {
            Button
        }
    }
</script>

<style lang="less">
    header {
        background: #fff;
        box-shadow: 0px 2px 18px rgba(0,0,0,0.14);
        display: grid;
        grid-template-columns: auto 1fr auto;
        grid-gap: 15px;

        & .logo {
            height: 35px;
        }
    }
</style>