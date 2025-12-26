import React, { useMemo } from 'react';
import { Card, Row, Col, Tag, Descriptions, Space, Table, Typography, Button, Input, Form, Select, DatePicker, InputNumber } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { CreditCardOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/SideBar/Sidebar';
import './editdetail.css';
import { allOrders, OrderStatus } from '../../../mock/orderData';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const columns = [
    {
        title: '#',
        dataIndex: 'key',
        width: 60,
    },
    {
        title: '服务类型',
        dataIndex: 'name',
        width: 140,
        render: (v: string) => <Text strong>{v}</Text>,
    },
    {
        title: '服务描述',
        dataIndex: 'desc',
        ellipsis: true,
    },
    {
        title: '数量',
        dataIndex: 'quantity',
        align: 'right' as const,
        width: 80,
    },
    {
        title: '单价 (¥)',
        dataIndex: 'price',
        align: 'right' as const,
        width: 110,
        render: (v: number) => v.toFixed(2),
    },
    {
        title: '总价 (¥)',
        dataIndex: 'total',
        align: 'right' as const,
        width: 110,
        render: (v: number) => v.toFixed(2),
    },
];

const OrderEditPage: React.FC = () => {
    const navigate = useNavigate();
    const { orderId } = useParams<{ orderId: string }>();
    const [form] = Form.useForm();

    const order = useMemo(() => {
        if (!orderId) return undefined;
        return allOrders.find(o => o.id === orderId);
    }, [orderId]);

    const formatCNDateTime = (iso?: string) => {
        if (!iso) return '—';
        const d = new Date(iso);
        return d.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!orderId || !order) {
        return (
            <div className="orderedit-layout">
                <Header />
                <div className="orderedit-main">
                    <Sidebar />
                    <main className="orderedit-content">
                        <div className="orderedit-container">
                            <div className="orderedit-page-header">
                                <div className="orderedit-page-title">
                                    <Title level={3} style={{ margin: 0 }}>
                                        编辑订单{' '}
                                        <Tag color="blue" style={{ marginLeft: 8 }}>
                                            #{orderId || '—'}
                                        </Tag>
                                    </Title>
                                    <Text type="secondary">未找到订单</Text>
                                </div>
                                <Space>
                                    <Button onClick={() => navigate(`/order/${orderId}`)}>返回详情</Button>
                                </Space>
                            </div>
                            <Card className="orderedit-card" bordered>
                                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                    <Text type="secondary">未找到该订单，请返回详情页重试</Text>
                                </div>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    const services = [
        {
            key: 1,
            name: order.serviceName,
            desc: order.notes || '—',
            quantity: order.quantity,
            price: order.servicePrice,
            total: order.totalAmount,
        },
    ];
    const servicesTotal = services.reduce((sum, s) => sum + s.total, 0);
    const discount = 0;
    const finalTotal = servicesTotal - discount;

    return (
        <div className="orderedit-layout">
            <Header />
            <div className="orderedit-main">
                <Sidebar />
                <main className="orderedit-content">
                    <div className="orderedit-container">
                        {/* 顶部标题和操作区 */}
                        <div className="orderedit-page-header">
                            <div className="orderedit-page-title">
                                <Title level={3} style={{ margin: 0 }}>
                                    编辑订单{' '}
                                    <Tag color="blue" style={{ marginLeft: 8 }}>
                                        #{orderId || '—'}
                                    </Tag>
                                </Title>
                                <Text type="secondary">
                                    创建于: {formatCNDateTime(order.orderTime)}
                                </Text>
                            </div>
                            <Space>
                                <Button onClick={() => navigate(`/order/${orderId}`)}>返回详情</Button>
                                <Button type="primary" htmlType="submit" form="order-edit-form">保存修改</Button>
                            </Space>
                        </div>

                        <Form
                            id="order-edit-form"
                            form={form}
                            layout="vertical"
                            initialValues={{
                                ...order,
                                scheduledTime: new Date(order.scheduledTime),
                            }}
                        >
                            {/* 顶部三列卡片 */}
                            <Row gutter={[16, 16]} className="orderedit-top-grid">
                                <Col xs={24} md={8}>
                                    <Card className="orderedit-card" bordered>
                                        <div className="orderedit-card-title">
                                            <FileTextOutlined /> 订单概览
                                        </div>
                                        <Form.Item name="status" label="订单状态" rules={[{ required: true, message: '请选择订单状态' }]}>
                                            <Select>
                                                <Option value={OrderStatus.PENDING}>待处理</Option>
                                                <Option value={OrderStatus.COMPLETED}>已完成</Option>
                                                <Option value={OrderStatus.CANCELLED}>已取消</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name="scheduledTime" label="预约时间" rules={[{ required: true, message: '请选择预约时间' }]}>
                                            <DatePicker showTime style={{ width: '100%' }} />
                                        </Form.Item>
                                        <Form.Item name="serviceLocation" label="服务网点">
                                            <Input defaultValue="朝阳区旗舰店" />
                                        </Form.Item>
                                    </Card>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Card className="orderedit-card" bordered>
                                        <div className="orderedit-card-title">
                                            <UserOutlined /> 客户信息
                                        </div>
                                        <Form.Item name="customerName" label="客户姓名" rules={[{ required: true, message: '请输入客户姓名' }]}>
                                            <Input defaultValue={order.customerName} />
                                        </Form.Item>
                                        <Form.Item name="customerPhone" label="联系电话" rules={[{ required: true, message: '请输入联系电话' }]}>
                                            <Input defaultValue={order.customerPhone} />
                                        </Form.Item>
                                        <Form.Item name="customerAddress" label="地址">
                                            <Input defaultValue="北京市朝阳区阳光花园 3-201" />
                                        </Form.Item>
                                    </Card>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Card className="orderedit-card" bordered>
                                        <div className="orderedit-card-title">
                                            <CreditCardOutlined /> 支付详情
                                        </div>
                                        <Form.Item name="paymentMethod" label="支付方式">
                                            <Select defaultValue="微信支付">
                                                <Option value="微信支付">微信支付</Option>
                                                <Option value="支付宝">支付宝</Option>
                                                <Option value="现金">现金</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name="paymentStatus" label="支付状态">
                                            <Select defaultValue="已支付">
                                                <Option value="已支付">已支付</Option>
                                                <Option value="未支付">未支付</Option>
                                                <Option value="部分支付">部分支付</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name="transactionId" label="流水号">
                                            <Input defaultValue="WX20251213999" />
                                        </Form.Item>
                                    </Card>
                                </Col>
                            </Row>

                            {/* 宠物档案 */}
                            <Card className="orderedit-card" bordered>
                                <div className="orderedit-card-title">
                                    🐾 宠物档案
                                </div>
                                <div className="orderedit-pet-card">
                                    <img
                                        src={order.petImage}
                                        alt="宠物照片"
                                        className="orderedit-pet-avatar"
                                    />
                                    <div className="orderedit-pet-info" style={{ flex: 1 }}>
                                        <Row gutter={[16, 8]}>
                                            <Col xs={12}>
                                                <Form.Item name="petName" label="宠物名称" rules={[{ required: true, message: '请输入宠物名称' }]}>
                                                    <Input defaultValue={order.petName} />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={12}>
                                                <Form.Item name="petType" label="宠物类型" rules={[{ required: true, message: '请选择宠物类型' }]}>
                                                    <Select defaultValue={order.petType}>
                                                        <Option value="狗">狗</Option>
                                                        <Option value="猫">猫</Option>
                                                        <Option value="兔子">兔子</Option>
                                                        <Option value="仓鼠">仓鼠</Option>
                                                        <Option value="鸟类">鸟类</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={12}>
                                                <Form.Item name="serviceName" label="服务类型" rules={[{ required: true, message: '请选择服务类型' }]}>
                                                    <Select defaultValue={order.serviceName}>
                                                        <Option value="洗澡">洗澡</Option>
                                                        <Option value="美容">美容</Option>
                                                        <Option value="寄养">寄养</Option>
                                                        <Option value="医疗">医疗</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={12}>
                                                <Form.Item name="quantity" label="数量" rules={[{ required: true, message: '请输入数量' }]}>
                                                    <InputNumber min={1} defaultValue={order.quantity} style={{ width: '100%' }} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Card>

                            {/* 服务详情表格 + 金额汇总 */}
                            <Card className="orderedit-card" bordered>
                                <div className="orderedit-card-title">
                                    📋 服务详情
                                </div>
                                <Form.Item name="servicePrice" label="服务单价" rules={[{ required: true, message: '请输入服务单价' }]}>
                                    <InputNumber min={0} step={0.01} defaultValue={order.servicePrice} style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item name="totalAmount" label="总计金额" rules={[{ required: true, message: '请输入总计金额' }]}>
                                    <InputNumber min={0} step={0.01} defaultValue={order.totalAmount} style={{ width: '100%' }} />
                                </Form.Item>
                                <div className="orderedit-amount-summary">
                                    <div />
                                    <div className="orderedit-amount-right">
                                        <div className="summary-row">
                                            <span>服务合计:</span>
                                            <span>¥{servicesTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span>优惠减免:</span>
                                            <span className="summary-discount">- ¥{discount.toFixed(2)}</span>
                                        </div>
                                        <div className="summary-row summary-total">
                                            <span>实付总额:</span>
                                            <span>¥{finalTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* 备注 */}
                            <Row gutter={[16, 16]} className="orderedit-notes-row">
                                <Col xs={24} md={12}>
                                    <Card className="orderedit-card" bordered>
                                        <div className="orderedit-card-title">
                                            💬 客户特殊要求
                                        </div>
                                        <Form.Item name="notes" label="">
                                            <TextArea rows={4} defaultValue={order.notes || ''} />
                                        </Form.Item>
                                    </Card>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Card className="orderedit-card" bordered>
                                        <div className="orderedit-card-title">
                                            👩‍⚕️ 医生/美容师备注
                                        </div>
                                        <Form.Item name="doctorNotes" label="">
                                            <TextArea rows={4} defaultValue="已确认狗狗对吹风机敏感，已安排高级美容师进行安抚。检查发现左耳有轻微红肿，建议主人后续观察。" />
                                        </Form.Item>
                                    </Card>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default OrderEditPage;