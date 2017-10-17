<style scope lang="sass">
$black: rgba(0, 0, 0, 0.6);
$white: #fff;
$login-wrap-width: 275px;
$login-wrap-inner-width: 225px;
$login-title-height: 65px;
$login-input-height: 55px;
$login-input-icon-size: 32px;

html,body {
    width: 100%;
    height: 100%;
}

.login {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    position: absolute;
    margin: -115px -15px -15px -15px;
    height: 100%;
    width: 100%;
    .login-wrap {
        height: 100%;
        width: $login-wrap-width;
        background-color: $black;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        .login-wrap-inner {
            width: $login-wrap-inner-width;
        }
    }
}

.login-logo {
    background:transparent url('./../assets/images/login-title.png') center no-repeat;
    background-size:100% 100%;
    width: $login-wrap-inner-width;
    height: $login-title-height;
    margin-bottom: 15px;
}

.login-header {
    line-height: 1.5;
    text-align:center;
    text-shadow: 0 1px 1px #999,0 2px 1px #666;
    margin-bottom: 15px;
    .title {
        position: relative;
        letter-spacing: 5px;
        font-size: 18px;
        margin-bottom: 15px;
        &::before, &::after {
            display: block;
            position: absolute;
            content: "";
            width: $login-title-height / 2;
            height: 1px;
            background-color: $white;
            top: 50%;
        }
        &::before {
            left: 0;
        }
        &::after {
            right: 0;
        }
    }
    .subtitle {
        font-size: 12px;
        >span{
            display:inline-block;
            transform:scale(0.8);
        }
    }
}

.login-body {
    border: 1px solid $white;
    border-radius: 5px;
    margin-bottom: 15px;

    .ivu-input{
        background-color: rgba(255,255,255, 0.3);
        color: rgba(255,255,255, 0.5);
        &:hover {
            background-color: rgba(255, 255, 255, 0.4);
            color: $white;
        }
        &:focus {
            box-shadow: none;
            background-color: rgba(255, 255, 255, 0.6);
            color: $white;
        }
    }
    .ivu-input-large{
        height: $login-input-height;
        border: 0;
        border-radius: 0;
        padding-left: 15px;
    }
    .ivu-input-wrapper-large {
        &:first-child {
            border-bottom: 1px solid $white;
        }
        .ivu-input-icon {
            color: $white;
            font-size: $login-input-icon-size;
            width: $login-input-height;
            height: $login-input-height;
            line-height: $login-input-height;
        }
    }
    .ivu-input-icon-normal+.ivu-input {
        padding-right: $login-input-height;
    }
}

.login-footer {
    margin-bottom: 15px;
    .ivu-btn-large{
        height: $login-input-height;
    }
    .forget {
        display: block;
        margin-top: 15px;
        text-align: right;
    }
}

</style>
<template>
    <div class="login">
        <div class="login-wrap">
            <div class="login-wrap-inner">
                <div class="login-logo"></div>
                <div class="login-header">
                    <h4 class="title">信息管理系统</h4>
                    <h5 class="subtitle">
                        <span>RIVER CHIEF MANAGEMENT SYSTEM</span>
                    </h5>
                </div>
                <div class="login-body">
                    <Input size="large" icon="ios-person-outline" v-model="username" placeholder="用户名/手机号">
                    </Input>
                    <Input size="large" icon="ios-locked-outline" v-model="password" placeholder="登录密码">
                    </Input>
                </div>
                <div class="login-footer">
                    <Button type="primary" size="large" :loading="loading" @click="login" long>
                        <span v-if="!loading">登录</span>
                        <span v-else>登录中...</span>
                    </Button>
                    <a href="javascript:;" class="forget">忘记密码?</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="text/babel">
import { mapGetters, mapActions, mapState } from 'vuex';

export default {
    // beforeCreate() {
    //     // Assume there is a "login" module we wanna load
    //     let store = this.$store;
    //     import('./../store/modules/user').then(userModule => {
    //         store.registerModule('user', userModule)
    //     });
    // },
    computed: {
        ...mapGetters('user', ['loading', 'result', 'error']),
        ...mapState('user', ['model']),
        username: {
            get() {
                return this.model.username;
            },
            set(value) {
                this.$store.commit('user/UPDATE_USERNAME', value)
            }
        },
        password: {
            get() {
                return this.model.password;
            },
            set(value) {
                this.$store.commit('user/UPDATE_PASSWORD', value)
            }
        }
    },
    methods: {
        login() {
            let { dispatch, commit, state } = this.$store;

            dispatch('user/login', {
                LoginName: this.model.username,
                Pwd: this.model.password
            }).then(() => {
                let { IsError: isError } = this.result;
                if (!isError) {
                    let { query: { redirect } } = state.route
                    this.$Message.success({
                        content: '登录成功，请稍后。。。',
                        duration: 1,
                        onClose: () => {
                            this.$router.replace(redirect || '/');
                            commit('user/COMMON_LOAD_DONE');
                            dispatch('auth', true, { root: true });
                        }
                    });
                } else {
                    this.$Message.error({
                        content: '登录失败，请重试。。。',
                        duration: 3,
                        onClose: () => {
                            commit('user/COMMON_LOAD_DONE');
                            dispatch('auth', false, {root: true});
                        }
                    });
                }
            });
        }
    }
};
</script>