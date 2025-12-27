import React, { Suspense } from 'react';
import './APP.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Header from './components/Header/Header';
import { AuthProvider, useAuthContext } from './auth/AuthContext';

//懒加载页面组件
const OrderDetailPage = React.lazy(() => import('./pages/orderdetail/orderdetail'));
const OrderEditPage = React.lazy(() => import('./pages/Order/edit/editdetail'));
const AboutPage = React.lazy(() => import('./pages/About/AboutPage'));
const CareersPage = React.lazy(() => import('./pages/Careers/CareersPage'));
const ContactPage = React.lazy(() => import('./pages/Contact/Contact'));
const NewsroomPage = React.lazy(() => import('./pages/Newsroom/Newsroom'));
const DashboardPage = React.lazy(() => import('./pages/Admin/DashboardPage'));
const LoginPage = React.lazy(() => import('./components/Login/Login'));
const RecordPage = React.lazy(() => import('./pages/Record/Record'));
const PetDetail = React.lazy(() => import('./pages/petDetail/petdetail'));
// 宠物类型子页面路由懒加载
const DogRecord = React.lazy(() => import('./pages/Record/Dog/DogRecord'));
const CatRecord = React.lazy(() => import('./pages/Record/Cat/CatRecord'));
const RabbitRecord = React.lazy(() => import('./pages/Record/Rabbit/RabbitRecord'));
const FishRecord = React.lazy(() => import('./pages/Record/Fish/FishRecord'));
const OtherRecord = React.lazy(() => import('./pages/Record/Others/OtherRecord'));
const ServicesPage = React.lazy(() => import('./pages/Services/Services'));
const VaccinationRecordsPage = React.lazy(() => import('./pages/VaccinationRecords/VaccinationRecords'));
const BoardingRecordsPage = React.lazy(() => import('./pages/ BoardingRecords/ BoardingRecordsPage'));
const OrderPage = React.lazy(() => import('./pages/Order/OrderPage'));
const SettingPage = React.lazy(() => import('./pages/Setting/Setting'));
// AI对话和账单分析页面
const AIChatPage = React.lazy(() => import('./pages/AIChat/AIChatPage'));
const BillAnalysisPage = React.lazy(() => import('./pages/BillAnalysis/BillAnalysisPage'));
// 认证保护路由组件
const ProtectedRoute: React.FC<{ element: React.ReactNode; requiredRole?: string }> = ({
  element,
  requiredRole
}) => {
  const { isAuthenticated, user, isLoading } = useAuthContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 如果需要特定角色，检查用户角色
  if (requiredRole && (!user || !user.roles || !user.roles.includes(requiredRole))) {
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container" style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div className="main-content" style={{
            flex: 1,
            overflow: 'auto',
            padding: 0,
            width: '100%'
          }}>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/about" element={<AboutPage />} />
                <Route path="/newsroom" element={<NewsroomPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/contact" element={<ContactPage />} />
                {/* 登录页面路由 */}
                <Route path="/login" element={<LoginPage />} />
                {/* Admin页面路由，需要认证和admin角色 */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute element={<DashboardPage />} requiredRole="admin" />
                  }
                />
                {/* Dashboard页面路由，需要认证和admin角色 */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute element={<DashboardPage />} requiredRole="admin" />
                  }
                />
                {/* 宠物档案页面路由 */}
                <Route
                  path="/record"
                  element={
                    <RecordPage />
                  }
                />
                {/* 宠物类型子页面路由 */}
                <Route
                  path="/record/dog"
                  element={
                    <ProtectedRoute element={<DogRecord />} requiredRole="admin" />
                  }
                />
                <Route
                  path="/record/cat"
                  element={
                    <ProtectedRoute element={<CatRecord />} requiredRole="admin" />
                  }
                />
                <Route
                  path="/record/rabbit"
                  element={
                    <ProtectedRoute element={<RabbitRecord />} requiredRole="admin" />
                  }
                />
                <Route
                  path="/record/fish"
                  element={
                    <ProtectedRoute element={<FishRecord />} requiredRole="admin" />
                  }
                />
                <Route
                  path="/record/other"
                  element={
                    <ProtectedRoute element={<OtherRecord />} requiredRole="admin" />
                  }
                />
                {/* 服务页面路由 */}
                <Route
                  path="/services"
                  element={
                    <ProtectedRoute element={<ServicesPage />} requiredRole="admin" />
                  }
                />
                {/* 疫苗接种记录页面路由 */}
                <Route
                  path="/vaccination-records"
                  element={
                    <ProtectedRoute element={<VaccinationRecordsPage />} requiredRole="admin" />
                  }
                />
                {/* 寄养记录页面路由 */}
                <Route
                  path="/boarding-records"
                  element={
                    <ProtectedRoute element={<BoardingRecordsPage />} requiredRole="admin" />
                  }
                />
                {/* 订单页面路由 */}
                <Route
                  path="/order"
                  element={
                    <ProtectedRoute element={<OrderPage />} requiredRole="admin" />
                  }
                />
                {/* 订单编辑页路由（放在详情路由前，避免匹配歧义） */}
                <Route
                  path="/order/:orderId/edit"
                  element={
                    <ProtectedRoute element={<OrderEditPage />} requiredRole="admin" />
                  }
                />
                {/* 订单详情页路由（与 OrderPage 中的 /order/:orderId 跳转保持一致） */}
                <Route
                  path="/order/:orderId"
                  element={
                    <ProtectedRoute element={<OrderDetailPage />} requiredRole="admin" />
                  }
                />
                {/* 兼容别名路由 */}
                <Route
                  path="/orderdetail/:orderId"
                  element={
                    <ProtectedRoute element={<OrderDetailPage />} requiredRole="admin" />
                  }
                />
                {/* 宠物详情页路由 */}
                <Route path="/petdetail/:id" element={<PetDetail />} />
                <Route path="/petDetail/:id" element={<PetDetail />} />
                {/* 设置页面路由 */}
                <Route
                  path="/setting"
                  element={
                    <ProtectedRoute element={<SettingPage />} requiredRole="admin" />
                  }
                />

                {/* AI对话页面路由 */}
                <Route
                  path="/ai-chat"
                  element={
                    <ProtectedRoute element={<AIChatPage />} requiredRole="admin" />
                  }
                />

                {/* 账单分析页面路由 */}
                <Route
                  path="/bill-analysis"
                  element={
                    <ProtectedRoute element={<BillAnalysisPage />} requiredRole="admin" />
                  }
                />

                {/* 默认路由重定向到 about */}
                <Route path="/" element={<Navigate to="/about" replace />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}
export default App;