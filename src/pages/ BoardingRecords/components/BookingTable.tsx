import React from 'react';
import { Table, Space, Tag, Button, Avatar, Popconfirm } from 'antd';
import { EyeOutlined, EditOutlined, CheckOutlined, CloseCircleOutlined, CloseOutlined } from '@ant-design/icons';

export interface BookingTableProps {
  bookings: any[];
  onView: (booking: any) => void;
  onEdit: (booking: any) => void;
  onApprove: (bookingId: string) => void;
  onReject: (bookingId: string) => void;
  onDelete: (bookingId: string) => void;
}

const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  onView,
  onEdit,
  onApprove,
  onReject,
  onDelete,
}) => {
  return (
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
        render={(text, record: any) => (
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
          <Tag color={status === '疫苗齐全' ? 'success' : 'error'}>
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
            status === '待审核' ? 'warning' :
              status === '已通过' ? 'success' : 'error'
          }>
            {status}
          </Tag>
        )}
      />
      <Table.Column
        title="操作"
        key="action"
        render={(text, record: any) => (
          <Space>
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
        )}
      />
    </Table>
  );
};

export default BookingTable;

