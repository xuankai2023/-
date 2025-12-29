# 数据库表结构设计文档

基于项目代码分析，以下是完整的数据库表结构设计。

## 1. 用户表 (users)

```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar VARCHAR(500),
    roles JSON,  -- 存储角色数组，如 ['admin', 'user']
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 2. 宠物表 (pets)

```sql
CREATE TABLE pets (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(100) NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    birth_date DATE,
    avatar VARCHAR(500),
    size ENUM('小', '中', '大') NOT NULL,
    weight DECIMAL(5, 2),
    height DECIMAL(5, 2),
    fur_color VARCHAR(50),
    description TEXT,
    status VARCHAR(50) DEFAULT '健康',
    special_diseases TEXT,
    allergies TEXT,
    last_checkup_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_breed (breed),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 3. 疫苗记录表 (vaccine_records)

```sql
CREATE TABLE vaccine_records (
    id VARCHAR(36) PRIMARY KEY,
    pet_id VARCHAR(36) NOT NULL,
    name VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    next_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
    INDEX idx_pet_id (pet_id),
    INDEX idx_date (date),
    INDEX idx_next_date (next_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 4. 服务记录表 (service_records)

```sql
CREATE TABLE service_records (
    id VARCHAR(36) PRIMARY KEY,
    pet_id VARCHAR(36) NOT NULL,
    service_name VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status ENUM('已完成', '进行中', '待预约') DEFAULT '待预约',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
    INDEX idx_pet_id (pet_id),
    INDEX idx_date (date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 5. 订单表 (orders)

```sql
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,  -- 如 ORDER0001
    user_id VARCHAR(36) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_avatar VARCHAR(500),
    pet_id VARCHAR(36),
    pet_name VARCHAR(100),
    pet_type VARCHAR(50),
    pet_image VARCHAR(500),
    service_name VARCHAR(200) NOT NULL,
    service_price DECIMAL(10, 2) NOT NULL,
    quantity INT DEFAULT 1,
    total_amount DECIMAL(10, 2) NOT NULL,
    order_time TIMESTAMP NOT NULL,
    scheduled_time TIMESTAMP,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_order_time (order_time),
    INDEX idx_scheduled_time (scheduled_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 6. 聊天会话表 (chat_sessions)

```sql
CREATE TABLE chat_sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    pet_id VARCHAR(36),  -- 可选：关联特定宠物
    title VARCHAR(200) NOT NULL,
    message_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_pet_id (pet_id),
    INDEX idx_updated_at (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 7. 聊天消息表 (chat_messages)

```sql
CREATE TABLE chat_messages (
    id VARCHAR(36) PRIMARY KEY,
    session_id VARCHAR(36) NOT NULL,
    role ENUM('user', 'assistant', 'system') NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    model VARCHAR(50),  -- AI模型名称，如 'deepseek-chat'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE,
    INDEX idx_session_id (session_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 8. API密钥表 (api_keys) - 可选

如果需要服务端管理API密钥：

```sql
CREATE TABLE api_keys (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    key_name VARCHAR(100),
    key_value VARCHAR(255) NOT NULL,  -- 加密存储
    provider VARCHAR(50) DEFAULT 'deepseek',  -- API提供商
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_provider (provider)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 9. 通知表 (notifications) - 可选

```sql
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type ENUM('success', 'info', 'warning', 'error') DEFAULT 'info',
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_id VARCHAR(36),  -- 关联的订单ID、宠物ID等
    related_type VARCHAR(50),  -- 'order', 'pet', 'vaccine' 等
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 表关系图

```
users (1) ──< (N) pets
pets (1) ──< (N) vaccine_records
pets (1) ──< (N) service_records
users (1) ──< (N) orders
pets (1) ──< (N) orders (可选)
users (1) ──< (N) chat_sessions
pets (1) ──< (N) chat_sessions (可选)
chat_sessions (1) ──< (N) chat_messages
users (1) ──< (N) api_keys (可选)
users (1) ──< (N) notifications (可选)
```

## 索引优化建议

1. **用户表**: email, username 需要唯一索引
2. **宠物表**: user_id, breed, status 需要索引
3. **订单表**: order_number 唯一索引，status, order_time, scheduled_time 需要索引
4. **聊天表**: session_id, timestamp 需要索引
5. **时间字段**: 所有 created_at, updated_at 建议添加索引用于排序和筛选

## 数据类型说明

- **VARCHAR(36)**: UUID格式的ID
- **ENUM**: 固定枚举值，提高查询效率
- **DECIMAL**: 金额和重量等精确数值
- **TIMESTAMP**: 时间戳，自动管理
- **TEXT**: 长文本内容
- **JSON**: 存储数组或对象（MySQL 5.7+）

## 注意事项

1. **字符集**: 使用 `utf8mb4` 支持emoji和特殊字符
2. **外键约束**: 使用 `ON DELETE CASCADE` 或 `ON DELETE SET NULL` 根据业务需求
3. **软删除**: 可考虑添加 `deleted_at` 字段实现软删除
4. **审计字段**: 所有表都包含 `created_at` 和 `updated_at`
5. **索引策略**: 根据查询频率添加索引，避免过度索引

