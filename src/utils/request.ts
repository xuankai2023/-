import axios from 'axios';
// - AxiosInstance ：Axios实例的类型定义，用于创建可复用的、配置了特定参数的Axios客户端实例，
// 包含了get、post等HTTP请求方法
// - AxiosRequestConfig ：Axios请求配置的类型定义，
// 包含了请求URL、方法、参数、请求头、超时时间等所有请求相关的配置项
// - AxiosResponse ：Axios响应的类型定义，
// 包含了响应数据、状态码、响应头、请求配置等完整的响应信息结构
// - InternalAxiosRequestConfig ：Axios内部使用的请求配置类型，是对 AxiosRequestConfig 的扩展
// ，包含了更多内部处理所需的配置项
import type { AxiosInstance, AxiosRequestConfig,AxiosResponse,InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '../Store/types';

//创建 axios 实例

const request: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
// 响应拦截器
request.interceptors.response.use(
    // 响应拦截器的第一个参数应该是AxiosResponse类型，但这里错误地使用了InternalAxiosRequestConfig类型
    // InternalAxiosRequestConfig是请求拦截器的参数类型，不是响应拦截器的参数类型
    // 响应拦截器的参数应该是AxiosResponse类型
    (response: AxiosResponse) => {
        // 直接返回响应数据，不做任何处理
        return response.data;
    },
    // 错误处理函数
    (error) => {
        // 直接返回Promise.reject(error)将错误传递给调用者
        return Promise.reject(error);
    }
);

// 请求拦截器
request.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 获取本地存储中的token
        const token = localStorage.getItem('token');
        // 如果token存在且配置对象有headers属性
        if (token && config.headers) {
            // 设置Authorization请求头为Bearer token格式
            // 注意：这里有个小问题，Bearer和token之间应该有个空格，即`Bearer ${token}`
            config.headers.Authorization = `Bearer${token}`;
        }
        // 返回配置对象
        return config;
    },
    // 错误处理函数
    (error) => {
        // 直接返回Promise.reject(error)将错误传递给调用者
        return Promise.reject(error);
    }
);

//响应拦截器
request.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        const { success, data, message, error } = response.data;
        if (!success) {
            throw new Error(message || error || '请求失败');
        }
        return data;
    },
    (error) => {
        //处理网络请求错误
        if(error.response){
            switch(error.response.status){
                case 401:
                    // 处理未授权错误，例如跳转到登录页
                    break;
                case 403:
                    // 处理禁止访问错误，例如显示权限不足提示
                    break;
                case 404:
                    // 处理资源不存在错误，例如显示404页面
                    break;
                default:
                    // 处理其他错误，例如显示通用错误提示
                    break;
            }
            return Promise.reject(error);
        }else if (error.request){
            //请求已发出但没有收到响应
            console.error('请求已发出但没有收到响应', error.request);
            return Promise.reject(error);
        }else{
            // 处理其他错误，例如显示通用错误提示
            console.error('未知错误', error.message);
            return Promise.reject(error);
        }        
    }
);

export const api = {
    get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => request.get(url, config),
    post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => request.post(url, data, config),
    put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => request.put(url, data, config),
    delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => request.delete(url, config),
    upload: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => request.post(url, data, {...config,
         headers: {'Content-Type': 'multipart/form-data'}
        ,}).then((res) => res.data),
};

export default request;