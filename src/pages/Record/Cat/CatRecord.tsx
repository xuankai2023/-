import React, { useState, useMemo } from 'react';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/SideBar/Sidebar';
import { Input, Button, Tag, Space } from 'antd';
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

  // 模拟宠物猫数据（ID 与 petDetail 使用的 mock 数据保持一致：PET006-008 是猫）
  const catRecords: PetInfo[] = [
    {
      id: 'PET006',
      name: '小花',
      breed: '波斯猫',
      age: '3岁',
      weight: '4.2kg',
      gender: '母',
      avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 'PET007',
      name: '咪咪',
      breed: '英国短毛猫',
      age: '2岁',
      weight: '5.1kg',
      gender: '母',
      avatar: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 'PET008',
      name: '丸子',
      breed: '布偶猫',
      age: '3岁',
      weight: '6.8kg',
      gender: '母',
      avatar: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
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

export default CatRecord;