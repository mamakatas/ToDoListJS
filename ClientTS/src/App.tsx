import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import PrivateRoute from './components/PrivateRoute';
import AllTasks from './components/AllTasks';
import Sidebar from './components/Sidebar';
import { useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Check if current route is a public route (login/register)
  const isPublicRoute = location.pathname === '/login' || location.pathname === '/register';
  
  if (isPublicRoute) {
    return (
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="App" style={{ display: 'flex' }}>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div style={{ flex: 1, marginLeft: sidebarOpen ? 220 : 0, transition: 'margin-left 0.2s' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <TaskList />
              </PrivateRoute>
            }
          />
          <Route
            path="/all-tasks"
            element={
              <PrivateRoute>
                <AllTasks />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
};

export default App;
