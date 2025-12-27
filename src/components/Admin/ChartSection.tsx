import React, { useState, useMemo, useCallback } from 'react';
import { Button, Space } from 'antd';
import CombinedChart from './CombinedChart';
import { allOrders } from '../../mock/orderData';
import { useOrderSearch } from './hooks/useOrderSearch';

type TimeRange = 'week' | 'month' | 'year';

const ChartSection: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  // 根据时间范围计算日期范围
  const dateRange = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return [
      startDate.toISOString().split('T')[0],
      now.toISOString().split('T')[0],
    ] as [string, string];
  }, [timeRange]);

  // 使用搜索 Hook 筛选订单
  const { filteredOrders } = useOrderSearch({
    orders: allOrders,
    initialFilters: {
      dateRange,
    },
  });

  // 处理时间范围切换
  const handleTimeRangeChange = useCallback((range: TimeRange) => {
    setTimeRange(range);
  }, []);

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '18px',
            color: '#333',
          }}
        >
          数据统计
        </h2>

        <Space>
          <Button
            type={timeRange === 'week' ? 'primary' : 'default'}
            size="small"
            onClick={() => handleTimeRangeChange('week')}
          >
            本周
          </Button>
          <Button
            type={timeRange === 'month' ? 'primary' : 'default'}
            size="small"
            onClick={() => handleTimeRangeChange('month')}
          >
            本月
          </Button>
          <Button
            type={timeRange === 'year' ? 'primary' : 'default'}
            size="small"
            onClick={() => handleTimeRangeChange('year')}
          >
            全年
          </Button>
        </Space>
      </div>

      {/* 组合图表 - 传递筛选后的订单数据 */}
      <CombinedChart orders={filteredOrders} timeRange={timeRange} />
    </div>
  );
};

export default ChartSection;