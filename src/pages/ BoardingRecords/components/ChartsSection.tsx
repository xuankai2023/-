import React, { useEffect, useRef } from 'react';
import { Row, Col, Card } from 'antd';
import * as echarts from 'echarts';

export interface ChartsSectionProps {
  dashboardData: {
    inStorePets: {
      dogs: number;
      cats: number;
    };
  };
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ dashboardData }) => {
  const trendRef = useRef<HTMLDivElement>(null);
  const distRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trendDom = trendRef.current;
    const distDom = distRef.current;
    const heatmapDom = heatmapRef.current;

    if (!trendDom || !distDom || !heatmapDom) return;

    const trendChart = echarts.getInstanceByDom(trendDom) || echarts.init(trendDom);
    const distChart = echarts.getInstanceByDom(distDom) || echarts.init(distDom);
    const heatmapChart = echarts.getInstanceByDom(heatmapDom) || echarts.init(heatmapDom);

    trendChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 40, right: 20, top: 30, bottom: 30 },
      xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
      yAxis: { type: 'value' },
      series: [
        {
          name: '入住数',
          type: 'line',
          smooth: true,
          areaStyle: {},
          data: [12, 15, 9, 18, 22, 17, 14],
        },
      ],
    });

    distChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [
        {
          name: '宠物分布',
          type: 'pie',
          radius: '70%',
          data: [
            { value: dashboardData.inStorePets.dogs, name: '犬' },
            { value: dashboardData.inStorePets.cats, name: '猫' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.4)',
            },
          },
        },
      ],
    });

    heatmapChart.setOption({
      tooltip: { position: 'top' },
      grid: { height: '70%', top: '10%' },
      xAxis: {
        type: 'category',
        data: ['豪华单间', '标准间', '猫别墅', '其他'],
        splitArea: { show: true },
      },
      yAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        splitArea: { show: true },
      },
      visualMap: {
        min: 0,
        max: 20,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
      },
      series: [
        {
          name: '房型热力',
          type: 'heatmap',
          data: [
            [0, 0, 5], [0, 1, 12], [0, 2, 8], [0, 3, 10], [0, 4, 6], [0, 5, 14], [0, 6, 9],
            [1, 0, 3], [1, 1, 6], [1, 2, 9], [1, 3, 11], [1, 4, 7], [1, 5, 4], [1, 6, 2],
            [2, 0, 1], [2, 1, 2], [2, 2, 7], [2, 3, 5], [2, 4, 4], [2, 5, 3], [2, 6, 1],
            [3, 0, 9], [3, 1, 14], [3, 2, 6], [3, 3, 13], [3, 4, 8], [3, 5, 12], [3, 6, 10],
          ],
          label: { show: true },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    });

    const handleResize = () => {
      trendChart.resize();
      distChart.resize();
      heatmapChart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      trendChart.dispose();
      distChart.dispose();
      heatmapChart.dispose();
    };
  }, [dashboardData]);

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={16}>
          <Card title="近7天入住趋势" bordered={false}>
            <div ref={trendRef} className="chart-container"></div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="在店宠物分布" bordered={false}>
            <div ref={distRef} className="chart-container"></div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="房型热力图" bordered={false}>
            <div ref={heatmapRef} className="chart-container"></div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ChartsSection;

