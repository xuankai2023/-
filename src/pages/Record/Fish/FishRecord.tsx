import React, { useState, useMemo } from 'react';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/SideBar/Sidebar';
import { Input, Button, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './FishRecord.css';

interface PetInfo {
  id: string;
  name: string;
  breed: string;
  age: string;
  weight: string;
  gender: string;
  avatar: string;
}

const FishRecord: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const handleViewDetail = (petId: string) => {
    navigate(`/petDetail/${petId}`);
  };

  // 模拟观赏鱼数据（ID 与 petDetail 使用的 mock 数据保持一致：PET011-013 是鱼）
  const fishRecords: PetInfo[] = [
    {
      id: 'PET011',
      name: '红红',
      breed: '红锦鲤',
      age: '2岁',
      weight: '0.2kg',
      gender: '公',
      avatar: 'https://images.unsplash.com/photo-1517212168411-b31be8ac33d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 'PET012',
      name: '蓝宝石',
      breed: '蓝曼龙',
      age: '1.5岁',
      weight: '0.1kg',
      gender: '母',
      avatar: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 'PET013',
      name: '斑马',
      breed: '斑马鱼',
      age: '1岁',
      weight: '0.05kg',
      gender: '公',
      avatar: 'https://images.unsplash.com/photo-1571915923963-59973275d4f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    }
  ];

  const filteredRecords = useMemo(() => {
    if (!searchValue) return fishRecords;
    const keyword = searchValue.toLowerCase();
    return fishRecords.filter(pet =>
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
              <h1>观赏鱼档案</h1>
              <p>共 {filteredRecords.length} 条观赏鱼记录</p>
            </div>

            <div className="table-toolbar">
              <Input.Search
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="搜索宠物名称、品种、年龄或体长"
                style={{ width: '400px' }}
                allowClear
                onPressEnter={() => { }}
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

export default FishRecord;