import React from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import './ChatInput.css';

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

function ChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = '输入消息...'
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) {
        onSend();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <Input
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          size="large"
          className="chat-input-field"
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="chat-send-button"
        />
      </div>
    </div>
  );
}

export default ChatInput;

