<style scope lang="sass">
    $white: #fff;
    $map-sidebar-width: 350px;

    .map-detail {
        position: relative;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: space-between;
        .map-detail-sidebar {
            position: absolute;
            z-index: 2;
            width: $map-sidebar-width;
            .tools>.ivu-btn {
                background-color: $white;
            }
        }

        .map-detail-list {
            position: absolute;
            z-index: 2;
            width: $map-sidebar-width;
            top: 0;
            right: 0;
            background-color: $white;
        }
    }

    #container {
        width: 100%;
        height: 680px;
        overflow: hidden;
    }

    #exceptionsList {
        padding: 0;
        margin: 0;
        list-style: none;
        .poibox {
            border-bottom: 1px solid #eaeaea;
            border-left: 2px solid rgba(0,0,0,0);
            padding: 10px 3px;
            cursor: pointer;
            &.selected {
                border-left-color: #f00;
                background: #f6f6f6;
            }
            .poi-img {
                width: 100px;
                height: 74px;
                vertical-align: top;
                float: right;
                margin: 0 8px;
                overflow: hidden;
                background-color: #ccc;
                background-size: 100% 100%;
                background-repeat: no-repeat;
                background-position: center center;
            }
            .poi-info-left {
                padding-left: 8px;
            }
            .clear {
                clear: both;
            }
            
        }
    }
</style>

<template>
    <div class="map-detail">
        <div class="map-detail-sidebar">
            <div class="tools">
                <Button type="ghost" icon="arrow-left-a" @click="goBack()" class="button-md">返回</Button>
            </div>
            <exception-item :item="item" :vertical="true">
                <Button slot="tools" type="primary" icon="search" @click="resolveException(item)">解决问题</Button>
            </exception-item>
        </div>
        <div id="container">
        </div>
        <div class="map-detail-list">
            <div id="exceptionsList"></div>
        </div>
        <exception-solve :show="showSolveException" @on-cancel="cancelException()"></exception-solve>
    </div>
</template>

<script type="text/babel">
import { mapGetters, mapActions, mapState } from 'vuex';
import { loadAMapAsync, loadAMapUIAsync } from './../../util/script';
import ExceptionItem from './ExceptionItem';
import ExceptionSolve from './ExceptionSolve';

function createMarkerList(id, map, datas) {
    AMapUI.loadUI(['misc/MarkerList', 'overlay/SimpleMarker', 'overlay/SimpleInfoWindow'],
        function(MarkerList, SimpleMarker, SimpleInfoWindow) {

            //即jQuery/Zepto
            var $ = MarkerList.utils.$;

            var defaultIconStyle = 'red', //默认的图标样式
                hoverIconStyle = 'green', //鼠标hover时的样式
                selectedIconStyle = 'purple' //选中时的图标样式
                ;

            var markerList = new MarkerList({
                map: map,
                //ListElement对应的父节点或者ID
                listContainer: "exceptionsList", //document.getElementById("myList"),
                //选中后显示

                //从数据中读取位置, 返回lngLat
                getPosition: function(item) {
                    return [item.Lng, item.Lat];
                },
                //数据ID，如果不提供，默认使用数组索引，即index
                getDataId: function(item, index) {
                    return item.Id || index;
                },
                getInfoWindow: function(data, context, recycledInfoWindow) {

                    if (recycledInfoWindow) {

                        recycledInfoWindow.setInfoTitle(data.ReachName);
                        recycledInfoWindow.setInfoBody(data.FullAddress);

                        return recycledInfoWindow;
                    }

                    return new SimpleInfoWindow({
                        infoTitle: data.ReachName,
                        infoBody: data.FullAddress,
                        offset: new AMap.Pixel(0, -37)
                    });
                },
                //构造marker用的options对象, content和title支持模板，也可以是函数，返回marker实例，或者返回options对象
                getMarker: function(data, context, recycledMarker) {

                    var label = String.fromCharCode('A'.charCodeAt(0) + context.index);

                    if (recycledMarker) {
                        recycledMarker.setIconLabel(label);
                        return;
                    }

                    return new SimpleMarker({
                        containerClassNames: 'my-marker',
                        iconStyle: defaultIconStyle,
                        iconLabel: label
                    });
                },
                //构造列表元素，与getMarker类似，可以是函数，返回一个dom元素，或者模板 html string
                getListElement: function(data, context, recycledListElement) {

                    // var label = String.fromCharCode('A'.charCodeAt(0) + context.index);

                    // //使用模板创建
                    // var innerHTML = MarkerList.utils.template('<div class="poi-imgbox">' +
                    //     '    <span class="poi-img" style="background-image:url(<%- data.ImgUrlList && data.ImgUrlList[0] %>)"></span>' +
                    //     '</div>' +
                    //     '<div class="poi-info-left">' +
                    //     '    <h3 class="poi-title">' +
                    //     '        <%- label %>. <%- data.ReachName %>' +
                    //     '    </h3>' +
                    //     '    <div class="poi-info">' +
                    //     '        <span class="poi-price">' +
                    //     '            <%= data.PollingMainItem %>' +
                    //     '        </span>' +
                    //     '        <p class="poi-addr"><%- data.FullAddress %></p>' +
                    //     '    </div>' +
                    //     '</div>' +
                    //     '<div class="clear"></div>', {
                    //         data: data,
                    //         label: label
                    //     });

                    // if (recycledListElement) {
                    //     recycledListElement.innerHTML = innerHTML;
                    //     return recycledListElement;
                    // }

                    // return '<li class="poibox">' +
                    //     innerHTML +
                    //     '</li>';
                    return '';
                },
                //列表节点上监听的事件
                listElementEvents: ['click', 'mouseenter', 'mouseleave'],
                //marker上监听的事件
                markerEvents: ['click', 'mouseover', 'mouseout'],
                //makeSelectedEvents:false,
                selectedClassNames: 'selected',
                autoSetFitView: true
            });

            window.markerList = markerList;

            markerList.on('selectedChanged', function(event, info) {

                checkBtnStats();

                if (info.selected) {

                    console.log(info);

                    if (info.selected.marker) {
                        //更新为选中样式
                        info.selected.marker.setIconStyle(selectedIconStyle);
                    }

                    //选中并非由列表节点上的事件触发，将关联的列表节点移动到视野内
                    if (!info.sourceEventInfo.isListElementEvent) {

                        if (info.selected.listElement) {
                            scrollListElementIntoView($(info.selected.listElement));
                        }
                    }
                }

                if (info.unSelected && info.unSelected.marker) {
                    //更新为默认样式
                    info.unSelected.marker.setIconStyle(defaultIconStyle);
                }
            });

            markerList.on('listElementMouseenter markerMouseover', function(event, record) {

                if (record && record.marker) {

                    forcusMarker(record.marker);

                    //this.openInfoWindowOnRecord(record);

                    //非选中的id
                    if (!this.isSelectedDataId(record.id)) {
                        //设置为hover样式
                        record.marker.setIconStyle(hoverIconStyle);
                        //this.closeInfoWindow();
                    }
                }
            });

            markerList.on('listElementMouseleave markerMouseout', function(event, record) {

                if (record && record.marker) {

                    if (!this.isSelectedDataId(record.id)) {
                        //恢复默认样式
                        record.marker.setIconStyle(defaultIconStyle);
                    }
                }
            });

            //数据输出完成
            markerList.on('renderComplete', function(event, records) {

                checkBtnStats();
            });

            // markerList.on('*', function(type, event, res) {
            //     console.log(type, event, res);
            // });

            //渲染数据
            markerList.render(datas);

            var $btns = $('#btnList input[data-path]');

            /**
             * 检测各个button的状态
             */
            function checkBtnStats() {
                $('#btnList input[data-enable]').each(function() {

                    var $input = $(this),
                        codeEval = $input.attr('data-enable');

                    $input.prop({
                        disabled: !eval(codeEval)
                    });
                });
            }

            $('#btnList').on('click', 'input', function() {

                var $input = $(this),
                    dataPath = $input.attr('data-path'),
                    codeEval = $input.attr('data-eval');

                if (dataPath) {
                    loadData(dataPath);
                } else if (codeEval) {
                    eval(codeEval);
                }

                checkBtnStats();
            });

            function forcusMarker(marker) {
                marker.setTop(true);

                //不在地图视野内
                if (!(map.getBounds().contains(marker.getPosition()))) {

                    //移动到中心
                    map.setCenter(marker.getPosition());
                }
            }

            function isElementInViewport(el) {
                var rect = el.getBoundingClientRect();

                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
                );
            }

            function scrollListElementIntoView($listEle) {

                if (!isElementInViewport($listEle.get(0))) {
                    $('#panel').scrollTop($listEle.offset().top - $listEle.parent().offset().top);
                }

                //闪动一下
                $listEle
                    .one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
                    function(e) {
                        $(this).removeClass('flash animated');
                    }).addClass('flash animated');
            }

            // 选中当前项
            markerList.selectByDataId(id);
            // 设置当前地图显示级别
            map.setZoom(18);

            return markerList;
        });
}

export default {
    name: 'MapDetail',
    components: {
        ExceptionItem,
        ExceptionSolve
    },
    computed: {
        ...mapGetters('exception', {
            result: 'result',
            detailResult: 'detailResult',
            detailError: 'detailError'
        }),
        ...mapState('exception', ['solveModel']),
        solveExplain: {
            get() {
                return this.solveModel.SolveExplain;
            },
            set(value) {
                this.$store.commit('exception/UPDATE_SOLVE_EXPLAIN', value)
            }
        },
    },
    beforeCreate() {
        // 异步加载地图
        loadAMapAsync();
        loadAMapUIAsync();
    },
    mounted() {
        let that = this;
        window.setTimeout(() => {
            // 初始化地图
            that.initAMap();
        }, 1000);

        this.getDetails();
    },
    data() {
        return {
            showSolveException: false,
            loading: false,
            item: {},
            map: null
        }
    },
    methods: {
        getPollingSonItem(value) {
            return value && value.split('|') || [];
        },
        getTagColor(index) {
            let colors = ['blue', 'yellow', 'red', 'green'];
            return colors[index % 4];
        },
        initAMap: function() {
            let { query: {id, lat, lng } } = this.$store.state.route;
            let center = [lng || 121.52710487067272, lat || 31.22889232359548];
            let map = new AMap.Map('container', {
                center: center,
                resizeEnable: true,
                zoom:14,
            });
            /*       var icon = new AMap.Icon({
             image: 'http://vdata.amap.com/icons/b18/1/2.png',
             size: new AMap.Size(24, 24)
             }) */
            AMap.plugin(['AMap.Geolocation', 'AMap.ToolBar'],
                function() {
                    map.addControl(new AMap.ToolBar({
                        offset: new AMap.Pixel(10, 10),
                        position: 'RT'
                    }))
                });

            // 获取异常列表项
            this.getExceptions(id, map);
        },
        goBack() {
            this.$router.go(-1);
        },
        cancelException(show) {
            this.showSolveException = show ? show : false;
        },
        resolveException(show) {
            this.showSolveException = !this.showSolveException;
        },
        getExceptions(id, map) {
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
                createMarkerList(id, map, this.datas);
            });
        },
        getDetails() {
            let { dispatch, commit, state } = this.$store;
            let { route: { query } } = state;
            this.loading = true;
            dispatch('exception/getDetails', {
                params: query.id,
                $Message: this.$Message,
                $router: this.$router,
                route: state.route
            }).then(() => {
                this.loading = false;
                this.item = this.detailResult.Data;
            });
        }
    }
}
</script>
