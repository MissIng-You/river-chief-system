<style lang="sass">
    $input-md-width: 120px;
    $input-lg-width: 240px;
    $button-md-width: 120px;
    html, body, .app {
        width: 100%;
        height: 100%;
    }
    .ivu-spin-fix {
        z-index: 9999;
    }
    .input-md {
        width: $input-md-width !important;
    }
    .input-lg {
        width: $input-lg-width !important;
    }
    .button-md {
        width: $button-md-width !important;
    }
</style>
<template>
    <main-layout ref="mainLayout" 
        :auth="auth"
        :permission="permission"
        @on-login="logInOrOut"
        @on-logout="logInOrOut">
    </main-layout>
</template>

<script type="text/babel">
import { mapGetters, mapActions, mapState } from 'vuex';
import { COMMON_AUTH, COMMON_PERMISSION } from './store/mutation-types'

export default {
    computed: {
        ...mapGetters(['getAuth', 'getPermission']),
        auth: {
            get() {
                return this.getAuth;
            },
            set(value) {
                this.$store.commit(COMMON_AUTH, value, { root: true })
            }
        },
        permission: {
            get() {
                return this.getPermission;
            },
            set(value) {
                this.$store.commit(COMMON_PERMISSION, value, { root: true })
            }
        }
    },
    methods: {
        logInOrOut(val) {
            this.auth = val;
            this.$nextTick(()=> {
                this.$router.replace('/login');
            });
        }
    }
};
</script>