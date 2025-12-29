# API 接口联调文档

## 一、接口基础信息

### 基础地址
- **开发环境**: `http://localhost:8080`
- **生产环境**: 根据实际部署地址配置

### 统一前缀
所有接口统一使用 `/api` 前缀

### 认证方式
使用 JWT Bearer Token 认证
```
Authorization: Bearer <token>
```

## 二、接口列表

### 2.1 认证相关接口

#### 1. 用户登录
```http
POST /api/auth/login
Content-Type: application/json

Request Body:
{
    "username": "string",
    "password": "string"
}

Response 200:
{
    "success": true,
    "data": {
        "accessToken": "string",
        "refreshToken": "string",
        "user": {
            "id": "string",
            "username": "string",
            "fullName": "string",
            "email": "string",
            "avatar": "string",
            "roles": ["string"]
        }
    },
    "message": "登录成功"
}

Response 400:
{
    "success": false,
    "error": "用户名或密码错误",
    "message": "登录失败"
}
```

#### 2. 用户登出
```http
POST /api/auth/logout
Authorization: Bearer <token>

Response 200:
{
    "success": true,
    "message": "登出成功"
}
```

#### 3. 刷新 Token
```http
POST /api/auth/refresh
Content-Type: application/json

Request Body:
{
    "refreshToken": "string"
}

Response 200:
{
    "success": true,
    "data": {
        "accessToken": "string",
        "refreshToken": "string"
    }
}
```

#### 4. 获取当前用户信息
```http
GET /api/auth/me
Authorization: Bearer <token>

Response 200:
{
    "success": true,
    "data": {
        "id": "string",
        "username": "string",
        "fullName": "string",
        "email": "string",
        "avatar": "string",
        "roles": ["string"],
        "phone": "string"
    }
}
```

### 2.2 用户管理接口

#### 5. 获取用户列表
```http
GET /api/users?page=1&pageSize=10&keyword=admin
Authorization: Bearer <token>

Query Parameters:
- page: number (可选，默认1)
- pageSize: number (可选，默认10)
- keyword: string (可选，搜索关键词)

Response 200:
{
    "success": true,
    "data": {
        "items": [
            {
                "id": "string",
                "username": "string",
                "fullName": "string",
                "email": "string",
                "avatar": "string",
                "roles": ["string"],
                "isActive": true,
                "createdAt": "2024-01-01T00:00:00Z"
            }
        ],
        "total": 100,
        "page": 1,
        "pageSize": 10,
        "totalPages": 10
    }
}
```

#### 6. 获取用户详情
```http
GET /api/users/:id
Authorization: Bearer <token>

Response 200:
{
    "success": true,
    "data": {
        "id": "string",
        "username": "string",
        "fullName": "string",
        "email": "string",
        "phone": "string",
        "avatar": "string",
        "roles": ["string"],
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
    }
}
```

### 2.3 宠物管理接口

#### 7. 获取宠物列表
```http
GET /api/pets?page=1&pageSize=10&type=dog&userId=1
Authorization: Bearer <token>

Query Parameters:
- page: number (可选)
- pageSize: number (可选)
- type: string (可选，pet/dog/cat/rabbit/fish/other)
- userId: string (可选，筛选特定用户的宠物)
- keyword: string (可选，搜索宠物名称或品种)

Response 200:
{
    "success": true,
    "data": {
        "items": [
            {
                "id": "string",
                "userId": "string",
                "name": "string",
                "breed": "string",
                "type": "string",
                "gender": "male|female",
                "birthDate": "2020-01-01",
                "avatar": "string",
                "size": "small|medium|large",
                "weight": 10.5,
                "height": 50,
                "furColor": "string",
                "description": "string",
                "status": "healthy|sick|recovering",
                "specialDiseases": "string",
                "allergies": "string",
                "lastCheckupDate": "2024-01-01",
                "createdAt": "2024-01-01T00:00:00Z"
            }
        ],
        "total": 50,
        "page": 1,
        "pageSize": 10
    }
}
```

#### 8. 获取宠物详情
```http
GET /api/pets/:id
Authorization: Bearer <token>

Response 200:
{
    "success": true,
    "data": {
        "id": "string",
        "userId": "string",
        "name": "string",
        "breed": "string",
        "type": "string",
        "gender": "male|female",
        "birthDate": "2020-01-01",
        "avatar": "string",
        "size": "small|medium|large",
        "weight": 10.5,
        "height": 50,
        "furColor": "string",
        "description": "string",
        "status": "healthy|sick|recovering",
        "specialDiseases": "string",
        "allergies": "string",
        "lastCheckupDate": "2024-01-01",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
    }
}
```

#### 9. 创建宠物
```http
POST /api/pets
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
    "name": "string",
    "breed": "string",
    "type": "string",
    "gender": "male|female",
    "birthDate": "2020-01-01",
    "avatar": "string",
    "size": "small|medium|large",
    "weight": 10.5,
    "height": 50,
    "furColor": "string",
    "description": "string",
    "status": "healthy",
    "specialDiseases": "string",
    "allergies": "string"
}

Response 201:
{
    "success": true,
    "data": {
        "id": "string",
        // ... 完整的宠物信息
    },
    "message": "创建成功"
}
```

#### 10. 更新宠物信息
```http
PUT /api/pets/:id
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
    "name": "string",
    "breed": "string",
    // ... 需要更新的字段
}

Response 200:
{
    "success": true,
    "data": {
        // 更新后的宠物信息
    },
    "message": "更新成功"
}
```

#### 11. 删除宠物
```http
DELETE /api/pets/:id
Authorization: Bearer <token>

Response 200:
{
    "success": true,
    "message": "删除成功"
}
```

### 2.4 疫苗记录接口

#### 12. 获取疫苗记录列表
```http
GET /api/vaccine-records?petId=1&page=1&pageSize=10
Authorization: Bearer <token>

Query Parameters:
- petId: string (可选，筛选特定宠物的记录)
- page: number (可选)
- pageSize: number (可选)

Response 200:
{
    "success": true,
    "data": {
        "items": [
            {
                "id": "string",
                "petId": "string",
                "name": "string",
                "date": "2024-01-01",
                "nextDate": "2024-07-01",
                "notes": "string",
                "createdAt": "2024-01-01T00:00:00Z"
            }
        ],
        "total": 20,
        "page": 1,
        "pageSize": 10
    }
}
```

#### 13. 创建疫苗记录
```http
POST /api/vaccine-records
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
    "petId": "string",
    "name": "string",
    "date": "2024-01-01",
    "nextDate": "2024-07-01",
    "notes": "string"
}

Response 201:
{
    "success": true,
    "data": {
        "id": "string",
        // ... 完整的疫苗记录信息
    },
    "message": "创建成功"
}
```

### 2.5 服务记录接口

#### 14. 获取服务记录列表
```http
GET /api/service-records?petId=1&page=1&pageSize=10
Authorization: Bearer <token>

Query Parameters:
- petId: string (可选)
- status: string (可选，completed|pending|in_progress)
- page: number (可选)
- pageSize: number (可选)

Response 200:
{
    "success": true,
    "data": {
        "items": [
            {
                "id": "string",
                "petId": "string",
                "serviceName": "string",
                "date": "2024-01-01",
                "price": 100.00,
                "status": "completed|pending|in_progress",
                "notes": "string",
                "createdAt": "2024-01-01T00:00:00Z"
            }
        ],
        "total": 30,
        "page": 1,
        "pageSize": 10
    }
}
```

### 2.6 订单管理接口

#### 15. 获取订单列表
```http
GET /api/orders?page=1&pageSize=10&status=pending&orderNumber=ORDER0001
Authorization: Bearer <token>

Query Parameters:
- page: number (可选)
- pageSize: number (可选)
- status: string (可选，pending|completed|cancelled)
- orderNumber: string (可选，订单号搜索)
- startDate: string (可选，开始日期)
- endDate: string (可选，结束日期)
- userId: string (可选，筛选特定用户的订单)

Response 200:
{
    "success": true,
    "data": {
        "items": [
            {
                "id": "string",
                "orderNumber": "ORDER0001",
                "userId": "string",
                "customerName": "string",
                "customerPhone": "string",
                "customerAvatar": "string",
                "petId": "string",
                "petName": "string",
                "petType": "string",
                "petImage": "string",
                "serviceName": "string",
                "servicePrice": 100.00,
                "quantity": 1,
                "totalAmount": 100.00,
                "orderTime": "2024-01-01T00:00:00Z",
                "scheduledTime": "2024-01-15T10:00:00Z",
                "status": "pending|completed|cancelled",
                "notes": "string",
                "createdAt": "2024-01-01T00:00:00Z"
            }
        ],
        "total": 100,
        "page": 1,
        "pageSize": 10
    }
}
```

#### 16. 获取订单详情
```http
GET /api/orders/:id
Authorization: Bearer <token>

Response 200:
{
    "success": true,
    "data": {
        // 完整的订单信息
    }
}
```

#### 17. 创建订单
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
    "petId": "string",
    "serviceName": "string",
    "servicePrice": 100.00,
    "quantity": 1,
    "scheduledTime": "2024-01-15T10:00:00Z",
    "notes": "string"
}

Response 201:
{
    "success": true,
    "data": {
        "id": "string",
        "orderNumber": "ORDER0001",
        // ... 完整的订单信息
    },
    "message": "订单创建成功"
}
```

#### 18. 更新订单状态
```http
PUT /api/orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
    "status": "completed|cancelled"
}

Response 200:
{
    "success": true,
    "data": {
        // 更新后的订单信息
    },
    "message": "订单状态更新成功"
}
```

### 2.7 聊天相关接口

#### 19. 获取聊天会话列表
```http
GET /api/chat/sessions?page=1&pageSize=20
Authorization: Bearer <token>

Query Parameters:
- page: number (可选)
- pageSize: number (可选)
- petId: string (可选，筛选特定宠物的会话)

Response 200:
{
    "success": true,
    "data": {
        "items": [
            {
                "id": "string",
                "userId": "string",
                "petId": "string",
                "title": "string",
                "messageCount": 10,
                "createdAt": "2024-01-01T00:00:00Z",
                "updatedAt": "2024-01-01T00:00:00Z"
            }
        ],
        "total": 50,
        "page": 1,
        "pageSize": 20
    }
}
```

#### 20. 创建聊天会话
```http
POST /api/chat/sessions
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
    "petId": "string",  // 可选
    "title": "string"   // 可选，不提供则自动生成
}

Response 201:
{
    "success": true,
    "data": {
        "id": "string",
        "userId": "string",
        "petId": "string",
        "title": "string",
        "messageCount": 0,
        "createdAt": "2024-01-01T00:00:00Z"
    },
    "message": "会话创建成功"
}
```

#### 21. 获取会话消息
```http
GET /api/chat/sessions/:id/messages?page=1&pageSize=50
Authorization: Bearer <token>

Query Parameters:
- page: number (可选)
- pageSize: number (可选)

Response 200:
{
    "success": true,
    "data": {
        "items": [
            {
                "id": "string",
                "sessionId": "string",
                "role": "user|assistant|system",
                "content": "string",
                "timestamp": "2024-01-01T00:00:00Z",
                "model": "string",
                "createdAt": "2024-01-01T00:00:00Z"
            }
        ],
        "total": 100,
        "page": 1,
        "pageSize": 50
    }
}
```

#### 22. 发送消息（流式响应）
```http
POST /api/chat/messages
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
    "sessionId": "string",
    "content": "string",
    "model": "deepseek-chat"  // 可选
}

Response 200 (Stream):
data: {"content": "部分", "done": false}
data: {"content": "内容", "done": false}
data: {"content": "", "done": true}

或者标准 JSON 响应:
{
    "success": true,
    "data": {
        "id": "string",
        "sessionId": "string",
        "role": "assistant",
        "content": "完整的AI回复内容",
        "timestamp": "2024-01-01T00:00:00Z",
        "model": "deepseek-chat"
    }
}
```

#### 23. 删除聊天会话
```http
DELETE /api/chat/sessions/:id
Authorization: Bearer <token>

Response 200:
{
    "success": true,
    "message": "删除成功"
}
```

## 三、错误码说明

### HTTP 状态码
- `200 OK`: 请求成功
- `201 Created`: 创建成功
- `400 Bad Request`: 请求参数错误
- `401 Unauthorized`: 未授权，需要登录
- `403 Forbidden`: 禁止访问，权限不足
- `404 Not Found`: 资源不存在
- `500 Internal Server Error`: 服务器内部错误

### 业务错误码（可选）
如果后端使用自定义错误码，建议格式：
```json
{
    "success": false,
    "error": "ERROR_CODE",
    "message": "错误描述",
    "details": {}
}
```

## 四、接口测试示例

### 使用 curl 测试

#### 1. 登录测试
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "123456"
  }'
```

#### 2. 获取宠物列表（需要 Token）
```bash
curl -X GET http://localhost:8080/api/pets \
  -H "Authorization: Bearer <your-token>"
```

### 使用 Postman 测试

1. 创建环境变量：
   - `base_url`: `http://localhost:8080`
   - `token`: (登录后获取)

2. 设置 Collection 变量：
   - 在 Collection 的 Pre-request Script 中自动设置 Token

3. 测试流程：
   - 先调用登录接口获取 Token
   - 将 Token 保存到环境变量
   - 使用 Token 测试其他接口

## 五、接口联调检查表

### 基础功能
- [ ] 登录接口正常
- [ ] Token 刷新机制正常
- [ ] 权限验证正常

### 宠物管理
- [ ] 获取宠物列表
- [ ] 获取宠物详情
- [ ] 创建宠物
- [ ] 更新宠物信息
- [ ] 删除宠物

### 订单管理
- [ ] 获取订单列表（支持筛选）
- [ ] 获取订单详情
- [ ] 创建订单
- [ ] 更新订单状态

### 记录管理
- [ ] 疫苗记录 CRUD
- [ ] 服务记录 CRUD

### 聊天功能
- [ ] 创建会话
- [ ] 获取会话列表
- [ ] 发送消息（流式响应）
- [ ] 获取消息历史

## 六、注意事项

1. **时间格式**: 统一使用 ISO 8601 格式 (`2024-01-01T00:00:00Z`)
2. **分页**: 页码从 1 开始，不是 0
3. **Token 过期**: 前端需要实现自动刷新机制
4. **流式响应**: 聊天接口可能需要特殊处理，使用 SSE 或 WebSocket
5. **文件上传**: 如果涉及文件上传，使用 `multipart/form-data` 格式

