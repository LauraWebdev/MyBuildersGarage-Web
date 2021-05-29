<template>
    <div class="page-userdetail">
        <div class="user-loading" v-if="apiLoading">
            <LoadingCircle />
        </div>
        <div class="user-detail" v-if="!apiLoading">
            <div class="user-bar"></div>
            <div class="user-basic">
                <div class="avatar" :style="`background-image: url('${ userDetail.avatarFileName }')`"></div>
                <div class="username">{{ userDetail.username }}</div>
            </div>

            <div class="page-centered">
                <div class="page-wrapper page-thirdssplit">
                    <div class="user-meta">
                        <div class="meta-info">
                            <div class="item" v-if="userDetail.pronouns != null">
                                <div class="property">Pronouns</div>
                                <div class="content">{{ userDetail.pronouns }}</div>
                            </div>
                            <div class="item" v-if="userDetail.ingameID != null">
                                <div class="property">Ingame-ID</div>
                                <div class="content">{{ userDetail.ingameID }}</div>
                            </div>
                            <div class="item">
                                <div class="property">Joined</div>
                                <div class="content">{{ createdFormatted }}</div>
                            </div>
                        </div>
                        <div class="meta-info" v-if="userDetail.socialDiscord != null || userDetail.socialTwitter != null || userDetail.socialYouTube != null">
                            <div class="item" v-if="userDetail.socialDiscord != null">
                                <div class="property">Discord</div>
                                <div class="content">{{ userDetail.socialDiscord }}</div>
                            </div>
                            <div class="item" v-if="userDetail.socialTwitter != null">
                                <div class="property">Twitter</div>
                                <div class="content">{{ userDetail.socialTwitter }}</div>
                            </div>
                            <div class="item" v-if="userDetail.socialYouTube != null">
                                <div class="property">YouTube</div>
                                <div class="content">{{ userDetail.socialYouTube }}</div>
                            </div>
                        </div>

                        <div class="actions" v-if="userDetail.id == $store.state.userData.id || $store.state.userRoles.includes('moderator', 'admin')">
                            <LinkButton :to="{ name: 'UserEdit', params: { id: userDetail.id }}" filled>Edit</LinkButton>
                        </div>

                        <div class="actions" v-if="$store.state.userRoles.includes('moderator', 'admin')">
                            <LinkButton to="/">Ban User</LinkButton>
                        </div>
                    </div>
                    <div class="user-games" v-if="userDetail.games.length > 0">
                        <GameItem v-for="game in userDetail.games" v-bind:key="game.id" v-bind="game"></GameItem>
                    </div>
                    <div class="user-nogames" v-if="userDetail.games.length == 0">
                        This user has not uploaded any games yet.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import MGGApi from '../../modules/api';

    import LoadingCircle from '@/components/General/LoadingCircle';
    import LinkButton from '@/components/General/LinkButton';
    import GameItem from '@/components/Game/GameItem';

    export default {
        name: 'UserDetail',
        data: function() {
            return {
                apiRef: null,
                apiLoading: true,
                userDetail: null,
                createdFormatted: "",
            }
        },
        components: {
            LoadingCircle,
            LinkButton,
            GameItem,
        },
        created: function() {
            this.$data.apiRef = new MGGApi(true);
        },
        mounted: function() {
            this.loadUser();
        },
        methods: {
            loadUser: async function() {
                this.$data.apiLoading = true;

                try {
                    this.$data.userDetail = await this.$data.apiRef.getUserDetail(this.$router.currentRoute.params.id);
                    this.$data.apiLoading = false;

                    document.title = `${this.$data.userDetail.username}'s profile ~ MyGarage.games`;

                    this.$data.createdFormatted = new Date(Date.parse(this.$data.userDetail.createdAt)).toLocaleDateString("en-US");
                } catch(error) {
                    console.error(error);
                    this.$data.apiLoading = false;
                }
            },
        }
    }
</script>


<style lang="less" scoped>
    .user-loading {
        padding: 150px 0px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .user-bar {
        background: url('../../assets/img/patternLight.png') center rgba(0,0,0,0.07);
        height: 140px;
    }
    & .page-thirdssplit {
        display: grid;
        grid-template-columns: minmax(350px, 1fr) 2fr;
        grid-gap: 25px;
        padding: 50px 0px;
        align-items: flex-start;
    }
    .user-basic {
        display: grid;
        grid-gap: 15px;

        & .avatar {
            background-position: center;
            background-size: cover;
            width: 150px;
            height: 150px;
            border-radius: 200px;
            margin-top: -120px;
            justify-self: center;
        }
        & .username {
            font-size: 22px;
            font-weight: bold;
            justify-self: center;
        }
    }
    .user-meta {
        display: grid;
        grid-gap: 15px;

        & .meta-info {
            display: grid;
            grid-gap: 10px;
            margin-bottom: 25px;

            & .item {
                display: grid;
                grid-template-columns: 1fr 2fr;
                grid-gap: 15px;

                & div:nth-child(1) {
                    opacity: 0.6;
                }
            }
        }
        & .actions {
            display: grid;
            grid-gap: 10px;
            text-align: center;
        }
    }
    .user-games {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 25px;
    }
    .user-nogames {
        padding: 25px 50px;
        text-align: center;
        background: rgba(0,0,0,0.07);
        opacity: 0.5;
        border-radius: 5px;
    }
</style>