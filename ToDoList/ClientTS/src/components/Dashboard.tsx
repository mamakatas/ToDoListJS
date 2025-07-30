import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserTasks } from '../store/slices/taskSlice';
import { checkAuthStatus } from '../store/slices/authSlice';
import { CheckCircle, Clock, Circle, Plus } from 'lucide-react';
import type { RootState, AppDispatch } from '../store';
import { setFilters } from '../store/slices/taskSlice';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserTasks({}));
    } else {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, isAuthenticated]);

  const stats = {
    total: tasks.length,
    completed: tasks.filter((task: any) => task.status === 3).length,
    inProgress: tasks.filter((task: any) => task.status === 2).length,
    notStarted: tasks.filter((task: any) => task.status === 1).length
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  // Helper to handle box click
  const handleBoxClick = (status: string) => {
    dispatch(setFilters({ status }));
    navigate('/tasks');
  };

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
          <div
            style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              transition: 'box-shadow 0.2s',
            }}
            onClick={() => handleBoxClick('all')}
            title="View all tasks"
          >
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
              {stats.total}
            </div>
            <div style={{ color: '#666' }}>Total Tasks</div>
          </div>
          <div
            style={{
              padding: '20px',
              backgroundColor: '#d4edda',
              borderRadius: '8px',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              transition: 'box-shadow 0.2s',
            }}
            onClick={() => handleBoxClick('completed')}
            title="View completed tasks"
          >
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#155724', marginBottom: '8px' }}>
              {stats.completed}
            </div>
            <div style={{ color: '#155724' }}>Completed</div>
          </div>
          <div
            style={{
              padding: '20px',
              backgroundColor: '#cce5ff',
              borderRadius: '8px',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              transition: 'box-shadow 0.2s',
            }}
            onClick={() => handleBoxClick('in-progress')}
            title="View in progress tasks"
          >
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#004085', marginBottom: '8px' }}>
              {stats.inProgress}
            </div>
            <div style={{ color: '#004085' }}>In Progress</div>
          </div>
          <div
            style={{
              padding: '20px',
              backgroundColor: '#fff3cd',
              borderRadius: '8px',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              transition: 'box-shadow 0.2s',
            }}
            onClick={() => handleBoxClick('not-started')}
            title="View not started tasks"
          >
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
      {/* Quick Actions section removed */}
    </div>
  );
};

export default Dashboard; 