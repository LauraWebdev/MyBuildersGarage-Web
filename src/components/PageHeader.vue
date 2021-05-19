<template>
    <header>
        <router-link :to="{name: 'Index'}">
            <img src="@/assets/img/logoLight.svg" class="logo" />
        </router-link>

        <nav>
            <router-link :to="{name: 'Index'}">Home</router-link>
            <router-link :to="{name: 'Search', params: {query: 'a'}}">Search</router-link>
        </nav>

        <div class="actions" v-if="$store.state.userToken !== null && $store.state.userToken !== undefined">
            <router-link :to="{name: 'UserDetail', params: {id: $store.state.userData.id}}" class="avatar" :style="'background-image: url(' + $store.state.userData.avatarFileName + ');'"></router-link>
        </div>
        <div class="actions" v-if="$store.state.userToken === null || $store.state.userToken === undefined">
            <Button to="/auth/register" filled>Join now!</Button>
            <Button to="/auth/login" class="button">Login</Button>
        </div>
    </header>
</template>

<script>
    import { mapGetters } from "vuex";
    import Button from '@/components/Button';

    export default {
        name: 'PageHeader',
        components: {
            Button
        },

    }
</script>

<style lang="less">
    header {
        background: #fff;
        box-shadow: 0px 2px 18px rgba(0,0,0,0.14);
        display: grid;
        grid-template-columns: auto 1fr auto;
        grid-gap: 15px;
        align-items: center;

        & .logo {
            height: 35px;
            margin: 0px 15px;
        }

        & .actions {
            display: flex;
            & .avatar {
                background: rgba(0,0,0,0.1);
                display: block;
                width: 36px;
                height: 36px;
                margin: 10px;
                border-radius: 50px;
            }
        }
    }
</style>