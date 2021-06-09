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
        transition: 0.2s ease-in-out all;
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
            background: #fff;
            box-shadow: 0px 4px 16px 2px rgba(0,0,0,0.07);
        }
    }

    .theme-dark {
        & .channel-item {
            background: rgba(255,255,255,0.07);

            &:hover {
                background: rgba(255,255,255,0.14);
            }
        }
    }
</style>