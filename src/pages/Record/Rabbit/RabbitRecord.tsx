import React, { useState, useMemo } from 'react';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/SideBar/Sidebar';
import { Input, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import './RabbitRecord.css';

interface PetInfo {
  id: string;
  name: string;
  breed: string;
  age: string;
  weight: string;
  gender: string;
  avatar: string;
}

const RabbitRecord: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  // 模拟宠物兔鼠数据（ID 与 petDetail 使用的 mock 数据保持一致：PET014-015 是兔）
  const rabbitRecords: PetInfo[] = [
    {
      id: 'PET014',
      name: '雪球',
      breed: '垂耳兔',
      age: '2岁',
      weight: '1.2kg',
      gender: '母',
      avatar: 'https://images.unsplash.com/photo-1587304465952-b6b556910f2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 'PET015',
      name: '奶茶',
      breed: '侏儒兔',
      age: '1.5岁',
      weight: '0.8kg',
      gender: '公',
      avatar: 'https://images.unsplash.com/photo-1514589482840-681b79b720d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    }
  ];

  // 过滤数据
  const filteredRecords = useMemo(() => {
    if (!searchValue) return rabbitRecords;
    const keyword = searchValue.toLowerCase();
    return rabbitRecords.filter(pet =>
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
              <h1>宠物兔鼠档案</h1>
              <p>共 {filteredRecords.length} 条宠物兔鼠记录</p>
            </div>

            {/* 搜索栏 */}
            <div className="table-toolbar">
              <Input.Search
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="搜索宠物名称、品种、年龄或体重"
                style={{ width: '400px' }}
                allowClear
                onPressEnter={() => {}}
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
                      <tr
                        key={pet.id}
                        onClick={() => navigate(`/petDetail/${pet.id}`)}
                        style={{ cursor: 'pointer' }}
                      >
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
                                e.stopPropagation();
                                navigate(`/petDetail/${pet.id}`);
                              }}
                            >
                              查看
                            </Button>
                            <Button
                              size="small"
                              onClick={() => message.info(`编辑 ${pet.name} 的信息`)}
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

export default RabbitRecord;