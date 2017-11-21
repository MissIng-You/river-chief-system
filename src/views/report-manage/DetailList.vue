<style lang="sass" scoped>
    $gray:#969ba0;
    $primary: #44b8b7;
    $danger: #f06900;

    .detail-list {
        padding:15px; 

        .detail-content {
            margin-bottom: 10px;
        }
    }
    .detail-term {
        text-align: right;

        .datail-term-primary {
            padding: 3px 10px;
            border: 1px solid $primary;
            color: $primary;
            border-radius: 5px;
            margin-right: 10px;
            line-height: 24px;
        }
        .datail-term-danger {
            padding: 3px 10px;
            border: 1px solid $danger;
            color: $danger;
            border-radius: 5px;
            margin-right: 10px;
            line-height: 24px;
        }
    }
    .detail-desc {
        padding-right: 20px;
        border-right: 1px dashed $gray;

        .desc-title {
            font-weight: 900;
            font-size: 14px;
            margin-right: 10px;
        }
        .desc-date {
            line-height: 22px;
            color: $gray;
        }
        .desc-text {
            padding: 6px 0;
        }
        .desc-images {
            padding-bottom: 6px;
            .image {
                padding-right: 8px;
                margin-bottom: 8px;
                height: 75px;
                overflow: hidden;
            }
            img {
                width: 100%;
            }
        }
        .desc-address {
            color: $gray;
        }
    }
    .detail-type {
        text-align: center;
        .type-text-primary {
            font-size: 16px;
            color: $primary;
            display: block;
        }
        .type-text-danger {
            font-size: 16px;
            color: $danger;
            display: block;
        }
        .type-icon {
            font-size: 30px;
            display: block;
            color: $gray;
        }
    }

    
</style>
<template>
    <div class="detail-list">
        <Row class="detail-content">
            <Col span="3" class="detail-term">
                <span v-bind:class="[detail.State == 1 ? 'datail-term-primary' : 'datail-term-danger']">{{detail.MainInspectionItemName}}</span>
            </Col>
            <Col span="21">
                <Row type="flex" align="middle">
                    <Col span="16" class="detail-desc">
                        <Row >
                            <Col span="15">
                                <span class="desc-title">{{showChildTerm(detail.SonInspectionName)}}</span>
                            </Col>
                            <Col span="9">
                                <span class="desc-date">
                                    <Icon type="ios-clock-outline"></Icon>
                                    {{detail.CreateTime}}
                                </span>
                            </Col>
                        </Row>
                        <p class="desc-text">{{detail.Description}}</p>
                        <Row class="desc-images">
                            <Col span="8" class="image" v-for="(img,index) in detail.ReportFileList" :key="index">
                                <img :src="img.FileUrl" alt="">
                            </Col>
                        </Row> 
                        <span class="desc-address">
                            <Icon type="ios-location-outline"></Icon>
                            {{detail.Address}}
                        </span>
                    </Col>
                    <Col span="8" class="detail-type">
                        <span v-if="detail.State == 1" class="type-text-primary">正常</span>
                        <span v-if="detail.State == 3" class="type-text-primary">已解决</span>
                        <span v-if="detail.State == 2 && detail.SolveExceptionsRecordList.length == 0" class="type-text-danger" >未解决</span>
                        <span v-if="detail.State == 2 && detail.SolveExceptionsRecordList.length > 0" class="type-text-danger">处理中</span>
                        <span v-if="(detail.State == 2 && detail.SolveExceptionsRecordList.length > 0 && showType == 0) || (detail.State == 3 && showType == 0)" @click="showReply(1)">
                            <Icon class="type-icon"  type="android-arrow-dropdown-circle"></Icon>
                        </span>
                        <span v-if="(detail.State == 2 && detail.SolveExceptionsRecordList.length > 0 && showType == 1) || (detail.State == 3 && showType == 1)" @click="showReply(0)">
                            <Icon class="type-icon" type="android-arrow-dropup-circle"></Icon>
                        </span>
                    </Col>
                </Row>
            </Col>          
        </Row>
        <div v-show="showType == 1">
            <reply-list :reply="detail.SolveExceptionsRecordList"></reply-list>
        </div>
    </div>
</template>

<script type="text/babel">
import { mapGetters, mapState } from 'vuex';
import ReplyList from './ReplyList';

export default {
    name: 'DetailList',
    components: {
        ReplyList
    },
    props: {
        detail: {
            type: Object,
        }
    },
    data() {
        return {
            showType: 0
        }
    },
    computed: {
        
    },
    methods: {
        showReply(index) {
            this.showType = index;
        },
        showChildTerm(childTerm) { 
            let PollingSonTerm = '';
            if (childTerm == null) {
                PollingSonTerm = '';
            } else {
                if (childTerm.indexOf('|') > 0) {
                    PollingSonTerm = childTerm.split('|').join(' | ');
                } else {
                    PollingSonTerm = childTerm;
                }
            }
            return PollingSonTerm;
        }
    }
};
</script>