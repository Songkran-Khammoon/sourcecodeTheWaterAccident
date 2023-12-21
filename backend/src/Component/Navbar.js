import React from 'react'
import { Link } from 'react-router-dom';

export default function Navbar() {
    const storedToken = sessionStorage.getItem('Token');
    const useToken = JSON.parse(storedToken);
    return (
        <nav aria-label="breadcrumb ">
            <ol className="breadcrumb d-flex">

                <li className='ms-auto'>
                    <div className="dropdown">
                        <a href="#" className="d-flex align-items-center text-black text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                            {/* <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2" /> */}
                            <strong>{useToken ? useToken.name : ''}</strong>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-white text-small shadow" aria-labelledby="dropdownUser1">
                            {/* <li><a className="dropdown-item" href="#">New project...</a></li>
                        <li><a className="dropdown-item" href="#">Settings</a></li> */}
                            {/* <li><a className="dropdown-item" href="#">Profile</a></li> */}
                            {/* <li><hr className="dropdown-divider" /></li> */}
                            <li><Link to={`/dashboard`} className="dropdown-item" onClick={() => { sessionStorage.removeItem('Token') }}>Logout</Link></li>
                        </ul>
                    </div>
                </li>
            </ol>

        </nav>
    )
}
