<template>
    <div>
        <v-header :seller="seller"></v-header>
        <div class="tab border-1px">
            <router-link class="tab-item" to="/goods">商品</router-link>
            <router-link class="tab-item" to="/ratings">评论</router-link>
            <router-link class="tab-item" to="/sellers">商家</router-link>
        </div>
        <keep-alive>
            <router-view :seller="seller"></router-view>
        </keep-alive>
    </div>
</template>
<script>
import header from './components/header/header.vue';
import {
    parseQueryString
} from './common/js/util.js';
export default {
    data: function() {
        return {
            seller: {
                id: this.getIdFromHref()
            }
        };
    },
    created: function() {
        this.$http.get('/api/seller?id=123').then(response => {
            if (response.body.errno === 0) {
                // this.seller = response.body.data;
                this.seller = Object.assign({}, this.seller, response.body.data);
            }
        });
    },
    components: {
        'v-header': header
    },
    methods: {
        getIdFromHref: function() {
            let ret = parseQueryString(window.location.search);
            return ret['id'];
        }
    }
};
</script>
<style lang="scss" rel="stylesheet/scss">
@import './common/scss/mixin.scss';
.tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    @include border-1px(rgba(7, 17, 27, .1));
    .tab-item {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: rgb(77, 85, 93);
        &.active {
            color: rgb(240, 20, 20);
        }
    }
}
</style>
