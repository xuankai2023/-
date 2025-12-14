import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/SideBar/Sidebar';
import { Card, Row, Col } from 'antd';
import './Record.css';
import { petRecords, petTypes } from '../../mock/petData';

// 根据宠物品种判断类型
const getPetType = (breed: string): string => {
  const breedLower = breed.toLowerCase();
  if (breedLower.includes('猫') || breedLower.includes('cat')) return 'cat';
  if (breedLower.includes('犬') || breedLower.includes('狗') || breedLower.includes('dog')) return 'dog';
  if (breedLower.includes('鱼') || breedLower.includes('fish')) return 'fish';
  if (breedLower.includes('兔') || breedLower.includes('rabbit')) return 'rabbit';
  return 'other';
};

// 统计各类型宠物数量
const getPetCountByType = (type: string): number => {
  return petRecords.filter(pet => getPetType(pet.breed) === type).length;
};

// 根据类型 ID 获取对应的 SVG 图标路径
const getPetTypeIcon = (typeId: string): string => {
  const iconMap: Record<string, string> = {
    'cat': '/images/svg/布偶猫.svg',
    'dog': '/images/svg/哈士奇.svg',
    'fish': '/images/svg/年年有鱼.svg',
    'rabbit': '/images/svg/兔子 (1).svg',
    'other': '/images/svg/仓鼠.svg'
  };
  return iconMap[typeId] || iconMap['other'];
};

// 宠物档案页面主组件
const Record = () => {
  const navigate = useNavigate();

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
          <div className="record-page-container">
            {/* 宠物类型卡片网格（5 个并排） */}
            <div className="pet-type-grid-container">
              <Row gutter={12}>
                {petTypes.map((type) => {
                  const count = getPetCountByType(type.id);
                  const iconPath = getPetTypeIcon(type.id);
                  return (
                    <Col key={type.id} xs={24} sm={12} md={8} lg={6} xl={5.5}>
                      <Card
                        className="pet-type-card"
                        style={{
                          background: type.gradient,
                          cursor: 'pointer',
                          height: '100%',
                          width: '100%'
                        }}
                        onClick={() => handleCardClick(type.path)}
                      >
                        <div className="pet-type-card-content">
                          <div className="pet-type-icon-wrapper">
                            <img
                              src={iconPath}
                              alt={type.name}
                              className="pet-type-icon"
                              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                            />
                          </div>
                          <h3 className="pet-type-name">{type.name}</h3>
                          <p className="pet-type-description">{type.description}</p>
                          <div className="pet-type-count">
                            <span className="count-number">{count}</span>
                            <span className="count-label">只宠物</span>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>

            {/* 宠物信息卡片 */}
            <div className="pet-summary-grid">
              {petRecords.map((pet) => (
                <Card key={pet.id} className="pet-summary-card" style={{ cursor: 'pointer' }} onClick={() => handleCardClick(`/petdetail/${pet.id}`)}>
                  <div className="pet-summary-card-header">
                    <div className="pet-summary-avatar">
                      <img src={pet.avatar} alt={pet.name} />
                    </div>
                    <div className="pet-summary-title">
                      <h3>{pet.name}</h3>
                      <p>{pet.breed}</p>
                    </div>
                  </div>
                  <div className="pet-summary-body">
                    <div className="pet-summary-row">
                      <span className="label">体型</span>
                      <span className="value">{pet.size}</span>
                    </div>
                    <div className="pet-summary-row">
                      <span className="label">体重</span>
                      <span className="value">{pet.weight} kg</span>
                    </div>
                    <div className="pet-summary-row">
                      <span className="label">毛色</span>
                      <span className="value">{pet.furColor}</span>
                    </div>
                    <div className="pet-summary-row">
                      <span className="label">状态</span>
                      <span className="value status">{pet.status}</span>
                    </div>
                    <div className="pet-summary-row">
                      <span className="label">最近体检</span>
                      <span className="value">{pet.lastCheckupDate}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Record;