import React, { useCallback } from 'react';
import { Button, Space, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ExportOutlined } from '@ant-design/icons';
import OrderTable from './OrderTable';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import { useOrderSearch } from './hooks/useOrderSearch';
import { allOrders } from '../../mock/orderData';
import { SortConfig } from './types';

const { Option } = Select;

const OrderListSection: React.FC = () => {
  const navigate = useNavigate();
  const {
    filteredOrders,
    filters,
    sortConfig,
    setKeyword,
    setStatus,
    setDateRange,
    setAmountRange,
    setPetTypes,
    setServiceTypes,
    setSortConfig,
    clearFilters,
    hasActiveFilters,
  } = useOrderSearch({ orders: allOrders });

  // 处理查看全部
  const handleViewAll = useCallback(() => {
    navigate('/order');
  }, [navigate]);

  // 处理排序变化
  const handleSortChange = useCallback(
    (value: string) => {
      const [field, order] = value.split('-') as [SortConfig['field'], 'asc' | 'desc'];
      setSortConfig({ field, order });
    },
    [setSortConfig]
  );

  // 处理导出
  const handleExport = useCallback(() => {
    // 导出功能实现（可以导出为 CSV 或 Excel）
    const csvContent = [
      ['订单编号', '客户', '宠物', '服务类型', '金额', '状态', '下单时间'].join(','),
      ...filteredOrders.map((order) =>
        [
          order.id,
          order.customerName,
          `${order.petName}(${order.petType})`,
          order.serviceName,
          order.totalAmount,
          order.status,
          new Date(order.orderTime).toLocaleString('zh-CN'),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `订单列表_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }, [filteredOrders]);

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '18px',
            color: '#333',
          }}
        >
          最新订单
        </h2>

        <Space>
          <Button icon={<ExportOutlined />} onClick={handleExport}>
            导出
          </Button>
          <Button type="primary" onClick={handleViewAll}>
            查看全部
          </Button>
        </Space>
      </div>

      {/* 搜索栏 */}
      <SearchBar
        filters={filters}
        onKeywordChange={setKeyword}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      >
        <FilterPanel
          filters={filters}
          onStatusChange={setStatus}
          onDateRangeChange={setDateRange}
          onAmountRangeChange={setAmountRange}
          onPetTypesChange={setPetTypes}
          onServiceTypesChange={setServiceTypes}
          onClear={clearFilters}
        />
      </SearchBar>

      {/* 排序选择器 */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Space>
          <span>排序：</span>
          <Select
            value={`${sortConfig.field}-${sortConfig.order}`}
            onChange={handleSortChange}
            style={{ width: 200 }}
          >
            <Option value="orderTime-desc">下单时间（最新）</Option>
            <Option value="orderTime-asc">下单时间（最早）</Option>
            <Option value="totalAmount-desc">金额（高到低）</Option>
            <Option value="totalAmount-asc">金额（低到高）</Option>
            <Option value="customerName-asc">客户名（A-Z）</Option>
            <Option value="customerName-desc">客户名（Z-A）</Option>
            <Option value="id-asc">订单号（升序）</Option>
            <Option value="id-desc">订单号（降序）</Option>
          </Select>
        </Space>
      </div>

      {/* 订单表格 */}
      <OrderTable
        orders={filteredOrders}
        showPagination={true}
        pageSize={10}
        sortConfig={sortConfig}
        onSortChange={setSortConfig}
      />
    </div>
  );
};

export default OrderListSection;