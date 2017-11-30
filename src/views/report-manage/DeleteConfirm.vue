<style>

</style>
<template>
     <Modal :value="show" :closable="false" width="300"  @on-cancel="handleCancel()" @on-ok="handleDeleteRecord()">
          <p>确定删除该记录吗?</p> 
    </Modal>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
    name: 'DeleteConfirm',
    props:{
        show: {
            type: Boolean,
            default: false,
        },
        query:{
            type: String,
            default: ''
        }
    },
    data(){
        return {
            show$: this.show,            
        }
    },
    watch: {
        show: function(val, oldVal) {
            this.show$ = val;
        }
    },
    computed:{
        ...mapState("report",["queryModel"]),
        ...mapGetters("report",["delRecordResult"]),
    },
    methods: {
        //取消按钮
        handleCancel(){
            this.show$ = false;
            this.$emit("on-cancel", this.show$);
        },

        //确定按钮
        handleDeleteRecord(){
            let { dispatch, commit, state } = this.$store;
            let { route } = state;

            dispatch("report/delReportRecord", {
                params: this.query,
                $Message: this.$Message,
                $router: this.$router,
                route: state.route
            }).then(() => {
                let isError = this.delReportRecord && this.delReportRecord.IsError;

                if(!isError) {
                    this.handleCancel();
                    this.$emit('on-refresh', this.delReportRecord);
                }
            });
        },
    }


}
</script>

