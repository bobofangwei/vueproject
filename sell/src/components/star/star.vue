<template>
    <ul class="star-list">
        <li v-for="itemState in itemStateArr">
            <span class="star" :class="[itemState,itemSize]"></span>
        </li>
    </ul>
</template>
<script>
export default {
    props: {
        score: {
            type: Number
        },
        size: {
            type: Number
        }
    },
    computed: {
        itemStateArr: function() {
            let i;
            let result = [];
            let integerPart = Math.floor(this.score);
            let hasDecimal = this.score % 1 >= 0.5;
            // console.log('score', this.score);
            // console.log('hasDecimal', hasDecimal);
            for (i = 0; i < integerPart; i++) {
                result.push('star-on');
            }
            if (hasDecimal) {
                result.push('star-half');
            }
            for (i = result.length; i < 5; i++) {
                result.push('star-off');
            }
            // console.log('result', result);
            return result;
        },
        itemSize: function() {
            return 'star-' + this.size;
        }
    }
};
</script>
<style lang="scss">
@import '../../common/scss/mixin.scss';
.star-list {
    display: inline-block;
    font-size: 0;
    li {
        display: inline-block;
    }
    .star {
        display: inline-block;
        background-repeat:no-repeat;
        &.star-24 {
            width: 10px;
            height: 10px;
            background-size: 10px 10px;
            &.star-on {
                @include bg-img('./imgs/star24_on');
            }
            &.star-half {
                @include bg-img('./imgs/star24_half');
            }
            &.star-off {
                @include bg-img('./imgs/star24_off');
            }
        }
        &.star-36 {
            width: 15px;
            height: 15px;
            background-size: 15px 15px;
            &.star-on {
                @include bg-img('./imgs/star36_on');
            }
            &.star-half {
                @include bg-img('./imgs/star36_half');
            }
            &.star-off {
                @include bg-img('./imgs/star36_off');
            }
        }
        &.star-48 {
            width: 20px;
            height: 19px;
            background-size: 20px 19px;
            &.star-on {
                @include bg-img('./imgs/star48_on');
            }
            &.star-half {
                @include bg-img('./imgs/star48_half');
            }
            &.star-off {
                @include bg-img('./imgs/star48_off');
            }
        }
    }
}
</style>
