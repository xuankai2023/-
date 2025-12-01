import React from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/SideBar/Sidebar';

// 疫苗接种记录页面组件
const VaccinationRecords = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
          <h1>疫苗接种记录页面</h1>
        </main>
      </div>
    </div>
  );
};

export default VaccinationRecords;
