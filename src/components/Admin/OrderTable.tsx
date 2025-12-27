import React, { useState, useMemo, useCallback } from 'react';
import { Table, Tag, Button, Space } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { Order, OrderStatus } from '../../mock/orderData';
import { SortConfig } from './types';

interface OrderTableProps {
  orders: Order[];
  showPagination?: boolean;
  pageSize?: number;
  sortConfig?: SortConfig;
  onSortChange?: (config: SortConfig) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  showPagination = true,
  pageSize = 10,
  sortConfig: externalSortConfig,
  onSortChange,
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [internalSortConfig, setInternalSortConfig] = useState<SortConfig>({
    field: 'orderTime',
    order: 'desc',
  });

  // 使用外部排序配置或内部排序配置
  const sortConfig = externalSortConfig || internalSortConfig;
  const handleSortChange = onSortChange || setInternalSortConfig;

  // 对订单进行排序
  const sortedOrders = useMemo(() => {
    const result = [...orders];
    result.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortConfig.field) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'customerName':
          aValue = a.customerName;
          bValue = b.customerName;
          break;
        case 'totalAmount':
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case 'orderTime':
          aValue = new Date(a.orderTime).getTime();
          bValue = new Date(b.orderTime).getTime();
          break;
        case 'scheduledTime':
          aValue = new Date(a.scheduledTime).getTime();
          bValue = new Date(b.scheduledTime).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.order === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [orders, sortConfig]);

  // 状态映射
  const statusMap: Record<OrderStatus, { text: string; color: string }> = {
    [OrderStatus.PENDING]: { text: '待处理', color: 'orange' },
    [OrderStatus.COMPLETED]: { text: '已完成', color: 'green' },
    [OrderStatus.CANCELLED]: { text: '已取消', color: 'default' },
  };

  // 处理排序变化
  const handleTableChange: TableProps<Order>['onChange'] = useCallback(
    (pagination: any, filters: any, sorter: any) => {
      if (Array.isArray(sorter)) {
        return;
      }

      if (sorter && sorter.field) {
        const field = sorter.field as SortConfig['field'];
        const order = sorter.order === 'ascend' ? 'asc' : 'desc';
        handleSortChange({ field, order });
      }

      if (pagination) {
        setCurrentPage(pagination.current || 1);
      }
    },
    [handleSortChange]
  );

  // 处理详情点击
  const handleDetailClick = useCallback(
    (orderId: string) => {
      navigate(`/order/${orderId}`);
    },
    [navigate]
  );

  // 处理编辑点击
  const handleEditClick = useCallback(
    (orderId: string) => {
      navigate(`/order/${orderId}/edit`);
    },
    [navigate]
  );

  // 表格列定义
  const columns: ColumnsType<Order> = useMemo(
    () => [
      {
        title: '订单编号',
        dataIndex: 'id',
        key: 'id',
        sorter: true,
        sortOrder:
          sortConfig.field === 'id'
            ? sortConfig.order === 'asc'
              ? 'ascend'
              : 'descend'
            : null,
        width: 150,
      },
      {
        title: '客户',
        dataIndex: 'customerName',
        key: 'customerName',
        sorter: true,
        sortOrder:
          sortConfig.field === 'customerName'
            ? sortConfig.order === 'asc'
              ? 'ascend'
              : 'descend'
            : null,
        render: (text: string, record: Order) => (
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.customerPhone}</div>
          </div>
        ),
      },
      {
        title: '宠物信息',
        key: 'pet',
        render: (_: any, record: Order) => (
          <div>
            <div style={{ fontWeight: 500 }}>{record.petName}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.petType}</div>
          </div>
        ),
      },
      {
        title: '服务类型',
        dataIndex: 'serviceName',
        key: 'serviceName',
        width: 120,
      },
      {
        title: '订单金额',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        sorter: true,
        sortOrder:
          sortConfig.field === 'totalAmount'
            ? sortConfig.order === 'asc'
              ? 'ascend'
              : 'descend'
            : null,
        render: (amount: number) => (
          <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
            ¥{amount.toFixed(2)}
          </span>
        ),
        width: 120,
      },
      {
        title: '下单时间',
        dataIndex: 'orderTime',
        key: 'orderTime',
        sorter: true,
        sortOrder:
          sortConfig.field === 'orderTime'
            ? sortConfig.order === 'asc'
              ? 'ascend'
              : 'descend'
            : null,
        render: (time: string) => new Date(time).toLocaleString('zh-CN'),
        width: 180,
      },
      {
        title: '订单状态',
        dataIndex: 'status',
        key: 'status',
        render: (status: OrderStatus) => {
          const config = statusMap[status];
          return <Tag color={config.color}>{config.text}</Tag>;
        },
        width: 100,
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right' as const,
        width: 150,
        render: (_: any, record: Order) => (
          <Space size="small">
            <Button
              type="link"
              size="small"
              onClick={() => handleDetailClick(record.id)}
            >
              详情
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => handleEditClick(record.id)}
            >
              编辑
            </Button>
          </Space>
        ),
      },
    ],
    [sortConfig, handleDetailClick, handleEditClick, statusMap]
  );

  // 分页配置
  const paginationConfig = useMemo(
    () =>
      showPagination
        ? {
          current: currentPage,
          pageSize,
          total: sortedOrders.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total: number) => `共 ${total} 条`,
          pageSizeOptions: ['10', '20', '50', '100'],
        }
        : false,
    [showPagination, currentPage, pageSize, sortedOrders.length]
  );

  // 当前页数据
  const currentPageData = useMemo(() => {
    if (!showPagination) {
      return sortedOrders;
    }
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedOrders.slice(start, end);
  }, [sortedOrders, currentPage, pageSize, showPagination]);

  return (
    <Table
      columns={columns}
      dataSource={currentPageData}
      rowKey="id"
      pagination={paginationConfig}
      onChange={handleTableChange}
      scroll={{ x: 1200 }}
      size="middle"
    />
  );
};

export default OrderTable;