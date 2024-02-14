// Sidebar.js
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css'; // Assuming you have this for styling

const Sidebar = ({ isSuperAdmin }) => {
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMenuClick = (menuName) => {
    // If the clicked menu is already active, deactivate it. Otherwise, activate the clicked menu.
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  return (
    <div className="sidebar">
      <ul>
        <li><NavLink to="/">Home</NavLink></li>
        {isSuperAdmin && (
          <>
            <li onClick={() => handleMenuClick('userManagement')}>User Management</li>
            {activeMenu === 'userManagement' && (
              <ul>
                <li><NavLink to="/usermanagement">Manage Users</NavLink></li>
              </ul>
            )}
          </>
        )}
        <li onClick={() => handleMenuClick('elections')}>Elections</li>
        {activeMenu === 'elections' && (
          <ul>
            <li><NavLink to="/elections/manage">Manage Elections</NavLink></li>
            <li><NavLink to="/elections/settings">Election Settings</NavLink></li>
          </ul>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
