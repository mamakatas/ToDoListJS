import React, { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import { format } from 'date-fns';
import { X, Send, Edit } from 'lucide-react';
import TaskForm from './TaskForm';
import { useSelector } from 'react-redux';

const TaskDetail = ({ task, onUpdate, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user && user.role === 'Admin';
  const [responseInputs, setResponseInputs] = useState({});
  const [responseLoading, setResponseLoading] = useState({});
  const [responseError, setResponseError] = useState({});

  useEffect(() => {
    fetchMessages();
  }, [task.id]);

  const fetchMessages = async () => {
    try {
      const response = await tasksAPI.getMessagesForTask(task.id);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setLoading(true);
      await tasksAPI.addMessageToTask(task.id, newMessage.trim());
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      setError('Failed to send message');
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (messageId, value) => {
    setResponseInputs((prev) => ({ ...prev, [messageId]: value }));
  };

  const handleSendResponse = async (messageId) => {
    const responseText = responseInputs[messageId];
    if (!responseText || !responseText.trim()) return;
    setResponseLoading((prev) => ({ ...prev, [messageId]: true }));
    setResponseError((prev) => ({ ...prev, [messageId]: null }));
    try {
      await tasksAPI.respondToMessage(messageId, { response: responseText.trim() });
      setResponseInputs((prev) => ({ ...prev, [messageId]: '' }));
      fetchMessages();
    } catch (err) {
      setResponseError((prev) => ({ ...prev, [messageId]: 'Failed to send response' }));
    } finally {
      setResponseLoading((prev) => ({ ...prev, [messageId]: false }));
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

  if (showEditForm) {
    return (
      <TaskForm
        task={task}
        onSubmit={onUpdate}
        onCancel={() => setShowEditForm(false)}
      />
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">Task Details</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, color: '#333' }}>{task.name}</h2>
            <button
              className="btn btn-primary"
              onClick={() => setShowEditForm(true)}
            >
              <Edit size={16} style={{ marginRight: '4px' }} />
              Edit
            </button>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <span className={`task-status ${getStatusClass(task.status)}`}>
              {getStatusText(task.status)}
            </span>
          </div>

          {task.description && (
            <p style={{ color: '#666', marginBottom: '16px' }}>
              {task.description}
            </p>
          )}

          <div style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>
            <div>Created: {format(new Date(task.createdAt), 'MMM dd, yyyy HH:mm')}</div>
            {task.dueDate && (
              <div>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</div>
            )}
            {task.completedAt && (
              <div>Completed: {format(new Date(task.completedAt), 'MMM dd, yyyy HH:mm')}</div>
            )}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <h4 style={{ marginBottom: '16px', color: '#333' }}>Messages</h4>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '16px' }}>
            {messages.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', fontStyle: 'italic' }}>
                No messages yet. Start the conversation!
              </p>
            ) : (
              <div>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '12px',
                      marginBottom: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      borderLeft: '4px solid #667eea'
                    }}
                  >
                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>
                      {message.userName} • {message.createdAt && !isNaN(new Date(message.createdAt)) 
                        ? format(new Date(message.createdAt), 'MMM dd, yyyy HH:mm') 
                        : 'Unknown date'}
                    </div>
                    <div style={{ color: '#333', marginBottom: '8px' }}>
                      {message.content}
                    </div>
                    {message.response ? (
                      <div style={{ color: '#155724', background: '#d4edda', borderRadius: '4px', padding: '8px', marginTop: '8px' }}>
                        <strong>Admin Response:</strong> {message.response}
                      </div>
                    ) : (
                      isAdmin && (
                        <div style={{ marginTop: '8px' }}>
                          <input
                            type="text"
                            className="form-input"
                            value={responseInputs[message.id] || ''}
                            onChange={(e) => handleResponseChange(message.id, e.target.value)}
                            placeholder="Type your response..."
                            disabled={responseLoading[message.id]}
                            style={{ width: '70%', marginRight: '8px' }}
                          />
                          <button
                            className="btn btn-success"
                            onClick={() => handleSendResponse(message.id)}
                            disabled={responseLoading[message.id] || !(responseInputs[message.id] && responseInputs[message.id].trim())}
                          >
                            {responseLoading[message.id] ? 'Sending...' : 'Send Response'}
                          </button>
                          {responseError[message.id] && (
                            <div style={{ color: 'red', marginTop: '4px' }}>{responseError[message.id]}</div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-input"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                style={{ flex: 1 }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !newMessage.trim()}
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail; 