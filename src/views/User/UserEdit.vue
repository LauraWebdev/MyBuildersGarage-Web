<template>
    <div class="page-useredit">
        <div class="page-centered page-header">
            <div class="page-wrapper">
                <h1 v-if="apiLoading">Updating your profile</h1>
                <h1 v-if="!apiLoading && userDetail != null">{{ userDetail.username }}</h1>
                <p>Uploading an avatar, changing your bio or password.</p>
            </div>
        </div>

        <div class="page-centered page-deleteLoading" v-if="apiLoading">
            <div class="page-wrapper">
                <LoadingCircle />
            </div>
        </div>
        <div class="page-centered" v-if="!apiLoading">
            <div class="page-wrapper">
                <div class="tabs">
                    <div class="tab" :class="currentTab == 0 ? 'active' : ''" v-on:click="changeTab(0)">General</div>
                    <div class="tab" :class="currentTab == 1 ? 'active' : ''" v-on:click="changeTab(1)">Avatar</div>
                    <div class="tab" :class="currentTab == 2 ? 'active' : ''" v-on:click="changeTab(2)">Security</div>
                </div>
            </div>
        </div>

        <div class="page-centered page-editForm" v-if="!apiLoading">
            <div class="page-wrapper">
                <div class="step" v-if="currentTab == 0">
                    <div class="step-input">
                        <label>Username*</label>
                        <input type="text" class="input" v-model="tab0Username" />
                    </div>
                    <div class="step-input">
                        <label>Pronouns</label>
                        <select class="input" v-model="tab0Pronouns">
                            <option value=""></option>
                            <option value="she/her">she/her</option>
                            <option value="he/him">he/him</option>
                            <option value="they/them">they/them</option>
                            <option value="she/they">she/they</option>
                            <option value="he/they">he/they</option>
                            <option value="any">any</option>
                        </select>
                    </div>
                    <div class="step-input">
                        <label>Ingame-ID</label>
                        <input type="text" class="input" placeholder="P-000-000-000" v-model="tab0IngameID" />
                    </div>
                    <div class="step-input">
                        <label>Discord</label>
                        <input type="text" class="input" placeholder="coolbuilder#1234" v-model="tab0Discord" />
                    </div>
                    <div class="step-input">
                        <label>Twitter</label>
                        <input type="text" class="input" placeholder="@coolbuilder" v-model="tab0Twitter" />
                    </div>
                    <div class="step-input">
                        <label>YouTube</label>
                        <input type="text" class="input" placeholder="CoolBuilder" v-model="tab0Youtube" />
                    </div>
                </div>

                <div class="step" v-if="currentTab == 1">
                    <div class="step-input">
                        <label>Avatar Image</label>
                        <div class="avatar-holder">
                            <div class="change-avatar" v-on:click="$refs.avatarFile.click()" :style="`background-image: url('${userDetail.avatarFileName}')`">
                                <div class="icon">
                                    <span class="mdi mdi-image-edit"></span>
                                    <div class="hint">.png / .jpg</div>
                                </div>
                                <input type="file" ref="avatarFile" v-on:change="processAvatarFile" accept="png,jpg" />
                            </div>

                            <div class="button" v-on:click="deleteAvatar()">Delete Avatar</div>
                        </div>
                    </div>
                </div>

                <div class="step" v-if="currentTab == 2">
                    <div class="step-input">
                        <label>Email</label>
                        <input type="email" class="input" placeholder="email@example.org" v-model="tab2Email" />
                    </div>
                    <div class="step-input">
                        <label>Password</label>
                        <input type="password" class="input" placeholder="" v-model="tab2Password" />
                    </div>
                    <div class="step-input">
                        <label>Password (again)</label>
                        <input type="password" class="input" placeholder="" v-model="tab2Password2" />
                    </div>
                </div>

                <div class="step-actions">
                    <div class="footnote">* = required</div>
                    <LinkButton :to="{ name: 'UserDetail', params: { id: userDetail.id }}">Back to profile</LinkButton>
                    <div v-if="currentTab == 1"></div>
                    <button class="button button-filled" v-on:click="saveUser()" v-if="currentTab == 0">Save</button>
                    <button class="button button-filled" v-on:click="saveSecurity()" v-if="currentTab == 2">Save</button>
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
        name: 'UserEdit',
        data: function() {
            return {
                apiRef: null,
                apiLoading: true,
                apiError: false,
                userDetail: null,
                currentTab: 0,
                tab0Username: "",
                tab0Pronouns: "",
                tab0IngameID: "",
                tab0Discord: "",
                tab0Twitter: "",
                tab0Youtube: "",
                tab1AvatarFile: "",
                tab2Email: "",
                tab2Password: "",
                tab2Password2: ""
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
            this.loadUser();
        },
        methods: {
            loadUser: async function() {
                this.$data.apiLoading = true;

                try {
                    this.$data.userDetail = await this.$data.apiRef.getUserDetail(this.$router.currentRoute.params.id);

                    if(this.$data.userDetail.id != this.$store.state.userData.id && !this.$store.state.userRoles.includes('moderator', 'admin')) {
                        console.log("User is not allowed to edit this entry");

                        this.$root.$emit('addSnackbar', {
                            type: "error",
                            icon: "lock-off-outline",
                            text: "You are not allowed to edit this user.",
                            stay: true,
                        });
                        return;
                    }

                    this.$data.tab0Username = this.$data.userDetail.username;
                    this.$data.tab0Pronouns = this.$data.userDetail.pronouns;
                    this.$data.tab0IngameID = this.$data.userDetail.ingameID;

                    this.$data.tab0Discord = this.$data.userDetail.socialDiscord;
                    this.$data.tab0Twitter = this.$data.userDetail.socialTwitter;
                    this.$data.tab0Youtube = this.$data.userDetail.socialYouTube;

                    this.$data.tab2Email = "";
                    this.$data.tab2Password = "";
                    this.$data.tab2Password2 = "";

                    this.$data.apiLoading = false;
                } catch(error) {
                    console.error(error);
                    this.$data.apiLoading = false;
                }
            },
            processAvatarFile: function(event) {
                this.$data.tab1AvatarFile = event.target.files[0];

                this.updateAvatar();
            },
            changeTab: function(tabIndex) {
                this.$data.currentTab = tabIndex;
            },
            updateAvatar: async function() {
                if(this.$data.tab1AvatarFile == undefined) return;

                this.$data.apiLoading = true;

                try {
                    await this.$data.apiRef.updateUserAvatar(this.$store.state.userData.id, this.$data.tab1AvatarFile, this.$store.state.userToken);

                    this.$data.apiLoading = false;
                    this.loadUser();

                    this.$root.$emit('addSnackbar', {
                        type: "success",
                        icon: "content-save-outline",
                        text: "Avatar was updated.",
                        stay: false,
                    });
                } catch(error) {
                    console.error(error);
                    this.$data.apiLoading = false;

                    if(error.name == "FileWrongFormatException") {
                        this.$root.$emit('addSnackbar', {
                            type: "error",
                            icon: "content-save-outline",
                            text: "Avatar could not be updated because they have the wrong format. Only .png and .jpg files are allowed!",
                            stay: true,
                        });
                    } else {
                        this.$root.$emit('addSnackbar', {
                            type: "error",
                            icon: "content-save-outline",
                            text: "Could not update avatar. Please try again later.",
                            stay: false,
                        });
                    }
                }
            },
            deleteAvatar: async function() {
                this.$data.apiLoading = true;

                try {
                    await this.$data.apiRef.deleteUserAvatar(this.$data.userDetail.id, this.$store.state.userToken);

                    this.$data.apiLoading = false;
                    this.loadUser();

                    this.$root.$emit('addSnackbar', {
                        type: "success",
                        icon: "content-save-outline",
                        text: "Avatar was deleted.",
                        stay: false,
                    });
                } catch(error) {
                    console.error(error);
                    this.$data.apiLoading = false;

                    this.$root.$emit('addSnackbar', {
                        type: "error",
                        icon: "trash-can-outline",
                        text: "Could not delete avatar. Please try again later.",
                        stay: false,
                    });
                }
            },
            saveUser: async function() {
                this.$data.apiLoading = true;

                if(!MGGApi.isUsernameValid(this.$data.tab0Username)) {
                    this.$root.$emit('addSnackbar', {
                        type: "error",
                        icon: "key",
                        text: "This username contains forbidden characters. Allowed characters are a-z, A-Z, 0-9, hyphens and underscores.",
                        stay: false,
                    });
                    this.loadUser();
                    return;
                }

                try {
                    let userPayload = {
                        username: this.$data.tab0Username,
                        pronouns: this.$data.tab0Pronouns,
                        ingameID: this.$data.tab0IngameID,
                        socialDiscord: this.$data.tab0Discord,
                        socialTwitter: this.$data.tab0Twitter,
                        socialYouTube: this.$data.tab0Youtube,
                    }

                    await this.$data.apiRef.updateUser(this.$data.userDetail.id, userPayload, this.$store.state.userToken);

                    this.loadUser();

                    this.$root.$emit('addSnackbar', {
                        type: "success",
                        icon: "content-save-outline",
                        text: "Saved changes.",
                        stay: false,
                    });
                } catch(error) {
                    this.$data.apiLoading = false;

                    switch(error.name) {
                        default:
                            console.error(error);
                            this.$root.$emit('addSnackbar', {
                                type: "error",
                                icon: "content-save-outline",
                                text: "Your changes couldn't be saved due to a server error. Please try it again later!",
                                stay: true,
                            });
                            break;
                        case "IngameIDWrongFormatException":
                            this.$root.$emit('addSnackbar', {
                                type: "error",
                                icon: "content-save-outline",
                                text: "Your profile ID is invalid (format: P-000-000-000).",
                                stay: true,
                            });
                            break;
                        case "UsernameEmailConflictException":
                            this.$root.$emit('addSnackbar', {
                                type: "error",
                                icon: "key",
                                text: "This username is already in use!",
                                stay: false,
                            });
                            break;
                    }
                }
            },
            saveSecurity: async function() {
                this.$data.apiLoading = true;
                
                if(this.$data.tab2Password != this.$data.tab2Password2) {
                    this.$root.$emit('addSnackbar', {
                        type: "error",
                        icon: "key",
                        text: "The entered passwords are not identical.",
                        stay: false,
                    });
                    this.loadUser();
                    return;
                }

                try {
                    let securityPayload = {
                        email: this.$data.tab2Email != undefined ? this.$data.tab2Email : undefined,
                        password: this.$data.tab2Password != undefined ? this.$data.tab2Password : undefined,
                    }

                    await this.$data.apiRef.authUpdate(this.$data.userDetail.id, securityPayload, this.$store.state.userToken);

                    this.loadUser();

                    this.$root.$emit('addSnackbar', {
                        type: "success",
                        icon: "content-save-outline",
                        text: "Saved changes.",
                        stay: false,
                    });
                } catch(error) {
                    this.$data.apiLoading = false;

                    switch(error.name) {
                        default:
                            console.error(error.name);
                            this.$root.$emit('addSnackbar', {
                                type: "error",
                                icon: "content-save-outline",
                                text: "Your changes couldn't be saved due to a server error. Please try it again later!",
                                stay: true,
                            });
                            return;
                        case "EmailInvalidException":
                            this.$root.$emit('addSnackbar', {
                                type: "error",
                                icon: "content-save-outline",
                                text: "Your email is invalid!",
                                stay: true,
                            });
                            return;
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
        margin: 0px 50px 0px;

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
            & .avatar-holder {
                max-width: 150px;
                width: 100%;
                display: grid;
                grid-gap: 10px;

                & .change-avatar {
                    width: 100%;
                    padding-top: 100%;
                    background-position: center;
                    background-size: cover;
                    border-radius: 5px;
                    border-radius: 500px;
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
</style>