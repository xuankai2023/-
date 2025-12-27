import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { ArrowRightOutlined, LikeOutlined, ReloadOutlined } from '@ant-design/icons';
import { Card, Button, Space, Row, Col, Tag, Image, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './MainContent.css';
import * as echarts from 'echarts';
import { allOrders, OrderStatus } from '../../../mock/orderData';
import { useOrderSearch } from '../hooks/useOrderSearch';

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
        <Card hoverable className="metric-card">
          <div className="metric-card-inner">
            <div 
              className="metric-card-cover"
              onClick={() => message.info('点击了Cover区域')}
            >
              <img src='/images/svg/仓鼠.svg' className="metric-card-icon" alt="宠物总数" />
            </div>
            <div 
              className="metric-card-title"
              onClick={() => message.info('点击了Header区域')}
            >
              宠物总数
              <ArrowRightOutlined style={{ marginLeft: 6 }} />
            </div>
            <div
              className="metric-card-subtitle"
              onClick={() => message.info('点击了Body区域')}
            >
              当前在册宠物总量及增长趋势
            </div>
            <Space className="metric-card-actions">
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
        <Card hoverable className="metric-card">
          <div className="metric-card-inner">
            <div 
              className="metric-card-cover"
              onClick={() => message.info('点击了Cover区域')}
            >
              <img src='/images/svg/荷兰猪.svg' className="metric-card-icon" alt="本月订单" />
            </div>
            <div 
              className="metric-card-title"
              onClick={() => message.info('点击了Header区域')}
            >
              本月订单
              <ArrowRightOutlined style={{ marginLeft: 6 }} />
            </div>
            <div
              className="metric-card-subtitle"
              onClick={() => message.info('点击了Body区域')}
            >
              全渠道订单与转化情况一目了然
            </div>
            <Space className="metric-card-actions">
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
        <Card hoverable className="metric-card">
          <div className="metric-card-inner">
            <div
              className="metric-card-cover"
              onClick={() => message.info('点击了Cover区域')}
            >
              <Image
                src='/images/svg/哈士奇.svg'
                preview={false}
                className="metric-card-icon"
                alt="库存商品"
            />
            </div>
            <div 
              className="metric-card-title"
              onClick={() => message.info('点击了Header区域')}
            >
              库存商品
              <ArrowRightOutlined style={{ marginLeft: 6 }} />
            </div>
            <div
              className="metric-card-subtitle"
              onClick={() => message.info('点击了Body区域')}
            >
              实时掌握仓储与补货预警
            </div>
            <Space className="metric-card-actions">
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
        <Card hoverable className="metric-card">
          <div className="metric-card-inner">
            <div 
              className="metric-card-cover"
              onClick={() => message.info('点击了Cover区域')}
            >
              <img src='/images/svg/可达鸭.svg' className="metric-card-icon" alt="会员总数" />
            </div>
            <div 
              className="metric-card-title"
              onClick={() => message.info('点击了Header区域')}
            >
              会员总数
              <ArrowRightOutlined style={{ marginLeft: 6 }} />
            </div>
            <div
              className="metric-card-subtitle"
              onClick={() => message.info('点击了Body区域')}
            >
              会员增长与活跃度一键查看
            </div>
            <Space className="metric-card-actions">
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
interface RecentOrderItemProps {
  orderId: string;
  customer: string;
  time: string;
  amount: number;
  status: OrderStatus;
  onClick?: () => void;
}

const RecentOrderItem: React.FC<RecentOrderItemProps> = ({
  orderId,
  customer,
  time,
  amount,
  status,
  onClick,
}) => {
  const statusConfig = useMemo(() => {
    const map: Record<OrderStatus, { text: string; color: string; bgColor: string; textColor: string }> = {
      [OrderStatus.COMPLETED]: { text: '已完成', color: 'green', bgColor: '#e6f7ff', textColor: '#1890ff' },
      [OrderStatus.PENDING]: { text: '待处理', color: 'orange', bgColor: '#fff7e6', textColor: '#fa8c16' },
      [OrderStatus.CANCELLED]: { text: '已取消', color: 'default', bgColor: '#f5f5f5', textColor: '#999' },
    };
    return map[status];
  }, [status]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 0',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          backgroundColor: statusConfig.bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontWeight: 'bold', color: statusConfig.textColor }}>
          {orderId.startsWith('ORDER') ? 'O' : orderId[0]}
        </span>
      </div>
      <div style={{ flex: 1, marginLeft: 12 }}>
        <div style={{ fontWeight: 500, fontSize: 14 }}>{orderId}</div>
        <div style={{ color: '#999', fontSize: 12 }}>
          {customer} · {time}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 500, fontSize: 14, color: '#f5222d' }}>
          ¥{amount.toFixed(2)}
        </div>
        <Tag color={statusConfig.color} style={{ marginTop: 4 }}>
          {statusConfig.text}
        </Tag>
      </div>
    </div>
  );
};

// 主内容组件
const MainContent: React.FC = () => {
  const navigate = useNavigate();
  const { filteredOrders } = useOrderSearch({
    orders: allOrders,
    initialSort: { field: 'orderTime', order: 'desc' },
  });

  // 获取最近5条订单
  const recentOrders = useMemo(() => {
    return filteredOrders.slice(0, 5);
  }, [filteredOrders]);

  // 格式化时间
  const formatTime = useCallback((timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  // 处理查看全部订单
  const handleViewAllOrders = useCallback(() => {
    navigate('/order');
  }, [navigate]);

  // 处理订单项点击
  const handleOrderClick = useCallback(
    (orderId: string) => {
      navigate(`/order/${orderId}`);
    },
    [navigate]
  );

  // 处理刷新
  const handleRefresh = useCallback(() => {
    message.success('数据已刷新');
    // 这里可以触发数据重新加载
    window.location.reload();
  }, []);

  return (
    <div style={{ padding: '15px' }}>
      {/* 数据指标 */}
      <MetricCard />

      {/* 图表 */}
      <Card style={{ marginBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 16px 0 16px',
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 500 }}>月度数据统计</span>
          <Space>
            <Button icon={<ReloadOutlined />} size="small" onClick={handleRefresh}>
              刷新
            </Button>
            <Button type="primary" size="small">
              查看详情
            </Button>
          </Space>
        </div>
        <div style={{ paddingTop: 0, padding: '0 16px 16px 16px' }}>
          <EChartsChart />
        </div>
      </Card>

      {/* 最近订单 */}
      <Card>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 16px 0 16px',
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 500 }}>最近订单</span>
          <Button type="primary" size="small" onClick={handleViewAllOrders}>
            查看全部
          </Button>
        </div>
        <div style={{ padding: '16px' }}>
          {recentOrders.length > 0 ? (
            <>
              {recentOrders.map((order, index) => (
                <React.Fragment key={order.id}>
                  <RecentOrderItem
                    orderId={order.id}
                    customer={order.customerName}
                    time={formatTime(order.orderTime)}
                    amount={order.totalAmount}
                    status={order.status}
                    onClick={() => handleOrderClick(order.id)}
                  />
                  {index < recentOrders.length - 1 && (
                    <div style={{ height: 1, backgroundColor: '#f0f0f0', margin: '8px 0' }} />
                  )}
                </React.Fragment>
              ))}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
              暂无订单数据
            </div>
          )}
        </div>
        <div style={{ padding: 16, textAlign: 'center' }}>
          <Button type="primary" size="small" block onClick={handleViewAllOrders}>
            查看全部订单
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MainContent;