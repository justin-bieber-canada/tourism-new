import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Forgot from './components/pages/Forgot';
// Admin
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminUsers from './components/admin/AdminUsers';
import AdminSites from './components/admin/AdminSites';
import AdminRequests from './components/admin/AdminRequests';
import AdminPayments from './components/admin/AdminPayments';
import AdminReports from './components/admin/AdminReports';
import AdminRoute from './components/admin/AdminRoute';
// Visitor
import VisitorDashboard from './components/visitor/VisitorDashboard';
import ExploreSites from './components/visitor/ExploreSites';
import SiteDetails from './components/visitor/SiteDetails';
import RequestGuide from './components/visitor/RequestGuide';
import VisitorPayments from './components/visitor/VisitorPayments';
import VisitorHistory from './components/visitor/VisitorHistory';
import VisitorProfile from './components/visitor/VisitorProfile';
import VisitorRoute from './components/visitor/VisitorRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/sites" element={<AdminRoute><AdminSites /></AdminRoute>} />
          <Route path="/admin/requests" element={<AdminRoute><AdminRequests /></AdminRoute>} />
          <Route path="/admin/payments" element={<AdminRoute><AdminPayments /></AdminRoute>} />
          <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />

          {/* Visitor routes */}
          <Route path="/visitor/dashboard" element={<VisitorRoute><VisitorDashboard /></VisitorRoute>} />
          <Route path="/visitor/sites" element={<VisitorRoute><ExploreSites /></VisitorRoute>} />
          <Route path="/visitor/sites/:id" element={<VisitorRoute><SiteDetails /></VisitorRoute>} />
          <Route path="/visitor/request-guide/:siteId" element={<VisitorRoute><RequestGuide /></VisitorRoute>} />
          <Route path="/visitor/payments" element={<VisitorRoute><VisitorPayments /></VisitorRoute>} />
          <Route path="/visitor/history" element={<VisitorRoute><VisitorHistory /></VisitorRoute>} />
          <Route path="/visitor/profile" element={<VisitorRoute><VisitorProfile /></VisitorRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;