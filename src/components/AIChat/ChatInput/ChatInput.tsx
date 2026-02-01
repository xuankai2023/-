import React, { useRef, useEffect } from 'react';
import { Input, Button, Space } from 'antd';
import { SendOutlined, StopOutlined } from '@ant-design/icons';
import './ChatInput.css';

const { TextArea } = Input;

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop?: () => void;
  disabled?: boolean;
  isStreaming?: boolean;
  placeholder?: string;
  showStopButton?: boolean;
}

function ChatInput({
  value,
  onChange,
  onSend,
  onStop,
  disabled = false,
  isStreaming = false,
  placeholder = '输入消息...（Shift+Enter 换行，Enter 发送）',
  showStopButton = true,
}: ChatInputProps) {
  const textAreaRef = useRef<any>(null);

  // 自动调整高度
  useEffect(() => {
    if (textAreaRef.current?.resizableTextArea?.textArea) {
      const textArea = textAreaRef.current.resizableTextArea.textArea;
      textArea.style.height = 'auto';
      textArea.style.height = `${Math.min(textArea.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + Enter 发送
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!disabled && !isStreaming && value.trim()) {
        onSend();
      }
      return;
    }

    // Enter 发送（不按 Shift）
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && !isStreaming && value.trim()) {
        onSend();
      }
    }
    // Shift + Enter 换行（默认行为，不需要处理）
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleSend = () => {
    if (!disabled && !isStreaming && value.trim()) {
      onSend();
    }
  };

  const handleStop = () => {
    if (onStop && isStreaming) {
      onStop();
    }
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <TextArea
          ref={textAreaRef}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled || isStreaming}
          autoSize={{ minRows: 1, maxRows: 6 }}
          className="chat-input-field"
          style={{ resize: 'none' }}
        />
        <Space className="chat-input-actions">
          {showStopButton && isStreaming && onStop && (
            <Button
              type="default"
              danger
              icon={<StopOutlined />}
              onClick={handleStop}
              className="chat-stop-button"
              title="停止生成"
            >
              停止
            </Button>
          )}
        <Button
          type="primary"
          icon={<SendOutlined />}
            onClick={handleSend}
            disabled={disabled || isStreaming || !value.trim()}
          className="chat-send-button"
            title="发送 (Enter)"
          >
            发送
          </Button>
        </Space>
      </div>
      <div className="chat-input-hint">
        <span>💡 提示：Enter 发送，Shift+Enter 换行，Ctrl+Enter 发送</span>
      </div>
    </div>
  );
}

export default ChatInput;

