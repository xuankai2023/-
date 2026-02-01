import React from 'react';
import { Table, Space, Tag, Button, Avatar, Popconfirm } from 'antd';
import { EyeOutlined, EditOutlined, CheckOutlined, CloseCircleOutlined, CloseOutlined } from '@ant-design/icons';
import './BookingTable.css';

export interface BookingTableProps {
  bookings: any[];
  onView: (booking: any) => void;
  onEdit: (booking: any) => void;
  onApprove: (bookingId: string) => void;
  onReject: (bookingId: string) => void;
  onDelete: (bookingId: string) => void;
}

function BookingTable({
  bookings,
  onView,
  onEdit,
  onApprove,
  onReject,
  onDelete,
}: BookingTableProps) {
  const columns = [
    {
      title: '预约号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '宠物信息',
      dataIndex: 'pet',
      key: 'pet',
      width: 180,
      render: (pet: any) => (
        <Space align="center">
          {pet?.avatar && <Avatar src={pet.avatar} size={32} className="pet-avatar" />}
          <div className="pet-details">
            <div className="pet-name">{pet?.name}</div>
            <div className="pet-breed">{pet?.breed}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '主人信息',
      dataIndex: 'owner',
      key: 'owner',
      width: 160,
      render: (owner: any) => (
        <div>
          <div className="owner-name">{owner?.name}</div>
          <div className="owner-phone">{owner?.phone}</div>
        </div>
      ),
    },
    {
      title: '预约时间',
      key: 'date',
      width: 180,
      render: (_: any, record: any) => (
        <div className="booking-dates">
          <div className="date-item">开始: {record.dates.start}</div>
          <div className="date-item">结束: {record.dates.end}</div>
          <div className="date-days">{record.dates.days}天</div>
        </div>
      ),
    },
    {
      title: '房间类型',
      dataIndex: 'roomType',
      key: 'roomType',
      width: 120,
    },
    {
      title: '健康档案',
      dataIndex: 'healthStatus',
      key: 'healthStatus',
      width: 120,
      render: (status: string) => (
        <Tag color={status === '疫苗齐全' ? 'success' : 'error'} className="health-tag">
          {status}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusConfig: Record<string, { color: string; text: string }> = {
          '待审核': { color: 'warning', text: '待审核' },
          '已通过': { color: 'success', text: '已通过' },
          '已拒绝': { color: 'error', text: '已拒绝' },
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return (
          <Tag color={config.color} className="status-tag">
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space className="table-actions">
          <Button 
            type="default" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
          >
            查看
          </Button>
          <Button 
            type="primary" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            编辑
          </Button>
          {record.status === '待审核' && (
            <>
              <Button 
                type="primary" 
                size="small" 
                icon={<CheckOutlined />}
                onClick={() => onApprove(record.id)}
              >
                通过
              </Button>
              <Popconfirm
                title="确定要拒绝这个预约吗？"
                onConfirm={() => onReject(record.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button 
                  type="primary" 
                  size="small" 
                  danger
                  icon={<CloseCircleOutlined />}
                >
                  拒绝
                </Button>
              </Popconfirm>
            </>
          )}
          <Popconfirm
            title="确定要删除这个预约吗？"
            onConfirm={() => onDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="default" 
              size="small" 
              danger
              icon={<CloseOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={bookings}
      columns={columns}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
        pageSizeOptions: ['10', '20', '50', '100'],
      }}
      scroll={{ x: 1200 }}
      className="booking-table"
    />
  );
}

export default BookingTable;

