import React, { useRef, useState } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/SideBar/Sidebar';
import AIChat, { AIChatRef } from '../../components/AIChat/AIChat';
import ChatHistory from '../../components/AIChat/ChatHistory/ChatHistory';
import './AIChatPage.css';

function AIChatPage() {
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
      <Header />
      
      <div className="ai-chat-page-content">
        <Sidebar />

        <div className="ai-chat-main-container">
          <div className="ai-chat-history-wrapper">
            <ChatHistory 
              onSelectHistory={handleSelectHistory}
              currentHistoryId={currentHistoryId}
            />
          </div>

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
}

export default AIChatPage;