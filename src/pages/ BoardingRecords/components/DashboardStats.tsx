import React from 'react';
import { Row, Col, Card, Statistic, Tag, Space } from 'antd';

export interface DashboardStatsProps {
  dashboardData: {
    vacancyRate: number;
    monthlyRevenue: number;
    todoCount: number;
    healthAlerts: {
      count: number;
      items: string[];
    };
  };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ dashboardData }) => {
  return (
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
  );
};

export default DashboardStats;

