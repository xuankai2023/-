import { create } from 'zustand';

// 定义宠物类型
interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  avatar?: string;
  tags?: string[];
  healthStatus?: string;
}

// 定义房间类型
interface Room {
  id: string;
  number: string;
  type: '豪华单间' | '标准间' | '猫别墅';
  status: '空闲' | '已入住' | '维护中';
  price?: number;
  pet?: Pet;
  stayDays?: number;
  maintenanceInfo?: string;
}

// 定义预约类型
interface Booking {
  id: string;
  pet: Pet;
  owner: {
    name: string;
    phone: string;
  };
  dates: {
    start: string;
    end: string;
    days: number;
  };
  roomType: string;
  healthStatus: string;
  status: '待审核' | '已通过' | '已拒绝';
}

// 定义仪表盘数据类型
interface DashboardData {
  vacancyRate: number;
  remainingRooms: number;
  totalRooms: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  todoCount: number;
  healthAlerts: {
    count: number;
    items: string[];
  };
  inStorePets: {
    total: number;
    dogs: number;
    cats: number;
  };
  todayStats: {
    checkIn: number;
    checkOut: number;
  };
}

// 定义状态类型
interface BoardState {
  // 仪表盘数据
  dashboardData: DashboardData;
  // 房态管理数据
  rooms: Room[];
  // 寄养预约数据
  bookings: Booking[];
  
  // 操作方法
  // 仪表盘相关
  updateDashboardData: (data: Partial<DashboardData>) => void;
  
  // 房态管理相关
  addRoom: (room: Room) => void;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  removeRoom: (id: string) => void;
  
  // 寄养预约相关
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  removeBooking: (id: string) => void;
  
  // 模拟数据加载
  loadMockData: () => void;
}

// 创建store
export const useBoardStore = create<BoardState>((set) => ({
  // 初始状态
  dashboardData: {
    vacancyRate: 62,
    remainingRooms: 18,
    totalRooms: 29,
    monthlyRevenue: 18750,
    revenueGrowth: 12,
    todoCount: 5,
    healthAlerts: {
      count: 3,
      items: ['小橘: 驱虫药明日到期', '多多: 软便观察第2天']
    },
    inStorePets: {
      total: 28,
      dogs: 15,
      cats: 13
    },
    todayStats: {
      checkIn: 3,
      checkOut: 2
    }
  },
  
  rooms: [
    {
      id: '1',
      number: 'A-101',
      type: '豪华单间',
      status: '已入住',
      price: 120,
      pet: {
        id: 'pet-1',
        name: '旺财',
        breed: '柯基 · 3岁',
        age: 3,
        avatar: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100&h=100&fit=crop',
        tags: ['怕生', '过敏源:鸡肉']
      },
      stayDays: 3
    },
    {
      id: '2',
      number: 'C-202',
      type: '猫别墅',
      status: '已入住',
      price: 80,
      pet: {
        id: 'pet-2',
        name: '小橘',
        breed: '中华田园 · 2岁',
        age: 2,
        avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&h=100&fit=crop',
        tags: ['需每日梳毛']
      }
    },
    {
      id: '3',
      number: 'A-102',
      type: '豪华单间',
      status: '空闲',
      price: 120
    },
    {
      id: '4',
      number: 'B-105',
      type: '标准间',
      status: '维护中',
      price: 80,
      maintenanceInfo: '预计明日恢复'
    }
  ],
  
  bookings: [
    {
      id: 'booking-1',
      pet: {
        id: 'pet-3',
        name: '豆豆',
        breed: '泰迪 · 1岁',
        age: 1
      },
      owner: {
        name: '李女士',
        phone: '138****8888'
      },
      dates: {
        start: '10月1日',
        end: '10月5日',
        days: 5
      },
      roomType: '标准间',
      healthStatus: '疫苗齐全',
      status: '待审核'
    },
    {
      id: 'booking-2',
      pet: {
        id: 'pet-4',
        name: '哈雷',
        breed: '哈士奇 · 4岁',
        age: 4
      },
      owner: {
        name: '张先生',
        phone: '139****9999'
      },
      dates: {
        start: '今日',
        end: '今日 14:00',
        days: 1
      },
      roomType: '豪华单间',
      healthStatus: '疫苗齐全',
      status: '待审核'
    }
  ],
  
  // 操作方法
  updateDashboardData: (data) => set((state) => ({
    dashboardData: { ...state.dashboardData, ...data }
  })),
  
  addRoom: (room) => set((state) => ({
    rooms: [...state.rooms, room]
  })),
  
  updateRoom: (id, updates) => set((state) => ({
    rooms: state.rooms.map(room => 
      room.id === id ? { ...room, ...updates } : room
    )
  })),
  
  removeRoom: (id) => set((state) => ({
    rooms: state.rooms.filter(room => room.id !== id)
  })),
  
  addBooking: (booking) => set((state) => ({
    bookings: [...state.bookings, booking]
  })),
  
  updateBooking: (id, updates) => set((state) => ({
    bookings: state.bookings.map(booking => 
      booking.id === id ? { ...booking, ...updates } : booking
    )
  })),
  
  removeBooking: (id) => set((state) => ({
    bookings: state.bookings.filter(booking => booking.id !== id)
  })),
  
  loadMockData: () => set((state) => {
    // 这里可以添加模拟数据加载逻辑
    // 目前使用初始状态中的模拟数据
    return state;
  })
}));
