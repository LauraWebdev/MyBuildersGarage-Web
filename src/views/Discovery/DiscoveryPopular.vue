<template>
    <div class="page-centered">
        <div class="page-wrapper">
            <GameList>
                <GameItem v-for="game in popularGames" v-bind:key="game.id" v-bind="game"></GameItem>
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
            title: 'Most popular games',
        },
        components: {
            GameList,
            GameItem,
        },
        data: function() {
            return {
                apiRef: null,
                popularGames: [],
                page: 0,
            }
        },
        created: function() {
            this.$data.apiRef = new MGGApi();
        },
        mounted: function() {
            this.fetchPopularGames();
        },
        methods: {
            fetchPopularGames: async function(page) {
                try {
                    this.$data.popularGames = await this.$data.apiRef.getPopularGames(this.$data.page);
                } catch(error) {
                    console.error(error);
                }
            },
            nextPage: async function() {
                this.$data.page++;
                this.fetchPopularGames();
            },
            previousPage: async function() {
                this.$data.page--;
                this.fetchPopularGames();
            }
        }
    }
</script>

<style lang="less" scoped>
    .page-discovery {
        padding: 50px 0px;
    }
</style>
