import React, { useEffect, useMemo } from 'react';
import { Drawer, Form, DatePicker, Input, Button, message, List, Divider } from 'antd';
import dayjs from 'dayjs';
import { useBoardStore } from '../../../../Store/board';
import './LogDrawer.css';

export interface LogDrawerProps {
  visible: boolean;
  room: any;
  onClose: () => void;
}

function LogDrawer({ visible, room, onClose }: LogDrawerProps) {
  const [form] = Form.useForm();
  const { addHealthLog, getHealthLogsByRoom } = useBoardStore();

  const historyLogs = useMemo(() => {
    if (!room?.id) return [];
    return getHealthLogsByRoom(room.id).sort((a, b) => 
      dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
    );
  }, [room?.id, getHealthLogsByRoom]);

  useEffect(() => {
    if (visible && room) {
      form.setFieldsValue({
        date: dayjs(),
      });
    } else if (!visible) {
      form.resetFields();
    }
  }, [visible, room, form]);

  async function handleSave() {
    try {
      const values = await form.validateFields();
      
      if (!room?.pet) {
        message.error('房间信息不完整');
        return;
      }

      addHealthLog({
        roomId: room.id,
        petId: room.pet.id,
        petName: room.pet.name,
        date: values.date.format('YYYY-MM-DD'),
        content: values.content,
      });

      message.success('日志已保存');
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  }

  return (
    <Drawer
      title={`${room?.pet?.name || '宠物'} - 健康日志`}
      placement="right"
      onClose={onClose}
      open={visible}
      width={500}
      className="log-drawer"
    >
      <div className="log-drawer-content">
        <div className="log-form-section">
          <h3 className="section-title">新增日志</h3>
          <Form form={form} layout="vertical" className="log-form">
            <Form.Item name="date" label="日期" rules={[{ required: true, message: '请选择日期' }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="content" label="日志内容" rules={[{ required: true, message: '请输入日志内容' }]}>
              <Input.TextArea 
                rows={6} 
                placeholder="记录宠物的健康状况、饮食、活动等"
                className="log-textarea"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" block onClick={handleSave} className="save-button">
                保存日志
              </Button>
            </Form.Item>
          </Form>
        </div>

        {historyLogs.length > 0 && (
          <>
            <Divider />
            <div className="log-history-section">
              <h3 className="section-title">历史日志</h3>
              <List
                dataSource={historyLogs}
                renderItem={(log) => (
                  <List.Item className="log-history-item">
                    <div className="log-history-content">
                      <div className="log-history-date">{log.date}</div>
                      <div className="log-history-text">{log.content}</div>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}

export default LogDrawer;

