import React, { useState } from 'react';
import { Search, Toast, Space, Badge } from 'react-vant';
import { ChatO } from '@react-vant/icons';
import { useLocation } from 'react-router-dom';
import './Header.css';


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
          onChange={setValue}
          placeholder="请输入搜索关键词"
          showAction
          onSearch={(val) => {
            Toast(val);
            setValue(val);
          }}
          onCancel={() => {
            Toast('取消');
            setValue('');
          }}
          onClear={() => {
            Toast('清除');
            setValue('');
          }}
          onClickInput={() => {
            Toast('点击输入区域时触发	');
          }}
        />
        <Space className='demo-icon' gap={20}>
          <Badge dot>
            <ChatO />
          </Badge>
        </Space>
        <img src="/images/png/admin.png" alt="管理员头像" />
      </div>

    </header>
  );
};

export default Header;