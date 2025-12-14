import { s } from "react-router/dist/development/index-react-server-client-Da3kmxNd";

//存储类型
export type StorageType = 'localStorage'| 'sessionStorage';

//存储配置
export interface StorageConfig{
    type?: StorageType;
    prefix?: string;
    expires?: number;
    encrypt?: boolean;
}

//存储类型
export interface StorageItem<T = any>{
    value: T;
    times: number;
    expires?: number;
}

//获取存储实例
// 获取存储实例函数
// 用于根据传入的类型获取对应的浏览器存储实例（localStorage 或 sessionStorage）
// @param type - 存储类型，可选值为 'localStorage' 或 'sessionStorage'，默认值为 'localStorage'
// @returns 返回对应的 Storage 实例，包含 setItem、getItem、removeItem、clear 等方法
const getStorageInstance = (type: StorageType = 'localStorage'): Storage => {
    // 使用三元表达式判断并返回对应的存储实例
    return type === 'localStorage' ? window.localStorage : window.sessionStorage;
}
//生成键名

const generateKey = (key: string, prefix: string = ''): string =>{
    return prefix ? `${prefix}:${key}` : key;
}

//简单的加密解密函数
const encryptData = (data: string, encrypt: boolean = false): string =>{
    if(!encrypt){
        return data;
    }
    try{
        return encrypt ? btoa(data) : data;
    }
    catch(error){
        console.error('加密数据失败', error);
        return data;
    }
};

//设置存储项
export const setStorage = <T>(
    key: string,
    value: T,
    config: StorageConfig = {}
): void =>{
    const { type = 'localStorage', prefix = '', expires, encrypt = false } = config;
    const storage = getStorageInstance(type);
    const fullKey = generateKey(key, prefix);
    const item: StorageItem<T> = {
        value,
        times: Date.now(),
        expires,
    };
    const serializedData = JSON.stringify(item);
    const encryptedData = encryptData(serializedData, encrypt);
     try{
        storage.setItem(fullKey, encryptedData);
     }
     catch(error){
        console.error('设置存储项失败', error);
     }
};

//获取存储项
export const getStorageItem = <T>(
    key: string,
    config: StorageConfig = {}
): T | null =>{
    const { type = 'localStorage', prefix = '', encrypt = false } = config;
    const storage = getStorageInstance(type);
    const fullKey = generateKey(key, prefix);
    try{
        const encryptedData = storage.getItem(fullKey);
        if(!encryptedData){
            return null;
        }
        const decryptedData = encryptData(encryptedData, !encrypt);
        const item: StorageItem<T> = JSON.parse(decryptedData);
        if(item.expires && item.expires < Date.now()){
            storage.removeItem(fullKey);
            return null;
        }
        return item.value;
    }
    catch(error){
        console.error('获取存储项失败', error);
        return null;
    }
}

//