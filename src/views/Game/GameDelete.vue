<template>
    <div class="page-gamedelete">
        <div class="page-centered page-header">
            <div class="page-wrapper">
                <h1>Removing a game</h1>
                <p>All actions are unreversible!</p>
            </div>
        </div>

        <div class="page-centered page-deleteLoading" v-if="apiLoading">
            <div class="page-wrapper">
                <LoadingCircle />
            </div>
        </div>
        <div class="page-centered page-deleteForm" v-if="!apiLoading">
            <div class="page-wrapper">
                <div class="title">Are you sure?</div>
                <div class="text">You are about to remove your game <strong>{{ gameDetail.title }}</strong> from MyGarage.games. All screenshots and comments will be deleted with it. This action is unreversible.</div>
                <div class="actions">
                    <LinkButton :to="{ name: 'GameDetail', params: { id: gameDetail.id } }" filled>Nevermind</LinkButton>
                    <div class="button" v-on:click="confirmDeletion()">Yes, go ahead!</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import MGGApi from '../../modules/api';

    import LoadingCircle from '@/components/General/LoadingCircle';
    import LinkButton from '@/components/General/LinkButton';

    export default {
        name: 'GameDelete',
        data: function() {
            return {
                apiRef: null,
                apiLoading: true,
                gameDetail: null,
            }
        },
        components: {
            LoadingCircle,
            LinkButton
        },
        created: function() {
            this.$data.apiRef = new MGGApi();
        },
        mounted: function() {
            this.loadGame();
        },
        methods: {
            loadGame: async function() {
                this.$data.apiLoading = true;

                try {
                    let gameResponse = await this.$data.apiRef.getGameDetail(this.$router.currentRoute.params.id);
                    this.$data.gameDetail = gameResponse.game;
                    this.$data.apiLoading = false;
                } catch(error) {
                    console.error(error);
                    this.$data.apiLoading = false;
                }
            },
            confirmDeletion: async function() {
                this.$data.apiLoading = true;

                try {
                    await this.$data.apiRef.deleteGame(this.$router.currentRoute.params.id, this.$store.state.userToken);

                    this.$root.$emit('addSnackbar', {
                        type: "success",
                        icon: "trash-can-outline",
                        text: "Game was deleted.",
                        stay: false,
                    });

                    this.$router.push({
                        name: 'UserDetail',
                        params: { id: this.$store.state.userData.id }
                    });
                } catch(error) {
                    console.error(error);
                    this.$data.apiLoading = false;

                    this.$root.$emit('addSnackbar', {
                        type: "error",
                        icon: "trash-can-outline",
                        text: "Could not delete game.",
                        stay: false,
                    });
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .page-deleteLoading {
        margin: 100px 0px;

        & .page-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    .page-deleteForm {
        margin: 50px 0px;

        & .page-wrapper {
            max-width: 600px;
            display: grid;
            grid-gap: 15px;

            & .title {
                font-size: 24px;
                font-weight: bold;
            }
            & .text {
                line-height: 1.5em;
            }
            & .actions {
                margin-top: 10px;

                & .button {
                    margin-right: 15px;
                }
            }
        }
    }
</style>