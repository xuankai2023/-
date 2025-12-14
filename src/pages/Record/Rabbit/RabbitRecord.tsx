import React, { useState, useMemo } from 'react';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/SideBar/Sidebar';
import { Input, Button, Space, message } from 'antd';
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

  // 模拟宠物兔鼠数据
  const rabbitRecords: PetInfo[] = [
    {
      id: 'rabbit-001',
      name: '跳跳',
      breed: '垂耳兔',
      age: '1岁',
      weight: '1.5kg',
      gender: '公',
      avatar: 'https://picsum.photos/seed/rabbit1/200'
    },
    {
      id: 'rabbit-002',
      name: '小灰',
      breed: '荷兰侏儒兔',
      age: '8个月',
      weight: '0.8kg',
      gender: '母',
      avatar: 'https://picsum.photos/seed/rabbit2/200'
    },
    {
      id: 'mouse-001',
      name: '米米',
      breed: '仓鼠',
      age: '6个月',
      weight: '0.1kg',
      gender: '公',
      avatar: 'https://picsum.photos/seed/mouse1/200'
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
                              onClick={() => message.info(`查看 ${pet.name} 的详情`)}
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