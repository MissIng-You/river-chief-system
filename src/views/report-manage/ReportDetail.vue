<style lang="sass" scoped>
 .em-model{
    $gray:#969ba0;
    $fontSize:9px;
    $primary:#57a3f3;
    $danger:#f06900;
    overflow:visible;

    .em-model-header {
        display:flex;
        align-items:center;
        .river-info {
            display:inline-block;
        }
        .patrol-report-code {
            margin-left:8px;
            color:$gray;
        }
    }
    .reply {
        color: $primary;
        font-size: 18px;
        // width: 100%;
        text-align: center;
        position: relative;

        .show-submit {
            cursor: pointer;
        }
        .unreply {
            position: absolute;
            width: 100px;
            left: 50%;
            margin-left: -50px;
            top: 50%;
            margin-top: -52px;
        }
        .submit-reply {
            width: 100px;
            height: 35px;
            background-color: $primary;
            color: #fff;
            font-size: 14px;
            text-align: center;
            line-height: 35px;
            display: block;
            margin-bottom: 20px;
            border-radius: 5px;
            cursor: pointer;
        }
        .cancel-reply {
            @extend .submit-reply;
            margin-bottom: 0;
            background-color: $gray;
        }
        .show-reply {
            display: block;
        }
        .reply-icon {
            color: $gray;
            font-size: 24px;
        }
        .on-show {
            cursor: pointer;
        }
    }
 }

</style>

<template>
    <Modal :value="show" :closable="true" width="750" :styles="{top:'20px'}" class-name="em-model" @on-cancel="handleCancel()">
       <div class="em-model-header" slot="header">
            <h4 class="river-info">府南河-成都市高新区-跨区河段</h4>
            <span class="patrol-report-code">（报告编号：HZZ20171118195454291）</span>
        </div>
         <custom-scrollbar :height="ScrollHeigh" fixed>
             <detail-item :isReply="isReply" :isReplyInfo="isReplyInfo" :replyState="replyState">
                 <div slot="tools" class="reply" v-show="replyState == 0">
                     <span v-if="isReply == 0" @click="showReplyInput(1)" class="show-submit">点击回复</span>   
                     <div class="unreply" v-if="isReply == 1">
                        <span @click="showReplyInput(0)" class="submit-reply">提交回复</span>
                        <span @click="showReplyInput(0)" class="cancel-reply">取消</span>
                     </div>
                 </div>
                 <div slot="tools" class="reply" v-if="replyState == 100"> 
                     <div class="on-show" @click="showReply(1)" v-if="replyState == 100 && isReplyInfo == 0">
                        <span class="show-reply">查看回复</span>
                        <Icon class="reply-icon" type="android-arrow-dropdown-circle"></Icon>
                     </div>
                     <div class="on-show" @click="showReply(0)" v-if="replyState == 100 && isReplyInfo == 1">
                         <span class="show-reply">收起回复</span>
                        <Icon class="reply-icon" type="android-arrow-dropup-circle"></Icon>
                     </div>
                 </div>
             </detail-item>
        </custom-scrollbar>
        <div slot="footer"></div>
    </Modal>
</template>


<script>
import { mapGetters, mapState } from 'vuex';
import CustomScrollbar from "../shared/CustomScrollbar";
import DetailItem from './DetailItem';


export default {
    name: 'ReportDetail',
    components: {
        CustomScrollbar,
        DetailItem,
        
    },
    props: {
        show: {
            type: Boolean,
            defalut: false
        },
        replyState: {
            type: Number,
        }
    },

    data() {
        return {
            ScrollHeigh: 500,
            isReply: 0,
            isReplyInfo: 0
        }
    },
    computed: {
    },
    methods: {
        showReplyInput(index) {
            this.isReply = index;
        },
        showReply(index) {
            this.isReplyInfo = index;
        },
        handleCancel() {
            this.show$ = false;
            this.isShowMap = false;
            this.$emit('showModel', false);
            this.isReply = 0;
            this.isReplyInfo = 0;
        },
    },
    watch: {
        show: function(val, oldVal) {
            this.show$ = val;
        }
    }
}
</script>