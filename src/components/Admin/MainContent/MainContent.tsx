import React, { useRef, useEffect } from 'react';
import { ArrowRightOutlined, LikeOutlined } from '@ant-design/icons';
import { Card, Button, Space, Row, Col, Tag, Image, message } from 'antd';
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

// 数据指标卡片 —— 使用 Row + Col + Card（符合 Ant Design 规范）
const MetricCard: React.FC = () => {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
      <Col xs={12} sm={12} md={6}>
        <Card hoverable>
          <div style={{ textAlign: 'center', padding: 16 }}>
            <div 
              style={{ width: 80, height: 80, marginBottom: 16, cursor: 'pointer' }} 
              onClick={() => message.info('点击了Cover区域')}
            >
              <img src='/public/images/svg/仓鼠.svg' style={{ width: '100%', height: '100%' }} />
            </div>
            <div 
              style={{ fontSize: 16, fontWeight: 500, marginBottom: 16, cursor: 'pointer' }} 
              onClick={() => message.info('点击了Header区域')}
            >
              宠物总数
              <ArrowRightOutlined style={{ marginLeft: 8 }} />
            </div>
            <div onClick={() => message.info('点击了Body区域')}>
              
            </div>
            <Space style={{ marginTop: 16 }}>
              <Button size='small'>
                更多
              </Button>
              <Button
                icon={<LikeOutlined />}
                type='primary'
                danger
                size='small'
              >
                Like
              </Button>
            </Space>
          </div>
        </Card>
      </Col>

      <Col xs={12} sm={12} md={6}>
        <Card hoverable>
          <div style={{ textAlign: 'center', padding: 16 }}>
            <div 
              style={{ width: 80, height: 80, marginBottom: 16, cursor: 'pointer' }} 
              onClick={() => message.info('点击了Cover区域')}
            >
              <img src='/public/images/svg/荷兰猪.svg' style={{ width: '100%', height: '100%' }} />
            </div>
            <div 
              style={{ fontSize: 16, fontWeight: 500, marginBottom: 16, cursor: 'pointer' }} 
              onClick={() => message.info('点击了Header区域')}
            >
              本月订单
              <ArrowRightOutlined style={{ marginLeft: 8 }} />
            </div>
            <div onClick={() => message.info('点击了Body区域')}>
              
            </div>
            <Space style={{ marginTop: 16 }}>
              <Button size='small'>
                更多
              </Button>
              <Button
                icon={<LikeOutlined />}
                type='primary'
                danger
                size='small'
              >
                Like
              </Button>
            </Space>
          </div>
        </Card>
      </Col>

      <Col xs={12} sm={12} md={6}>
        <Card hoverable>
          <div style={{ textAlign: 'center', padding: 16 }}>
            <Image 
              src='/public/images/svg/哈士奇.svg' 
              style={{ width: 80, height: 80, marginBottom: 16 }} 
              onClick={() => message.info('点击了Cover区域')}
            />
            <div 
              style={{ fontSize: 16, fontWeight: 500, marginBottom: 16, cursor: 'pointer' }} 
              onClick={() => message.info('点击了Header区域')}
            >
              库存商品
              <ArrowRightOutlined style={{ marginLeft: 8 }} />
            </div>
            <div onClick={() => message.info('点击了Body区域')}>
              
            </div>
            <Space style={{ marginTop: 16 }}>
              <Button size='small'>
                更多
              </Button>
              <Button
                icon={<LikeOutlined />}
                type='primary'
                danger
                size='small'
              >
                Like
              </Button>
            </Space>
          </div>
        </Card>
      </Col>

      <Col xs={12} sm={12} md={6}>
        <Card hoverable>
          <div style={{ textAlign: 'center', padding: 16 }}>
            <div 
              style={{ width: 80, height: 80, marginBottom: 16, cursor: 'pointer' }} 
              onClick={() => message.info('点击了Cover区域')}
            >
              <img src='/public/images/svg/可达鸭.svg' style={{ width: '100%', height: '100%' }} />
            </div>
            <div 
              style={{ fontSize: 16, fontWeight: 500, marginBottom: 16, cursor: 'pointer' }} 
              onClick={() => message.info('点击了Header区域')}
            >
              会员总数
              <ArrowRightOutlined style={{ marginLeft: 8 }} />
            </div>
            <div onClick={() => message.info('点击了Body区域')}>
              
            </div>
            <Space style={{ marginTop: 16 }}>
              <Button size='small'>
                更多
              </Button>
              <Button
                icon={<LikeOutlined />}
                type='primary'
                danger
                size='small'
              >
                Like
              </Button>
            </Space>
          </div>
        </Card>
      </Col>
    </Row>
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
        <Tag color={statusConfig.color === 'success' ? 'green' : 'orange'} style={{ marginTop: 4 }}>{statusConfig.text}</Tag>
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
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 16px 0 16px' }}>
          <span style={{ fontSize: 16, fontWeight: 500 }}>月度数据统计</span>
          <Button type="primary" size="small">查看详情</Button>
        </div>
        <div style={{ paddingTop: 0, padding: '0 16px 16px 16px' }}>
          <EChartsChart />
        </div>
      </Card>

      {/* 最近订单 */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 16px 0 16px' }}>
          <span style={{ fontSize: 16, fontWeight: 500 }}>最近订单</span>
          <Button type="primary" size="small">查看全部</Button>
        </div>
        <div style={{ padding: 0 }}>
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
        </div>
        <div style={{ padding: 16, textAlign: 'center' }}>
          <Button type="primary" size="small" block>
            查看全部订单
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MainContent;