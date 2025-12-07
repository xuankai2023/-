import React, { useState, useMemo } from 'react';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/SideBar/Sidebar';
import { Search, Button, Space, Toast } from 'react-vant';
import './FishRecord.css';

interface PetInfo {
  id: string;
  name: string;
  breed: string;
  age: string;
  size: string;
  gender: string;
  avatar: string;
}

const FishRecord: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  
  // 模拟观赏鱼数据
  const fishRecords: PetInfo[] = [
    {
      id: 'fish-001',
      name: '金金',
      breed: '金龙鱼',
      age: '2岁',
      size: '30cm',
      gender: '公',
      avatar: 'https://picsum.photos/seed/fish1/200'
    },
    {
      id: 'fish-002',
      name: '红红',
      breed: '孔雀鱼',
      age: '3个月',
      size: '3cm',
      gender: '母',
      avatar: 'https://picsum.photos/seed/fish2/200'
    },
    {
      id: 'fish-003',
      name: '蓝蓝',
      breed: '蓝曼龙',
      age: '6个月',
      size: '8cm',
      gender: '公',
      avatar: 'https://picsum.photos/seed/fish3/200'
    }
  ];

  const filteredRecords = useMemo(() => {
    if (!searchValue) return fishRecords;
    const keyword = searchValue.toLowerCase();
    return fishRecords.filter(pet => 
      pet.name.toLowerCase().includes(keyword) ||
      pet.breed.toLowerCase().includes(keyword) ||
      pet.age.toLowerCase().includes(keyword) ||
      pet.size.toLowerCase().includes(keyword)
    );
  }, [searchValue]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
          <div className="record-page">
            <div className="record-header">
              <h1>观赏鱼档案</h1>
              <p>共 {filteredRecords.length} 条观赏鱼记录</p>
            </div>
            
            <div className="table-toolbar">
              <Search
                value={searchValue}
                onChange={setSearchValue}
                placeholder="搜索宠物名称、品种、年龄或体长"
                showAction
                style={{ width: '400px' }}
              />
            </div>

            <div className="table-container">
              <table className="pet-table">
                <thead>
                  <tr>
                    <th>宠物ID</th>
                    <th>宠物名称</th>
                    <th>品种</th>
                    <th>年龄</th>
                    <th>体长</th>
                    <th>性别</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="empty-cell">
                        <div className="empty-state">暂无数据</div>
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((pet) => (
                      <tr key={pet.id}>
                        <td>{pet.id}</td>
                        <td>
                          <div className="pet-name-cell">
                            <img 
                              src={pet.avatar} 
                              alt={pet.name}
                              className="pet-avatar-small"
                            />
                            <span>{pet.name}</span>
                          </div>
                        </td>
                        <td>{pet.breed}</td>
                        <td>{pet.age}</td>
                        <td>{pet.size}</td>
                        <td>{pet.gender}</td>
                        <td>
                          <Space gap={8}>
                            <Button 
                              size="small" 
                              type="primary"
                              onClick={() => Toast.info(`查看 ${pet.name} 的详情`)}
                            >
                              查看
                            </Button>
                            <Button 
                              size="small"
                              onClick={() => Toast.info(`编辑 ${pet.name} 的信息`)}
                            >
                              编辑
                            </Button>
                          </Space>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FishRecord;