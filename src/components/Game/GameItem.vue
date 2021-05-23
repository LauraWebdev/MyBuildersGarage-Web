<template>
    <router-link :to="{ name: 'GameDetail', params: { id: id }}" class="game-item">
        <div class="cover" :style="`background-image: url('${ coverFileName }')`">
            <div class="cover-actions" v-if="$store.state.userToken">
                <div class="action" v-on:click="addToPlaylist"><span class="mdi mdi-heart-outline"></span></div>
            </div>
        </div>
        <div class="title">{{ title }}</div>
        <div class="user">
            <div class="avatar" :style="`background-image: url('${ user.avatarFileName }')`"></div>
            <div class="username">{{ user.username }}</div>
        </div>
    </router-link>
</template>

<script>
    export default {
        name: 'GameItem',
        props: [
            'id',
            'title',
            'coverFileName',
            'user'
        ],
        methods: {
            addToPlaylist: function(event) {
                event.preventDefault();

                console.log("AddToPlaylist");
            }
        }
    }
</script>

<style lang="less" scoped>
    .game-item {
        display: grid;
        grid-gap: 5px;
        text-decoration: none;

        & .cover {
            background: rgba(0,0,0,0.1);
            background-position: center;
            background-size: cover;
            border-radius: 10px;
            width: 100%;
            padding-top: 56.25%;
            margin-bottom: 5px;
            position: relative;
            overflow: hidden;

            & .cover-actions {
                position: absolute;
                top: 0px;
                bottom: 0px;
                left: 0px;
                right: 0px;
                opacity: 0;
                background: rgba(0,0,0,0.4);
                transition: 0.2s ease-in-out opacity;
                display: flex;
                justify-content: center;
                align-items: center;

                & .action {
                    margin: 10px;
                    width: 56px;
                    height: 56px;
                    background: #fff;
                    font-size: 24px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: 0.2s ease-in-out opacity;

                    &:hover {
                        opacity: 0.6;
                    }
                }
            }

            &:hover {
                & .cover-actions {
                    opacity: 1;
                }
            }
        }
        & .title {
            font-size: 18px;
            font-weight: bold;
            letter-spacing: -0.05em;
            transition: 0.2s ease-in-out opacity;
        }
        & .user {
            display: grid;
            grid-template-columns: auto 1fr;
            grid-gap: 10px;
            align-content: center;
            transition: 0.2s ease-in-out opacity;

            & .avatar {
                width: 24px;
                height: 24px;
                background: rgba(0,0,0,0.1);
                background-position: center;
                background-size: cover;
                border-radius: 50%;
            }
            & .username {
                overflow: hidden;
            }
        }

        &:hover {
            cursor: pointer;

            & .title {
                opacity: 0.6;
            }
            & .user {
                opacity: 0.6;
            }
        }
    }
</style>