<style lang="sass" scoped>

</style>

<template>
<Modal :value="show" width="360" class="exception-modal" @on-cancel="handleCancel()">
    <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>异常解决</span>
    </p>
    <Row type="flex">
        <Col span="24" class="panel-content-textarea">
        <Input v-model="solveExplain" type="textarea" :rows="4" placeholder="请输入解决说明..."></Input>
        </Col>
        <Col span="24">
        <Upload multiple type="drag" action="//jsonplaceholder.typicode.com/posts/">
            <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>点击或将文件拖拽到这里上传</p>
            </div>
        </Upload>
        </Col>
    </Row>
    <div slot="footer">
        <Button type="error" size="large" long :loading="modalLoading" @click="solveException(item)">解决异常?</Button>
    </div>
</Modal>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex';
export default {
    name: 'ExceptionSolve',
    props: {
        show: {
            type: Boolean,
            default: false
        },
    },
    computed: {
        ...mapGetters('exception', {
            result: 'result',
            detailResult: 'detailResult',
            detailError: 'detailError'
        }),
        ...mapState('exception', ['solveModel']),
        solveExplain: {
            get() {
                return this.solveModel.SolveExplain;
            },
            set(value) {
                this.$store.commit('exception/UPDATE_SOLVE_EXPLAIN', value)
            }
        },
    },
    data() {
        return {
            modalLoading: false,
            show$: this.show,
        }
    },
    methods: {
        solveException(item) {
            this.modalLoading = true;
            this.show$ = false;
        },
        handleCancel() {
            this.show$ = false;
            this.$emit('on-cancel', this.show$);
        }
    },
    watch: {
        show: function(val, oldVal) {
            this.show$ = val;
        }
    }
}
</script>