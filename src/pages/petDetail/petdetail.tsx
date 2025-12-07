import React from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/SideBar/Sidebar';
import { Button, Card } from 'react-vant';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from '@react-vant/icons';
import { petRecords } from '../../mock/petData';
import * as echarts from 'echarts';
import './petdetail.css';

interface PetInfo {
  id: string;
  name: string;
  breed: string;
  age: string;
  weight: string;
  gender: string;
  avatar: string;
}

// 健康趋势监测图表组件
const HealthTrendChart: React.FC = () => {
  const chartRef = React.useRef<HTMLDivElement>(null);
  const chartInstance = React.useRef<echarts.ECharts>();

  React.useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = echarts.init(chartRef.current);

    const option = {
      title: {
        text: '健康趋势监测',
        left: 'left',
        textStyle: {
          color: '#333',
          fontSize: 18,
        },
        padding: [0, 0, 0, 20],
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['体重变化 (kg)', '每日食量 (g)'],
        top: '5%',
        right: '10%',
        textStyle: {
          fontSize: 14,
        },
      },
      xAxis: {
        type: 'category',
        data: ['6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        axisLabel: {
          color: '#666',
        },
        axisLine: {
          lineStyle: {
            color: '#ccc',
          },
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '体重(kg)',
          position: 'left',
          min: 4.5,
          max: 5.2,
          interval: 0.1,
          axisLabel: {
            color: '#666',
          },
          splitLine: {
            lineStyle: {
              color: '#eee',
            },
          },
        },
        {
          type: 'value',
          name: '食量(g)',
          position: 'right',
          min: 60,
          max: 76,
          interval: 2,
          axisLabel: {
            color: '#666',
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#ccc',
            },
          },
        },
      ],
      series: [
        {
          name: '体重变化 (kg)',
          type: 'line',
          yAxisIndex: 0,
          smooth: true,
          lineStyle: {
            color: '#1890ff',
            width: 2,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.1)' },
            ]),
          },
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#1890ff',
          },
          data: [4.5, 4.6, 4.6, 4.8, 5.0, 5.1, 5.2],
        },
        {
          name: '每日食量 (g)',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          lineStyle: {
            color: '#52c41a',
            width: 2,
            type: 'dashed',
          },
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#52c41a',
          },
          data: [60, 66, 66, 70, 75, 68, 65],
        },
      ],
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        containLabel: true,
      },
    };

    chartInstance.current.setOption(option);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, []);

  return (
    <div className="health-trend-chart">
      <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
      <div className="chart-note">
        <span>ℹ️ 行为观察：11月活动量有所下降，可能与气温降低有关，建议增加室内互动玩具。</span>
      </div>
    </div>
  );
};

function PetDetail() {
  // 从mock数据中获取宠物信息
  const petInfo = petRecords[2]; // 使用第三只宠物"咪咪"的信息
  
  // 计算宠物年龄
  const calculateAge = (birthDate: string): string => {
    const birth = new Date(birthDate);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    return `${years}岁${months}个月`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 顶部导航栏 */}
      <Header />

      {/* 主体：左侧菜单 + 右侧内容 */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* 左侧侧边栏 */}
        <Sidebar />

        {/* 主内容区 */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: '#f5f5f5' }}>
          <div className="pet-detail-container">
            {/* 顶部区域：宠物基本信息 + 健康概览 + 特殊需求 */}
            <div className="pet-top-section">
              {/* 左侧列：宠物基本信息卡片 + 特殊需求卡片 */}
              <div className="pet-left-column">
                {/* 宠物基本信息卡片 - 左侧 */}
                <Card className="pet-basic-info">
                  <div className="pet-avatar-section">
                    <div className="pet-avatar">
                      🐱
                    </div>
                    <h2>{petInfo.name}</h2>
                    <div className="pet-id-status">
                      <span>ID: {petInfo.id}</span>
                      <span className="status-tag">存活</span>
                    </div>
                  </div>
                  
                  <div className="pet-details">
                    <div className="detail-item">
                      <span className="detail-label">品种</span>
                      <span className="detail-value">{petInfo.breed}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">性别</span>
                      <span className="detail-value">{petInfo.gender === 'female' ? '母' : '公'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">年龄</span>
                      <span className="detail-value">{calculateAge(petInfo.birthDate)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">体重</span>
                      <span className="detail-value">{petInfo.weight} kg</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">毛色</span>
                      <span className="detail-value">{petInfo.furColor}</span>
                    </div>
                  </div>
                </Card>
                
                {/* 特殊需求卡片 - 宠物基本信息下方 */}
                <Card className="special-requirements">
                  <h3>特殊需求 & 备注</h3>
                  
                  <div className="allergies">
                    <div className="allergy-header">
                      <span>⚠️</span>
                      <span>严重过敏</span>
                    </div>
                    <div className="allergy-list">
                      <div className="allergy-item">青霉素</div>
                      <div className="allergy-item">海鲜类罐头</div>
                    </div>
                  </div>
                  
                  <div className="emergency-contact">
                    <div className="contact-header">紧急联系人</div>
                    <div className="contact-info">
                      <div className="contact-name">张先生 (主人)</div>
                      <div className="contact-phone">138-8888-8888</div>
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* 右侧列：健康概览 + 健康趋势监测 - 占满剩余空间 */}
              <div className="pet-right-column">
                {/* 健康概览卡片 */}
                <Card className="health-overview">
                  <h3>健康概览</h3>
                  <div className="health-items">
                    <div className="health-item">
                      <div className="health-label">健康评级</div>
                      <div className="health-value">良好 (A)</div>
                      <div className="health-desc">无重大疾病</div>
                    </div>
                    <div className="health-item">
                      <div className="health-label">疫苗状态</div>
                      <div className="health-value">已接种</div>
                      <div className="health-desc">猫三联 (2025/11 到期)</div>
                    </div>
                    <div className="health-item">
                      <div className="health-label">体内外驱虫</div>
                      <div className="health-value warning">待处理</div>
                      <div className="health-desc">逾期 5 天</div>
                    </div>
                    <div className="health-item">
                      <div className="health-label">下次体检</div>
                      <div className="health-value info">2025-12-20</div>
                      <div className="health-desc">剩余 14 天</div>
                    </div>
                  </div>
                </Card>
                
                {/* 健康趋势监测图表 */}
                <div className="chart-card">
                  <HealthTrendChart />
                </div>
              </div>
            </div>
            
            {/* 底部区域：医疗历史记录 + 近期消费记录 */}
            <div className="pet-bottom-section">
              {/* 医疗历史记录卡片 */}
              <Card className="medical-history">
                <div className="card-header">
                  <h3>医疗历史记录</h3>
                  <Button size="small" type="primary" style={{ borderRadius: '6px', backgroundColor: '#1890ff' }}>更新状态</Button>
                </div>
                
                <div className="medical-record">
                  <div className="record-header">
                    <div className="record-date">
                      <span className="date-dot"></span>
                      <span className="record-date-text">2025-11-05</span>
                    </div>
                  </div>
                  <div className="record-desc">年度体检 & 疫苗接种</div>
                  <div className="record-detail">体检结果正常，常规生化检查正常。</div>
                </div>
              </Card>
              
              {/* 近期消费记录卡片 */}
              <Card className="transaction-history">
                <div className="card-header">
                  <h3>近期消费记录</h3>
                  <div className="transaction-filter">
                    <span className="filter-text">2025年</span>
                    <span className="filter-arrow">▼</span>
                  </div>
                </div>
                
                <div className="transaction-list">
                  <div className="transaction-item">
                    <div>
                      <div className="transaction-date">2025-11-05</div>
                      <div className="transaction-desc">体检套餐</div>
                    </div>
                    <div className="transaction-amount">¥380</div>
                  </div>
                  <div className="transaction-item">
                    <div>
                      <div className="transaction-date">2025-10-20</div>
                      <div className="transaction-desc">疫苗接种</div>
                    </div>
                    <div className="transaction-amount">¥120</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PetDetail;