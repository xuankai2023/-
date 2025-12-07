import React, { useState, useMemo } from 'react';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/SideBar/Sidebar';
import { Search, Button, Space, Toast } from 'react-vant';
import './DogReacord.css';

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

  // 模拟宠物狗数据
  const dogRecords: PetInfo[] = [
    {
      id: 'dog-001',
      name: '小黑',
      breed: '拉布拉多',
      age: '3岁',
      weight: '25kg',
      gender: '公',
      avatar: 'https://picsum.photos/seed/dog1/200'
    },
    {
      id: 'dog-002',
      name: '小白',
      breed: '萨摩耶',
      age: '2岁',
      weight: '20kg',
      gender: '母',
      avatar: 'https://picsum.photos/seed/dog2/200'
    },
    {
      id: 'dog-003',
      name: '旺财',
      breed: '金毛',
      age: '4岁',
      weight: '30kg',
      gender: '公',
      avatar: 'https://picsum.photos/seed/dog3/200'
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

export default DogRecord;