<style lang="sass" scoped>
    $black: rgba(0, 0, 0, 0.6);
    $white: #fff;
    $gray: #ccc;
    $panel-item-width: 200px;
    $panel-item-content-width: 120px;
    $panel-min-height: 235px;
    $panel-min-width: 300px;

    .panel {
        display: flex;
        min-height: $panel-min-height; 
        min-width: $panel-min-width;
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
                background-size: cover;
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
            z-index: 100;
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
                <Tag :color="getStateClasses(item.State)">{{getStateName(item.State)}}</Tag>
            </div>
            <Carousel :arrow="getCarouselArrow(item.ReportFileList)">
                <CarouselItem v-for="(img, idx) in item.ReportFileList" :key="idx">
                    <span class="img-carousel" :style="'background-image:url(' + img.FileUrl + ');'"></span>
                </CarouselItem>
            </Carousel>
        </div>

        <div class="panel-wrap">
            <div class="panel-head">
                <h3>{{item.MainInspectionItemName}}</h3>
                <h4 class="timer">
                    <Icon type="clock" />
                    <span>{{item.CreateTime}}</span>
                </h4>
                <slot name="tools"></slot>
            </div>
            <div class="panel-content">
                <Row type="flex" v-if="showDescribe">
                    <Col span="24" class="panel-content-tags">
                        <Tag type="dot" :color="getTagColor(pkey)" :key="pkey" v-for="(pitem, pkey) in getPollingSonItem(item.SonInspectionName)">{{pitem}}</Tag>
                    </Col>
                    <Col span="24">
                        <key-value-item :data="{label: '上报人', value: item.PeopleName}"></key-value-item>
                    </Col>
                    <Col span="24">
                        <key-value-item :data="{label: '所属河段', value: item.ObjectName}"></key-value-item>
                    </Col>
                    <Col span="24">
                        <key-value-item :data="{label: '行政区划', value: item.FullAddress}"></key-value-item>
                    </Col>
                    <Col span="24">
                        <Poptip trigger="hover" title="异常描述" :content="item.Description">
                            <key-value-item :data="{label: '异常描述', value: item.Description}"></key-value-item>
                        </Poptip>
                    </Col>
                </Row>
                <custom-scrollbar v-show="!showDescribe" :height="height" fixed>
                    <Row type="flex">
                        <Col span="24" class="panel-content-tags">
                            <Tag type="dot" :color="getTagColor(pkey)" :key="pkey" v-for="(pitem, pkey) in getPollingSonItem(item.SonInspectionName)">{{pitem}}</Tag>
                        </Col>
                        <Col span="24">
                            <key-value-item :data="{label: '上报人', value: item.PeopleName}"></key-value-item>
                        </Col>
                        <Col span="24">
                            <key-value-item :data="{label: '所属河段', value: item.ObjectName}"></key-value-item>
                        </Col>
                        <Col span="24">
                            <key-value-item :data="{label: '行政区划', value: item.FullAddress}"></key-value-item>
                        </Col>
                        <Col span="24">
                            <key-value-item :data="{label: '异常描述', overflow: 'show', value: item.Description}"></key-value-item>
                        </Col>
                        <Col span="24">
                            <key-value-item :data="{label: '详细地址', overflow: 'show', value: item.Address && item.Address.length > 15 ? item.Address : item.FullAddress}"></key-value-item>
                        </Col>
                    </Row>
                </custom-scrollbar>
            </div>
        </div>
    </div>
</template>
<script>
import CustomScrollbar from "../shared/CustomScrollbar";

export default {
    name: 'ExceptionItem',
    components: {
        CustomScrollbar
    },
    props: {
        item: {
            type: Object,
            default: () => { }
        },
        vertical: {
            type: Boolean,
            default: false
        },
        showDescribe: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            height: 180
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
        getStateName(value) {
            const states = {
                '1': '正常',
                '2': '未解决',
                '3': '已解决'
            };
            return value != null ? states[value] : states[0];
        },
        getStateClasses(value) {
            const states = {
                '1': 'primary',
                '2': 'red',
                '3': 'green'
            };
            return value != null ? states[value] : states[0];
        }
    }
}
</script>