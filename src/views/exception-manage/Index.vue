<style lang="sass" scoped>
    $em-index-padding: 20px;

    $white: #fff;
    $gray: #ccc;

    .em-index {
        .em-index-head, .em-index-search, .em-index-body {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
        }
        .em-index-head {
            justify-content: space-between;
            position: relative;
            padding: 5px 0;
            &::after {
                position: absolute;
                bottom: 0;
                display: block;
                content: "";
                width: 100%;
                height: 1px;
                background-color: $gray;
            }
            .title>.ivu-badge {
                margin-right: 15px;
            }
        }

        .em-index-search {
            justify-content: space-between;
            padding: 15px 0;
        }
        .em-index-body {
            justify-content: flex-start;
        }

        .condition {
            .input-md:not(:first-child), .input-lg:not(:first-child) {
                margin-left: 15px;
            }
        }
    }

    // $black: rgba(0, 0, 0, 0.6);
    // $white: #fff;
    // $gray: #ccc;
    // $panel-item-width: 200px;
    // $panel-item-content-width: 120px;
    // $panel-min-height: 185px;

    // .panel {
    //     display: flex;
    //     min-height: $panel-min-height; 
    //     background-color: $white;
    //     border: 1px solid $gray;
    //     border-radius: 5px;
    //     margin: 10px 0;
    //     &:hover {
    //         cursor: pointer;
    //         box-shadow: 0 0 2px rgba($gray, .7),
    //                     0 0 3px rgba($gray, .5);
    //     }
    //     .panel-tag {
    //         position: absolute;
    //         z-index: 2;
    //         .ivu-tag {
    //             margin: 15px 0;
    //             border-radius: 0;
    //         }
    //     }
    //     .panel-carousel {
    //         width: 40%;
    //         height: $panel-min-height;
    //         .ivu-carousel {
    //             height: $panel-min-height;
    //         }
    //         .img-carousel {
    //             display: inline-block;
    //             width: 100%;
    //             height: $panel-min-height;
    //             line-height: $panel-min-height;
    //             vertical-align: top;
    //             // float: right;
    //             // margin: 0 8px;
    //             overflow: hidden;
    //             background-color: rgba($gray, .3);
    //             background-size: 100% 100%;
    //             background-repeat: no-repeat;
    //             background-position: center center;
    //         }
    //     }
    //     .panel-wrap {
    //         padding: 10px 0 10px 10px;
    //         width: 60%;
    //         display: flex;
    //         flex-direction: column;
    //         flex-wrap: wrap;
    //         align-items: center;
    //         justify-content: flex-start;
    //     }
    //     .panel-head {
    //         height: 40px;
    //         line-height: 40px;
    //         width: 100%;
    //         position: relative;
    //         display: flex;
    //         flex-direction: row;
    //         flex-wrap: wrap;
    //         align-items: flex-start;
    //         justify-content: space-between;
    //         &::before {
    //             position: absolute;
    //             display: block;
    //             content: "";
    //             left: 0;
    //             bottom: 0;
    //             width: 100%;
    //             height: 1px;
    //             background-color: $gray;
    //         }
    //         .timer>.ivu-icon {
    //             margin-right: 5px;
    //         }
    //         .ivu-tooltip {
    //             margin-right: 5px;
    //         }
    //     }
    //     .panel-body {
    //         padding: 10px;
    //     }
    //     .panel-content-tags {
    //         .ivu-tag {
    //             height: auto;
    //             line-height: 1;
    //             padding: 3px;
    //         }
    //     }
    // }

</style>

<template>
    <div class="em-index">
        
        <div class="em-index-head">
            <div class="title">
                <Badge :count="result && (result.UnSolveCount + result.SolveCount)">
                    <Button class="button-md" :type="getStateClasses(-1)" @click="filterState(-1)">全部问题</Button>
                </Badge>
                <Badge :count="result && result.SolveCount">
                    <Button class="button-md" :type="getStateClasses(200)" @click="filterState(200)">已解决问题</Button>
                </Badge>
                <Badge :count="result && result.UnSolveCount">
                    <Button class="button-md" :type="getStateClasses(100)" @click="filterState(100)">未解决问题</Button>
                </Badge>
            </div>
            <div class="tools">
                <Button class="button-md" type="ghost" :loading="addLoading" icon="ios-plus-empty" @click="createException()">
                    <span v-if="!addLoading">创建问题</span>
                    <span v-else>创建中...</span>
                </Button>
            </div>
        </div>
        <div class="em-index-search">
            <div class="condition">
                <Input v-model="peopleName" @on-enter="getExceptions()" icon="ios-search-outline" placeholder="上报人姓名" class="input-md"></Input>
                <Select placeholder="选择河流" class="input-md">
                    <Option value="beijing">北京市</Option>
                    <Option value="shanghai" disabled>上海市</Option>
                    <Option value="shenzhen">深圳市</Option>
                </Select>
                <Select placeholder="选择行政区划" class="input-md">
                    <Option value="beijing">北京市</Option>
                    <Option value="shanghai" disabled>上海市</Option>
                    <Option value="shenzhen">深圳市</Option>
                </Select>
                <DatePicker format="yyyy年MM月dd日" type="daterange" placeholder="选择日期" class="input-lg">
                </DatePicker>
            </div>
            <div class="tools">
                <Button class="button-md" type="primary" :loading="loading" icon="ios-search" @click="getExceptions()">
                    <span v-if="!loading">查询</span>
                    <span v-else>查询中...</span>
                </Button>
            </div>
        </div>
        <Row :gutter="20" class="em-index-body">
            <empty v-if="!datas || !datas.length" content="没有异常列表数据!" />

            <Col span="8" v-for="(item, index) in datas" :key="index">
                <exception-item :item="item">
                    <Tooltip slot="tools" content="查看详情" placement="left" :disabled="mapDetailTootipDisabled">
                        <Button type="ghost" shape="circle" icon="map" @click="mapDetail(item)"></Button>
                    </Tooltip>
                </exception-item>
            </Col>
        </Row>
    </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import ExceptionItem from './ExceptionItem';

export default {
    name: 'ExceptionList',
    components: {
        ExceptionItem
    },
    computed: {
        ...mapGetters('exception', ['result', 'error']),
        ...mapState('exception', ['model']),
        peopleName: {
            get() {
                return this.model.PeopleName;
            },
            set(value) {
                this.$store.commit('exception/UPDATE_PEOPLE_NAME', value)
            }
        },
    },
    mounted() {
        this.getExceptions();
    },
    data() {
        return {
            mapDetailTootipDisabled: false,
            loading: false,
            addLoading: false,
            datas: []
        }
    },
    methods: {
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
        },
        createException() {
        },
        filterState(exState) {
            this.loading = true;
            let { commit } = this.$store;
            commit('exception/EXCEPTION_FILTER_STATE', exState);
            this.getExceptions();
        },
        getExceptions() {
            let { dispatch, commit, state } = this.$store;
            let { route, exception: { model } } = state;
            this.loading = true;
            dispatch('exception/getExceptions', {
                params: model,
                $Message: this.$Message,
                $router: this.$router,
                route: route
            }).then(() => {
                this.loading = false;
                this.datas = this.result.PageData;
            });
        },
        mapDetail(item) {
            this.mapDetailTootipDisabled = true;
            this.$router.push({ 
                path: '/exceptionmanage/mapdetail', 
                query: { id: item.Id, lat: item.Lat, lng: item.Lng }
            });
        }
    }
}
</script>