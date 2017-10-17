import 'es6-promise/auto'

let scripts = {};
export function loadScript(src) {
    if(!scripts[src]) {
        scripts[src] = new Promise((resolve, reject) => {
            insertScript(src, resolve, () => {
                scripts[src] = null;
                reject();
            });
        });
    }
    return scripts[src];
}

export function insertScript(src, success, error) {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.async = true;
    script.src = src;

    if(script.readyState) {
        script.onreadystatechange = function() {
            if(script.readyState === 'loaded' || script.readyState === 'complete') {
                script.onreadystatechange = null;
                success && success();
            }
        }
    } else {
        script.onload = function() {
            success && success();
        };
        script.onerror = function() {
            error && error();
        }
    }

    document.getElementsByTagName('head')[0].appendChild(script);
}

let LoadAMapPromise = null;
export function loadAMapAsync(success, error) {
    if(!LoadAMapPromise) {
        LoadAMapPromise = new Promise((resolve, reject) => {
            window.AMapInit = function() {
                resolve(window.AMap);
                successs && success();
            }
            insertScript('//webapi.amap.com/maps?v=1.3&key=608d75903d29ad471362f8c58c550daf&callback=AMapInit',
                () => {},
                () => {
                    LoadAMapPromise = null;
                    reject('高德地图加载失败，请重新刷新页面！');
                });
        });
    }
    return LoadAMapPromise;
}

let LoadAMapUIPromise = null;
export function loadAMapUIAsync() {
    loadAMapAsync().then(() => {
        if(!LoadAMapUIPromise) {
            LoadAMapUIPromise = new Promise((resolve, reject) => {
                insertScript('//webapi.amap.com/ui/1.0/main.js', 
                    () => {
                        resolve(window.AMapUI);
                    },
                    () => {
                        LoadAMapUIPromise = null;
                        reject('高德地图UI组件加载失败，请重新刷新页面！');
                    });
            });
        }
        return LoadAMapUIPromise;
    });
}
