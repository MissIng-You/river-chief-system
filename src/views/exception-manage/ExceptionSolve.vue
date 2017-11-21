<style lang="sass" scoped>
    .exception-modal {
        // display: flex;
        // align-items: center;
        // justify-content: center;
        // .ivu-modal {
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
    
</style>

<template>
<Modal :value="show" width="360" class-name="exception-modal" @on-cancel="handleCancel()">
    <p slot="header" class="ex-header">
        <Icon type="information-circled"></Icon>
        <span>问题解决</span>
    </p>
    <custom-scrollbar :height="250" fixed>
        <Row type="flex">
            <Col span="24" class="ex-content">
                <Input v-model="solveExplain" type="textarea" :rows="4" placeholder="请输入解决说明..."></Input>
            </Col>
            <Col span="24" class="ex-uploads">
                <upload-list :default-list="defaultList" @on-upload="handleUpload"></upload-list>
            </Col>
        </Row>
    </custom-scrollbar>
    <div slot="footer">
        <Button type="error" size="large" long :loading="modalLoading" @click="handleException()">解决异常?</Button>
    </div>
</Modal>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import UploadList from './UploadList';
import CustomScrollbar from '../shared/CustomScrollbar';

export default {
    name: 'ExceptionSolve',
    components: {
        UploadList,
        CustomScrollbar,
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
    },
    watch: {
        show: function(val, oldVal) {
            this.show$ = val;
        }
    },
    computed: {
        ...mapGetters('exception', ['solveResult', 'solveError']),
        ...mapState('exception', ['solveModel']),
        solveExplain: {
            get() {
                return this.solveModel.SolveInfo;
            },
            set(value) {
                this.$store.commit('exception/UPDATE_SOLVE_EXPLAIN', value)
            }
        },
        fileList: {
            get() {
                return this.solveModel.SolveExceptionsFileList;
            },
            set(value) {
                this.$store.commit('exception/UPDATE_SOLVE_FILES', value)
            }
        }
    },
    data() {
        return {
            defaultList: [],
            modalLoading: false,
            show$: this.show,
        }
    },
    methods: {
        // 解决异常
        handleException() {
            if(!this.fileList|| !this.fileList.length || !this.solveExplain) return;

            let { dispatch, commit, state } = this.$store;

            this.modalLoading = true;
            dispatch("exception/solveException", {
                params: this.solveModel,
                $Message: this.$Message,
                $router: this.$router,
                route: state.route
            }).then(() => {
                this.modalLoading = false;
                if(this.solveResult && !this.solveResult.IsError) {
                    this.handleCancel();

                    // 触发刷新功能
                    this.$emit('on-refresh', this.solveResult);
                }
            });
        },

        // 取消解决
        handleCancel() {
            this.show$ = false;
            this.$emit('on-cancel', this.show$);

            this.solveExplain = '';
            this.fileList = [];
            this.defaultList = [];
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

            this.fileList = uploadFiles;
        }
    }
}
</script>