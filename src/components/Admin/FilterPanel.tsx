import React, { useCallback, useMemo } from 'react';
import { Row, Col, Checkbox, DatePicker, InputNumber, Space, Button } from 'antd';
import { SearchFilters } from './types';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

interface FilterPanelProps {
  filters: SearchFilters;
  onStatusChange: (status: string[]) => void;
  onDateRangeChange: (dateRange: [string, string] | null) => void;
  onAmountRangeChange: (amountRange: [number, number] | null) => void;
  onPetTypesChange: (petTypes: string[]) => void;
  onServiceTypesChange: (serviceTypes: string[]) => void;
  onClear: () => void;
}

// 状态选项
const statusOptions = [
  { label: '待处理', value: '待处理' },
  { label: '已完成', value: '已完成' },
  { label: '已取消', value: '已取消' },
];

// 宠物类型选项
const petTypeOptions = [
  { label: '狗', value: '狗' },
  { label: '猫', value: '猫' },
  { label: '兔子', value: '兔子' },
  { label: '仓鼠', value: '仓鼠' },
  { label: '鸟类', value: '鸟类' },
];

// 服务类型选项
const serviceTypeOptions = [
  { label: '宠物洗护', value: '宠物洗护' },
  { label: '宠物美容', value: '宠物美容' },
  { label: '宠物寄养', value: '宠物寄养' },
  { label: '宠物训练', value: '宠物训练' },
  { label: '宠物医疗', value: '宠物医疗' },
  { label: '宠物摄影', value: '宠物摄影' },
  { label: '宠物上门服务', value: '宠物上门服务' },
  { label: '宠物用品配送', value: '宠物用品配送' },
];

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onStatusChange,
  onDateRangeChange,
  onAmountRangeChange,
  onPetTypesChange,
  onServiceTypesChange,
  onClear,
}) => {
  // 处理状态选择变化
  const handleStatusChange = useCallback(
    (checkedValues: string[]) => {
      onStatusChange(checkedValues);
    },
    [onStatusChange]
  );

  // 处理日期范围变化
  const handleDateRangeChange = useCallback(
    (dates: [Dayjs | null, Dayjs | null] | null) => {
      if (dates && dates[0] && dates[1]) {
        // Ant Design DatePicker 返回 dayjs 对象，转换为字符串
        // 使用 dayjs 的方法（如果可用）或直接转换为 Date 再格式化
        try {
          const startDate = dates[0].toDate ? dates[0].toDate() : new Date(dates[0].toString());
          const endDate = dates[1].toDate ? dates[1].toDate() : new Date(dates[1].toString());
          onDateRangeChange([
            format(startDate, 'yyyy-MM-dd'),
            format(endDate, 'yyyy-MM-dd'),
          ]);
        } catch (error) {
          // 如果转换失败，尝试直接使用字符串
          const startStr = dates[0].format ? dates[0].format('YYYY-MM-DD') : dates[0].toString().split('T')[0];
          const endStr = dates[1].format ? dates[1].format('YYYY-MM-DD') : dates[1].toString().split('T')[0];
          onDateRangeChange([startStr, endStr]);
        }
      } else {
        onDateRangeChange(null);
      }
    },
    [onDateRangeChange]
  );

  // 处理金额范围变化
  const handleMinAmountChange = useCallback(
    (value: number | null) => {
      const min = value || 0;
      const max = filters.amountRange ? filters.amountRange[1] : 10000;
      onAmountRangeChange([min, max]);
    },
    [filters.amountRange, onAmountRangeChange]
  );

  const handleMaxAmountChange = useCallback(
    (value: number | null) => {
      const min = filters.amountRange ? filters.amountRange[0] : 0;
      const max = value || 10000;
      onAmountRangeChange([min, max]);
    },
    [filters.amountRange, onAmountRangeChange]
  );

  // 处理宠物类型变化
  const handlePetTypesChange = useCallback(
    (checkedValues: string[]) => {
      onPetTypesChange(checkedValues);
    },
    [onPetTypesChange]
  );

  // 处理服务类型变化
  const handleServiceTypesChange = useCallback(
    (checkedValues: string[]) => {
      onServiceTypesChange(checkedValues);
    },
    [onServiceTypesChange]
  );

  // 日期范围值 - 转换为 dayjs 对象（Ant Design DatePicker 需要）
  // Ant Design 6.x 使用 dayjs，但需要单独安装
  // 这里尝试使用 dayjs，如果不可用则使用字符串（DatePicker 可能支持）
  const dateRangeValue = useMemo(() => {
    if (!filters.dateRange) return null;
    // 尝试使用 dayjs（Ant Design DatePicker 需要）
    // 如果 dayjs 未安装，DatePicker 可能无法正常工作
    // 建议安装: npm install dayjs
    try {
      // 检查是否有 dayjs
      const dayjs = require('dayjs');
      return [
        dayjs(filters.dateRange[0]),
        dayjs(filters.dateRange[1]),
      ] as [Dayjs, Dayjs];
    } catch {
      // dayjs 不可用，返回 null，DatePicker 将显示为空
      // 用户需要安装 dayjs 才能使用日期选择器
      console.warn('dayjs is not installed. Please install it: npm install dayjs');
      return null;
    }
  }, [filters.dateRange]);

  return (
    <div style={{ padding: '16px 0' }}>
      <Row gutter={[16, 16]}>
        {/* 状态筛选 */}
        <Col xs={24} sm={12} md={8}>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>订单状态</div>
          <Checkbox.Group
            options={statusOptions}
            value={filters.status}
            onChange={handleStatusChange}
            style={{ width: '100%' }}
          />
        </Col>

        {/* 日期范围筛选 */}
        <Col xs={24} sm={12} md={8}>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>下单日期</div>
          <RangePicker
            value={dateRangeValue}
            onChange={handleDateRangeChange}
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
            placeholder={['开始日期', '结束日期']}
          />
        </Col>

        {/* 金额范围筛选 */}
        <Col xs={24} sm={12} md={8}>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>订单金额</div>
          <Space style={{ width: '100%' }}>
            <InputNumber
              placeholder="最低金额"
              value={filters.amountRange ? filters.amountRange[0] : null}
              onChange={handleMinAmountChange}
              min={0}
              prefix="¥"
              style={{ flex: 1 }}
            />
            <span>~</span>
            <InputNumber
              placeholder="最高金额"
              value={filters.amountRange ? filters.amountRange[1] : null}
              onChange={handleMaxAmountChange}
              min={0}
              prefix="¥"
              style={{ flex: 1 }}
            />
          </Space>
        </Col>

        {/* 宠物类型筛选 */}
        <Col xs={24} sm={12} md={12}>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>宠物类型</div>
          <Checkbox.Group
            options={petTypeOptions}
            value={filters.petTypes}
            onChange={handlePetTypesChange}
            style={{ width: '100%' }}
          />
        </Col>

        {/* 服务类型筛选 */}
        <Col xs={24} sm={12} md={12}>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>服务类型</div>
          <Checkbox.Group
            options={serviceTypeOptions}
            value={filters.serviceTypes}
            onChange={handleServiceTypesChange}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>

      {/* 清除按钮 */}
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Button onClick={onClear} size="small">
          清除所有筛选
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;

