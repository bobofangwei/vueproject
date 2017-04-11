<template>
    <div class="rateheader">
        <ul class="menu-list f-clearfix">
            <li class="menu-item" :class="{highlight:selectRateType===-1}" @click="selectType(-1)">{{desc[0]}}<span class="num">{{allNum}}</span></li>
            <li class="menu-item" :class="{highlight:selectRateType===0}" @click="selectType(0)">{{desc[1]}}<span class="num">{{positiveNum}}</span></li>
            <li class="menu-item" :class="{highlight:selectRateType===1}" @click="selectType(1)">{{desc[2]}}<span class="num">{{negtiveNum}}</span></li>
        </ul>
        <div class="only-content">
            <i class="icon-check_circle" @click="toggleContent" :class="{highlight:onlyContent}"></i> 只看有内容的评价
        </div>
    </div>
</template>
<script type="text/javascript">
const ALL = -1;
export default {
    data: function() {
        return {
            selectRateType: ALL,
            onlyContent: false
        };
    },
    props: {
        desc: {
            type: Array
        },
        allNum: {
            type: Number
        },
        positiveNum: {
            type: Number
        },
        negtiveNum: {
            type: Number
        }
    },
    methods: {
        selectType: function(type) {
            this.selectRateType = type;
            this.$emit('changeRateType', type);
        },
        toggleContent: function() {
            this.onlyContent = !this.onlyContent;
            this.$emit('toggleContent', this.onlyContent);
        }
    }
};
</script>
<style lang="scss">
.rateheader {
    padding: 0 18px;
    border-bottom: 1px solid rgba(7, 17, 27, .1);
    .menu-list {
        padding: 18px 0;
        border-bottom: 1px solid rgba(7, 17, 27, .1);
    }
    .menu-item {
        float: left;
        margin-right: 8px;
        text-align: center;
        width: 60px;
        height: 28px;
        line-height: 28px;
        font-size: 12px;
        color: rgb(77, 85, 93);
        background-color: rgba(77, 85, 93, .2);
        &.highlight {
            color: #fff;
            background-color: rgba(0, 160, 220, .2);
        }
        .num {
            font-size: 10px;
            margin-left: 5px;
        }
    }
    .only-content {
        padding: 12px 0;
        font-size: 12px;
        color: rgb(147, 153, 159);
        .highlight {
            color: rgb(0, 160, 220);
        }
    }
}
</style>
