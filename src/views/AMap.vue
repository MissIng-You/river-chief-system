<style scope lang="sass">
    #container {
        width: 100%;
        // height: 560px;
        overflow: hidden;
    }
</style>

<template>
    <div id="container">
    </div>
</template>

<script type="text/babel">
import { loadAMapAsync } from '../util/script';
import { getDocumentHeight } from '../util/index';

export default {
    beforeCreate() {
        // 异步加载地图
        loadAMapAsync();
    },
    mounted() {
        let that = this;
        window.setTimeout(() => {
            // 初始化地图
            that.init();
        }, 1000);
        var $container = document.getElementById('container');

        let scrollbarRect = $container.getClientRects()
        let scrollbarTop = scrollbarRect && scrollbarRect[0] && scrollbarRect[0].top;
        let docHeight = getDocumentHeight();
        $container.style.height = `${docHeight - scrollbarTop - 20}px`;
    },
    methods: {
        init: function() {
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
                    map.addControl(new AMap.ToolBar())
                })
        },
    }
}
</script>
