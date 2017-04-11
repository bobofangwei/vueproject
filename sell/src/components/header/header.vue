<template>
    <div class="header" v-show="seller">
        <div class="content-wrapper f-clearfix">
            <div class="f-left">
                <img class="avatar" src="" alt="" :src="seller.avatar">
            </div>
            <div class="content f-left">
                <div class="title-wrapper">
                    <span src="" alt="" class="brand"></span>
                    <span class="title">{{seller.name}}</span>
                </div>
                <div class="description">{{seller.description}}</div>
                <div class="support-wrapper" v-if="seller.supports">
                    <span class="support-icon" :class="supportMap[seller.supports[0].type]"></span>
                    <span class="suppport">{{seller.supports[0].description}}</span>
                </div>
            </div>
            <div class="more" v-if="seller.supports" @click="toggleDetail">5个<i class="icon-keyboard_arrow_right"></i></div>
        </div>
        <div class="bulletin-wrapper">
            <span class="bulletin-icon"></span>
            <span class="bulletin-text">{{seller.bulletin}}</span>
            <i class="icon-keyboard_arrow_right" @click="toggleDetail"></i>
        </div>
        <img class="bg-img" src="" alt="" :src="seller.avatar">
        <div class="detail" v-show="showDetail">
            <div class="content-wrapper">
                <div class="content">
                    <h1 class="title">{{seller.name}}</h1>
                    <div class="star-wrapper">
                        <star :size="48" :score="parseFloat(seller.score,10)"></star>
                    </div>
                    <div class="title-bar">
                        <div class="line"></div>
                        <div class="text">优惠信息</div>
                        <div class="line"></div>
                    </div>
                    <ul class="support-list">
                        <li v-for="item in seller.supports">
                            <span class="support-icon" :class="supportMap[item.type]"></span>
                            <span class="support-text">{{item.description}}</span>
                        </li>
                    </ul>
                    <div class="title-bar">
                        <div class="line"></div>
                        <div class="text">商家公告</div>
                        <div class="line"></div>
                    </div>
                    <div class="bulletin">
                        {{seller.bulletin}}
                    </div>
                </div>
            </div>
            <footer>
                <i @click="toggleDetail" class="icon-close"></i>
            </footer>
        </div>
    </div>
</template>
<script>
import star from '../star/star.vue';
export default {
    data: function() {
        return {
            supportMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
            showDetail: false
        };
    },
    methods: {
        toggleDetail: function() {
            // console.log(this.showDetail);
            this.showDetail = !this.showDetail;
        },
        hideDetailHandler: function(a) {
            // console.log(a);
            // console.log(this.showDetail);
            this.showDetail = false;
        }
    },
    props: {
        seller: {
            type: Object
        }
    },
    components: {
        star
    }
};
</script>
<style lang="scss">
@import '../../common/scss/mixin.scss';
.header {
    .support-icon {
        display: inline-block;
        width: 12px;
        height: 12px;
        background-size: 12px 12px;
        background-repeat: no-repeat;
        vertical-align: top;
        margin-right: 4px;
        &.decrease {
            @include bg-img('decrease_1');
        }
        &.discount {
            @include bg-img('discount_1');
        }
        &.special {
            @include bg-img('special_1');
        }
        &.invoice {
            @include bg-img('invoice_1');
        }
        &.guarantee {
            @include bg-img('guarantee_1');
        }
    }
    background: rgba(7, 17, 27, .5);
    color: #fff;
    overflow: hidden;
    position: relative;
    .content-wrapper {
        padding: 24px 12px 18px 24px;
        position: relative;
        .avatar {
            width: 64px;
            height: 64px;
        }
        .content {
            margin-left: 16px;
            .title-wrapper {
                margin-top: 4px;
                .brand {
                    display: inline-block;
                    width: 30px;
                    height: 18px;
                    @include bg-img('brand');
                    background-size: 30px 18px;
                    background-repeat: no-repeat;
                    vertical-align: top;
                    margin-right: 6px;
                }
                .title {
                    @include font-style(16px, #fff, bold, 18px);
                }
            }
            .description {
                margin-top: 8px;
                @include font-style(12px, #fff, 200, #fff);
            }
            .support-wrapper {
                margin-top: 10px;
            }
        }
        .more {
            position: absolute;
            bottom: 18px;
            right: 12px;
            height: 24px;
            @include font-style(10px, #fff, 200, 12px);
            padding: 7px 8px;
            border-radius: 14px/16px;
            background-color: rgba(0, 0, 0, .2);
            i {
                margin-left: 3px;
            }
        }
    }
    .bulletin-wrapper {
        background-color: rgba(7, 17, 27, .2);
        height: 28px;
        line-height: 28px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 0 22px 0 12px;
        position: relative;
        .bulletin-icon {
            display: inline-block;
            width: 22px;
            height: 12px;
            @include bg-img('bulletin');
            background-size: 22px 12px;
            margin-right: 4px;
            margin-top: 8px;
        }
        i {
            position: absolute;
            right: 10px;
            bottom: 8px;
        }
    }
    .bg-img {
        filter: blur(10px);
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: -1;
    }
}

.detail {
    background: rgba(7, 17, 27, .8);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    z-index: 10;
    .content-wrapper {
        padding: 64px 36px;
        .content {
            .title {
                @include font-style(16px, 700, #fff, 16px);
                text-align: center;
            }
            .star-wrapper {
                text-align: center;
                margin-top: 16px;
            }
            .title-bar {
                display: flex;
                width: 100%;
                margin: 28px auto 0 auto;
                .text {
                    font-size: 14px;
                    font-weight: 900;
                    color: #fff;
                    padding: 0 12px;
                }
                .line {
                    border-bottom: 1px solid rgba(255, 255, 255, .5);
                    flex: 1;
                    position: relative;
                    top: -7px;
                }
            }
            .support-list {
                width: 100%;
                padding: 0 12px;
                margin: 24px auto 0 auto;
                li {
                    @include font-style(12px, 200, #fff, 12px);
                    margin-bottom: 12px;
                    .support-icon {
                        margin-right: 6px;
                    }
                }
            }
            .bulletin {
                width: 100%;
                padding: 0 12px 0 12px;
                margin: 24px auto 0 auto;
                @include font-style(12px, 200, #fff, 24px);
            }
        }
    }
    footer {
        height: 64px;
        text-align: center;
        i {
            font-size: 32px;
            color: rgba(255, 255, 255, .5);
        }
    }
}
</style>
