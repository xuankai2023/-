import React, { useState, useMemo } from 'react';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/SideBar/Sidebar';
import { Search, Button, Tag, Space } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import './CatRecord.css';

interface PetInfo {
  id: string;
  name: string;
  breed: string;
  age: string;
  weight: string;
  gender: string;
  avatar: string;
}

const CatRecord: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  
  // 跳转到宠物详情页
  const handleViewDetail = (petId: string) => {
    navigate(`/petDetail/${petId}`);
  };

  // 模拟宠物猫数据
  const catRecords: PetInfo[] = [
    {
      id: 'cat-001',
      name: '咪咪',
      breed: '英短蓝猫',
      age: '2岁',
      weight: '5kg',
      gender: '母',
      avatar: 'https://picsum.photos/seed/cat1/200'
    },
    {
      id: 'cat-002',
      name: '豆豆',
      breed: '布偶猫',
      age: '1岁',
      weight: '4kg',
      gender: '公',
      avatar: 'https://picsum.photos/seed/cat2/200'
    },
    {
      id: 'cat-003',
      name: '橙子',
      breed: '橘猫',
      age: '3岁',
      weight: '6kg',
      gender: '公',
      avatar: 'https://picsum.photos/seed/cat3/200'
    }
  ];

  // 过滤数据
  const filteredRecords = useMemo(() => {
    if (!searchValue) return catRecords;
    const keyword = searchValue.toLowerCase();
    return catRecords.filter(pet =>
      pet.name.toLowerCase().includes(keyword) ||
      pet.breed.toLowerCase().includes(keyword) ||
      pet.age.toLowerCase().includes(keyword) ||
      pet.weight.toLowerCase().includes(keyword)
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
              <h1>宠物猫档案</h1>
              <p>共 {filteredRecords.length} 条宠物猫记录</p>
            </div>

            {/* 搜索栏 */}
            <div className="table-toolbar">
              <Search
                value={searchValue}
                onChange={setSearchValue}
                placeholder="搜索宠物名称、品种、年龄或体重"
                showAction
                style={{ width: '400px' }}
              />
            </div>

            {/* 数据表格 */}
            <div className="table-container">
              <table className="pet-table">
                <thead>
                  <tr>
                    <th>宠物ID</th>
                    <th>宠物名称</th>
                    <th>品种</th>
                    <th>年龄</th>
                    <th>体重</th>
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
                      <tr key={pet.id} onClick={() => handleViewDetail(pet.id)} style={{ cursor: 'pointer' }}>
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
                        <td>{pet.weight}</td>
                        <td>{pet.gender}</td>
                        <td>
                          <Space gap={8}>
                            <Button
                              size="small"
                              type="primary"
                              onClick={(e) => {
                                e.stopPropagation(); // 阻止事件冒泡
                                handleViewDetail(pet.id);
                              }}
                            >
                              查看
                            </Button>
                            <Button
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation(); // 阻止事件冒泡
                                alert(`编辑 ${pet.name} 的信息`);
                              }}
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

export default CatRecord;