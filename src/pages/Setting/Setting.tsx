import React, { useState } from 'react';
import { Menu, Card, Typography, Form, Input, Button, Checkbox, Switch, Select, Table, Space, Badge } from 'antd';
import { SettingOutlined, UserOutlined, BellOutlined, SafetyOutlined, ApiOutlined, TeamOutlined, QuestionCircleOutlined, HeartOutlined } from '@ant-design/icons';
import './Setting.css';

const { Title, Text } = Typography;
const { Option } = Select;

// 导航项数据
const menuItems = [
  { key: 'account-info', icon: <UserOutlined />, label: '账户信息' },
  { key: 'notification-settings', icon: <BellOutlined />, label: '通知设置' },
  { key: 'security-and-privacy', icon: <SafetyOutlined />, label: '安全与隐私' },
  { key: 'preference-settings', icon: <SettingOutlined />, label: '偏好设置' },
  { key: 'integration-api-access', icon: <ApiOutlined />, label: '集成与API' },
  { key: 'team-and-permissions', icon: <TeamOutlined />, label: '团队与权限' },
  { key: 'help-center-support', icon: <QuestionCircleOutlined />, label: '帮助与支持' },
];

// API集成表格数据
const apiData = [
  {
    key: '1',
    name: '宠物寄养系统 API',
    status: '已授权',
    lastUsed: '2025-12-14 20:32',
    ip: '114.242.xxx.xxx',
  },
  {
    key: '2',
    name: '微信通知服务',
    status: '已停用',
    lastUsed: '2025-12-10 14:20',
    ip: '114.242.xxx.xxx',
  },
];

// 表格列配置
const apiColumns = [
  { title: '应用名称', dataIndex: 'name', key: 'name' },
  { 
    title: '状态', 
    dataIndex: 'status', 
    key: 'status',
    render: (status: string) => (
      <Badge 
        status={status === '已授权' ? 'success' : 'default'} 
        text={status} 
      />
    )
  },
  { title: '最后使用', dataIndex: 'lastUsed', key: 'lastUsed' },
  { 
    title: '操作', 
    key: 'action',
    render: () => (
      <Button type="text" danger>删除</Button>
    )
  },
];

// 团队角色数据
const teamRoles = [
  { id: 1, name: '管理员', description: '拥有全部系统权限' },
  { id: 2, name: '运营人员', description: '可管理商品、订单、寄养记录' },
  { id: 3, name: '客服专员', description: '仅可查看客户信息与消息' },
];

const Setting: React.FC = () => {
  // 当前选中的导航项
  const [current, setCurrent] = useState('account-info');
  // 表单实例
  const [form] = Form.useForm();

  // 处理导航菜单点击
  const handleMenuClick = (e: any) => {
    setCurrent(e.key);
  };

  // 处理表单提交
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        console.log('表单数据:', values);
        // 这里可以添加保存逻辑
      })
      .catch(errorInfo => {
        console.log('表单验证失败:', errorInfo);
      });
  };

  return (
    <div className="setting-container">
      <div className="setting-wrapper">
        {/* 左侧导航菜单 */}
        <div className="setting-sidebar">
          <div className="sidebar-header">
            <SettingOutlined /> <Title level={4}>系统设置</Title>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[current]}
            onClick={handleMenuClick}
            items={menuItems}
            className="setting-menu"
          />
        </div>

        {/* 主内容区域 */}
        <div className="setting-content">
          {/* 账户信息页面 */}
          {current === 'account-info' && (
            <div className="setting-section">
              <div className="section-header">
                <Title level={2}>账户信息</Title>
                <Text type="secondary">管理您的个人资料和登录凭证</Text>
              </div>
              <Card className="setting-card">
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={{ username: 'admin_user', email: 'admin@example.com' }}
                >
                  <Form.Item
                    name="username"
                    label="用户名"
                    rules={[{ required: true, message: '请输入用户名' }]}
                  >
                    <Input placeholder="请输入用户名" />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label="邮箱地址"
                    rules={[{ required: true, message: '请输入邮箱地址', type: 'email' }]}
                  >
                    <Input placeholder="example@domain.com" />
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    label="手机号码"
                    rules={[{ required: false, message: '请输入手机号' }]}
                  >
                    <Input placeholder="请输入手机号" />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button type="primary" onClick={handleSubmit}>保存更改</Button>
                      <Button>取消</Button>
                    </Space>
                  </Form.Item>
                </Form>
              </Card>
            </div>
          )}

          {/* 通知设置页面 */}
          {current === 'notification-settings' && (
            <div className="setting-section">
              <div className="section-header">
                <Title level={2}>通知设置</Title>
                <Text type="secondary">选择您希望接收的通知类型和方式</Text>
              </div>
              <Card className="setting-card">
                <Form layout="vertical">
                  <Form.Item name="email-notifications" valuePropName="checked">
                    <Checkbox defaultChecked>邮件通知</Checkbox>
                  </Form.Item>
                  <Form.Item name="site-messages" valuePropName="checked">
                    <Checkbox>站内消息</Checkbox>
                  </Form.Item>
                  <Form.Item name="maintenance-alerts" valuePropName="checked">
                    <Checkbox defaultChecked>系统维护提醒</Checkbox>
                  </Form.Item>
                  <Form.Item name="order-updates" valuePropName="checked">
                    <Checkbox>订单状态更新</Checkbox>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary">测试发送</Button>
                  </Form.Item>
                </Form>
              </Card>
            </div>
          )}

          {/* 安全与隐私页面 */}
          {current === 'security-and-privacy' && (
            <div className="setting-section">
              <div className="section-header">
                <Title level={2}>安全与隐私</Title>
                <Text type="secondary">增强账户安全性，保护您的数据</Text>
              </div>
              <Card className="setting-card">
                <div className="form-item">
                  <label>两步验证 (2FA)</label>
                  <Switch defaultChecked />
                </div>
                <div className="form-item">
                  <label>登录活动记录</label>
                  <p className="login-info">
                    最近登录：2025年12月14日 20:32 · IP: 114.242.xxx.xxx · 设备：Windows / Chrome
                  </p>
                </div>
                <Button type="primary">查看全部活动</Button>
              </Card>
            </div>
          )}

          {/* 偏好设置页面 */}
          {current === 'preference-settings' && (
            <div className="setting-section">
              <div className="section-header">
                <Title level={2}>偏好设置</Title>
                <Text type="secondary">自定义界面外观与行为</Text>
              </div>
              <Card className="setting-card">
                <Form layout="vertical">
                  <Form.Item
                    name="language"
                    label="界面语言"
                  >
                    <Select defaultValue="zh-CN">
                      <Option value="zh-CN">简体中文</Option>
                      <Option value="en-US">English</Option>
                      <Option value="ja-JP">日本語</Option>
                    </Select>
                  </Form.Item>
                  <div className="form-item">
                    <label>主题模式</label>
                    <div className="theme-switch">
                      <Switch />
                      <span>启用暗色模式</span>
                    </div>
                  </div>
                  <Form.Item>
                    <Button type="primary">应用设置</Button>
                  </Form.Item>
                </Form>
              </Card>
            </div>
          )}

          {/* 集成与API访问页面 */}
          {current === 'integration-api-access' && (
            <div className="setting-section">
              <div className="section-header">
                <Title level={2}>集成与API</Title>
                <Text type="secondary">管理第三方应用授权与 API 密钥</Text>
              </div>
              <Card className="setting-card">
                <Table dataSource={apiData} columns={apiColumns} pagination={false} />
                <Button type="primary" style={{ marginTop: 20 }}>生成新 API Key</Button>
              </Card>
            </div>
          )}

          {/* 团队与权限页面 */}
          {current === 'team-and-permissions' && (
            <div className="setting-section">
              <div className="section-header">
                <Title level={2}>团队与权限</Title>
                <Text type="secondary">配置成员角色与访问权限</Text>
              </div>
              <Card className="setting-card">
                <div className="role-cards">
                  {teamRoles.map(role => (
                    <div className="role-card" key={role.id}>
                      <div>
                        <Title level={5}>{role.name}</Title>
                        <Text type="secondary">{role.description}</Text>
                      </div>
                      <Button type="primary">编辑权限</Button>
                    </div>
                  ))}
                </div>
                <Button type="primary" style={{ marginTop: 16 }}>
                  + 添加新角色
                </Button>
              </Card>
            </div>
          )}

          {/* 帮助与支持页面 */}
          {current === 'help-center-support' && (
            <div className="setting-section">
              <div className="section-header">
                <Title level={2}>帮助与支持</Title>
                <Text type="secondary">获取使用指南或联系技术支持</Text>
              </div>
              <Card className="setting-card">
                <Form layout="vertical">
                  <Form.Item name="search">
                    <Input placeholder="搜索帮助文档、教程或常见问题..." />
                  </Form.Item>
                  <div className="help-links">
                    <a href="#" className="help-link">📘 用户手册</a>
                    <a href="#" className="help-link">🎥 视频教程</a>
                    <a href="#" className="help-link">❓ 常见问题</a>
                    <a href="#" className="help-link">📞 联系客服</a>
                  </div>
                </Form>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* 固定帮助按钮 */}
      <div className="fixed-help">
        <HeartOutlined />
      </div>
    </div>
  );
};

export default Setting;