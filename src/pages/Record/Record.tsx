import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Card } from 'antd';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/SideBar/Sidebar';
import PetTypeGridWithSearch from '../../components/PetTypeGridWithSearch/PetTypeGridWithSearch';
import './Record.css';
import { petApi, type Pet } from '../../api/pet';
import { petTypes } from '../../mock/petData';

// 根据宠物品种判断类型
const getPetType = (breed: string): string => {
  const breedLower = breed.toLowerCase();
  if (breedLower.includes('猫') || breedLower.includes('cat')) return 'cat';
  if (breedLower.includes('犬') || breedLower.includes('狗') || breedLower.includes('dog')) return 'dog';
  if (breedLower.includes('鱼') || breedLower.includes('fish')) return 'fish';
  if (breedLower.includes('兔') || breedLower.includes('rabbit')) return 'rabbit';
  return 'other';
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
function Record() {
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState('');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [petRecords, setPetRecords] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPets = async () => {
      setLoading(true);
      try {
        const response = await petApi.getPetList({ limit: 1000 });
        setPetRecords(response.data || []);
      } catch (error: any) {
        console.error('加载宠物列表失败:', error);
        message.error(error?.message || '加载宠物列表失败');
      } finally {
        setLoading(false);
      }
    };
    loadPets();
  }, []);

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  // 过滤宠物记录
  const filteredPetRecords = useMemo(() => {
    let filtered = petRecords;

    // 订单号/编号筛选（根据宠物ID或名称）
    if (orderNumber) {
      const keyword = orderNumber.toLowerCase();
      filtered = filtered.filter(pet =>
        pet.id.toLowerCase().includes(keyword) ||
        pet.name.toLowerCase().includes(keyword) ||
        pet.breed.toLowerCase().includes(keyword)
      );
    }

    // 日期范围筛选（根据最近体检日期）
    if (dateRange) {
      const [startDate, endDate] = dateRange;
      filtered = filtered.filter(pet => {
        const checkupDate = pet.last_checkup_date;
        return checkupDate && checkupDate >= startDate && checkupDate <= endDate;
      });
    }

    return filtered;
  }, [orderNumber, dateRange, petRecords]);

  // 统计各类型宠物数量
  const getPetCountByType = (type: string): number => {
    return filteredPetRecords.filter(pet => getPetType(pet.breed) === type).length;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
          <div className="record-page-container">
            {/* 宠物类型卡片网格 + 搜索组件 */}
            <PetTypeGridWithSearch
              petTypes={petTypes}
              getPetCountByType={getPetCountByType}
              getPetTypeIcon={getPetTypeIcon}
              onCardClick={handleCardClick}
              orderNumber={orderNumber}
              dateRange={dateRange}
              onOrderNumberChange={setOrderNumber}
              onDateRangeChange={setDateRange}
              orderNumberPlaceholder="请输入宠物ID、名称或品种"
              onSearch={() => {
                // 搜索逻辑已在 useMemo 中实现，这里可以添加额外的操作
                console.log('搜索:', { orderNumber, dateRange });
              }}
              onReset={() => {
                setOrderNumber('');
                setDateRange(null);
              }}
            />

            {/* 宠物信息卡片 */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>加载中...</p>
              </div>
            ) : filteredPetRecords.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>暂无宠物记录</p>
              </div>
            ) : (
              <div className="pet-summary-grid">
                {filteredPetRecords.map((pet) => (
                  <Card key={pet.id} className="pet-summary-card" style={{ cursor: 'pointer' }} onClick={() => handleCardClick(`/petdetail/${pet.id}`)}>
                    <div className="pet-summary-card-header">
                      <div className="pet-summary-avatar">
                        <img src={pet.avatar || '/images/png/petSystem.png'} alt={pet.name} onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/png/petSystem.png';
                        }} />
                      </div>
                      <div className="pet-summary-title">
                        <h3>{pet.name}</h3>
                        <p>{pet.breed}</p>
                      </div>
                    </div>
                    <div className="pet-summary-body">
                      {pet.weight && (
                        <div className="pet-summary-row">
                          <span className="label">体重</span>
                          <span className="value">{pet.weight} kg</span>
                        </div>
                      )}
                      {pet.height && (
                        <div className="pet-summary-row">
                          <span className="label">身高</span>
                          <span className="value">{pet.height} cm</span>
                        </div>
                      )}
                      {pet.fur_color && (
                        <div className="pet-summary-row">
                          <span className="label">毛色</span>
                          <span className="value">{pet.fur_color}</span>
                        </div>
                      )}
                      <div className="pet-summary-row">
                        <span className="label">状态</span>
                        <span className="value status">{pet.status}</span>
                      </div>
                      <div className="pet-summary-row">
                        <span className="label">最近体检</span>
                        <span className="value">{pet.last_checkup_date ? new Date(pet.last_checkup_date).toLocaleDateString('zh-CN') : '暂无'}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Record;