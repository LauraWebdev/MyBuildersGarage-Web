<template>
    <div class=" page-playlistdetail">
        <div class="page-centered page-header">
            <div class="page-wrapper">
                <h1 v-if="apiLoading">Playlist</h1>
                <h1 v-if="!apiLoading && playlistDetail != null">{{ playlistDetail.title }}</h1>
            </div>
        </div>

        <div class="playlist-loading" v-if="apiLoading">
            <LoadingCircle />
        </div>

        <div class="page-centered page-playlist">
            <div class="page-wrapper">
                <GameList v-if="!apiLoading && playlistDetail.games.length > 0">
                    <GameItem v-for="game in playlistDetail.games" v-bind:key="game.id" v-bind="game" v-bind:mode="'delete'"></GameItem>
                </GameList>
                <div class="playlist-nogames" v-if="!apiLoading && playlistDetail.games.length == 0">
                    There are no games in this playlist yet.
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import MGGApi from '../../modules/api';

    import LoadingCircle from '@/components/General/LoadingCircle';
    import GameList from '@/components/Game/GameList';
    import GameItem from '@/components/Game/GameItem';

    export default {
        name: 'PlaylistDetail',
        data: function() {
            return {
                apiRef: null,
                apiLoading: true,
                playlistDetail: null,
            }
        },
        components: {
            LoadingCircle,
            GameList,
            GameItem,
        },
        created: function() {
            this.$data.apiRef = new MGGApi();
        },
        mounted: function() {
            this.loadPlaylist();
        },
        methods: {
            loadPlaylist: async function() {
                this.$data.apiLoading = true;

                try {
                    this.$data.playlistDetail = await this.$data.apiRef.getPlaylistDetail(this.$router.currentRoute.params.id);
                    this.$data.apiLoading = false;

                    document.title = `${this.$data.playlistDetail.user.username}'s playlist ~ MyGarage.games`;
                } catch(error) {
                    console.error(error);
                    this.$data.apiLoading = false;
                }
            },
        }
    }
</script>

<style lang="less" scoped>
    .playlist-loading {
        padding: 150px 0px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    & .page-playlist {
        padding: 50px 0px;
    }
    .playlist-nogames {
        padding: 25px 50px;
        text-align: center;
        background: rgba(0,0,0,0.07);
        opacity: 0.5;
        border-radius: 5px;
    }
</style>