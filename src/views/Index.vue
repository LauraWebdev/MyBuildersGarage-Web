<template>
    <div class="page page-wrapper page-index">
        <div class="support">
            <span class="mdi mdi-hand-heart"></span>
            <div class="text" v-html="$t('index.support')"></div>
            <div class="actions">
                <ExternalLinkButton href="https://paypal.me/pools/c/8Ad2xnFEH4">PayPal Moneypool</ExternalLinkButton>
                <ExternalLinkButton href="https://indiegesindel.itch.io/">Itch.io Games</ExternalLinkButton>
            </div>
        </div>

        <GameList v-bind:title="$t('index.newestHeader')">
            <GameItem v-for="game in newestGames" v-bind:key="game.id" v-bind="game"></GameItem>
        </GameList>

        <GameList v-bind:title="$t('index.popularHeader')">
            <GameItem v-for="game in popularGames" v-bind:key="game.id" v-bind="game"></GameItem>
        </GameList>

        <div class="welcome">
            <span class="mdi mdi-bug"></span>
            <div class="text" v-html="$t('index.welcome')"></div>
            <div class="actions">
                <ExternalLinkButton href="https://mygarage.games/discord">Indiegesindel Discord</ExternalLinkButton>
            </div>
        </div>
    </div>
</template>

<script>
    import MGGApi from '../modules/api';

    import ExternalLinkButton from '@/components/General/ExternalLinkButton';
    import GameList from '@/components/Game/GameList';
    import GameItem from '@/components/Game/GameItem';

    export default {
        name: 'Index',
        metaInfo: {
            title: 'Discover & Share',
        },
        components: {
            ExternalLinkButton,
            GameList,
            GameItem,
        },
        data: function() {
            return {
                apiRef: null,
                newestGames: [],
                popularGames: []
            }
        },
        created: function() {
            this.$data.apiRef = new MGGApi();
        },
        mounted: function() {
            this.fetchNewestGames();
            this.fetchPopularGames();
        },
        methods: {
            fetchNewestGames: async function() {
                try {
                    this.$data.newestGames = await this.$data.apiRef.getNewestGames(this.$store.state.userToken);
                } catch(error) {
                    console.error(error);
                }
            },
            fetchPopularGames: async function() {
                try {
                    this.$data.popularGames = await this.$data.apiRef.getPopularGames(this.$store.state.userToken);
                } catch(error) {
                    console.error(error);
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .page-index {
        padding: 50px 0px;
        display: grid;
        grid-gap: 50px;
        align-content: flex-start;

        & .support, & .welcome {
            background: #25b9ff44;
            padding: 25px;
            border-radius: 5px;
            display: grid;
            grid-template-columns: auto 1fr;
            grid-gap: 10px 25px;

            & .mdi {
                color: #25b9ff;
                font-size: 24px;
            }
            & .text {
                line-height: 1.5em;
                opacity: 0.6;
            }
            & .actions {
                grid-column: 2;

                & a {
                    margin-right: 10px;
                }
            }
        }

        & .welcome {
            background: #00d19844;

            & .mdi {
                color: #00d198;
            }
        }
    }

    .theme-dark {
        & .support, & .welcome {
            & .actions {
                & a {
                    color: #fff;
                    border-color: rgba(255,255,255,0.4);
                }
            }
        }
    }
</style>
