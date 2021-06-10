<template>
    <div class="page-gameedit">
        <div class="page-centered page-header">
            <div class="page-wrapper">
                <h1>Edit a game</h1>
                <p>Adjust information, add screenshots or trailers and publish / unpublish your game.</p>
            </div>
        </div>

        <div class="page-centered page-deleteLoading" v-if="apiLoading || gameDetail == null">
            <div class="page-wrapper">
                <LoadingCircle />
            </div>
        </div>
        <div class="page-centered" v-if="!apiLoading && gameDetail != null">
            <div class="page-wrapper">
                <div class="tabs">
                    <div class="tab" :class="currentTab == 0 ? 'active' : ''" v-on:click="changeTab(0)">General</div>
                    <div class="tab" :class="currentTab == 1 ? 'active' : ''" v-on:click="changeTab(1)">Discoverability</div>
                    <div class="tab" :class="currentTab == 2 ? 'active' : ''" v-on:click="changeTab(2)">Additional Media</div>
                    <div class="tab" :class="currentTab == 3 ? 'active' : ''" v-on:click="changeTab(3)">Screenshots</div>
                </div>
            </div>
        </div>

        <div class="page-centered page-editForm" v-if="!apiLoading">
            <div class="page-wrapper">
                <div class="step" v-if="currentTab == 0">
                    <div class="step-input">
                        <label>Title of your entry*</label>
                        <input type="text" class="input" v-model="tab0Title" placeholder="My super awesome game" />
                    </div>
                    <div class="step-input">
                        <label>Please describe your entry. What type of experience is it? How do you play?</label>
                        <textarea rows="4" class="input" v-model="tab0Description"></textarea>
                    </div>
                    <div class="step-input">
                        <label>Enter the ID that you see on Game Builder Garage after uploading*</label>
                        <input type="text" class="input" v-model="tab0IngameID" placeholder="G-000-000-000" />
                    </div>
                </div>

                <div class="step" v-if="currentTab == 1">
                    <div class="step-input">
                        <label>Who should be able to see your entry?</label>
                        <select class="input" v-model="tab1DisplayStatus">
                            <option value="0">Everyone</option>
                            <option value="1">Hidden - Only people with the link can access it</option>
                            <option value="2">Private - Only you can access it</option>
                        </select>
                    </div>
                    <div class="step-input">
                        <label>Select channels for your entry (Hold CTRL to select multiple channels)</label>
                        <select class="input-select" multiple v-model="tab1Channels">
                            <option v-for="channel in tab1AllChannels" v-bind:key="channel.id" :value="channel.id">{{ channel.title }}</option>
                        </select>
                    </div>
                </div>

                <div class="step" v-if="currentTab == 2">
                    <div class="step-input">
                        <label>Cover Image</label>
                        <div class="cover-holder">
                            <div class="change-cover" v-on:click="$refs.coverFile.click()" :style="`background-image: url('${gameDetail.coverFileName}')`">
                                <div class="icon">
                                    <span class="mdi mdi-image-edit"></span>
                                    <div class="hint">.png / .jpg</div>
                                </div>
                                <input type="file" ref="coverFile" v-on:change="processCoverFile" accept="png,jpg" />
                            </div>

                            <div class="button" v-on:click="deleteCover()">Delete Cover</div>
                        </div>
                    </div>
                    <div class="step-input">
                        <label>Do you have a YouTube trailer? Add the URL in here!</label>
                        <input type="text" class="input" placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" v-model="tab2VideoURL" />
                    </div>
                </div>

                <div class="screenshots" v-if="currentTab == 3">
                    <div class="screenshot"
                        v-for="screenshot in gameDetail.screenshots"
                        v-bind:key="screenshot.id"
                        :style="`background-image: url('${screenshot.fileName}')`"
                        v-on:click="deleteScreenshot(screenshot.id)">
                        <div class="icon">
                            <span class="mdi mdi-image-remove"></span>
                        </div>
                    </div>
                    <div class="add-screenshot" v-on:click="$refs.screenshotFiles.click()">
                        <div class="icon">
                            <span class="mdi mdi-image-plus"></span>
                            <div class="hint">.png / .jpg</div>
                        </div>
                        <input type="file" ref="screenshotFiles" v-on:change="processScreenshotFiles" multiple accept="png,jpg" />
                    </div>
                </div>

                <div class="step-actions" v-if="currentTab != 3">
                    <div class="footnote">* = required</div>
                    <LinkButton :to="{ name: 'GameDetail', params: { id: gameDetail.id }}">Back to Game Page</LinkButton>
                    <button class="button button-filled" v-on:click="saveGame()">Save</button>
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
        name: 'GameEdit',
        data: function() {
            return {
                apiRef: null,
                apiLoading: true,
                apiError: false,
                gameDetail: null,
                currentTab: 0,
                tab0Title: "",
                tab0Description: "",
                tab0IngameID: "",
                tab1DisplayStatus: 0,
                tab1Channels: [],
                tab1AllChannels: [],
                tab2CoverFile: "",
                tab2VideoURL: "",
                tab3ScreenshotFiles: [],
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
            this.fetchChannels();
        },
        methods: {
            loadGame: async function() {
                this.$data.apiLoading = true;

                try {
                    let gameResponse = await this.$data.apiRef.getGameDetail(this.$router.currentRoute.params.id, this.$store.state.userToken);
                    this.$data.gameDetail = gameResponse.game;

                    if(this.$data.gameDetail.user.id != this.$store.state.userData.id && !['moderator', 'admin'].some(str => this.$store.state.userRoles.includes(str))) {
                        console.log("User is not allowed to edit this entry");

                        this.$root.$emit('addSnackbar', {
                            type: "error",
                            icon: "lock-off-outline",
                            text: "You are not allowed to edit this game.",
                            stay: true,
                        });
                        return;
                    }

                    this.$data.tab0Title = this.$data.gameDetail.title;
                    this.$data.tab0Description = this.$data.gameDetail.description;
                    this.$data.tab0IngameID = this.$data.gameDetail.ingameID;

                    this.$data.tab1DisplayStatus = this.$data.gameDetail.displayStatus;
                    this.$data.tab1Channels = [];
                    this.$data.gameDetail.channels.forEach(channel => {
                        this.$data.tab1Channels.push(channel.id);
                    });

                    this.$data.tab2VideoURL = this.$data.gameDetail.youtubeID != '' ? `https://youtube.com/watch?v=${this.$data.gameDetail.youtubeID}` : '';

                    this.$data.apiLoading = false;
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
            processCoverFile: function(event) {
                this.$data.tab2CoverFile = event.target.files[0];

                this.updateCover();
            },
            processScreenshotFiles: function(event) {
                this.$data.tab3ScreenshotFiles = event.target.files;

                this.uploadScreenshots();
            },
            fetchChannels: async function() {
                try {
                    this.$data.tab1AllChannels = await this.$data.apiRef.getAllChannels();
                } catch(error) {
                    console.error(error);
                }
            },
            changeTab: function(tabIndex) {
                this.$data.currentTab = tabIndex;
            },
            deleteScreenshot: async function(screenshotID) {
                this.$data.apiLoading = true;

                try {
                    await this.$data.apiRef.deleteGameScreenshot(screenshotID, this.$store.state.userToken);
                    this.loadGame();

                    this.$root.$emit('addSnackbar', {
                        type: "success",
                        icon: "trash-can-outline",
                        text: "Screenshot was deleted.",
                        stay: false,
                    });
                } catch(error) {
                    console.error(error);
                    this.$data.apiLoading = false;

                    this.$root.$emit('addSnackbar', {
                        type: "error",
                        icon: "trash-can-outline",
                        text: "Could not delete screenshot. Please try again later.",
                        stay: false,
                    });
                }
            },
            updateCover: async function() {
                if(this.$data.tab2CoverFile == undefined) return;

                this.$data.apiLoading = true;

                try {
                    await this.$data.apiRef.updateGameCover(this.$data.gameDetail.id, this.$data.tab2CoverFile, this.$store.state.userToken);

                    this.$data.apiLoading = false;
                    this.loadGame();

                    this.$root.$emit('addSnackbar', {
                        type: "success",
                        icon: "content-save-outline",
                        text: "Cover was updated.",
                        stay: false,
                    });
                } catch(error) {
                    console.error(error);
                    this.$data.apiLoading = false;

                    if(error.name == "FileWrongFormatException") {
                        this.$root.$emit('addSnackbar', {
                            type: "error",
                            icon: "content-save-outline",
                            text: "Cover could not be updated because they have the wrong format. Only .png and .jpg files are allowed!",
                            stay: true,
                        });
                    } else {
                        this.$root.$emit('addSnackbar', {
                            type: "error",
                            icon: "content-save-outline",
                            text: "Could not update cover. Please try again later.",
                            stay: false,
                        });
                    }
                }
            },
            deleteCover: async function() {
                this.$data.apiLoading = true;

                try {
                    await this.$data.apiRef.deleteGameCover(this.$data.gameDetail.id, this.$store.state.userToken);

                    this.$data.apiLoading = false;
                    this.loadGame();

                    this.$root.$emit('addSnackbar', {
                        type: "success",
                        icon: "content-save-outline",
                        text: "Cover was deleted.",
                        stay: false,
                    });
                } catch(error) {
                    console.error(error);
                    this.$data.apiLoading = false;

                    this.$root.$emit('addSnackbar', {
                        type: "error",
                        icon: "trash-can-outline",
                        text: "Could not delete cover. Please try again later.",
                        stay: false,
                    });
                }
            },
            uploadScreenshots: async function() {
                if(this.$data.tab3ScreenshotFiles == undefined) return;

                this.$data.apiLoading = true;

                try {
                    await this.$data.apiRef.uploadGameScreenshots(this.$data.gameDetail.id, this.$data.tab3ScreenshotFiles, this.$store.state.userToken);

                    this.$data.apiLoading = false;
                    this.loadGame();

                    this.$root.$emit('addSnackbar', {
                        type: "success",
                        icon: "content-save-outline",
                        text: "Screenshots were uploaded successfully.",
                        stay: false,
                    });
                } catch(error) {
                    console.error(error);
                    this.$data.apiLoading = false;

                    if(error.name == "FileWrongFormatException") {
                        this.$root.$emit('addSnackbar', {
                            type: "error",
                            icon: "content-save-outline",
                            text: "One or more screenshots could not be uploaded because they have the wrong format. Only .png and .jpg files are allowed!",
                            stay: true,
                        });
                    } else {
                        this.$root.$emit('addSnackbar', {
                            type: "error",
                            icon: "content-save-outline",
                            text: "Your screenshots couldn't be uploaded due to a server error. Please try it again later!",
                            stay: true,
                        });
                    }
                }
            },
            saveGame: async function() {
                this.$data.apiLoading = true;

                try {
                    let gamePayload = {
                        title: this.$data.tab0Title,
                        description: this.$data.tab0Description,
                        ingameID: this.$data.tab0IngameID,
                        displayStatus: this.$data.tab1DisplayStatus,
                        channels: this.$data.tab1Channels,
                        youtubeID: this.$data.tab2VideoURL,
                    }

                    if(gamePayload.title == "" || gamePayload.ingameID == "") {
                        this.$data.apiLoading = false;
                        this.loadGame();

                        this.$root.$emit('addSnackbar', {
                            type: "error",
                            icon: "content-save-outline",
                            text: "Required fields cannot be empty!",
                            stay: false,
                        });
                        return;
                    }

                    await this.$data.apiRef.updateGame(this.$data.gameDetail.id, gamePayload, this.$store.state.userToken);

                    this.$data.apiLoading = false;
                    this.loadGame();

                    this.$root.$emit('addSnackbar', {
                        type: "success",
                        icon: "content-save-outline",
                        text: "Saved changes.",
                        stay: false,
                    });
                } catch(error) {
                    console.error(error);
                    this.$data.apiLoading = false;

                    if(error.name == "IngameIDWrongFormatException") {
                        this.$root.$emit('addSnackbar', {
                            type: "error",
                            icon: "content-save-outline",
                            text: "Your game ID is invalid (format: G-000-000-000).",
                            stay: true,
                        });
                    } else {
                        this.$root.$emit('addSnackbar', {
                            type: "error",
                            icon: "content-save-outline",
                            text: "Your screenshots couldn't be uploaded due to a server error. Please try it again later!",
                            stay: true,
                        });
                    }
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .tabs {
        padding: 25px 0px;
        display: flex;
        flex-wrap: wrap;

        & .tab {
            color: #1EA0DE;
            padding: 7px 20px;
            border-radius: 100px;
            margin-right: 10px;
            transition: 0.2s ease-in-out color, 0.2s ease-in-out background;

            &:not(.active):hover {
                background: #25baff44;
                cursor: pointer;
            }
            &.active {
                background: #1EA0DE;
                color: #fff;
                cursor: default;
            }
        }
    }

    .page-deleteLoading {
        margin: 100px 0px;

        & .page-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    .page-editForm {
        margin-bottom: 50px;

        & .screenshots {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            grid-gap: 25px;

            & .screenshot, & .add-screenshot {
                width: 100%;
                padding-top: 56.25%;
                background-position: center;
                background-size: cover;
                border-radius: 5px;
                position: relative;
                overflow: hidden;

                & .icon {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;

                    & .mdi {
                        font-size: 32px;
                        margin-bottom: 5px;
                    }
                }
            }

            & .screenshot {
                & .icon {
                    background: rgba(0,0,0,0.6);
                    color: #fff;
                    opacity: 0;
                    transition: 0.2s ease-in-out opacity;

                    &:hover {
                        opacity: 1;
                        cursor: pointer;
                    }
                }
            }
            & .add-screenshot {
                background: #25baff44;
                color: #1EA0DE;
                transition: 0.2s ease-in-out color, 0.2s ease-in-out background;

                &:hover {
                    background: #1EA0DE;
                    color: #fff;
                    cursor: pointer;
                }

                & input {
                    display: none;
                }
            }
        }

        & .step {
            display: grid;
            grid-gap: 25px;

            & .step-title {
                font-size: 24px;
                font-weight: bold;
            }
            & .step-text {
                line-height: 1.5em;
            }
            & .step-input {
                display: grid;
                grid-gap: 5px;
            }
            & .cover-holder {
                max-width: 250px;
                width: 100%;
                display: grid;
                grid-gap: 10px;

                & .change-cover {
                    width: 100%;
                    padding-top: 56.25%;
                    background-position: center;
                    background-size: cover;
                    border-radius: 5px;
                    position: relative;
                    overflow: hidden;

                    & .icon {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                        background: rgba(0,0,0,0.6);
                        color: #fff;
                        opacity: 0;
                        transition: 0.2s ease-in-out opacity;

                        & .mdi {
                            font-size: 32px;
                            margin-bottom: 5px;
                        }

                        &:hover {
                            opacity: 1;
                            cursor: pointer;
                        }
                    }

                    & input {
                        display: none;
                    }
                }
                & .button {
                    text-align: center;
                }
            }
            & .step-loading {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 50px 0px;
            }
        }

        & .step-actions {
            display: grid;
            grid-template-columns: 1fr auto auto;
            grid-gap: 15px;
            margin-top: 25px;
            align-items: center;
            
            & .footnote {
                font-size: 14px;
                opacity: 0.6;
            }
        }
    }

    @media screen and (max-width: 1300px) {
        .page-editForm {
            & .screenshots {
                grid-template-columns: 1fr 1fr 1fr;
            }
        }
    }

    @media screen and (max-width: 800px) {
        .tabs {
            display: grid;
            grid-template-rows: 1fr;
        }
        .page-editForm {
            & .screenshots {
                grid-template-columns: 1fr 1fr;
            }
        }
    }
</style>