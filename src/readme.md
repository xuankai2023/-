问题根源分析
你的原始代码有 三个核心问题，导致登录后既不跳转也不关闭模态框：

问题 1：模态框 visible 硬编码为 true
// 原始 Login.tsx
<Modal visible={true} ...>  // ❌ 永远显示，无法隐藏
后果：即使调用 onClose() 关闭父组件的状态，模态框仍然显示。
问题 2：状态不同步（最致命的问题）
// Header.tsx 中的 useAuth
const { isAuthenticated, user } = useAuth();  // 局部状态实例

// ProtectedRoute 中的 useAuth
const { isAuthenticated, user } = useAuth();  // 另一个局部状态实例
后果：

Login 中登录成功，设置了 isAuthenticated = true
但 ProtectedRoute 中的 useAuth 是完全独立的实例
ProtectedRoute 读到的 isAuthenticated 仍是 false
路由保护拦截你，重定向回 /login，陷入循环

问题 3：组件渲染逻辑分离
我的解决方案
1️⃣ 创建全局 AuthContext ✨
为什么：
// 新建 src/auth/AuthContext.tsx
export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // 所有组件共享同一个状态实例
  return <AuthContext.Provider>{children}</AuthContext.Provider>;
};
✅ 所有使用 useAuthContext() 的组件读的是同一份状态
✅ Login 登录成功 → 更新 isAuthenticated
✅ ProtectedRoute 立即读到最新状态，允许进入 /admin
✅ 避免状态不同步的问题
2️⃣ 修改 Login.tsx 接收 visible prop
interface LoginProps {
  visible?: boolean;      // ✨ 新增
  onClose?: () => void;
}

const Login: React.FC<LoginProps> = ({ visible = true, onClose }) => {
  // ...
  <Modal visible={visible} ...>  // ✅ 动态控制，不再硬编码
  为什么：

✅ 模态框显示/隐藏完全由父组件控制
✅ 父组件改变 showLoginModal 状态 → visible 自动同步
✅ 登录成功调用 onClose() → 关闭模态框
3️⃣ 修改 Header.tsx 传递正确的 props
const [showLoginModal, setShowLoginModal] = useState(false);

const closeLoginModal = () => {
  setShowLoginModal(false);  // ✅ 更新父组件状态
};

const [showLoginModal, setShowLoginModal] = useState(false);

const closeLoginModal = () => {
  setShowLoginModal(false);  // ✅ 更新父组件状态
};
const [showLoginModal, setShowLoginModal] = useState(false);

const closeLoginModal = () => {
  setShowLoginModal(false);  // ✅ 更新父组件状态
};
为什么：

✅ 父组件完全控制子组件的显示/隐藏
✅ onClose 被调用时，showLoginModal 变为 false
✅ React 重新渲染，Login 组件从 DOM 中移除
4️⃣ 修改 App.tsx 用 AuthProvider 包装
function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/admin" element={<ProtectedRoute ... />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
为什么：

✅ 在 Router 的外层包装 AuthProvider
✅ 所有路由组件都能访问全局认证状态
✅ ProtectedRoute 现在用 useAuthContext() 读取全局状态
5️⃣ 修改 ProtectedRoute 使用 useAuthContext
const ProtectedRoute = ({ element, requiredRole }) => {
  const { isAuthenticated, user } = useAuthContext();  // ✅ 全局状态
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return element;
};
{showLoginModal && <Login visible={showLoginModal} onClose={closeLoginModal} />}
//验证功能的 bug 修改技巧
用户在 Header 点击"登录" →
  ↓
setShowLoginModal(true) →
  ↓
<Login visible={true} onClose={closeLoginModal} />  显示模态框 →
  ↓
用户输入账号密码，点击"登录" →
  ↓
login() 调用 → authApiService.login() → 返回成功 →
  ↓
setIsAuthenticated(true)  [在 AuthContext 中更新全局状态] →
  ↓
onClose() 被调用 → setShowLoginModal(false) →
  ↓
<Modal visible={false} /> → 模态框关闭 →
  ↓
navigate('/admin', { replace: true }) →
  ↓
ProtectedRoute 检查：
  - useAuthContext() 读到 isAuthenticated = true ✅
  - user.roles.includes('admin') ✅
  - 允许进入 <AdminPage /> ✅// Header.tsx 中的 useAuth
const { isAuthenticated, user } = useAuth();  // 局部状态实例

// ProtectedRoute 中的 useAuth
const { isAuthenticated, user } = useAuth();  // 另一个局部状态实例