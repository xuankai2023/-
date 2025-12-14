import React from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/SideBar/Sidebar';
import './VaccinationRecords.css';

// 宠物商店商品分类页面组件
const VaccinationRecords = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '20px', overflow: 'auto', background: '#f5f5f5' }}>
          {/* 页面标题 */}
          <h1 className="page-title">今日好物，为爱宠精选</h1>
          
          {/* 分类入口容器 */}
          <div className="categories-container">
            {/* 分类入口 1: 宠物食品 */}
            <div className="category-card">
              <div className="category-icon">🍗</div>
              <h2 className="category-title">宠物食品</h2>
              <p className="category-subtitle">主粮 · 零食 · 营养品</p>
            </div>
            
            {/* 分类入口 2: 宠物用品 */}
            <div className="category-card">
              <div className="category-icon">🧸</div>
              <h2 className="category-title">宠物用品</h2>
              <p className="category-subtitle">牵引绳 · 猫砂 · 玩具 · 窝垫</p>
            </div>
            
            {/* 分类入口 3: 药品与保健品 */}
            <div className="category-card">
              <div className="category-icon">💊</div>
              <h2 className="category-title">药品与保健品</h2>
              <p className="category-subtitle">驱虫药 · 益生菌 · 关节护理</p>
            </div>
          </div>
          
          {/* 底部温馨提示 */}
          <div className="warning">
            <p>⚠️ 保健产品不能替代兽医诊疗，如有健康问题请及时就医。</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VaccinationRecords;
