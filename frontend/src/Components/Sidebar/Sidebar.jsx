import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import '../../Styles/components/Sidebar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartLine, faShoppingCart, faLightbulb, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </button>
      
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={closeSidebar} />
      
      <div className={`sidebar ${isOpen ? 'active' : ''}`}>
        <h2 className="sidebar-title">ANALYSIS</h2>
        <Nav className="flex-column">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <FontAwesomeIcon icon={faHome} /> Dashboard
          </Link>
          <Link
            to="/analytics"
            className={`nav-link ${location.pathname === '/analytics' ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <FontAwesomeIcon icon={faChartLine} /> Analytics
          </Link>
          <Link
            to="/orders"
            className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <FontAwesomeIcon icon={faShoppingCart} /> Orders
          </Link>
          <Link
            to="/recommendations"
            className={`nav-link ${location.pathname === '/recommendations' ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <FontAwesomeIcon icon={faLightbulb} /> Recommendations
          </Link>
        </Nav>
      </div>
    </>
  );
}

export default Sidebar;
