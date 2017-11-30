<style lang="sass" scoped>
    .ivu-vertical-modal {
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
    <div class="em-add">
        <Modal class-name="ivu-vertical-modal" :value="show" width="500" @on-cancel="cancelAdd('formValidate')">
            <div slot="header">
                <h3>创建问题</h3>
            </div>
            <custom-scrollbar :height="300" fixed>
                <Form ref="formValidate" :model="addModel" :rules="addModelRule" :label-width="80">
                    <FormItem label="问题描述" prop="Description">
                        <Input v-model="addModel.Description" placeholder="请输入问题描述（300字）" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                    </FormItem>
                    <FormItem label="行政区划" prop="AreaCode">
                        <Cascader placeholder="行政区划" class="input" :value="areaCodes"
                            :data="rootAreas" :load-data="getChildAreasData"
                            @on-change="filterAreas" :change-on-select="true" :clearable="false">
                        </Cascader>
                    </FormItem>
                    <FormItem label="所属河流" prop="RiverId">
                        <Select placeholder="选择河流" :value="riverId" :clearable="true" @on-change="filterRiver($event)">
                            <Option value="">请选择河流</Option>
                            <Option v-for="(river, index) in riverDatas" :key="index" :value="river.Id">{{river.RiverName}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="关联河段" prop="ReachId">
                        <Select placeholder="选择河段" v-model="addModel.ReachId" :clearable="true" @on-change="filterReach($event)">
                            <Option value="">请选择河段</Option>
                            <Option v-for="(reach, index) in reachDatas" :key="index" :value="reach.Id">{{reach.ReachName}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="详细地址" prop="Address">
                        <Input v-model="addModel.Address" placeholder="请选择详细地址">
                            <Button slot="append" type="primary" icon="location" @click="openMap()">地图选取</Button>
                        </Input>
                    </FormItem>
                    <FormItem v-show="pollingItemDatas && pollingItemDatas.length" label="问题分类" prop="SonInspectionName">
                        <RadioGroup v-model="pollingItem" @on-change="filterPollingItem($event)" class="poll-term">
                            <Radio v-for="(term, index) in pollingItemDatas" :key="term.Id" :label="term.ItemName"></Radio>
                        </RadioGroup>
                        <CheckboxGroup v-model="pollingSonItem" v-for="(item, index) in pollingItemDatas" :key="item.Id" v-if="pollingItem == item.ItemName" @on-change="filterSonItem($event)">
                            <Checkbox v-for="childTerm in item.SonInspectionItemList" :key="childTerm.Id" :label="childTerm.ItemName"></Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem label="附件图片" prop="ReportFileList">
                        <upload-list v-if="show" :default-list="uploadList" @on-upload="handleUpload" @on-remove="handleRemove"></upload-list>
                    </FormItem>
                </Form>
            </custom-scrollbar>
            <div slot="footer">
                <Button type="ghost" icon="reply" @click="cancelAdd('formValidate')">取消</Button>
                <Button type="primary" icon="checkmark" @click="handleSubmit('formValidate')">确定</Button>
            </div>
        </Modal>

        <Modal v-model="selectAddress" width="1000" :closable="false" class="select-address" :styles="{top: '20px'}" @on-ok="getAddress()">
            <div id="container">
                <input id='address' readonly="true" type="text" />
            </div>
        </Modal>
    </div>
</template>
<script type="text/babel">
import { mapGetters, mapState } from 'vuex';
import auth from '../../util/auth';
import { loadAMapAsync } from './../../util/script';
import UploadList from './UploadList';
import CustomScrollbar from '../shared/CustomScrollbar';

export default {
    name: 'AddException',
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
        // 验证附件信息
        const validateUploadFile = (rule, value, callback) => {
            if (value === '' || !value.length) {
                callback(new Error('请至少选择一张图片'));
            }else if (value.length >= 3) {
                callback(new Error('最多只能选择三张图片'));
            } else {
                callback();
            }
        };

        return {
            show$: this.show,       // 同步状态

            loading: false,
            selectAddress: false,
            loadMap: true,

            riverDatas: [],
            reachDatas: [],
            pollingItemDatas: [],
            

            rootAreas: [],        // 根行政区划信息
            areaCodes: [undefined],        // 保存选中的行政区编码

            areaCode: '',   // 行政区划编码
            riverId: '',    // 河流编号

            addModel: {         // 新增模型
                AreaCode: '',
                RiverId: '',
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

            addModelRule: {         // 新增模型验证
                AreaCode: [
                    { required: true, message: '请选择地区', trigger: 'blur' }
                ],
                RiverId: [
                    { required: true, message: '请选择河流', trigger: 'blur' }
                ],
                ReachId: [
                    { required: true, message: '请选择河段', trigger: 'blur' }
                ],
                Address: [
                    { required: true, message: '请选择详细地址', trigger: 'blur' }
                ],
                Description: [
                    { required: true, message: '请输入问题描述', trigger: 'blur' },
                    { type: 'string', min: 1, max: 300, message: '最多只能输入300字', trigger: 'blur' }
                ],
                MainInspectionItemName: [
                    { required: true, message: '请选择问题主项', trigger: 'blur' }
                ],
                SonInspectionName: [
                    { required: true, message: '请选择问题子项', trigger: 'blur' }
                ],
                ReportFileList: [
                    { required: true, validator: validateUploadFile, trigger: 'change' }
                ]
            },

            pollingItem: '',
            pollingSonItem: [],

            uploadList: [],     // 保存上传的附件
        }
    },
    computed: {
        ...mapGetters('exception', [
            'riverResult',
            'reachResult',
            'childAreaResult',
            'pollingItemResult',
        ]),
        ...mapState('exception', {
            model: 'model',
            parentAreaModel: 'parentAreaModel',
            riverModel: 'riverModel',
            reachModel: 'reachModel',
            pollingItemModel: 'pollingItemModel'
        }),
    },
    watch: {    // 主要处理模型之外的数据同步问题
        areaCode: function(val, oldVal) {
            this.addModel.AreaCode = val;
        },
        riverId: function(val, oldVal) {
            this.addModel.RiverId = val;
        },
        show: function(val, oldVal) {
            this.show$ = val;
        }
    },
    beforeCreate() {
        // 异步加载地图
        loadAMapAsync();
    },
    mounted() {
        // 获取当前登录用户根节点行政区信息
        this.getRootAreas();
    },
    methods: {
        // 获取当前登录用户根节点行政区信息
        getRootAreas() {
            let peopleInfo = auth.getPeopleInfo();
            if (!peopleInfo || !peopleInfo.AreaCode || !peopleInfo.AreaLevel) return;
            this.rootAreas = [{
                value: peopleInfo.AreaCode,
                label: peopleInfo.AreaName,
                level: peopleInfo.AreaLevel,
                disabled: false,
                loading: peopleInfo.AreaLevel < 5 ? false : true,
                children: []
            }];

            // 更新Code 以便查询行政区信息及行政区级别
            this.areaCode = peopleInfo.AreaCode;
        },

        // 获取河流信息
        getRiversByArea() {
            let { dispatch, commit, state } = this.$store;
            let { route } = state;
            if(!this.areaCode) return;
            this.loading = true;
            dispatch('exception/getRiversByArea', {
                params: this.areaCode,
                $Message: this.$Message,
                $router: this.$router,
                route: state.route
            }).then(() => {
                this.loading = false;
                this.riverDatas = this.riverResult.Data;
            });
        },

        // 获取河段信息
        getReach() {
            let { dispatch, commit, state } = this.$store;
            let { route } = state;
            let reachModel = {
                AreaCode: this.areaCode,
                RiverBaseInfoId: this.riverId
            };
            if(!this.areaCode || !this.riverId) return;
            this.loading = true;
            dispatch('exception/getReach', {
                params: reachModel,
                $Message: this.$Message,
                $router: this.$router,
                route: state.route
            }).then(() => {
                this.loading = false;
                this.reachDatas = this.reachResult.Data;
            });
        },

        // 获取巡检主项
        getPolingItem() {
            let { dispatch, commit, state } = this.$store;
            let { route } = state;
            if(!this.addModel.ReachId) return;
            this.loading = true;
            dispatch('exception/getPolingItem', {
                params: this.addModel.ReachId,
                $Message: this.$Message,
                $router: this.$router,
                route: state.route
            }).then(() => {
                this.loading = false;
                this.pollingItemDatas = this.pollingItemResult.Data;
            });
        },

        // 获取行政区划级联控件子级别数据
        getChildAreasData(item, callback) {
            let that = this;
            item.loading = true;
            setTimeout(() => {
                that.getChildArea(item.value, areaDatas => {
                item.loading = false;
                item.children = areaDatas ? areaDatas : null;
                item.disabled = !(areaDatas && areaDatas.length);

                // 更新行政区划Code
                that.areaCode = item.value;

                callback && callback();
                });
            }, 16);
        },

        // 获取行政区划子级列表
        getChildArea(areaCode, callback) {
            let { dispatch, commit, state } = this.$store;
            dispatch("exception/getChildArea", {
                params: areaCode || this.areaCode,
                $Message: this.$Message,
                $router: this.$router,
                route: state.route
            }).then(() => {
                let areaData = this.childAreaResult.Data;
                let areaDataMap =
                areaData &&
                areaData.map(item => {
                    let areaMap = {
                    value: item.AreaCode,
                    label: item.AreaName,
                    level: item.AreaLevel,
                    disabled: false,
                    children: []
                    };
                    item.AreaLevel < 4 && (areaMap.loading = false);
                    return areaMap;
                });

                callback && callback.call(null, areaDataMap);
            });
        },

        // 过滤行政区划
        filterAreas(areaCodes, items) {
            if(!areaCodes || !areaCodes.length) return;
            let lastCode = areaCodes[areaCodes.length - 1];
            let lastItem = items[items.length - 1];

            this.areaCode = lastCode;
            setTimeout(this.getRiversByArea, 500);
        },

        // 过滤河流信息
        filterRiver(value) {
            this.riverId = value;
            setTimeout(this.getReach, 500);
        },

        // 过滤河段信息
        filterReach(value) {
            this.addModel.ReachId = value;
            setTimeout(this.getPolingItem, 500);
        },

        // 过滤巡检主项
        filterPollingItem(value) {
            this.pollingSonItem = [];
            this.addModel.MainInspectionItemName = value;
        },

        // 过滤巡检子项
        filterSonItem(pollingSonItem) {
            this.addModel.SonInspectionName = pollingSonItem.join(" | ");
        },

        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.addException();
                } else {
                    // if(!this.addModel.ReportFileList.length) {
                    //     return this.$Message.error('请选择图片');
                    // }
                    
                    this.$Message.error('验证未通过!');
                }
            });
        },
        // 处理文件上传
        handleUpload(response, file, files) {
            console.log('response: %o, files: %o', response, files);
            let uploadFiles = files.map(item => {
                return {
                    FileUrl: item.name,
                    FileType: 0
                };
            });

            this.addModel.ReportFileList = uploadFiles || [];
        },

        // 处理文件删除
        handleRemove(file) {
            console.log('file remove: %o', file);
            const reportFileList = this.addModel.ReportFileList;
            this.addModel.ReportFileList = reportFileList.filter(item => item.FileUrl !== file.name);
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
        
        // 添加异常
        addException(name) {
            let that = this;
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
                that.cancelAdd(name);
            }).then(() => {
                that.$emit('on-refresh', that.show$);
            });
        },

        // 取消添加
        cancelAdd(name) {
            this.addModel.ReachId = '';
            this.addModel.Address = '';
            this.addModel.Description = '';
            this.addModel.Lng = '';
            this.addModel.Lat = '';
            this.addModel.MainInspectionItemName = '';
            this.addModel.SonInspectionName = '';
            this.pollingItem = '';
            this.pollingSonItem = [];
            this.rootAreas = [];
            this.areaCodes = [];
            this.riverId = '';
            this.areaCode = '';

            this.$refs[name] && this.$refs[name].resetFields();

            // 获取当前登录用户根节点行政区信息
            this.getRootAreas();

            this.show$ = false;
            this.$emit('on-cancel',this.show$);
        },

    }
}
</script>