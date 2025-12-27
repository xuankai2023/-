import React, { useState, useEffect, useCallback } from 'react';
import { Input, Button, Space, Tag, Collapse } from 'antd';
import { SearchOutlined, ClearOutlined, FilterOutlined } from '@ant-design/icons';
import { SearchFilters } from './types';

const { Panel } = Collapse;

interface SearchBarProps {
    filters: SearchFilters;
    onKeywordChange: (keyword: string) => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
    children?: React.ReactNode;
}

const SearchBar: React.FC<SearchBarProps> = ({
    filters,
    onKeywordChange,
    onClearFilters,
    hasActiveFilters,
    children,
}) => {
    const [searchValue, setSearchValue] = useState(filters.keyword);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // 防抖处理搜索输入
    useEffect(() => {
        const timer = setTimeout(() => {
            onKeywordChange(searchValue);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchValue, onKeywordChange]);

    // 同步外部 filters 变化
    useEffect(() => {
        setSearchValue(filters.keyword);
    }, [filters.keyword]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    }, []);

    const handleClear = useCallback(() => {
        setSearchValue('');
        onClearFilters();
    }, [onClearFilters]);

    // 获取筛选标签
    const getFilterTags = useCallback(() => {
        const tags: React.ReactNode[] = [];

        if (filters.status.length > 0) {
            filters.status.forEach((status) => {
                tags.push(
                    <Tag key={`status-${status}`} closable onClose={() => {
                        const newStatus = filters.status.filter((s) => s !== status);
                        // 这里需要通过 props 传递 setStatus 方法，暂时先不处理
                    }}>
                        状态: {status}
                    </Tag>
                );
            });
        }

        if (filters.dateRange) {
            tags.push(
                <Tag key="dateRange" closable>
                    日期: {filters.dateRange[0]} ~ {filters.dateRange[1]}
                </Tag>
            );
        }

        if (filters.amountRange) {
            tags.push(
                <Tag key="amountRange" closable>
                    金额: ¥{filters.amountRange[0]} ~ ¥{filters.amountRange[1]}
                </Tag>
            );
        }

        if (filters.petTypes.length > 0) {
            filters.petTypes.forEach((type) => {
                tags.push(
                    <Tag key={`pet-${type}`} closable>
                        宠物: {type}
                    </Tag>
                );
            });
        }

        if (filters.serviceTypes.length > 0) {
            filters.serviceTypes.forEach((type) => {
                tags.push(
                    <Tag key={`service-${type}`} closable>
                        服务: {type}
                    </Tag>
                );
            });
        }

        return tags;
    }, [filters]);

    return (
        <div style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {/* 搜索输入框 */}
                <Input
                    placeholder="搜索订单号、客户名、宠物名、服务类型..."
                    prefix={<SearchOutlined />}
                    value={searchValue}
                    onChange={handleSearchChange}
                    allowClear
                    style={{ width: '100%' }}
                    suffix={
                        hasActiveFilters ? (
                            <Button
                                type="text"
                                icon={<ClearOutlined />}
                                onClick={handleClear}
                                size="small"
                            >
                                清除筛选
                            </Button>
                        ) : null
                    }
                />

                {/* 筛选标签 */}
                {hasActiveFilters && getFilterTags().length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {getFilterTags()}
                    </div>
                )}

                {/* 高级筛选面板 */}
                {children && (
                    <Collapse
                        ghost
                        activeKey={showAdvanced ? ['1'] : []}
                        onChange={(keys) => setShowAdvanced(keys.includes('1'))}
                    >
                        <Panel
                            key="1"
                            header={
                                <span>
                                    <FilterOutlined style={{ marginRight: 8 }} />
                                    高级筛选
                                </span>
                            }
                        >
                            {children}
                        </Panel>
                    </Collapse>
                )}
            </Space>
        </div>
    );
};

export default SearchBar;

