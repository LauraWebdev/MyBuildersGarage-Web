<template>
    <div class="page-channelOverview">
        <div class="page-centered page-header">
            <div class="page-wrapper">
                <h1>{{ $t('channelOverview.header') }}</h1>
                <p>{{ $t('channelOverview.explaination') }}</p>
            </div>
        </div>

        <div class="page-centered page-channelList">
            <div class="page-wrapper sponsor-block-full">
                <InFeedAdsense
                    data-ad-layout-key="-gw-3+1f-3d+2z"
                    data-ad-client="ca-pub-3335802362531005"
                    data-ad-slot="6786095853"
                    data-ad-format="fluid">
                </InFeedAdsense>
            </div>

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
        metaInfo: {
            title: 'Channel Overview',
        },
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
            this.$data.apiRef = new MGGApi();
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
    .sponsor-block-full {
        margin-bottom: 50px;
    }
</style>