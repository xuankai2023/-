import React, { useState } from 'react';
import { Sidebar, Toast } from 'react-vant';
import './Sidebar.css';
import { useNavigate } from 'react-router';
export default () => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  // 定义侧边栏项对应的路由映射
  const routeMap = [
    '/record',  // 宠物档案
    '/order',  // 订单
    '/services', // 服务
    '/vaccination-records', // 疫苗接种
    '/boarding-records', // 寄养情况
    '/admin' // 数据统计(临时使用dashboard页面)
  ];

  // 处理侧边栏项点击事件
  const handleSidebarChange = (index: number) => {
    setActive(index);
    
    // 获取对应的路由地址
    const route = routeMap[index];
    if (route) {
      // 跳转到对应的页面
      navigate(route);
      Toast.info(`已切换到${['宠物档案', '订单', '服务', '疫苗接种', '寄养情况', '数据统计'][index]}`);
    }
  };

  return (
    <div style={{
      width: '240px',
      height: '100%',
      overflow: 'auto',
      backgroundColor: '#f0f9ff',
      borderRight: '1px solid #e0f2fe',
      flexShrink: 0
    }}>
      <Sidebar
        value={active}
        onChange={handleSidebarChange}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          borderRight: 'none'
        }}
      >
        <Sidebar.Item title="宠物档案"/>
        <Sidebar.Item title="订单" />
        <Sidebar.Item title="服务" />
        <Sidebar.Item title="疫苗接种" />
        <Sidebar.Item title="寄养情况" />
        <Sidebar.Item title="数据统计" />
        
      </Sidebar>
    </div>
  );
};