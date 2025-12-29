import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/SideBar/Sidebar';
import './order.css';
import { Card, Button, Tabs, Tag, Image, Space, message, Empty, Spin, Divider, Alert, Row, Col, Typography, List } from 'antd';
import { RestOutlined } from '@ant-design/icons';
import { orderApi, type Order as ApiOrder } from '../../api/order';
import { useNavigate } from 'react-router';

type OrderStatus = 'pending' | 'completed' | 'cancelled';

function OrderPage() {
  const navigate = useNavigate();
  const handleClick = (id: string) => {
    navigate(`/order/${id}`);
  };

  const [activeTab, setActiveTab] = useState<string>('all');
  const [currentOrders, setCurrentOrders] = useState<ApiOrder[]>([]);
  const [page, setPage] = useState<number>(1);
  const [finished, setFinished] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [stats, setStats] = useState({ all: 0, pending: 0, completed: 0 });
  const pageSize = 6;

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

  useEffect(() => {
    const loadOrders = async () => {
      // 只在第一页或 Tab 切换时加载（避免与 handleLoadMore 冲突）
      if (page === 1) {
        setLoading(true);
        setLoadError(false);
        try {
          const status = activeTab === 'all' ? undefined : (activeTab as OrderStatus);
          const response = await orderApi.getOrderList({
            skip: 0,
            limit: pageSize,
            status
          });

          // 第一页总是替换数据
          setCurrentOrders(response.data || []);
          setTotal(response.count || 0);
          setFinished((response.data?.length || 0) < pageSize);
        } catch (error: any) {
          console.error('加载订单失败:', error);
          setLoadError(true);
          message.error(error?.message || '加载订单失败');
        } finally {
          setLoading(false);
        }
      }
    };
    loadOrders();
  }, [activeTab, pageSize]); // 移除 page 依赖，只在 activeTab 或 pageSize 变化时触发

  // 加载统计数据
  useEffect(() => {
    const loadStats = async () => {
      try {
        const [allRes, pendingRes, completedRes] = await Promise.all([
          orderApi.getOrderList({ skip: 0, limit: 1 }),
          orderApi.getOrderList({ skip: 0, limit: 1, status: 'pending' }),
          orderApi.getOrderList({ skip: 0, limit: 1, status: 'completed' })
        ]);
        setStats({
          all: allRes.count || 0,
          pending: pendingRes.count || 0,
          completed: completedRes.count || 0
        });
      } catch (error) {
        console.error('加载统计数据失败:', error);
      }
    };
    loadStats();
  }, []);

  // 获取状态配置
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return { text: '待处理' };
      case 'completed':
        return { text: '已完成' };
      case 'cancelled':
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
  const renderOrderCard = (order: ApiOrder) => {
    const statusConfig = getStatusConfig(order.status);
    const scheduledTime = order.created_at ? new Date(order.created_at).getTime() : 0;
    const isUrgent = scheduledTime > 0 && scheduledTime - Date.now() < 24 * 60 * 60 * 1000;

    const statusClassMap: Record<OrderStatus, string> = {
      'pending': 'order-card-status-danger',
      'completed': 'order-card-status-success',
      'cancelled': 'order-card-status-default',
    };

    return (
      <Card
        key={order.id}
        className={`order-card ${isUrgent ? 'order-card--urgent' : ''}`}
      >
        <div
          className="order-card-header"
          style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Space align="center" style={{ gap: '12px' }}>
            <div className="order-card-avatar-container">
              <Image
                src="/images/png/default-avatar.png"
                alt="用户头像"
                className="order-card-avatar"
              />
              {isUrgent && <div className="order-card-urgent-badge" />}
            </div>
            <div className="order-card-customer-info">
              <div className="order-card-customer-name">{order.user_id || '未知用户'}</div>
              <div className="order-card-order-id">#{order.order_number || order.id}</div>
            </div>
          </Space>

          <Tag
            className={`order-card-status-tag ${statusClassMap[order.status]}`}
          >
            {statusConfig.text}
          </Tag>
        </div>

        <Divider style={{ margin: 0 }} />
        {/* 详情卡片 */}
        <div style={{ padding: '16px' }}>
          <div className="order-details">
            {[
              {
                label: '宠物',
                value: order.pet_id || '未指定宠物',
                isPet: true,
                petType: 'other'
              },
              { icon: '服务', label: '服务', value: order.service_name || '未指定服务', isIconSVG: true },
              { icon: '数量', label: '数量', value: `${order.quantity || 1} 项`, isIconSVG: true },
              { icon: '已下单', label: '下单', value: order.created_at ? formatDate(order.created_at) : '未指定', isIconSVG: true },
              { icon: '预约', label: '预约', value: order.created_at ? formatDate(order.created_at) : '未指定', isIconSVG: true },
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
            ))}
          </div>
        </div>

        <Divider style={{ margin: 0 }} />

        <div
          style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div className="order-card-footer-left">¥{order.total_amount?.toFixed(2) || '0.00'}</div>
          <div className="order-card-actions">
            <Button
              size="small"
              type="default"
              className="order-card-button"
              onClick={(e) => {
                e.stopPropagation();
                handleClick(order.id);
              }}
            >
              详情
            </Button>
            <Button
              size="small"
              type={order.status === 'pending' ? 'primary' : 'default'}
              className="order-card-button"
              onClick={(e) => {
                e.stopPropagation();
                handleClick(order.id);
              }}
            >
              {order.status === 'pending' ? '处理' : ' 查看'}
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  // 刷新
  const handleRefresh = async () => {
    setPage(1);
    setFinished(false);
  };

  // 加载更多（用于 List）
  const handleLoadMore = async () => {
    if (finished || loading || loadingMore) return;

    setLoadError(false);
    setLoadingMore(true);
    try {
      const status = activeTab === 'all' ? undefined : (activeTab as OrderStatus);
      const nextPage = page + 1;
      const response = await orderApi.getOrderList({
        skip: (nextPage - 1) * pageSize,
        limit: pageSize,
        status
      });

      // 追加新数据到现有列表
      setCurrentOrders(prev => [...prev, ...(response.data || [])]);
      setTotal(response.count || 0);
      setFinished((response.data?.length || 0) < pageSize);
      setPage(nextPage);
    } catch (error: any) {
      console.error('加载更多订单失败:', error);
      setLoadError(true);
      message.error(error?.message || '加载更多订单失败');
    } finally {
      setLoadingMore(false);
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
      setCurrentOrders([]); // 清空当前订单列表
      setLoadError(false); // 重置错误状态
      // 触发加载第一页数据（通过上面的 useEffect）
    }
  }, [activeTab]);

  const renderTabContent = (title: string, showRefresh?: boolean) => (
    currentOrders.length === 0 && !loading ? (
      <Empty description={`暂无${title}`}>
        {title === '全部订单' && (
          <Button type="primary" size="small" onClick={() => window.location.reload()}>
            刷新页面
          </Button>
        )}
      </Empty>
    ) : (
      <div>
        <div className="order-tab-header">
          <Typography.Title level={5} style={{ margin: 0 }}>{title}</Typography.Title>
          {showRefresh && (
            <Button type="default" size="small" icon={<RestOutlined />} onClick={handleRefresh}>
              刷新
            </Button>
          )}
        </div>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}
          dataSource={currentOrders}
          renderItem={(item) => (
            <List.Item>
              {renderOrderCard(item)}
            </List.Item>
          )}
        />
        {!finished && currentOrders.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
            <Button
              type="default"
              onClick={handleLoadMore}
              disabled={loading || loadingMore || loadError}
              loading={loadingMore}
            >
              {loadError ? '加载失败，点击重试' : loadingMore ? '加载中...' : '加载更多'}
            </Button>
          </div>
        )}
        {loading && currentOrders.length === 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Spin size="large" tip="加载中..." />
          </div>
        )}
      </div>
    )
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }} className='order-page-container'>
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
          {/* 通知栏 */}
          {stats.pending > 0 && (
            <Alert
              type="warning"
              message={`当前有 ${stats.pending} 个待处理订单，请及时处理`}
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          {/* 统计卡片 */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={8}>
              <Card className="order-stat-card gradient-1" bordered={false}>
                <div className="order-stat-card-body">
                  <div>
                    <div className="order-stat-label">全部订单</div>
                    <div className="order-stat-value">{stats.all}</div>
                  </div>
                  <div className="order-stat-icon">🛍️</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card className="order-stat-card gradient-2" bordered={false}>
                <div className="order-stat-card-body">
                  <div>
                    <div className="order-stat-label">待处理</div>
                    <div className="order-stat-value">{stats.pending}</div>
                  </div>
                  <div className="order-stat-icon">⏳</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card className="order-stat-card gradient-3" bordered={false}>
                <div className="order-stat-card-body">
                  <div>
                    <div className="order-stat-label">已完成</div>
                    <div className="order-stat-value">{stats.completed}</div>
                  </div>
                  <div className="order-stat-icon">✅</div>
                </div>
              </Card>
            </Col>
          </Row>

          <Divider style={{ margin: '24px 0' }}>订单列表</Divider>

          <Card className="demo-tabs" bordered={false}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <Spin size="large" tip="加载中..." />
              </div>
            ) : (
              <Tabs activeKey={activeTab} onChange={handleTabChange}>
                <Tabs.TabPane key='all' tab={`全部订单 (${stats.all})`}>
                  {renderTabContent('全部订单')}
                </Tabs.TabPane>

                <Tabs.TabPane key='pending' tab={`待处理订单 (${stats.pending})`}>
                  {renderTabContent('待处理订单')}
                </Tabs.TabPane>

                <Tabs.TabPane key='completed' tab={`已完成订单 (${stats.completed})`}>
                  {renderTabContent('已完成订单', true)}
                </Tabs.TabPane>

                <Tabs.TabPane key='cancelled' tab={`已取消订单`}>
                  {renderTabContent('已取消订单', true)}
                </Tabs.TabPane>
              </Tabs>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
};

export default OrderPage;