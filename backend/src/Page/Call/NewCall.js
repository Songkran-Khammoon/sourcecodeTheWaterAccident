import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { checkTokenAndRedirect } from '../../Component/authUtils'; // Update the import path
import Swal from 'sweetalert2'
import Sidebar from "../../Component/Sidebar"
import Navbar from "../../Component/Navbar"

export default function NewCall() {
  const navigate = useNavigate();

  const [locations, setlocations] = useState([]);
  const [risks, setrisks] = useState([]);


  useEffect(() => {
    getRisk(); 
    checkTokenAndRedirect(navigate);
  }, []);
  const getRisk = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API+`location.php?xCase=4`
      );
      setrisks(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setlocations(values => ({ ...values, [name]: value }));
  }

  // submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    var formData = new FormData();
    formData.append('callPhone', locations.callPhone);
    formData.append('callName', locations.callName);
    formData.append('typeriskID', locations.typeriskID);
    try {
      const response = await axios.post(
        'https://thewateraccident.000webhostapp.com/call.php/?xCase=1',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(response.data);
      navigate('/call');
      Swal.fire({
        icon: 'success',
        title: 'บันทึกเสร็จสิ้น',
        showConfirmButton: false,
        timer: 2000
      });
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการส่งฟอร์ม:', error);
      // Handle the error here (e.g., show an error message to the user)
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกข้อมูลได้',
        showConfirmButton: false,
        timer: 2000
      });
    }
  };

  return (
    <div className="row">
      <div className="col-2">
        <Sidebar />
      </div>
      {/* Body */}
      <div className="col-10 px-md-4 py-4">
        <Navbar />
        <div className='card container-xxl flex-grow-1 container-p-y'>
          <div className='card-header text-center row'>
            <div className="col-4">
            </div>
            <div className="col-4">
              <h3 className="text-center fw-bold text-center topHeader">เพิ่มข้อมูลขอความช่วยเหลือ</h3>
            </div>
            <div className="col-4 d-flex justify-content-end">
            </div>
          </div>
          <div className='card-body'>
            <form id="formAccountSettings" onSubmit={handleSubmit}>
              <div className='row'>
                <div className="mb-3">
                  <label htmlFor="callPhone" className="form-label">เบอร์โทร :</label>
                  <input type="text" id="callPhone" name='callPhone' onChange={handleChange} className="form-control" required/>
                </div>
                <div className="mb-3">
                  <label htmlFor="callName" className="form-label">ชื่อเบอร์โทร :</label>
                  <input type="text" id="callName" name='callName' onChange={handleChange} className="form-control" required/>
                </div>
                <div className="mb-3">
                  <label htmlFor="typeriskID" className="form-label">ความเสี่ยง :</label>
                  <select class="form-select" id="typeriskID" name='typeriskID' onChange={handleChange} required>
                  <option value="" hidden>เลือกประเภทความเสี่ยง</option>
                    {risks.map((risk, key) => (
                      <option key={risk.typeriskID} value={risk.typeriskID} >{risk.typeriskName}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 text-center p-3">
                  <button type="submit" className="btn btn-success button-size">บันทึก</button>
                  <Link className="btn btn-danger button-size" to='/call'>ยกเลิก</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
