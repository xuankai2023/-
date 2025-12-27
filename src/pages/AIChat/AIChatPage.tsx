import React, { useRef, useState } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/SideBar/Sidebar';
import AIChat, { AIChatRef } from '../../components/AIChat/AIChat';
import ChatHistory from '../../components/AIChat/ChatHistory/ChatHistory';
import './AIChatPage.css';

const AIChatPage: React.FC = () => {
  const aiChatRef = useRef<AIChatRef>(null);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | undefined>();

  const handleSelectHistory = (historyId: string) => {
    if (aiChatRef.current) {
      aiChatRef.current.loadHistory(historyId);
      setCurrentHistoryId(historyId);
    }
  };

  const handleHistoryChange = (historyId: string | null) => {
    setCurrentHistoryId(historyId || undefined);
  };

  return (
    <div className="ai-chat-page">
      {/* 头部导航栏 */}
      <Header />
      
      <div className="ai-chat-page-content">
        {/* 侧边菜单栏 */}
        <Sidebar />

        {/* 主内容区 - 左右分栏 */}
        <div className="ai-chat-main-container">
          {/* 左侧：提问记录 */}
          <div className="ai-chat-history-wrapper">
            <ChatHistory 
              onSelectHistory={handleSelectHistory}
              currentHistoryId={currentHistoryId}
            />
          </div>

          {/* 右侧：AI对话 */}
          <div className="ai-chat-wrapper">
            <AIChat 
              ref={aiChatRef}
              onHistoryChange={handleHistoryChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;