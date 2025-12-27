// Admin 组件类型定义

// 搜索和筛选参数接口
export interface SearchFilters {
    keyword: string;
    status: string[];
    dateRange: [string, string] | null;
    amountRange: [number, number] | null;
    petTypes: string[];
    serviceTypes: string[];
}

// 排序配置接口
export interface SortConfig {
    field: 'id' | 'customerName' | 'totalAmount' | 'orderTime' | 'scheduledTime';
    order: 'asc' | 'desc';
}

// 分页配置接口
export interface PaginationConfig {
    current: number;
    pageSize: number;
    total: number;
}

// 筛选选项接口
export interface FilterOptions {
    statusOptions: Array<{ label: string; value: string }>;
    petTypeOptions: Array<{ label: string; value: string }>;
    serviceTypeOptions: Array<{ label: string; value: string }>;
}

