import React from 'react';

interface Order {
  id: string;
  customer: string;
  amount: string;
  products: string;
  status: string;
  statusColor: string;
}

interface OrderItemProps {
  order: Order;
  isLast: boolean;
}

const OrderItem: React.FC<OrderItemProps> = ({ order, isLast }) => {
  return (
    <tr style={{
      borderBottom: isLast ? 'none' : '1px solid #f0f0f0'
    }}>
      <td style={{
        padding: '12px',
        color: '#333'
      }}>
        {order.id}
      </td>
      <td style={{
        padding: '12px',
        color: '#333'
      }}>
        {order.customer}
      </td>
      <td style={{
        padding: '12px',
        color: '#f5222d',
        fontWeight: 'bold'
      }}>
        {order.amount}
      </td>
      <td style={{
        padding: '12px',
        color: '#666'
      }}>
        {order.products}
      </td>
      <td style={{
        padding: '12px'
      }}>
        <span style={{
          backgroundColor: `${order.statusColor}20`,
          color: order.statusColor,
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {order.status}
        </span>
      </td>
      <td style={{
        padding: '12px'
      }}>
        <button style={{
          padding: '4px 12px',
          border: '1px solid #1890ff',
          borderRadius: '4px',
          backgroundColor: 'white',
          color: '#1890ff',
          cursor: 'pointer',
          fontSize: '12px',
          marginRight: '8px'
        }}>
          详情
        </button>
        <button style={{
          padding: '4px 12px',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          backgroundColor: 'white',
          color: '#666',
          cursor: 'pointer',
          fontSize: '12px'
        }}>
          编辑
        </button>
      </td>
    </tr>
  );
};

export default OrderItem;