<template>
    <router-link :to="to" class="button" :class="filled != undefined ? 'button-filled' : ''"><slot></slot></router-link>
</template>

<script>
    export default {
        name: 'Button',
        props: [
            'to',
            'filled'
        ]
    }
</script>

<style lang="less" scoped>
    .button {
        display: inline-block;
        padding: 5px 15px;
        background: transparent;
        color: #1EA0DE;
        text-decoration: none;
        border-radius: 4px;
        transition: 0.2s ease-in-out background;

        &:hover {
            background: #25baff44;
            cursor: pointer;
        }
        &.button-filled {
            background: #25B9FF;
            color: #fff;

            &:hover {
                background: #1a8fc5;
            }
        }
    }
</style>