// import { api } from '../utils/request';
import { petRecords } from '../mock/petData';

export interface ServiceRecord {
  id: string;
  pet_id: string;
  service_name: string;
  date: string;
  price: number;
  status: 'completed' | 'pending' | 'in_progress';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceRecordListResponse {
  data: ServiceRecord[];
  count: number;
}

export interface ServiceRecordCreateData {
  pet_id: string;
  service_name: string;
  date: string;
  price: number;
  status: 'completed' | 'pending' | 'in_progress';
  notes?: string;
}

export interface ServiceRecordListParams {
  skip?: number;
  limit?: number;
  pet_id?: string;
}

// 从 petRecords 中提取服务记录
const extractServiceRecords = (): ServiceRecord[] => {
  const records: ServiceRecord[] = [];
  petRecords.forEach(pet => {
    pet.serviceHistory.forEach((service, index) => {
      const statusMap: Record<'已完成' | '进行中' | '待预约', 'completed' | 'pending' | 'in_progress'> = {
        '已完成': 'completed',
        '进行中': 'in_progress',
        '待预约': 'pending',
      };
      
      records.push({
        id: `${pet.id}_SERVICE_${index + 1}`,
        pet_id: pet.id,
        service_name: service.serviceName,
        date: service.date,
        price: service.price,
        status: statusMap[service.status] || 'pending',
        notes: service.notes || `宠物 ${pet.name} 的服务记录`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    });
  });
  
  // 如果没有服务记录，生成一些示例数据
  if (records.length === 0) {
    petRecords.slice(0, 5).forEach((pet, petIndex) => {
      records.push({
        id: `SERVICE_${petIndex + 1}`,
        pet_id: pet.id,
        service_name: '宠物洗护',
        date: new Date().toISOString(),
        price: 100 + petIndex * 50,
        status: 'completed',
        notes: `宠物 ${pet.name} 的洗护服务`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    });
  }
  
  return records;
};

// Mock 数据存储
let mockServiceData: ServiceRecord[] = extractServiceRecords();

// 模拟延迟
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

const API_PREFIX = '/v1';

export const serviceApi = {
  // 使用 Mock 数据 - 已注释真实 API 调用
  getServiceRecordList: async (params?: ServiceRecordListParams): Promise<ServiceRecordListResponse> => {
    await delay();
    // 真实 API 调用已注释
    // return api.get<ServiceRecordListResponse>(`${API_PREFIX}/service-records/`, { params });
    
    // Mock 数据
    let filteredData = [...mockServiceData];
    
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

  getServiceRecordById: async (recordId: string): Promise<ServiceRecord> => {
    await delay();
    // 真实 API 调用已注释
    // return api.get<ServiceRecord>(`${API_PREFIX}/service-records/${recordId}`);
    
    // Mock 数据
    const record = mockServiceData.find(r => r.id === recordId);
    if (!record) {
      throw new Error('服务记录不存在');
    }
    return record;
  },

  createServiceRecord: async (data: ServiceRecordCreateData): Promise<ServiceRecord> => {
    await delay();
    // 真实 API 调用已注释
    // return api.post<ServiceRecord>(`${API_PREFIX}/service-records/`, data);
    
    // Mock 数据
    const newRecord: ServiceRecord = {
      id: `SERVICE_${Date.now()}`,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockServiceData.push(newRecord);
    return newRecord;
  },

  updateServiceRecord: async (recordId: string, data: Partial<ServiceRecordCreateData>): Promise<ServiceRecord> => {
    await delay();
    // 真实 API 调用已注释
    // return api.patch<ServiceRecord>(`${API_PREFIX}/service-records/${recordId}`, data);
    
    // Mock 数据
    const recordIndex = mockServiceData.findIndex(r => r.id === recordId);
    if (recordIndex === -1) {
      throw new Error('服务记录不存在');
    }
    mockServiceData[recordIndex] = {
      ...mockServiceData[recordIndex],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return mockServiceData[recordIndex];
  },

  deleteServiceRecord: async (recordId: string): Promise<{ message: string }> => {
    await delay();
    // 真实 API 调用已注释
    // return api.delete<{ message: string }>(`${API_PREFIX}/service-records/${recordId}`);
    
    // Mock 数据
    const recordIndex = mockServiceData.findIndex(r => r.id === recordId);
    if (recordIndex === -1) {
      throw new Error('服务记录不存在');
    }
    mockServiceData.splice(recordIndex, 1);
    return { message: '服务记录删除成功' };
  },
};

