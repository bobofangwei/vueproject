<template>
    <div class="seller-wrapper">
        <div class="seller">
            <div class="abstract-wrapper">
                <div class="title-star">
                    <div class="title">{{seller.name}}</div>
                    <div class="star-wrapper">
                        <star :size="36" :score="seller.score"></star>
                        <span class="sellcount">月售{{seller.sellCount}}单</span>
                    </div>
                    <div class="collect" :class="{'collected':collected}">
                        <i class="icon-favorite" @click="toggleCollect($event)"></i>
                        <div class="collect-desc">{{collected?'已收藏':'收藏'}}</div>
                    </div>
                </div>
                <ul class="price-list f-clearfix">
                    <li class="price-item">
                        <div class="label">起送价</div>
                        <div class="price">{{seller.minPrice}}<span class="unit">元</span></div>
                    </li>
                    <li class="price-item">
                        <div class="label">商家配送</div>
                        <div class="price">{{seller.deliveryPrice}}<span class="unit">元</span></div>
                    </li>
                    <li class="price-item">
                        <div class="label">平均配送时间</div>
                        <div class="price">{{seller.deliveryTime}}<span class="unit">分钟</span></div>
                    </li>
                </ul>
            </div>
            <split></split>
            <div class="bulletin-wrapper">
                <h4 class="title">公告与活动</h4>
                <div class="bulletin">{{seller.bulletin}}</div>
                <ul class="activity-list" v-if="seller.supports&&seller.supports.length">
                    <li class="activity-item" v-for="support in seller.supports">
                        <div class="icon-wrapper">
                            <support-icon :type="support.type"></support-icon>
                        </div>
                        {{support.description}}
                    </li>
                </ul>
            </div>
            <split></split>
            <div class="pic-wrapper">
                <h4 class="title">商家实景</h4>
                <div class="pic-outter" ref="picscroll-hook">
                    <ul class="pic-list f-clearfix">
                        <li class="pic-item f-left" v-for="pic in seller.pics">
                            <img class="seller-pic" alt="" :src="pic">
                        </li>
                    </ul>
                </div>
            </div>
            <split></split>
            <div class="info-wrapper">
                <h4 class="title">商家信息</h4>
                <ul class="info-list">
                    <li class="info-item" v-for="info in seller.infos">{{info}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
import star from '../star/star.vue';
import split from '../split/split.vue';
import supportIcon from '../supportIcon/supportIcon.vue';
import BScroll from 'better-scroll';
import {
    saveToLocal,
    loadFromLocal
} from '../../common/js/util.js';

export default {
    data: function() {
        return {
            collected: (() => {
                return loadFromLocal(this.seller.id, 'favorite', false);
            })()
        };
    },
    props: {
        seller: {
            type: Object,
            default: {}
        }
    },
    components: {
        star,
        split,
        supportIcon
    },
    methods: {
        toggleCollect: function(event) {
            if (!event._constructed) {
                return;
            }
            this.collected = !this.collected;
            saveToLocal(this.seller.id, 'favorite', this.collected);
        }
    },
    mounted: function() {
        this.scroll = new BScroll(this.$el, {
            click: true
        });
        // 实景图片部分的水平滚动视口
        // console.log('mounted:this.seller', this.seller);
        let picScroll = this.$refs['picscroll-hook'];
        let picList = picScroll.querySelector('.pic-list');
        picList.style.width = (this.seller.pics.length * (120 + 6) - 6) + 'px';
        this.$nextTick(function() {
            this.picScroll = new BScroll(picScroll, {
                scrollX: true
            });
        });
    }
};
</script>
<style lang="scss" rel="stylesheet/scss">
%paddingVerti18 {
    padding-top: 18px;
    padding-bottom: 18px;
}

%paddingHori18 {
    padding-left: 18px;
    padding-right: 18px;
}

.title {
    font-size: 14px;
    color: rgb(7, 17, 27);
    line-height: 14px;
}

.seller-wrapper {
    position: absolute;
    top: 178px;
    width: 100%;
    bottom: 0;
    overflow: hidden;
    .abstract-wrapper {
        @extend %paddingHori18;
        .title-star {
            @extend %paddingVerti18;
            border-bottom: 1px solid rgba(7, 17, 27, .1);
            position: relative;
            .title {
                margin-bottom: 8px;
            }
            .sellcount {
                margin-left: 12px;
                font-size: 10px;
                color: rgb(77, 85, 93);
                height: 18px;
                line-height: 18px;
            }
            .collect {
                position: absolute;
                top: 18px;
                right: 0;
                text-align: center;
                .icon-favorite {
                    font-size: 24px;
                    line-height: 1;
                    color: rgb(147, 153, 159);
                    padding: 10px;
                }
                .collect-desc {
                    font-size: 10px;
                    line-height: 1;
                    color: rgb(77, 85, 93);
                }
                &.collected {
                    .icon-favorite {
                        color: rgb(240, 20, 20);
                    }
                }
            }
        }
        .price-list {
            @extend %paddingVerti18;
            display: flex;
            .price-item {
                flex: 1;
                border-right: 1px solid rgba(7, 17, 27, .1);
                font-size: 10px;
                font-weight: 200;
                text-align: center;
                .label {
                    margin-bottom: 4px;
                    color: rgb(147, 153, 159);
                    line-height: 1;
                }
                .price {
                    font-size: 24px;
                    color: rgb(7, 17, 27);
                    line-height: 24px;
                    .unit {
                        font-size: 10px;
                    }
                }
                &:last-child {
                    border-right: none;
                }
            }
        }
    }
    .bulletin-wrapper {
        @extend %paddingVerti18;
        @extend %paddingHori18;
        font-size: 12px;
        font-weight: 200;
        .title {
            margin-bottom: 8px;
        }
        .bulletin {
            padding: 0 12px;
            color: rgb(240, 20, 20);
            line-height: 24px;
            word-break: break-all;
        }
        .activity-item {
            .icon-wrapper {
                display: inline-block;
                vertical-align: middle;
            }
            border-top: 1px solid rgba(7, 17, 27, .1);
            padding: 16px 12px;
            color: rgb(7, 17, 27);
            line-height: 16px;
        }
    }
    .pic-wrapper {
        @extend %paddingVerti18;
        @extend %paddingHori18;
        .title {
            margin-bottom: 12px;
        }
        .pic-outter {
            width: 100%;
            margin-top: 12px;
            .pic-item {
                margin-right: 6px;
                &:last-child {
                    margin-right: 0;
                }
                .seller-pic {
                    width: 120px;
                    height: 90px;
                }
            }
        }
    }
    .info-wrapper {
        padding: 18px 18px 0 18px;
        .info-item {
            padding: 16px 12px;
            border-top: 1px solid rgba(7, 17, 27, .1);
            font-size: 12px;
            font-weight: 200;
            color: rgb(7, 17, 27);
            line-height: 16px;
        }
    }
}
</style>
