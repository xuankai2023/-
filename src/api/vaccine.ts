// import { api } from '../utils/request';
import { petRecords } from '../mock/petData';

export interface VaccineRecord {
  id: string;
  pet_id: string;
  name: string;
  date: string;
  next_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VaccineRecordListResponse {
  data: VaccineRecord[];
  count: number;
}

export interface VaccineRecordCreateData {
  pet_id: string;
  name: string;
  date: string;
  next_date?: string;
  notes?: string;
}

export interface VaccineRecordListParams {
  skip?: number;
  limit?: number;
  pet_id?: string;
}

// 从 petRecords 中提取疫苗记录
const extractVaccineRecords = (): VaccineRecord[] => {
  const records: VaccineRecord[] = [];
  petRecords.forEach(pet => {
    pet.vaccineRecords.forEach((vaccine, index) => {
      records.push({
        id: `${pet.id}_VACCINE_${index + 1}`,
        pet_id: pet.id,
        name: vaccine.name,
        date: vaccine.date,
        next_date: vaccine.nextDate,
        notes: `宠物 ${pet.name} 的疫苗记录`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    });
  });
  return records;
};

// Mock 数据存储
let mockVaccineData: VaccineRecord[] = extractVaccineRecords();

// 模拟延迟
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

const API_PREFIX = '/v1';

export const vaccineApi = {
  // 使用 Mock 数据 - 已注释真实 API 调用
  getVaccineRecordList: async (params?: VaccineRecordListParams): Promise<VaccineRecordListResponse> => {
    await delay();
    // 真实 API 调用已注释
    // return api.get<VaccineRecordListResponse>(`${API_PREFIX}/vaccine-records/`, { params });
    
    // Mock 数据
    let filteredData = [...mockVaccineData];
    
    // 根据 pet_id 过滤
    if (params?.pet_id) {
      filteredData = filteredData.filter(record => record.pet_id === params.pet_id);
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

  getVaccineRecordById: async (recordId: string): Promise<VaccineRecord> => {
    await delay();
    // 真实 API 调用已注释
    // return api.get<VaccineRecord>(`${API_PREFIX}/vaccine-records/${recordId}`);
    
    // Mock 数据
    const record = mockVaccineData.find(r => r.id === recordId);
    if (!record) {
      throw new Error('疫苗记录不存在');
    }
    return record;
  },

  createVaccineRecord: async (data: VaccineRecordCreateData): Promise<VaccineRecord> => {
    await delay();
    // 真实 API 调用已注释
    // return api.post<VaccineRecord>(`${API_PREFIX}/vaccine-records/`, data);
    
    // Mock 数据
    const newRecord: VaccineRecord = {
      id: `VACCINE_${Date.now()}`,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockVaccineData.push(newRecord);
    return newRecord;
  },

  updateVaccineRecord: async (recordId: string, data: Partial<VaccineRecordCreateData>): Promise<VaccineRecord> => {
    await delay();
    // 真实 API 调用已注释
    // return api.patch<VaccineRecord>(`${API_PREFIX}/vaccine-records/${recordId}`, data);
    
    // Mock 数据
    const recordIndex = mockVaccineData.findIndex(r => r.id === recordId);
    if (recordIndex === -1) {
      throw new Error('疫苗记录不存在');
    }
    mockVaccineData[recordIndex] = {
      ...mockVaccineData[recordIndex],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return mockVaccineData[recordIndex];
  },

  deleteVaccineRecord: async (recordId: string): Promise<{ message: string }> => {
    await delay();
    // 真实 API 调用已注释
    // return api.delete<{ message: string }>(`${API_PREFIX}/vaccine-records/${recordId}`);
    
    // Mock 数据
    const recordIndex = mockVaccineData.findIndex(r => r.id === recordId);
    if (recordIndex === -1) {
      throw new Error('疫苗记录不存在');
    }
    mockVaccineData.splice(recordIndex, 1);
    return { message: '疫苗记录删除成功' };
  },
};

