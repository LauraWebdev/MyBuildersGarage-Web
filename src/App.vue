<template>
    <div class="app">
        <PageHeader />

        <router-view/>

        <PageFooter />
    </div>
</template>

<script>
    import PageHeader from '@/components/PageHeader';
    import PageFooter from '@/components/PageFooter';

    export default {
        name: 'App',
        components: {
            PageHeader,
            PageFooter
        }
    }
</script>

<style lang="less">
    html {
        box-sizing: border-box;
    }
    *, *:before, *:after {
        box-sizing: inherit;
    }
    body {
        margin: 0;
    }
    .app {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        overflow-x: hidden;
        overflow-y: scroll;
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
        color: #222;
        display: grid;
        grid-template-rows: auto 1fr auto;

        & a {
            color: inherit;
            text-decoration: underline;

            &:hover {
                text-decoration: none;
            }
        }
        & .page-header {
            background: url('assets/img/patternLight.png') center rgba(0,0,0,0.07);
            display: flex;
            padding: 25px 0px;

            & h1 {
                margin: 0;
                font-weight: bold;
                font-size: 32px;
            }
            & p {
                margin: 0;
                line-height: 1.5em;
                font-size: 18px;
            }
        }
        & .page-wrapper {
            width: 90vw;
            max-width: 1140px;
            justify-self: center;
        }
        & .page-centered {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        & .button {
            display: inline-block;
            background: transparent;
            color: #1EA0DE;
            text-decoration: none;
            border: 2px solid #25baff44;
            border-radius: 5px;
            font-weight: bold;
            padding: 7px 15px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-size: 12px;
            transition: 0.2s ease-in-out background;
            font-family: 'Poppins', sans-serif;

            &:hover {
                background: #25baff44;
                cursor: pointer;
            }
            &.button-filled {
                background: #25B9FF;
                border: 2px solid #1a8fc5;
                color: #fff;

                &:hover {
                    background: #1a8fc5;
                }
            }
            &:focus {
                outline: none;
            }
        }
        & .input {
            display: inline-block;
            background: transparent;
            color: #222;
            text-decoration: none;
            border: 2px solid rgba(0,0,0,0.4);
            border-radius: 5px;
            padding: 5px 10px;
            transition: 0.2s ease-in-out background;
            font-size: 14px;
            font-family: 'Poppins', sans-serif;

            &:hover {
                background: rgba(0,0,0,0.07);
                cursor: pointer;
            }
            &:focus {
                border-color: #000;
                outline: none;
            }
            &::placeholder {
                opacity: 0.6;
            }
        }
        & .input-select {
            display: inline-block;
            background: transparent;
            color: #222;
            text-decoration: none;
            border: 2px solid rgba(0,0,0,0.4);
            border-radius: 5px;
            padding: 0;
            transition: 0.2s ease-in-out background;
            font-size: 14px;
            font-family: 'Poppins', sans-serif;

            & option {
                padding: 5px 10px;
            }

            &[multiple] {
                height: 200px;
            }

            & option:hover {
                background: rgba(0,0,0,0.07);
                cursor: pointer;
            }
            &:focus {
                border-color: #000;
                outline: none;
            }
            &::placeholder {
                opacity: 0.6;
            }
        }
    }
</style>
