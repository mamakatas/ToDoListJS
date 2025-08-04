import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

type SidebarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) return null;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          top: 20,
          left: open ? 230 : 10,
          zIndex: 1001,
          background: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          padding: '8px',
          cursor: 'pointer',
          transition: 'left 0.2s',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label={open ? 'Close sidebar' : 'Open sidebar'}
      >
        <div
          style={{
            width: '20px',
            height: '16px',
            position: 'relative',
            transform: 'rotate(0deg)',
            transition: '.25s ease-in-out',
          }}
        >
          <span
            style={{
              display: 'block',
              position: 'absolute',
              height: '2px',
              width: '100%',
              background: '#fff',
              borderRadius: '2px',
              opacity: 1,
              left: 0,
              transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
              top: open ? '7px' : '0px',
              transition: '.25s ease-in-out',
            }}
          />
          <span
            style={{
              display: 'block',
              position: 'absolute',
              height: '2px',
              width: '100%',
              background: '#fff',
              borderRadius: '2px',
              opacity: open ? 0 : 1,
              left: 0,
              top: '7px',
              transition: '.25s ease-in-out',
            }}
          />
          <span
            style={{
              display: 'block',
              position: 'absolute',
              height: '2px',
              width: '100%',
              background: '#fff',
              borderRadius: '2px',
              opacity: 1,
              left: 0,
              transform: open ? 'rotate(-45deg)' : 'rotate(0deg)',
              top: open ? '7px' : '14px',
              transition: '.25s ease-in-out',
            }}
          />
        </div>
      </button>
      <aside
        className="sidebar"
        style={{
          width: open ? 220 : 0,
          background: '#f8f9fa',
          padding: open ? 24 : 0,
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          overflow: 'hidden',
          transition: 'width 0.2s, padding 0.2s',
          zIndex: 1000,
        }}
      >
        {open && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: 16 }}>
              <span style={{ color: '#333', fontWeight: 600 }}>
                {user?.username || 'User'}
              </span>
            </li>
            <li style={{ marginBottom: 12 }}>
              <Link to="/dashboard" style={{ textDecoration: 'none', color: '#007bff' }}>Dashboard</Link>
            </li>
            <li style={{ marginBottom: 12 }}>
              <Link to="/tasks" style={{ textDecoration: 'none', color: '#007bff' }}>My Tasks</Link>
            </li>
            {user && user.username === 'admin' && (
              <li style={{ marginBottom: 12 }}>
                <Link to="/all-tasks" style={{ textDecoration: 'none', color: '#007bff' }}>All Tasks</Link>
              </li>
            )}
          </ul>
        )}
      </aside>
    </>
  );
};

export default Sidebar; 