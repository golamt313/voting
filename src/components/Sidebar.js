import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ isAdmin, isSuperAdmin }) => {
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMenuClick = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const isAnyAdmin = isAdmin || isSuperAdmin;

  return (
    <div className="sidebar">
      <ul>
        <li><NavLink to="/">Home</NavLink></li>
        {isSuperAdmin && (
          <li onClick={() => handleMenuClick('userManagement')}>
            User Management
            {activeMenu === 'userManagement' && (
              <ul>
                <li><NavLink to="/usermanagement">Manage Users</NavLink></li>
              </ul>
            )}
          </li>
        )}
        {isAnyAdmin && (
          <>
            <li onClick={() => handleMenuClick('elections')}>
              Elections
            </li>
            {activeMenu === 'elections' && (
              <ul>
                <li><NavLink to="/electionmanagement">Manage Elections</NavLink></li>
                <li><NavLink to="/electionsettings">Election Settings</NavLink></li>
              </ul>
            )}
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
