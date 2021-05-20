<template>
    <router-link :to="{name: 'UserDetail', params: {id: id}}" class="avatar-item">
        <div class="avatar" :style="'background-image: url(' + avatarFileName + ');'"></div>
    </router-link>
</template>

<script>
    export default {
        name: 'HeaderAvatarItem',
        props: ['id', 'avatarFileName', 'username'],
    }
</script>

<style lang="less" scoped>
    .avatar-item {
        display: flex;
        align-items: center;
        
        & .avatar {
            background: rgba(0,0,0,0.1);
            display: block;
            width: 36px;
            height: 36px;
            margin: 10px;
            border-radius: 50px;
        }
    }
</style>