import React from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/SideBar/Sidebar';
import './order.css';
import { Card, Button, Tabs, Tag } from 'react-vant';

// 订单数据接口
interface Order {
  id: string;
  orderId: string;
  service: string;
  pet: string;
  time: string;
  amount: string;
  status: 'pending' | 'completed' | 'cancelled';
}

// 订单页面组件
const OrderPage: React.FC = () => {
  // 待处理订单数据
  const pendingOrders: Order[] = [
    {
      id: '1',
      orderId: '20230601001',
      service: '宠物美容服务',
      pet: '小白',
      time: '2023-06-10 14:00',
      amount: '¥188.00',
      status: 'pending'
    }
  ];

  // 已完成订单数据
  const completedOrders: Order[] = [
    {
      id: '2',
      orderId: '20230528002',
      service: '寄养服务 (3天)',
      pet: '小黑',
      time: '2023-05-25 至 2023-05-28',
      amount: '¥599.00',
      status: 'completed'
    }
  ];

  // 已取消订单数据
  const cancelledOrders: Order[] = [
    {
      id: '3',
      orderId: '20230520001',
      service: '疫苗接种服务',
      pet: '小白',
      time: '2023-05-22 10:00',
      amount: '¥230.00',
      status: 'cancelled'
    }
  ];

  // 渲染订单卡片
  const renderOrderCard = (order: Order, actions?: React.ReactNode) => (
    <Card key={order.id} className='order-list-card'>
      <div className='order-card-header'>
        <div>
          <div className='order-id'>订单号: {order.orderId}</div>
          <div className='order-service'>{order.service}</div>
        </div>
        <Tag
          type={
            order.status === 'pending'
              ? 'danger'
              : order.status === 'completed'
                ? 'success'
                : 'default'
          }
        >
          {order.status === 'pending'
            ? '待支付'
            : order.status === 'completed'
              ? '已完成'
              : '已取消'}
        </Tag>
      </div>
      <div className='order-card-body'>
        <div className='order-detail-item'>
          <span className='label'>宠物:</span>
          <span className='value'>{order.pet}</span>
        </div>
        <div className='order-detail-item'>
          <span className='label'>时间:</span>
          <span className='value'>{order.time}</span>
        </div>
        <div className='order-detail-item'>
          <span className='label'>金额:</span>
          <span className='value amount'>{order.amount}</span>
        </div>
      </div>
      {actions && (
        <Card.Footer>
          <div className='order-actions'>{actions}</div>
        </Card.Footer>
      )}
    </Card>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
          <div className='demo-tabs'>
            <Tabs active='a'>
              <Tabs.TabPane name='a' title='全部订单'>
                <div className='order-cards-container'>
                  <Card round className='order-card-item'>
                    <Card.Header>卡片标题</Card.Header>
                    <Card.Body>
                      React Vant 是一套轻量、可靠的移动端 React 组件库，提供了丰富的基础组件和业务组件，帮助开发者快速搭建移动应用。
                    </Card.Body>
                    <Card.Footer>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Button type="primary" round size="small" style={{ flex: 1 }}>
                          查看更多
                        </Button>
                         <Button type="primary" round size="small" style={{ flex: 1 }}>
                          详情
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                  <Card round className='order-card-item'>
                    <Card.Header>卡片标题</Card.Header>
                    <Card.Body>
                      React Vant 是一套轻量、可靠的移动端 React 组件库，提供了丰富的基础组件和业务组件，帮助开发者快速搭建移动应用。
                    </Card.Body>
                    <Card.Footer>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Button type="primary" round size="small" style={{ flex: 1 }}>
                          查看更多
                        </Button>
                         <Button type="primary" round size="small" style={{ flex: 1 }}>
                          详情
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                  <Card round className='order-card-item'>
                    <Card.Header>卡片标题</Card.Header>
                    <Card.Body>
                      React Vant 是一套轻量、可靠的移动端 React 组件库，提供了丰富的基础组件和业务组件，帮助开发者快速搭建移动应用。
                    </Card.Body>
                    <Card.Footer>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Button type="primary" round size="small" style={{ flex: 1 }}>
                          查看更多
                        </Button>
                        <Button type="primary" round size="small" style={{ flex: 1 }}>
                          详情
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                </div>
              </Tabs.TabPane>

            <Tabs.TabPane name='b' title='全部订单'>
                <div className='order-cards-container'>
                  <Card round className='order-card-item'>
                    <Card.Header>卡片标题</Card.Header>
                    <Card.Body>
                      React Vant 是一套轻量、可靠的移动端 React 组件库，提供了丰富的基础组件和业务组件，帮助开发者快速搭建移动应用。
                    </Card.Body>
                    <Card.Footer>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Button type="primary" round size="small" style={{ flex: 1 }}>
                          查看更多
                        </Button>
                         <Button type="primary" round size="small" style={{ flex: 1 }}>
                          详情
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                  <Card round className='order-card-item'>
                    <Card.Header>卡片标题</Card.Header>
                    <Card.Body>
                      React Vant 是一套轻量、可靠的移动端 React 组件库，提供了丰富的基础组件和业务组件，帮助开发者快速搭建移动应用。
                    </Card.Body>
                    <Card.Footer>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Button type="primary" round size="small" style={{ flex: 1 }}>
                          查看更多
                        </Button>
                         <Button type="primary" round size="small" style={{ flex: 1 }}>
                          详情
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                  <Card round className='order-card-item'>
                    <Card.Header>卡片标题</Card.Header>
                    <Card.Body>
                      React Vant 是一套轻量、可靠的移动端 React 组件库，提供了丰富的基础组件和业务组件，帮助开发者快速搭建移动应用。
                    </Card.Body>
                    <Card.Footer>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Button type="primary" round size="small" style={{ flex: 1 }}>
                          查看更多
                        </Button>
                        <Button type="primary" round size="small" style={{ flex: 1 }}>
                          详情
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                </div>
              </Tabs.TabPane>

              <Tabs.TabPane name='c' title='已完成订单'>
                 <div className='order-cards-container'>
                  <Card round className='order-card-item'>
                    <Card.Header>卡片标题</Card.Header>
                    <Card.Body>
                      React Vant 是一套轻量、可靠的移动端 React 组件库，提供了丰富的基础组件和业务组件，帮助开发者快速搭建移动应用。
                    </Card.Body>
                    <Card.Footer>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Button type="primary" round size="small" style={{ flex: 1 }}>
                          查看更多
                        </Button>
                         <Button type="primary" round size="small" style={{ flex: 1 }}>
                          详情
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                  <Card round className='order-card-item'>
                    <Card.Header>卡片标题</Card.Header>
                    <Card.Body>
                      React Vant 是一套轻量、可靠的移动端 React 组件库，提供了丰富的基础组件和业务组件，帮助开发者快速搭建移动应用。
                    </Card.Body>
                    <Card.Footer>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Button type="primary" round size="small" style={{ flex: 1 }}>
                          查看更多
                        </Button>
                         <Button type="primary" round size="small" style={{ flex: 1 }}>
                          详情
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                  <Card round className='order-card-item'>
                    <Card.Header>卡片标题</Card.Header>
                    <Card.Body>
                      React Vant 是一套轻量、可靠的移动端 React 组件库，提供了丰富的基础组件和业务组件，帮助开发者快速搭建移动应用。
                    </Card.Body>
                    <Card.Footer>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Button type="primary" round size="small" style={{ flex: 1 }}>
                          查看更多
                        </Button>
                        <Button type="primary" round size="small" style={{ flex: 1 }}>
                          详情
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                </div>
              </Tabs.TabPane>

            <Tabs.TabPane name='d' title='全部订单'>
                  <div className='order-cards-container'>
                  <Card round className='order-card-item'>
                    <Card.Header>卡片标题</Card.Header>
                    <Card.Body>
                      React Vant 是一套轻量、可靠的移动端 React 组件库，提供了丰富的基础组件和业务组件，帮助开发者快速搭建移动应用。
                    </Card.Body>
                    <Card.Footer>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Button type="primary" round size="small" style={{ flex: 1 }}>
                          查看更多
                        </Button>
                         <Button type="primary" round size="small" style={{ flex: 1 }}>
                          详情
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                  <Card round className='order-card-item'>
                    <Card.Header>卡片标题</Card.Header>
                    <Card.Body>
                      React Vant 是一套轻量、可靠的移动端 React 组件库，提供了丰富的基础组件和业务组件，帮助开发者快速搭建移动应用。
                    </Card.Body>
                    <Card.Footer>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Button type="primary" round size="small" style={{ flex: 1 }}>
                          查看更多
                        </Button>
                         <Button type="primary" round size="small" style={{ flex: 1 }}>
                          详情
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                  <Card round className='order-card-item'>
                    <Card.Header>卡片标题</Card.Header>
                    <Card.Body>
                      React Vant 是一套轻量、可靠的移动端 React 组件库，提供了丰富的基础组件和业务组件，帮助开发者快速搭建移动应用。
                    </Card.Body>
                    <Card.Footer>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Button type="primary" round size="small" style={{ flex: 1 }}>
                          查看更多
                        </Button>
                        <Button type="primary" round size="small" style={{ flex: 1 }}>
                          详情
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                </div>
              </Tabs.TabPane>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderPage;