import React, { useMemo } from 'react';
import { Card, Row, Col, Tag, Descriptions, Space, Table, Typography, Button, Empty } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { CreditCardOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/SideBar/Sidebar';
import './orderdetail.css';
import { allOrders, OrderStatus } from '../../mock/orderData';

const { Title, Text } = Typography;

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

const OrderDetail: React.FC = () => {
    const navigate = useNavigate();
    const { orderId } = useParams<{ orderId: string }>();

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
            <div className="orderdetail-layout">
                <Header />
                <div className="orderdetail-main">
                    <Sidebar />
                    <main className="orderdetail-content">
                        <div className="orderdetail-container">
                            <div className="orderdetail-page-header">
                                <div className="orderdetail-page-title">
                                    <Title level={3} style={{ margin: 0 }}>
                                        订单详情{' '}
                                        <Tag color="blue" style={{ marginLeft: 8 }}>
                                            #{orderId || '—'}
                                        </Tag>
                                    </Title>
                                    <Text type="secondary">未找到订单</Text>
                                </div>
                                <Space>
                                    <Button onClick={() => navigate('/order')}>返回列表</Button>
                                </Space>
                            </div>
                            <Card className="orderdetail-card" bordered>
                                <Empty description="未找到该订单，请返回列表重试" />
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

    const statusTag =
        order.status === OrderStatus.PENDING ? <Tag color="gold">待处理</Tag> :
            order.status === OrderStatus.COMPLETED ? <Tag color="green">已完成</Tag> :
                order.status === OrderStatus.CANCELLED ? <Tag color="default">已取消</Tag> :
                    <Tag>未知</Tag>;

    return (
        <div className="orderdetail-layout">
            <Header />
            <div className="orderdetail-main">
                <Sidebar />
                <main className="orderdetail-content">
                    <div className="orderdetail-container">
                        {/* 顶部标题和操作区 */}
                        <div className="orderdetail-page-header">
                            <div className="orderdetail-page-title">
                                <Title level={3} style={{ margin: 0 }}>
                                    订单详情{' '}
                                    <Tag color="blue" style={{ marginLeft: 8 }}>
                                        #{orderId || '—'}
                                    </Tag>
                                </Title>
                                <Text type="secondary">
                                    创建于: {formatCNDateTime(order.orderTime)}
                                </Text>
                            </div>
                            <Space>
                                <Button onClick={() => navigate('/order')}>返回列表</Button>
                                <Button>打印订单</Button>
                                <Button onClick={() => navigate(`/order/${orderId}/edit`)}>编辑</Button>
                                <Button type="primary">开始服务</Button>
                            </Space>
                        </div>
                        {/* 顶部三列卡片 */}
                        <Row gutter={[16, 16]} className="orderdetail-top-grid">
                            <Col xs={24} md={8}>
                                <Card className="orderdetail-card" bordered>
                                    <div className="orderdetail-card-title">
                                        <FileTextOutlined /> 订单概览
                                    </div>
                                    <Descriptions column={1} size="small" colon={false}>
                                        <Descriptions.Item label="订单状态">
                                            {statusTag}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="预约时间">
                                            {formatCNDateTime(order.scheduledTime)}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="服务网点">
                                            朝阳区旗舰店
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>

                            <Col xs={24} md={8}>
                                <Card className="orderdetail-card" bordered>
                                    <div className="orderdetail-card-title">
                                        <UserOutlined /> 客户信息
                                    </div>
                                    <Descriptions column={1} size="small" colon={false}>
                                        <Descriptions.Item label="客户姓名">
                                            {order.customerName}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="联系电话">
                                            {order.customerPhone}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="地址">
                                            北京市朝阳区阳光花园 3-201
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>

                            <Col xs={24} md={8}>
                                <Card className="orderdetail-card" bordered>
                                    <div className="orderdetail-card-title">
                                        <CreditCardOutlined /> 支付详情
                                    </div>
                                    <Descriptions column={1} size="small" colon={false}>
                                        <Descriptions.Item label="支付方式">
                                            微信支付
                                        </Descriptions.Item>
                                        <Descriptions.Item label="支付状态">
                                            <Tag color="green">已支付</Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="流水号">
                                            <Text code>WX20251213999</Text>
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                        </Row>

                        {/* 宠物档案 */}
                        <Card className="orderdetail-card" bordered>
                            <div className="orderdetail-card-title">
                                <i className="fas fa-paw" /> 宠物档案
                            </div>
                            <div className="orderdetail-pet-card">
                                <img
                                    src={order.petImage}
                                    alt="宠物照片"
                                    className="orderdetail-pet-avatar"
                                />
                                <div className="orderdetail-pet-info">
                                    <Title level={4} style={{ marginBottom: 4 }}>
                                        {order.petName}
                                    </Title>
                                    <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                                        类型: {order.petType}
                                    </Text>
                                    <Space size="small" wrap>
                                        <Tag>服务: {order.serviceName}</Tag>
                                        <Tag>数量: {order.quantity}</Tag>
                                        <Tag>金额: ¥{order.totalAmount.toFixed(2)}</Tag>
                                    </Space>
                                </div>
                            </div>
                        </Card>

                        {/* 服务详情表格 + 金额汇总 */}
                        <Card className="orderdetail-card" bordered>
                            <div className="orderdetail-card-title">
                                <i className="fas fa-list-ul" /> 服务详情
                            </div>
                            <Table
                                columns={columns}
                                dataSource={services}
                                pagination={false}
                                size="small"
                                rowKey="key"
                                style={{ marginBottom: 16 }}
                            />
                            <div className="orderdetail-amount-summary">
                                <div />
                                <div className="orderdetail-amount-right">
                                    <div className="summary-row">
                                        <span>服务合计:</span>
                                        <span>{servicesTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>优惠减免:</span>
                                        <span className="summary-discount">- {discount.toFixed(2)}</span>
                                    </div>
                                    <div className="summary-row summary-total">
                                        <span>实付总额:</span>
                                        <span>¥ {finalTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* 备注 */}
                        <Row gutter={[16, 16]} className="orderdetail-notes-row">
                            <Col xs={24} md={12}>
                                <Card className="orderdetail-card" bordered>
                                    <div className="orderdetail-card-title">
                                        <i className="fas fa-comment-medical" /> 客户特殊要求
                                    </div>
                                    <div className="orderdetail-note-box">
                                        {order.notes || '—'}
                                    </div>
                                </Card>
                            </Col>
                            <Col xs={24} md={12}>
                                <Card className="orderdetail-card" bordered>
                                    <div className="orderdetail-card-title">
                                        <i className="fas fa-user-md" /> 医生/美容师备注
                                    </div>
                                    <div className="orderdetail-note-box note-doctor">
                                        “已确认狗狗对吹风机敏感，已安排高级美容师进行安抚。检查发现左耳有轻微红肿，建议主人后续观察。”
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default OrderDetail;

