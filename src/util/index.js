import env from '../config/env';

export function createTitle(title) {
    title = title ? title + ' - 河长制管理系统' : '河长制管理系统';
    window.document.title = title;
};

// export const lazyLoading = (component) => () => import(/* webpackChunkName: "`${component}`" */ `./../views/${component}.vue`);

export const lazyLoading = (component) =>  {
    const template = eval(`/* webpackChunkName: "${component}" */ './../views/${component}.vue'`);

    const func = `
        return () => {
            return import(/* webpackChunkName: "${component}" */ './../views/${component}.vue');
        };`
    // console.log(`${new Function(func)}`);

    return () => {
        // import(/* webpackChunkName: "`${component}`" */ `./../views/${component}.vue`);
        return import(`./../views/${component}.vue`).then((result) => {console.log(result); return result;});
    };
    // return new Function(func);
}

// export function lazyRequire(component) {
//     return function(resolve) {
//         return require.ensure([], () => {
//             const M = require('./../views/AMap.vue');
//             resolve(M);
//         }, component);
//     }
// }