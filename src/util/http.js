import axios from 'axios';
import Qs from 'qs';
import config from './../config/config';
import auth from './auth';

function AxiosConfig () {
    this._instance,

    this.instance = () => {
        this._instance = axios;

        this.setDefaultConfig()
            .setRequestInterceptor()
            .setResponseInterceptor()
            .setTransformRequest()
            .setTransformResponse();

        return this._instance;
    }

    this.setDefaultConfig = () => {
        this._instance.defaults.baseURL = config.apiServer;
        this._instance.defaults.url = '';
        this._instance.defaults.timeout = 10000;
        // this._instance.defaults.headers.post = {
        //     'Access-Control-Allow-Origin': '*',
        //     'Access-Control-Allow-Credentials': 'true'
        // };
        // this._instance.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
        // this._instance.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
        // this._instance.defaults.withCredentials = true;      // 允许跨域访问
        this._instance.defaults.responseType = 'json';

        this._instance.defaults.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          };

        return this;
    }

    this.setRequestInterceptor = () => {
        let interceptor = this._instance.interceptors.request.use((setting) => {
            console.log(setting);
        }, (error) => {
    
        });
        this._instance.interceptors.request.eject(interceptor);
    
        return this;
    }

    this.setResponseInterceptor = () => {
        let interceptor = this._instance.interceptors.response.use((setting) => {
            console.log(setting);
        }, (error) => {
    
        });
        this._instance.interceptors.response.eject(interceptor);
    
        return this;
    }

    this.setTransformRequest = () => {
        let requestBody = {
            AccessToken: auth.getToken() || '',
            AppKey: '',
            Timestamp: Date.now(),
            Sign: ''
        };

        let transform = function(data, header) {
            console.log('transform request data: %o, header: %o', data, header);

            let requestBody = {
                AccessToken: auth.getToken() || '',
                AppKey: '',
                Timestamp: Date.now(),
                Sign: '',
                Body: data
            };
            return Qs.stringify(requestBody, {arrayFormat: 'indices'});
        };
    
        this._instance.defaults.transformRequest = [transform];
    
        return this;
    }

    this.setTransformResponse = () => {
        let transform = function(data) {
            console.log('transform response data: %o', data);

            if(data && data.ErrCode === 400) {
                auth.logout();

                // 同步授权状态
                // commit(COMMON_AUTH, false, {root: true});
            }
            return data;
        };
    
        this._instance.defaults.transformResponse = [transform];
        
        return this;
    }
}

let http = new AxiosConfig().instance();

export default http;