import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Table, Select, Statistic } from 'antd';
import {
  BarChartOutlined,
  PieChartOutlined,
  FileTextOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import './BillAnalysis.css';

const { Option } = Select;

// 模拟账单数据
const mockBillData = [
  {
    id: '1',
    date: '2025-01-15',
    type: '宠物美容',
    amount: 128,
    status: '已支付',
    customerName: '张三',
    petName: '旺财'
  },
  {
    id: '2',
    date: '2025-01-20',
    type: '宠物寄养',
    amount: 300,
    status: '已支付',
    customerName: '李四',
    petName: '咪咪'
  },
  {
    id: '3',
    date: '2025-02-10',
    type: '宠物美容',
    amount: 158,
    status: '已支付',
    customerName: '王五',
    petName: '小黑'
  },
  {
    id: '4',
    date: '2025-02-18',
    type: '宠物医疗',
    amount: 500,
    status: '已支付',
    customerName: '赵六',
    petName: '小白'
  },
  {
    id: '5',
    date: '2025-03-05',
    type: '宠物寄养',
    amount: 450,
    status: '已支付',
    customerName: '孙七',
    petName: '可乐'
  },
  {
    id: '6',
    date: '2025-03-15',
    type: '宠物美容',
    amount: 128,
    status: '已支付',
    customerName: '周八',
    petName: '雪碧'
  },
  {
    id: '7',
    date: '2025-03-20',
    type: '宠物食品',
    amount: 200,
    status: '已支付',
    customerName: '吴九',
    petName: '汉堡'
  },
  {
    id: '8',
    date: '2025-04-10',
    type: '宠物医疗',
    amount: 600,
    status: '已支付',
    customerName: '郑十',
    petName: '薯条'
  }
];

// 消费类型颜色映射
const typeColorMap = {
  '宠物美容': '#1890ff',
  '宠物寄养': '#52c41a',
  '宠物医疗': '#ff4d4f',
  '宠物食品': '#faad14',
  '其他': '#9254de'
};

interface BillRecord {
  id: string;
  date: string;
  type: string;
  amount: number;
  status: string;
  customerName: string;
  petName: string;
}

const BillAnalysis: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string[]>();
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  // 处理类型筛选
  const handleTypeChange = (value: string[]) => {
    setSelectedType(value);
  };

  // 处理日期范围筛选
  const handleDateChange = (dateRange: [string, string] | null) => {
    setDateRange(dateRange);
  };

  // 过滤账单数据
  const filteredData = useMemo(() => {
    let result = [...mockBillData];

    // 按类型筛选
    if (selectedType && selectedType.length > 0) {
      result = result.filter(item => selectedType.includes(item.type));
    }

    // 按日期范围筛选
    if (dateRange) {
      const startDate = new Date(dateRange[0]);
      const endDate = new Date(dateRange[1]);
      result = result.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    return result;
  }, [selectedType, dateRange]);

  // 计算月度消费趋势数据
  const monthlyTrendData = useMemo(() => {
    const monthlyData: Record<string, number> = {};

    filteredData.forEach(item => {
      const month = item.date.substring(0, 7); // 格式：YYYY-MM
      monthlyData[month] = (monthlyData[month] || 0) + item.amount;
    });

    // 转换为图表所需格式
    return Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount
    }));
  }, [filteredData]);

  // 计算分类消费占比数据
  const categoryData = useMemo(() => {
    const categoryMap: Record<string, number> = {};

    filteredData.forEach(item => {
      categoryMap[item.type] = (categoryMap[item.type] || 0) + item.amount;
    });

    // 转换为图表所需格式
    return Object.entries(categoryMap).map(([type, value]) => ({
      type,
      value
    }));
  }, [filteredData]);

  // 计算统计数据
  const statsData = useMemo(() => {
    const totalAmount = filteredData.reduce((sum, item) => sum + item.amount, 0);
    const averageAmount = filteredData.length > 0 ? totalAmount / filteredData.length : 0;
    const totalRecords = filteredData.length;
    const maxAmount = Math.max(...filteredData.map(item => item.amount), 0);

    return {
      totalAmount,
      averageAmount,
      totalRecords,
      maxAmount
    };
  }, [filteredData]);

  // 表格列定义
  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => (
        <span
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 500,
            backgroundColor: `${typeColorMap[type as keyof typeof typeColorMap] || '#9254de'}15`,
            color: typeColorMap[type as keyof typeof typeColorMap] || '#9254de',
            border: `1px solid ${typeColorMap[type as keyof typeof typeColorMap] || '#9254de'}40`
          }}
        >
          {type}
        </span>
      )
    },
    {
      title: '客户',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 100
    },
    {
      title: '宠物',
      dataIndex: 'petName',
      key: 'petName',
      width: 100
    },
    {
      title: '金额（元）',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (text: number) => (
        <span style={{ 
          fontWeight: 600, 
          color: '#ff4d4f',
          fontSize: '15px'
        }}>
          ¥{text.toFixed(2)}
        </span>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <span
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 500,
            backgroundColor: status === '已支付' ? '#52c41a15' : '#ff4d4f15',
            color: status === '已支付' ? '#52c41a' : '#ff4d4f',
            border: `1px solid ${status === '已支付' ? '#52c41a40' : '#ff4d4f40'}`
          }}
        >
          {status}
        </span>
      )
    }
  ];

  // 月度消费趋势表格数据
  const monthlyTrendColumns = [
    {
      title: '月份',
      dataIndex: 'month',
      key: 'month'
    },
    {
      title: '消费金额（元）',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: number) => (
        <span style={{ 
          fontWeight: 600, 
          color: '#ff4d4f',
          fontSize: '15px'
        }}>
          ¥{text.toFixed(2)}
        </span>
      )
    }
  ];

  // 分类消费占比表格数据
  const categoryColumns = [
    {
      title: '消费类型',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '消费金额（元）',
      dataIndex: 'value',
      key: 'value',
      render: (text: number) => (
        <span style={{ 
          fontWeight: 600, 
          color: '#ff4d4f',
          fontSize: '15px'
        }}>
          ¥{text.toFixed(2)}
        </span>
      )
    },
    {
      title: '占比',
      dataIndex: 'value',
      key: 'percentage',
      render: (value: number) => {
        const total = categoryData.reduce((sum, item) => sum + item.value, 0);
        const percentage = total > 0 ? (value / total) * 100 : 0;
        return `${percentage.toFixed(2)}%`;
      }
    }
  ];

  return (
    <div className="bill-analysis-container">
      <h1>账单分析</h1>

      {/* 筛选区域 */}
      <Card className="filter-card" size="small">
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Select
              mode="multiple"
              placeholder="选择消费类型"
              value={selectedType}
              onChange={handleTypeChange}
              style={{ width: '100%' }}
            >
              {Object.keys(typeColorMap).map(type => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
          </Col>
          <Col span={12}>
            <DateRangePicker
              onChange={handleDateChange}
              value={dateRange}
              style={{ width: '100%' }}
              placeholder={['开始日期', '结束日期']}
            />
          </Col>
        </Row>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={16} className="stats-row">
        <Col span={6}>
          <Card>
            <Statistic
              title="总消费金额"
              value={statsData.totalAmount}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均消费金额"
              value={statsData.averageAmount}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="消费笔数"
              value={statsData.totalRecords}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="最大单笔消费"
              value={statsData.maxAmount}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={16} className="charts-row">
        <Col span={12}>
          <Card title={<div className="card-title"><BarChartOutlined /> 月度消费趋势</div>}>
            <Table
              columns={monthlyTrendColumns}
              dataSource={monthlyTrendData}
              rowKey="month"
              pagination={false}
              bordered
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title={<div className="card-title"><PieChartOutlined /> 分类消费占比</div>}>
            <Table
              columns={categoryColumns}
              dataSource={categoryData}
              rowKey="type"
              pagination={false}
              bordered
            />
          </Card>
        </Col>
      </Row>

      {/* 消费明细 */}
      <Card title={<div className="card-title"><FileTextOutlined /> 消费明细</div>} className="detail-card">
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default BillAnalysis;