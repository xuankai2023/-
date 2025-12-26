import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/SideBar/Sidebar';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { petRecords } from '../../mock/petData';
import * as echarts from 'echarts';
import VaccinationPopup, {
  VaccinationRecord,
} from '../../components/petdetail/popup';
import './petdetail.css';

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

function PetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // 从mock数据中获取宠物信息
  const petInfo = petRecords.find(pet => pet.id === id) || petRecords[2];

  // 弹窗开关（与 JSX 中的 vaccineModalOpen / setVaccineModalOpen 保持一致）
  const [vaccineModalOpen, setVaccineModalOpen] = useState(false);

  // 将 mock 中当前宠物的疫苗记录映射到弹窗使用的数据结构
  const vaccinationRecords: VaccinationRecord[] = (petInfo.vaccineRecords || []).map(
    (item) => ({
      name: item.name,
      // 简单标记：名称包含“驱虫”则视为驱虫，否则视为疫苗
      type: item.name.includes('驱虫') ? '驱虫' : '疫苗',
      date: item.date,
      // 已到期的视为已完成，未来日期视为待接种
      status: new Date(item.date) <= new Date() ? '已完成' : '待接种',
    })
  );

  // 体重趋势图引用
  const weightChartRef = useRef<HTMLDivElement>(null);
  const weightChartInstance = useRef<echarts.ECharts | null>(null);

  // 雷达图引用
  const radarChartRef = useRef<HTMLDivElement>(null);
  const radarChartInstance = useRef<echarts.ECharts | null>(null);

  // 初始化图表
  useEffect(() => {
    // 1. 体重趋势图
    if (weightChartRef.current) {
      weightChartInstance.current = echarts.init(weightChartRef.current);
      const weightOption = {
        tooltip: { trigger: 'axis' },
        grid: { top: '10%', left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['7月', '8月', '9月', '10月', '11月', '12月'],
          axisLine: { lineStyle: { color: '#94a3b8' } }
        },
        yAxis: {
          type: 'value',
          min: 25,
          max: 32,
          axisLine: { show: false },
          splitLine: { lineStyle: { type: 'dashed', color: '#e2e8f0' } }
        },
        series: [{
          name: '体重 (kg)',
          type: 'line',
          smooth: true,
          data: [27.2, 27.5, 27.8, 28.1, 28.3, 28.5],
          itemStyle: { color: '#3b82f6' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.01)' }
            ])
          }
        }]
      };
      weightChartInstance.current.setOption(weightOption);
    }

    // 2. 健康雷达图 (行为观察)
    if (radarChartRef.current) {
      radarChartInstance.current = echarts.init(radarChartRef.current);
      const radarOption = {
        tooltip: {},
        radar: {
          indicator: [
            { name: '精神状态', max: 100 },
            { name: '食欲', max: 100 },
            { name: '活动量', max: 100 },
            { name: '排泄情况', max: 100 },
            { name: '社交互动', max: 100 }
          ],
          splitArea: { show: true, areaStyle: { color: ['#f8fafc', '#f1f5f9'] } },
          axisName: { color: '#64748b' }
        },
        series: [{
          name: '健康评分',
          type: 'radar',
          data: [{
            value: [95, 90, 85, 92, 88],
            name: '当前状态',
            itemStyle: { color: '#10b981' },
            areaStyle: { color: 'rgba(16, 185, 129, 0.4)' }
          }]
        }]
      };
      radarChartInstance.current.setOption(radarOption);
    }

    // 窗口大小改变时重绘图表
    const handleResize = () => {
      weightChartInstance.current?.resize();
      radarChartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      weightChartInstance.current?.dispose();
      radarChartInstance.current?.dispose();
    };
  }, []);

  return (
    <div className="pet-detail-container">
      {/* 左侧侧边栏 */}
      <Sidebar />

      {/* 主内容区域 */}
      <main>
        {/* 顶部 Header */}
        <header>
          <div>
            <Button type="primary" onClick={() => navigate('/record')}>
              <i className="fa-solid fa-arrow-left mr-1">返回</i> 
            </Button>
          </div>
          <div>
            <button>
              <i className="fa-solid fa-print mr-1">导出报告</i> 
            </button>
            <button>
              <i className="fa-solid fa-pen-to-square mr-1">更新数据</i> 
            </button>
          </div>
        </header>

        {/* 内容滚动区 */}
        <div className="content-scroll-area">
          {/* 1. 顶部概览卡片 */}
          <div className="pet-top-section">
            {/* 头像 */}
            <div className="pet-avatar-section">
              <img src={petInfo.avatar} alt={petInfo.name} />
              <span className="status-tag">健康</span>
            </div>

            {/* 基础信息 */}
            <div className="pet-basic-info">
              <div>
                <div>
                  <h2>
                    {petInfo.name}
                    <i className={`fa-solid ${petInfo.gender === 'female' ? 'fa-venus text-pink-400' : 'fa-mars text-blue-400'} text-lg`} title={petInfo.gender === 'female' ? '母' : '公'}></i>
                  </h2>
                  <p className="pet-id">ID: {petInfo.id}</p>
                </div>
                <span className="sterilized-tag">已绝育</span>
              </div>

              <div className="pet-details">
                <div className="detail-item">
                  <p className="detail-label">品种</p>
                  <p className="detail-value">{petInfo.breed}</p>
                </div>
                <div className="detail-item">
                  <p className="detail-label">年龄</p>
                  <p className="detail-value">{calculateAge(petInfo.birthDate)}</p>
                </div>
                <div className="detail-item">
                  <p className="detail-label">体重</p>
                  <p className="detail-value">{petInfo.weight} kg <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 400, backgroundColor: '#d1fae5', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>标准</span></p>
                </div>
                <div className="detail-item">
                  <p className="detail-label">毛色</p>
                  <p className="detail-value">{petInfo.furColor}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. 核心健康指标 (实时数据) */}
          <div className="health-overview">
            <h3>
              <i className="fa-solid fa-heart-pulse"></i> 最新生命体征
              <span>更新时间: 2025-12-10 14:30</span>
            </h3>
            <div className="health-items">
              {/* 体温 */}
              <div className="health-item">
                <div>
                  <span>体温 (℃)</span>
                  <i className="fa-solid fa-temperature-half" style={{ color: '#f87171' }}></i>
                </div>
                <div className="health-value">38.5</div>
                <div className="health-desc">
                  <i className="fa-solid fa-circle-check"></i> 正常范围 (38.0-39.0)
                </div>
              </div>

              {/* 心率 */}
              <div className="health-item">
                <div>
                  <span>心率 (bpm)</span>
                  <i className="fa-solid fa-heart" style={{ color: '#ef4444' }}></i>
                </div>
                <div className="health-value">82</div>
                <div className="health-desc">
                  <i className="fa-solid fa-circle-check"></i> 正常范围 (60-140)
                </div>
              </div>

              {/* 呼吸 */}
              <div className="health-item">
                <div>
                  <span>呼吸频率 (次/分)</span>
                  <i className="fa-solid fa-lungs" style={{ color: '#60a5fa' }}></i>
                </div>
                <div className="health-value">24</div>
                <div className="health-desc">
                  <i className="fa-solid fa-circle-check"></i> 正常范围 (10-30)
                </div>
              </div>

              {/* 黏膜 */}
              <div className="health-item">
                <div>
                  <span>黏膜颜色</span>
                  <i className="fa-regular fa-eye" style={{ color: '#94a3b8' }}></i>
                </div>
                <div className="health-value pink">粉红</div>
                <div className="health-desc">
                  <i className="fa-solid fa-circle-check"></i> 健康状态
                </div>
              </div>
            </div>
          </div>

          {/* 3. 数据可视化图表 */}
          <div className="chart-section">
            {/* 左侧：体重趋势图 */}
            <div className="chart-card">
              <h3>体重变化趋势 (近6个月)</h3>
              <div ref={weightChartRef} className="chart-container" />
            </div>

            {/* 右侧：健康行为雷达图 */}
            <div className="chart-card">
              <h3>行为与状态评估</h3>
              <div ref={radarChartRef} className="chart-container" />
            </div>
          </div>

          {/* 4. 详细检查与记录模块 */}
          <div className="records-section">
            {/* 体格检查记录 */}
            <div className="records-card">
              <div className="records-card-header">
                <h3>最新体格检查</h3>
                <span>检查人: Dr. Wang</span>
              </div>
              <div className="examination-list">
                <div className="examination-item">
                  <div>
                    <div className="examination-icon">
                      <i className="fa-solid fa-dog"></i>
                    </div>
                    <span className="examination-name">皮肤与毛发</span>
                  </div>
                  <span className="examination-status normal">无异常</span>
                </div>
                <div className="examination-item">
                  <div>
                    <div className="examination-icon">
                      <i className="fa-solid fa-eye"></i>
                    </div>
                    <span className="examination-name">眼睛/视力</span>
                  </div>
                  <span className="examination-status normal">角膜透明</span>
                </div>
                <div className="examination-item">
                  <div>
                    <div className="examination-icon">
                      <i className="fa-solid fa-tooth"></i>
                    </div>
                    <span className="examination-name">口腔健康</span>
                  </div>
                  <span className="examination-status warning">轻微牙结石</span>
                </div>
                <div className="examination-item">
                  <div>
                    <div className="examination-icon">
                      <i className="fa-solid fa-ear-listen"></i>
                    </div>
                    <span className="examination-name">耳道检查</span>
                  </div>
                  <span className="examination-status normal">干净无异味</span>
                </div>
              </div>
            </div>

            {/* 疫苗与驱虫计划 */}
            <div className="records-card">
              <div className="records-card-header">
                <h3>免疫与驱虫记录</h3>
                <button onClick={() => setVaccineModalOpen(true)}>查看全部</button>
              </div>
              <div>
                <table className="vaccination-table">
                  <thead>
                    <tr>
                      <th>项目</th>
                      <th>类型</th>
                      <th>日期</th>
                      <th>状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="vaccine-name">狂犬疫苗</td>
                      <td className="vaccine-type">疫苗</td>
                      <td className="vaccine-date">2025-03-15</td>
                      <td><span className="vaccine-status completed">已完成</span></td>
                    </tr>
                    <tr>
                      <td className="vaccine-name">爱沃克 (体内外)</td>
                      <td className="vaccine-type">驱虫</td>
                      <td className="vaccine-date">2025-11-01</td>
                      <td><span className="vaccine-status completed">已完成</span></td>
                    </tr>
                    <tr>
                      <td className="vaccine-name">八联疫苗 (加强)</td>
                      <td className="vaccine-type">疫苗</td>
                      <td className="vaccine-date">2025-12-20</td>
                      <td><span className="vaccine-status pending">待接种</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="health-reminder">
                <i className="fa-solid fa-bell"></i>
                <div>
                  <h4>健康提醒</h4>
                  <p>距离下一次全面体检还有 15 天，建议提前预约。</p>
                </div>
              </div>
            </div>

            {/* 弹窗组件 */}
            <VaccinationPopup
              open={vaccineModalOpen}
              onOk={() => setVaccineModalOpen(false)}
              onCancel={() => setVaccineModalOpen(false)}
              records={vaccinationRecords}
            />
          </div>
          {/* 底部留白 */}
          <div className="bottom-margin"></div>
        </div>
      </main>
    </div>
  );
}

export default PetDetail;