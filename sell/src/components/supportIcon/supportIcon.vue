<template>
    <span class="icon" v-if="supportType" :class="supportType"></span>
</template>
<script type="text/javascript">
export default {
    data: function() {
        return {
            typeMaps: ['decrease', 'discount', 'special', 'invoice', 'guarantee']
        };
    },
    props: {
        type: Number
    },
    computed: {
        supportType: function() {
            return this.typeMaps[this.type];
        }
    }
};
</script>
<style lang="scss">
@import '../../common/scss/mixin.scss';
.icon {
    display: inline-block;
    width: 12px;
    height: 12px;
    background-size: 12px 12px;
    background-repeat: no-repeat;
    vertical-align: top;
    margin-right: 2px;
    &.decrease {
        @include bg-img('./imgs/decrease_1');
    }
    &.discount {
        @include bg-img('./imgs/discount_1');
    }
    &.special {
        @include bg-img('./imgs/special_1');
    }
    &.invoice {
        @include bg-img('./imgs/invoice_1');
    }
    &.guarantee {
        @include bg-img('./imgs/guarantee_1');
    }
}
</style>
