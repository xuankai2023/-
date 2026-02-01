import React, { useEffect, useState, useMemo } from 'react';
import { Drawer, Form, Input, Upload, Button, message, List, Divider, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import dayjs from 'dayjs';
import { useBoardStore } from '../../../../Store/board';
import './PostDrawer.css';

export interface PostDrawerProps {
  visible: boolean;
  room: any;
  onClose: () => void;
}

function PostDrawer({ visible, room, onClose }: PostDrawerProps) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { addPost, getPostsByRoom } = useBoardStore();

  const historyPosts = useMemo(() => {
    if (!room?.id) return [];
    return getPostsByRoom(room.id).sort((a, b) => 
      dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
    );
  }, [room?.id, getPostsByRoom]);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setFileList([]);
    }
  }, [visible, form]);

  function handleUploadChange(info: any) {
    setFileList(info.fileList);
  }

  async function handlePublish() {
    try {
      const values = await form.validateFields();
      
      if (!room?.pet) {
        message.error('房间信息不完整');
        return;
      }

      const imageUrls = fileList
        .filter(file => file.status === 'done' && file.response?.url)
        .map(file => file.response.url);

      addPost({
        roomId: room.id,
        petId: room.pet.id,
        petName: room.pet.name,
        content: values.content,
        images: imageUrls,
      });

      message.success('动态已发布');
      form.resetFields();
      setFileList([]);
      onClose();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  }

  return (
    <Drawer
      title={`${room?.pet?.name || '宠物'} - 发布动态`}
      placement="right"
      onClose={onClose}
      open={visible}
      width={500}
      className="post-drawer"
    >
      <div className="post-drawer-content">
        <div className="post-form-section">
          <h3 className="section-title">发布新动态</h3>
          <Form form={form} layout="vertical" className="post-form">
            <Form.Item name="content" label="动态内容" rules={[{ required: true, message: '请输入动态内容' }]}>
              <Input.TextArea 
                rows={6} 
                placeholder="分享宠物的日常动态..."
                className="post-textarea"
              />
            </Form.Item>
            <Form.Item name="images" label="上传图片">
              <Upload
                listType="picture-card"
                maxCount={9}
                className="post-upload"
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false}
              >
                {fileList.length < 9 && (
                  <div className="upload-button">
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>上传</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" block onClick={handlePublish} className="publish-button">
                发布动态
              </Button>
            </Form.Item>
          </Form>
        </div>

        {historyPosts.length > 0 && (
          <>
            <Divider />
            <div className="post-history-section">
              <h3 className="section-title">历史动态</h3>
              <List
                dataSource={historyPosts}
                renderItem={(post) => (
                  <List.Item className="post-history-item">
                    <div className="post-history-content">
                      <div className="post-history-header">
                        <span className="post-history-date">
                          {dayjs(post.createdAt).format('YYYY-MM-DD HH:mm')}
                        </span>
                      </div>
                      <div className="post-history-text">{post.content}</div>
                      {post.images && post.images.length > 0 && (
                        <div className="post-history-images">
                          <Image.PreviewGroup>
                            {post.images.map((img, index) => (
                              <Image
                                key={index}
                                src={img}
                                width={80}
                                height={80}
                                style={{ objectFit: 'cover', borderRadius: 6, marginRight: 8 }}
                              />
                            ))}
                          </Image.PreviewGroup>
                        </div>
                      )}
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

export default PostDrawer;

