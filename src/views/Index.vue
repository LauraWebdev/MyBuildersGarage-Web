<template>
    <div class="page">
        <div class="page-centered" v-if="!apiLoading">
            <div class="page-wrapper">
                <div class="tabs">
                    <router-link class="tab icon" :to="{ name: 'DiscoveryIndex' }"><span class="mdi mdi-home"></span></router-link>
                    <router-link class="tab" :to="{ name: 'DiscoveryNewest' }">{{ $t('index.newestHeader') }}</router-link>
                    <router-link class="tab" :to="{ name: 'DiscoveryPopular' }">{{$t('index.popularHeader') }}</router-link>
                </div>
            </div>
        </div>
        
        <router-view />
    </div>
</template>

<script>
    import ExternalLinkButton from '@/components/General/ExternalLinkButton';

    export default {
        name: 'Index',
        metaInfo: {
            title: 'Discover & Share',
        },
        components: {
            ExternalLinkButton,
        }
    }
</script>

<style lang="less" scoped>

</style>
