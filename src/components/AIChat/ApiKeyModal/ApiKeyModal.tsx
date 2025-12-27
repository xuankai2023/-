import React, { useState } from 'react';
import { Modal, Button, Input, message } from 'antd';
import { KeyManager } from '../../../utils/keyManager';
import './ApiKeyModal.css';

export interface ApiKeyModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

function ApiKeyModal({ open, onClose, onSuccess }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      message.warning('请输入API密钥');
      return;
    }

    if (!KeyManager.validateKey(apiKey)) {
      message.error('无效的API密钥格式');
      return;
    }

    setLoading(true);
    try {
      const success = KeyManager.saveKey(apiKey);
      if (success) {
        message.success('API密钥保存成功');
        setApiKey('');
        onClose();
        onSuccess?.();
      } else {
        message.error('API密钥保存失败');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  return (
    <Modal
      title="API密钥设置"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={handleSaveKey} loading={loading}>
          保存
        </Button>
      ]}
      className="api-key-modal"
    >
      <div className="api-key-modal-content">
        <p className="api-key-modal-description">请输入您的AI服务API密钥：</p>
        <Input.Password
          placeholder="sk-..."
          value={apiKey}
          onChange={handleKeyInputChange}
          onPressEnter={handleSaveKey}
          className="api-key-input"
          size="large"
        />
        <p className="api-key-modal-tip">
          密钥将被安全地存储在您的本地设备上，不会上传至云端。
        </p>
      </div>
    </Modal>
  );
}

export default ApiKeyModal;

