<style lang="sass" scoped>
    $gray:#969ba0;
    $primary:#57a3f3;
    $danger:#f06900;
    $bgColor: #f1f1f1;

    .detail-item {
        .detail-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px dashed #e9eaec;
            padding: 10px 0;
            z-index: 100;
        }
        .detail-body {
        }
        .detail-reply {

        }
    }
    .create-info {
        display: flex;
        align-items: center;

        .create-name {
            padding-left: 10px;
            font-size: 18px;
        }
    }    
    .create-date {
        color: $gray;
    }

    .detail-title {
        padding: 10px 0;
        font-size: 16px;

        .title {
            padding: 5px 15px;
            border-radius: 5px;
            color: #fff;
            background-color: $primary;
        }
        .subtitle {
            padding-left: 10px;
            color: $primary;
        }
    }
    .detail-content {
        background-color: $bgColor;
        display: flex;
        align-items: center;
        padding: 10px 0 10px 20px;

        .content-info {
            width: 75%;
            padding: 16px;
            border-right: 1px dashed $gray;
            
            p {
                font-size: 14px;
                coloe: #fff;
            }
            .content-images {
                margin-top: 10px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
            }
            .content-img {
                border: 2px solid #fff;
                height: 100px;
                overflow: hidden;
                width: 32%;
                margin-bottom: 10px;

                img {
                    width: 100%;
                }
            }
            .desc-address {
                color: $gray;
            }
        }

        .content-type {
            width: 25%;         
        }
    }

    .detail-reply {
        margin: 10px 0;

        .upload-images {
            margin-top: 10px;
        }
    }
</style>
<style lang="sass">
    .ivu-modal-body {
        padding-top: 0;
    }
</style>


<template>
    <div class="detail-item">
        <div class="detail-header">
            <div class="create-info">
                <Avatar icon="person" />
                <span class="create-name">Frank</span>
            </div>
            <span class="create-date">创建时间：2017-11-18 20:00:00</span>
        </div>
        <div class="detail-body">
            <div class="detail-title">
                <span class="title">河面</span>
                <span class="subtitle">杂物漂浮 | 病死动物</span>
            </div>
            <div class="detail-content">
                <div class="content-info">
                    <p>河流水质污染，各种频死动植物腐烂。河流水质污染，各种频死动植物腐烂。河流水质污染，各种频死动植物腐烂。</p>
                    <div class="content-images">
                        <div span="8" class="content-img">
                            <img src="http://171.221.202.126:30002/Image/201711/2017111012055488019.jpg" alt="">
                        </div>
                        <div span="8" class="content-img">
                            <img src="http://171.221.202.126:30002/Image/201711/2017111012055488019.jpg" alt="">
                        </div>
                        <div span="8" class="content-img">
                            <img src="http://171.221.202.126:30002/Image/201711/2017111012055488019.jpg" alt="">
                        </div>
                        <div span="8" class="content-img">
                            <img src="http://171.221.202.126:30002/Image/201711/2017111012055488019.jpg" alt="">
                        </div>
                    </div>
                    <span class="desc-address">
                        <Icon type="ios-location-outline"></Icon>
                        四川省成都市高新区天府大道环球中心
                    </span>
                </div>
                <div class="content-type">
                    <slot name="tools"></slot>
                </div>
            </div>
        </div>
        <div class="detail-reply" v-if="replyState == 0 && isReply == 1">
            <Input type="textarea" :rows="6" placeholder="请输入回复内容"></Input>
            <upload-list :default-list="uploadList" @on-upload="handleUpload" class="upload-images"></upload-list>
        </div>
         <reply-item v-if="replyState == 100 && isReplyInfo == 1"></reply-item>   
    </div>
</template>

<script type="text/babel">
import { mapGetters, mapState } from 'vuex';
import UploadList from './../exception-manage/UploadList';
import ReplyItem from './ReplyItem';

export default {
    name: 'DetailItem',
    components: {
        UploadList,
        ReplyItem,
    },
    props: {
        isReply: {
            type: Number,
        },
        isReplyInfo: {
            type: Number,
        },
        replyState: {
            type: Number,
        }
    },
    data() {
        return {
            uploadList: [],
            ReportFileList:[],
            
        }
    },
    computed: {

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

            this.ReportFileList = uploadFiles;
        },
    }
};
</script>