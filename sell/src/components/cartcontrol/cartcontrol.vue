<template>
    <div class="cartcontrol">
        <transition name="move">
            <div class="icon-wrapper" v-show="food.count">
                <i class="icon-remove_circle_outline" @click.stop.prevent="decrease($event)" v-show="food.count"></i>
            </div>
        </transition>
        <span class="count" v-show="food.count">{{food.count}}</span>
        <i class="icon-add_circle" @click.stop.prevent="add($event)"></i>
    </div>
</template>
<script type="text/javascript">
import Vue from 'vue';
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
            }]
        };
    },
    props: {
        food: {
            type: Object
        }
    },
    methods: {
        decrease: function(event) {
            // console.log('click decrease');
            if (!event._constructed) {
                return;
            }

            if (this.food.count && this.food.count >= 1) {
                this.food.count--;
            }
            this.$emit('cartDecrease', event.target);
        },
        add: function(event) {
            // console.log('click add');
            if (!event._constructed) {
                return;
            }
            // 添加的属性不能被检测，需要使用Vue.set方法
            if (!this.food.count) {
                Vue.set(this.food, 'count', 0);
            }
            this.food.count++;
            this.$emit('cartadd', event.target);
        }
    }
};
</script>
<style lang="scss">
.cartcontrol {
    font-size: 24px;
    color: rgb(0, 160, 220);
    line-height: 24px;
    height: 24px;
    i {
        vertical-align: middle;
    }
    .icon-wrapper {
        display: inline-block;
        .icon-remove_circle_outline {
            transition: all .3s linear;
        }
    }
    .count {
        color: rgb(147, 153, 159);
        display: inline-block;
        height: 100%;
        font-size: 10px;
        vertical-align: middle;
    }
    .move-enter-active,
    .move-leave-active {
        transition: all 0.3s linear;
    }
    .move-leave-active,
    .move-enter {
        transform: translate3d(24px, 0, 0);
        .icon-remove_circle_outline {
            transform: rotate(180deg);
        }
    }
}
</style>
