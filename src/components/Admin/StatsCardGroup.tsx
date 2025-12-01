import React from 'react';
import StatsCard from './StatsCard';

interface StatData {
  title: string;
  value: string;
  icon: string;
  trend: string;
  color: string;
}

const StatsCardGroup: React.FC = () => {
  const statsData: StatData[] = [
    {
      title: '访问用户',
      value: '684',
      icon: '👥',
      trend: '+12.4% 较上月',
      color: '#1890ff'
    },
    {
      title: '活跃用户',
      value: '236',
      icon: '💪',
      trend: '+8.2% 较上月',
      color: '#52c41a'
    },
    {
      title: '订单总数',
      value: '1,245',
      icon: '📦',
      trend: '+15.8% 较上月',
      color: '#faad14'
    },
    {
      title: '营收总额',
      value: '¥5,387',
      icon: '💰',
      trend: '+6.4% 较上月',
      color: '#f5222d'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '24px'
    }}>
      {statsData.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default StatsCardGroup;