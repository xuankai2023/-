import React from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/SideBar/Sidebar';
import BillAnalysis from '../../components/BillAnalysis/BillAnalysis';
import './BillAnalysisPage.css';

const BillAnalysisPage: React.FC = () => {
  return (
    <div className="bill-analysis-page">
      {/* 头部导航栏 */}
      <Header />
      
      <div className="bill-analysis-page-content">
        {/* 侧边菜单栏 */}
        <Sidebar />

        {/* 主内容区 */}
        <div className="bill-analysis-main-container">
          <BillAnalysis />
        </div>
      </div>
    </div>
  );
};

export default BillAnalysisPage;