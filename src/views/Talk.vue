<template>
    <div class="page-talk">
        <div class="page-centered page-header">
            <div class="page-wrapper">
                <h1>Talk</h1>
                <p>The Game Builder Garage community is big! Here are some other community projects and hangouts to find creators and learn more about Game Builder Garage!</p>
            </div>
        </div>

        <div class="page-centered">
            <div class="page-wrapper projects-grid">
                <div class="project">
                    <div class="banner" :style="{ backgroundImage: 'url(' + require('@/assets/img/projects/indiegesindel.png') + ')'}"></div>
                    <div class="title">Indiegesindel</div>
                    <p>Indiegesindel is the developer collective that brought you MyGarage.games. Check out our Discord to learn more about updates of MyGarage.games</p>
                    <div class="actions">
                        <ExternalLinkButton href="https://indiegesindel.games">Website</ExternalLinkButton>
                        <ExternalLinkButton href="https://twitter.com/indiegesindel">Twitter</ExternalLinkButton>
                        <ExternalLinkButton href="https://mygarage.games/discord">Discord</ExternalLinkButton>
                    </div>
                </div>
                <div class="project">
                    <div class="banner" :style="{ backgroundImage: 'url(' + require('@/assets/img/projects/smm2gbgdiscord.png') + ')'}"></div>
                    <div class="title">Super Mario Maker 2 + Game Builder Garage</div>
                    <p>A Discord community centered around discussion and content sharing for Super Mario Maker 2 and Game Builder Garage.</p>
                    <div class="actions">
                        <ExternalLinkButton href="https://discord.gg/xtYxQcd846">Discord</ExternalLinkButton>
                    </div>
                </div>
                <div class="project">
                    <div class="banner" :style="{ backgroundImage: 'url(' + require('@/assets/img/projects/rgamebuildergarage.png') + ')'}"></div>
                    <div class="title">r/gamebuildergarage</div>
                    <p>Learn to make games from the minds at Nintendo! Build your own games from the ground up with the colorful and quirky Nodon.</p>
                    <div class="actions">
                        <ExternalLinkButton href="https://www.reddit.com/r/GameBuilderGarage/">Reddit</ExternalLinkButton>
                        <ExternalLinkButton href="https://discord.gg/fUmgpU5">Discord</ExternalLinkButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ExternalLinkButton from '@/components/General/ExternalLinkButton';

    export default {
        name: 'Talk',
        components: {
            ExternalLinkButton
        },
    }
</script>

<style lang="less" scoped>
    .projects-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 25px;
        padding: 50px 0px;

        & .project {
            background: #fff;
            box-shadow: 0px 4px 16px 2px rgba(0,0,0,0.07);
            padding: 25px;
            border-radius: 5px;
            overflow: hidden;

            & .banner {
                margin: -25px;
                padding-top: 50%;
                background-position: center;
                background-size: cover;
                margin-bottom: 25px;
            }
            & .title {
                font-weight: bold;
                font-size: 22px;
            }
            & p {
                line-height: 1.5em;
                opacity: 0.6;
            }
            & .actions {
                & a {
                    margin-right: 5px;
                }
            }
        }
    }

    .theme-dark {
        & .project {
            background: rgba(255,255,255,0.07);
        }
    }

    @media screen and (max-width: 1300px) {
        .projects-grid {
            grid-template-columns: 1fr 1fr;
        }
    }

    @media screen and (max-width: 800px) {
        .projects-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
