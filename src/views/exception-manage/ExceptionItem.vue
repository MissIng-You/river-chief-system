<style lang="sass" scoped>
    $black: rgba(0, 0, 0, 0.6);
    $white: #fff;
    $gray: #ccc;
    $panel-item-width: 200px;
    $panel-item-content-width: 120px;
    $panel-min-height: 185px;

    .panel {
        display: flex;
        min-height: $panel-min-height; 
        background-color: $white;
        border: 1px solid $gray;
        border-radius: 5px;
        margin: 10px 0;
        &.panel-vertical {
            flex-direction: column;
            .panel-carousel {
                width: 100%;
            }
            .panel-wrap {
                width: 100%;
            }
        }
        &:hover {
            cursor: pointer;
            box-shadow: 0 0 2px rgba($gray, .7),
                        0 0 3px rgba($gray, .5);
        }
        .panel-tag {
            position: absolute;
            z-index: 2;
            .ivu-tag {
                margin: 15px 0;
                border-radius: 0;
            }
        }
        .panel-carousel {
            width: 40%;
            height: $panel-min-height;
            .ivu-carousel {
                height: $panel-min-height;
            }
            .img-carousel {
                display: inline-block;
                width: 100%;
                height: $panel-min-height;
                line-height: $panel-min-height;
                vertical-align: top;
                // float: right;
                // margin: 0 8px;
                overflow: hidden;
                background-color: rgba($gray, .3);
                background-size: 100% 100%;
                background-repeat: no-repeat;
                background-position: center center;
            }
        }
        .panel-wrap {
            padding: 10px 0 10px 10px;
            width: 60%;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            align-items: center;
            justify-content: flex-start;
        }
        .panel-head {
            height: 40px;
            line-height: 40px;
            width: 100%;
            position: relative;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: flex-start;
            justify-content: space-between;
            &::before {
                position: absolute;
                display: block;
                content: "";
                left: 0;
                bottom: 0;
                width: 100%;
                height: 1px;
                background-color: $gray;
            }
            .timer>.ivu-icon {
                margin-right: 5px;
            }
            .ivu-tooltip {
                margin-right: 5px;
            }
        }
        .panel-body {
            padding: 10px;
        }
        .panel-content-tags {
            .ivu-tag {
                height: auto;
                line-height: 1;
                padding: 3px;
            }
        }
    }

</style>

<template>
<div :class="getPanelClass()">
    <div class="panel-carousel">
        <div class="panel-tag">
            <Tag :color="item.State === 100 ? 'red' : 'green'">{{item.State === 100 ? '未解决' : '已解决'}}</Tag>
        </div>
        <Carousel :arrow="getCarouselArrow(item.ImgUrlList)">
            <CarouselItem v-for="(img, idx) in item.ImgUrlList" :key="idx">
                <span class="img-carousel" :style="'background-image:url(' + img + ');'"></span>
            </CarouselItem>
        </Carousel>
    </div>

    <div class="panel-wrap">
        <div class="panel-head">
            <h3>{{item.PollingMainItem}}</h3>
            <h4 class="timer"><Icon type="clock" /><span>{{item.CreateTime}}</span></h4>
            <slot name="tools"></slot>
        </div>
        <div class="panel-content">
            <Row type="flex">
                <Col span="24" class="panel-content-tags">
                    <Tag type="dot" :color="getTagColor(pkey)" :key="pkey"
                        v-for="(pitem, pkey) in getPollingSonItem(item.PollingSonItem)">{{pitem}}</Tag>
                </Col>
                <Col span="24">
                    <key-value-item :data="{label: '上报人', value: item.CreatePeopleName}"></key-value-item>
                </Col>
                <Col span="24">
                    <key-value-item :data="{label: '所属河段', value: item.ReachName}"></key-value-item>
                </Col>
                <Col span="24">
                    <key-value-item :data="{label: '行政区划', value: item.FullAddress}"></key-value-item>
                </Col>
                <Col span="24">
                    <Poptip trigger="hover" title="异常描述" :content="item.ExceptionsDescribe">
                        <key-value-item :data="{label: '异常描述', value: item.ExceptionsDescribe}"></key-value-item>
                    </Poptip>
                </Col>
            </Row>
        </div>
    </div>
</div>
</template>
<script>
export default {
    name: 'ExceptionItem',
    props: {
        item: {
            type: Object,
            default: () => {}
        },
        vertical: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        getPanelClass() {
            return `panel ${this.vertical ? 'panel-vertical' : ''}`;
        },
        getCarouselArrow(value) {
            return value && value.length > 1
                ? 'hover' : 'never';
        }, 
        getPollingSonItem(value) {
            return value && value.split('|') || [];
        },
        getTagColor(index) {
            let colors = ['blue', 'yellow', 'red', 'green'];
            return colors[index % 4];
        },
        getStateClasses(state) {
            let stateColors = {
                '-1': 'primary',
                '100': 'warning',
                '200': 'success'
            };
            return this.model.State === state ? stateColors[state] : 'ghost';
        }
    }
}
</script>