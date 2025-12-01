import React from 'react';
import OrderTable from './OrderTable';

const OrderListSection: React.FC = () => {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      marginBottom: '24px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '18px',
          color: '#333'
        }}>
          最新订单
        </h2>
        
        <button style={{
          padding: '6px 16px',
          border: '1px solid #1890ff',
          borderRadius: '4px',
          backgroundColor: 'white',
          color: '#1890ff',
          cursor: 'pointer',
          fontSize: '14px'
        }}>
          查看全部
        </button>
      </div>
      
      {/* 订单表格 */}
      <OrderTable />
    </div>
  );
};

export default OrderListSection;