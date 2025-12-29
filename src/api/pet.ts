// import { api } from '../utils/request';
import { petRecords, type Pet as MockPet } from '../mock/petData';

export interface Pet {
  id: string;
  user_id: string;
  name: string;
  breed: string;
  gender: 'male' | 'female';
  birth_date: string;
  avatar?: string;
  weight?: number;
  height?: number;
  fur_color?: string;
  description?: string;
  status: string;
  special_diseases?: string;
  allergies?: string;
  last_checkup_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PetListResponse {
  data: Pet[];
  count: number;
}

export interface PetCreateData {
  name: string;
  breed: string;
  gender: 'male' | 'female';
  birth_date: string;
  avatar?: string;
  weight?: number;
  height?: number;
  fur_color?: string;
  description?: string;
  status?: string;
  special_diseases?: string;
  allergies?: string;
}

export interface PetListParams {
  skip?: number;
  limit?: number;
  user_id?: string;
}

// 将 Mock 数据转换为 API 格式
const convertMockPetToApiPet = (mockPet: MockPet, userId: string = '1'): Pet => {
  return {
    id: mockPet.id,
    user_id: userId,
    name: mockPet.name,
    breed: mockPet.breed,
    gender: mockPet.gender,
    birth_date: mockPet.birthDate,
    avatar: mockPet.avatar,
    weight: mockPet.weight,
    height: mockPet.height,
    fur_color: mockPet.furColor,
    description: mockPet.description,
    status: mockPet.status,
    special_diseases: mockPet.specialDiseases,
    allergies: mockPet.allergies,
    last_checkup_date: mockPet.lastCheckupDate,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

// Mock 数据存储（基于 petRecords）
let mockPetData: Pet[] = petRecords.map(pet => convertMockPetToApiPet(pet));

// 模拟延迟
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

const API_PREFIX = '/v1';

export const petApi = {
  // 使用 Mock 数据 - 已注释真实 API 调用
  getPetList: async (params?: PetListParams): Promise<PetListResponse> => {
    await delay();
    // 真实 API 调用已注释
    // return api.get<PetListResponse>(`${API_PREFIX}/pets/`, { params });
    
    // Mock 数据
    let filteredData = [...mockPetData];
    
    // 根据 user_id 过滤
    if (params?.user_id) {
      filteredData = filteredData.filter(pet => pet.user_id === params.user_id);
    }
    
    // 分页
    const skip = params?.skip || 0;
    const limit = params?.limit || 10;
    const data = filteredData.slice(skip, skip + limit);
    
    return {
      data,
      count: filteredData.length,
    };
  },

  getPetById: async (petId: string): Promise<Pet> => {
    await delay();
    // 真实 API 调用已注释
    // return api.get<Pet>(`${API_PREFIX}/pets/${petId}`);
    
    // Mock 数据
    const pet = mockPetData.find(p => p.id === petId);
    if (!pet) {
      throw new Error('宠物不存在');
    }
    return pet;
  },

  createPet: async (data: PetCreateData): Promise<Pet> => {
    await delay();
    // 真实 API 调用已注释
    // return api.post<Pet>(`${API_PREFIX}/pets/`, data);
    
    // Mock 数据
    const newPet: Pet = {
      id: `PET${String(mockPetData.length + 1).padStart(3, '0')}`,
      user_id: '1',
      ...data,
      status: data.status || '健康',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockPetData.push(newPet);
    return newPet;
  },

  updatePet: async (petId: string, data: Partial<PetCreateData>): Promise<Pet> => {
    await delay();
    // 真实 API 调用已注释
    // return api.patch<Pet>(`${API_PREFIX}/pets/${petId}`, data);
    
    // Mock 数据
    const petIndex = mockPetData.findIndex(p => p.id === petId);
    if (petIndex === -1) {
      throw new Error('宠物不存在');
    }
    mockPetData[petIndex] = {
      ...mockPetData[petIndex],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return mockPetData[petIndex];
  },

  deletePet: async (petId: string): Promise<{ message: string }> => {
    await delay();
    // 真实 API 调用已注释
    // return api.delete<{ message: string }>(`${API_PREFIX}/pets/${petId}`);
    
    // Mock 数据
    const petIndex = mockPetData.findIndex(p => p.id === petId);
    if (petIndex === -1) {
      throw new Error('宠物不存在');
    }
    mockPetData.splice(petIndex, 1);
    return { message: '宠物删除成功' };
  },
};

