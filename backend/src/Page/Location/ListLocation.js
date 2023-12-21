import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import DataTable, { createTheme } from 'react-data-table-component';
import { checkTokenAndRedirect } from '../../Component/authUtils'; // Update the import path
import Swal from 'sweetalert2'
import Sidebar from "../../Component/Sidebar"
import Navbar from "../../Component/Navbar"

export default function ListLocation() {
  const [locations, setlocations] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getLocation();
    checkTokenAndRedirect(navigate);
  }, []);


  const getLocation = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API+`location.php?xCase=0`
      );
      setlocations(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deletelocation = (id) => {
    var formData = new FormData();
    formData.append('id', id);
    formData.append('equipPlaceID', locations.equipPlaceID);
    formData.append('howtoUseID', locations.howtoUseID);
    axios
      .post(process.env.REACT_APP_API+`location.php?xCase=3`, formData)
      .then(function (response) {
        console.log(response.data);
        getLocation();
      });
  };

  // sweetalert2
  function showAlertDelete(id) {
    Swal.fire({
      title: 'ยืนยันที่จะลบ?',
      text: "ถ้าลบไปแล้วข้อมูลไม่สามารถนำกลับคืนมาได้!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        deletelocation(id)
        Swal.fire({
          icon: 'success',
          title: 'ลบข้อมูลสำเร็จ',
          text: "คุณได้ทำการยืนยันลบข้อมูลเรียบร้อยแล้ว!",
          showConfirmButton: false,
          timer: 1500
        }
        )
      }
    })
  }


  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  //Search
  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;

    // ตรวจสอบว่า Datas ถูกกำหนดค่าและไม่ว่าง
    if (locations && locations.length > 0) {
      const filteredResults = locations.filter((Data_) =>
        (Data_.namelocation || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Data_.typeriskName || '').toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSearchTerm(searchTerm);
      setSearchResults(filteredResults);
    } else {
      // จัดการกรณีที่ Datas เป็น undefined หรือว่าง
      setSearchTerm(searchTerm);
      setSearchResults(locations); // ใช้ Datas เมื่อไม่มีคำค้นหา
    }
  };

  // titleData
  const columns = [
    {
      name: 'รูป',
      selector: (row) => (
        <img src={process.env.REACT_APP_API+`${row.img}`} className='object-fit-cover rounded my-2' alt="" style={{ width: 100, height: 100 }} />
      ),
    },
    {
      name: 'พื้นที่',
      selector: row => row.namelocation,
    },
    {
      name: 'ความเสี่ยง',
      selector: row => row.typeriskName,
    },
    {
      name: '',
      cell: (row) => (
        <div>
          <Link className="btn btn-sm btn-primary mx-2 px-3" to={`${row.id}`}>ดูรายละเอียด</Link>
          <button className="btn btn-sm btn-danger mx-2 px-3" onClick={() => showAlertDelete(row.id)}>ลบ</button>
        </div>

      )
    },
  ];
  const customStyles = {
    headCells: {
      style: {
        fontWeight: 1000,
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    cells: {
      style: {
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
  },
  };
  createTheme('solarized', {
    text: {
      primary: '#268bd2',
      secondary: '#2aa198',
    },
    background: {
      default: '#002b36',
    },
    context: {
      background: '#cb4b16',
      text: '#FFFFFF',
    },
    divider: {
      default: '#073642',
    },
    action: {
      button: 'rgba(0,0,0,.54)',
      hover: 'rgba(0,0,0,.08)',
      disabled: 'rgba(0,0,0,.12)',
    },
  }, );

  return (
    <div className="row">
      <div className="col-2">
        <Sidebar />
      </div>

      {/* Body */}
      <div className="col-10 px-md-4 py-4">
        <Navbar />
        <div className='card container-xxl flex-grow-1 container-p-y'>
          <div className='card-header row'>
            <div className="col-4 my-auto">
              <Link className="btn btn-sm btn-primary px-3" to='new'>เพื่มข้อมูล</Link>
            </div>
            <div className="col-4 my-auto">
              <h3 className="text-center fw-bold text-center topHeader">สถานที่</h3>
            </div>
            <div className="col-4 my-auto d-flex align-items-center justify-content-end">
            <input type="text" className="form-control" value={searchTerm} onChange={handleSearchChange} placeholder="ค้นหา..." />
            </div>
          </div>
          <div className='card-body'>
            <DataTable
              columns={columns}
              data={searchTerm ? searchResults : locations}
              pagination
              paginationPerPage={5}
              sortable
              customStyles={customStyles}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
