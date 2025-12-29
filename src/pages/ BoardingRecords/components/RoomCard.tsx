import React from 'react';
import { Card, Space, Tag, Button, Avatar } from 'antd';
import { ClockCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { FileTextOutlined, SendOutlined } from '@ant-design/icons';

export interface RoomCardProps {
  room: any;
  onLog: (room: any) => void;
  onPost: (room: any) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onLog, onPost }) => {
  if (room.status === '已入住' && room.pet) {
    return (
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
            {room.pet.tags?.map((tag: string, index: number) => (
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
            <Button 
              type="default" 
              size="small" 
              block 
              icon={<FileTextOutlined />}
              onClick={() => onLog(room)}
            >
              日志
            </Button>
            <Button 
              type="primary" 
              size="small" 
              block 
              icon={<SendOutlined />}
              onClick={() => onPost(room)}
            >
              发动态
            </Button>
          </Space>
        </Space>
      </Card>
    );
  } else if (room.status === '空闲') {
    return (
      <Card hoverable>
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: '48px', color: '#4CAF50', marginBottom: '8px' }}>
            <PlusOutlined />
          </div>
          <div style={{ fontWeight: 'bold' }}>{room.number} (空闲)</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{room.type} · ¥{room.price}/天</div>
        </div>
      </Card>
    );
  } else if (room.status === '维护中') {
    return (
      <Card hoverable>
        <div style={{ textAlign: 'center', padding: '24px 0', opacity: 0.7 }}>
          <div style={{ fontSize: '48px', color: '#999', marginBottom: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
              <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
            </svg>
          </div>
          <div style={{ fontWeight: 'bold', color: '#666' }}>{room.number} (维修)</div>
          {room.maintenanceInfo && (
            <div style={{ fontSize: '12px', color: '#999' }}>{room.maintenanceInfo}</div>
          )}
        </div>
      </Card>
    );
  }
  return null;
};

export default RoomCard;

