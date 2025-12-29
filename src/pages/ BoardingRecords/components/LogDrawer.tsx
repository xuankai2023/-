import React from 'react';
import { Drawer, Form, DatePicker, Input, Button, message } from 'antd';

export interface LogDrawerProps {
  visible: boolean;
  room: any;
  onClose: () => void;
}

const LogDrawer: React.FC<LogDrawerProps> = ({ visible, room, onClose }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleSave = () => {
    message.success('日志已保存');
    onClose();
  };

  return (
    <Drawer
      title={`${room?.pet?.name || '宠物'} - 健康日志`}
      placement="right"
      onClose={onClose}
      open={visible}
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="date" label="日期" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="content" label="日志内容" rules={[{ required: true }]}>
          <Input.TextArea rows={6} placeholder="记录宠物的健康状况、饮食、活动等" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" block onClick={handleSave}>
            保存日志
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default LogDrawer;

