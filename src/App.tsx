import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Header from './components/Header/Header';

//懒加载页面组件
const AboutPage = React.lazy(() => import('./pages/About/AboutPage'));
const CareersPage = React.lazy(() => import('./pages/Careers/CareersPage'));
const ContactPage = React.lazy(() => import('./pages/Contact/Contact'));
const NewsroomPage = React.lazy(() => import('./pages/Newsroom/Newsroom'));

function App(){
    return (
      <Router>
        <Header />
        <div className="main-content" style={{ padding: '20px' }}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/about" element={<AboutPage />} />
              <Route path="/newsroom" element={<NewsroomPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    )
}
export default App;