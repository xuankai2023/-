import React from 'react';
import { Drawer, Form, Input, Upload, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export interface PostDrawerProps {
  visible: boolean;
  room: any;
  onClose: () => void;
}

const PostDrawer: React.FC<PostDrawerProps> = ({ visible, room, onClose }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handlePublish = () => {
    message.success('动态已发布');
    onClose();
  };

  return (
    <Drawer
      title={`${room?.pet?.name || '宠物'} - 发布动态`}
      placement="right"
      onClose={onClose}
      open={visible}
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="content" label="动态内容" rules={[{ required: true }]}>
          <Input.TextArea rows={6} placeholder="分享宠物的日常动态..." />
        </Form.Item>
        <Form.Item name="images" label="上传图片">
          <Upload listType="picture-card" maxCount={9}>
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>上传</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" block onClick={handlePublish}>
            发布动态
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default PostDrawer;

