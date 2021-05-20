<template>
    <footer>
        <p>MyGarage.games is a free platform by the community and in no way affiliated with Nintendo.<br />Game Builder Garage is a trademark by Nintendo.</p>

        <LinkButton :to="{name: 'Legal'}">Legal information</LinkButton>
    </footer>
</template>

<script>
    import LinkButton from '@/components/General/LinkButton';

    export default {
        name: 'PageFooter',
        components: {
            LinkButton
        }
    }
</script>

<style lang="less" scoped>
    footer {
        width: 90%;
        max-width: 1140px;
        margin: 50px auto;
        text-align: center;

        & p {
            background: rgba(0,0,0,0.07);
            border-radius: 4px;
            text-align: center;
            padding: 15px;
            margin: 0 0 15px 0;
            opacity: 0.6;
        }
    }
</style>