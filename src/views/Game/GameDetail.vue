<template>
    <div class="page-gamedetail">
        <div class="game-loading" v-if="apiLoading || gameDetail == null">
            <LoadingCircle />
        </div>
        <div class="game-detail" v-if="!apiLoading && gameDetail != null">
            <div class="game-header" :style="`background-image: url('${gameDetail.coverFileName}')`" v-on:click="openTrailer()" v-if="gameDetail.youtubeID != ''">
                <div class="header-shade">
                    <span class="mdi mdi-play-circle-outline"></span>
                </div>
            </div>

            <div class="page-centered">
                <div class="page-wrapper page-thirdssplit">
                    <div class="game-meta">
                        <h1>{{ gameDetail.title }}</h1>
                        <router-link :to="{ name: 'UserDetail', params: { id: gameDetail.user.id } }" class="user">
                            <div class="avatar" :style="`background-image: url('${ gameDetail.user.avatarFileName }')`"></div>
                            <div class="username">{{ gameDetail.user.username }}</div>
                        </router-link>
                        <div class="gameID">
                            <div class="ingameID">{{ gameDetail.ingameID }}</div>
                            <div class="addToPlaylist" v-on:click="addToPlaylist" v-if="!isInPlaylist && !playlistActionLoading"><span class="mdi mdi-heart-outline"></span></div>
                            <div class="addToPlaylist loading" v-if="playlistActionLoading"><span class="mdi mdi-loading"></span></div>
                            <div class="addToPlaylist" v-on:click="deleteFromPlaylist" v-if="isInPlaylist && !playlistActionLoading"><span class="mdi mdi-heart-off"></span></div>
                        </div>
                        <div class="description" v-if="gameDetail.description != ''">
                            {{ gameDetail.description }}
                        </div>
                        <div class="meta-info">
                            <div class="item">
                                <div>Created</div>
                                <div>{{ createdFormatted }}</div>
                            </div>
                            <div class="item" v-if="gameDetail.updatedAt != gameDetail.createdAt">
                                <div>Updated</div>
                                <div>{{ updatedFormatted }}</div>
                            </div>
                        </div>
                        <div class="channels" v-if="gameDetail.channels.length > 0">
                            <router-link :to="{ name: 'ChannelDetail', params: { id: channel.id } }" class="item" v-for="channel in gameDetail.channels" v-bind:key="channel.id">{{ channel.title }}</router-link>
                        </div>

                        <div class="actions" v-if="gameDetail.user.id == $store.state.userData.id || $store.state.userRoles.includes('moderator', 'admin')">
                            <LinkButton :to="{ name: 'GameEdit', params: { id: gameDetail.id } }" filled>Edit</LinkButton>
                            <LinkButton :to="{ name: 'GameDelete', params: { id: gameDetail.id } }">Delete</LinkButton>
                        </div>
                    </div>
                    <div class="game-screenshots">
                        <div class="screenshot"
                            :class="activeScreenshot == 0 ? 'active' : ''"
                            :style="`background-image: url('${gameDetail.coverFileName}');`"></div>
                        <div class="screenshot"
                            v-for="(screenshot, index) in gameDetail.screenshots"
                            v-bind:key="screenshot.id"
                            :class="activeScreenshot == index + 1 ? 'active' : ''"
                            :style="`background-image: url('${screenshot.fileName}');`"></div>

                        <div class="position-shade">
                            <div class="dot"
                                :class="activeScreenshot == 0 ? 'active' : ''"
                                v-on:click="changeActiveScreenshot(0)"></div>
                            <div class="dot"
                                v-for="(screenshot, index) in gameDetail.screenshots"
                                v-bind:key="screenshot.id"
                                :class="activeScreenshot == index + 1 ? 'active' : ''"
                                v-on:click="changeActiveScreenshot(index + 1)"></div>
                        </div>

                        <div class="navigate-previous" v-on:click="previousScreenshot()"><span class="mdi mdi-arrow-left"></span></div>
                        <div class="navigate-next" v-on:click="nextScreenshot()"><span class="mdi mdi-arrow-right"></span></div>
                    </div>
                </div>
            </div>

            <div class="trailer-overlay" v-if="trailerOverlayOpen">
                <div class="video-embed">
                    <div class="video-16by9">
                        <iframe width="100%" height="100%" :src="`https://www.youtube-nocookie.com/embed/${gameDetail.youtubeID}`" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                </div>

                <div v-on:click="closeTrailer()" class="close-button">Close</div>
            </div>
        </div>
    </div>
</template>

<script>
    import MGGApi from '../../modules/api';

    import LoadingCircle from '@/components/General/LoadingCircle';
    import LinkButton from '@/components/General/LinkButton';

    export default {
        name: 'GameDetail',
        data: function() {
            return {
                apiRef: null,
                apiLoading: true,
                trailerOverlayOpen: false,
                gameDetail: null,
                createdFormatted: "",
                updatedFormatted: "",
                activeScreenshot: 0,
                isInPlaylist: false,
                playlistActionLoading: false,
            }
        },
        components: {
            LoadingCircle,
            LinkButton
        },
        created: function() {
            this.$data.apiRef = new MGGApi(true);
        },
        mounted: function() {
            this.loadGame();
        },
        methods: {
            loadGame: async function() {
                this.$data.apiLoading = true;

                try {
                    let gameResponse = await this.$data.apiRef.getGameDetail(this.$router.currentRoute.params.id, this.$store.state.userToken);
                    this.$data.gameDetail = gameResponse.game;
                    this.$data.isInPlaylist = gameResponse.isInPlaylist;
                    this.$data.apiLoading = false;

                    document.title = `${this.$data.gameDetail.title} by ${this.$data.gameDetail.user.username} ~ MyGarage.games`;

                    this.$data.createdFormatted = new Date(Date.parse(this.$data.gameDetail.createdAt)).toLocaleDateString("en-US");
                    this.$data.updatedFormatted = new Date(Date.parse(this.$data.gameDetail.updatedAt)).toLocaleDateString("en-US");
                } catch(error) {
                    switch(error.name) {
                        default:
                            console.error(error);
                            this.$root.$emit('addSnackbar', {
                                type: "error",
                                icon: "gamepad-square",
                                text: "Game couldn't be loaded due to a server error. Please try again later",
                                stay: true,
                            });
                            break;
                        case "GameNotFoundException":
                            this.$root.$emit('addSnackbar', {
                                type: "error",
                                icon: "gamepad-square",
                                text: "We couldn't find a game that matches this criteria.",
                                stay: true,
                            });
                            break;
                        case "GamePrivateException":
                            this.$root.$emit('addSnackbar', {
                                type: "error",
                                icon: "gamepad-square",
                                text: "You are not allowed to see this game.",
                                stay: true,
                            });
                            break;
                    }

                    this.$data.apiLoading = false;
                }
            },
            openTrailer: function() {
                this.$data.trailerOverlayOpen = true;
            },
            closeTrailer: function() {
                this.$data.trailerOverlayOpen = false;
            },
            addToPlaylist: async function(event) {
                event.preventDefault();

                this.$data.playlistActionLoading = true;

                try {
                    await this.$data.apiRef.addToPlaylist(this.$store.state.userData.playlists[0].id, this.$data.gameDetail.id, this.$store.state.userToken);

                    this.$data.playlistActionLoading = false;
                    this.$data.isInPlaylist = true;

                    this.$root.$emit('addSnackbar', {
                        type: "success",
                        icon: "heart",
                        text: `${this.$data.gameDetail.title} was added to your playlist.`,
                        stay: false,
                    });
                } catch(error) {
                    switch(error.name) {
                        default:
                            console.error(error);
                            this.$root.$emit('addSnackbar', {
                                type: "error",
                                icon: "heart",
                                text: "Game couldn't be added to your playlist due to a server error. Please try again later",
                                stay: true,
                            });
                            break;
                        case "PlaylistGameConflictException":
                            this.$root.$emit('addSnackbar', {
                                type: "success",
                                icon: "heart",
                                text: `${this.$data.gameDetail.title} was added to your playlist.`,
                                stay: false,
                            });
                            this.$data.isInPlaylist = true;
                            break;
                    }

                    this.$data.playlistActionLoading = false;
                }
            },
            deleteFromPlaylist: async function(event) {
                event.preventDefault();

                this.$data.playlistActionLoading = true;

                try {
                    await this.$data.apiRef.deleteFromPlaylist(this.$store.state.userData.playlists[0].id, this.$data.gameDetail.id, this.$store.state.userToken);

                    this.$data.playlistActionLoading = false;
                    this.$data.isInPlaylist = false;

                    this.$root.$emit('addSnackbar', {
                        type: "success",
                        icon: "heart-off",
                        text: `${this.$data.gameDetail.title} was deleted from your playlist.`,
                        stay: false,
                    });
                } catch(error) {
                    console.error(error);
                    this.$root.$emit('addSnackbar', {
                        type: "error",
                        icon: "heart-off",
                        text: "Game couldn't be deleted from your playlist due to a server error. Please try again later",
                        stay: false,
                    });

                    this.$data.playlistActionLoading = false;
                }
            },
            changeActiveScreenshot: function(screenshotIndex) {
                this.$data.activeScreenshot = screenshotIndex;
            },
            previousScreenshot: function() {
                if(this.$data.activeScreenshot > 0) {
                    this.$data.activeScreenshot--;
                } else {
                    this.$data.activeScreenshot = this.$data.gameDetail.screenshots.length;
                }
            },
            nextScreenshot: function() {
                if(this.$data.activeScreenshot < this.$data.gameDetail.screenshots.length) {
                    this.$data.activeScreenshot++;
                } else {
                    this.$data.activeScreenshot = 0;
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .game-loading {
        padding: 150px 0px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    & .game-header {
        width: 100%;
        height: 300px;
        background-position: center;
        background-size: cover;
        position: relative;
    }
    & .header-shade {
        background: linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.6));
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        backdrop-filter: blur(5px);
        transition: 0.2s ease-in-out all;

        & .mdi {
            font-size: 64px;
            color: #fff;
            transition: 0.2s ease-in-out opacity;
        }
        &:hover {
            backdrop-filter: blur(0px);

            & .mdi {
                opacity: 0.6;
            }
        }
    }
    & .page-thirdssplit {
        display: grid;
        grid-template-columns: minmax(350px, 1fr) 2fr;
        grid-gap: 25px;
        padding: 50px 0px;
    }
    & .trailer-overlay {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: rgba(0,0,0,0.6);
        z-index: 100;

        & .video-embed {
            max-width: 960px;
            width: 80%;

            & .video-16by9 {
                width: 100%;
                padding-top: 56.25%;
                position:  relative;

                & iframe {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                }
            }
        }
        & .close-button {
            color: #fff;
            border: 2px solid #fff;
            border-radius: 5px;
            font-weight: bold;
            padding: 7px 25px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-size: 12px;
            transition: 0.2s ease-in-out background, 0.2s ease-in-out color;
            font-family: 'Poppins', sans-serif;
            margin-top: 25px;

            &:hover {
                color: #000;
                background: #fff;
                cursor: pointer;
            }
            &:focus {
                outline: none;
            }
        }
    }
    & .game-meta {
        & h1 {
            font-weight: bold;
            font-size: 32px;
            margin: 0;
        }
        & .gameID {
            display: grid;
            grid-template-columns: 1fr auto;
            grid-gap: 15px;
            margin-bottom: 15px;

            & .ingameID {
                background: #25baff44;
                color: #1EA0DE;
                font-size: 18px;
                display: flex;
                align-items: center;
                font-weight: bold;
                padding: 8px 20px;
                border-radius: 100px;
            }
            & .addToPlaylist {
                background: #25B9FF;
                border: 2px solid #1a8fc5;
                color: #fff;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 20px;
                transition: 0.2s ease-in-out background;

                &:hover {
                    background: #1a8fc5;
                    cursor: pointer;
                }
                &.loading {
                    font-size: 32px;
                    animation: loadingAnim 0.6s ease-in-out infinite;
                }
            }
        }
        & .user {
            display: grid;
            grid-template-columns: auto 1fr;
            grid-gap: 10px;
            align-content: center;
            transition: 0.2s ease-in-out opacity;
            text-decoration: none;
            margin-bottom: 25px;

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

            &:hover {
                opacity: 0.4;
            }
        }
        & .description {
            line-height: 1.5em;
            margin-bottom: 25px;
        }
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
        & .channels {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 20px;

            & .item {
                padding: 4px 12px;
                background: #25baff44;
                color: #1EA0DE;
                border-radius: 100px;
                margin-right: 5px;
                margin-bottom: 5px;
                transition: 0.2s ease-in-out all;
                text-decoration: none;

                &:hover {
                    background: #1EA0DE;
                    color: #fff;
                    cursor: pointer;
                }
            }
        }
        & .actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 15px;

            & .button {
                text-align: center;
            }
        }
    }
    & .game-screenshots {
        position: relative;
        border-radius: 10px;
        overflow: hidden;
        align-self: flex-start;

        & .screenshot {
            display: none;
            padding-top: 56.25%;
            background-position: center;
            background-size: cover;

            &.active {
                display: block;
            }
        }

        & .position-shade {
            position: absolute;
            background: linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.6));
            bottom: 0px;
            padding: 20px;
            left: 0px;
            right: 0px;
            z-index: 10;
            display: flex;
            justify-content: center;
            align-items: center;

            & .dot {
                border: 2px solid #fff;
                border-radius: 100%;
                width: 14px;
                height: 14px;
                margin: 0px 5px;
                
                &.active {
                    background: #fff;
                }
                &:not(.active):hover {
                    background: rgba(255,255,255,0.4);
                    cursor: pointer;
                }
            }
        }

        & .navigate-previous, & .navigate-next {
            background: linear-gradient(90deg, rgba(0,0,0,0.6), rgba(0,0,0,0));
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            padding: 25px;
            right: 50%;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            color: #fff;
            font-size: 32px;
            opacity: 0;
            transition: 0.2s ease-in-out opacity;

            &:hover {
                opacity: 1;
                cursor: pointer;
            }
        }

        & .navigate-next {
            background: linear-gradient(-90deg, rgba(0,0,0,0.6), rgba(0,0,0,0));
            left: 50%;
            right: 0;
            justify-content: flex-end;
        }
    }

    @keyframes loadingAnim {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>