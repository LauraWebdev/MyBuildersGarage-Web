<template>
    <router-link :to="{ name: 'ChannelDetail', params: { id: id }}" class="channel-item">
        <div class="title">#{{ title }}</div>
        <div class="description">
            {{ description }}
        </div>
    </router-link>
</template>

<script>
    export default {
        name: 'ChannelItem',
        props: [
            'id',
            'title',
            'description',
        ]
    }
</script>

<style lang="less" scoped>
    .channel-item {
        display: grid;
        grid-gap: 5px;
        text-decoration: none;
        transition: 0.2s ease-in-out opacity;
        padding: 15px;
        border-radius: 5px;
        background: rgba(0,0,0,0.07);

        & .title {
            font-size: 18px;
            font-weight: bold;
            letter-spacing: -0.05em;
        }

        & .description {
            opacity: 0.6;
            line-height: 1.5em;
        }

        &:hover {
            cursor: pointer;
            opacity: 0.6;
        }
    }
</style>