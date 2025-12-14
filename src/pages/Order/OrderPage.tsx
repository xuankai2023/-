import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/SideBar/Sidebar';
import './order.css';
import { Card, Button, Tabs, Tag, Image, Space, message, Empty, Spin, Divider } from 'antd';
import { RestOutlined } from '@ant-design/icons';
import {
  Order, pendingOrders, completedOrders, cancelledOrders, allOrders, OrderStatus
} from '../../mock/orderData';

// 模拟异步获取订单数据的函数
async function getOrderData(orders: Order[], page: number, pageSize: number = 6) {
  return new Promise<Order[]>((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedOrders = orders.slice(start, end);
      resolve(paginatedOrders);
    }, 800);
  });
}

const OrderPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]);
  const [page, setPage] = useState<number>(1);
  const [finished, setFinished] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);

  // 格式化时间
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 获取状态配置
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return { text: '待处理' };
      case OrderStatus.COMPLETED:
        return { text: '已完成' };
      case OrderStatus.CANCELLED:
        return { text: '已取消' };
      default:
        return { text: '未知状态' };
    }
  };

  // 根据宠物类型获取对应的SVG图标路径
  const getPetIconPath = (petType: string): string => {
    // 宠物类型到图标路径的映射
    const petIconMap: Record<string, string> = {
      '猫': '/images/svg/布偶猫.svg',
      '狗': '/images/svg/哈士奇.svg',
      '兔子': '/images/svg/兔子 (1).svg',
      '仓鼠': '/images/svg/仓鼠.svg',
      '鸟类': '/images/svg/可爱的卡通鸟.svg'
    };
    
    // 如果找不到对应的图标，返回一个默认图标
    return petIconMap[petType] || '/images/svg/puppy.svg';
  };

  // 渲染订单卡片
  const renderOrderCard = (order: Order) => {
    const statusConfig = getStatusConfig(order.status);
    const isUrgent = new Date(order.scheduledTime).getTime() - Date.now() < 24 * 60 * 60 * 1000;

    const statusClassMap: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'order-card-status-danger',
      [OrderStatus.COMPLETED]: 'order-card-status-success',
      [OrderStatus.CANCELLED]: 'order-card-status-default',
    };

    return (
      <Card
        key={order.id}
        className={`order-card ${isUrgent ? 'order-card--urgent' : ''}`}
      >
        <div className="order-card-header" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space align="center" style={{ gap: '12px' }}>
            <div className="order-card-avatar-container">
              <Image
                src={order.customerAvatar || '/demo_avatar_1.jpg'}
                alt={order.customerName}
                className="order-card-avatar"
              />
              {isUrgent && <div className="order-card-urgent-badge" />}
            </div>
            <div className="order-card-customer-info">
              <div className="order-card-customer-name">{order.customerName}</div>
              <div className="order-card-order-id">#{order.id}</div>
            </div>
          </Space>

          <Tag
            className={`order-card-status-tag ${statusClassMap[order.status]}`}
          >
            {statusConfig.text}
          </Tag>
        </div>

        <Divider style={{ margin: 0 }} />

        <div style={{ padding: '16px' }}>
          <div className="order-details">
            {
              [
                { 
                  label: '宠物', 
                  value: `${order.petName} (${order.petType})`,
                  isPet: true,
                  petType: order.petType
                },
                { icon: '服务', label: '服务', value: order.serviceName, isIconSVG: true },
                { icon: '数量', label: '数量', value: `${order.quantity} 项`, isIconSVG: true },
                { icon: '已下单', label: '下单', value: formatDate(order.orderTime), isIconSVG: true },
                { icon: '预约', label: '预约', value: formatDate(order.scheduledTime), isIconSVG: true },
              ].map((item, idx) => (
                <div key={idx} className="detail-row">
                  <div className="label">
                    {item.isPet ? (
                      <span className="icon-label" style={{ display: 'inline-block', width: '20px', height: '20px' }}>
                        <img 
                          src={getPetIconPath(item.petType)} 
                          alt={item.petType} 
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </span>
                    ) : item.isIconSVG ? (
                      <span className="icon-label" style={{ display: 'inline-block', width: '20px', height: '20px' }}>
                        <img 
                          src={`/images/svg/${item.icon}.svg`} 
                          alt={item.icon} 
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </span>
                    ) : (
                      <span className="icon-label">{item.icon}</span>
                    )}
                    {item.label}
                  </div>
                  <div className="value">{item.value}</div>
                </div>
              ))
            }
          </div>
        </div>

        <Divider style={{ margin: 0 }} />

        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="order-card-footer-left">¥{order.totalAmount.toFixed(2)}</div>
          <div className="order-card-actions">
            <Button
              size="small"
              type="default"
              className="order-card-button"
              onClick={(e) => {
                e.stopPropagation();
                message.info('查看订单详情 ' + order.id);
              }}
            >
              详情
            </Button>
            <Button
              size="small"
              type={order.status === OrderStatus.PENDING ? 'primary' : 'default'}
              className="order-card-button"
              onClick={(e) => {
                e.stopPropagation();
                if (order.status === OrderStatus.PENDING) {
                  message.success('开始处理订单: ' + order.id);
                } else {
                  message.info('查看订单详情: ' + order.id);
                }
              }}
            >
              {order.status === OrderStatus.PENDING ? '处理' : ' 查看'}
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  // 根据 Tab 获取订单列表
  const getOrdersByTab = (tab: string): Order[] => {
    switch (tab) {
      case 'pending': return pendingOrders;
      case 'completed': return completedOrders;
      case 'cancelled': return cancelledOrders;
      default: return allOrders;
    }
  };

  // 加载订单数据（支持指定页码和是否追加）
  const loadOrders = async (pageNum: number, append: boolean = true) => {
    try {
      const orders = getOrdersByTab(activeTab);
      const newOrders = await getOrderData(orders, pageNum);

      if (pageNum === 1) {
        setCurrentOrders(newOrders);
        setFinished(newOrders.length === 0 || newOrders.length < 6);
      } else if (append) {
        setCurrentOrders(prev => [...prev, ...newOrders]);
        setFinished(newOrders.length === 0 || newOrders.length < 6);
      }

      setLoadError(false);
      if (pageNum === 1) {
        setLoading(false);
      }
    } catch (error) {
      setLoadError(true);
      if (pageNum === 1) {
        setLoading(false);
      }
      throw error;
    }
  };

  // 刷新
  const handleRefresh = async () => {
    try {
      await loadOrders(1, false);
      message.success('刷新成功');
    } catch (error) {
      message.error('刷新失败，请重试');
    }
  };

  // 加载更多（用于 List）—— 关键修复点
  const handleLoadMore = async () => {
    // ⚠️ 不要提前 return！即使 finished 或 loadError 为 true，也要允许重试
    setLoadError(false); // 允许重试

    try {
      const nextPage = page + 1;
      const orders = getOrdersByTab(activeTab);
      const newOrders = await getOrderData(orders, nextPage);

      if (newOrders.length === 0) {
        setFinished(true);
        return;
      }

      setCurrentOrders(prev => [...prev, ...newOrders]);
      setPage(nextPage);

      if (newOrders.length < 6) {
        setFinished(true);
      }
    } catch (error) {
      setLoadError(true);
      message.error('加载更多失败');
    }
  };

  // 切换 Tab
  const handleTabChange = (name: string | number) => {
    setActiveTab(String(name));
  };

  // Tab 切换时重置并加载第一页
  useEffect(() => {
    if (activeTab) {
      setPage(1);
      setFinished(false);
      setLoadError(false); // 👈 新增：清除错误状态
      setLoading(true);
      loadOrders(1, false).catch(() => { });
    }
  }, [activeTab]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }} className='order-page-container'>
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
          {/* 通知栏 */}
          <div
            style={{ 
              padding: '8px 16px', 
              background: 'rgba(255, 251, 230, 0.9)', 
              color: '#d48806', 
              borderRadius: '8px', 
              marginBottom: '16px', 
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <span style={{ marginRight: '8px' }}>🔊</span>
            <span>当前有 {pendingOrders.length} 个待处理订单，请及时处理</span>
          </div>

          {/* 统计卡片 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <Card style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '12px' }}>
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>全部订单</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{allOrders.length}</div>
                  </div>
                  <div style={{ fontSize: '24px' }}>🛍️</div>
                </div>
              </div>
            </Card>

            <Card style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', borderRadius: '12px' }}>
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>待处理</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{pendingOrders.length}</div>
                  </div>
                  <div style={{ fontSize: '24px' }}>⏳</div>
                </div>
              </div>
            </Card>

            <Card style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', borderRadius: '12px' }}>
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>已完成</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{completedOrders.length}</div>
                  </div>
                  <div style={{ fontSize: '24px' }}>✅</div>
                </div>
              </div>
            </Card>
          </div>

          <Divider style={{ margin: '24px 0' }}>订单列表</Divider>

          <div className='demo-tabs'>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <Spin size="large" tip="加载中..." />
              </div>
            ) : (
              <Tabs activeKey={activeTab} onChange={handleTabChange}>
                <Tabs.TabPane key='all' tab={`全部订单 (${allOrders.length})`}>
                  {allOrders.length === 0 ? (
                    <Empty description="暂无订单数据">
                      <Button type="primary" size="small" onClick={() => window.location.reload()}>
                        刷新页面
                      </Button>
                    </Empty>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>全部订单列表</h3>
                        <Button type="default" size="small" icon={<RestOutlined />} onClick={handleRefresh}>
                          刷新
                        </Button>
                      </div>
                      <div>
                        <div
                          className='order-grid-container'
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: '16px',
                            padding: '16px 0'
                          }}
                        >
                          {currentOrders.map(order => renderOrderCard(order))}
                        </div>
                        {!finished && (
                          <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                            <Button type="default" onClick={handleLoadMore} disabled={loadError}>
                              {loadError ? '加载失败，点击重试' : '加载更多'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Tabs.TabPane>

                <Tabs.TabPane key='pending' tab={`待处理订单 (${pendingOrders.length})`}>
                  {pendingOrders.length === 0 ? (
                    <Empty description="暂无待处理订单">
                      <div style={{ fontSize: '14px', color: '#969799' }}>所有订单都已处理完成</div>
                    </Empty>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>待处理订单列表</h3>
                        <Button type="default" size="small" icon={<RestOutlined />} onClick={handleRefresh}>
                          刷新
                        </Button>
                      </div>
                      <div>
                        <div
                          className='order-grid-container'
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: '16px',
                            padding: '16px 0'
                          }}
                        >
                          {currentOrders.map(order => renderOrderCard(order))}
                        </div>
                        {!finished && (
                          <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                            <Button type="default" onClick={handleLoadMore} disabled={loadError}>
                              {loadError ? '加载失败，点击重试' : '加载更多'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Tabs.TabPane>

                <Tabs.TabPane key='completed' tab={`已完成订单 (${completedOrders.length})`}>
                  {completedOrders.length === 0 ? (
                    <Empty description="暂无已完成订单">
                      <div style={{ fontSize: '14px', color: '#969799' }}>还没有完成任何订单</div>
                    </Empty>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>已完成订单列表</h3>
                        <Button type="default" size="small" icon={<RestOutlined />} onClick={handleRefresh}>
                          刷新
                        </Button>
                      </div>
                      <div>
                        <div
                          className='order-grid-container'
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: '16px',
                            padding: '16px 0'
                          }}
                        >
                          {currentOrders.map(order => renderOrderCard(order))}
                        </div>
                        {!finished && (
                          <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                            <Button type="default" onClick={handleLoadMore} disabled={loadError}>
                              {loadError ? '加载失败，点击重试' : '加载更多'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Tabs.TabPane>

                <Tabs.TabPane key='cancelled' tab={`已取消订单 (${cancelledOrders.length})`}>
                  {cancelledOrders.length === 0 ? (
                    <Empty description="暂无已取消订单">
                      <div style={{ fontSize: '14px', color: '#969799' }}>没有取消的订单记录</div>
                    </Empty>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>已取消订单列表</h3>
                        <Button type="default" size="small" icon={<RestOutlined />} onClick={handleRefresh}>
                          刷新
                        </Button>
                      </div>
                      <div>
                        <div
                          className='order-grid-container'
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: '16px',
                            padding: '16px 0'
                          }}
                        >
                          {currentOrders.map(order => renderOrderCard(order))}
                        </div>
                        {!finished && (
                          <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                            <Button type="default" onClick={handleLoadMore} disabled={loadError}>
                              {loadError ? '加载失败，点击重试' : '加载更多'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Tabs.TabPane>
              </Tabs>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderPage;