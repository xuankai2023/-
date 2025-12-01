import React from 'react';

const CombinedChart: React.FC = () => {
  // 模拟图表数据
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月'];
  const barData = [350, 300, 400, 350, 450, 400, 500];
  const lineData = [150, 200, 250, 280, 320, 380, 420];

  return (
    <div style={{
      height: '400px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* 图表占位符 */}
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 横轴标签 */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '40px',
          right: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          color: '#666',
          fontSize: '12px'
        }}>
          {months.map((month, index) => (
            <span key={index}>{month}</span>
          ))}
        </div>
        
        {/* 模拟柱状图 */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '40px',
          right: '40px',
          height: '280px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end'
        }}>
          {barData.map((value, index) => (
            <div
              key={index}
              style={{
                width: '30px',
                height: `${(value / 500) * 280}px`,
                backgroundColor: '#91d5ff',
                borderRadius: '4px 4px 0 0',
                position: 'relative'
              }}
            />
          ))}
        </div>
        
        {/* 模拟折线图 */}
        <svg
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            right: '40px',
            height: '280px',
            width: 'calc(100% - 80px)'
          }}
          viewBox={`0 0 700 280`}
        >
          <path
            d={`M 0,280 L ${lineData.map((value, index) => `${index * 100},${280 - (value / 420) * 280}`).join(' L ')}`}
            fill="none"
            stroke="#ff7875"
            strokeWidth="2"
          />
          {lineData.map((value, index) => (
            <circle
              key={index}
              cx={index * 100}
              cy={280 - (value / 420) * 280}
              r="4"
              fill="#ff7875"
            />
          ))}
        </svg>
        
        {/* 图例 */}
        <div style={{
          position: 'absolute',
          top: '0',
          right: '0',
          display: 'flex',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#91d5ff' }}></div>
            <span style={{ fontSize: '12px', color: '#666' }}>销售额</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#ff7875' }}></div>
            <span style={{ fontSize: '12px', color: '#666' }}>订单量</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedChart;