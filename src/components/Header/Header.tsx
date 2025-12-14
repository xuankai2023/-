import React, { useState } from 'react';
import { Input, message, Space, Badge } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import './Header.css';

const { Search } = Input;


interface User {
  fullName?: string;
  roles?: string[];
  avatar?: string;
}

interface HeaderProps {
  user?: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const [value, setValue] = useState('');
  const location = useLocation();

  // // ✨ 在 admin 页面隐藏 Header
  // if (location.pathname.startsWith('/admin')) {
  //   return null;
  // }

  return (
    <header className="header">
      <div className='header-left'>
        <img src="/images/png/petSystem.png" alt="petSystem" />
        <h1 className="header-title">宠物行业管理系统</h1>
      </div>
      <div className='header-right'>
        <Search
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="请输入搜索关键词"
          onSearch={(val) => {
            message.info(val);
            setValue(val);
          }}
          allowClear
          onPressEnter={() => {
            message.info(value);
          }}
        />
        <Space className='demo-icon' size={20}>
          <Badge dot>
            <MessageOutlined />
          </Badge>
        </Space>
        <img src="/images/png/admin.png" alt="管理员头像" />
      </div>

    </header>
  );
};

export default Header;