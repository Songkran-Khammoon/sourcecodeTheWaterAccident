import React, { useState, useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const { id } = useParams();
  const { newsid } = useParams();
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    // desktop
    <nav className="navbar navbar-expand-lg navbar-dark navbar-shadow fixed-top">
      <div className="container">
        <Link className="navbar-brand fs-4" to="/"><img src={process.env.REACT_APP_PATH + `img/logo.png`} width={60} height={60} alt="" /></Link>
        <ul className="navbar-nav justify-content-center align-items-center fs-5 flex-grow-1 pe-3 d-none d-lg-inline-flex">
          <li className="nav-item">
            <Link to="/" className={`nav-link ${(location.pathname === `/`) ? 'active' : ''}`} >หน้าหลัก</Link>
          </li>
          <li className="nav-item">
            <Link to="/Location" className={`nav-link ${(location.pathname === `/Location`) || (location.pathname === `/Location/${id}`) ? 'active' : ''}`}>พื้นที่เสี่ยง</Link>
          </li>
          <li className="nav-item">
            <Link to="/Location_map" className={`nav-link ${(location.pathname === `/Location_map`) ? 'active' : ''}`} >แผนที่</Link>
          </li>
          <li className="nav-item">
            <Link to="/Prevent" className={`nav-link ${(location.pathname === `/Prevent`) ? 'active' : ''}`} >การป้องกัน</Link>
          </li>
          <li className="nav-item">
            <Link to="/News" className={`nav-link ${(location.pathname === `/News`) || (location.pathname === `/News/${newsid}`) ? 'active' : ''}`} >ข่าวสาร</Link>
          </li>
          <li className="nav-item">
            <Link to="/SOS" className={`nav-link ${(location.pathname === `/SOS`) ? 'active' : ''}`} >ขอความช่วยเหลือ</Link>
          </li>
        </ul>
        {/* overlay */}
        <div className={`overlay ${showSidebar ? 'show' : ''}`} onClick={toggleSidebar}></div>
        {/* mobile */}
        <button className="navbar-toggler shadow-none border-0" type="button" onClick={toggleSidebar}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`sidebar ${showSidebar ? 'show' : ''} d-block d-lg-none`}>
          <div className='d-flex justify-content-end'>
            <button type="button" className="btn-close btn-close-white shadow-none fs-3 mb-3" onClick={toggleSidebar}></button>
          </div>
          <div className='d-flex justify-content-center'>
            <ul className="navbar-nav fs-3 d-inline-flex d-lg-none">
              <li className="nav-item">
                <Link to="/" className={`nav-link ${(location.pathname === `/`) ? 'active' : ''}`} ><i class="fa-solid fa-house me-2"></i>หน้าหลัก</Link>
              </li>
              <li className="nav-item">
                <Link to="/Location" className={`nav-link ${(location.pathname === `/Location`) || (location.pathname === `/Location/${id}`) ? 'active' : ''}`}><i class="fa-solid fa-location-dot me-2"></i>พื้นที่เสี่ยง</Link>
              </li>
              <li className="nav-item">
                <Link to="/Location_map" className={`nav-link ${(location.pathname === `/Location_map`) ? 'active' : ''}`} ><i class="fa-solid fa-map-location-dot me-2"></i>แผนที่</Link>
              </li>
              <li className="nav-item">
                <Link to="/Prevent" className={`nav-link ${(location.pathname === `/Prevent`) ? 'active' : ''}`} ><i class="fa-solid fa-life-ring me-2"></i>การป้องกัน</Link>
              </li>
              <li className="nav-item">
                <Link to="/News" className={`nav-link ${(location.pathname === `/News`) || (location.pathname === `/News/${newsid}`) ? 'active' : ''}`} ><i class="fa-regular fa-newspaper me-2"></i>ข่าวสาร</Link>
              </li>
              <li className="nav-item">
                <Link to="/SOS" className={`nav-link ${(location.pathname === `/SOS`) ? 'active' : ''}`} ><i class="fa-solid fa-truck-medical me-2"></i>ขอความช่วยเหลือ</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>


  )
}
