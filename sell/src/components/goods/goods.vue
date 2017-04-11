<template>
    <div class="tab-foods">
        <div class="menu" ref="menu">
            <ul class="menu-list">
                <li class="menu-item" v-for="(goodItem,index) in goods" :class="{current:index===currentIndex}" @click="selectMenu(index)">
                    <div class="menu-content border-1px">
                        <support-icon :type="goodItem.type"></support-icon>{{goodItem.name}}</div>
                </li>
            </ul>
        </div>
        <div class="goods" ref="goods">
            <ul class="goods-list">
                <li class="goods-item" v-for="(item,index) in goods">
                    <h1 class="goods-title">{{item.name}}</h1>
                    <ul class="foods-list">
                        <li class="foods-item" v-for="food in goods[index].foods" @click="selectFood(food,$event)">
                            <div class="food-wrapper">
                                <img :src="food.icon" alt="" class="food-icon">
                                <div class="food-content">
                                    <h3 class="food-title">{{food.name}}</h3>
                                    <p class="food-desc">{{food.description}}</p>
                                    <p class="food-extra"><span class="sell-count">月售{{food.sellCount}}份</span>好评率{{food.rating}}%</p>
                                    <p class="food-price">
                                        <span class="now">${{food.price}}</span>
                                        <span class="old" v-if="food.oldPrice">${{food.oldPrice}}</span>
                                    </p>
                                </div>
                            </div>
                            <div class="cartcontrol-wrapper">
                                <cartcontrol v-on:cartadd="_drop" :food="food"></cartcontrol>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <div class="shopcart-wrapper">
            <shopcart ref="shopcart" :cart-foods="cartFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcart>
        </div>
        <!--商品详情页-->
        <gooddetail ref="gooddetail" :food="selectedFood"></gooddetail>
    </div>
</template>
<script type="text/javascript">
import supportIcon from '../supportIcon/supportIcon.vue';
import shopcart from '../shopcart/shopcart.vue';
import cartcontrol from '../cartcontrol/cartcontrol.vue';
import gooddetail from '../gooddetail/gooddetail.vue';
import BScroll from 'better-scroll';

export default {
    data: function() {
        return {
            'goods': [],
            'scrollY': 0,
            'goodsHeight': [],
            'selectedFood': null
        };
    },
    props: {
        seller: {
            type: Object
        }
    },
    created: function() {
        this.$http.get('/api/goods').then(response => {
            // console.log(response.body);
            if (response.body.errno === 0) {
                this.goods = response.body.data;
                this.$nextTick(function() {
                    this._initScroll();
                    this.calHeights();
                });
            }
        });
    },
    computed: {
        currentIndex: function() {
            var result = 0;
            for (let i = 0, len = this.goodsHeight.length; i < len; i++) {
                // console.log('scrollY', this.scrollY);
                // console.log('goodsHeight', this.goodsHeight);
                if (this.scrollY >= this.goodsHeight[i] && (!this.goodsHeight[i + 1] || this.scrollY < this.goodsHeight[i + 1])) {
                    result = i;
                }
            }
            // console.log('currentIndex', result);
            return result;
        },
        cartFoods: function() {
            var result = [];
            for (let i = 0, len = this.goods.length; i < len; i++) {
                let foods = this.goods[i].foods;
                for (let j = 0, len1 = foods.length; j < len1; j++) {
                    if (foods[j].count) {
                        result.push(foods[j]);
                    }
                }
            }
            // console.log(result);
            return result;
        }
    },
    methods: {
        _initScroll: function() {
            this.menuScroll = new BScroll(this.$refs.menu, {
                click: 'true'
            });
            this.goodsScroll = new BScroll(this.$refs.goods, {
                probeType: 3,
                click: 'true'
            });
            this.goodsScroll.on('scroll', (pos) => {
                this.scrollY = Math.abs(pos.y);
            });
        },
        calHeights: function() {
            let goodsItem = this.$refs.goods.querySelectorAll('.goods-item');
            let initHeight = 0;
            this.goodsHeight.push(initHeight);
            for (let i = 0, len = goodsItem.length; i < len; i++) {
                initHeight += goodsItem[i].offsetHeight;
                this.goodsHeight.push(initHeight);
            }
        },
        selectMenu: function(index) {
            console.log('index', index);
            let goodsItem = this.$refs.goods.querySelectorAll('.goods-item');
            this.goodsScroll.scrollToElement(goodsItem[index], 300);
        },
        _drop: function(target, event) {
            this.$refs.shopcart.drop(target);
        },
        selectFood: function(food) {
            if (!event._constructed) {
                return;
            }
            // console.log(food);
            this.selectedFood = food;
            this.$refs.gooddetail.show();
        }
    },
    components: {
        supportIcon,
        shopcart,
        cartcontrol,
        gooddetail
    }
};
</script>
<style lang="scss" rel="stylesheet/scss">
@import '../../common/scss/mixin.scss';
.tab-foods {
    position: absolute;
    top: 174px;
    bottom: 50px;
    left: 0;
    right: 0;
    display: flex;
    .menu {
        flex: 0 0 80px;
        background-color: #f3f5f7;
        overflow: hidden;
        .menu-item {
            padding: 0 12px;
            width: 100%;
            display: table;
            .menu-content {
                width: 100%;
                height: 54px;
                display: table-cell;
                vertical-align: middle;
                @include font-style(12px, rgb(7, 17, 27), 200, 14px);
                @include border-1px(rgba(7, 17, 27, .2));
            }
            &.current {
                font-weight: 700;
                background-color: #fff;
            }
        }
    }
    .goods {
        flex: 1;
        background-color: #fff;
        overflow: hidden;
        .goods-title {
            background-color: #f3f5f7;
            @include font-style(12px, rgb(147, 153, 159), 200, 26px);
            height: 26px;
            border-left: 1px solid #d9dde1;
            padding-left: 12px;
        }
        .foods-item {
            padding: 0 18px;
            background-color: #fff;
            position: relative;
            .food-wrapper {
                @include border-1px(rgba(7, 17, 27, .1));
                display: flex;
                padding: 18px 0;
                .food-icon {
                    width: 65px;
                    height: 65px;
                    flex: 0 0 50px;
                }
                .food-content {
                    flex: 1;
                    padding-left: 10px;
                    .food-title {
                        @include font-style(14px, rgb(7, 17, 27), 200, 14px);
                        margin-top: 2px;
                    }
                    .food-desc {
                        @include font-style(10px, rgb(147, 153, 159), 200, 10px);
                        margin-top: 8px;
                    }
                    .food-extra {
                        @include font-style(10px, rgb(147, 153, 159), 200, 10px);
                        margin-top: 8px;
                        .sell-count {
                            margin-right: 12px;
                        }
                    }
                    .food-price {
                        line-height: 24px;
                        .now {
                            @include font-style(14px, rgb(240, 20, 20), 700, 24px);
                            margin-right: 8px;
                        }
                        .old {
                            @include font-style(10px, rgb(147, 153, 159), normal, 24px);
                        }
                    }
                }
            }
            .cartcontrol-wrapper {
                position: absolute;
                bottom: 18px;
                right: 18px;
            }
        }
    }
    .shopcart-wrapper {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 100
    }
}
</style>
