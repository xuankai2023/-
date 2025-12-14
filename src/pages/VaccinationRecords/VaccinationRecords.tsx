import React, { useEffect, useRef, useState } from 'react';
import { Card, Statistic, Row, Col, Table, Button, Tag, Space, Badge, Tooltip, Avatar } from 'antd';
import {
  ArrowUpOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BulbOutlined,
  FileTextOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import * as echarts from 'echarts';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/SideBar/Sidebar';
import { productStocks, ProductStock } from '../../mock/selldata';
import { salesDistributionData, complianceData, heatmapData, stockAlertData } from '../../mock/petData';
import './VaccinationRecords.css';

const VaccinationRecords: React.FC = () => {
  const salesChartRef = useRef<HTMLDivElement>(null);
  const salesChartInstance = useRef<echarts.ECharts | null>(null);
  
  // 重写的热力图引用
  const heatmapChartRef = useRef<HTMLDivElement>(null);
  const heatmapChartInstance = useRef<echarts.ECharts | null>(null);
  
  // 状态管理：当前选中的商品类型
  const [selectedCategory, setSelectedCategory] = useState<'food' | 'supplies' | 'medicine'>('food');
  
  // 根据选中的类别过滤商品数据
  const filteredProducts = productStocks.filter(product => product.category === selectedCategory);
  
  // 商品库存表格列定义
  const productColumns = [
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: ProductStock) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginRight: '10px', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
            {record.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.brand}</div>
          </div>
        </div>
      ),
    },
    {
      title: '库存数量',
      dataIndex: 'stock',
      key: 'stock',
      render: (text: number) => (
        <span style={{ fontWeight: 500, color: text < 100 ? '#ff4d4f' : '#52c41a' }}>
          {text} {productStocks[0]?.unit}
        </span>
      ),
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      render: (text: number) => (
        <span style={{ fontWeight: 500, color: '#fa8c16' }}>¥{text}</span>
      ),
    },
  ];

  // 从petData.ts导入的药品合规数据已在组件中直接使用

  // 表格列定义
  const columns = [
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: '资质状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: string, record: any) => (
        <Tag icon={record.statusType === 'success' ? <CheckCircleOutlined /> : <CloseCircleOutlined />} color={record.statusType}>
          {text}
        </Tag>
      ),
    },
    {
      title: '用药指南',
      dataIndex: 'guide',
      key: 'guide',
      render: (text: string) => <span style={{ fontSize: '12px', color: '#666' }}>{text}</span>,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text: string, record: any) => (
        record.statusType === 'success' ? (
          <a style={{ color: '#1890ff' }}>{text}</a>
        ) : (
          <Button type="primary" danger size="small">{text}</Button>
        )
      ),
    },
  ];

  // 初始化图表
  useEffect(() => {
    // 初始化销售占比环形图
    if (salesChartRef.current) {
      if (!salesChartInstance.current) {
        salesChartInstance.current = echarts.init(salesChartRef.current);
      }
      const salesOption = {
        tooltip: { trigger: 'item' },
        legend: { top: '5%', left: 'center', show: false },
        series: [
          { 
            name: '销售占比',
            type: 'pie', 
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: { show: false, position: 'center' },
            emphasis: {
              label: { show: true, fontSize: 20, fontWeight: 'bold' }
            },
            labelLine: { show: false },
            data: salesDistributionData
          }
        ]
      };
      salesChartInstance.current.setOption(salesOption);
    }

    // 重写的热力图初始化逻辑
    const initHeatmap = () => {
      if (heatmapChartRef.current && heatmapData && heatmapData.length > 0) {
        // 确保容器有尺寸
        const container = heatmapChartRef.current;
        
        // 再次确认容器尺寸
        container.style.height = '600px';
        container.style.width = '100%';
        
        // 检查容器是否可见且有尺寸
        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          // 容器还没有尺寸，延迟再试
          setTimeout(initHeatmap, 100);
          return;
        }
        
        // 初始化或获取图表实例
        if (!heatmapChartInstance.current) {
          heatmapChartInstance.current = echarts.init(container);
        }
        
        // 基础热力图配置
        const heatmapOption = {
          tooltip: {
            formatter: function (params: any) {
              return `${params.name}: 营收贡献 ${params.value}%`;
            }
          },
          series: [
            {
              name: '品类营收',
              type: 'treemap',
              width: '100%',
              height: '100%',
              roam: false,
              breadcrumb: {
                show: true,
                left: 'left',
                top: 10
              },
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 1,
                gapWidth: 1
              },
              label: {
                show: true,
                formatter: '{b}',
                fontSize: 12
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 14,
                  fontWeight: 'bold'
                }
              },
              data: heatmapData
            }
          ]
        };
        
        console.log('热力图数据:', heatmapData);
        console.log('图表实例:', heatmapChartInstance.current);
        // 设置图表配置
        heatmapChartInstance.current.setOption(heatmapOption, true); // 使用true参数强制重绘
      }
    };
    
    // 延迟初始化，确保DOM已经完全渲染
    const timer = setTimeout(initHeatmap, 100);

    // 窗口大小改变时重绘图表
    const handleResize = () => {
      if (heatmapChartInstance.current) {
        // 确保容器尺寸正确
        const container = heatmapChartRef.current;
        if (container) {
          container.style.height = '600px';
          container.style.width = '100%';
        }
        heatmapChartInstance.current.resize();
      }
      salesChartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      salesChartInstance.current?.dispose();
      heatmapChartInstance.current?.dispose();
    };
  }, [heatmapData]); // 添加heatmapData作为依赖

  return (
    <div className="page-container">
      <Header />
      <div className="content-wrapper">
        <Sidebar />
        <main className="main-content">
          {/* 顶部统计卡片 */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} md={6}>
               <Card hoverable>
                <Statistic
                  title="今日销售额"
                  value={18752}
                  prefix="¥"
                  valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>猫砂、关节护理库存危急</div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card hoverable>
                <Statistic
                  title="低库存预警"
                  value={12}
                  suffix="个SKU"
                  valueStyle={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>猫砂、关节护理库存危急</div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card hoverable>
                <Statistic
                  title="待发货订单"
                  value={45}
                  valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
                />
                <div style={{ fontSize: '12px', marginTop: '8px' }}><a style={{ color: '#1890ff' }}>立即处理 &gt;</a></div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card hoverable>
                <Statistic
                  title="商品合规率"
                  value={98}
                  suffix="%"
                  valueStyle={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>2个药品需补充兽药证</div>
              </Card>
            </Col>
          </Row>

          {/* 图表区域 */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={8}>
              <Card title="销售品类全景" bordered={true}>
               
                
                {/* 商品库存表格 - 移到分类选择器上方并占据更多空间 */}
                <div className="product-table-container">
                  <Table 
                    columns={productColumns} 
                    dataSource={filteredProducts} 
                    pagination={false} 
                    size="small"
                    rowKey="id"
                  />
                </div>
                
                {/* 分类选择器 - 移到表格下方 */}
                <div className="category-selector">
                  <Space size={16}>
                    <Avatar 
                      size={40} 
                      style={{ backgroundColor: '#FFA726' }} 
                      onClick={() => setSelectedCategory('food')}
                      className={selectedCategory === 'food' ? 'active-category' : ''}
                    >
                      主粮
                    </Avatar>
                    <Avatar 
                      size={40} 
                      style={{ backgroundColor: '#4FC3F7' }} 
                      onClick={() => setSelectedCategory('supplies')}
                      className={selectedCategory === 'supplies' ? 'active-category' : ''}
                    >
                      用品
                    </Avatar>
                    <Avatar 
                      size={40} 
                      style={{ backgroundColor: '#66BB6A' }} 
                      onClick={() => setSelectedCategory('medicine')}
                      className={selectedCategory === 'medicine' ? 'active-category' : ''}
                    >
                      药品
                    </Avatar>
                  </Space>
                </div>
                
                {/* 分类图例 - 调整位置 */}
                <div className="category-legend">
                  <Space size={8}>
                    <span><span className="legend-item" style={{ backgroundColor: '#FFA726' }}></span>主粮</span>
                    <span><span className="legend-item" style={{ backgroundColor: '#4FC3F7' }}></span>用品</span>
                    <span><span className="legend-item" style={{ backgroundColor: '#66BB6A' }}></span>药品</span>
                  </Space>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={16}>
              <Card
                title={
                  <span>
                    品类热力地图
                    <span style={{ fontSize: '12px', color: '#999', fontWeight: 'normal', marginLeft: '8px' }}>
                      (颜色越深销量越高)
                    </span>
                  </span>
                }
                bordered={true}
                extra={<Button size="small" icon={<DownloadOutlined />} style={{ fontSize: '12px' }}>导出报告</Button>}
              >
                <div ref={heatmapChartRef} className="heatmap-container" />
              </Card>
            </Col>
          </Row>

          {/* 数据表格区域 */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card
                title={
                  <span>
                    <FileTextOutlined style={{ marginRight: '8px' }} />
                    药品合规专区
                  </span>
                }
                bordered={true}
                headStyle={{ backgroundColor: '#f6ffed', borderBottom: '1px solid #b7eb8f' }}
              >
                <div className="warning-banner">
                  <AlertOutlined style={{ color: '#f59e0b', marginRight: '8px' }} />
                  <span className="warning-text">
                    <strong>系统强制提示：</strong>
                    "本产品为保健用品，不可替代兽医诊疗。如需健康咨询，请联系专业宠物医院"
                  </span>
                </div>
                <Table
                  columns={columns}
                  dataSource={complianceData}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card
                title="库存健康度诊断"
                bordered={true}
                extra={
                  <Tooltip title="周转率 = 本月销量 / 期初库存" placement="top">
                    <span style={{ fontSize: '12px', color: '#999', backgroundColor: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>
                      计算公式
                    </span>
                  </Tooltip>
                }
              >
                {/* 智能建议 */}
                <div className="smart-suggestion">
                  <div className="suggestion-header">
                    <div className="suggestion-icon">
                      <BulbOutlined />
                    </div>
                    <div>
                      <p className="suggestion-title">智能建议：</p>
                      <p className="suggestion-content">
                        用户对"关节护理"咨询量激增300%，建议：①增加科普内容 ②搭配软骨素进行组合促销。
                      </p>
                    </div>
                  </div>
                </div>

                {/* 库存预警列表 */}
                <div className="stock-alert-list">
                  {stockAlertData.map((item) => (
                    <div 
                      key={item.key}
                      className={`stock-alert-item ${item.actionType}`}
                    >
                      <div className="alert-content">
                        <div className="alert-info">
                          <div className="alert-emoji">
                            {item.emoji}
                          </div>
                          <div>
                            <p className="alert-name">{item.name}</p>
                            {item.actionType === 'danger' ? (
                              <p className="alert-status danger">
                                剩余 {item.remaining}件 (安全线 {item.safetyLine}件)
                              </p>
                            ) : (
                              <p className="alert-status warning">周转率 0.3 (严重滞销)</p>
                            )}
                          </div>
                        </div>
                        <Button 
                          type="primary" 
                          danger={item.actionType === 'danger'} 
                          size="small"
                          style={item.actionType === 'warning' ? {
                            backgroundColor: '#fa8c16', 
                            borderColor: '#fa8c16'
                          } : {}}
                        >
                          {item.actionText}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>

          {/* 页脚信息 */}
          <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '12px', color: '#999' }}>
            &copy; 2024 PetMaster Intelligent System. Version 2.1.0
          </div>
        </main>
      </div>
    </div>
  );
};

export default VaccinationRecords;