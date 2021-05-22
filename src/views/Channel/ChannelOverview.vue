<template>
    <div class="page-channelOverview">
        <div class="page-centered page-header">
            <div class="page-wrapper">
                <h1>Channel Overview</h1>
                <p>Discover new games by a specific topic, style or concept.</p>
            </div>
        </div>

        <div class="page-centered page-channelList">
            <div class="page-wrapper">
                <ChannelList>
                    <ChannelItem v-for="channel in channels" v-bind:key="channel.id" v-bind="channel"></ChannelItem>
                </ChannelList>
            </div>
        </div>
    </div>
</template>

<script>
    import MGGApi from '../../modules/api';

    import ChannelList from '@/components/Channel/ChannelList';
    import ChannelItem from '@/components/Channel/ChannelItem';

    export default {
        name: 'ChannelOverview',
        components: {
            ChannelList,
            ChannelItem,
        },
        data: function() {
            return {
                apiRef: null,
                channels: [],
            }
        },
        created: function() {
            this.$data.apiRef = new MGGApi(true);
        },
        mounted: function() {
            this.fetchChannels();
        },
        methods: {
            fetchChannels: async function() {
                try {
                    this.$data.channels = await this.$data.apiRef.getAllChannels();
                } catch(error) {
                    console.error(error);
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .page-channelList {
        margin: 50px 0px;
    }
</style>