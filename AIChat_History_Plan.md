# AI聊天提问记录功能实现计划

## 目标
添加一个提问记录组件，与 AIChat 组件并排显示，实现历史对话的保存、查看和重新加载功能。

## 实现步骤

### 1. 创建 ChatHistory 组件
- **位置**: `src/components/AIChat/ChatHistory/ChatHistory.tsx`
- **功能**:
  - 显示历史对话列表（按时间倒序）
  - 每个记录显示：标题（用户第一条消息的摘要）、时间、消息数量
  - 支持点击加载历史对话
  - 支持删除历史记录
  - 支持搜索历史记录
  - 空状态提示

### 2. 创建历史记录存储工具
- **位置**: `src/utils/chatHistoryManager.ts`
- **功能**:
  - 使用 localStorage 存储历史记录
  - 保存对话记录（包含所有消息）
  - 加载对话记录
  - 删除对话记录
  - 获取所有历史记录列表
  - 生成对话标题（基于第一条用户消息）

### 3. 修改 AIChat 组件
- **新增功能**:
  - 对话开始时创建新的历史记录ID
  - 每次发送消息后自动保存到历史记录
  - 支持从历史记录加载对话
  - 支持清空当前对话
  - 导出 `loadHistory` 和 `clearChat` 方法供父组件调用

### 4. 修改 AIChatPage 布局
- **布局调整**:
  - 使用 flex 布局，左右分栏
  - 左侧：ChatHistory 组件（宽度：300-400px，可调整）
  - 右侧：AIChat 组件（flex: 1，占据剩余空间）
  - 添加分割线
  - 响应式设计（移动端上下布局）

### 5. 样式优化
- **ChatHistory 样式**:
  - 现代化的列表设计
  - 悬停效果
  - 选中状态高亮
  - 搜索框样式
  - 空状态样式
- **布局样式**:
  - 两个组件之间的分割线
  - 统一的间距和圆角
  - 响应式断点

## 数据结构

### 历史记录项
```typescript
interface ChatHistoryItem {
  id: string;                    // 唯一标识
  title: string;                 // 对话标题（第一条用户消息的摘要）
  messages: Message[];           // 所有消息
  createdAt: number;             // 创建时间戳
  updatedAt: number;             // 更新时间戳
  messageCount: number;          // 消息数量
}
```

### Message 接口（复用现有）
```typescript
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}
```

## 功能特性

1. **自动保存**: 每次对话自动保存到本地存储
2. **快速加载**: 点击历史记录快速恢复对话
3. **搜索功能**: 支持按关键词搜索历史记录
4. **删除功能**: 支持删除不需要的历史记录
5. **标题生成**: 自动从第一条用户消息生成标题
6. **时间显示**: 显示创建时间和最后更新时间

## 技术实现

- **存储**: localStorage（后续可扩展为 IndexedDB）
- **状态管理**: React Hooks (useState, useEffect)
- **UI组件**: Ant Design (List, Input, Button, Empty)
- **样式**: CSS Modules 或独立 CSS 文件

## 响应式设计

- **桌面端**: 左右分栏（ChatHistory: 350px, AIChat: flex: 1）
- **平板端**: 左右分栏（ChatHistory: 300px, AIChat: flex: 1）
- **移动端**: 上下布局（ChatHistory: 高度 40%, AIChat: 高度 60%）

## 后续优化

1. 支持导出对话记录
2. 支持导入对话记录
3. 支持对话记录分类/标签
4. 支持云端同步（可选）
5. 支持对话记录分享

