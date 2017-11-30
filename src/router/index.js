import Vue from 'vue';
import VueRouter from 'vue-router';

import iView from 'iview';
import {
    createTitle,
    lazyLoading,
    lazyRequire
} from './../util';
import auth from './../util/auth';

Vue.use(VueRouter);
Vue.use(iView);

const routers = [{
    path: '/login',
    meta: {
        title: '登录'
    },
    component: lazyLoading('Login'),
    beforeEnter(to, from, next) {
        auth.logout();
        next();
    }
}, {
    path: '/logout',
    meta: {
        title: '登出'
    },
    beforeEnter(to, from, next) {
        auth.logout();
        next('/login')
    }
}, {
    alias: '/exceptionmanage/index',
    path: '/',
    meta: {
        title: '异常管理',
        requiresAuth: true
    },
    component: lazyLoading('exception-manage/Index')
}, {
    path: '/exceptionmanage/mapdetail',
    meta: {
        title: '异常管理-地图详情',
        requiresAuth: true
    },
    component: lazyLoading('exception-manage/MapDetail')
}, {
    path: '/exceptionmanage/solveexception',
    meta: {
        title: '异常管理-地图详情-解决异常详情',
        requiresAuth: true
    },
    component: lazyLoading('exception-manage/ExceptionSolve')
},{
    path: '/rivermanage/index',
    meta: {
        title: '基础信息',
        requiresAuth: true,
    },
    component: lazyLoading('river-manage/Index')
}, {
    path: '/amap',
    meta: {
        title: '一张图',
        requiresAuth: true
    },
    component: lazyLoading('AMap')
}, {
    path: '/patrolmanage/index',
    meta: {
        title: '巡河管理',
        requiresAuth: true
    },
    component: lazyLoading('patrol-manage/Index')
}, {
    path: '/patrolmanage/patroldetail',
    meta: {
        title: '巡河管理-巡河管理详情',
        requiresAuth: true
    },
    component: lazyLoading('patrol-manage/PatrolDetail')
}, {
    path: '/reportmanage/index',
    meta: {
        title: '公众上报',
        requiresAuth: true
    },
    component: lazyLoading('report-manage/Index')
}];

export function createRouter() {
    let router = new VueRouter({
        mode: 'hash',
        linkActiveClass: 'active',
        scrollBehavior: (to, from, savedPosition) => {
            if (savedPosition) {
                return savedPosition
            } else {
                const position = {
                    x: 0,
                    y: 0
                };
                if (to.hash) {
                    position.selector = to.hash;
                }
                if (to.matched.some(x => x.meta.scrollToTop)) {
                    position.x = 0;
                    position.y = 0;
                }
                return position;
            }
        },
        routes: routers
    });

    router.beforeEach((to, from, next) => {
        iView.LoadingBar.start();
        createTitle(to.meta.title);
        if (to.matched.some(record => record.meta.requiresAuth)) {
            // 检查是否登录授权，若没有，则直接跳到登录页面
            if (!auth.loggedIn()) {
                next({
                    path: '/login',
                    query: {
                        redirect: to.fullPath
                    }
                })
            } else {
                next()
            }
        } else {
            next() // 确保一定要调用 next()
        }
    });

    router.afterEach(() => {
        iView.LoadingBar.finish();
    });

    return router;
}