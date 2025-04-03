import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User } from 'lucide-react';
import { logoutUser } from '../../redux/actions/authActions';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  const handleLogout = () => {
    dispatch(logoutUser(navigate));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserDropdownOpen && !event.target.closest('.user-dropdown-container')) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserDropdownOpen]);

  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">
          <img src="/src/assets/images/userly-logo.png" alt="Company Logo" />
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          <div className={`bar ${isMenuOpen ? 'active' : ''}`}></div>
          <div className={`bar ${isMenuOpen ? 'active' : ''}`}></div>
          <div className={`bar ${isMenuOpen ? 'active' : ''}`}></div>
        </div>
        <div className={`nav-items ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
          <div className="auth-buttons">
            {isAuthenticated && user ? (
              <div className="user-dropdown-container">
                <div className="user-icon-wrapper" onClick={toggleUserDropdown}>
                  <User className="h-8 w-8 text-white cursor-pointer" />
                  <span className="text-white ml-2">{user.name || 'User'}</span>
                </div>
                {isUserDropdownOpen && (
                  <div className="user-dropdown">
                    <div className="dropdown-item" onClick={() => navigate('/profile')}>Profile</div>
                    <div className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button className="login-btn" onClick={() => navigate('/login')}>
                  Login
                </button>
                <button className="signup-btn" onClick={() => navigate('/signUp')}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      <div className="hero-section">
        <div className="hero-content">
          <h1>
            Welcome {isAuthenticated && user ? user.name : 'to User Management System'}
          </h1>
          <h2>Powerful tools to organize, track, and optimize user experiences</h2>
        </div>
      </div>
    </header>
  );
};

export default Header;