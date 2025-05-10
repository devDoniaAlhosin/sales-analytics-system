import React from 'react';
import { Outlet } from 'react-router-dom';
import '../../Styles/pages/Dashboard.scss';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Outlet />
    </div>
  );
};

export default Dashboard; 