import axios from 'axios';
import router from '@/router'
import { Message, LoadingBar } from 'view-design';

//http request 请求拦截器
axios.interceptors.request.use(
    config => {
        let data = JSON.parse(localStorage.getItem(window.$project));
        if (data) {
            // 设置token
            config.headers.common['Authorization'] = data.token;
        }
        LoadingBar.start()
        return config;
    },
    error => {
        return Promise.reject(err);
    }
);

//响应拦截器
axios.interceptors.response.use(response => {
    LoadingBar.finish();
    return response
}, err => {
    LoadingBar.error();
    if (err && err.response) {
        switch (err.response.status) {
            case 400:
                console.log('错误请求')
                Message.error("错误请求");
                break;
            case 401:
                console.log('未授权，请重新登录')
                Message.error("未授权，请重新登录");
                router.push('/login');
                break;
            case 403:
                console.log('拒绝访问')
                Message.error("拒绝访问");
                break;
            case 404:
                console.log('请求错误,未找到该资源')
                Message.error("请求错误,未找到该资源");
                break;
            case 405:
                console.log('请求方法未允许')
                Message.error("请求方法未允许");
                break;
            case 408:
                console.log('请求超时')
                Message.error("请求超时");
                break;
            case 500:
                console.log('服务器端出错')
                Message.error("服务器端出错");
                break;
            case 501:
                console.log('网络未实现')
                Message.error("网络未实现");
                break;
            case 502:
                console.log('网络错误')
                Message.error("网络错误");
                break;
            case 503:
                console.log('服务不可用')
                Message.error("服务不可用");
                break;
            case 504:
                console.log('网络超时')
                Message.error("网络超时");
                break;
            case 505:
                console.log('http版本不支持该请求')
                Message.error("http版本不支持该请求");
                break;
            default:
                console.log(`连接错误${err.response.status}`)
                Message.error(`连接错误${err.response.status}`);
        }
    } else {
        console.log('连接到服务器失败')
        Message.error('连接到服务器失败');
    }
    return Promise.resolve(err.response)
});

export default axios;