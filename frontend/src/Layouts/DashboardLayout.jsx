import React from 'react'
import '../Styles/layouts/DashboardLayout.scss';
import Sidebar from "../Components/Sidebar/Sidebar"
import Breadcrumbs from "../Components/Breadcrumbs/Breadcrumbs"
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="content-area">
        <div className="content-container">
          <div className="responsive-padding">
            <Breadcrumbs />
            <div className="grid-container">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
