import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, MessageSquare, CheckCircle, Circle, Clock } from 'lucide-react';
import { 
  fetchUserTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  updateTaskStatus,
  setSelectedTask,
  setFilters,
  clearError
} from '../store/slices/taskSlice';
import TaskForm from './TaskForm';
import TaskDetail from './TaskDetail';

const TaskList = () => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTaskLocal] = useState(null);
  
  const dispatch = useDispatch();
  const { tasks, loading, error, filters } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchUserTasks());
  }, [dispatch]);

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const handleCreateTask = async (taskData) => {
    try {
      await dispatch(createTask(taskData)).unwrap();
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      await dispatch(updateTask({ id, taskData })).unwrap();
      setSelectedTaskLocal(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(id)).unwrap();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await dispatch(updateTaskStatus({ id, status: newStatus })).unwrap();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleTaskSelect = (task) => {
    setSelectedTaskLocal(task);
    dispatch(setSelectedTask(task));
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 1: // NotStarted
        return <Circle size={16} />;
      case 2: // InProgress
        return <Clock size={16} />;
      case 3: // Completed
        return <CheckCircle size={16} />;
      default:
        return <Circle size={16} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 1:
        return 'status-not-started';
      case 2:
        return 'status-in-progress';
      case 3:
        return 'status-completed';
      default:
        return 'status-not-started';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Haven't Started";
      case 2:
        return 'In Progress';
      case 3:
        return 'Completed';
      default:
        return 'Unknown';
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
      case 'name':
        return a.name.localeCompare(b.name);
      case 'createdAt':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      case 'status':
        return a.status - b.status;
      default:
        return 0;
    }
  });

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>My Tasks</h2>
          <button
            className="btn btn-primary"
            onClick={() => setShowTaskForm(true)}
          >
            <Plus size={16} style={{ marginRight: '8px' }} />
            Add Task
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {typeof error === 'string'
              ? error
              : error.title || error.message || JSON.stringify(error)}
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
            <p>Create your first task to get started!</p>
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
                    onClick={() => handleTaskSelect(task)}
                  >
                    <MessageSquare size={16} style={{ marginRight: '4px' }} />
                    View Details
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={() => handleTaskSelect(task)}
                  >
                    <Edit size={16} style={{ marginRight: '4px' }} />
                    Edit
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Trash2 size={16} style={{ marginRight: '4px' }} />
                    Delete
                  </button>

                  {task.status !== 3 && (
                    <button
                      className="btn btn-success"
                      onClick={() => handleStatusChange(task.id, 3)}
                    >
                      <CheckCircle size={16} style={{ marginRight: '4px' }} />
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showTaskForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowTaskForm(false)}
        />
      )}

      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onUpdate={handleUpdateTask}
          onClose={() => setSelectedTaskLocal(null)}
        />
      )}
    </div>
  );
};

export default TaskList; 