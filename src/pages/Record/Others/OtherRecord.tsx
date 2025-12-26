import React, { useState, useMemo } from 'react';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/SideBar/Sidebar';
import { Input, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import './OtherReacord.css';

interface PetInfo {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  weight: string;
  gender: string;
  avatar: string;
}

const OtherRecord: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  // 模拟其他宠物数据（ID 与 petDetail 使用的 mock 数据保持一致：PET016-020）
  const otherRecords: PetInfo[] = [
    {
      id: 'PET016',
      name: '瓜子',
      type: '仓鼠',
      breed: '仓鼠',
      age: '1岁',
      weight: '0.15kg',
      gender: '公',
      avatar: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 'PET017',
      name: '灰灰',
      type: '龙猫',
      breed: '龙猫',
      age: '2岁',
      weight: '0.5kg',
      gender: '母',
      avatar: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 'PET018',
      name: '鹦鹉',
      type: '鸟类',
      breed: '虎皮鹦鹉',
      age: '3岁',
      weight: '0.1kg',
      gender: '公',
      avatar: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 'PET019',
      name: '小刺',
      type: '小型哺乳动物',
      breed: '刺猬',
      age: '1岁',
      weight: '0.3kg',
      gender: '公',
      avatar: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 'PET020',
      name: '金金',
      type: '小型啮齿类',
      breed: '金丝熊',
      age: '1岁',
      weight: '0.2kg',
      gender: '母',
      avatar: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    }
  ];

  // 过滤数据
  const filteredRecords = useMemo(() => {
    if (!searchValue) return otherRecords;
    const keyword = searchValue.toLowerCase();
    return otherRecords.filter(pet =>
      pet.name.toLowerCase().includes(keyword) ||
      pet.type.toLowerCase().includes(keyword) ||
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
              <h1>其他宠物档案</h1>
              <p>共 {filteredRecords.length} 条其他宠物记录</p>
            </div>

            {/* 搜索栏 */}
            <div className="table-toolbar">
              <Input.Search
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="搜索宠物名称、类型、品种、年龄或体重"
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
                    <th>类型</th>
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
                      <td colSpan={8} className="empty-cell">
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
                        <td>{pet.type}</td>
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
                              onClick={(e) => {
                                e.stopPropagation();
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

export default OtherRecord;