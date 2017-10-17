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
            padding-right: 20px;
        }

        .condition {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: flex-start;

            .input-md:not(:first-child), .input-lg:not(:first-child) {
                margin-left: 15px;
            }
        }

        .scrollbar {
            width: 100%;
            height: 460px;
        }
    }
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
        <ScrollBar ref="scrollbar" :styles="scrollbarSetting">
            <div class="em-index-body" style="height: 600px;">
                <Row :gutter="20">
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
        </ScrollBar>
        
        
    </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import ExceptionItem from './ExceptionItem';
import { getDocumentHeight } from '../../util';

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
    beforeMount() {
        this.getExceptions();
    },
    mounted() {
        let scrollbarTop = this.$refs.scrollbar.$el.getClientRects()[0].top;
        let docHeight = getDocumentHeight();
        this.scrollbarSetting.height = `${docHeight - scrollbarTop - 20}px`;
    },
    data() {
        return {
            scrollbarSetting: {
                width: '100%',
                height: '400px'
            },
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