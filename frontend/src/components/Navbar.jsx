import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { authenticated, user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            KinQuest
          </Link>

          {authenticated && (
            <ul className="navbar-nav">
              <li>
                <Link 
                  to="/profile" 
                  className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                >
                  Profile
                </Link>
              </li>
              {user?.profileCompleted && (
                <li>
                  <Link 
                    to="/suggestions" 
                    className={`nav-link ${isActive('/suggestions') ? 'active' : ''}`}
                  >
                    Events
                  </Link>
                </li>
              )}
              <li>
                <span style={{ color: 'var(--text-secondary)', marginRight: '1rem' }}>
                  {user?.name}
                </span>
              </li>
              <li>
                <button 
                  onClick={logout}
                  className="btn btn-outline"
                  style={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem' }}
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
