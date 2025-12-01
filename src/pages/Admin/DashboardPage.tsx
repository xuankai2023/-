import React from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/SideBar/Sidebar';
import MainContent from '../../components/Admin/MainContent';

const DashboardPage: React.FC = () => {

  React.useEffect(() => {
    document.title = '管理面板 - 仪表盘';
  }, []);

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f5f5f5',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      {/* 头部导航栏 */}
      <Header />
      
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden'
      }}>
        {/* 侧边菜单栏 */}
        <Sidebar />

        {/* 主内容区 */}
        <MainContent />
      </div>
    </div>
  );
};

export default DashboardPage;