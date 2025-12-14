import React, { useEffect } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/SideBar/Sidebar';
import './BoardingRecordsPage.css';
import { useBoardStore } from '../../Store/board';
import { Row, Col, Tag, Button, Badge, Space, Card, Statistic, Table, Select, Input, Typography, DatePicker, Avatar } from 'antd';
import { PlusOutlined, BellOutlined, ClockCircleOutlined, BarChartOutlined, PieChartOutlined, CheckCircleOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';

// 寄养记录页面组件
const BoardingRecordsPage: React.FC = () => {
  // 从store获取数据
  const { dashboardData, rooms, bookings, loadMockData } = useBoardStore();
  
  // 组件加载时加载模拟数据
  useEffect(() => {
    loadMockData();
  }, [loadMockData]);
  
  return (
    <div className="boarding-records-container">
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main className="boarding-main">
          <header className="boarding-header">
            <Row gutter={16} align="middle">
              <Col>
                <Space size="middle">
                  <Tag color="success" icon={<CheckCircleOutlined />}>
                    当前在店: <strong>{dashboardData.inStorePets.total}</strong> (犬{dashboardData.inStorePets.dogs} / 猫{dashboardData.inStorePets.cats})
                  </Tag>
                  <Tag color="blue" icon={<BarChartOutlined />}>
                    今日入住: <strong>{dashboardData.todayStats.checkIn}</strong>
                  </Tag>
                  <Tag color="orange" icon={<PieChartOutlined />}>
                    今日离店: <strong>{dashboardData.todayStats.checkOut}</strong>
                  </Tag>
                </Space>
              </Col>
            </Row>

            <Space size="middle">
              <Button type="primary" icon={<PlusOutlined />}>
                快速入住
              </Button>
              <Badge dot>
                <BellOutlined style={{ fontSize: '20px' }} />
              </Badge>
            </Space>
          </header>

          <div className="main-content">
            {/* 仪表盘视图 */}
            <div className="view-dashboard">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <Card hoverable>
                    <Statistic
                      title="空房率 (可用)"
                      value={dashboardData.vacancyRate}
                      suffix="%"
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card hoverable>
                    <Statistic
                      title="本月营收 (预估)"
                      value={dashboardData.monthlyRevenue}
                      prefix="¥"
                      valueStyle={{ color: '#3b82f6' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card hoverable>
                    <Statistic
                      title="待办事项"
                      value={dashboardData.todoCount}
                      valueStyle={{ color: '#ff9800' }}
                    />
                    <Space size="small" style={{ marginTop: 8 }}>
                      <Tag color="warning">入住确认 x2</Tag>
                      <Tag color="default">退房结算 x1</Tag>
                    </Space>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card hoverable onClick={() => alert('跳转至健康日志页')}>
                    <Statistic
                      title="健康预警"
                      value={dashboardData.healthAlerts.count}
                      valueStyle={{ color: '#ef4444' }}
                    />
                    <div style={{ marginTop: 8 }}>
                      {dashboardData.healthAlerts.items.map((item, index) => (
                        <div key={index} style={{ fontSize: '12px', color: '#666', marginBottom: 4 }}>
                          • {item}
                        </div>
                      ))}
                    </div>
                  </Card>
                </Col>
              </Row>

              <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} md={16}>
                  <Card title="近7天入住趋势" bordered={false}>
                    <div id="chart-trend" className="chart-container"></div>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card title="在店宠物分布" bordered={false}>
                    <div id="chart-dist" className="chart-container"></div>
                  </Card>
                </Col>
              </Row>
            </div>

            {/* 房态管理视图 */}
            <div className="view-rooms" style={{ marginTop: 24 }}>
              <Typography.Title level={3}>房态管理</Typography.Title>
              <Card>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Space>
                      <Button type="primary">全部区域</Button>
                      <Button>狗狗豪华区</Button>
                      <Button>猫咪静音区</Button>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <Tag color="success">空闲</Tag>
                      <Tag color="blue">已入住</Tag>
                      <Tag color="default">维护中</Tag>
                    </Space>
                  </Col>
                </Row>
              </Card>

              <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                {rooms.map((room) => {
                  // 根据房间状态返回不同的卡片
                  if (room.status === '已入住' && room.pet) {
                    return (
                      <Col key={room.id} xs={24} sm={12} md={6}>
                        <Card hoverable>
                          <div style={{ position: 'absolute', top: 8, right: 8, color: '#999', fontSize: '12px' }}>
                            {room.number}
                          </div>
                          <Space direction="vertical" style={{ width: '100%' }}>
                            <Space align="center">
                              {room.pet.avatar && <Avatar src={room.pet.avatar} size={48} />}
                              <div>
                                <div style={{ fontWeight: 'bold' }}>{room.pet.name}</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>{room.pet.breed}</div>
                              </div>
                            </Space>
                            <Space wrap>
                              {room.pet.tags?.map((tag, index) => (
                                <Tag key={index} color={tag.includes('过敏') ? 'red' : tag.includes('怕') ? 'warning' : 'default'}>
                                  {tag}
                                </Tag>
                              ))}
                            </Space>
                            <div style={{ backgroundColor: '#eff6ff', padding: '8px', borderRadius: '4px' }}>
                              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                {room.stayDays && (
                                  <span style={{ fontSize: '12px', color: '#1e40af' }}>
                                    <ClockCircleOutlined /> 剩余 {room.stayDays} 天
                                  </span>
                                )}
                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e40af' }}>
                                  今日已喂药
                                </span>
                              </Space>
                            </div>
                            <Space>
                              <Button type="default" size="small" block>日志</Button>
                              <Button type="primary" size="small" block>发动态</Button>
                            </Space>
                          </Space>
                        </Card>
                      </Col>
                    );
                  } else if (room.status === '空闲') {
                    return (
                      <Col key={room.id} xs={24} sm={12} md={6}>
                        <Card hoverable>
                          <div style={{ textAlign: 'center', padding: '24px 0' }}>
                            <div style={{ fontSize: '48px', color: '#4CAF50', marginBottom: '8px' }}>
                              <PlusOutlined />
                            </div>
                            <div style={{ fontWeight: 'bold' }}>{room.number} (空闲)</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>{room.type} · ¥{room.price}/天</div>
                          </div>
                        </Card>
                      </Col>
                    );
                  } else if (room.status === '维护中') {
                    return (
                      <Col key={room.id} xs={24} sm={12} md={6}>
                        <Card hoverable>
                          <div style={{ textAlign: 'center', padding: '24px 0', opacity: 0.7 }}>
                            <div style={{ fontSize: '48px', color: '#999', marginBottom: '8px' }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
                              </svg>
                            </div>
                            <div style={{ fontWeight: 'bold', color: '#666' }}>{room.number} (维修)</div>
                            {room.maintenanceInfo && (
                              <div style={{ fontSize: '12px', color: '#999' }}>{room.maintenanceInfo}</div>
                            )}
                          </div>
                        </Card>
                      </Col>
                    );
                  }
                  return null;
                })}
              </Row>
            </div>

            {/* 寄养预约表格 */}
            <div className="view-bookings" style={{ marginTop: 24 }}>
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Typography.Title level={3} style={{ margin: 0 }}>寄养预约</Typography.Title>
                  <Space>
                    <Button type="default">导出</Button>
                    <Button type="primary">添加预约</Button>
                  </Space>
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  <Row gutter={16} align="middle">
                    <Col xs={24} sm={8} md={6}>
                      <Input placeholder="搜索主人/宠物..." prefix={<SearchOutlined />} />
                    </Col>
                    <Col xs={24} sm={8} md={6}>
                      <Select placeholder="选择状态" style={{ width: '100%' }}>
                        <Select.Option value="all">全部</Select.Option>
                        <Select.Option value="pending">待确认</Select.Option>
                        <Select.Option value="confirmed">已确认</Select.Option>
                        <Select.Option value="completed">已完成</Select.Option>
                        <Select.Option value="cancelled">已取消</Select.Option>
                      </Select>
                    </Col>
                    <Col xs={24} sm={8} md={6}>
                      <DatePicker.RangePicker style={{ width: '100%' }} />
                    </Col>
                  </Row>
                </div>
                
                <Table
                  dataSource={bookings}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                >
                  <Table.Column
                    title="预约号"
                    dataIndex="id"
                    key="id"
                  />
                  <Table.Column
                    title="宠物信息"
                    dataIndex="pet"
                    key="pet"
                    render={(pet) => (
                      <Space align="center">
                        {pet?.avatar && <Avatar src={pet.avatar} size={32} />}
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{pet?.name}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>{pet?.breed}</div>
                        </div>
                      </Space>
                    )}
                  />
                  <Table.Column
                    title="主人信息"
                    dataIndex="owner"
                    key="owner"
                    render={(owner) => (
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{owner?.name}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{owner?.phone}</div>
                      </div>
                    )}
                  />
                  <Table.Column
                    title="预约时间"
                    key="date"
                    render={(text, record) => (
                      <div>
                        <div style={{ fontSize: '12px' }}>开始: {record.dates.start}</div>
                        <div style={{ fontSize: '12px' }}>结束: {record.dates.end}</div>
                        <div style={{ fontSize: '12px', color: '#999' }}>{record.dates.days}天</div>
                      </div>
                    )}
                  />
                  <Table.Column
                    title="房间类型"
                    dataIndex="roomType"
                    key="roomType"
                  />
                  <Table.Column
                    title="健康档案"
                    dataIndex="healthStatus"
                    key="healthStatus"
                    render={(status) => (
                      <Tag color={status === '已完成' ? 'success' : 'error'}>
                        {status}
                      </Tag>
                    )}
                  />
                  <Table.Column
                    title="状态"
                    dataIndex="status"
                    key="status"
                    render={(status) => (
                      <Tag color={
                        status === '待确认' ? 'warning' :
                        status === '已确认' ? 'success' :
                        status === '已完成' ? 'default' : 'error'
                      }>
                        {status}
                      </Tag>
                    )}
                  />
                  <Table.Column
                    title="操作"
                    key="action"
                    render={(text, record) => (
                      <Space>
                        <Button type="default" size="small">查看</Button>
                        <Button type="primary" size="small">编辑</Button>
                        <Button type="primary" size="small">通过</Button>
                        <Button type="primary" size="small" danger>拒绝</Button>
                      </Space>
                    )}
                  />
                </Table>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BoardingRecordsPage;