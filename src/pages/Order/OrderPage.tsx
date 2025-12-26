import React, { useState, useEffect, useRef, useCallback } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/SideBar/Sidebar';
import './order.css';
import { Card, Button, Tabs, Tag, Image, Space, message, Empty, Spin, Divider, Alert, Row, Col, Typography, List, Input, Select, DatePicker, Checkbox, Modal } from 'antd';
const { RangePicker } = DatePicker;
const { Option } = Select;
import * as echarts from 'echarts';
import { RestOutlined } from '@ant-design/icons';
import {
  Order, pendingOrders, completedOrders, cancelledOrders, allOrders, OrderStatus
} from '../../mock/orderData';
import { useNavigate } from 'react-router';
// 手动实现 debounce 函数
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T & { cancel(): void } {
  let timeout: NodeJS.Timeout | null = null;
  const debounced = function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  } as T & { cancel(): void };

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}
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
  const navigate = useNavigate();
  const handleclick = (id: string) => {
    navigate(`/order/${id}`);
  }

  const [activeTab, setActiveTab] = useState<string>('all');
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]);
  const [page, setPage] = useState<number>(1);
  const [finished, setFinished] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  // 筛选与搜索状态
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [serviceType, setServiceType] = useState<string>('');
  const [petType, setPetType] = useState<string>('');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  
  // 服务类型和宠物类型选项
  const serviceTypes = ['洗澡', '美容', '寄养', '医疗', '其他'];
  const petTypes = ['狗', '猫', '兔子', '仓鼠', '鸟类'];
  // 批量操作状态
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [batchUpdateModalVisible, setBatchUpdateModalVisible] = useState<boolean>(false);
  const [batchUpdateStatus, setBatchUpdateStatus] = useState<OrderStatus | ''>('');
  // 图表状态
  const trendChartRef = useRef<HTMLDivElement>(null);
  const statusChartRef = useRef<HTMLDivElement>(null);
  const [chartInstances, setChartInstances] = useState<{ trendChart: echarts.ECharts | null; statusChart: echarts.ECharts | null }>({ trendChart: null, statusChart: null });

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
        return { text: '待处理', color: 'orange', tagColor: 'gold', className: 'order-card-status-danger' };
      case OrderStatus.COMPLETED:
        return { text: '已完成', color: 'green', tagColor: 'green', className: 'order-card-status-success' };
      case OrderStatus.CANCELLED:
        return { text: '已取消', color: 'gray', tagColor: 'default', className: 'order-card-status-default' };
      default:
        return { text: '未知状态', color: 'gray', tagColor: 'default', className: 'order-card-status-default' };
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

    return (
      <Card
        key={order.id}
        className={`order-card ${isUrgent ? 'order-card--urgent' : ''}`}
        hoverable
      >
        <div
          className="order-card-header"
          style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Space align="center" style={{ gap: '12px' }}>
            <div className="order-card-avatar-container">
              <Image
                src={
                  order.customerAvatar ||
                  'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80'
                }
                alt={order.customerName}
                className="order-card-avatar"
              />
              {isUrgent && (
                <div className="order-card-urgent-badge" title="紧急订单" />
              )}
            </div>
            <div className="order-card-customer-info">
              <div className="order-card-customer-name">{order.customerName}</div>
              <div className="order-card-order-id">#{order.id}</div>
            </div>
          </Space>

          <Tag
            color={statusConfig.tagColor}
            className={`order-card-status-tag ${statusConfig.className}`}
          >
            {statusConfig.text}
          </Tag>
        </div>

        <Divider style={{ margin: 0 }} />
        {/* 详情卡片 */}
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

        <div
          style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div className="order-card-footer-left">¥{order.totalAmount.toFixed(2)}</div>
          <div className="order-card-actions">
            <Button
              size="small"
              type="default"
              className="order-card-button"
              onClick={(e) => {
                e.stopPropagation();
                handleclick(order.id);
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
                handleclick(order.id);
              }}
            >
              {order.status === OrderStatus.PENDING ? '处理' : ' 查看'}
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  // 初始化图表
  const initCharts = () => {
    // 销毁旧图表实例
    if (chartInstances.trendChart) {
      chartInstances.trendChart.dispose();
    }
    if (chartInstances.statusChart) {
      chartInstances.statusChart.dispose();
    }

    // 初始化订单趋势图表
    if (trendChartRef.current) {
      const trendChart = echarts.init(trendChartRef.current);
      // 模拟过去7天的订单数据
      const days = ['7天前', '6天前', '5天前', '4天前', '3天前', '2天前', '昨天'];
      const orderCounts = [12, 19, 15, 23, 18, 27, 31];
      const orderAmounts = [1200, 1900, 1500, 2300, 1800, 2700, 3100];

      const trendOption = {
        title: {
          text: '订单趋势',
          left: 'center',
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['订单数量', '订单金额'],
          bottom: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: days
        },
        yAxis: [
          {
            type: 'value',
            name: '订单数量',
            axisLabel: {
              formatter: '{value} 单'
            }
          },
          {
            type: 'value',
            name: '订单金额',
            axisLabel: {
              formatter: '¥{value}'
            }
          }
        ],
        series: [
          {
            name: '订单数量',
            type: 'line',
            data: orderCounts,
            smooth: true,
            itemStyle: {
              color: '#1890ff'
            }
          },
          {
            name: '订单金额',
            type: 'line',
            yAxisIndex: 1,
            data: orderAmounts,
            smooth: true,
            itemStyle: {
              color: '#52c41a'
            }
          }
        ]
      };

      trendChart.setOption(trendOption);
      chartInstances.trendChart = trendChart;
    }

    // 初始化订单状态分布图表
    if (statusChartRef.current) {
      const statusChart = echarts.init(statusChartRef.current);
      const statusData = [
        { value: pendingOrders.length, name: '待处理', itemStyle: { color: '#faad14' } },
        { value: completedOrders.length, name: '已完成', itemStyle: { color: '#52c41a' } },
        { value: cancelledOrders.length, name: '已取消', itemStyle: { color: '#d9d9d9' } }
      ];

      const statusOption = {
        title: {
          text: '订单状态分布',
          left: 'center',
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: statusData.map(item => item.name)
        },
        series: [
          {
            name: '订单状态',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: statusData
          }
        ]
      };

      statusChart.setOption(statusOption);
      chartInstances.statusChart = statusChart;
    }

    setChartInstances({ ...chartInstances });
  };

  // 监听窗口大小变化，调整图表尺寸
  useEffect(() => {
    const handleResize = () => {
      if (chartInstances.trendChart) {
        chartInstances.trendChart.resize();
      }
      if (chartInstances.statusChart) {
        chartInstances.statusChart.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [chartInstances]);

  // 初始化图表
  useEffect(() => {
    // 延迟初始化图表，确保DOM已渲染
    const timer = setTimeout(() => {
      initCharts();
    }, 100);

    return () => {
      clearTimeout(timer);
      // 销毁图表实例
      if (chartInstances.trendChart) {
        chartInstances.trendChart.dispose();
      }
      if (chartInstances.statusChart) {
        chartInstances.statusChart.dispose();
      }
    };
  }, []);

  // 根据 Tab 获取订单列表并应用筛选
  const getOrdersByTab = (tab: string): Order[] => {
    let orders: Order[];
    switch (tab) {
      case 'pending': orders = pendingOrders;
        break;
      case 'completed': orders = completedOrders;
        break;
      case 'cancelled': orders = cancelledOrders;
        break;
      default: orders = allOrders;
        break;
    }

    // 应用筛选条件
    return orders.filter(order => {
      // 搜索筛选
        if (searchKeyword) {
          const keyword = searchKeyword.toLowerCase();
          if (!(order.id.toLowerCase().includes(keyword) ||
                order.customerName.toLowerCase().includes(keyword) ||
                order.petName.toLowerCase().includes(keyword) ||
                order.customerPhone.toLowerCase().includes(keyword)))
          {
            return false;
          }
        }

      // 服务类型筛选
      if (serviceType && order.serviceName !== serviceType) {
        return false;
      }

      // 宠物类型筛选
      if (petType && order.petType !== petType) {
        return false;
      }

      // 日期范围筛选
      if (dateRange[0] || dateRange[1]) {
        const orderDate = new Date(order.orderTime);
        const orderDayjs = dayjs(orderDate);
        if (dateRange[0] && orderDayjs.isBefore(dateRange[0])) {
          return false;
        }
        if (dateRange[1]) {
          const endDate = dateRange[1].endOf('day');
          if (orderDayjs.isAfter(endDate)) {
            return false;
          }
        }
      }

      return true;
    });
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

  // 使用导入的debounce函数创建debouncedSearch
  const debouncedSearch = useCallback(debounce((keyword: string) => {
    setSearchKeyword(keyword);
    // 搜索时重置页码
    setPage(1);
    setFinished(false);
    setLoading(true);
    loadOrders(1, false).catch(() => {});
  }, 300), [loadOrders]);

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

  // 批量操作函数
  const handleBatchUpdate = () => {
    if (selectedOrderIds.length === 0) {
      message.warning('请先选择要操作的订单');
      return;
    }
    if (!batchUpdateStatus) {
      message.warning('请选择要更新的状态');
      return;
    }

    // 这里应该调用API更新订单状态
    message.success(`已成功更新 ${selectedOrderIds.length} 个订单的状态为 ${getStatusConfig(batchUpdateStatus).text}`);
    setBatchUpdateModalVisible(false);
    setSelectedOrderIds([]);
    // 刷新当前页面数据
    loadOrders(1, false).catch(() => {});
  };

  const handleBatchDelete = () => {
    if (selectedOrderIds.length === 0) {
      message.warning('请先选择要删除的订单');
      return;
    }

    // 这里应该调用API删除订单
    message.success(`已成功删除 ${selectedOrderIds.length} 个订单`);
    setSelectedOrderIds([]);
    // 刷新当前页面数据
    loadOrders(1, false).catch(() => {});
  };

  const renderTabContent = (data: Order[], title: string, showRefresh?: boolean) => (
    data.length === 0 ? (
      <Empty description={`暂无${title}`}>
        {title === '全部订单' && (
          <Button type="primary" size="small" onClick={() => window.location.reload()}>
            刷新页面
          </Button>
        )}
      </Empty>
    ) : (
      <div>
        {/* 批量操作区域 */}
        {selectedOrderIds.length > 0 && (
          <div className="order-batch-actions" style={{ marginBottom: 16, padding: 12, background: '#fafafa', borderRadius: 8 }}>
            <Space>
              <span>已选择 {selectedOrderIds.length} 个订单</span>
              <Button
                type="default"
                onClick={() => setBatchUpdateModalVisible(true)}
              >
                批量更新状态
              </Button>
              <Button
                danger
                onClick={handleBatchDelete}
              >
                批量删除
              </Button>
              <Button
                type="default"
                onClick={() => setSelectedOrderIds([])}
              >
                取消选择
              </Button>
            </Space>
          </div>
        )}

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
            <List.Item
              key={item.id}
              actions={[
                <Checkbox
                  checked={selectedOrderIds.includes(item.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedOrderIds([...selectedOrderIds, item.id]);
                    } else {
                      setSelectedOrderIds(selectedOrderIds.filter(id => id !== item.id));
                    }
                  }}
                />
              ]}
            >
              {renderOrderCard(item)}
            </List.Item>
          )}
        />
        {!finished && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
            <Button type="default" onClick={handleLoadMore} disabled={loadError}>
              {loadError ? '加载失败，点击重试' : '加载更多'}
            </Button>
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
          <Alert
            type="warning"
            message={`当前有 ${pendingOrders.length} 个待处理订单，请及时处理`}
            showIcon
            style={{ marginBottom: 16 }}
          />

          {/* 统计卡片 */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={8}>
              <Card className="order-stat-card gradient-1" bordered={false}>
                <div className="order-stat-card-body">
                  <div>
                    <div className="order-stat-label">全部订单</div>
                    <div className="order-stat-value">{allOrders.length}</div>
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
                    <div className="order-stat-value">{pendingOrders.length}</div>
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
                    <div className="order-stat-value">{completedOrders.length}</div>
                  </div>
                  <div className="order-stat-icon">✅</div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* 数据可视化区域 */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={12}>
              <Card className="order-chart-card" bordered={false}>
                <div ref={trendChartRef} style={{ width: '100%', height: '300px' }} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card className="order-chart-card" bordered={false}>
                <div ref={statusChartRef} style={{ width: '100%', height: '300px' }} />
              </Card>
            </Col>
          </Row>

          {/* 筛选与搜索区域 */}
          <Card className="order-filter-card" bordered={false} style={{ marginBottom: 24 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={8} lg={6}>
                <Input
                  placeholder="搜索订单ID、客户姓名、宠物名称、电话号码"
                  value={searchKeyword}
                  onChange={(e) => debouncedSearch(e.target.value)}
                  prefix={<i className="fas fa-search"></i>}
                  allowClear
                  onClear={() => debouncedSearch('')}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  placeholder="选择服务类型"
                  value={serviceType}
                  onChange={setServiceType}
                  allowClear
                >
                  {serviceTypes.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  placeholder="选择宠物类型"
                  value={petType}
                  onChange={setPetType}
                  allowClear
                >
                  {petTypes.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={24} md={24} lg={6}>
                <RangePicker
                  placeholder={['开始日期', '结束日期']}
                  value={dateRange}
                  onChange={(dates: [Dayjs | null, Dayjs | null] | null) => setDateRange(dates || [null, null])}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} style={{ textAlign: 'right' }}>
                <Space>
                  <Button
                    type="default"
                    onClick={() => {
                      setSearchKeyword('');
                      setServiceType('');
                      setPetType('');
                      setDateRange([null, null]);
                    }}
                  >
                    重置筛选
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      // 筛选时重置页码
                      setPage(1);
                      setFinished(false);
                      setLoading(true);
                      loadOrders(1, false).catch(() => {});
                    }}
                  >
                    应用筛选
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          <Divider style={{ margin: '24px 0' }}>订单列表</Divider>

          <Card className="demo-tabs" bordered={false}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <Spin size="large" tip="加载中..." />
              </div>
            ) : (
              <Tabs activeKey={activeTab} onChange={handleTabChange}>
                <Tabs.TabPane key='all' tab={`全部订单 (${allOrders.length})`}>
                  {renderTabContent(allOrders, '全部订单')}
                </Tabs.TabPane>

                <Tabs.TabPane key='pending' tab={`待处理订单 (${pendingOrders.length})`}>
                  {renderTabContent(pendingOrders, '待处理订单')}
                </Tabs.TabPane>

                <Tabs.TabPane key='completed' tab={`已完成订单 (${completedOrders.length})`}>
                  {renderTabContent(completedOrders, '已完成订单', true)}
                </Tabs.TabPane>

                <Tabs.TabPane key='cancelled' tab={`已取消订单 (${cancelledOrders.length})`}>
                  {renderTabContent(cancelledOrders, '已取消订单', true)}
                </Tabs.TabPane>
              </Tabs>
            )}
          </Card>
        </main>

        {/* 批量更新状态模态框 */}
        <Modal
          title="批量更新订单状态"
          open={batchUpdateModalVisible}
          onCancel={() => setBatchUpdateModalVisible(false)}
          footer={[
            <Button key="back" onClick={() => setBatchUpdateModalVisible(false)}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={handleBatchUpdate}>
              确认更新
            </Button>
          ]}
        >
          <div style={{ marginBottom: 16 }}>
            您将更新 {selectedOrderIds.length} 个订单的状态
          </div>
          <div>
            <span style={{ display: 'inline-block', marginBottom: 8 }}>选择新状态：</span>
            <Select
              style={{ width: '100%' }}
              placeholder="请选择新状态"
              value={batchUpdateStatus}
              onChange={setBatchUpdateStatus}
            >
              {Object.values(OrderStatus).map(status => (
                <Option key={status} value={status}>{getStatusConfig(status).text}</Option>
              ))}
            </Select>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default OrderPage;