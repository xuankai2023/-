import React from 'react';
import { Modal, Descriptions, Tag, Button } from 'antd';
import './BookingDetailModal.css';

export interface BookingDetailModalProps {
  visible: boolean;
  booking: any;
  onClose: () => void;
}

function BookingDetailModal({ visible, booking, onClose }: BookingDetailModalProps) {
  if (!booking) return null;

  const statusColorMap: Record<string, string> = {
    '待审核': 'warning',
    '已通过': 'success',
    '已拒绝': 'error',
  };

  return (
    <Modal
      title="预约详情"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose} className="close-button">
          关闭
        </Button>
      ]}
      width={600}
      className="booking-detail-modal"
    >
      <Descriptions column={2} bordered className="booking-descriptions">
        <Descriptions.Item label="预约号">{booking.id}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={statusColorMap[booking.status] || 'default'} className="status-tag">
            {booking.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="宠物名称">{booking.pet.name}</Descriptions.Item>
        <Descriptions.Item label="宠物品种">{booking.pet.breed}</Descriptions.Item>
        <Descriptions.Item label="主人姓名">{booking.owner.name}</Descriptions.Item>
        <Descriptions.Item label="主人电话">{booking.owner.phone}</Descriptions.Item>
        <Descriptions.Item label="开始日期">{booking.dates.start}</Descriptions.Item>
        <Descriptions.Item label="结束日期">{booking.dates.end}</Descriptions.Item>
        <Descriptions.Item label="寄养天数">{booking.dates.days} 天</Descriptions.Item>
        <Descriptions.Item label="房间类型">{booking.roomType}</Descriptions.Item>
        <Descriptions.Item label="健康状态">
          <Tag color={booking.healthStatus === '疫苗齐全' ? 'success' : 'error'} className="health-tag">
            {booking.healthStatus}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}

export default BookingDetailModal;

