import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { fetchAllTasks, clearError, setFilters } from '../store/slices/taskSlice';
import { CheckCircle, Clock, Circle } from 'lucide-react';
import TaskDetail from './TaskDetail';

const AllTasks = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error, filters } = useSelector((state) => state.tasks);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    dispatch(fetchAllTasks());
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 1: return <Circle size={16} />;
      case 2: return <Clock size={16} />;
      case 3: return <CheckCircle size={16} />;
      default: return <Circle size={16} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 1: return 'status-not-started';
      case 2: return 'status-in-progress';
      case 3: return 'status-completed';
      default: return 'status-not-started';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1: return "Haven't Started";
      case 2: return 'In Progress';
      case 3: return 'Completed';
      default: return 'Unknown';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.status === 'all') return true;
    if (filters.status === 'not-started') return task.status === 1;
    if (filters.status === 'in-progress') return task.status === 2;
    if (filters.status === 'completed') return task.status === 3;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (filters.sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'createdAt': return new Date(b.createdAt) - new Date(a.createdAt);
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      case 'status': return a.status - b.status;
      default: return 0;
    }
  });

  if (loading) {
    return <div className="loading">Loading all tasks...</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <h2>All Tasks (Admin View)</h2>
        {error && (
          <div className="alert alert-error">
            {typeof error === 'string' ? error : error.title || error.message || JSON.stringify(error)}
          </div>
        )}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div>
            <label className="form-label">Filter:</label>
            <select
              className="form-input"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">All Tasks</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="form-label">Sort by:</label>
            <select
              className="form-input"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="createdAt">Date Created</option>
              <option value="name">Name</option>
              <option value="dueDate">Due Date</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
        {sortedTasks.length === 0 ? (
          <div className="empty-state">
            <h3>No tasks found</h3>
            <p>No tasks available for any user.</p>
          </div>
        ) : (
          <div>
            {sortedTasks.map((task) => (
              <div key={task.id} className="task-item">
                <div className="task-header">
                  <h3 className="task-title">{task.name}</h3>
                  <span className={`task-status ${getStatusClass(task.status)}`}>
                    {getStatusIcon(task.status)} {getStatusText(task.status)}
                  </span>
                </div>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                <div className="task-meta">
                  <span>User: {task.userId || 'Unknown'}</span>
                  <span>Created: {format(new Date(task.createdAt), 'MMM dd, yyyy')}</span>
                  {task.dueDate && (
                    <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                  )}
                  {task.completedAt && (
                    <span>Completed: {format(new Date(task.completedAt), 'MMM dd, yyyy')}</span>
                  )}
                </div>
                <div className="task-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedTask(task)}
                  >
                    View Details & Messages
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onUpdate={() => {}}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};

export default AllTasks; 