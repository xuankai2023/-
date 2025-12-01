import React from 'react';
import OrderItem from './OrderItem';

interface OrderData {
  id: string;
  customer: string;
  amount: string;
  products: string;
  status: string;
  statusColor: string;
}

const OrderTable: React.FC = () => {
  const orderData: OrderData[] = [
    {
      id: '08202311310001',
      customer: '李明',
      amount: '¥1,660',
      products: '狗粮×2，零食×3',
      status: '已完成',
      statusColor: '#52c41a'
    },
    {
      id: '08202311310002',
      customer: '王琳',
      amount: '¥2,450',
      products: '金毛犬粮，玩具，牵引绳',
      status: '进行中',
      statusColor: '#faad14'
    },
    {
      id: '08202311310003',
      customer: '张小红',
      amount: '¥1,120',
      products: '猫砂，猫罐头，猫条',
      status: '待支付',
      statusColor: '#f5222d'
    },
    {
      id: '08202311310004',
      customer: '赵小刚',
      amount: '¥890',
      products: '宠物窝，宠物垫',
      status: '已完成',
      statusColor: '#52c41a'
    }
  ];

  return (
    <div style={{
      overflowX: 'auto'
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px'
      }}>
        <thead>
          <tr style={{
            backgroundColor: '#fafafa',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <th style={{
              padding: '12px',
              textAlign: 'left',
              fontWeight: 'bold',
              color: '#666',
              borderBottom: '1px solid #f0f0f0'
            }}>
              订单编号
            </th>
            <th style={{
              padding: '12px',
              textAlign: 'left',
              fontWeight: 'bold',
              color: '#666',
              borderBottom: '1px solid #f0f0f0'
            }}>
              客户
            </th>
            <th style={{
              padding: '12px',
              textAlign: 'left',
              fontWeight: 'bold',
              color: '#666',
              borderBottom: '1px solid #f0f0f0'
            }}>
              订单金额
            </th>
            <th style={{
              padding: '12px',
              textAlign: 'left',
              fontWeight: 'bold',
              color: '#666',
              borderBottom: '1px solid #f0f0f0'
            }}>
              订购商品
            </th>
            <th style={{
              padding: '12px',
              textAlign: 'left',
              fontWeight: 'bold',
              color: '#666',
              borderBottom: '1px solid #f0f0f0'
            }}>
              订单状态
            </th>
            <th style={{
              padding: '12px',
              textAlign: 'left',
              fontWeight: 'bold',
              color: '#666',
              borderBottom: '1px solid #f0f0f0'
            }}>
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          {orderData.map((order, index) => (
            <OrderItem key={order.id} order={order} isLast={index === orderData.length - 1} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;