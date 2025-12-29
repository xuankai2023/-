import React, { useEffect, useState, useMemo } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/SideBar/Sidebar';
import './BoardingRecordsPage.css';
import { useBoardStore } from '../../Store/board';
import {
  Row, Col, Tag, Button, Badge, Space, Card, Select, Input, Typography,
  DatePicker, Empty, message
} from 'antd';
import {
  PlusOutlined, BellOutlined, BarChartOutlined, PieChartOutlined,
  CheckCircleOutlined, SearchOutlined, ExportOutlined
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

// 导入组件
import BookingModal from './components/BookingModal';
import BookingDetailModal from './components/BookingDetailModal';
import QuickCheckInModal from './components/QuickCheckInModal';
import RoomCard from './components/RoomCard';
import BookingTable from './components/BookingTable';
import DashboardStats from './components/DashboardStats';
import ChartsSection from './components/ChartsSection';
import LogDrawer from './components/LogDrawer';
import PostDrawer from './components/PostDrawer';

// 寄养记录页面组件
const BoardingRecordsPage: React.FC = () => {
  // 从store获取数据和方法
  const {
    dashboardData,
    rooms,
    bookings,
    loadMockData,
    addBooking,
    updateBooking,
    removeBooking,
    updateRoom
  } = useBoardStore();

  // 状态管理
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>('all');

  // 模态框状态
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isQuickCheckInVisible, setIsQuickCheckInVisible] = useState(false);
  const [isLogDrawerVisible, setIsLogDrawerVisible] = useState(false);
  const [isPostDrawerVisible, setIsPostDrawerVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  // 组件加载时加载模拟数据
  useEffect(() => {
    loadMockData();
  }, [loadMockData]);

  // 过滤预约数据
  const filteredBookings = useMemo(() => {
    let filtered = [...bookings];

    // 搜索过滤
    if (searchText) {
      const keyword = searchText.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.pet.name.toLowerCase().includes(keyword) ||
        booking.pet.breed.toLowerCase().includes(keyword) ||
        booking.owner.name.toLowerCase().includes(keyword) ||
        booking.owner.phone.includes(keyword)
      );
    }

    // 状态过滤
    if (statusFilter !== 'all') {
      const statusMap: Record<string, string> = {
        'pending': '待审核',
        'confirmed': '已通过',
        'rejected': '已拒绝'
      };
      filtered = filtered.filter(booking => booking.status === statusMap[statusFilter]);
    }

    // 日期范围过滤
    if (dateRange && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(booking => {
        const startDate = dayjs(booking.dates.start);
        return startDate.isAfter(dateRange[0]!.subtract(1, 'day')) &&
          startDate.isBefore(dateRange[1]!.add(1, 'day'));
      });
    }

    return filtered;
  }, [bookings, searchText, statusFilter, dateRange]);

  // 过滤房间数据
  const filteredRooms = useMemo(() => {
    let filtered = [...rooms];

    // 区域过滤
    if (selectedArea !== 'all') {
      const areaMap: Record<string, string[]> = {
        'dog': ['豪华单间', '标准间'],
        'cat': ['猫别墅']
      };
      if (areaMap[selectedArea]) {
        filtered = filtered.filter(room => areaMap[selectedArea].includes(room.type));
      }
    }

    return filtered;
  }, [rooms, selectedArea]);

  // 处理添加预约
  const handleAddBooking = () => {
    setSelectedBooking(null);
    setIsAddModalVisible(true);
  };

  // 处理编辑预约
  const handleEditBooking = (booking: any) => {
    setSelectedBooking(booking);
    setIsEditModalVisible(true);
  };

  // 处理查看详情
  const handleViewDetail = (booking: any) => {
    setSelectedBooking(booking);
    setIsDetailModalVisible(true);
  };

  // 处理通过预约
  const handleApproveBooking = (bookingId: string) => {
    updateBooking(bookingId, { status: '已通过' });
    message.success('预约已通过');
  };

  // 处理拒绝预约
  const handleRejectBooking = (bookingId: string) => {
    updateBooking(bookingId, { status: '已拒绝' });
    message.success('预约已拒绝');
  };

  // 处理删除预约
  const handleDeleteBooking = (bookingId: string) => {
    removeBooking(bookingId);
    message.success('预约已删除');
  };

  // 提交预约表单
  const handleSubmitBooking = (values: any) => {
    const bookingData = {
      id: selectedBooking?.id || `booking-${Date.now()}`,
      pet: {
        id: selectedBooking?.pet?.id || `pet-${Date.now()}`,
        name: values.petName,
        breed: values.petBreed,
        age: 1,
      },
      owner: {
        name: values.ownerName,
        phone: values.ownerPhone,
      },
      dates: {
        start: values.startDate.format('YYYY-MM-DD'),
        end: values.endDate.format('YYYY-MM-DD'),
        days: values.endDate.diff(values.startDate, 'day') + 1,
      },
      roomType: values.roomType,
      healthStatus: values.healthStatus,
      status: '待审核' as const,
    };

    if (selectedBooking) {
      updateBooking(selectedBooking.id, bookingData);
      message.success('预约已更新');
      setIsEditModalVisible(false);
    } else {
      addBooking(bookingData);
      message.success('预约已添加');
      setIsAddModalVisible(false);
    }
    setSelectedBooking(null);
  };

  // 处理快速入住
  const handleQuickCheckIn = () => {
    setIsQuickCheckInVisible(true);
  };

  // 提交快速入住
  const handleSubmitQuickCheckIn = (values: any) => {
    // 找到空闲房间
    const availableRoom = rooms.find(r => r.status === '空闲' && r.type === values.roomType);

    if (!availableRoom) {
      message.error('没有可用的房间');
      return;
    }

    // 更新房间状态
    updateRoom(availableRoom.id, {
      status: '已入住',
      pet: {
        id: `pet-${Date.now()}`,
        name: values.petName,
        breed: values.petBreed,
        age: 1,
        tags: values.tags || [],
      },
      stayDays: values.days,
    });

    message.success('快速入住成功');
    setIsQuickCheckInVisible(false);
  };

  // 处理日志
  const handleLog = (room: any) => {
    setSelectedRoom(room);
    setIsLogDrawerVisible(true);
  };

  // 处理发动态
  const handlePost = (room: any) => {
    setSelectedRoom(room);
    setIsPostDrawerVisible(true);
  };

  // 导出数据
  const handleExport = () => {
    const csvContent = [
      ['预约号', '宠物名称', '宠物品种', '主人姓名', '主人电话', '开始日期', '结束日期', '房间类型', '健康状态', '状态'].join(','),
      ...filteredBookings.map(booking => [
        booking.id,
        booking.pet.name,
        booking.pet.breed,
        booking.owner.name,
        booking.owner.phone,
        booking.dates.start,
        booking.dates.end,
        booking.roomType,
        booking.healthStatus,
        booking.status,
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `寄养预约_${dayjs().format('YYYY-MM-DD')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('导出成功');
  };

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
              <Button type="primary" icon={<PlusOutlined />} onClick={handleQuickCheckIn}>
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
              <DashboardStats dashboardData={dashboardData} />
              <ChartsSection dashboardData={dashboardData} />
            </div>

            {/* 房态管理视图 */}
            <div className="view-rooms" style={{ marginTop: 24 }}>
              <Typography.Title level={3}>房态管理</Typography.Title>
              <Card>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Space>
                      <Button
                        type={selectedArea === 'all' ? 'primary' : 'default'}
                        onClick={() => setSelectedArea('all')}
                      >
                        全部区域
                      </Button>
                      <Button
                        type={selectedArea === 'dog' ? 'primary' : 'default'}
                        onClick={() => setSelectedArea('dog')}
                      >
                        狗狗豪华区
                      </Button>
                      <Button
                        type={selectedArea === 'cat' ? 'primary' : 'default'}
                        onClick={() => setSelectedArea('cat')}
                      >
                        猫咪静音区
                      </Button>
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
                {filteredRooms.length === 0 ? (
                  <Col span={24}>
                    <Empty description="暂无房间数据" />
                  </Col>
                ) : (
                  filteredRooms.map((room) => (
                    <Col key={room.id} xs={24} sm={12} md={6}>
                      <RoomCard room={room} onLog={handleLog} onPost={handlePost} />
                    </Col>
                  ))
                )}
              </Row>
            </div>

            {/* 寄养预约表格 */}
            <div className="view-bookings" style={{ marginTop: 24 }}>
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Typography.Title level={3} style={{ margin: 0 }}>寄养预约</Typography.Title>
                  <Space>
                    <Button type="default" icon={<ExportOutlined />} onClick={handleExport}>
                      导出
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddBooking}>
                      添加预约
                    </Button>
                  </Space>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <Row gutter={16} align="middle">
                    <Col xs={24} sm={8} md={6}>
                      <Input
                        placeholder="搜索主人/宠物..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                      />
                    </Col>
                    <Col xs={24} sm={8} md={6}>
                      <Select
                        placeholder="选择状态"
                        style={{ width: '100%' }}
                        value={statusFilter}
                        onChange={setStatusFilter}
                      >
                        <Select.Option value="all">全部</Select.Option>
                        <Select.Option value="pending">待审核</Select.Option>
                        <Select.Option value="confirmed">已通过</Select.Option>
                        <Select.Option value="rejected">已拒绝</Select.Option>
                      </Select>
                    </Col>
                    <Col xs={24} sm={8} md={6}>
                      <DatePicker.RangePicker
                        style={{ width: '100%' }}
                        value={dateRange}
                        onChange={setDateRange}
                      />
                    </Col>
                    <Col xs={24} sm={8} md={6}>
                      <Button
                        onClick={() => {
                          setSearchText('');
                          setStatusFilter('all');
                          setDateRange(null);
                        }}
                      >
                        重置
                      </Button>
                    </Col>
                  </Row>
                </div>

                <BookingTable
                  bookings={filteredBookings}
                  onView={handleViewDetail}
                  onEdit={handleEditBooking}
                  onApprove={handleApproveBooking}
                  onReject={handleRejectBooking}
                  onDelete={handleDeleteBooking}
                />
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* 模态框和抽屉 */}
      <BookingModal
        visible={isAddModalVisible}
        onOk={handleSubmitBooking}
        onCancel={() => {
          setIsAddModalVisible(false);
          setSelectedBooking(null);
        }}
      />

      <BookingModal
        visible={isEditModalVisible}
        booking={selectedBooking}
        onOk={handleSubmitBooking}
        onCancel={() => {
          setIsEditModalVisible(false);
          setSelectedBooking(null);
        }}
      />

      <BookingDetailModal
        visible={isDetailModalVisible}
        booking={selectedBooking}
        onClose={() => {
          setIsDetailModalVisible(false);
          setSelectedBooking(null);
        }}
      />

      <QuickCheckInModal
        visible={isQuickCheckInVisible}
        onOk={handleSubmitQuickCheckIn}
        onCancel={() => setIsQuickCheckInVisible(false)}
      />

      <LogDrawer
        visible={isLogDrawerVisible}
        room={selectedRoom}
        onClose={() => {
          setIsLogDrawerVisible(false);
          setSelectedRoom(null);
        }}
      />

      <PostDrawer
        visible={isPostDrawerVisible}
        room={selectedRoom}
        onClose={() => {
          setIsPostDrawerVisible(false);
          setSelectedRoom(null);
        }}
      />
    </div>
  );
};

export default BoardingRecordsPage;
