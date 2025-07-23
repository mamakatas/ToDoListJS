import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserTasks } from '../store/slices/taskSlice';
import { checkAuthStatus } from '../store/slices/authSlice';
import { CheckCircle, Clock, Circle, Plus } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { tasks, loading } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserTasks());
    } else {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, isAuthenticated]);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 3).length,
    inProgress: tasks.filter(task => task.status === 2).length,
    notStarted: tasks.filter(task => task.status === 1).length
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Welcome back, {user?.username || 'User'}!</h2>
        <p style={{ color: '#666', marginBottom: '32px' }}>
          Here's an overview of your tasks
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          marginBottom: '32px' 
        }}>
          <div style={{
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
              {stats.total}
            </div>
            <div style={{ color: '#666' }}>Total Tasks</div>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: '#d4edda',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#155724', marginBottom: '8px' }}>
              {stats.completed}
            </div>
            <div style={{ color: '#155724' }}>Completed</div>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: '#cce5ff',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#004085', marginBottom: '8px' }}>
              {stats.inProgress}
            </div>
            <div style={{ color: '#004085' }}>In Progress</div>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: '#fff3cd',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#856404', marginBottom: '8px' }}>
              {stats.notStarted}
            </div>
            <div style={{ color: '#856404' }}>Not Started</div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/tasks" className="btn btn-primary">
            <Plus size={16} style={{ marginRight: '8px' }} />
            Manage Tasks
          </Link>
        </div>
      </div>

      <div className="card">
        <h3>Quick Actions</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '16px' 
        }}>
          <Link 
            to="/tasks" 
            style={{
              padding: '16px',
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#333',
              display: 'block',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f8f9fa';
              e.target.style.borderColor = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = '#e9ecef';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Circle size={24} color="#667eea" />
              <div>
                <div style={{ fontWeight: '600' }}>View All Tasks</div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  See and manage all your tasks
                </div>
              </div>
            </div>
          </Link>

          <Link 
            to="/tasks" 
            style={{
              padding: '16px',
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#333',
              display: 'block',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f8f9fa';
              e.target.style.borderColor = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = '#e9ecef';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Plus size={24} color="#667eea" />
              <div>
                <div style={{ fontWeight: '600' }}>Create New Task</div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  Add a new task to your list
                </div>
              </div>
            </div>
          </Link>

          <Link 
            to="/tasks" 
            style={{
              padding: '16px',
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#333',
              display: 'block',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f8f9fa';
              e.target.style.borderColor = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = '#e9ecef';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Clock size={24} color="#667eea" />
              <div>
                <div style={{ fontWeight: '600' }}>In Progress Tasks</div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  View tasks currently in progress
                </div>
              </div>
            </div>
          </Link>

          <Link 
            to="/tasks" 
            style={{
              padding: '16px',
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#333',
              display: 'block',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f8f9fa';
              e.target.style.borderColor = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = '#e9ecef';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle size={24} color="#667eea" />
              <div>
                <div style={{ fontWeight: '600' }}>Completed Tasks</div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  Review your completed work
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 