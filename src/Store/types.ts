export interface User{
    id:string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    createAt: string;
    updateAt: string;
}

export interface LoginCredentials{
    email: string;
    password: string;
}

export interface RegisterData{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface pet{
        id: string;
        name: string;
        breed: string;
        gender: string;
        birthDate: string;
        avatar: string;
        size: string;
        weight: number;
        height: number;
        furColor: string;
        description: string;
        status: string;
        specialDiseases?: string;
        allergies?: string;
        lastCheckupDate: string;
        vaccineRecords: [];
        serviceHistory: []
    }
   
//AI 相关类型
 export interface ChatMessage{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    model: string;
 }

 export interface ChatSession{
    id: string;
    petId: string;
    messages: ChatMessage[];
 }

 //通知类型
 export interface Notification{
    id: string;
    type: "success" | 'info' | 'warning' | 'error';
    message: string;
    timestamp: Date;
    read: boolean;
 }
 //API 相应类型
 export interface ApiResponse<T = any>{
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
 }

 export interface PetApiResponse<T >{
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
 }
