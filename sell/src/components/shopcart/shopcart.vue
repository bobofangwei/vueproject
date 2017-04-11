<template>
    <div class="shopcart-wrapper">
        <div class="cart-toggle" v-show="cartDetailShow">
            <div class="mask" @click="cartDetailShow=false"></div>
            <div class="cart-detail">
                <div class="header f-clearfix">
                    <span class="title">购物车</span>
                    <span class="clear f-right" @click="clearCart">清空</span>
                </div>
                <div class="list-wrapper" ref="list-wrapper">
                    <ul class="cart-list">
                        <li class="cart-item f-cclearfix" v-for="food in cartFoods">
                            <span class="name">{{food.name}}</span>
                            <div class="f-right">
                                <span class="price"><span class="unit">￥</span>{{food.price}}</span>
                                <cartcontrol v-on:cartDecrease="initOrRefreshScroll" :food="food" class="f-right"></cartcontrol>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="shopcart f-clearfix" @click="showCartDetail">
            <div class="logo-wrapper f-left">
                <div class="logo">
                    <div class="logo-inner" :class="{highlight:totalPrice}"><i class="icon-shopping_cart"></i></div>
                    <div class="count" v-if="totalCount">{{totalCount}}</div>
                </div>
            </div>
            <div class="price f-left">￥{{totalPrice}}</div>
            <div class="delivercost f-left">另需配送费{{deliveryPrice}}元</div>
            <div class="state f-right" :class="{highlight:totalPrice>=minPrice}">{{state}}</div>
            <transition v-for="(ballState,index) in balls" name="drop" :key="index" v-on:before-enter="beforeDropEnter" v-on:enter="dropEnter" v-on:after-enter="afterDropEnter">
                <div class="ball" v-show="ballState.show">
                    <div class="inner" v-show="ballState.show"></div>
                </div>
            </transition>
        </div>
    </div>
</template>
<script type="text/javascript">
import Velocity from 'velocity-animate';
import cartcontrol from '../cartcontrol/cartcontrol.vue';
import BScroll from 'better-scroll';
export default {
    data: function() {
        return {
            balls: [{
                show: false
            }, {
                show: false
            }, {
                show: false
            }, {
                show: false
            }, {
                show: false
            }],
            dropBalls: [],
            cartDetailShow: false
        };
    },
    props: {
        deliveryPrice: {
            type: Number,
            default: 0
        },
        minPrice: {
            type: Number,
            default: 0
        },
        cartFoods: {
            type: Array,
            default: function() {
                return [];
            }
        }
    },
    computed: {
        totalCount: function() {
            // console.log(this.cartFoods);
            let result = 0;
            this.cartFoods.forEach((food) => {
                result += food.count;
            });
            return result;
        },
        totalPrice: function() {
            let result = 0;
            this.cartFoods.forEach((food) => {
                result += food.price * food.count;
            });
            return result;
        },
        state: function() {
            if (!this.totalPrice) {
                return '￥' + this.minPrice + '元起送';
            } else if (this.totalPrice < this.minPrice) {
                return '差' + (this.minPrice - this.totalPrice) + '元起送';
            } else {
                return '去结算';
            }
        }

    },
    methods: {
        // 这里的el是通过父组件传过来的cartcontrol组件中的+号
        // 点击cartcontrol的+号的时候，这个方法会被触发
        // 因为可能连续点击，因此需要多个小球，将其show置为true
        drop: function(cartcontrolEl) {
            // 找到一个没有呈现的小球
            for (let i = 0, len = this.balls.length; i < len; i++) {
                let ball = this.balls[i];
                if (!ball.show) {
                    ball.show = true;
                    ball.cartcontrolEl = cartcontrolEl;
                    this.dropBalls.push(ball);
                    return ball;
                }
            }
        },
        // 清空购物车
        clearCart: function() {
            for (let i = 0, len = this.cartFoods.length; i < len; i++) {
                this.cartFoods[i].count = 0;
            }
            this.$nextTick(function() {
                this.scroll.refresh();
            });
        },
        beforeDropEnter: function(el) {
            console.log('beforeEnter');
            let len = this.balls.length;
            while (len--) {
                let ball = this.balls[len];
                if (ball.show) {
                    let cartcontrolEl = ball.cartcontrolEl;
                    let rect = cartcontrolEl.getBoundingClientRect();
                    el.style.left = rect.left + 'px';
                    el.style.bottom = (window.innerHeight - rect.top) + 'px';
                }
            }
        },
        dropEnter: function(el, done) {
            console.log('enter');
            Velocity(el, {
                left: ['36px', 'linear'],
                bottom: ['25px', [0.49, -0.29, 0.75, 0.41]]
            }, {
                duration: 400,
                complete: done
            });
        },
        afterDropEnter: function(el) {
            console.log('afterEnter');
            let ball = this.dropBalls.shift();
            if (ball.show) {
                ball.show = false;
                el.style.display = 'none';
            }
        },
        showCartDetail: function() {
            this.cartDetailShow = !this.cartDetailShow;
            if (!this.cartDetailShow) {
                return;
            }
            this.initOrRefreshScroll();
        },
        initOrRefreshScroll: function() {
            this.$nextTick(function() {
                if (!this.scroll) {
                    this.scroll = new BScroll(this.$refs['list-wrapper'], {
                        click: true
                    });
                } else {
                    this.scroll.refresh();
                }
            });
        }
    },
    components: {
        cartcontrol
    }
};
</script>
<style lang="scss">
@import '../../common/scss/mixin.scss';
.shopcart-wrapper {
    .mask {
        position: fixed;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(7, 17, 27, .1);
        z-index: 30;
    }
    .cart-detail {
        overflow: hidden;
        width: 100%;
        position: relative;
        z-index: 50;
        background-color: #fff;
        .header {
            height: 40px;
            line-height: 40px;
            padding: 0 18px;
            background-color: #f3f5f7;
            font-size: 14px;
            color: rgb(7, 17, 27);
            .clear {
                font-size: 12px;
                color: rgb(0, 160, 220);
                height: 40px;
                line-height: 40px;
            }
        }
        .list-wrapper {
            padding: 0 18px;
            background-color: #fff;
            max-height: 205px;
            overflow: hidden;
            .cart-item {
                padding: 12px 0;
                font-size: 14px;
                line-height: 2;
                border-top: 1px solid rgba(7, 17, 27, .1);
                .name {
                    color: rgb(7, 17, 27);
                }
                .f-right {
                    .price {
                        color: rgb(240, 20, 20);
                        margin-right: 5px;
                        .unit {
                            font-size: 10px;
                        }
                    }
                }
            }
        }
    }
    .shopcart {
        height: 48px;
        width: 100%;
        background-color: #141d27;
        font-size: 16px;
        line-height: 24px;
        position: relative;
        z-index: 100;
        .logo-wrapper {
            padding: 0 15px;
            width: 94px;
            height: 100%;
            .logo {
                position: absolute;
                background-color: #141d27;
                top: -10px;
                height: 58px;
                line-height: 58px;
                width: 58px;
                text-align: center;
                padding: 6px;
                border-radius: 50%;
                .logo-inner {
                    width: 100%;
                    height: 100%;
                    background-color: #29313A;
                    border-radius: 50%;
                    font-size: 24px;
                    line-height: 48px;
                    &.highlight {
                        background-color: rgb(0, 160, 220);
                        color: #fff;
                    }
                }
                .count {
                    position: absolute;
                    top: 0;
                    right: -3px;
                    width: 24px;
                    height: 16px;
                    border-radius: 12px;
                    background-color: rgb(240, 20, 20);
                    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .4);
                    @include font-style(9px, #fff, 700, 16px);
                }
            }
        }
        .price {
            font-weight: 700;
            padding-right: 12px;
            margin: 12px 0;
            border-right: solid rgba(255, 255, 255, .1) 1px;
        }
        .delivercost {
            font-size: 14px;
            font-weight: 200;
            line-height: 48px;
            padding-left: 12px;
        }
        .state {
            width: 105px;
            height: 100%;
            line-height: 48px;
            background-color: #29313A;
            text-align: center;
            font-size: 12px;
            font-weight: 700;
            &.highlight {
                background-color: rgb(0, 160, 220);
                color: #fff;
            }
        }
        .ball {
            position: fixed;
            left: 36px;
            bottom: 25px;
            .inner {
                width: 14px;
                height: 14px;
                background-color: rgb(0, 160, 220);
                border-radius: 50%;
            }
        }
    }
}
</style>
