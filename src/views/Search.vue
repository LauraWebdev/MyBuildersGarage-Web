<template>
    <div class="page-search">
        <div class="page-centered page-header">
            <div class="page-wrapper">
                <h1>Find</h1>
                <input type="text" v-model="searchQuery" v-on:input="changeSearch" ref="searchInput" />
            </div>
        </div>

        <div class="page-centered page-channelList" v-if="results != null && !apiLoading">
            <div class="page-wrapper">
                <GameList>
                    <GameItem v-for="game in results.games" v-bind:key="game.id" v-bind="game"></GameItem>
                </GameList>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Search',
        data: function() {
            return {
                apiRef: null,
                searchQuery: "",
                apiLoading: true,
                results: null,
                searchTimeout: null
            }
        },
        created: function() {
            this.$data.apiRef = new MGGApi(true);
        },
        mounted: function() {
            this.$refs.searchInput.focus();

            console.log(this.$route.params.searchQuery);

            if(this.$route.params.searchQuery != "" && this.$route.params.searchQuery != undefined) {
                this.$data.searchQuery = this.$route.params.searchQuery;
                this.search();
            }
        },
        methods: {
            changeSearch: function() {
                if(this.$data.searchTimeout) {
                    clearTimeout(this.$data.searchTimeout);

                    this.$data.searchTimeout = setTimeout(() => {
                        this.$router.push({ name: 'Search', params: { searchQuery: this.$data.searchQuery } });
                        this.processSearch();
                    }, 500);
                }
            },
            processSearch: async function() {
                try {
                    this.$data.apiLoading = true;
                    this.$data.results = await this.$data.apiRef.getSearchResults(this.$data.searchQuery);
                    this.$data.apiLoading = false;

                    console.log(this.$data.results);
                } catch(error) {
                    console.error(error);

                    this.$data.results = null;
                    this.$data.apiLoading = false;
                }
            }
        }
    }
</script>
