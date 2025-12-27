import React, { useRef, useEffect, useMemo } from 'react';
import * as echarts from 'echarts';
import { Order } from '../../mock/orderData';
import { format, startOfWeek, startOfMonth, startOfYear, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';

interface CombinedChartProps {
  orders: Order[];
  timeRange: 'week' | 'month' | 'year';
}

const CombinedChart: React.FC<CombinedChartProps> = ({ orders, timeRange }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // 根据时间范围生成图表数据
  const chartData = useMemo(() => {
    const now = new Date();
    let timeLabels: string[] = [];
    let salesData: number[] = [];
    let orderCountData: number[] = [];

    // 根据时间范围分组数据
    if (timeRange === 'week') {
      const start = startOfWeek(now, { weekStartsOn: 1 });
      const days = eachDayOfInterval({ start, end: now });
      timeLabels = days.map((day) => format(day, 'MM/dd'));
      
      days.forEach((day) => {
        const dayStart = new Date(day.setHours(0, 0, 0, 0));
        const dayEnd = new Date(day.setHours(23, 59, 59, 999));
        const dayOrders = orders.filter((order) => {
          const orderDate = new Date(order.orderTime);
          return orderDate >= dayStart && orderDate <= dayEnd;
        });
        salesData.push(dayOrders.reduce((sum, o) => sum + o.totalAmount, 0));
        orderCountData.push(dayOrders.length);
      });
    } else if (timeRange === 'month') {
      const start = startOfMonth(now);
      const weeks = eachWeekOfInterval({ start, end: now }, { weekStartsOn: 1 });
      timeLabels = weeks.map((week) => `第${weeks.indexOf(week) + 1}周`);
      
      weeks.forEach((week) => {
        const weekEnd = new Date(week);
        weekEnd.setDate(weekEnd.getDate() + 6);
        const weekOrders = orders.filter((order) => {
          const orderDate = new Date(order.orderTime);
          return orderDate >= week && orderDate <= weekEnd;
        });
        salesData.push(weekOrders.reduce((sum, o) => sum + o.totalAmount, 0));
        orderCountData.push(weekOrders.length);
      });
    } else {
      // year
      const start = startOfYear(now);
      const months = eachMonthOfInterval({ start, end: now });
      timeLabels = months.map((month) => format(month, 'M月'));
      
      months.forEach((month) => {
        const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
        const monthOrders = orders.filter((order) => {
          const orderDate = new Date(order.orderTime);
          return orderDate >= month && orderDate <= monthEnd;
        });
        salesData.push(monthOrders.reduce((sum, o) => sum + o.totalAmount, 0));
        orderCountData.push(monthOrders.length);
      });
    }

    return { timeLabels, salesData, orderCountData };
  }, [orders, timeRange]);

  // 初始化图表
  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        data: ['销售额', '订单量'],
        right: 10,
        top: 10,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartData.timeLabels,
      },
      yAxis: [
        {
          type: 'value',
          name: '销售额 (¥)',
          position: 'left',
          axisLabel: {
            formatter: (value: number) => `¥${value}`,
          },
        },
        {
          type: 'value',
          name: '订单量',
          position: 'right',
        },
      ],
      series: [
        {
          name: '销售额',
          type: 'bar',
          yAxisIndex: 0,
          data: chartData.salesData,
          itemStyle: {
            color: '#91d5ff',
          },
        },
        {
          name: '订单量',
          type: 'line',
          yAxisIndex: 1,
          data: chartData.orderCountData,
          itemStyle: {
            color: '#ff7875',
          },
          lineStyle: {
            width: 2,
          },
          symbolSize: 6,
        },
      ],
    };

    chartInstance.current.setOption(option);

    const resizeHandler = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [chartData]);

  return <div ref={chartRef} style={{ height: '400px', width: '100%' }} />;
};

export default CombinedChart;