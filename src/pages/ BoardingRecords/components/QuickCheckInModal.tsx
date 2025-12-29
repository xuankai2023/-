import React from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';

export interface QuickCheckInModalProps {
  visible: boolean;
  onOk: (values: any) => void;
  onCancel: () => void;
}

const QuickCheckInModal: React.FC<QuickCheckInModalProps> = ({ visible, onOk, onCancel }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Modal
      title="快速入住"
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="petName"
          label="宠物名称"
          rules={[{ required: true, message: '请输入宠物名称' }]}
        >
          <Input placeholder="请输入宠物名称" />
        </Form.Item>
        <Form.Item
          name="petBreed"
          label="宠物品种"
          rules={[{ required: true, message: '请输入宠物品种' }]}
        >
          <Input placeholder="请输入宠物品种" />
        </Form.Item>
        <Form.Item
          name="roomType"
          label="房间类型"
          rules={[{ required: true, message: '请选择房间类型' }]}
        >
          <Select placeholder="请选择房间类型">
            <Select.Option value="豪华单间">豪华单间</Select.Option>
            <Select.Option value="标准间">标准间</Select.Option>
            <Select.Option value="猫别墅">猫别墅</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="days"
          label="预计入住天数"
          rules={[{ required: true, message: '请输入入住天数' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入天数" />
        </Form.Item>
        <Form.Item name="tags" label="特殊标签">
          <Select mode="tags" placeholder="添加标签（如：过敏源、特殊需求等）" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QuickCheckInModal;

