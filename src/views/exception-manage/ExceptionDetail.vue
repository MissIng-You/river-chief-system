<style lang="sass">
    $panel-min-height: 100px;
    $gray: #ccc;

    .exception-modal {
        // display: flex;
        // align-items: center;
        // justify-content: center;
        // .ivu-model {
        //     top: 0;
        // }

        .ex-header {
            color:#f60;
            text-align:center;
        }
        .ex-uploads {
            padding-top: 15px;
        }
    }

    .model-carousel {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        .img-container {
            padding-top: 10px;
            padding-right: 10px;
            width: 33.33%;
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
            align-item: center;
        }
        .img-carousel {
            display: block;
            width: $panel-min-height;
            height: $panel-min-height;
            line-height: $panel-min-height;
            vertical-align: top;
            // float: right;
            // margin: 0 8px;
            overflow: hidden;
            background-color: rgba($gray, .3);
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center center;
        }
    }
    
</style>

<template>
<Modal :value="show" width="360" class-name="exception-modal" @on-cancel="handleCancel()">
    <p slot="header" class="ex-header">
        <Icon type="information-circled"></Icon>
        <span>解决详情</span>
    </p>
    <custom-scrollbar fixed>
        <Timeline>
            <TimelineItem v-for="(record, index) in detail.SolveExceptionsRecordList" :key="index">
                <p class="time">{{record.SolveTime}}</p>
                <p class="content">{{record.SolveInfo}}</p>
                <div class="model-carousel">
                    <div v-for="(img, idx) in record.SolveExceptionsFileList" :key="idx" class="img-container">
                        <img class="img-carousel" :src="img.FileUrl" :alt="img.FileUrl"/>
                        <!-- <span class="img-carousel" :style="'background-image:url(' + img.FileUrl + ');'"></span> -->
                    </div>
                    <!--<Carousel :arrow="getCarouselArrow(record.SolveExceptionsFileList)">
                        <CarouselItem v-for="(img, idx) in record.SolveExceptionsFileList" :key="idx">
                            
                        </CarouselItem>
                    </Carousel>-->
                </div>
            </TimelineItem>
        </Timeline>
    </custom-scrollbar>
    <div slot="footer">
    </div>
</Modal>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import CustomScrollbar from '../shared/CustomScrollbar';

export default {
    name: 'ExceptionDetail',
    components: {
        CustomScrollbar,
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
    },
    computed: {
        ...mapGetters('exception', ['detailResult', 'detailError']),
        
        detail() {
            return this.detailResult && this.detailResult.Data ? this.detailResult.Data : {};
        }
    },
    data() {
        return {
            show$: this.show
        }
    },
    methods: {
        // 获取Arrow
        getCarouselArrow(value) {
            return value && value.length > 1
                ? 'hover' : 'never';
        },
        // 取消解决
        handleCancel() {
            this.show$ = false;
            this.$emit('on-cancel', this.show$);
        },
    },
    watch: {
        show: function(val, oldVal) {
            this.show$ = val;
        }
    }
}
</script>