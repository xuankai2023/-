import React, { useRef, useEffect } from 'react';
import { Arrow } from '@react-vant/icons';
import { Card, Button, Space, Grid, GridItem, Tag } from 'react-vant';
import * as echarts from 'echarts';

// 图表组件
const EChartsChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
      
      const option = {
        title: {
          text: '月度数据统计',
          left: 'center',
          textStyle: { fontSize: 16, fontWeight: 'bold' }
        },
        tooltip: { trigger: 'axis' },
        legend: {
          data: ['宠物美容', '医疗服务', '食品用品', '寄养服务'],
          right: 10,
          top: 20,
          textStyle: { fontSize: 12 }
        },
        grid: { left: '5%', right: '5%', bottom: '15%', top: '15%', containLabel: true },
        xAxis: {
          type: 'category',
          data: ['11/1', '11/5', '11/10', '11/15', '11/20', '11/25', '11/30']
        },
        yAxis: { type: 'value', name: '数量' },
        series: [
          { name: '宠物美容', type: 'bar', data: [320, 280, 360, 450, 410, 510, 610], itemStyle: { color: '#1890ff' } },
          { name: '医疗服务', type: 'bar', data: [220, 180, 260, 340, 390, 430, 510], itemStyle: { color: '#52c41a' } },
          { name: '食品用品', type: 'line', data: [410, 430, 470, 550, 500, 610, 700], symbolSize: 6, lineStyle: { width: 2 }, itemStyle: { color: '#f5222d' } },
          { name: '寄养服务', type: 'line', data: [150, 180, 200, 220, 240, 280, 320], symbolSize: 6, lineStyle: { width: 2 }, itemStyle: { color: '#faad14' } }
        ]
      };

      chartInstance.current.setOption(option);

      const resizeHandler = () => chartInstance.current?.resize();
      window.addEventListener('resize', resizeHandler);
      return () => {
        window.removeEventListener('resize', resizeHandler);
        chartInstance.current?.dispose();
      };
    }
  }, []);

  return <div ref={chartRef} style={{ height: '360px', width: '100%' }} />;
};

// 数据指标卡片 —— 使用 Grid + 自定义内容（符合 vant 规范）
const MetricCard: React.FC = () => {
  return (
    <Card round style={{ marginBottom: 20 }}>
      <Grid gutter={10}>
        {/* 宠物总数 */}
        <GridItem>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>684</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>宠物总数</div>
            <div style={{ fontSize: 10, color: '#52c41a', marginTop: 2 }}>↑ 8.2%</div>
          </div>
        </GridItem>

        {/* 本月订单 */}
        <GridItem>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>236</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>本月订单</div>
            <div style={{ fontSize: 10, color: '#52c41a', marginTop: 2 }}>↑ 12.5%</div>
          </div>
        </GridItem>

        {/* 库存商品 */}
        <GridItem>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>1,245</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>库存商品</div>
            <div style={{ fontSize: 10, color: '#52c41a', marginTop: 2 }}>充足</div>
          </div>
        </GridItem>

        {/* 会员总数 */}
        <GridItem>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>5,387</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>会员总数</div>
            <div style={{ fontSize: 10, color: '#52c41a', marginTop: 2 }}>↑ 6.7%</div>
          </div>
        </GridItem>
      </Grid>
    </Card>
  );
};

// 最近订单项
const OrderItem: React.FC<{ 
  id: string; 
  customer: string; 
  time: string; 
  amount: string; 
  status: 'completed' | 'processing'; 
}> = ({ id, customer, time, amount, status }) => {
  const statusConfig = {
    completed: { text: '已完成', color: 'success' },
    processing: { text: '进行中', color: 'warning' }
  }[status];

  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '12px 0' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: status === 'completed' ? '#e6f7ff' : '#fff7e6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontWeight: 'bold', color: status === 'completed' ? '#1890ff' : '#fa8c16' }}>
          {id.startsWith('ORD') ? 'C' : id.startsWith('SER') ? 'S' : 'E'}
        </span>
      </div>
      <div style={{ flex: 1, marginLeft: 12 }}>
        <div style={{ fontWeight: 500, fontSize: 14 }}>{id}</div>
        <div style={{ color: '#999', fontSize: 12 }}>{customer} · {time}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 500, fontSize: 14 }}>{amount}</div>
        <Tag type={statusConfig.color as any}  style={{ marginTop: 4 }}>{statusConfig.text}</Tag>
      </div>
    </div>
  );
};

// 主内容组件
const MainContent: React.FC = () => {
  return (
    <div style={{ padding: '15px' }}>
      {/* 数据指标 */}
      <MetricCard />

      {/* 图表 */}
      <Card round style={{ marginBottom: 20 }}>
        <Card.Header
         
          extra={<Button type="primary" size="mini">查看详情</Button>}
        />
        <Card.Body style={{ paddingTop: 0 }}>
          <EChartsChart />
        </Card.Body>
      </Card>

      {/* 最近订单 */}
      <Card round>
        <Card.Header
        
          extra={<Button type="primary" size="mini">查看全部</Button>}
        />
        <Card.Body style={{ padding: 0 }}>
          <OrderItem
            id="ORD-2023-0875"
            customer="张明"
            time="2023-11-30 14:30"
            amount="¥580.00"
            status="completed"
          />
          <div style={{ height: 1, backgroundColor: '#f0f0f0' }}></div>
          <OrderItem
            id="SER-2023-0451"
            customer="王芳"
            time="2023-11-30 10:00"
            amount="¥280.00"
            status="processing"
          />
          <div style={{ height: 1, backgroundColor: '#f0f0f0' }}></div>
          <OrderItem
            id="EMG-2023-019"
            customer="赵敏"
            time="2023-11-30 18:00"
            amount="¥89.00"
            status="processing"
          />
        </Card.Body>
        <Card.Footer>
          <Button block type="primary" size="small">
            查看全部订单
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default MainContent;