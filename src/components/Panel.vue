<style scope lang="sass">
$black: rgba(0, 0, 0, 0.6);
$white: #fff;
$gray: #ccc;
$panel-item-width: 200px;
$panel-item-content-width: 120px;
$panel-carousel-height: 200px;

.panel {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    background-color: $white;
    border: 1px solid $gray;
    border-radius: 5px;
    margin: 10px 0;
    &:hover {
        cursor: pointer;
        box-shadow: 0 0 2px rgba($gray, .7),
                    0 0 3px rgba($gray, .5);
    }
    .panel-tag {
        position: absolute;
        z-index: 2;
        .ivu-tag {
            margin: 0;
            border-radius: 0;
        }
    }
    .panel-carousel {
        width: 20%;
        height: $panel-carousel-height;
        .ivu-carousel {
            height: $panel-carousel-height;
        }
        .img-carousel {
            width: 100%;
            height: $panel-carousel-height;
            line-height: $panel-carousel-height;
        }
    }
    .panel-wrap {
        padding: 10px 0 10px 10px;
        width: 70%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-start;
    }
    .panel-tools {
        padding: 10px;
        width: 10%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
    }
}

.panel-item {
    line-height: 1.5;
    width: $panel-item-width;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    .item-key {
        display: inline-block;
        padding-right: 10px;
        position: relative;
        &::after {
            position: absolute;
            top: 0;
            right: 0;
            display: block;
            content: "：";
            vertical-align: super;
        }
    }
    .item-value {
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        max-width: $panel-item-content-width;
        vertical-align: middle;
    }
}

</style>
<template>
    <div class="panel-container" >
        <div class="panel" v-for="(item, index) in data" :key="index">
            <div class="panel-carousel">
                <div class="panel-tag"><Tag color="blue">已解决</Tag></div>
                <Carousel autoplay>
                    <CarouselItem v-for="(img, idx) in item.ImgUrlList" :key="idx">
                        <img class="img-carousel" :src="img" :alt="img" />
                    </CarouselItem>
                </Carousel>
            </div>
            <div class="panel-wrap">
                <div class="panel-item" v-for="(value, key) in item" :key="value">
                    <span :id="key" class="item-key">{{getLabel(key)}}</span>
                    <span class="item-value">{{value}}</span>
                </div>
            </div>
            <div class="panel-tools">
                <Button type="primary" shape="circle" icon="ios-search"></Button>
            </div>
        </div>
    </div>
</template>
<script type="text/babel">

export default {
    name: 'Panel',
    props: {
        data: {
            type: Array,
            require: true,
            default: () => []
        },
        label: {
            type: Object,
            require: true,
            default: () => {}
        }
    },
    computed: {
        
    },
    methods: {
        getLabel(key) {
            return this.label && this.label[key] || 'No Label';
        }
    }
};
</script>