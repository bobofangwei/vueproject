<template>
    <transition name="rightIn">
        <div class="gooddetail-wrapper" v-show="showFlag" v-if="food">
            <div class="gooddetail">
                <div class="img-wrapper">
                    <img class="good-img" :src="food.image" alt="">
                    <i class="icon-arrow_lift" @click="back"></i>
                </div>
                <div class="title-wrapper">
                    <div class="title">{{food.name}}</div>
                    <div class="extra">
                        <span class="sell-count">月售{{food.sellCount}}份</span>好评率{{food.rating}}%
                    </div>
                    <div class="price">
                        <span class="now">￥{{food.price}}</span>
                        <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="operate">
                        <button class="addbtn" v-if="!food.count||food.count===0">加入购物车</button>
                        <cartcontrol :food="food" v-else></cartcontrol>
                    </div>
                </div>
                <split></split>
                <div class="desc-wrapper" v-if="food.info">
                    <h4 class="heading">商品简介</h4>
                    <p class="info">{{food.info}}</p>
                </div>
                <split></split>
                <div class="rate-wrapper">
                    <h4 class="rate-title">商品评价</h4>
                    <div class="rateheader-wrapper">
                        <rateheader :desc="['全部','推荐','吐槽']" v-on:toggleContent="toggleContent" v-on:changeRateType="changeRateType" :allNum="allNum" :positiveNum="positiveNum" :negtiveNum="negtiveNum"></rateheader>
                    </div>
                    <ul class="rate-list" v-if="food.ratings&&food.ratings.length>0">
                        <li class="rate-item" v-for="(rate,index) in food.ratings" v-show="needShow(rate.rateType,rate.text)">
                            <div class="time-people f-clearfix">
                                <div class="time f-left">{{rate.rateTime | formatDate}}</div>
                                <div class="people f-right">
                                    {{rate.username}}
                                    <img :src="rate.avatar" class="rate-avata" alt="">
                                </div>
                            </div>
                            <div class="rate-content">
                                <i class="rate-type" :class="rate.rateType===0?'icon-thumb_up':'icon-thumb_down'"></i> <span v-if="rate.text">{{rate.text}}</span>
                            </div>
                        </li>
                    </ul>
                    <div v-else class="no-rating">暂无评价</div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
import BScroll from 'better-scroll';
import cartcontrol from '../cartcontrol/cartcontrol';
import rateheader from '../rateheader/rateheader';
import split from '../split/split';
import {
    formatTime
} from '../../common/js/util.js';
export default {
    data: function() {
        return {
            showFlag: false,
            selectRateType: -1,
            onlyContent: false
        };
    },
    props: {
        food: {
            type: Object,
            default: {}
        }
    },
    computed: {
        allNum: function() {
            let result = 0;
            if (this.food.ratings) {
                result = this.food.ratings.length;
            }
            return result;
        },
        positiveNum: function() {
            var result = 0;
            if (this.food.ratings) {
                this.food.ratings.forEach(function(rate) {
                    if (rate.rateType === 0) {
                        result += 1;
                    }
                });
            }
            return result;
        },
        negtiveNum: function() {
            var result = 0;
            if (this.food.ratings) {
                this.food.ratings.forEach(function(rate) {
                    if (rate.rateType === 1) {
                        result += 1;
                    }
                });
            }
            return result;
        }
    },
    methods: {
        show: function() {
            this.showFlag = true;
            // 每一次呈现的时候，会计算宽高，因此应当在这个时候初始化bscroll，而不是created或mounted的时候
            // 注意better-scroll包装的是传递的$el下的第一个子元素（查看对应元素可以发现，为其添加了响应的transition样式）
            // 考虑到better-scroll的原理即可明白这一点，外部元素的高度是固定的，当包围的内部元素的高度超过外层元素的固定高度的时候，就会发生滚动
            this.$nextTick(() => {
                // console.log(this);
                if (!this.scroll) {
                    console.log('$el', this.$el);
                    this.scroll = new BScroll(this.$el, {
                        click: true
                    });
                } else {
                    this.scroll.refresh();
                }
            });
        },
        back: function() {
            this.showFlag = false;
        },
        toggleContent: function(onlyContent) {
            this.onlyContent = onlyContent;
            this.$nextTick(function() {
                if (!this.scroll) {
                    this.scroll = new BScroll(this.$el, {
                        click: true
                    });
                } else {
                    this.scroll.refresh();
                }
            });
        },
        changeRateType: function(type) {
            this.selectRateType = type;
            this.$nextTick(function() {
                if (!this.scroll) {
                    this.scroll = new BScroll(this.$el, {
                        click: true
                    });
                } else {
                    this.scroll.refresh();
                }
            });
        },
        needShow: function(rateType, rateText) {
            if (this.onlyContent && !rateText) {
                return false;
            }
            if (this.selectRateType === -1) {
                return true;
            }
            if (this.selectRateType === rateType) {
                return true;
            }
        }
    },
    filters: {
        formatDate: function(value) {
            return formatTime(value, 'yyyy-MM-dd hh-mm');
        }
    },
    components: {
        cartcontrol,
        split,
        rateheader
    }
};
</script>
<style lang="scss">
@import '../../common/scss/mixin.scss';
.gooddetail-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 48px;
    z-index: 30;
    width: 100%;
    background-color: #fff;
    .img-wrapper {
        width: 100%;
        padding-top: 100%;
        box-sizing: content-box;
        height: 0;
        position: relative;
        .good-img {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
        }
        .icon-arrow_lift {
            position: absolute;
            left: 5px;
            top: 15px;
            font-size: 14px;
            color: #fff;
            padding: 10px;
        }
    }
    .title-wrapper {
        @extend %padding18;
        position: relative;
        .title {
            @include font-style(14px, rgb(7, 17, 27), 700, 14px);
            padding-bottom: 8px;
        }
        .extra {
            padding-bottom: 10px;
            @include font-style(10px, rgb(147, 158, 159), normal, 10px);
            .sell-count {
                margin-right: 12px;
            }
        }
        .price {
            height: 24px;
            line-height: 24px;
            font-weight: 700;
            .now {
                font-size: 14px;
                color: rgb(240, 20, 20);
                margin-right: 12px;
            }
            .old {
                font-size: 10px;
                color: rbg(147, 158, 159);
            }
        }
        .operate {
            position: absolute;
            bottom: 18px;
            right: 18px;
            .addbtn {
                background-color: rgb(0, 160, 220);
                width: 74px;
                height: 24px;
                line-height: 24px;
                color: #fff;
                border-radius: 12px;
                font-size: 10px;
                border: none;
            }
        }
    }
    .desc-wrapper {
        @extend %padding18;
        .heading {
            font-size: 14px;
            padding-bottom: 6px;
            color: rgb(7, 17, 27);
        }
        .info {
            padding: 0 8px;
            font-size: 12px;
            line-height: 24px;
            color: (77, 85, 93);
        }
    }
    .rate-wrapper {
        .rate-title {
            padding: 18px 18px 0 18px;
            font-size: 10px;
            color: rgb(7, 17, 27);
        }
        .rate-list {
            padding: 0 18px;
            .rate-item {
                padding: 16px 0;
                border-bottom: 1px solid rgba(7, 17, 27, .1);
                .time-people {
                    font-size: 10px;
                    height: 12px;
                    line-height: 12px;
                    margin-bottom: 6px;
                    .rate-avata {
                        margin-left: 6px;
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                    }
                }
                .rate-content {
                    font-size: 12px;
                    height: 24px;
                    line-height: 24px;
                    color: rgb(7, 17, 27);
                    .rate-type {
                        margin-right: 4px;
                        &.icon-thumb_up {
                            color: rgb(0, 160, 220);
                        }
                        &.icon-thumb-down {
                            color: rgb(147, 153, 159);
                        }
                    }
                }
            }
        }
    }
}

.rightIn-enter-active,
.rightIn-leave-active {
    transition: all .2s linear;
}

.rightIn-enter,
.rightIn-leave-active {
    left: 100%;
}
</style>
