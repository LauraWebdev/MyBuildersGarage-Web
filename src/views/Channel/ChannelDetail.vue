<template>
    <div class="page-channelOverview">
        <div class="page-centered page-header" v-if="channelDetail != null">
            <div class="page-wrapper">
                <h1>{{ channelDetail.title }}</h1>
                <p>{{ channelDetail.description }}</p>
            </div>
        </div>

        <div class="page-centered page-channelList" v-if="channelDetail != null">
            <div class="page-wrapper">
                <GameList>
                    <GameItem v-for="game in channelDetail.games" v-bind:key="game.id" v-bind="game"></GameItem>
                </GameList>
            </div>
        </div>
    </div>
</template>

<script>
    import MGGApi from '../../modules/api';

    import GameList from '@/components/Game/GameList';
    import GameItem from '@/components/Game/GameItem';

    export default {
        name: 'ChannelDetail',
        components: {
            GameList,
            GameItem,
        },
        data: function() {
            return {
                apiRef: null,
                channelDetail: null,
            }
        },
        created: function() {
            this.$data.apiRef = new MGGApi(true);
        },
        mounted: function() {
            this.fetchChannelDetail(this.$router.currentRoute.params.id);
        },
        methods: {
            fetchChannelDetail: async function(channelID) {
                try {
                    this.$data.channelDetail = await this.$data.apiRef.getChannelDetail(channelID);
                    console.log(this.$data.channelDetail);
                } catch(error) {
                    console.error(error);
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .page-channelList {
        margin: 50px 0px;
    }
</style>