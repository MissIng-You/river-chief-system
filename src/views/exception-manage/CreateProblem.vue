<style lang="sass" scoped>
    .vertical-model {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .problem-modal {
        .problem-title {
            padding-bottom: 14px;
            border-bottom: 1px solid lightgray;
        }

        

        .required:after {
            content:'*';
            display: inline-block;
            color: red;
            font-size: 12px;
        }

        .required {
            color: gray;
            padding: 10px 0 10px 0;
            font-weight: normal;
        }

        .scroll-bar {
            height: 200px;
        }

        .add-images {
            width: 35px;
            height: 35px;
            border: 1px solid lightgray;
            border-radius: 3px;
            font-size: 25px;
            text-align: center;
            color: lightgray;
        }
        .address-detail {
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            color: #2d8cf0;
            i {
                font-size: 14px;
                color: #2d8cf0;
                margin-left: 15px;
                margin-right: 5px;
            }
        }
        .poll-term {
            margin-bottom: 10px;
        }
    }    

    .select-address {
        #container {
            width: 100%;
            height: 500px;
            font-size: 15px;
            position: relative;

            #address {
                position: absolute;
                top: 0;
                right: 0;
                z-index: 100;
                width: 30%;
            }
        } 
    }

</style>

<template>
    <div class="create-problem">
        <Modal class-name="vertical-model" :value="show" width="440" :closable="false" :mask-closable="false" class="problem-modal" @on-ok="addException()" @on-cancel="cancelAdd()">
            <Form>
                <div class="problem-title">
                    <h3>创建问题</h3>
                </div>
                <custom-scrollbar :height="400" fixed>
                    <div class="cp-body">
                        <div>
                            <h6 class="required">问题描述</h6>
                            <Input v-model="addModel.Description" type="textarea" :rows="4" placeholder="请输入内容" style="resize :none" class="problem-describe"></Input>
                        </div>
                        <div>
                            <Row>
                                <Col span="12">
                                <h6 class="required">行政区划</h6>
                                <Cascader style="width: 160px" :change-on-select="true" :data="childAreaDatas" placeholder="选择地区" :load-data="loadData" :value="selectAreaCodes" @on-change="selectArea($event)"></Cascader>
                                </Col>
                                <Col span="12">
                                <h6 class="required">河流</h6>
                                <Select placeholder="选择河流" style="width: 160px" :clearable="true" v-model="patrolRiver" @on-change="selectRiver($event)">
                                    <Option v-for="(river, index) in riverDatas" :key="index" :value="river.Id">{{river.RiverName}}</Option>
                                </Select>
                                </Col>
                            </Row>
                        </div>
                        <div>
                            <h6 class="required">选择河段</h6>
                            <Select placeholder="选择河段" v-model="addModel.ReachId" style="width: 160px" :clearable="true" @on-change="selectReach($event)">
                                <Option v-for="(reach, index) in reachDatas" :key="index" :value="reach.Id">{{reach.ReachName}}</Option>
                            </Select>
                        </div>
                        <div class="address-detail">
                            <h6 class="required">选择详细地址</h6>
                            <Button type="primary" @click="openMap()">地图选取</Button>
                            <Icon type="location"></Icon>
                            <span class="formatted-address">{{addModel.Address}}</span>
                        </div>
                        <div>
                            <h6 class="required">问题分类</h6>
                            <RadioGroup v-model="pollingItem" @on-change="selectPollingItem($event)" class="poll-term">
                                <Radio v-for="(term, index) in pollingItemDatas" :key="term.Id" :label="term.ItemName"></Radio>
                            </RadioGroup>
                            <CheckboxGroup v-model="pollingSonItem" v-for="(item, index) in pollingItemDatas" :key="item.Id" v-if="pollingItem == item.ItemName" @on-change="selectSonItem($event)">
                                <Checkbox v-for="childTerm in item.SonInspectionItemList" :key="childTerm.Id" :label="childTerm.ItemName"></Checkbox>
                            </CheckboxGroup>
                        </div>
                        <div>
                            <h6 class="required">问题图片</h6>
                            <upload-list :default-list="uploadList" @on-upload="handleUpload"></upload-list>
                        </div>
                    </div>
                </custom-scrollbar>
            </Form>
        </Modal>

        <Modal v-model="selectAddress" width="1000" :closable="false" class="select-address" :styles="{top: '20px'}" @on-ok="getAddress()">
            <div id="container">
                <input id='address' readonly="true" type="text">
            </div>
        </Modal>
    </div>
</template>
<script type="text/babel">
import { mapGetters, mapState } from 'vuex';
import { loadAMapAsync } from './../../util/script';
import UploadList from './UploadList';
import CustomScrollbar from '../shared/CustomScrollbar';

export default {
    name: 'CreateProblem',
    components: {
        UploadList,
        CustomScrollbar,
    },
    props: {
        show: {
            type: Boolean,
            defalut: false
        }
    },
    data() {
        return {
            loading: false,
            selectAddress: false,
            loadMap: true,

            childAreaDatas: [],
            riverDatas: [],
            reachDatas: [],
            pollingItemDatas: [],
            riverAreaCode: '',
            riverId: '',
            patrolRiver: '',
            // 行政区划编码
            areaCode: '',
            selectAreaCodes: [],

            addModel: {         // 新增模型
                ReachId: '',
                InspectionRecordId: '0',
                ObjectId: '0',
                Address: '',
                Description: '',
                ReportType: 2,
                Lng: '',
                Lat: '',
                MainInspectionItemName: '',
                SonInspectionName: '',
                ReportFileList: []
            },

            isShowModel: false,

            pollingItem: '',
            pollingTerm: '',
            pollingSonItem: [],

            currtenPositonLng: '',
            currtenPositonLat: '',

            uploadList: [],

            scrollbarSetting: {
                width: '100%',
                height: '400px'
            },
        }
    },
    computed: {
        ...mapGetters('exception', {
            result: 'result',
            riverResult: 'riverResult',
            riverError: 'riverError',
            reachResult: 'reachResult',
            reachError: 'reachError',
            childAreaResult: 'childAreaResult',
            childAreaError: 'childAreaError',
            pollingItemResult: 'pollingItemResult',
            pollingItemError: 'pollingItemError'
        }),
        ...mapState('exception', {
            model: 'model',
            parentAreaModel: 'parentAreaModel',
            riverModel: 'riverModel',
            reachModel: 'reachModel',
            pollingItemModel: 'pollingItemModel'
        }),
        peopleName: {
            get() {
                return this.model.PeopleName;
            },
            set(value) {
                this.$store.commit('exception/UPDATE_PEOPLE_NAME', value)
            }
        },
    },
    beforeCreate() {
        // 异步加载地图
        loadAMapAsync();
    },
    beforeMount() {
        this.getChildArea(null, (areaDatas) => {
            this.childAreaDatas = areaDatas;
        });
    },
    methods: {
        // 处理文件上传
        handleUpload(response, file, files) {
            console.log('response: %o, files: %o', response, files);
            let uploadFiles = files.map(item => {
                return {
                    FileUrl: item.name,
                    FileType: 0
                };
            });

            this.addModel.ReportFileList = uploadFiles;
        },

        openMap() {
            this.selectAddress = true;
            if (this.loadMap == true) {
                this.init();
                this.loadMap = false;
            }
        },

        getAddress() {
            this.addModel.Address = document.getElementById('address').value;
        },

        init: function() {
            let that = this;
            let map = new AMap.Map('container', {
                // center: [104.061296, 30.568571],
                center: [121.52710487067272, 31.22889232359548],
                resizeEnable: true,
                zoom: 20,
                resizeEnable: true,
            })

            /*       var icon = new AMap.Icon({
             image: 'http://vdata.amap.com/icons/b18/1/2.png',
             size: new AMap.Size(24, 24)
             }) */
            AMap.plugin(['AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.ToolBar', 'AMap.Geocoder', 'AMap.Marker'],
                function() {
                    map.addControl(new AMap.ToolBar())

                    var currentLngAndLat = [];
                    let geolocation = new AMap.Geolocation({
                        enableHighAccuracy: true, //  是否使用高精度定位，默认:true
                        timeout: 10000, //  超过10秒后停止定位，默认：无穷大
                        maximumAge: 0, // 定位结果缓存0毫秒，默认：0
                        convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                        showButton: true, //  显示定位按钮，默认：true
                        buttonPosition: 'LB',  // 定位按钮停靠位置，默认：'LB'，左下角
                        buttonOffset: new AMap.Pixel(10, 20), //  定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                        showMarker: true, //  定位成功后在定位到的位置显示点标记，默认：true
                        showCircle: true, //  定位成功后用圆圈表示定位精度范围，默认：true
                        panToLocation: true,  //  定位成功后将定位到的位置作为地图中心点，默认：true
                        zoomToAccuracy: true  //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    })
                    map.addControl(geolocation)
                    geolocation.getCurrentPosition()

                    var marker;
                    var promise = new Promise(function(resolve, reject) {
                        AMap.event.addListener(geolocation, 'complete', (result) => {
                            map.setCenter(result.position);
                            console.log(result);
                            currentLngAndLat = [result.position.lng, result.position.lat];
                            document.getElementById('address').value = result.formattedAddress;
                            that.addModel.Lng = result.position.lng;
                            that.addModel.Lat = result.position.lat;
                            resolve();
                        })//  返回定位信息
                        AMap.event.addListener(geolocation, 'error', (result) => {
                            console.log(result)
                        })  //  返回定位出错信息
                    });
                    promise.then(function() {
                        marker = new AMap.Marker({
                            map: map,
                            bubble: true,
                            position: currentLngAndLat
                        });
                    })
                    var geocoder = new AMap.Geocoder({
                        city: "010"//城市，默认：“全国”                        
                    });

                    map.on('click', function(e) {
                        console.log(e);
                        that.addModel.Lng = e.lnglat.lng;
                        that.addModel.Lat = e.lnglat.lat;
                        marker.setPosition(e.lnglat);
                        geocoder.getAddress(e.lnglat, function(status, result) {
                            if (status == 'complete') {
                                document.getElementById('address').value = result.regeocode.formattedAddress
                            }
                            console.log(result);
                        })
                    });
                })
        },

        // 获取行政区划，河流和河段
        getChildArea(areaCode, callback) {
            let { dispatch, commit, state } = this.$store;

            dispatch('exception/getChildArea', {
                params: areaCode || this.parentAreaModel,
                $Message: this.$Message,
                $router: this.$router,
                route: state.route
            }).then(() => {
                let areaData = this.childAreaResult.Data;
                let areaDataMap = areaData && areaData.map(item => {
                    let areaMap = {
                        value: item.AreaCode,
                        label: item.AreaName,
                        disabled: false,
                        children: []
                    };
                    item.AreaLevel < 4 && (areaMap.loading = false);
                    return areaMap;
                });

                callback && callback.call(null, areaDataMap);
            });
        },
        getRiversByArea() {
            let { dispatch, commit, state } = this.$store;
            let { route: { riverModel } } = state;
            this.loading = true;
            dispatch('exception/getRiversByArea', {
                params: this.riverModel,
                $Message: this.$Message,
                $router: this.$router,
                route: state.route
            }).then(() => {
                this.loading = false;
                this.riverDatas = this.riverResult.Data;
            });
        },
        getReach() {
            let { dispatch, commit, state } = this.$store;
            let { route } = state;
            this.loading = true;
            dispatch('exception/getReach', {
                params: this.reachModel,
                $Message: this.$Message,
                $router: this.$router,
                route: state.route
            }).then(() => {
                this.loading = false;
                this.reachDatas = this.reachResult.Data;
            });
        },
        getPolingItem() {
            let { dispatch, commit, state } = this.$store;
            let { route } = state;
            this.loading = true;
            dispatch('exception/getPolingItem', {
                params: this.pollingItemModel,
                $Message: this.$Message,
                $router: this.$router,
                route: state.route
            }).then(() => {
                this.loading = false;
                this.pollingItemDatas = this.pollingItemResult.Data;
            });
        },
        addException() {
            this.addModel.ReachId = '';
            this.addModel.Address = '';
            this.addModel.Description = '';
            this.addModel.Lng = '';
            this.addModel.Lat = '';
            this.addModel.MainInspectionItemName = '';
            this.addModel.SonInspectionName = '';
            this.pollingItem = '';
            this.patrolRiver = '';
            this.pollingSonItem = [];
            this.selectAreaCodes = [];

            this.$emit('on-refresh', false);
            let { dispatch, commit, state } = this.$store;
            let { route } = state;
            this.loading = true;
            dispatch('exception/addException', {
                params: this.addModel,
                $Message: this.$Message,
                $router: this.$router,
                route: state.route
            }).then(() => {
                this.loading = false;

                if(this.reachResult && !this.reachResult.IsError) {
                    this.$emit('on-refresh', false);
                }
            });
        },
        cancelAdd() {
            this.addModel.ReachId = '';
            this.addModel.Address = '';
            this.addModel.Description = '';
            this.addModel.Lng = '';
            this.addModel.Lat = '';
            this.addModel.MainInspectionItemName = '';
            this.addModel.SonInspectionName = '';
            this.pollingItem = '';
            this.patrolRiver = '';
            this.pollingSonItem = [];
            this.selectAreaCodes = [];

            this.$emit('on-cancel',false);
        },
        selectArea(areaCode, selectDatas) {
            this.riverAreaCode = areaCode[areaCode.length - 1];
            let { commit } = this.$store;
            commit('exception/UPDATE_AREA_CODE', this.riverAreaCode);
            this.getRiversByArea();
        },
        selectRiver(riverBaseInfoId) {
            this.loading = true;
            let { commit } = this.$store;
            commit('exception/UPDATE_RIVER_ID', riverBaseInfoId);
            this.riverId = riverBaseInfoId;
            this.getReach();
        },
        selectReach(reachId) {
            this.loading = true;
            let { commit } = this.$store;
            commit('exception/EXCEPTION_REACH_STATE', reachId);
            this.getPolingItem();
        },
        selectPollingItem(pollingItem) {
            this.pollingSonItem = [];
            this.addModel.MainInspectionItemName = pollingItem;
        },
        selectSonItem(pollingSonItem) {
            this.addModel.SonInspectionName = pollingSonItem.join(" | ");
        },
        loadData(item, callback) {
            let that = this;
            item.loading = true;
            setTimeout(() => {
                that.getChildArea(item.value, (areaDatas) => {
                    item.children = areaDatas ? areaDatas : null;
                    item.loading = false;
                    item.disabled = !(areaDatas && areaDatas.length);

                    let { commit } = this.$store;
                    commit('exception/UPDATE_AREA_CODE', item.value);
                    this.getRiversByArea();

                    callback && callback();

                });
            }, 500);
            this.loading = true;
        },

    }
}
</script>