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
        // 处理连接错误（后端服务器未运行）
        if (error.code === 'ECONNREFUSED' || error.message?.includes('ECONNREFUSED')) {
            console.error('❌ 无法连接到后端服务器');
            console.error('💡 请确保后端服务器运行在 http://localhost:8083');
            console.error('💡 如果后端运行在其他端口，请修改 vite.config.ts 中的 proxy 配置');
            
            // 创建一个友好的错误对象
            const friendlyError = new Error('无法连接到后端服务器，请确保后端服务已启动');
            (friendlyError as any).code = 'ECONNREFUSED';
            (friendlyError as any).isBackendUnavailable = true;
            return Promise.reject(friendlyError);
        }
        
        // 处理其他错误
        if (error.response) {
            // 服务器返回了错误响应
            const status = error.response.status;
            const data = error.response.data;
            
            // 401 未授权，清除 token
            if (status === 401) {
                localStorage.removeItem('token');
                console.warn('Token 已过期或无效，已清除本地 token');
            }
            
            // 返回后端错误信息
            return Promise.reject(data || error);
        }
        
        // 网络错误或其他错误
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
            config.headers.Authorization = `Bearer ${token}`;
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

// 注意：第一个响应拦截器已经返回了 response.data
// 后端 API 响应格式：
// - 成功：直接返回数据或 { data: [...], count: 10 }
// - 错误：{ detail: "错误描述信息" }
// 因此不需要第二个拦截器处理 success 字段

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