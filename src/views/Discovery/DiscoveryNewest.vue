<template>
    <div class="page-centered">
        <div class="page-wrapper">
            <GameList>
                <GameItem v-for="game in newestGames" v-bind:key="game.id" v-bind="game"></GameItem>
            </GameList>
        </div>
    </div>
</template>

<script>
    import MGGApi from '../../modules/api';

    import GameList from '@/components/Game/GameList';
    import GameItem from '@/components/Game/GameItem';

    export default {
        name: 'DiscoveryNewest',
        metaInfo: {
            title: 'Newest games',
        },
        components: {
            GameList,
            GameItem,
        },
        data: function() {
            return {
                apiRef: null,
                newestGames: [],
                page: 0,
            }
        },
        created: function() {
            this.$data.apiRef = new MGGApi();
        },
        mounted: function() {
            this.fetchNewestGames();
        },
        methods: {
            fetchNewestGames: async function(page) {
                try {
                    this.$data.newestGames = await this.$data.apiRef.getNewestGames(this.$data.page);
                } catch(error) {
                    console.error(error);
                }
            },
            nextPage: async function() {
                this.$data.page++;
                this.fetchNewestGames();
            },
            previousPage: async function() {
                this.$data.page--;
                this.fetchNewestGames();
            }
        }
    }
</script>

<style lang="less" scoped>
    .page-discovery {
        padding: 50px 0px;
    }
</style>
