# 宠物后端 API 接口文档

**版本**: 1.0.0  
**基础URL**: `http://localhost:8083`  
**API前缀**: `/api/v1`

---

## 目录

- [认证相关](#认证相关)
- [用户管理](#用户管理)
- [宠物管理](#宠物管理)
- [疫苗记录](#疫苗记录)
- [服务记录](#服务记录)
- [商品管理](#商品管理)
- [订单管理](#订单管理)
- [订单日志](#订单日志)
- [聊天会话](#聊天会话)
- [聊天消息](#聊天消息)
- [通知管理](#通知管理)
- [API密钥管理](#api密钥管理)
- [数据导出](#数据导出)
- [工具接口](#工具接口)

---

## 认证相关

### 1. 用户登录

**POST** `/api/v1/login/access-token`

获取访问令牌（OAuth2 兼容），支持多种请求格式

**支持的请求格式**:

1. **JSON 格式** (推荐):
   ```json
   {
     "username": "user@example.com",
     "password": "your_password"
   }
   ```
   Content-Type: `application/json`

2. **Form Data 格式** (OAuth2 标准):
   ```
   username=user@example.com&password=your_password
   ```
   Content-Type: `application/x-www-form-urlencoded`

3. **Multipart Form Data**:
   ```
   username=user@example.com&password=your_password
   ```
   Content-Type: `multipart/form-data`

**请求参数**:
- `username` (string, 必填): 用户邮箱或用户名（支持邮箱或用户名登录）
- `password` (string, 必填): 用户密码

**响应**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**错误响应**:
- `400`: 请求参数错误（缺少用户名或密码）
- `401`: 用户名/邮箱或密码错误
- `403`: 用户账户已被禁用
- `500`: 服务器内部错误

**认证**: 无需登录

**注意事项**:
- `username` 字段支持邮箱或用户名两种方式登录
- 系统会自动检测请求格式（JSON 或 Form Data）
- 密码会自动去除首尾空格
- 登录失败时不会泄露用户是否存在的信息

---

### 2. 测试令牌

**POST** `/api/v1/login/test-token`

测试访问令牌是否有效

**请求头**:
- `Authorization: Bearer {token}`

**响应**: 返回当前用户信息

**认证**: 需要登录

---

### 3. 密码恢复

**POST** `/api/v1/password-recovery/{email}`

发送密码重置邮件

**路径参数**:
- `email` (string, 必填): 用户邮箱

**响应**:
```json
{
  "message": "If the email exists, a password recovery email has been sent."
}
```

**错误响应**:
- `500`: 服务器内部错误

**认证**: 无需登录

**注意事项**:
- 出于安全考虑，无论邮箱是否存在，接口都会返回相同的成功消息
- 这样可以防止用户枚举攻击（避免攻击者通过接口判断邮箱是否注册）
- 如果邮箱存在且账户激活，系统会发送密码重置邮件
- 如果邮件服务未配置，会在日志中记录警告信息

---

### 4. 重置密码

**POST** `/api/v1/reset-password/`

使用重置令牌重置密码

**请求体**:
```json
{
  "token": "reset_token_here",
  "new_password": "new_password_here"
}
```

**请求参数说明**:
- `token` (string, 必填): 密码重置令牌（从密码恢复邮件中获取）
- `new_password` (string, 必填): 新密码，至少8个字符

**响应**:
```json
{
  "message": "Password updated successfully"
}
```

**错误响应**:
- `400`: 令牌无效或已过期，或密码长度不足8个字符
- `403`: 用户账户已被禁用
- `404`: 用户不存在
- `500`: 服务器内部错误

**认证**: 无需登录

**注意事项**:
- 新密码必须至少8个字符
- 重置令牌有时效性，过期后需要重新申请
- 如果用户账户被禁用，无法重置密码
- 重置成功后，旧密码立即失效

---

## 用户管理

### 1. 获取用户列表

**GET** `/api/v1/users/`

获取所有用户列表（仅管理员）

**查询参数**:
- `skip` (int, 可选, 默认: 0): 跳过记录数
- `limit` (int, 可选, 默认: 100): 返回记录数

**响应**:
```json
{
  "data": [...],
  "count": 10
}
```

**认证**: 需要管理员权限

---

### 2. 创建用户

**POST** `/api/v1/users/`

创建新用户（仅管理员）

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "is_superuser": false,
  "is_active": true
}
```

**响应**: 返回创建的用户信息

**认证**: 需要管理员权限

---

### 3. 获取当前用户信息

**GET** `/api/v1/users/me`

获取当前登录用户的信息

**响应**: 返回当前用户信息

**认证**: 需要登录

---

### 4. 更新当前用户信息

**PATCH** `/api/v1/users/me`

更新当前登录用户的信息

**请求体**:
```json
{
  "full_name": "John Doe",
  "email": "newemail@example.com"
}
```

**响应**: 返回更新后的用户信息

**认证**: 需要登录

---

### 5. 修改当前用户密码

**PATCH** `/api/v1/users/me/password`

修改当前用户的密码

**请求体**:
```json
{
  "current_password": "old_password",
  "new_password": "new_password"
}
```

**响应**:
```json
{
  "message": "Password updated successfully"
}
```

**认证**: 需要登录

---

### 6. 删除当前用户

**DELETE** `/api/v1/users/me`

删除当前用户账户

**响应**:
```json
{
  "message": "User deleted successfully"
}
```

**认证**: 需要登录

---

### 7. 用户注册

**POST** `/api/v1/users/signup`

用户注册（公开接口）

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

**响应**: 返回创建的用户信息

**认证**: 无需登录

---

### 8. 获取指定用户

**GET** `/api/v1/users/{user_id}`

获取指定用户信息

**路径参数**:
- `user_id` (string, 必填): 用户ID

**响应**: 返回用户信息

**认证**: 需要登录（管理员可查看所有用户，普通用户只能查看自己）

---

### 9. 更新指定用户

**PATCH** `/api/v1/users/{user_id}`

更新指定用户信息（仅管理员）

**路径参数**:
- `user_id` (string, 必填): 用户ID

**请求体**:
```json
{
  "email": "newemail@example.com",
  "is_active": true,
  "is_superuser": false
}
```

**响应**: 返回更新后的用户信息

**认证**: 需要管理员权限

---

### 10. 删除指定用户

**DELETE** `/api/v1/users/{user_id}`

删除指定用户（仅管理员）

**路径参数**:
- `user_id` (string, 必填): 用户ID

**响应**:
```json
{
  "message": "User deleted successfully"
}
```

**认证**: 需要管理员权限

---

## 宠物管理

### 1. 获取宠物列表

**GET** `/api/v1/pets/`

获取宠物列表

**查询参数**:
- `skip` (int, 可选, 默认: 0): 跳过记录数
- `limit` (int, 可选, 默认: 100): 返回记录数
- `user_id` (string, 可选): 用户ID（仅管理员可用）

**响应**:
```json
{
  "data": [...],
  "count": 10
}
```

**认证**: 需要登录（普通用户只能查看自己的宠物）

---

### 2. 创建宠物

**POST** `/api/v1/pets/`

创建新宠物

**请求体**:
```json
{
  "user_id": "user_id_here",
  "name": "旺财",
  "breed": "金毛",
  "gender": "male",
  "birth_date": "2020-01-01",
  "avatar": "https://example.com/avatar.jpg",
  "size": "大",
  "weight": 25.5,
  "height": 60.0,
  "fur_color": "金色",
  "description": "很温顺的狗狗",
  "status": "active",
  "special_diseases": "无",
  "allergies": "无",
  "last_checkup_date": "2024-01-01"
}
```

**请求参数说明**:
- `user_id` (string, 必填): 用户ID
- `name` (string, 必填): 宠物名称
- `breed` (string, 可选): 品种
- `gender` (string, 可选): 性别，可选值: male/female
- `birth_date` (date, 可选): 出生日期，格式: YYYY-MM-DD
- `avatar` (string, 可选): 头像URL
- `size` (string, 可选): 体型，可选值: 小/中/大
- `weight` (float, 可选): 体重（kg）
- `height` (float, 可选): 身高（cm）
- `fur_color` (string, 可选): 毛色
- `description` (string, 可选): 描述
- `status` (string, 可选): 状态
- `special_diseases` (string, 可选): 特殊疾病
- `allergies` (string, 可选): 过敏信息
- `last_checkup_date` (date, 可选): 最后体检日期

**响应**: 返回创建的宠物信息

**认证**: 需要登录

**注意事项**:
- 普通用户只能为自己创建宠物，超级用户可以为任何用户创建

---

### 3. 获取指定宠物

**GET** `/api/v1/pets/{pet_id}`

获取指定宠物信息

**路径参数**:
- `pet_id` (string, 必填): 宠物ID

**响应**: 返回宠物信息

**认证**: 需要登录（普通用户只能查看自己的宠物）

---

### 4. 更新宠物信息

**PATCH** `/api/v1/pets/{pet_id}`

更新宠物信息

**路径参数**:
- `pet_id` (string, 必填): 宠物ID

**请求体**:
```json
{
  "name": "新名字",
  "weight": 26.0,
  "description": "更新后的描述"
}
```

**响应**: 返回更新后的宠物信息

**认证**: 需要登录（普通用户只能更新自己的宠物）

---

### 5. 删除宠物

**DELETE** `/api/v1/pets/{pet_id}`

删除宠物

**路径参数**:
- `pet_id` (string, 必填): 宠物ID

**响应**:
```json
{
  "message": "Pet deleted successfully"
}
```

**认证**: 需要登录（普通用户只能删除自己的宠物）

---

## 疫苗记录

### 1. 获取疫苗记录列表

**GET** `/api/v1/vaccine-records/`

获取疫苗记录列表

**查询参数**:
- `skip` (int, 可选, 默认: 0): 跳过记录数
- `limit` (int, 可选, 默认: 100): 返回记录数
- `pet_id` (string, 可选): 宠物ID

**响应**:
```json
{
  "data": [...],
  "count": 10
}
```

**认证**: 需要登录

---

### 2. 创建疫苗记录

**POST** `/api/v1/vaccine-records/`

创建疫苗记录

**请求体**:
```json
{
  "pet_id": "pet_id_here",
  "name": "狂犬疫苗",
  "date": "2024-01-01",
  "next_date": "2025-01-01",
  "notes": "第一针"
}
```

**请求参数说明**:
- `pet_id` (string, 必填): 宠物ID
- `name` (string, 可选): 疫苗名称
- `date` (date, 可选): 接种日期，格式: YYYY-MM-DD
- `next_date` (date, 可选): 下次接种日期，格式: YYYY-MM-DD
- `notes` (string, 可选): 备注

**响应**: 返回创建的疫苗记录

**认证**: 需要登录

**注意事项**:
- 会验证宠物是否存在以及用户是否有权限访问该宠物
- 普通用户只能为自己的宠物创建疫苗记录

---

### 3. 获取指定疫苗记录

**GET** `/api/v1/vaccine-records/{record_id}`

获取指定疫苗记录

**路径参数**:
- `record_id` (string, 必填): 记录ID

**响应**: 返回疫苗记录信息

**认证**: 需要登录

---

### 4. 更新疫苗记录

**PATCH** `/api/v1/vaccine-records/{record_id}`

更新疫苗记录

**路径参数**:
- `record_id` (string, 必填): 记录ID

**请求体**:
```json
{
  "name": "更新后的疫苗名称",
  "next_date": "2025-02-01",
  "notes": "更新后的备注"
}
```

**响应**: 返回更新后的疫苗记录

**认证**: 需要登录

---

### 5. 删除疫苗记录

**DELETE** `/api/v1/vaccine-records/{record_id}`

删除疫苗记录

**路径参数**:
- `record_id` (string, 必填): 记录ID

**响应**:
```json
{
  "message": "Vaccine record deleted successfully"
}
```

**认证**: 需要登录

---

## 服务记录

### 1. 获取服务记录列表

**GET** `/api/v1/service-records/`

获取服务记录列表

**查询参数**:
- `skip` (int, 可选, 默认: 0): 跳过记录数
- `limit` (int, 可选, 默认: 100): 返回记录数
- `pet_id` (string, 可选): 宠物ID

**响应**:
```json
{
  "data": [...],
  "count": 10
}
```

**认证**: 需要登录

---

### 2. 创建服务记录

**POST** `/api/v1/service-records/`

创建服务记录

**请求体**:
```json
{
  "pet_id": "pet_id_here",
  "service_name": "洗澡",
  "date": "2024-01-01",
  "price": 100.0,
  "status": "completed",
  "notes": "服务完成"
}
```

**请求参数说明**:
- `pet_id` (string, 必填): 宠物ID
- `service_name` (string, 可选): 服务名称
- `date` (date, 可选): 服务日期，格式: YYYY-MM-DD
- `price` (float, 可选): 服务价格
- `status` (string, 可选): 服务状态
- `notes` (string, 可选): 备注

**响应**: 返回创建的服务记录

**认证**: 需要登录

**注意事项**:
- 会验证宠物是否存在以及用户是否有权限访问该宠物
- 普通用户只能为自己的宠物创建服务记录

---

### 3. 获取指定服务记录

**GET** `/api/v1/service-records/{record_id}`

获取指定服务记录

**路径参数**:
- `record_id` (string, 必填): 记录ID

**响应**: 返回服务记录信息

**认证**: 需要登录

---

### 4. 更新服务记录

**PATCH** `/api/v1/service-records/{record_id}`

更新服务记录

**路径参数**:
- `record_id` (string, 必填): 记录ID

**请求体**:
```json
{
  "service_name": "更新后的服务名称",
  "price": 120.0,
  "status": "completed"
}
```

**响应**: 返回更新后的服务记录

**认证**: 需要登录

---

### 5. 删除服务记录

**DELETE** `/api/v1/service-records/{record_id}`

删除服务记录

**路径参数**:
- `record_id` (string, 必填): 记录ID

**响应**:
```json
{
  "message": "Service record deleted successfully"
}
```

**认证**: 需要登录

---

## 商品管理

### 1. 获取商品列表

**GET** `/api/v1/products/`

获取商品列表（公开接口）

**查询参数**:
- `skip` (int, 可选, 默认: 0): 跳过记录数
- `limit` (int, 可选, 默认: 100): 返回记录数
- `status` (string, 可选): 商品状态筛选
- `category` (string, 可选): 商品分类筛选

**响应**:
```json
{
  "data": [...],
  "count": 10
}
```

**认证**: 无需登录

---

### 2. 获取指定商品

**GET** `/api/v1/products/{product_id}`

获取指定商品信息

**路径参数**:
- `product_id` (string, 必填): 商品ID

**响应**: 返回商品信息

**认证**: 无需登录

---

### 3. 创建商品

**POST** `/api/v1/products/`

创建新商品（仅管理员）

**请求体**:
```json
{
  "name": "狗粮",
  "description": "优质狗粮",
  "price": 99.0,
  "stock": 100,
  "image": "https://example.com/image.jpg",
  "category": "food",
  "status": "active"
}
```

**请求参数说明**:
- `name` (string, 必填): 商品名称
- `description` (string, 可选): 商品描述
- `price` (float, 必填): 商品价格
- `stock` (int, 可选, 默认: 0): 库存数量
- `image` (string, 可选): 商品图片URL
- `category` (string, 可选): 商品分类
- `status` (string, 可选, 默认: "active"): 商品状态，可选值: active/inactive/deleted

**响应**: 返回创建的商品信息

**认证**: 需要管理员权限

---

### 4. 更新商品

**PATCH** `/api/v1/products/{product_id}`

更新商品信息（仅管理员）

**路径参数**:
- `product_id` (string, 必填): 商品ID

**请求体**:
```json
{
  "name": "更新后的商品名",
  "price": 109.0,
  "stock": 90,
  "status": "active"
}
```

**响应**: 返回更新后的商品信息

**认证**: 需要管理员权限

---

### 5. 删除商品

**DELETE** `/api/v1/products/{product_id}`

删除商品（仅管理员，软删除）

**路径参数**:
- `product_id` (string, 必填): 商品ID

**响应**:
```json
{
  "message": "Product deleted successfully"
}
```

**认证**: 需要管理员权限

**注意事项**:
- 这是软删除操作，商品状态会被设置为"deleted"，不会真正从数据库中删除

---

## 订单管理

### 1. 获取订单列表

**GET** `/api/v1/orders/`

获取订单列表

**查询参数**:
- `skip` (int, 可选, 默认: 0): 跳过记录数
- `limit` (int, 可选, 默认: 100): 返回记录数
- `user_id` (string, 可选): 用户ID（仅管理员可用）
- `status` (string, 可选): 订单状态筛选

**响应**:
```json
{
  "data": [...],
  "count": 10
}
```

**认证**: 需要登录（普通用户只能查看自己的订单）

---

### 2. 创建订单（带验证）

**POST** `/api/v1/orders/create`

创建订单（带完整验证，包含库存检查、价格验证、自动生成订单号、扣库存、创建订单日志）

**请求体**:
```json
{
  "product_id": "product_id_here",
  "quantity": 2,
  "price": 99.0,
  "shipping_address": "北京市朝阳区xxx",
  "notes": "订单备注"
}
```

**请求参数说明**:
- `product_id` (string, 必填): 商品ID
- `quantity` (int, 必填, >0): 购买数量，必须大于0
- `price` (float, 必填, >0): 商品单价，用于验证价格是否正确
- `shipping_address` (string, 可选): 收货地址
- `notes` (string, 可选): 订单备注

**响应**: 返回创建的订单信息（包含自动生成的订单号）

**认证**: 需要登录

**注意事项**:
- 系统会自动验证商品库存是否充足
- 系统会自动验证价格是否正确（防止前端篡改价格）
- 系统会自动生成唯一订单号
- 创建订单后会自动扣减商品库存
- 系统会自动创建订单日志记录

---

### 3. 创建订单（简单）

**POST** `/api/v1/orders/`

创建订单（简单方式）

**请求体**:
```json
{
  "pet_id": "pet_id_here",
  "product_id": "product_id_here",
  "quantity": 1,
  "total_amount": 99.0,
  "status": "pending"
}
```

**响应**: 返回创建的订单信息

**认证**: 需要登录

---

### 4. 获取指定订单

**GET** `/api/v1/orders/{order_id}`

获取指定订单信息

**路径参数**:
- `order_id` (string, 必填): 订单ID

**响应**: 返回订单信息

**认证**: 需要登录（普通用户只能查看自己的订单）

---

### 5. 更新订单

**PATCH** `/api/v1/orders/{order_id}`

更新订单信息

**路径参数**:
- `order_id` (string, 必填): 订单ID

**请求体**:
```json
{
  "status": "completed",
  "notes": "订单已完成"
}
```

**响应**: 返回更新后的订单信息

**认证**: 需要登录（普通用户只能更新自己的订单）

---

### 6. 删除订单

**DELETE** `/api/v1/orders/{order_id}`

删除订单

**路径参数**:
- `order_id` (string, 必填): 订单ID

**响应**:
```json
{
  "message": "Order deleted successfully"
}
```

**认证**: 需要登录（普通用户只能删除自己的订单）

---

## 订单日志

### 1. 获取订单日志列表

**GET** `/api/v1/orders/{order_id}/logs`

获取指定订单的日志列表

**路径参数**:
- `order_id` (string, 必填): 订单ID

**查询参数**:
- `skip` (int, 可选, 默认: 0): 跳过记录数
- `limit` (int, 可选, 默认: 100): 返回记录数

**响应**:
```json
{
  "data": [
    {
      "id": "log_id",
      "order_id": "order_id",
      "action": "created",
      "operator_id": "user_id",
      "operator_type": "user",
      "old_status": null,
      "new_status": "pending",
      "description": "订单已创建",
      "ip_address": "127.0.0.1",
      "user_agent": "Mozilla/5.0...",
      "created_at": "2024-01-01T12:00:00"
    }
  ],
  "count": 10
}
```

**认证**: 需要登录（普通用户只能查看自己订单的日志）

**注意事项**:
- 日志按创建时间倒序排列（最新的在前）
- 日志记录包含操作类型、操作者、状态变更、IP地址等信息

---

### 2. 获取指定订单日志

**GET** `/api/v1/orders/{order_id}/logs/{log_id}`

获取指定订单日志详情

**路径参数**:
- `order_id` (string, 必填): 订单ID
- `log_id` (string, 必填): 日志ID

**响应**: 返回日志信息

**认证**: 需要登录

**注意事项**:
- 会验证日志是否属于指定的订单
- 普通用户只能查看自己订单的日志

---

## 聊天会话

### 1. 获取聊天会话列表

**GET** `/api/v1/chat-sessions/`

获取聊天会话列表

**查询参数**:
- `skip` (int, 可选, 默认: 0): 跳过记录数
- `limit` (int, 可选, 默认: 100): 返回记录数
- `user_id` (string, 可选): 用户ID（仅管理员可用）

**响应**:
```json
{
  "data": [...],
  "count": 10
}
```

**认证**: 需要登录

---

### 2. 创建聊天会话

**POST** `/api/v1/chat-sessions/`

创建新的聊天会话

**请求体**:
```json
{
  "user_id": "user_id_here",
  "pet_id": "pet_id_here",
  "title": "关于宠物的咨询"
}
```

**请求参数说明**:
- `user_id` (string, 可选): 用户ID，如果不提供则使用当前登录用户ID
- `pet_id` (string, 可选): 宠物ID
- `title` (string, 可选): 会话标题

**响应**: 返回创建的会话信息

**认证**: 需要登录

**注意事项**:
- 普通用户只能为自己创建会话，超级用户可以为任何用户创建
- 如果不提供user_id，系统会自动使用当前登录用户的ID

---

### 3. 获取指定会话

**GET** `/api/v1/chat-sessions/{session_id}`

获取指定聊天会话信息

**路径参数**:
- `session_id` (string, 必填): 会话ID

**响应**: 返回会话信息

**认证**: 需要登录

---

### 4. 更新会话

**PATCH** `/api/v1/chat-sessions/{session_id}`

更新聊天会话信息

**路径参数**:
- `session_id` (string, 必填): 会话ID

**请求体**:
```json
{
  "title": "更新后的标题"
}
```

**响应**: 返回更新后的会话信息

**认证**: 需要登录

---

### 5. 删除会话

**DELETE** `/api/v1/chat-sessions/{session_id}`

删除聊天会话

**路径参数**:
- `session_id` (string, 必填): 会话ID

**响应**:
```json
{
  "message": "Chat session deleted successfully"
}
```

**认证**: 需要登录

---

### 6. 更新消息数量

**POST** `/api/v1/chat-sessions/{session_id}/update-message-count`

更新会话的消息数量

**路径参数**:
- `session_id` (string, 必填): 会话ID

**响应**: 返回更新后的会话信息

**认证**: 需要登录

---

## 聊天消息

### 1. 获取聊天消息列表

**GET** `/api/v1/chat-messages/`

获取聊天消息列表

**查询参数**:
- `skip` (int, 可选, 默认: 0): 跳过记录数
- `limit` (int, 可选, 默认: 100): 返回记录数
- `session_id` (string, 必填): 会话ID

**响应**:
```json
{
  "data": [...],
  "count": 10
}
```

**认证**: 需要登录

**注意事项**:
- session_id为必填参数
- 消息按时间戳升序排列
- 普通用户只能查看自己会话的消息

---

### 2. 创建聊天消息

**POST** `/api/v1/chat-messages/`

创建新的聊天消息

**请求体**:
```json
{
  "session_id": "session_id_here",
  "role": "user",
  "content": "这是一条消息",
  "timestamp": "2024-01-01T12:00:00",
  "model": "gpt-3.5-turbo"
}
```

**请求参数说明**:
- `session_id` (string, 必填): 会话ID
- `role` (string, 必填): 消息角色，可选值: user/assistant/system
- `content` (string, 必填): 消息内容
- `timestamp` (datetime, 必填): 消息时间戳
- `model` (string, 可选): 使用的模型名称

**响应**: 返回创建的消息信息

**认证**: 需要登录

**注意事项**:
- 创建消息后会自动更新会话的消息数量和更新时间
- 普通用户只能为自己的会话创建消息

---

### 3. 获取指定消息

**GET** `/api/v1/chat-messages/{message_id}`

获取指定聊天消息

**路径参数**:
- `message_id` (string, 必填): 消息ID

**响应**: 返回消息信息

**认证**: 需要登录

---

### 4. 更新消息

**PATCH** `/api/v1/chat-messages/{message_id}`

更新聊天消息

**路径参数**:
- `message_id` (string, 必填): 消息ID

**请求体**:
```json
{
  "content": "更新后的消息内容"
}
```

**响应**: 返回更新后的消息信息

**认证**: 需要登录

---

### 5. 删除消息

**DELETE** `/api/v1/chat-messages/{message_id}`

删除聊天消息

**路径参数**:
- `message_id` (string, 必填): 消息ID

**响应**:
```json
{
  "message": "Chat message deleted successfully"
}
```

**认证**: 需要登录

---

## 通知管理

### 1. 获取通知列表

**GET** `/api/v1/notifications/`

获取通知列表

**查询参数**:
- `skip` (int, 可选, 默认: 0): 跳过记录数
- `limit` (int, 可选, 默认: 100): 返回记录数
- `user_id` (string, 可选): 用户ID（仅管理员可用）
- `is_read` (bool, 可选): 是否已读筛选

**响应**:
```json
{
  "data": [...],
  "count": 10
}
```

**认证**: 需要登录

---

### 2. 创建通知

**POST** `/api/v1/notifications/`

创建新通知

**请求体**:
```json
{
  "user_id": "user_id_here",
  "type": "order",
  "message": "您的订单已发货",
  "related_id": "order_id_here",
  "related_type": "order"
}
```

**请求参数说明**:
- `user_id` (string, 必填): 接收通知的用户ID
- `type` (string, 可选): 通知类型，如: order, system, message等
- `message` (string, 可选): 通知消息内容
- `related_id` (string, 可选): 关联的实体ID
- `related_type` (string, 可选): 关联的实体类型

**响应**: 返回创建的通知信息

**认证**: 需要登录

**注意事项**:
- 普通用户只能为自己创建通知，超级用户可以为任何用户创建

---

### 3. 获取指定通知

**GET** `/api/v1/notifications/{notification_id}`

获取指定通知信息

**路径参数**:
- `notification_id` (string, 必填): 通知ID

**响应**: 返回通知信息

**认证**: 需要登录

---

### 4. 更新通知

**PATCH** `/api/v1/notifications/{notification_id}`

更新通知信息

**路径参数**:
- `notification_id` (string, 必填): 通知ID

**请求体**:
```json
{
  "type": "order",
  "message": "更新后的通知内容",
  "is_read": true,
  "related_id": "order_id_here",
  "related_type": "order"
}
```

**响应**: 返回更新后的通知信息

**认证**: 需要登录

**注意事项**:
- 如果标记为已读（is_read从false变为true），系统会自动设置read_at时间戳
- 普通用户只能更新自己的通知

---

### 5. 删除通知

**DELETE** `/api/v1/notifications/{notification_id}`

删除通知

**路径参数**:
- `notification_id` (string, 必填): 通知ID

**响应**:
```json
{
  "message": "Notification deleted successfully"
}
```

**认证**: 需要登录

---

### 6. 标记为已读

**POST** `/api/v1/notifications/{notification_id}/mark-read`

将通知标记为已读

**路径参数**:
- `notification_id` (string, 必填): 通知ID

**响应**: 返回更新后的通知信息

**认证**: 需要登录

---

## API密钥管理

### 1. 获取API密钥列表

**GET** `/api/v1/api-keys/`

获取API密钥列表

**查询参数**:
- `skip` (int, 可选, 默认: 0): 跳过记录数
- `limit` (int, 可选, 默认: 100): 返回记录数
- `user_id` (string, 可选): 用户ID（仅管理员可用）

**响应**:
```json
{
  "data": [...],
  "count": 10
}
```

**认证**: 需要登录

---

### 2. 创建API密钥

**POST** `/api/v1/api-keys/`

创建新的API密钥

**请求体**:
```json
{
  "user_id": "user_id_here",
  "key_name": "我的API密钥",
  "key_value": "api_key_value",
  "provider": "openai",
  "is_active": true
}
```

**请求参数说明**:
- `user_id` (string, 必填): 用户ID
- `key_name` (string, 可选): 密钥名称
- `key_value` (string, 可选): 密钥值
- `provider` (string, 可选): 提供商，如: openai, anthropic等
- `is_active` (bool, 可选): 是否激活

**响应**: 返回创建的API密钥信息

**认证**: 需要登录

**注意事项**:
- 普通用户只能为自己创建密钥，超级用户可以为任何用户创建
- 在实际应用中，key_value应该加密存储（当前版本为明文存储，生产环境需要改进）

---

### 3. 获取指定API密钥

**GET** `/api/v1/api-keys/{key_id}`

获取指定API密钥信息

**路径参数**:
- `key_id` (string, 必填): 密钥ID

**响应**: 返回API密钥信息

**认证**: 需要登录

---

### 4. 更新API密钥

**PATCH** `/api/v1/api-keys/{key_id}`

更新API密钥信息

**路径参数**:
- `key_id` (string, 必填): 密钥ID

**请求体**:
```json
{
  "key_name": "更新后的密钥名称",
  "key_value": "new_api_key_value",
  "provider": "openai",
  "is_active": false
}
```

**响应**: 返回更新后的API密钥信息

**认证**: 需要登录

**注意事项**:
- 普通用户只能更新自己的密钥
- 如果更新了key_value，应该加密存储（当前版本为明文存储，生产环境需要改进）

---

### 5. 删除API密钥

**DELETE** `/api/v1/api-keys/{key_id}`

删除API密钥

**路径参数**:
- `key_id` (string, 必填): 密钥ID

**响应**:
```json
{
  "message": "API key deleted successfully"
}
```

**认证**: 需要登录

---

## 数据导出

所有导出接口都需要管理员权限。

### 1. 导出宠物数据（CSV）

**GET** `/api/v1/export/pets/csv`

导出宠物数据为CSV格式

**响应**: 返回CSV文件流

**认证**: 需要管理员权限

---

### 2. 导出宠物数据（JSON）

**GET** `/api/v1/export/pets/json`

导出宠物数据为JSON格式

**响应**: 返回JSON文件流

**认证**: 需要管理员权限

---

### 3. 导出疫苗记录（CSV）

**GET** `/api/v1/export/vaccine-records/csv`

导出疫苗记录为CSV格式

**响应**: 返回CSV文件流

**认证**: 需要管理员权限

---

### 4. 导出疫苗记录（JSON）

**GET** `/api/v1/export/vaccine-records/json`

导出疫苗记录为JSON格式

**响应**: 返回JSON文件流

**认证**: 需要管理员权限

---

### 5. 导出服务记录（CSV）

**GET** `/api/v1/export/service-records/csv`

导出服务记录为CSV格式

**响应**: 返回CSV文件流

**认证**: 需要管理员权限

---

### 6. 导出服务记录（JSON）

**GET** `/api/v1/export/service-records/json`

导出服务记录为JSON格式

**响应**: 返回JSON文件流

**认证**: 需要管理员权限

---

### 7. 导出订单（CSV）

**GET** `/api/v1/export/orders/csv`

导出订单为CSV格式

**响应**: 返回CSV文件流

**认证**: 需要管理员权限

---

### 8. 导出订单（JSON）

**GET** `/api/v1/export/orders/json`

导出订单为JSON格式

**响应**: 返回JSON文件流

**认证**: 需要管理员权限

---

### 9. 导出聊天会话（CSV）

**GET** `/api/v1/export/chat-sessions/csv`

导出聊天会话为CSV格式

**响应**: 返回CSV文件流

**认证**: 需要管理员权限

---

### 10. 导出聊天会话（JSON）

**GET** `/api/v1/export/chat-sessions/json`

导出聊天会话为JSON格式

**响应**: 返回JSON文件流

**认证**: 需要管理员权限

---

### 11. 导出聊天消息（CSV）

**GET** `/api/v1/export/chat-messages/csv`

导出聊天消息为CSV格式

**响应**: 返回CSV文件流

**认证**: 需要管理员权限

---

### 12. 导出聊天消息（JSON）

**GET** `/api/v1/export/chat-messages/json`

导出聊天消息为JSON格式

**响应**: 返回JSON文件流

**认证**: 需要管理员权限

---

### 13. 导出API密钥（CSV）

**GET** `/api/v1/export/api-keys/csv`

导出API密钥为CSV格式

**响应**: 返回CSV文件流

**认证**: 需要管理员权限

---

### 14. 导出API密钥（JSON）

**GET** `/api/v1/export/api-keys/json`

导出API密钥为JSON格式

**响应**: 返回JSON文件流

**认证**: 需要管理员权限

---

### 15. 导出通知（CSV）

**GET** `/api/v1/export/notifications/csv`

导出通知为CSV格式

**响应**: 返回CSV文件流

**认证**: 需要管理员权限

---

### 16. 导出通知（JSON）

**GET** `/api/v1/export/notifications/json`

导出通知为JSON格式

**响应**: 返回JSON文件流

**认证**: 需要管理员权限

---

### 17. 导出所有数据（JSON）

**GET** `/api/v1/export/all/json`

导出所有数据为JSON格式（包括宠物、疫苗记录、服务记录、订单、聊天会话、聊天消息、API密钥、通知）

**响应**: 返回JSON文件流

**认证**: 需要管理员权限

---

## 工具接口

### 1. 健康检查

**GET** `/api/v1/utils/health-check/`

检查服务健康状态

**响应**: 
```json
true
```

**认证**: 无需登录

---

### 2. 测试邮件

**POST** `/api/v1/utils/test-email/`

发送测试邮件（仅管理员）

**查询参数**:
- `email_to` (string, 必填): 接收邮箱

**响应**:
```json
{
  "message": "Test email sent"
}
```

**认证**: 需要管理员权限

---

## 通用说明

### 认证方式

大部分接口需要认证，使用 Bearer Token 方式：

```
Authorization: Bearer {access_token}
```

获取 token 的方式：
1. 通过 `/api/v1/login/access-token` 接口登录获取（支持JSON、form-data等多种格式）
2. 通过 `/api/v1/users/signup` 注册后登录

**登录接口支持格式**：
- **JSON格式**（推荐）: `{"username": "email@example.com", "password": "password"}`
- **Form Data格式**: `username=email@example.com&password=password`
- **Multipart Form Data**: 同上

**登录说明**：
- `username` 字段支持邮箱或用户名两种方式
- 系统会自动检测请求格式
- Token 默认有效期为8天（可在配置中修改）

### 响应格式

所有接口统一返回格式：

**成功响应**:
- 200: 成功
- 201: 创建成功

**错误响应**:
- 400: 请求参数错误
- 401: 未认证
- 403: 权限不足
- 404: 资源不存在
- 500: 服务器错误

错误响应格式：
```json
{
  "detail": "错误描述信息"
}
```

### 分页参数

列表接口支持分页：
- `skip`: 跳过记录数（默认: 0）
- `limit`: 返回记录数（默认: 100，最大: 1000）

### 权限说明

- **无需登录**: 公开接口，任何人都可以访问
- **需要登录**: 需要有效的访问令牌
- **需要管理员权限**: 需要登录且用户具有超级管理员权限

---

## 在线文档

- **Swagger UI**: http://localhost:8083/docs
- **ReDoc**: http://localhost:8083/redoc
- **OpenAPI JSON**: http://localhost:8083/openapi.json

---

**文档生成时间**: 2024年  
**API版本**: v1

---

## 数据模型说明

### 订单状态说明
- `pending`: 待支付
- `paid`: 已支付
- `shipped`: 已发货
- `completed`: 已完成
- `cancelled`: 已取消
- `refunded`: 已退款

### 商品状态说明
- `active`: 上架中
- `inactive`: 已下架
- `deleted`: 已删除（软删除）

### 订单日志操作类型
- `created`: 订单创建
- `paid`: 订单支付
- `shipped`: 订单发货
- `completed`: 订单完成
- `cancelled`: 订单取消
- `refunded`: 订单退款

### 订单日志操作者类型
- `user`: 用户操作
- `system`: 系统操作
- `admin`: 管理员操作

### 聊天消息角色
- `user`: 用户消息
- `assistant`: 助手消息
- `system`: 系统消息

---

## 常见问题

### 1. 如何获取访问令牌？
通过 `/api/v1/login/access-token` 接口登录获取。支持以下方式：

**JSON格式（推荐）**：
```bash
curl -X POST "http://localhost:8083/api/v1/login/access-token" \
  -H "Content-Type: application/json" \
  -d '{"username": "user@example.com", "password": "password"}'
```

**Form Data格式**：
```bash
curl -X POST "http://localhost:8083/api/v1/login/access-token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=password"
```

**注意事项**：
- `username` 字段支持邮箱或用户名
- 登录失败不会泄露用户是否存在的信息（安全考虑）
- Token 有效期默认8天

### 2. 订单创建时需要注意什么？
- 使用 `/api/v1/orders/create` 接口创建订单，系统会自动验证库存、价格、生成订单号、扣库存并创建日志
- 必须提供正确的商品ID、数量和价格
- 价格必须与商品实际价格一致，否则会验证失败

### 3. 如何查看订单日志？
通过 `/api/v1/orders/{order_id}/logs` 接口查看指定订单的所有操作日志。

### 4. 商品删除是永久删除吗？
不是，商品删除是软删除，状态会被设置为"deleted"，数据仍然保留在数据库中。

### 5. 普通用户和管理员的权限区别？
- 普通用户只能查看和操作自己的数据（宠物、订单、聊天会话等）
- 管理员可以查看和操作所有用户的数据
- 某些接口（如商品管理、数据导出）仅管理员可用

### 6. 密码忘记怎么办？
1. 使用 `/api/v1/password-recovery/{email}` 接口申请密码重置
2. 系统会发送包含重置令牌的邮件（如果邮件服务已配置）
3. 使用 `/api/v1/reset-password/` 接口，提供令牌和新密码完成重置
4. 出于安全考虑，即使邮箱不存在，接口也会返回成功消息

### 7. 登录时用户名和密码都正确但登录失败？
可能的原因：
- 用户账户已被禁用（`is_active=false`），需要联系管理员
- 密码输入错误（注意大小写和空格）
- Token生成失败（服务器错误，查看日志）

### 8. 登录接口支持哪些请求格式？
登录接口支持三种格式：
- JSON格式（推荐，前端常用）
- application/x-www-form-urlencoded（OAuth2标准格式）
- multipart/form-data（文件上传时使用）

系统会自动检测请求格式，无需手动指定。

