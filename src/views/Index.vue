<template>
    <div class="page page-wrapper page-index">
        <div class="welcome">
            <div class="box">
                <div class="box-header">Welcome</div>
                <div class="box-content">
                    Welcome to the MyGarage.games BETA! Please report bugs and feedback in the Discord.<br />
                    <i>Thank you!</i>
                </div>
            </div>
        </div>

        <GameList v-bind:title="'New Games'">
            <GameItem v-for="game in latestGames" v-bind:key="game.id" v-bind="game"></GameItem>
        </GameList>
    </div>
</template>

<script>
    import MGGApi from '../modules/api';

    import GameList from '@/components/Game/GameList';
    import GameItem from '@/components/Game/GameItem';

    export default {
        name: 'Index',
        components: {
            GameList,
            GameItem,
        },
        data: function() {
            return {
                apiRef: null,
                latestGames: [],
            }
        },
        created: function() {
            this.$data.apiRef = new MGGApi(true);
        },
        mounted: function() {
            this.fetchLatestGames();
        },
        methods: {
            fetchLatestGames: async function() {
                // TODO: Fetch latest games
                try {
                    this.$data.latestGames = await this.$data.apiRef.getAllGames();
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

        & .welcome {
            background: url('../assets/img/patternLight.png') center #25b9ff;
            border-radius: 10px;
            box-shadow: 0px 4px 24px rgba(0,0,0,0.12);
            display: flex;
            justify-content: center;
            align-items: center;

            & .box {
                background: #fff;
                border: 2px solid #222;
                border-radius: 10px;
                width: 90%;
                margin: 50px;
                max-width: 400px;
                overflow: hidden;

                & .box-header {
                    background: #222;
                    padding: 10px 15px;
                    font-size: 12px;
                    color: #fff;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                }
                & .box-content {
                    padding: 20px;
                    display: grid;
                    grid-gap: 15px;
                    text-align: center;
                    line-height: 1.5em;
                }
            }
        }
    }
</style>
