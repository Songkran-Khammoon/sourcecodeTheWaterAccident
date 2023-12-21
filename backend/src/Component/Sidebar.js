import React from 'react'
import { Link, useLocation, useParams } from 'react-router-dom';

export default function Navbar() {
    // ขอpath
    const location = useLocation();
    const { id } = useParams();

    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 vh-100 ">
            <Link to="/" className="d-flex align-items-center text-decoration-none text-dark text-center">
                <div className="fs-4">Admin</div>
            </Link>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <Link className={`nav-link ${(location.pathname === `/dashboard`) ? 'active' : 'text-dark'} `} to='/dashboard'>
                        ภาพรวม
                    </Link>
                </li>
                <li>
                    <Link className={`nav-link ${(location.pathname === `/location`) || (location.pathname === `/location/${id}`) || (location.pathname === `/location/new`) ? 'active' : 'text-dark'} `} to='/location'>
                        สถานที่
                    </Link>
                </li>
                <li>
                    <Link className={`nav-link ${(location.pathname === `/news`) || (location.pathname === `/news/${id}`) || (location.pathname === `/news/new`) ? 'active' : 'text-dark'} `} to='/news'>
                        ข่าวสาร
                    </Link>
                </li>
                <li>
                    <Link className={`nav-link ${(location.pathname === `/typenews`) || (location.pathname === `/typenews/${id}`) || (location.pathname === `/typenews/new`) ? 'active' : 'text-dark'} `} to='/typenews'>
                        ประเภทข่าวสาร
                    </Link>
                </li>
                <li>
                    <Link className={`nav-link ${(location.pathname === `/prevent`) || (location.pathname === `/prevent/new`)  ? 'active' : 'text-dark'} `} to='/prevent'>
                        การป้องกัน
                    </Link>
                </li>
                <li>
                    <Link className={`nav-link ${(location.pathname === `/call`) || (location.pathname === `/call/new`)  ? 'active' : 'text-dark'} `} to='/call'>
                        ขอความช่วยเหลือ
                    </Link>
                </li>
                <li>
                </li>
            </ul>
        </div>

    )
}
