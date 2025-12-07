import React, { useState } from 'react';
import { Toast } from 'react-vant';
import { ArrowLeft, ArrowDown } from '@react-vant/icons';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';

export default () => {
  const [active, setActive] = useState(0);
  const [petTypeActive, setPetTypeActive] = useState<number | null>(null);
  const [petRecordsExpanded, setPetRecordsExpanded] = useState(false);
  const navigate = useNavigate();
  const [isLeft, setIsLeft] = useState(true); // true 表示显示 ArrowLeft
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // 控制菜单栏收缩状态

  const toggleArrow = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    const newExpanded = !petRecordsExpanded;
    setPetRecordsExpanded(newExpanded);
    setIsLeft(!newExpanded);
    // 展开菜单栏时取消收缩状态，收缩时保持收缩状态
    setSidebarCollapsed(!newExpanded);
  };

  // 主菜单路由映射
  const routeMap = [
    '/record',                  // 宠物档案（父项，本身也可跳转）
    '/order',
    '/services',
    '/vaccination-records',
    '/boarding-records',
    '/admin'
  ];

  // 宠物类型子菜单
  const petTypes = [
    { name: '猫咪', path: '/record/cat' },
    { name: '狗狗', path: '/record/dog' },
    { name: '兔子', path: '/record/rabbit' },
    { name: '鱼类', path: '/record/fish' },
    { name: '其他', path: '/record/other' }
  ];

  // 处理主菜单点击
  const handleSidebarChange = (index: number) => {
    setActive(index);
    setPetTypeActive(null);

    if (index === 0) {
      // 切换宠物档案子菜单展开状态
      const newExpanded = !petRecordsExpanded;
      setPetRecordsExpanded(newExpanded);
      // 同步更新箭头方向
      setIsLeft(!newExpanded);
      // 展开菜单栏时取消收缩状态
      setSidebarCollapsed(false);
      // 可选：点击父项也跳转到默认页面
      navigate(routeMap[0]);
      Toast.info('已切换到宠物档案');
    } else {
      setPetRecordsExpanded(false);
      setIsLeft(true); // 关闭其他菜单时重置箭头状态为向上
      // 点击其他菜单项时收缩菜单栏
      setSidebarCollapsed(true);
      const route = routeMap[index];
      if (route) {
        navigate(route);
        const titles = ['宠物档案', '订单', '服务', '疫苗接种', '寄养情况', '数据统计'];
        Toast.info(`已切换到${titles[index]}`);
      }
    }
  };

  // 处理子菜单点击
  const handlePetTypeClick = (path: string, index: number) => {
    setPetTypeActive(index);
    navigate(path);
    Toast.info(`已筛选：${petTypes[index].name}`);
    // 点击子菜单项时收缩整个菜单栏
    setPetRecordsExpanded(false);
    setIsLeft(true);
    setSidebarCollapsed(true);
    // 注意：这里不再改变 active（主菜单仍高亮"宠物档案"）
  };

  // 菜单项数据
  const menuItems = [
    { title: '宠物档案', hasSubmenu: true },
    { title: '订单' },
    { title: '服务' },
    { title: '疫苗接种' },
    { title: '寄养情况' },
    { title: '数据统计' }
  ];

  return (
    <div className={`sidebar-container ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-menu">
        {menuItems.map((item, index) => (
          <div key={index}>
            {/* 主菜单项 */}
            <div
              className={`menu-item ${active === index ? 'active' : ''}`}
              onClick={() => handleSidebarChange(index)}
            >
              <span className="menu-item-title">{sidebarCollapsed ? '' : item.title}</span>
              {item.hasSubmenu && !sidebarCollapsed && (
                <div className="arrow-icon" onClick={(e) => toggleArrow(e)}>
                  {isLeft ? (
                    <ArrowLeft />
                  ) : (
                    <ArrowDown />
                  )}
                </div>
              )}
            </div>

            {/* 子菜单项 - 显示在宠物档案下方 */}
            {item.hasSubmenu && petRecordsExpanded && !sidebarCollapsed && (
              <div className="submenu-container">
                {petTypes.map((type, idx) => (
                  <div
                    key={type.name}
                    className={`submenu-item ${petTypeActive === idx ? 'active' : ''}`}
                    onClick={() => handlePetTypeClick(type.path, idx)}
                  >
                    {type.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};