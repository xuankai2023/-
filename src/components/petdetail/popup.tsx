import React from 'react';
import { Modal, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './popup.css';

// 这里的字段名按你之后 mock 里准备的数据来，先约定好结构
export interface VaccinationRecord {
  name: string;   // 项目
  type: string;   // 类型：疫苗 / 驱虫
  date: string;   // 日期
  status: string; // 状态：已完成 / 待接种 等
}

interface VaccinationPopupProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  records: VaccinationRecord[]; // 以后直接把 mock 里的数组塞进来即可
}

const VaccinationPopup: React.FC<VaccinationPopupProps> = ({
  open,
  onOk,
  onCancel,
  records,
}) => {
  const columns: ColumnsType<VaccinationRecord> = [
    {
      title: '项目',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color =
          status === '已完成'
            ? 'green'
            : status === '待接种'
            ? 'orange'
            : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <Modal
      title="免疫与驱虫记录"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="确认"
      cancelText="关闭"
      width={720}
      centered
      destroyOnClose
    >
      <div className="vaccination-popup">
        <Table<VaccinationRecord>
          rowKey={(r, idx) => `${r.name}-${idx}`}
          columns={columns}
          dataSource={records}
          pagination={false}
          size="small"
        />
      </div>
    </Modal>
  );
};

export default VaccinationPopup;