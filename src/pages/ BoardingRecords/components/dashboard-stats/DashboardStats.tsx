import React from 'react';
import { Row, Col, Card, Statistic, Tag, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import './DashboardStats.css';

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

function DashboardStats({ dashboardData }: DashboardStatsProps) {
  const navigate = useNavigate();

  function handleHealthAlertClick() {
    // 可以导航到健康日志页面或显示详情
    console.log('查看健康预警详情', dashboardData.healthAlerts);
  }
  return (
    <Row gutter={[16, 16]} className="dashboard-stats">
      <Col xs={24} sm={12} md={6}>
        <Card hoverable className="stats-card stats-card-vacancy">
          <Statistic
            title="空房率 (可用)"
            value={dashboardData.vacancyRate}
            suffix="%"
            valueStyle={{ color: '#10b981' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card hoverable className="stats-card stats-card-revenue">
          <Statistic
            title="本月营收 (预估)"
            value={dashboardData.monthlyRevenue}
            prefix="¥"
            valueStyle={{ color: '#3b82f6' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card hoverable className="stats-card stats-card-todo">
          <Statistic
            title="待办事项"
            value={dashboardData.todoCount}
            valueStyle={{ color: '#ff9800' }}
          />
          <Space size="small" className="todo-tags">
            <Tag color="warning">入住确认 x2</Tag>
            <Tag color="default">退房结算 x1</Tag>
          </Space>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card 
          hoverable 
          className="stats-card stats-card-health" 
          onClick={handleHealthAlertClick}
        >
          <Statistic
            title="健康预警"
            value={dashboardData.healthAlerts.count}
            valueStyle={{ color: '#ef4444' }}
          />
          <div className="health-alerts">
            {dashboardData.healthAlerts.items.map((item, index) => (
              <div key={index} className="health-alert-item" title={item}>
                • {item}
              </div>
            ))}
          </div>
        </Card>
      </Col>
    </Row>
  );
}

export default DashboardStats;

