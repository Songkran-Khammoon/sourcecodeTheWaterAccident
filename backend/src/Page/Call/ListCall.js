import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import DataTable, { createTheme } from 'react-data-table-component';
import { checkTokenAndRedirect } from '../../Component/authUtils'; // Update the import path
import Swal from 'sweetalert2'
import Sidebar from "../../Component/Sidebar"
import Navbar from "../../Component/Navbar"


export default function ListCall() {
    const [call, setcall] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        getCall();
        checkTokenAndRedirect(navigate);
    }, []);

    const getCall = async () => {
        try {
            const response = await axios.get(
                process.env.REACT_APP_API+`call.php?xCase=0`
            );
            setcall(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const deletePrevents = (id) => {
        axios.post(process.env.REACT_APP_API+`call.php/${id}/?xCase=3`).then(function (response) {
            console.log(response.data);
            getCall();
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
        deletePrevents(id)
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
    if (call && call.length > 0) {
      const filteredResults = call.filter((Data_) =>
        (Data_.callPhone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Data_.callName || '').toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSearchTerm(searchTerm);
      setSearchResults(filteredResults);
    } else {
      // จัดการกรณีที่ Datas เป็น undefined หรือว่าง
      setSearchTerm(searchTerm);
      setSearchResults(call); // ใช้ Datas เมื่อไม่มีคำค้นหา
    }
  };
  // titleData
  const columns = [
    {
      name: 'หัวข้อข่าว',
      selector: row => row.callPhone,
    },
    {
      name: 'ประเภทข่าว',
      selector: row => row.callName,
    },
    {
      name: 'ประเภทความเสี่ยง',
      selector: row => row.typeriskName,
    },
    {
      name: '',
      cell: (row) => (
        <div>
          <button className="btn btn-sm btn-danger mx-2 px-3" onClick={() => showAlertDelete(row.callID)}>ลบ</button>
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
  },);

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
              <Link className="btn btn-sm btn-primary px-3 " to='new'>เพื่มข้อมูล</Link>
            </div>
            <div className="col-4 my-auto">
              <h3 className="text-center fw-bold text-center topHeader">ขอความช่วยเหลือ</h3>
            </div>
            <div className="col-4 my-auto d-flex justify-content-end">
              <input type="text" className="form-control" value={searchTerm} onChange={handleSearchChange} placeholder="ค้นหา..." />
            </div>
          </div>
          <div className='card-body'>
            <DataTable
              columns={columns}
              data={searchTerm ? searchResults : call}
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
