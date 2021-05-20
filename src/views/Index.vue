<template>
    <div class="page-wrapper page-index">
        <div class="welcome">
            
        </div>
        
        <!-- Newest Games -->
    </div>
</template>

<script>
    import MGGApi from '../modules/api';

    export default {
        name: 'Index',
        components: {
        },
        data: function() {
            return {
                apiRef: null,
            }
        },
        created: function() {
            this.$data.apiRef = new MGGApi(true);
        },
        methods: {
        }
    }
</script>
