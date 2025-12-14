import { Spin } from 'antd';
import type { User, LoginCredentials, RegisterData } from './types';


//模拟用户数据
const mockUser: User = {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: 'https://example.com/avatar.jpg',
    phone: '12345678901',
    //也能使用内置的 new Date
    createAt: '2023-01-01T00:00:00Z',
    updateAt: '2023-01-01T00:00:00Z',
};

//用户状态管理
export const useStore = (set: any, get: any) =>({
    user: null as User | null,
    isAuthenticated: false,
    loading: false,

    //登入
 login : async(_credentials: LoginCredentials) =>{
   set({ loading: true });
   try{
    //模拟登入成功
    console.log('模拟登录成功');
    const mockToekn = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('token', mockToekn);
    localStorage.setItem('user', JSON.stringify(mockUser));
    set({
        user: mockUser,
        isAuthenticated: true,
        loading: false,
    });
   }
   catch(error){
    console.error('登录失败', error);
    set({ loading: false });
    throw error;
   }  
 },

 //注册
 register: async(userData: RegisterData) =>{
    set({loading: true});
    try{
        //模拟注册成功
        console.log('模拟注册成功');
        const newUser: User = {
            id:Date.now().toString(),
            name: userData.name,
            email: userData.email,
            avatar: '',
            phone: '',
            createAt: new Date().toISOString(),
            updateAt: new Date().toISOString(),
        };

        const mockToken = 'mock-jwt-token-' + Date.now();
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        set({
            user: newUser,
            isAuthenticated: true,
            loading: false,
        });
    }
    catch(error){
        console.error('注册失败', error);
        set({ loading: false });
        throw error;
    }
 },

 //登出
 logout: () =>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
        user: null,
        isAuthenticated: false,
        loading: false,
    });
 },

 //更新资料
 updateProfile: async(profile: Partial<User>) =>{
    set({ loading: true });
    try{
        const currentUser = get().user;
        const updatedUser = { ...currentUser, ...profile , updateAt: new Date().toISOString()};
        localStorage.setItem('user', JSON.stringify(updatedUser));
        set({
            user: updatedUser,
            loading: false,
        });
    }
    catch(error){
        console.error('更新资料失败', error);
        set({ loading: false });
        throw error;
    }
 },

 //检查登录状态
 checkAuth: async () =>{
    const token = localStorage.getItem('token');
    const StoredUser = localStorage.getItem('user');
    if(!token || !StoredUser){
        set({
            isAuthenticated: false,
            loading: false,
        });
        return;
    }
    try{
        const user = JSON.parse(StoredUser);
        set({
            user,
            isAuthenticated: true,
            loading: false,
        });
    }
    catch(error){
        console.error('解析用户数据失败', error);
        set({ loading: false });
        throw error;
    }
 }
}
)
