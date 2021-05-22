<template>
    <div class="channel-list">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'ChannelList',
        props: [
            'title',
        ]
    }
</script>

<style lang="less" scoped>
    & .channel-list {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 25px;
    }
</style>