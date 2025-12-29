// import { api } from '../utils/request';
import { allOrders, type Order as MockOrder, OrderStatus } from '../mock/orderData';

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  pet_id?: string;
  product_id?: string;
  quantity: number;
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  service_name?: string;
  service_price?: number;
  shipping_address?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface OrderListResponse {
  data: Order[];
  count: number;
}

export interface OrderCreateData {
  pet_id?: string;
  product_id?: string;
  quantity: number;
  total_amount?: number;
  status?: 'pending' | 'completed' | 'cancelled';
  service_name?: string;
  service_price?: number;
  shipping_address?: string;
  notes?: string;
}

export interface OrderCreateWithValidation {
  pet_id: string;
  product_id: string;
  quantity: number;
  service_name: string;
  service_price: number;
  shipping_address: string;
  notes?: string;
}

export interface OrderListParams {
  skip?: number;
  limit?: number;
  user_id?: string;
  status?: 'pending' | 'completed' | 'cancelled';
}

export interface OrderLog {
  id: string;
  order_id: string;
  action: string;
  details?: string;
  created_at: string;
}

export interface OrderLogListResponse {
  data: OrderLog[];
  count: number;
}

// 将 Mock 数据转换为 API 格式
const convertMockOrderToApiOrder = (mockOrder: MockOrder, userId: string = '1'): Order => {
  const statusMap: Record<OrderStatus, 'pending' | 'completed' | 'cancelled'> = {
    [OrderStatus.PENDING]: 'pending',
    [OrderStatus.COMPLETED]: 'completed',
    [OrderStatus.CANCELLED]: 'cancelled',
  };

  return {
    id: mockOrder.id,
    order_number: mockOrder.id,
    user_id: userId,
    pet_id: `PET${Math.floor(Math.random() * 20) + 1}`,
    quantity: mockOrder.quantity,
    total_amount: mockOrder.totalAmount,
    status: statusMap[mockOrder.status],
    service_name: mockOrder.serviceName,
    service_price: mockOrder.servicePrice,
    shipping_address: '默认地址',
    notes: mockOrder.notes,
    created_at: mockOrder.orderTime,
    updated_at: mockOrder.orderTime,
  };
};

// Mock 数据存储（基于 allOrders）
let mockOrderData: Order[] = allOrders.map(order => convertMockOrderToApiOrder(order));

// 模拟延迟
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

const API_PREFIX = '/v1';

export const orderApi = {
  // 使用 Mock 数据 - 已注释真实 API 调用
  getOrderList: async (params?: OrderListParams): Promise<OrderListResponse> => {
    await delay();
    // 真实 API 调用已注释
    // return api.get<OrderListResponse>(`${API_PREFIX}/orders/`, { params });
    
    // Mock 数据
    let filteredData = [...mockOrderData];
    
    // 根据 user_id 过滤
    if (params?.user_id) {
      filteredData = filteredData.filter(order => order.user_id === params.user_id);
    }
    
    // 根据 status 过滤
    if (params?.status) {
      filteredData = filteredData.filter(order => order.status === params.status);
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

  getOrderById: async (orderId: string): Promise<Order> => {
    await delay();
    // 真实 API 调用已注释
    // return api.get<Order>(`${API_PREFIX}/orders/${orderId}`);
    
    // Mock 数据
    const order = mockOrderData.find(o => o.id === orderId || o.order_number === orderId);
    if (!order) {
      throw new Error('订单不存在');
    }
    return order;
  },

  createOrder: async (data: OrderCreateData): Promise<Order> => {
    await delay();
    // 真实 API 调用已注释
    // return api.post<Order>(`${API_PREFIX}/orders/`, data);
    
    // Mock 数据
    const newOrder: Order = {
      id: `ORDER${String(mockOrderData.length + 1).padStart(4, '0')}`,
      order_number: `ORDER${String(mockOrderData.length + 1).padStart(4, '0')}`,
      user_id: '1',
      quantity: data.quantity,
      total_amount: data.total_amount || (data.service_price || 0) * data.quantity,
      status: data.status || 'pending',
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockOrderData.push(newOrder);
    return newOrder;
  },

  createOrderWithValidation: async (data: OrderCreateWithValidation): Promise<Order> => {
    await delay();
    // 真实 API 调用已注释
    // return api.post<Order>(`${API_PREFIX}/orders/create`, data);
    
    // Mock 数据
    const newOrder: Order = {
      id: `ORDER${String(mockOrderData.length + 1).padStart(4, '0')}`,
      order_number: `ORDER${String(mockOrderData.length + 1).padStart(4, '0')}`,
      user_id: '1',
      pet_id: data.pet_id,
      product_id: data.product_id,
      quantity: data.quantity,
      total_amount: data.service_price * data.quantity,
      status: 'pending',
      service_name: data.service_name,
      service_price: data.service_price,
      shipping_address: data.shipping_address,
      notes: data.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockOrderData.push(newOrder);
    return newOrder;
  },

  updateOrder: async (orderId: string, data: Partial<OrderCreateData>): Promise<Order> => {
    await delay();
    // 真实 API 调用已注释
    // return api.patch<Order>(`${API_PREFIX}/orders/${orderId}`, data);
    
    // Mock 数据
    const orderIndex = mockOrderData.findIndex(o => o.id === orderId || o.order_number === orderId);
    if (orderIndex === -1) {
      throw new Error('订单不存在');
    }
    mockOrderData[orderIndex] = {
      ...mockOrderData[orderIndex],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return mockOrderData[orderIndex];
  },

  deleteOrder: async (orderId: string): Promise<{ message: string }> => {
    await delay();
    // 真实 API 调用已注释
    // return api.delete<{ message: string }>(`${API_PREFIX}/orders/${orderId}`);
    
    // Mock 数据
    const orderIndex = mockOrderData.findIndex(o => o.id === orderId || o.order_number === orderId);
    if (orderIndex === -1) {
      throw new Error('订单不存在');
    }
    mockOrderData.splice(orderIndex, 1);
    return { message: '订单删除成功' };
  },

  getOrderLogs: async (orderId: string, params?: { skip?: number; limit?: number }): Promise<OrderLogListResponse> => {
    await delay();
    // 真实 API 调用已注释
    // return api.get<OrderLogListResponse>(`${API_PREFIX}/orders/${orderId}/logs`, { params });
    
    // Mock 数据
    const mockLogs: OrderLog[] = [
      {
        id: '1',
        order_id: orderId,
        action: '创建订单',
        details: '订单已创建',
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        order_id: orderId,
        action: '更新状态',
        details: '订单状态已更新',
        created_at: new Date().toISOString(),
      },
    ];
    
    const skip = params?.skip || 0;
    const limit = params?.limit || 10;
    const data = mockLogs.slice(skip, skip + limit);
    
    return {
      data,
      count: mockLogs.length,
    };
  },

  getOrderLogById: async (orderId: string, logId: string): Promise<OrderLog> => {
    await delay();
    // 真实 API 调用已注释
    // return api.get<OrderLog>(`${API_PREFIX}/orders/${orderId}/logs/${logId}`);
    
    // Mock 数据
    const log: OrderLog = {
      id: logId,
      order_id: orderId,
      action: '查看日志',
      details: '订单日志详情',
      created_at: new Date().toISOString(),
    };
    return log;
  },
};

