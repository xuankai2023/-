import { useMemo, useState, useCallback } from 'react';
import { Order, OrderStatus } from '../../../mock/orderData';
import { SearchFilters, SortConfig } from '../types';

interface UseOrderSearchOptions {
  orders: Order[];
  initialFilters?: Partial<SearchFilters>;
  initialSort?: SortConfig;
}

interface UseOrderSearchReturn {
  filteredOrders: Order[];
  filters: SearchFilters;
  sortConfig: SortConfig;
  setKeyword: (keyword: string) => void;
  setStatus: (status: string[]) => void;
  setDateRange: (dateRange: [string, string] | null) => void;
  setAmountRange: (amountRange: [number, number] | null) => void;
  setPetTypes: (petTypes: string[]) => void;
  setServiceTypes: (serviceTypes: string[]) => void;
  setSortConfig: (config: SortConfig) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

// 状态映射
const statusMap: Record<string, OrderStatus> = {
  '待处理': OrderStatus.PENDING,
  '已完成': OrderStatus.COMPLETED,
  '已取消': OrderStatus.CANCELLED,
};

const defaultFilters: SearchFilters = {
  keyword: '',
  status: [],
  dateRange: null,
  amountRange: null,
  petTypes: [],
  serviceTypes: [],
};

const defaultSort: SortConfig = {
  field: 'orderTime',
  order: 'desc',
};

export const useOrderSearch = ({
  orders,
  initialFilters = {},
  initialSort = defaultSort,
}: UseOrderSearchOptions): UseOrderSearchReturn => {
  const [filters, setFilters] = useState<SearchFilters>({
    ...defaultFilters,
    ...initialFilters,
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialSort);

  // 设置搜索关键词
  const setKeyword = useCallback((keyword: string) => {
    setFilters((prev) => ({ ...prev, keyword }));
  }, []);

  // 设置状态筛选
  const setStatus = useCallback((status: string[]) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  // 设置日期范围
  const setDateRange = useCallback((dateRange: [string, string] | null) => {
    setFilters((prev) => ({ ...prev, dateRange }));
  }, []);

  // 设置金额范围
  const setAmountRange = useCallback((amountRange: [number, number] | null) => {
    setFilters((prev) => ({ ...prev, amountRange }));
  }, []);

  // 设置宠物类型
  const setPetTypes = useCallback((petTypes: string[]) => {
    setFilters((prev) => ({ ...prev, petTypes }));
  }, []);

  // 设置服务类型
  const setServiceTypes = useCallback((serviceTypes: string[]) => {
    setFilters((prev) => ({ ...prev, serviceTypes }));
  }, []);

  // 清除所有筛选
  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // 检查是否有活跃的筛选条件
  const hasActiveFilters = useMemo(() => {
    return (
      filters.keyword !== '' ||
      filters.status.length > 0 ||
      filters.dateRange !== null ||
      filters.amountRange !== null ||
      filters.petTypes.length > 0 ||
      filters.serviceTypes.length > 0
    );
  }, [filters]);

  // 筛选和排序订单
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // 关键词搜索
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      result = result.filter((order) => {
        return (
          order.id.toLowerCase().includes(keyword) ||
          order.customerName.toLowerCase().includes(keyword) ||
          order.petName.toLowerCase().includes(keyword) ||
          order.serviceName.toLowerCase().includes(keyword) ||
          order.customerPhone.includes(keyword)
        );
      });
    }

    // 状态筛选
    if (filters.status.length > 0) {
      const statusValues = filters.status.map((s) => statusMap[s] || s);
      result = result.filter((order) => statusValues.includes(order.status));
    }

    // 日期范围筛选
    if (filters.dateRange) {
      const [startDate, endDate] = filters.dateRange;
      result = result.filter((order) => {
        const orderDate = new Date(order.orderTime);
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return orderDate >= start && orderDate <= end;
      });
    }

    // 金额范围筛选
    if (filters.amountRange) {
      const [minAmount, maxAmount] = filters.amountRange;
      result = result.filter((order) => {
        return order.totalAmount >= minAmount && order.totalAmount <= maxAmount;
      });
    }

    // 宠物类型筛选
    if (filters.petTypes.length > 0) {
      result = result.filter((order) => filters.petTypes.includes(order.petType));
    }

    // 服务类型筛选
    if (filters.serviceTypes.length > 0) {
      result = result.filter((order) => filters.serviceTypes.includes(order.serviceName));
    }

    // 排序
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
  }, [orders, filters, sortConfig]);

  return {
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
  };
};




















