import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  trend: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  color
}) => {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '12px',
        backgroundColor: `${color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px'
      }}>
        {icon}
      </div>
      
      <div style={{ flex: 1 }}>
        <p style={{
          margin: 0,
          color: '#666',
          fontSize: '14px',
          marginBottom: '8px'
        }}>
          {title}
        </p>
        
        <h3 style={{
          margin: 0,
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '4px'
        }}>
          {value}
        </h3>
        
        <span style={{
          fontSize: '12px',
          color: color
        }}>
          {trend}
        </span>
      </div>
    </div>
  );
};

export default StatsCard;