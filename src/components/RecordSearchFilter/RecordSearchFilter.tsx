import React from 'react';
import { Input, Button, Space } from 'antd';
import { SearchOutlined, ReloadOutlined, CalendarOutlined } from '@ant-design/icons';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import './RecordSearchFilter.css';

export interface RecordSearchFilterProps {
  /**
   * 订单号/编号查询值
   */
  orderNumber?: string;
  
  /**
   * 日期范围值 [开始日期, 结束日期]
   */
  dateRange?: [string, string] | null;
  
  /**
   * 订单号变化回调
   */
  onOrderNumberChange?: (value: string) => void;
  
  /**
   * 日期范围变化回调
   */
  onDateRangeChange?: (dateRange: [string, string] | null) => void;
  
  /**
   * 搜索按钮点击回调
   */
  onSearch?: () => void;
  
  /**
   * 重置按钮点击回调
   */
  onReset?: () => void;
  
  /**
   * 订单号输入框占位符
   */
  orderNumberPlaceholder?: string;
  
  /**
   * 是否显示搜索按钮
   */
  showSearchButton?: boolean;
  
  /**
   * 是否显示重置按钮
   */
  showResetButton?: boolean;
  
  /**
   * 自定义样式
   */
  className?: string;
}

const RecordSearchFilter: React.FC<RecordSearchFilterProps> = ({
  orderNumber = '',
  dateRange = null,
  onOrderNumberChange,
  onDateRangeChange,
  onSearch,
  onReset,
  orderNumberPlaceholder = '请输入订单号/编号',
  showSearchButton = true,
  showResetButton = true,
  className = '',
}) => {
  // 处理订单号输入变化
  const handleOrderNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onOrderNumberChange?.(e.target.value);
  };

  // 处理搜索
  const handleSearch = () => {
    onSearch?.();
  };

  // 处理重置
  const handleReset = () => {
    onOrderNumberChange?.('');
    onDateRangeChange?.(null);
    onReset?.();
  };

  // 检查是否有筛选条件
  const hasFilters = orderNumber || dateRange;

  return (
    <div className={`record-search-filter ${className}`}>
      <div className="record-search-filter-content">
        <Space size="middle" wrap className="record-search-filter-items">
          {/* 订单号查询 */}
          <div className="record-search-filter-item">
            <div className="record-search-filter-label">
              <SearchOutlined className="filter-icon" />
              <span>订单号/编号</span>
            </div>
            <Input
              placeholder={orderNumberPlaceholder}
              value={orderNumber}
              onChange={handleOrderNumberChange}
              allowClear
              className="record-search-filter-input"
              onPressEnter={handleSearch}
            />
          </div>

          {/* 时间筛选 */}
          <div className="record-search-filter-item">
            <div className="record-search-filter-label">
              <CalendarOutlined className="filter-icon" />
              <span>时间范围</span>
            </div>
            <DateRangePicker
              value={dateRange}
              onChange={onDateRangeChange}
              placeholder={['开始日期', '结束日期']}
              className="record-search-filter-date-picker"
            />
          </div>

          {/* 操作按钮 */}
          {(showSearchButton || showResetButton) && (
            <div className="record-search-filter-actions">
              {showSearchButton && (
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                  className="record-search-filter-button"
                >
                  搜索
                </Button>
              )}
              {showResetButton && (
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                  disabled={!hasFilters}
                  className="record-search-filter-button"
                >
                  重置
                </Button>
              )}
            </div>
          )}
        </Space>
      </div>
    </div>
  );
};

export default RecordSearchFilter;

