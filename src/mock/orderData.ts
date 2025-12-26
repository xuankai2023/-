// 订单状态枚举
export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// 订单接口定义
export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAvatar: string;
  petImage: string;
  petName: string;
  petType: string;
  serviceName: string;
  servicePrice: number;
  totalAmount: number;
  quantity: number;
  orderTime: string;
  scheduledTime: string;
  status: OrderStatus;
  notes: string;
}

// 生成模拟订单数据的函数
export const generateMockOrders = (count: number): Order[] => {
  const statuses = Object.values(OrderStatus);
  const petTypes = ['狗', '猫', '兔子', '仓鼠', '鸟类'];

  // ✅ 修复：直接定义 petImages 数组，不要嵌套 const
  const petImages = [
    // 🐕 狗
    'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=600&q=80',
    // 🐈 猫
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    // 🐇 兔子
    'https://images.unsplash.com/photo-1615511220277-a0e0a5c4d3f0?auto=format&fit=crop&w=600&q=80',
    // 🐹 仓鼠
    'https://images.unsplash.com/photo-1591955114990-82887c72dfbd?auto=format&fit=crop&w=600&q=80',
    // 🐦 鸟类（鹦鹉）
    'https://images.unsplash.com/photo-1585577785052-792546427543?auto=format&fit=crop&w=600&q=80',
    // 🐊 乌龟
    'https://images.unsplash.com/photo-1565175174395-669584311518?auto=format&fit=crop&w=600&q=80',
    // 🐱 小猫（另一种风格）
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    // 🐶 金毛犬（备用）
    'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=600&q=80',
    // 🐰 白兔（备用）
    'https://images.unsplash.com/photo-1615511220277-a0e0a5c4d3f0?auto=format&fit=crop&w=600&q=80',
    // 🐾 宠物通用（可爱小动物）
    'https://images.unsplash.com/photo-1558648821-619098319763?auto=format&fit=crop&w=600&q=80'
  ];

  const serviceNames = [
    '宠物洗护', '宠物美容', '宠物寄养', '宠物训练',
    '宠物医疗', '宠物摄影', '宠物上门服务', '宠物用品配送'
  ];

  return Array.from({ length: count }, (_, index) => {
    const id = `ORDER${String(index + 1).padStart(4, '0')}`;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const serviceIndex = Math.floor(Math.random() * serviceNames.length);
    const serviceName = serviceNames[serviceIndex];
    const servicePrice = 50 + Math.floor(Math.random() * 250); // 50-300元
    const quantity = 1 + Math.floor(Math.random() * 3); // 1-3
    const totalAmount = servicePrice * quantity;

    // ✅ 从 petImages 中循环取图（避免越界）
    const petImage = petImages[index % petImages.length];

    return {
      id,
      customerName: `客户${index + 1}`,
      customerPhone: `138${String(index).padStart(8, '0')}`,
      customerAvatar: petImage, // 复用宠物图作为客户头像（或可单独定义）
      petImage,
      petName: `宠物${index + 1}`,
      petType: petTypes[Math.floor(Math.random() * petTypes.length)],
      serviceName,
      servicePrice,
      totalAmount,
      quantity,
      orderTime: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      scheduledTime: new Date(Date.now() + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      status,
      notes: `这是订单${id}的备注信息，包含宠物特殊需求。`
    };
  });
};

// 生成40个模拟订单
export const allOrders = generateMockOrders(40);

// 根据状态分类订单
export const pendingOrders = allOrders.filter(order => order.status === OrderStatus.PENDING);
export const completedOrders = allOrders.filter(order => order.status === OrderStatus.COMPLETED);
export const cancelledOrders = allOrders.filter(order => order.status === OrderStatus.CANCELLED);

// 订单数据表格的列定义
export const orderTableColumns = [
  {
    title: '订单编号',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '客户信息',
    key: 'customer',
    dataIndex: ['customerName', 'customerPhone'],
  },
  {
    title: '宠物信息',
    key: 'pet',
    dataIndex: ['petName', 'petType'],
  },
  {
    title: '服务项目',
    dataIndex: 'serviceName',
    key: 'serviceName',
  },
  {
    title: '订单金额',
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    render: (value: number) => `¥${value.toFixed(2)}`, // 可选：格式化金额
  },
  {
    title: '订单状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: OrderStatus) => {
      const map: Record<OrderStatus, string> = {
        [OrderStatus.PENDING]: '待处理',
        [OrderStatus.COMPLETED]: '已完成',
        [OrderStatus.CANCELLED]: '已取消',
      };
      return map[status];
    },
  },
  {
    title: '下单时间',
    dataIndex: 'orderTime',
    key: 'orderTime',
    render: (time: string) => new Date(time).toLocaleString('zh-CN'),
  },
  {
    title: '操作',
    key: 'action',
  },
];