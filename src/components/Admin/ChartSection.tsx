import React from 'react';
import CombinedChart from './CombinedChart';

const ChartSection: React.FC = () => {
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
          月度数据统计
        </h2>
        
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          <button style={{
            padding: '6px 16px',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            本周
          </button>
          <button style={{
            padding: '6px 16px',
            border: '1px solid #1890ff',
            borderRadius: '4px',
            backgroundColor: '#1890ff',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            本月
          </button>
          <button style={{
            padding: '6px 16px',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            全年
          </button>
        </div>
      </div>
      
      {/* 组合图表 */}
      <CombinedChart />
    </div>
  );
};

export default ChartSection;