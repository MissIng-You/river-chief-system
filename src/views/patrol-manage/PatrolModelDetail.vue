<style lang="sass" scoped>
 .em-model{

         $gray:#969ba0;
         $fontSize:9px;
         $normalColor:#44b8b7;
         $abnormalColor:#f06900;

         overflow:visible;

        .em-model-header{
            display:flex;
            align-items:center;

            .river-info{
                display:inline-block;
            }

            .patrol-report-code{
                margin-left:8px;
                color:$gray;
            }

            button{
                margin-left:8px;
                font-size:10px;
                padding:3px;
            }
        }
        .em-model-body{

            .patrol-report-detail{
                    color:$gray;
                    &>span{
                        margin-right:16px;
                    }
                    .patrol-normal-item{
                        color:$normalColor;
                    }
                    .patrol-abnormal-item{
                        color:$abnormalColor;
                    }
                }
            .patrol-item{

                    margin-top:15px;

                    .item-tooltip{
                        margin-right:11px;            
                    }

                    span{
                        color:$gray;
                    }
                    .pop-content{
                        border:1px solid #cfcfd6;
                        padding:5px 10px;
                        border-radius:5px;
                        margin:5px;
                        background-color:#fff;
                    }
        
                    .btn-river,.btn-waterbody,.btn-pollutant{
                        padding:2px 15px;
                        font-size:10px;
                        background-color:#fff;
                    }
                    .btn-river{
                        border:1px solid $normalColor;
                        color:$normalColor;
                    }
                    .btn-waterbody{
                        border:1px solid $abnormalColor;
                        color:$abnormalColor;
                    }
                }
                .patrol-contents{
                    
                    margin-top:15px;
                    border: 1px solid #D3D6D8;

                    .content-title{

                        overflow:hidden;
                        margin:0px 10px;

                        .content-title-left{
                            float:left;
                            margin-top:6px;
                            margin-bottom:6px;
                            margin-left:10px;
                            margin-right:10px;

                            .normal{
                                border:1px solid $normalColor;
                                padding:3px 7px;
                                border-radius:5px;
                                color:$normalColor;
                                font-size:10px;
                            }
                            .abnormal{
                                @extend .normal;  
                                border:1px solid $abnormalColor;
                                color:$abnormalColor;
                            }  
                        }
                        .content-title-right{
                            float:left;
                            margin-top:6px;
                            margin-bottom:6px;

                            .water-detail{
                                font-weight:bold;
                                font-size:11px;
                            }
                            .patrol-time{
                                margin-left:10px;
                                color:$gray;
                                font-size:$fontSize;
                                
                            }
                        }
                    }
                    .content-descriple{

                        margin-left:63px;
                        overflow:hidden;
                        display:flex;
                        align-items:center;

                        .descriple-left{
                            float:left;

                            .descriple-pic{
                                width:395px;
                                padding-top:5px;
                            }
                            .descriple-title{
                                font-size:9px;
                                font-weight:bold;
                            }
                            .descriple-address{
                                color:$gray;
                                font-size:$fontSize;
                            }
                        }

                        .descriple-right{
                            float:left;
                            margin-left:12px;
                            border-left:1px dashed #d4cfcf;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            flex-wrap:wrap;
                            width:100%;
                            padding:23px;

                            .btn-item{
                                width:100%;
                                display:flex;
                                align-items:center;
                                justify-content:center;
                            }
                            .btn-resolve{
                                background-color:#2b85e5;
                                background-color:#2b85e5;
                                border-radius:15px;
                                color:#fff;
                                font-weight:400;
                                padding:3px 10px;
                                font-size:10px;
                                display:block;
                            }
                            span{
                                display:block;
                                padding:10px;
                                color:$gray;
                                font-size:$fontSize;
                            }
                        }

                    }

                        .patrol-comment{

                         display:block;
                         background-color:#fff;

                        .comments{
                            margin:10px 25px;
                            overflow:hidden;
                            .comments-left{
                                float:left;
                                text-align:center;
                                span{
                                    display:block;
                                    color:#5a5959;
                                    font-size:$fontSize;
                                }
                                .portrait{
                                    margin-left:2px;
                                }
                                .name{
                                    padding-top:5px;
                                }
                            }
                            .comments-right{
                                float:left;
                                margin-left:20px;
                                margin-top:21px;
                                width:74%;
                                position:relative;
                                .triangle{
                                    width:0px;
                                    height:0px;
                                    border:8px solid transparent;
                                    border-right:8px solid #45a2d6;
                                    position:absolute;
                                    top:7px;
                                    left:-15px;
                                    float:left;
                                }
                                .commment-right-content{
                                    background-color:#45a2d6;
                                    border-radius:3px;
                                    padding:15px 25px 12px 15px;
                                    color:#fff;
                                    font-size:11px;
                                    .comment-pic{
                                        width:65%;
                                        margin-top:10px;
                                    }
                                }
                            }
                        }
                    }
                } 
        }

    }

</style>

<style lang="sass">
.item-tooltip {
    .ivu-tooltip-inner{
        min-width:500px;
    }
    &>span{
        background-color:#fff;
    }
}
.ivu-modal-wrap{
    overflow:visible;
}
</style>

<template>
  <Modal :value="show" :closable="true" width="750" :styles="{top:'20px'}" class-name="em-model" @on-cancel="handleCancel()">
            <div class="em-model-header" slot="header">
                    <h4 class="river-info">{{riverObj.riverName}} {{riverObj.riverRegion}}</h4>
                    <span class="patrol-report-code">(巡查报告编号 : {{patrolObj.patrolCode}})</span>
                    <i-button type="primary">巡河轨迹</i-button>
            </div>
            <div class="em-model-body">
                <div class="patrol-report-detail">
                    <span>巡查人员 : {{patrolObj.patrolStaff}}</span>
                    <span>上报数量 : {{patrolObj.patrolCount}}个
                        <span class="patrol-normal-item">({{patrolObj.patrolNormalNum}}</span>
                            正常 | 
                        <span class="patrol-abnormal-item">{{patrolObj.patrolAbnormalNum}}</span>
                            异常)
                        </span>
                    <span>创建时间 : {{patrolObj.patrolDate}}</span>
                    <span>巡河时长 : {{patrolObj.patrolDuration}}</span>
                </div>
                <div class="patrol-item">
                    <span>巡查项目:</span>
                    <Tooltip  trigger="hover" class="item-tooltip" placement="top">
                        <Badge class="river-badge-item">
                            <i-button class="btn-river">河流</i-button>
                        </Badge>
                        <div slot="content" class="tooltip-content">
                            <span class="pop-content" v-for="(item,index) in riverPopConent" :key="index">{{item}}</span>
                        </div>
                    </Tooltip >
                    <Tooltip  trigger="hover" class="item-tooltip" placement="top">
                        <Badge count="2" class="waterbody-badge-item">
                            <i-button class="btn-waterbody">水体</i-button>
                        </Badge>
                         <div slot="content">
                            <span class="pop-content" v-for="(item,index) in riverPopConent" :key="index">{{item}}</span>
                        </div>
                    </Tooltip >
                    <Tooltip  trigger="hover" class="item-tooltip" placement="top">
                        <Badge count="4" class="waterbody-badge-item">
                            <i-button class="btn-waterbody">气味</i-button>
                        </Badge>
                        <div slot="content">
                            <span class="pop-content" v-for="(item,index) in riverPopConent" :key="index">{{item}}</span>
                        </div>
                    </Tooltip >
                    <Tooltip  trigger="hover" class="item-tooltip" placement="top">
                        <Badge>
                            <i-button class="btn-pollutant">污染物</i-button>
                        </Badge>
                        <div slot="content">
                            <span class="pop-content" v-for="(item,index) in riverPopConent" :key="index">{{item}}</span>
                        </div>
                    </Tooltip >
                </div>
                <Card class="patrol-contents" style="background-color:#f2f2f2;height:400px;overflow:scroll" shadow :bordered="false">
                        <div class="contents-item" dis-hover v-for="(datail,index) in details" :key="index" style="margin:0">
                            <div class="patrol-content">
                                <div class="content-title">
                                    <div class="content-title-left">
                                        <span v-bind:class="[datail.patrolDescriple.patrolIsResolve==='2'?'normal':datail.patrolDescriple.patrolIsResolve==='1'?'abnormal':datail.patrolDescriple.patrolIsResolve==='0'?'abnormal':'']">
                                            {{datail.patrolItem==='1'?'河流':datail.patrolItem==='2'?'水体':datail.patrolItem==='3'?'气味':datail.patrolItem==='4'?'污染':''}}
                                        </span>
                                    </div>
                                    <div class="content-title-right">
                                        <span class="water-detail" v-for="(item,index) in datail.patrolDetail" :key="index">{{item}}</span>
                                        <span class="patrol-time">
                                            <Icon type="ios-clock-outline"></Icon>
                                            {{patrolObj.patrolDate}}
                                        </span>
                                    </div>

                                </div>
                                <div class="content-descriple">
                                    <div class="descriple-left">
                                        <span class="descriple-title">{{datail.patrolDescriple.descriple}}</span>
                                        <Row class="descriple-pic">
                                            <Col span="8"  v-for="(item,index) in datail.patrolDescriple.imgList" :key=index>
                                                <img :src="item" width="125" height="75">
                                            </Col>
                                        </Row>
                                        <span class="descriple-address">
                                            <Icon type="ios-location-outline"></Icon>
                                            {{datail.patrolDescriple.patrolPosition}}
                                        </span>
                                    </div>
                                    <div class="descriple-right">
                                        <i-button class="btn-resolve">{{datail.patrolDescriple.patrolIsResolve==='2'?'正常':datail.patrolDescriple.patrolIsResolve==='1'?'已解决':datail.patrolDescriple.patrolIsResolve==='0'?'未解决':''}}</i-button>
                                        <div class="btn-item" v-if="datail.patrolDescriple.patrolIsResolve==='1'?true:false">
                                        <span @click="changeShowState(index)" v-if="isShow">收起
                                            <Icon type="arrow-up-c"></Icon>
                                        </span>
                                        <span @click="changeShowState(index)" v-else>展开
                                            <Icon type="arrow-down-c"></Icon>
                                        </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="patrol-comment" :id="index" style="display:none" v-if="datail.patrolDescriple.patrolIsResolve==='1'?true:false">
                                <div class="comments" v-for="(obj,index) in datail.commentObjs" :key=index>
                                    <div class="comments-left">
                                        <div style="width:0.8px;height:18px;margin-left:22px;margin-bottom:3px;background-color:#d7d9da;"></div>
                                        <Avatar icon="person" size="large" class="portrait"/>
                                        <span class="name">{{obj.name}}</span>
                                        <span class="date">{{obj.cmtDate}}</span>
                                        <span>{{obj.cmtTime}}</span>
                                        <div style="width:0.8px;height:40px;margin-left:22px;margin-top:3px;background-color:#d7d9da"></div>
                                    </div>
                                    <div class="comments-right">
                                        <div class="triangle"></div>
                                        <div class="commment-right-content">
                                            <span>{{obj.cmtContent}}</span>
                                            <Row class="comment-pic">
                                                <Col span="8" v-for="(item,index) in obj.cmtPic" :key=index>
                                                    <img :src="item" style="width:83px;height:58px;border:1px solid #fff">
                                                </Col>
                                            </Row>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                </Card>
            </div>
            <div slot="footer"></div>
        </Modal>
</template>


<script>
//import { mapGetters,mapState} from 'vuex';

export default {
    name: 'ModelDetail',
    components: {},
    props:{
        show:{
            type:Boolean,
            defalut:false
        }
    },

    data() {
        return {
            
            isShow:false,
            show$:this.show,
            riverListDatas:[],
            patrolObj:{
                    patrolCycle: '2017年 第31周',
                    patrolCode: 'SCFNH171023001',
                    patrolDate: '2017-10-23 16:24:22',
                    patrolStaff: '李杰',
                    patrolAbnormalNum: '6',
                    patrolDuration: '1小时41分钟',
                    patrolNormalNum: '1',
                    patrolCount: '3'
                },
            riverObj:{
                riverName:'江安河',
                riverRegion:'大源村河段'                
            },
            riverPopConent:['采砂打捞','企业排污','企业排污','采砂打捞','企业排污','企业排污'],

            details:[{
                patrolItem:'2',
                patrolDetail:'漂浮物 | 非法捕鱼',
            patrolDescriple:{
                descriple:'河流严重污染，水位出没没人管理，生活垃圾大量流入，生活垃圾大量流入',
                imgList:[require('../../assets/images/a.jpg'),require('../../assets/images/b.jpg'),require('../../assets/images/c.jpg'),require('../../assets/images/d.jpg'),require('../../assets/images/e.jpg')],
                patrolPosition:'四川省成都市武侯区天府大道中段环球中心',
                patrolIsResolve:'1',
            },
            commentObjs:[
                {
                    name:'王奕骅',
                    portrait:'../../assets/favicon.ico',
                    cmtDate:'2017/09/18',
                    cmtTime:' 16:24:22',
                    cmtContent:'河道垃圾已经清理干净，工作人员到位，水下沉积物已经被捞出去了。有关部门展开了搜寻垃圾的活动。',
                    cmtPic:[require('../../assets/images/a.jpg'),require('../../assets/images/b.jpg'),require('../../assets/images/c.jpg')]

                },
                {
                    name:'王小明',
                    portrait:'../../assets/favicon.ico',
                    cmtDate:'2017/09/15',
                    cmtTime:'15:24:22',
                    cmtContent:'河道垃圾已经清理干净，工作人员到位，水下沉积物已经被捞出去了。有关部门展开了搜寻垃圾的活动。',
                    cmtPic:[require('../../assets/images/a.jpg'),require('../../assets/images/b.jpg'),require('../../assets/images/c.jpg'),require('../../assets/images/e.jpg')]

                }
            ],
            riverPopConent:['采砂打捞','企业排污','企业排污','采砂打捞','企业排污','企业排污']
            },
            {
                patrolItem:'3',
                patrolDetail:'漂浮物 | 非法捕鱼',
                patrolDescriple:{
                    descriple:'河流严重污染，水位出没没人管理，生活垃圾大量流入，生活垃圾大量流入',
                    imgList:[require('../../assets/images/a.jpg'),require('../../assets/images/b.jpg'),require('../../assets/images/c.jpg'),require('../../assets/images/d.jpg'),require('../../assets/images/e.jpg')],
                    patrolPosition:'四川省成都市武侯区天府大道中段环球中心',
                    patrolIsResolve:'0',
                },
                    riverPopConent:['采砂打捞','企业排污','企业排污','采砂打捞','企业排污','企业排污']
            }
            ,
            {
                patrolItem:'4',
                patrolDetail:'漂浮物 | 非法捕鱼',
                patrolDescriple:{
                    descriple:'河流严重污染，水位出没没人管理，生活垃圾大量流入，生活垃圾大量流入',
                    imgList:[require('../../assets/images/a.jpg'),require('../../assets/images/b.jpg'),require('../../assets/images/c.jpg'),require('../../assets/images/d.jpg'),require('../../assets/images/e.jpg')],
                    patrolPosition:'四川省成都市武侯区天府大道中段环球中心',
                    patrolIsResolve:'0',
                },
                    riverPopConent:['采砂打捞','企业排污','企业排污','采砂打捞','企业排污','企业排污']
            },
             {
                patrolItem:'4',
                patrolDetail:'漂浮物 | 非法捕鱼',
                patrolDescriple:{
                    descriple:'河流严重污染，水位出没没人管理，生活垃圾大量流入，生活垃圾大量流入',
                    imgList:[require('../../assets/images/a.jpg'),require('../../assets/images/b.jpg'),require('../../assets/images/c.jpg'),require('../../assets/images/d.jpg'),require('../../assets/images/e.jpg')],
                    patrolPosition:'四川省成都市武侯区天府大道中段环球中心',
                    patrolIsResolve:'2',
                },
                    riverPopConent:['采砂打捞','企业排污','企业排污','采砂打捞','企业排污','企业排污']
            },
             {
                patrolItem:'2',
                patrolDetail:'漂浮物 | 非法捕鱼',
                patrolDescriple:{
                    descriple:'河流严重污染，水位出没没人管理，生活垃圾大量流入，生活垃圾大量流入',
                    imgList:[require('../../assets/images/a.jpg'),require('../../assets/images/b.jpg'),require('../../assets/images/c.jpg'),require('../../assets/images/d.jpg'),require('../../assets/images/e.jpg')],
                    patrolPosition:'四川省成都市武侯区天府大道中段环球中心',
                    patrolIsResolve:'2',
                },
                    riverPopConent:['采砂打捞','企业排污','企业排污','采砂打捞','企业排污','企业排污']
            }
        ]
        }
    },
    // computed:{
    //     ...mapGetters('patrol',{
    //         riverListResult:'riverListResult',
    //         riverListError:'riverListError'
    //     }),
    //     ...mapState('patrol',{
    //         riverListRequestParam:'riverListRequestParam'
    //     })
    // },
    // beforeMount(){
    //     this.queryPollingRiverList();
    // },
    methods: {
        changeShowState(id){
            let dv=document.getElementById(id);
            //console.log(dv);
             if(this.isShow){
            dv.style.display="none";
            }else{
                dv.style.display="block";
            }
            this.isShow=!this.isShow;
           // console.log(dv.style.display);
        },
        handleCancel() {
            this.show$ = false;
            this.$emit('on-cancel', this.show$);
        },
        // queryPollingRiverList(){
        //     let { dispatch, commit, state } = this.$store;
        //     let { route, patrol:{ riverListRequestParam } } = state;
        //     //console.log('this is $store.........',this.$store);
        //     //console.log('this is state.........',state);
        //     dispatch('patrol/queryPollingRiverList',{
        //         params: riverListRequestParam,
        //         $Message: this.$Message,
        //         $router: this.$router,
        //         route:route
        //     }).then(()=>{
        //         this.riverListDatas = this.riverListResult.PageData;
        //         console.log('riverListDatas is .........',this.riverListDatas);
        //     });
        // }
    },
     watch: {
        show: function(val, oldVal) {
            this.show$ = val;
        }
    }
}
</script>


