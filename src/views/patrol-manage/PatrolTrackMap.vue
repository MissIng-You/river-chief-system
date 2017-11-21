<style scope lang="sass">
    #container {
        width: 100%;
        height: 480px;
        overflow: hidden;
    }
</style>

<template>
    <div id="container">
    </div>
</template>

<script type="text/babel">
import { mapGetters, mapState } from "vuex";
import { loadAMapAsync, loadAMapUIAsync } from '../../util/script';

export default {
    name: 'PatrolTrackMap',
    computed: {
        ...mapState("patrol", ["patrolModel"]),

        ...mapGetters("patrol", [
            "trackResult",
            "trackError",
        ]),
    },
    props: {
        data: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            map: null,
            loading: false,
            tracks: [],
        }
    },
    beforeCreate() {
        // 异步加载地图
        loadAMapAsync();
        loadAMapUIAsync();
    },
    updated(){
        let that = this;
        window.setTimeout(() => {
            // 初始化地图
            that.init(that.getPatrolTrack);
        }, 1000);
    },
    mounted() {
        let that = this;
        window.setTimeout(() => {
            // 初始化地图
            that.init(that.getPatrolTrack);
        }, 1000);
    },
    methods: {
        init: function(callback) {
            let map = new AMap.Map('container', {
                center: [121.52710487067272, 31.22889232359548],
                resizeEnable: false,
                zoom: 14
            })
            /*       var icon = new AMap.Icon({
             image: 'http://vdata.amap.com/icons/b18/1/2.png',
             size: new AMap.Size(24, 24)
             }) */
            AMap.plugin(['AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.ToolBar'],
                function() {
                    let geolocation = new AMap.Geolocation({
                        enableHighAccuracy: true,//是否使用高精度定位，默认:true
                        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                        buttonOffset: new AMap.Pixel(15, 130),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                        zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                        buttonPosition: 'RB'
                    });
                    map.addControl(geolocation);
                    geolocation.getCurrentPosition();
                    AMap.event.addListener(geolocation, 'complete', (result) => {
                        console.log(result);
                        // that.currentPosition = result.position;
                        callback && callback.call(null, result);
                    });     //返回定位信息
                    AMap.event.addListener(geolocation, 'error', (error) => {
                        console.log(error);
                    });      //返回定位出错信息
                });

            this.map = map;
        },

        // 获取巡检轨迹
        getPatrolTrack() {
            let patrolRecordId = this.data && this.data.Id;

            let { dispatch, commit, state } = this.$store;
            let { route } = state;
            this.loading = true;
            dispatch("patrol/getPatrolTrack", {
                params: patrolRecordId,
                $Message: this.$Message,
                $router: this.$router,
                route: route
            }).then(() => {
                this.loading = false;

                this.tracks = this.trackResult.Data || [];

                this.tracks.length && this.drawPathSimplifier(this.map, this.tracks);
            });
        },

        getPositionOfAmap(map, callback) {
            // 调用浏览器定位服务
            let that = this;
            map && map.plugin('AMap.Geolocation', function () {
                let geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,//是否使用高精度定位，默认:true
                    timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                    buttonOffset: new AMap.Pixel(15, 130),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    buttonPosition: 'RB'
                });
                map.addControl(that.geolocation);
                geolocation.getCurrentPosition();
                AMap.event.addListener(that.geolocation, 'complete', (result) => {
                    console.log(result);
                    that.currentPosition = result.position;
                    callback && callback.call(that, result);
                });     //返回定位信息
                AMap.event.addListener(that.geolocation, 'error', (error) => {
                    console.log(error);
                });      //返回定位出错信息
            });
        },

        drawPathSimplifier(map, paths) {
            let that = this;
            console.log(that);
            AMapUI.load(['ui/misc/PathSimplifier'], function (PathSimplifier) {

            if (!PathSimplifier.supportCanvas) {
                alert('当前环境不支持 Canvas！');
                return;
            }

            var pathSimplifierIns = new PathSimplifier({
                zIndex: 100,
                //autoSetFitView:false,
                map: map, //所属的地图实例

                getPath: function (pathData) {
                    return pathData.path;
                },
                getHoverTitle: function (pathData, pointIndex) {
                if (pointIndex >= 0) {
                    //point
                    return pathData.name + '，点：' + pointIndex + '/' + pathData.path.length;
                }

                return pathData.name + '，点数量' + pathData.path.length;
                },
                renderOptions: {
                renderAllPointsIfNumberBelow: 100 //绘制路线节点，如不需要可设置为-1
                }
            });

            //设置数据
            pathSimplifierIns.setData([{
                name: '巡查轨迹',
                path: paths && paths.map((item) => [item.Lng, item.Lat]) ||
                [that.currentPosition.lng, that.currentPosition.lat]
            }]);

            //对第一条线路（即索引 0）创建一个巡航器
            var navg = pathSimplifierIns.createPathNavigator(0, {
                loop: false, //循环播放
                speed: 10, //巡航速度，单位千米/小时
                // pathNavigatorStyle: {
                //   autoRotate: false, //禁止调整方向
                //   pathLinePassedStyle: null,
                //   width: 36,
                //   height: 36,
                //   content: PathSimplifier.Render.Canvas.getImageContent('./assets/img/logo.png', () => {
                //     pathSimplifierIns.renderLater();
                //   }, (error: any) => {
                //     console.log(error);
                //   }),
                //   strokeStyle: null,
                //   fillStyle: null
                // }
            });
            navg.start();
            });
        }
    }
}
</script>
