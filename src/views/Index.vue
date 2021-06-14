<template>
    <div class="page">
        <div class="page-centered">
            <div class="page-wrapper">
                <div class="tabs">
                    <router-link class="tab icon" :to="{ name: 'DiscoveryIndex' }"><span class="mdi mdi-home"></span></router-link>
                    <router-link class="tab" :to="{ name: 'DiscoveryNewest' }">{{ $t('index.newestHeader') }}</router-link>
                    <router-link class="tab" :to="{ name: 'DiscoveryHotThisWeek' }">{{ $t('index.hotThisWeekHeader') }}</router-link>
                    <router-link class="tab" :to="{ name: 'DiscoveryRandom' }">{{ $t('index.randomHeader') }}</router-link>
                    <router-link class="tab" :to="{ name: 'DiscoveryPopular' }">{{$t('index.popularHeader') }}</router-link>
                </div>
            </div>
        </div>
        
        <router-view />
    </div>
</template>

<script>
    export default {
        name: 'Index',
        metaInfo: {
            title: 'Discover & Share',
        },
        components: {
        }
    }
</script>

<style lang="less" scoped>

</style>
