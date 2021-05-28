<template>
    <div class="page-gameadd">
        <div class="page-centered page-header">
            <div class="page-wrapper">
                <h1>Add a new game</h1>
                <p>Have you created a game in Game Builder Garage?<br />Add it to MyGarage.games to get share it with the world!</p>
            </div>
        </div>

        <div class="page-centered page-addGameForm">
            <div class="page-wrapper">
                <div class="step" v-if="currentStep == 0">
                    <div class="step-title">Submission rules</div>
                    <div class="step-text">
                        Your submission <strong>may not</strong>
                        <ul>
                            <li>be hateful, inappropriate, sexist or queerphobic. This includes content against other ethnicities, sexualities or minorities.</li>
                            <li>violate the copyright or IP of other entities.</li>
                            <li>contain adult content like nudity, hard violence or otherwise graphically disturbing content. This includes the games content, media assets and description.</li>
                        </ul>
                    </div>
                    <div class="step-text">
                        Do not create multiple submissions for the same game. Do not submit content with highly low effort.
                    </div>
                    <div class="step-text">
                        Please provide content descriptions if your submission has fast strobing graphic effects to protect those with sensitivities.
                    </div>
                    <div class="step-text">
                        The moderation team will hide screenshots, and remove or hide videos or submissions if needed. If you continuously break our submission rules, we might prevent you from submitting further content or deactivate your account.
                    </div>
                    <div class="step-text">
                        These rules are not indicative of a full list. Moderators will always act at their own discretion. We reserve the right to adjust this ruleset and make exceptions to any rule if needed.
                    </div>
                </div>
                <div class="step" v-if="currentStep == 1">
                    <div class="step-title">General Information</div>
                    <div class="step-input">
                        <label>Title of your entry*</label>
                        <input type="text" class="input" v-model="step0Title" placeholder="My super awesome game" />
                    </div>
                    <div class="step-input">
                        <label>Please describe your entry. What type of experience is it? How do you play?</label>
                        <textarea rows="4" class="input" v-model="step0Description"></textarea>
                    </div>
                    <div class="step-input">
                        <label>Enter the ID that you see on Game Builder Garage after uploading*</label>
                        <input type="text" class="input" v-model="step0IngameID" placeholder="G-000-000-000" />
                    </div>
                </div>
                <div class="step" v-if="currentStep == 2">
                    <div class="step-title">Discoverability</div>
                    <div class="step-input">
                        <label>Who should be able to see your entry?</label>
                        <select class="input" v-model="step1DisplayStatus">
                            <option value="0">Everyone</option>
                            <option value="1">Hidden - Only people with the link can access it</option>
                            <option value="2">Private - Only you can access it</option>
                        </select>
                    </div>
                    <div class="step-input">
                        <label>Select channels for your entry (Hold CTRL to select multiple channels)</label>
                        <select class="input-select" multiple v-model="step1Channels">
                            <option v-for="channel in step1AllChannels" v-bind:key="channel.id" :value="channel.id">{{ channel.title }}</option>
                        </select>
                    </div>
                </div>
                <div class="step" v-if="currentStep == 3">
                    <div class="step-title">Additional Media</div>
                    <div class="step-input">
                        <label>Cover Image (16 by 9, .jpg or .png)</label>
                        <input type="file" v-on:change="processCoverFile" />
                    </div>
                    <div class="step-input">
                        <label>Do you have a YouTube trailer? Add the URL in here!</label>
                        <input type="text" class="input" placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" v-model="step2VideoURL" />
                    </div>
                </div>
                <div class="step" v-if="currentStep == 4">
                    <div class="step-title" v-if="!apiLoading && !apiError">That's it!</div>
                    <div class="step-text" v-if="!apiLoading && !apiError">
                        Well done, your game was successfully published. You can now add screenshots, adjust the theme and share your game by visiting the games page.
                    </div>
                    <div class="step-text" v-if="!apiLoading && apiErrorCoverWrongFormat">
                        <strong>The cover file couldn't be upload, because it was not a valid file. Please keep in mind that only PNG and JPEG files are valid cover filetypes.</strong>
                    </div>
                    <div class="step-loading" v-if="apiLoading">
                        <LoadingCircle />
                    </div>
                </div>
                <div class="step" v-if="apiError">
                    <div class="step-title">Whoops!</div>
                    <div class="step-text">
                        There was an issue publishing your game. Please try again later.
                    </div>
                </div>
                <div class="step-actions">
                    <div class="footnote" v-if="currentStep != 0 && currentStep != 4">* = required</div>
                    <button class="button" v-on:click="stepBack()" v-if="currentStep != 0 && currentStep != 4">Back</button>
                    <button class="button button-filled" v-on:click="stepContinue()" v-if="currentStep != 4">{{ currentStep == 0 ? 'I agree' : 'Continue' }}</button>

                    <div v-if="currentStep == 4 && !apiLoading && !apiError"></div>
                    <div v-if="currentStep == 4 && !apiLoading && !apiError"></div>
                    <LinkButton :to="{ name: 'GameDetail', params: { id: createdGame.id }}" filled v-if="currentStep == 4 && !apiLoading && !apiError">Go to Game Page</LinkButton>
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
        name: 'GameAdd',
        data: function() {
            return {
                apiRef: null,
                apiLoading: true,
                apiError: false,
                apiErrorCoverWrongFormat: false,
                currentStep: 0,
                step0Title: "",
                step0Description: "",
                step0IngameID: "",
                step1DisplayStatus: 0,
                step1AllChannels: [],
                step1Channels: [],
                step2CoverFile: "",
                step2VideoURL: "",
                createdGame: {id: 0},
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
            this.fetchChannels();
        },
        methods: {
            stepBack: function() {
                if(this.$data.currentStep == 0) return;

                this.$data.currentStep--;
            },
            stepContinue: async function() {
                if(this.validateInput(this.$data.currentStep)) {
                    this.$data.currentStep++;
                }

                if(this.$data.currentStep == 4) {
                    this.$data.apiLoading = true;
                    await this.createGame();
                }
            },
            validateInput: function() {
                switch(this.$data.currentStep) {
                    case 0:
                        return true;
                    case 1:
                        if(this.$data.step0Title == "" || this.$data.step0IngameID == "") {
                            this.$root.$emit('addSnackbar', {
                                type: "error",
                                icon: "plus",
                                text: "You have to fill out all required fields to continue.",
                                stay: false,
                            });
                            return false;
                        }

                        if(!MGGApi.isGameIDValid(this.$data.step0IngameID)) {
                            this.$root.$emit('addSnackbar', {
                                type: "error",
                                icon: "plus",
                                text: "Your game ID is invalid (format: G-000-000-000).",
                                stay: false,
                            });
                            return false;
                        }

                        return true;
                    case 2:
                        return true;
                    case 3:
                        return true;
                }
            },
            processCoverFile: function(event) {
                this.$data.step2CoverFile = event.target.files[0];
            },
            fetchChannels: async function() {
                try {
                    this.$data.step1AllChannels = await this.$data.apiRef.getAllChannels();
                } catch(error) {
                    console.error(error);
                }
            },
            createGame: async function() {
                    let gamePayload = {
                        title: this.$data.step0Title,
                        description: this.$data.step0Description,
                        ingameID: this.$data.step0IngameID,
                        displayStatus: this.$data.step1DisplayStatus,
                        channels: this.$data.step1Channels,
                        youtubeID: this.$data.step2VideoURL,
                    }

                    try {
                        let createdGame = await this.$data.apiRef.postGame(gamePayload, this.$store.state.userToken);
                        
                        if(this.$data.step2CoverFile != undefined) {
                            try {
                                await this.$data.apiRef.updateGameCover(createdGame.id, this.$data.step2CoverFile, this.$store.state.userToken);
                            } catch(error) {
                                if(error.name == "FileWrongFormatException") {
                                    this.$data.apiErrorCoverWrongFormat = true;
                                }
                            }
                        }

                        this.$data.apiLoading = false;
                        this.$data.createdGame = createdGame;
                    } catch(error) {
                        console.error(error);

                        this.$data.apiLoading = false;
                        this.$data.apiError = true;
                    }
            }
        }
    }
</script>

<style lang="less" scoped>
    .page-addGameForm {
        margin: 50px 0px;

        & .page-wrapper {
            max-width: 600px;
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
</style>