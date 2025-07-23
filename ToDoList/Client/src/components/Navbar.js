import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../store/slices/authSlice';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            ToDoList App
          </Link>

          <ul className="navbar-nav">
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/tasks" className="nav-link">
                    My Tasks
                  </Link>
                </li>
                {(user && user.username === 'admin') && (
                  <li>
                    <Link to="/all-tasks" className="nav-link">
                      All Tasks
                    </Link>
                  </li>
                )}
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={16} />
                  <span style={{ color: '#666' }}>
                    {user?.username || 'User'}
                  </span>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#666',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="nav-link">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 