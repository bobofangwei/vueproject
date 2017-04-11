<template>
    <div class="ratings-wrapper">
        <div class="ratings">
            <div class="summary-wrapper">
                <div class="summary-score">
                    <p class="score">{{seller.score}}</p>
                    <p class="desc">综合评价</p>
                    <p class="extra">高于周围商家{{seller.rankRate}}%</p>
                </div>
                <div class="summary-star">
                    <p class="service">
                        <span>服务态度</span>
                        <span class="star-wrapper">
                        <star :score="seller.serviceScore" :size="36"></star>
                    </span>
                        <span class="score">{{seller.serviceScore}}</span>
                    </p>
                    <p class="quality">
                        <span>食物质量</span>
                        <span class="star-wrapper">
                        <star :score="seller.foodScore" :size="36"></star>
                    </span>
                        <span class="score">{{seller.foodScore}}</span>
                    </p>
                    <p>
                        <span>送达时间</span>
                        <span class="time">{{seller.deliveryTime}}</span>
                    </p>
                </div>
            </div>
            <split></split>
            <rateheader :desc="['全部','满意','不满意']" v-on:toggleContent="toggleContent" v-on:changeRateType="changeRateType" :allNum="allNum" :positiveNum="positiveNum" :negtiveNum="negtiveNum"></rateheader>
            <div class="ratelist-wrapper" ref="ratescroll">
                <ul class="rate-list">
                    <li class="rate-item" v-for="rate in ratings" v-show="needShow(rate.rateType,rate.text)">
                        <div class="rate-header f-clearfix">
                            <div class="logo-wrapper f-left">
                                <div class="f-left"><img class="logo" :src="rate.avatar" alt=""></div>
                                <div class="name-score f-right">
                                    <div class="name">{{rate.username}}</div>
                                    <star :size="24" :score="rate.score"></star>
                                </div>
                            </div>
                            <div class="time f-right">
                                {{rate.rateTime | formatDate}}
                            </div>
                        </div>
                        <div class="rate-text" v-if="rate.text">{{rate.text}}</div>
                        <div class="recommend-wrapper" v-if="rate.recommend&&rate.recommend.length">
                            <i class="icon-thumb_up"></i>
                            <ul class="recommend-list f-clearfix">
                                <li class="recommend-item" v-for="item in rate.recommend">{{item}}</li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
import star from '../star/star.vue';
import split from '../split/split.vue';
import rateheader from '../rateheader/rateheader.vue';
import BScroll from 'better-scroll';
import {
    formatTime
} from '../../common/js/util.js';

export default {
    data: function() {
        return {
            ratings: null,
            selectRateType: -1,
            onlyContent: false
        };
    },
    props: {
        seller: {
            type: Object
        }
    },
    components: {
        star,
        split,
        rateheader
    },
    methods: {
        toggleContent: function(onlyContent) {
            this.onlyContent = onlyContent;
            this.$nextTick(function() {
                this.scroll.refresh();
            });
        },
        changeRateType: function(type) {
            this.selectRateType = type;
            this.$nextTick(function() {
                this.scroll.refresh();
            });
        },
        needShow: function(rateType, rateText) {
            if (this.onlyContent && !rateText) {
                return false;
            }
            if (this.selectRateType === -1 || this.selectRateType === rateType) {
                return true;
            }
            return false;
        }
    },
    filters: {
        formatDate: function(value) {
            return formatTime(value, 'yyyy-MM-dd hh-mm');
        }
    },
    computed: {
        allNum: function() {
            let result = 0;
            if (this.ratings) {
                result = this.ratings.length;
            }
            return result;
        },
        positiveNum: function() {
            var result = 0;
            if (this.ratings) {
                this.ratings.forEach(function(rate) {
                    if (rate.rateType === 0) {
                        result += 1;
                    }
                });
            }
            return result;
        },
        negtiveNum: function() {
            var result = 0;
            if (this.ratings) {
                this.ratings.forEach(function(rate) {
                    if (rate.rateType === 1) {
                        result += 1;
                    }
                });
            }
            return result;
        }
    },
    created: function() {
        this.$http.get('/api/ratings').then(response => {
            if (response.body.errno === 0) {
                this.ratings = response.body.data;
                this.$nextTick(function() {
                    this.scroll = new BScroll(this.$refs.ratescroll, {
                        click: true
                    });
                });
            }
        });
    }
};
</script>
<style lang="scss" rel="stylesheet/scss">
@import '../../common/scss/mixin.scss';
.ratings-wrapper {
    position: absolute;
    top: 174px;
    left: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
}

.ratings {
    .summary-wrapper {
        @extend %padding18;
        padding-left: 0;
        padding-right: 0;
        display: flex;
        font-size: 12px;
        color: rgb(7, 17, 27);
        line-height: 1;
        .summary-score {
            flex: 0 0 138px;
            text-align: center;
            border-right: 1px solid rgba(7, 17, 27, .2);
            .score {
                font-size: 24px;
                color: rgb(255, 153, 0);
                line-height: 28px;
                margin-bottom: 6px;
            }
            .desc {
                margin-bottom: 8px;
            }
            .extra {
                font-size: 10px;
                color: rgba(7, 17, 27, .5);
            }
        }
    }
    .summary-star {
        padding: 0 24px;
        .service,
        .quality {
            margin-bottom: 8px;
        }
        .star-wrapper,
        .time {
            margin: 0 12px;
            color: rgba(7, 17, 27, .5);
        }
        .score {
            color: rgb(255, 153, 0);
        }
    } 
    .ratelist-wrapper {
        overflow: hidden;
        position: absolute;
        top: 220px;
        bottom: 0;
    }
    .rate-list {
        padding: 0 18px;
        .rate-item {
            @extend %padding18;
            border-bottom: 1px solid rgba(7, 17, 27, .2);
            .rate-header {
                margin-bottom: 6px;
                .logo {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    margin-right: 12px;
                }
                .name {
                    font-size: 10px;
                    line-height: 12px;
                    color: rgb(7, 17, 27);
                    margin-bottom: 4px;
                }
                .time {
                    font-size: 10px;
                    color: rgb(147, 153, 159);
                    line-height: 12px;
                    font-weight: 200;
                }
            }
            .rate-text {
                font-size: 12px;
                color: rgb(7, 17, 27);
                line-height: 18px;
                padding-left: 12px;
                margin-bottom: 8px;
            }
            .recommend-wrapper {
                padding-left: 12px;
                font-size: 9px;
                color: rgb(147, 153, 159);
                line-height: 16px;
                display: flex;
                .icon-thumb_up {
                    font-size: 12px;
                    color: rgb(0, 160, 220);
                    flex: 0 0 20px;
                    padding: 2px;
                }
                .recommend-list {
                    flex: 1;
                    height: 16px;
                    overflow: hidden;
                    .recommend-item {
                        float: left;
                        margin-right: 8px;
                        border: 1px solid rgba(7, 17, 27, .3);
                        border-radius: 2px;
                        height: 16px;
                        font-size: 9px;
                        width: 60px;
                        padding: 0 3px;
                        text-align: center;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                        &:last-child {
                            margin-right: 0;
                        }
                    }
                }
            }
        }
    }
}
</style>
