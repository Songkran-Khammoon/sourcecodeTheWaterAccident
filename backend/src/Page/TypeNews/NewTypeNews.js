import React from 'react'
import axios from "axios";
import Swal from 'sweetalert2';
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { checkTokenAndRedirect } from '../../Component/authUtils'; // Update the import path
import Sidebar from "../../Component/Sidebar"
import Navbar from "../../Component/Navbar"

export default function NewTypeNews() {
  const navigate = useNavigate();

  const [typenews, settypenews] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    checkTokenAndRedirect(navigate);
  }, []);


  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    settypenews(values => ({ ...values, [name]: value }));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    var formData = new FormData();
    formData.append('typeNewsName', typenews.typeNewsName);

    try {
      const response = await axios.post(
        process.env.REACT_APP_API+`news.php/${id}/?xCase=6`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(response.data);
      navigate('/typenews');
      Swal.fire({
        icon: 'success',
        title: 'บันทึกเสร็จสิ้น',
        showConfirmButton: false,
        timer: 2000
      })
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
          <div className='card-header row'>
            <div className="col-4 my-auto">
            </div>
            <div className="col-4">
              <h3 className="text-center fw-bold text-center topHeader">เพิ่มข้อมูลประเภทข่าว</h3>
            </div>
            <div className="col-4 d-flex justify-content-end align-items-center form-check form-switch form-check-reverse text-warning">

            </div>
          </div>
          <div className='card-body'>
            <form id="formAccountSettings" onSubmit={handleSubmit}>
              <div className='row'>
                <div className="mb-3">
                  <label htmlFor="typeNewsName" className="form-label">ประเภทข่าว :</label>
                  <input type="text" id="typeNewsName" name='typeNewsName' value={typenews.typeNewsName} onChange={handleChange} className="form-control" required />
                </div>
                <div className="col-12 text-center p-3">
                  <button type="submit" className="btn btn-success button-size">บันทึก</button>
                  <Link className="btn btn-danger button-size" to='/typenews'>ยกเลิก</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  )
}