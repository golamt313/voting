import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ isAdmin, isSuperAdmin }) => {
  const [activeMenu, setActiveMenu] = useState('');

  // Function to handle clicks on menu items that have sub-menus
  const handleMenuClick = (menuName) => {
    setActiveMenu(activeMenu === menuName ? '' : menuName); // Toggle active menu
  };

  const isAnyAdmin = isAdmin || isSuperAdmin;

  return (
    <div className="sidebar">
      <ul>
        <li><NavLink to="/">Home</NavLink></li>
        {isSuperAdmin && (
          // This item is directly navigable, so it uses NavLink without onClick
          <li>
            <NavLink to="/usermanagement">User Management</NavLink>
          </li>
        )}
        {isAnyAdmin && (
          // This item has sub-items, so it uses a click handler to toggle visibility
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
