<template>
    <div class="app">
        <PageHeader />

        <main>
            <router-view/>
        </main>

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
    }
</style>
