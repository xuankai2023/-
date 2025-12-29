import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Row, Col } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

export interface BookingModalProps {
  visible: boolean;
  booking?: any;
  onOk: (values: any) => void;
  onCancel: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ visible, booking, onOk, onCancel }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (booking) {
      form.setFieldsValue({
        petName: booking.pet.name,
        petBreed: booking.pet.breed,
        ownerName: booking.owner.name,
        ownerPhone: booking.owner.phone,
        roomType: booking.roomType,
        healthStatus: booking.healthStatus,
        startDate: dayjs(booking.dates.start),
        endDate: dayjs(booking.dates.end),
      });
    } else {
      form.resetFields();
    }
  }, [booking, form]);

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
      title={booking ? '编辑预约' : '添加预约'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="petName"
              label="宠物名称"
              rules={[{ required: true, message: '请输入宠物名称' }]}
            >
              <Input placeholder="请输入宠物名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="petBreed"
              label="宠物品种"
              rules={[{ required: true, message: '请输入宠物品种' }]}
            >
              <Input placeholder="请输入宠物品种" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="ownerName"
              label="主人姓名"
              rules={[{ required: true, message: '请输入主人姓名' }]}
            >
              <Input placeholder="请输入主人姓名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="ownerPhone"
              label="主人电话"
              rules={[
                { required: true, message: '请输入主人电话' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
              ]}
            >
              <Input placeholder="请输入主人电话" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="startDate"
              label="开始日期"
              rules={[{ required: true, message: '请选择开始日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="endDate"
              label="结束日期"
              rules={[{ required: true, message: '请选择结束日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
            <Form.Item
              name="healthStatus"
              label="健康状态"
              rules={[{ required: true, message: '请选择健康状态' }]}
            >
              <Select placeholder="请选择健康状态">
                <Select.Option value="疫苗齐全">疫苗齐全</Select.Option>
                <Select.Option value="未完成">未完成</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default BookingModal;

