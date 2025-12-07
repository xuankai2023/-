

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
  const serviceNames = [
    '宠物洗护', '宠物美容', '宠物寄养', '宠物训练', 
    '宠物医疗', '宠物摄影', '宠物上门服务', '宠物用品配送'
  ];
  
  return Array.from({ length: count }, (_, index) => {
    const id = `ORDER${String(index + 1).padStart(4, '0')}`;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const serviceIndex = Math.floor(Math.random() * serviceNames.length);
    const serviceName = serviceNames[serviceIndex];
    const servicePrice = 50 + Math.floor(Math.random() * 250); // 50-300元的服务价格
    const quantity = 1 + Math.floor(Math.random() * 3); // 1-3个服务项
    const totalAmount = servicePrice * quantity;
    
    return {
      id,
      customerName: `客户${index + 1}`,
      customerPhone: `138${String(index).padStart(8, '0')}`,
      customerAvatar: `/demo_avatar_${(index % 5) + 1}.jpg`,
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
  },
  {
    title: '订单状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '下单时间',
    dataIndex: 'orderTime',
    key: 'orderTime',
  },
  {
    title: '操作',
    key: 'action',
  },
];