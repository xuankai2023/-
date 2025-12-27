import React from 'react';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import './DateRangePicker.css';

const { RangePicker } = DatePicker;

export interface DateRangePickerProps {
    /**
     * 日期范围变化回调
     * @param dateRange - 日期范围 [开始日期, 结束日期]，格式为 'YYYY-MM-DD'
     */
    onChange?: (dateRange: [string, string] | null) => void;

    /**
     * 当前选中的日期范围
     */
    value?: [string, string] | null;

    /**
     * 占位符
     */
    placeholder?: [string, string];

    /**
     * 是否禁用
     */
    disabled?: boolean;

    /**
     * 自定义样式
     */
    style?: React.CSSProperties;

    /**
     * 自定义类名
     */
    className?: string;

    /**
     * 是否显示清除按钮
     */
    allowClear?: boolean;

    /**
     * 日期格式
     */
    format?: string;

    /**
     * 其他 RangePicker 属性
     */
    [key: string]: any;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
    onChange,
    value,
    placeholder = ['开始日期', '结束日期'],
    disabled = false,
    style,
    className,
    allowClear = true,
    format = 'YYYY-MM-DD',
    ...restProps
}) => {
    // 将字符串日期转换为 dayjs 对象
    const dayjsValue: [Dayjs | null, Dayjs | null] | null = React.useMemo(() => {
        if (!value) return null;
        return [
            value[0] ? dayjs(value[0]) : null,
            value[1] ? dayjs(value[1]) : null
        ];
    }, [value]);

    // 处理日期变化
    const handleChange = (
        dates: [Dayjs | null, Dayjs | null] | null,
        dateStrings: [string, string]
    ) => {
        if (onChange) {
            if (dates && dates[0] && dates[1]) {
                // 两个日期都选择了
                onChange([dateStrings[0], dateStrings[1]]);
            } else {
                // 清空选择
                onChange(null);
            }
        }
    };

    return (
        <RangePicker
            value={dayjsValue}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            style={style}
            className={className}
            allowClear={allowClear}
            format={format}
            {...restProps}
        />
    );
};

export default DateRangePicker;

