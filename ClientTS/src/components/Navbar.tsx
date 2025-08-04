import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../store/slices/authSlice';
import { LogOut, User } from 'lucide-react';
import type { RootState, AppDispatch } from '../store';

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

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
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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