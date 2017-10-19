<style scoped lang="sass">
    $black: #000;
    $white: #fff;
    $main-layout-navbar-height: 60px;
    $main-layout-bg: #f4f6f8;
    $inverse: #495060;
    $primary: #2d8cf0;

    .main-layout {
        background-color: $main-layout-bg;
        background-size:100% 100%;
        color: $black;
        height: 100%;
        width: 100%;
    }

    .login-layout {
        background:$black url('./../assets/images/login-bg.jpg') center no-repeat;
        background-size:100% 100%;
        color: $white;
        height: 100%;
        width: 100%;
        overflow: hidden;
    }

    .main-layout-nav{
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
        background-color: $inverse;
    }

    .login-layout-nav{
        padding: 20px 0;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        overflow: hidden;
    }

    .logo {
        color: $white;
        margin: 0 20px;
        height: $main-layout-navbar-height;
        overflow: hidden;
        >img {
            float: left;
            width: $main-layout-navbar-height;
            height: $main-layout-navbar-height;
        }
        .title{
            float: left;
            padding: 5px 20px;
            .zh {
                font-size: 18px;
                letter-spacing: 5px;
            }
            .en {
                font-size: 10px;
            }
        }
    }

    .main-layout .logo {
        >img {
            margin-top: 10px;
            width: $main-layout-navbar-height / 3 * 2;
            height: $main-layout-navbar-height / 3 * 2;
        }
    }

    .main-nav-inner {
        display: flex;
        
        .main-layout-avatar {
            float: left;
            height: $main-layout-navbar-height;
            background-color: $primary;
            .avatar-inner {
                display: inline-block;
                padding: 12px 20px;
                color: $white;
            }
            .username {
                float: right;
                padding: 10px 0 10px 10px;
            }
            .log-in {
                .ivu-icon {
                    font-size: 14px;
                    padding-right: 5px;
                }
            }
            .log-out {
                color: #f00;
                .ivu-icon {
                    font-size: 14px;
                    padding-right: 5px;
                }
            }
            &:hover {
                cursor: pointer;
                background-color: rgba($primary, .3);
            }
            .ivu-select-dropdown {
                margin-top: 0;
            }
        }

        .ivu-menu {
            float:left;
            overflow:hidden;
        }

        .ivu-menu-item > a {
            display: inline-block;
            height: $main-layout-navbar-height;
            position: relative;
            &.active::after {
                position: absolute;
                display: block;
                content: "";
                width: 100%;
                height: 3px;
                left: 0;
                bottom: 0;
                background-color: $primary;
            }
        }
    }

    .main-layout-wrap {
        padding: 0 20px 20px 0;
        background-color: $white;
        .main-layout-wrap-inner {
            padding-left: 20px;
        }
        .main-layout-content {
            padding-top: 20px;
            // min-height: 680px;
            overflow: hidden;
        }
    }

    .login-layout-wrap {
        height: 680px;
        margin: 15px;
        overflow: hidden;
        border-radius: 4px;
    }

    .main-layout-copyright{
        font-size: 12px;
        padding: 15px 0;
        color: #fff;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
    }
    
</style>
<template>
    <div :class="layoutClasses">
        <div :class="navClasses">
            <a class="logo" href="javascript:;">
                <img src="./../assets/images/logo.png">
                <div class="title">
                    <p class="zh">成都市江河湖泊河长制信息管理平台</p>
                    <p class="en">Chengdu City Management Information Platform for River Lake and River System</p>
                </div>
            </a>

            <div v-if="auth" class="main-nav-inner">
                <Menu ref="mainMenu" mode="horizontal" theme="dark" :active-name="activeName" @on-select="menuSelect">
                    <MenuItem name="1">
                        <router-link :to="{ path: '/amap'}">
                            <Icon type="ios-navigate"></Icon>
                            <span>一张图</span>
                        </router-link>
                    </MenuItem>
                    <MenuItem name="2">
                        <router-link :to="{ path: '/exceptionmanage/index'}">
                            <Icon type="ios-keypad"></Icon>
                            <span>异常管理</span>
                        </router-link>
                    </MenuItem>
                    <MenuItem name="3">
                        <Icon type="ios-analytics"></Icon>
                        巡河管理
                    </MenuItem>
                    <MenuItem name="4">
                        <Icon type="ios-paper"></Icon>
                        流程管理
                    </MenuItem>
                </Menu>
                <div class="main-layout-avatar">
                    <Dropdown trigger="click" placement="bottom-end">
                        <a class="avatar-inner" href="javascript:;">
                            <Avatar icon="person" />
                            <span class="username">{{permission && permission.PeopleName}}</span>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem>
                                <a class="log-out" href="javascript:;" @click="logout()">
                                    <Icon type="log-out"></Icon>注销登录
                                </a>
                            </DropdownItem>
                            <DropdownItem>
                                <a class="log-in" href="javascript:;" @click="login()">
                                    <Icon type="log-in"></Icon>切换账号
                                </a>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                
            </div>
        </div>

        <div :class="wrapClasses">
            <div v-if="auth" class="main-layout-sidebar">
                <slot name="sidebar"></slot>
            </div>
            <div class="main-layout-wrap-inner">
                <div v-if="auth" class="main-layout-breadcrumb">
                    <slot name="breadcrumb"></slot>
                </div>
                <div class="main-layout-content">
                    <router-view></router-view>
                </div>
            </div>
        </div>
        <div v-if="!auth" class="main-layout-copyright">
            &copy; 2017 WANJIANG TECHNOLOGY
        </div>
    </div>
</template>

<script type="text/babel">

export default {
    name: 'main-layout',
    props: {
        auth: {
            type: Boolean,
            default: false
        },
        permission: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        layoutClasses() {
            return this.auth ? 'main-layout' : 'login-layout';
        },
        navClasses() {
            return this.auth ? 'main-layout-nav' : 'login-layout-nav';
        },
        wrapClasses() {
            return this.auth ? 'main-layout-wrap' : 'login-layout-wrap';
        }
    },
    data() {
        return {
            auth$: this.auth,
            permission$: this.permission,
            activeName: 2,
        };
    },
    watch: {
        auth: function(val, oldVal) {
            this.auth$ = val;
        },
        permission: {
            deep: true,
            handler: function(val, oldVal) {
                this.permission$ = val
            }
        },
    },
    methods: {
        logout() {
            this.auth$ = false;
            this.$emit('on-logout', this.auth$);
        },
        login() {
            this.auth$ = false;
            this.$emit('on-login', this.auth$);
        },
        menuSelect(val) {
            this.activeName = val;
            console.log(val);
        }
    }
};
</script>