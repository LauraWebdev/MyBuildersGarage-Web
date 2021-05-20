<template>
    <header>
        <router-link :to="{name: 'Index'}">
            <img src="@/assets/img/logoLight.svg" class="logo" />
        </router-link>

        <nav>
            <router-link :to="{name: 'Index'}" class="item">Discover</router-link>
            <router-link :to="{name: 'Search'}" class="item">Find</router-link>
        </nav>

        <div class="actions" v-if="$store.state.userToken !== null && $store.state.userToken !== undefined">
            <AvatarItem v-bind="$store.state.userData"></AvatarItem>
            <IconItem v-bind:route="{name: 'PlaylistDetail', params: {id: 1}}" v-bind:icon="'heart-outline'"></IconItem>
            <IconItem v-bind:route="{name: 'Logout'}" v-bind:icon="'close'"></IconItem>
        </div>
        <div class="actions actions-unauthorized" v-if="$store.state.userToken === null || $store.state.userToken === undefined">
            <Button to="/auth/register" filled>Join now!</Button>
            <Button to="/auth/login" class="button">Login</Button>
        </div>
    </header>
</template>

<script>
    import Button from '@/components/General/Button';
    import AvatarItem from '@/components/Header/AvatarItem';
    import IconItem from '@/components/Header/IconItem';

    export default {
        name: 'PageHeader',
        components: {
            Button,
            AvatarItem,
            IconItem
        },

    }
</script>

<style lang="less">
    header {
        background: #fff;
        box-shadow: 0px 2px 18px rgba(0,0,0,0.14);
        display: grid;
        padding: 0px 25px;
        grid-template-columns: auto 1fr auto;
        grid-gap: 25px;
        align-items: center;

        & .logo {
            height: 35px;
        }

        & nav {
            display: flex;
            align-items: center;

            & .item {
                font-size: 16px;
                text-decoration: none;
                padding: 12px 12px;
                border: 3px solid transparent;

                &:hover {
                    border-bottom-color: rgba(0,0,0,0.2);
                }
                &.router-link-exact-active {
                    border-bottom-color: #25B9FF;
                }
            }
        }

        & .actions {
            display: flex;

            &.actions-unauthorized {
                & a:nth-child(1) {
                    margin-right: 10px;
                }
            }
        }
    }
</style>