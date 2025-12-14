
import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import { Card, Row, Col, Button, List, Divider } from 'antd';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/SideBar/Sidebar';
import './Services.css';

// 服务页面组件
const Services = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    // 初始化图表
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);

      // 配置图表选项
      const option = {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['医疗收入', '商业服务收入'],
          top: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#f0f0f0'
            }
          }
        },
        series: [
          {
            name: '医疗收入',
            type: 'line',
            stack: 'Total',
            data: [12000, 19000, 15000, 17000, 22000, 35000, 30000],
            lineStyle: {
              color: '#2A9D8F'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(42, 157, 143, 0.3)' },
                { offset: 1, color: 'rgba(42, 157, 143, 0.05)' }
              ])
            },
            smooth: true
          },
          {
            name: '商业服务收入',
            type: 'line',
            stack: 'Total',
            data: [8000, 6000, 7000, 8500, 12000, 25000, 22000],
            lineStyle: {
              color: '#FF6B6B'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(255, 107, 107, 0.3)' },
                { offset: 1, color: 'rgba(255, 107, 107, 0.05)' }
              ])
            },
            smooth: true
          }
        ]
      };

      // 设置图表选项
      chartInstance.current.setOption(option);
    }

    // 响应窗口大小变化
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
    };
  }, []);

  return (
    <div className="services-page">
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main className="services-main">
          {/* 顶部导航栏 */}
          <div className="services-topbar">
            <div className="services-search">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input 
                type="text" 
                placeholder="搜索服务..." 
              />
            </div>
           
          </div>
          {/* 紧急指挥中心 */}
          <div className="emergency-banner">
            <div className="emergency-left">
              <h2><div className="pulse-dot"></div> 急诊指挥中心 (Emergency)</h2>
              <p style={{ fontSize: '14px', opacity: 0.9, marginTop: '5px' }}>当前有 2 起正在进行的急救手术，1 位医师待命</p>
            </div>
            <div className="emergency-stats">
              <div className="stat-item">
                <h4>排队中</h4>
                <p>03</p>
              </div>
              <div className="stat-item">
                <h4>ICU占用</h4>
                <p>80%</p>
              </div>
              <div style={{ alignSelf: 'center' }}>
                   <button className="btn btn-danger"><i className="fa-solid fa-truck-medical"></i> 响应急救</button>
              </div>
            </div>
          </div>
            {/* 服务卡片区域 */}
          <div className='services-grid-container'>
              <Card className="section-card services-grid">
              <div className="card-header">
                <div className="card-title">
                  <i className="fa-solid fa-scissors" style={{ color: 'var(--primary-blue)' }}></i>
                  核心服务项目
                </div>
              </div>
              <Row gutter={[16, 16]}>
                {[1, 2, 3, 4].map((item) => (
                  <Col key={item} xs={6} sm={6} md={6} lg={6}>
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                      <i className="fa-solid fa-scissors" style={{ fontSize: '24px', marginBottom: '8px' }}></i>
                      <div>美容服务</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          </div>
          {/* 主内容区域 */}
          <div className="dashboard-container">
            
            {/* 数据指标区域 */}
            <Card className="metric-card">
              <div className="metric-header">
                <span>今日服务量</span>
                <i className="fa-solid fa-user-group"></i>
              </div>
              <div className="metric-value">28 单</div>
              <div className="metric-trend trend-up">
                <i className="fa-solid fa-arrow-trend-up"></i> +12.5% 较昨日
              </div>
            </Card>
            <Card className="metric-card">
              <div className="metric-header">
                <span>美容营收</span>
                <i className="fa-solid fa-yen-sign"></i>
              </div>
              <div className="metric-value">¥ 12,590</div>
              <div className="metric-trend trend-up">
                <i className="fa-solid fa-arrow-trend-up"></i> +8.5% 较昨日
              </div>
            </Card>
            <Card className="metric-card">
              <div className="metric-header">
                <span>寄养营收</span>
                <i className="fa-solid fa-yen-sign"></i>
              </div>
              <div className="metric-value">¥ 8,250</div>
              <div className="metric-trend trend-down">
                <i className="fa-solid fa-arrow-trend-down"></i> -2.5% 较昨日
              </div>
            </Card>
            <Card className="metric-card">
              <div className="metric-header">
                <span>待服务订单</span>
                <i className="fa-solid fa-clock"></i>
              </div>
              <div className="metric-value">5 单</div>
              <div className="metric-trend">
                <i className="fa-solid fa-arrow-trend-up"></i> +2 较昨日
              </div>
            </Card>

            {/* 服务队列区域 */}
            <Card className="section-card service-queue">
              <div className="card-header">
                <div className="card-title">
                  <i className="fa-solid fa-notes-medical"></i>
                  实时服务队列
                </div>
                <Button type="primary" className="primary-btn">新增服务</Button>
              </div>
              <List
                className="queue-list"
                bordered
                dataSource={[1, 2, 3]}
                renderItem={(item) => (
                  <List.Item key={item} className="queue-item">
                    <div className="queue-info">
                      <div className="queue-pet-icon">
                        <i className="fa-solid fa-dog"></i>
                      </div>
                      <div className="queue-details">
                        <div className="queue-pet-name">宠物名称 (品种)</div>
                        <div className="queue-service">服务项目 | 美容师/医生</div>
                      </div>
                    </div>
                    <div className="queue-status">
                      <div className="queue-status-text">服务中</div>
                      <div className="queue-time">14:30</div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            {/* 服务日程区域 */}
            <Card className="section-card service-schedule">
              <div className="card-header">
                <div className="card-title">
                  <i className="fa-solid fa-calendar-days"></i>
                  服务日程
                </div>
              </div>
              <div className="timeline-list">
                <div className="timeline-item">
                  <div className="time-box">10:00</div>
                  <div className="event-card">
                    <div className="event-title">美容护理</div>
                    <div className="event-desc">周一 10:00-12:00</div>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="time-box">14:00</div>
                  <div className="event-card">
                    <div className="event-title">宠物寄养</div>
                    <div className="event-desc">周二 14:00-16:00</div>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="time-box">09:00</div>
                  <div className="event-card">
                    <div className="event-title">美容护理</div>
                    <div className="event-desc">周三 09:00-11:00</div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <Button type="primary" className="primary-btn">查看日历</Button>
              </div>
            </Card>

            {/* 数据图表区域 */}
            <Card className="section-card service-chart" style={{gridColumn: 'span 8'}}>
              <div className="card-header">
                <div className="card-title">
                  <i className="fa-solid fa-chart-line"></i>
                  服务营收分析
                </div>
                <div>
                  <Button type="default" size="small">本周</Button>
                  <Button type="default" size="small">本月</Button>
                </div>
              </div>
              <div className="chart-container">
                <div ref={chartRef} className="echarts-chart"></div>
              </div>
            </Card>

            {/* 快速操作区域 */}
            <Card className="section-card quick-actions" style={{gridColumn: 'span 4'}}>
              <div className="card-header">
                <div className="card-title">
                  <i className="fa-solid fa-bolt"></i>
                  快速操作
                </div>
              </div>
              <Row gutter={[16, 16]}>
                {[1, 2, 3, 4].map((item) => (
                  <Col key={item} xs={12} sm={12} md={12} lg={12}>
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                      <i className="fa-solid fa-plus" style={{ fontSize: '24px', marginBottom: '8px' }}></i>
                      <div>添加订单</div>
                    </div>
                  </Col>
                ))}
                {[5, 6, 7, 8].map((item) => (
                  <Col key={item} xs={12} sm={12} md={12} lg={12}>
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                      <i className="fa-solid fa-file-invoice" style={{ fontSize: '24px', marginBottom: '8px' }}></i>
                      <div>开单结算</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Services;