import React, { useState, useMemo } from 'react';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/SideBar/Sidebar';
import { Input, Button, Space, message } from 'antd';
import './DogReacord.css';
import { useNavigate } from 'react-router-dom';
interface PetInfo {
  id: string;
  name: string;
  breed: string;
  age: string;
  weight: string;
  gender: string;
  avatar: string;
}

const DogRecord: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const handleViewDetail = (petId: string) => {
    navigate(`/petDetail/${petId}`);
  };
  // 模拟宠物狗数据（ID 与 petDetail 使用的 mock 数据保持一致：PET001-003 是狗）
  const dogRecords: PetInfo[] = [
    {
      id: 'PET001',
      name: '黑哥',
      breed: '金毛寻回犬',
      age: '4岁',
      weight: '32.5kg',
      gender: '公',
      avatar: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 'PET002',
      name: '大黄',
      breed: '中华田园犬',
      age: '5岁',
      weight: '22kg',
      gender: '公',
      avatar: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 'PET003',
      name: '可乐',
      breed: '哈士奇',
      age: '3岁',
      weight: '28.5kg',
      gender: '公',
      avatar: 'https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    }
  ];

  // 过滤数据
  const filteredRecords = useMemo(() => {
    if (!searchValue) return dogRecords;
    const keyword = searchValue.toLowerCase();
    return dogRecords.filter(pet =>
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
              <h1>宠物狗档案</h1>
              <p>共 {filteredRecords.length} 条宠物狗记录</p>
            </div>

            {/* 搜索栏 */}
            <div className="table-toolbar">
              <Input.Search
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="搜索宠物名称、品种、年龄或体重"
                style={{ width: '400px' }}
                allowClear
                onPressEnter={() => { }}
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
                          <Space style={{ gap: '8px' }}>
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

export default DogRecord;