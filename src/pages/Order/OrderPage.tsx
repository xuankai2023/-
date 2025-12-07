import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/SideBar/Sidebar';
import './order.css';
import {
  PullRefresh, List, Card, Button, Tabs, Tag, Image, Space, Toast,
  Empty, Loading, NoticeBar, Divider, Badge
} from 'react-vant';
import {
  Order, pendingOrders, completedOrders, cancelledOrders, allOrders, OrderStatus
} from '../../mock/orderData';

// 模拟异步获取订单数据的函数
async function getOrderData(orders: Order[], page: number, pageSize: number = 6, throwError: boolean = false) {
  return new Promise<Order[]>((resolve, reject) => {
    setTimeout(() => {
      if (throwError) {
        reject(new Error('获取订单数据失败'));
      }
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
        return { text: '待处理', type: 'danger' as const };
      case OrderStatus.COMPLETED:
        return { text: '已完成', type: 'success' as const };
      case OrderStatus.CANCELLED:
        return { text: '已取消', type: 'default' as const };
      default:
        return { text: '未知状态', type: 'default' as const };
    }
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

        <Card.Body style={{ padding: '16px' }}>
          <div className="order-card-details">
            {[
              { icon: '🐾', label: '宠物', value: `${order.petName} (${order.petType})` },
              { icon: '🔧', label: '服务', value: order.serviceName },
              { icon: '📦', label: '数量', value: `${order.quantity} 项` },
              { icon: '⏰', label: '下单', value: formatDate(order.orderTime) },
              { icon: '📅', label: '预约', value: formatDate(order.scheduledTime) },
            ].map((item, idx) => (
              <div key={idx} className="order-card-detail-item">
                <span className="order-card-detail-icon">{item.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="order-card-detail-label">{item.label}</div>
                  <div className="order-card-detail-value">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>

        <Divider style={{ margin: 0 }} />

        <Card.Footer style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="order-card-footer-left">¥{order.totalAmount.toFixed(2)}</div>
          <div className="order-card-actions">
            <Button
              size="small"
              plain
              color="#999"
              className="order-card-button"
              onClick={(e) => {
                e.stopPropagation();
                Toast.info('查看订单详情 ' + order.id);
              }}
            >
              👁️ 详情
            </Button>
            <Button
              size="small"
              type="primary"
              color={order.status === OrderStatus.PENDING ? '#1677ff' : '#52c41a'}
              className="order-card-button"
              onClick={(e) => {
                e.stopPropagation();
                if (order.status === OrderStatus.PENDING) {
                  Toast.success('开始处理订单: ' + order.id);
                } else {
                  Toast.info('查看订单详情: ' + order.id);
                }
              }}
            >
              {order.status === OrderStatus.PENDING ? '▶️ 处理' : '✅ 查看'}
            </Button>
          </div>
        </Card.Footer>
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
      // 可选：测试错误时传入 throwError: pageNum > 1
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

  // 下拉刷新
  const handleRefresh = async () => {
    try {
      await loadOrders(1, false);
      Toast.success('刷新成功');
    } catch (error) {
      Toast.fail('刷新失败，请重试');
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
      Toast.fail('加载更多失败');
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
          <NoticeBar
            text={`🔊 当前有 ${pendingOrders.length} 个待处理订单，请及时处理`}
            background="rgba(255, 251, 230, 0.9)"
            color="#d48806"
            style={{ borderRadius: '8px', marginBottom: '16px', backdropFilter: 'blur(10px)' }}
          />

          {/* 统计卡片 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <Card style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '12px' }}>
              <Card.Body>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>全部订单</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{allOrders.length}</div>
                  </div>
                  <div style={{ fontSize: '24px' }}>🛍️</div>
                </div>
              </Card.Body>
            </Card>

            <Card style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', borderRadius: '12px' }}>
              <Card.Body>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>待处理</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{pendingOrders.length}</div>
                  </div>
                  <div style={{ fontSize: '24px' }}>⏳</div>
                </div>
              </Card.Body>
            </Card>

            <Card style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', borderRadius: '12px' }}>
              <Card.Body>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>已完成</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{completedOrders.length}</div>
                  </div>
                  <div style={{ fontSize: '24px' }}>✅</div>
                </div>
              </Card.Body>
            </Card>
          </div>

          <Divider style={{ margin: '24px 0' }}>订单列表</Divider>

          <div className='demo-tabs'>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <Loading type="spinner" size="24px" vertical>加载中...</Loading>
              </div>
            ) : (
              <Tabs active={activeTab} onChange={handleTabChange}>
                <Tabs.TabPane name='all' title={`全部订单 (${allOrders.length})`}>
                  {allOrders.length === 0 ? (
                    <Empty image="search" description="暂无订单数据">
                      <Button type="primary" size="small" onClick={() => window.location.reload()}>
                        刷新页面
                      </Button>
                    </Empty>
                  ) : (
                    <div>
                      <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 'bold' }}>全部订单列表</h3>
                      <PullRefresh onRefresh={handleRefresh}>
                        <List
                          onLoad={handleLoadMore}
                          finished={finished}
                          errorText={loadError ? '加载失败，点击重试' : ''}
                        >
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
                        </List>
                      </PullRefresh>
                    </div>
                  )}
                </Tabs.TabPane>

                <Tabs.TabPane name='pending' title={`待处理订单 (${pendingOrders.length})`}>
                  {pendingOrders.length === 0 ? (
                    <Empty image="search" description="暂无待处理订单">
                      <div style={{ fontSize: '14px', color: '#969799' }}>所有订单都已处理完成</div>
                    </Empty>
                  ) : (
                    <div>
                      <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 'bold' }}>待处理订单列表</h3>
                      <PullRefresh onRefresh={handleRefresh}>
                        <List
                          onLoad={handleLoadMore}
                          finished={finished}
                          errorText={loadError ? '加载失败，点击重试' : ''}
                        >
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
                        </List>
                      </PullRefresh>
                    </div>
                  )}
                </Tabs.TabPane>

                <Tabs.TabPane name='completed' title={`已完成订单 (${completedOrders.length})`}>
                  {completedOrders.length === 0 ? (
                    <Empty image="search" description="暂无已完成订单">
                      <div style={{ fontSize: '14px', color: '#969799' }}>还没有完成任何订单</div>
                    </Empty>
                  ) : (
                    <div>
                      <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 'bold' }}>已完成订单列表</h3>
                      <PullRefresh onRefresh={handleRefresh}>
                        <List
                          onLoad={handleLoadMore}
                          finished={finished}
                          errorText={loadError ? '加载失败，点击重试' : ''}
                        >
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
                        </List>
                      </PullRefresh>
                    </div>
                  )}
                </Tabs.TabPane>

                <Tabs.TabPane name='cancelled' title={`已取消订单 (${cancelledOrders.length})`}>
                  {cancelledOrders.length === 0 ? (
                    <Empty image="search" description="暂无已取消订单">
                      <div style={{ fontSize: '14px', color: '#969799' }}>没有取消的订单记录</div>
                    </Empty>
                  ) : (
                    <div>
                      <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 'bold' }}>已取消订单列表</h3>
                      <PullRefresh onRefresh={handleRefresh}>
                        <List
                          onLoad={handleLoadMore}
                          finished={finished}
                          errorText={loadError ? '加载失败，点击重试' : ''}

                        >
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
                        </List>
                      </PullRefresh>
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