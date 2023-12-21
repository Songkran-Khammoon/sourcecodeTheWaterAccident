import React from 'react'
import axios from "axios";
import Swal from 'sweetalert2';
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { checkTokenAndRedirect } from '../../Component/authUtils'; // Update the import path
import Sidebar from "../../Component/Sidebar"
import Navbar from "../../Component/Navbar"
export default function DetailNews() {
  const [isChecked, setisChecked] = useState(true);
  const navigate = useNavigate();

  const [news, setnews] = useState([]);
  const [typenews, settypenews] = useState([]);
  const [File1, setFile1] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    checkTokenAndRedirect(navigate);
    getNews();
    getTypeNew();
  }, []);
  const getNews = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API+`news.php/${id}/?xCase=0`
      );
      setnews(response.data);
      // console.log(response.data.description)
    } catch (error) {
      console.error(error);
    }
  };
  const getTypeNew = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API+`news.php?xCase=4`
      );
      settypenews(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const editChange = (event) => {
    setisChecked(!isChecked);
  }
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setnews(values => ({ ...values, [name]: value }));
  }
  const imgChange1 = (event) => {
    setFile1(URL.createObjectURL(event.target.files[0]));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    var formData = new FormData();
    var imagefile1 = document.querySelector('#newsimg');
    formData.append('newsID', id);
    formData.append("img1", imagefile1.files[0]);
    formData.append('titleName', news.titleName);
    formData.append('typeNewsID', news.typeNewsID);
    formData.append('description', news.description);
  
    try {
      const response = await axios.post(
        process.env.REACT_APP_API+`news.php/${id}/?xCase=2`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(response.data);
      navigate('/news');
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
              <small className='opacity-50'>
                {news.updated_at === null ? `สร้างเมื่อ ${news.created_at}` : `อัพเดทล่าสุด ${news.updated_at}`}
              </small>
            </div>
            <div className="col-4">
              <h3 className="text-center fw-bold text-center topHeader">{isChecked ? 'ดูรายละเอียด' : 'แก้ไข'}ข่าว</h3>
            </div>
            <div className="col-4 d-flex justify-content-end align-items-center form-check form-switch form-check-reverse text-warning">
              <label className="form-check-label" htmlFor="flexSwitchCheckReverse">แก้ไขข้อมูล</label>
              <input className="form-check-input color-edit-checked" type="checkbox" role="switch" id="flexSwitchCheckReverse" onChange={editChange} />
              {/* <Link className="btn btn-outline-warning button-size" to='../Location'>แก้ไข</Link> */}
            </div>
          </div>
          <div className='card-body'>
            <form id="formAccountSettings" onSubmit={handleSubmit}>
              <div className='row'>
                <div className="mb-3">
                  <label htmlFor="newsimg" className="form-label">รูปหน้าปก :</label>
                  {isChecked ? '' : <input className="form-control" type="file" name="newsimg" id="newsimg" onChange={imgChange1} />}
                  <div><img src={File1 == '' ? process.env.REACT_APP_API+`${news.newsimg}` : File1} alt="" className='w-25 my-3' /></div>
                </div>
                <div className="mb-3">
                  <label htmlFor="titleName" className="form-label">หัวข้อ :</label>
                  <input type="text" id="titleName" name='titleName' value={news.titleName} onChange={handleChange} className="form-control" disabled={isChecked} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="typeNewsID" className="form-label">ประเภทข่าว :</label>
                  <select class="form-select" id="typeNewsID" name='typeNewsID' value={news ? news.typeNewsID : ''} onChange={handleChange} disabled={isChecked} required>
                    <option value="" hidden>เลือกประเภทข่าว</option>
                    {typenews.map((typenews, key) => (
                      <option key={typenews.typeNewsID} value={typenews.typeNewsID} >{typenews.typeNewsName}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3 ">
                  <label htmlFor="description" className="form-label">รายละเอียด :</label>
                  <textarea type="text" rows={10} id="description" name='description' value={news.description} onChange={handleChange} className="form-control" disabled={isChecked} required />
                </div>

                <div className="col-12 text-center p-3">
                  {isChecked ? '' : <button type="submit" class="btn btn-success button-size">บันทึก</button>}
                  <Link className="btn btn-secondary button-size" to='/news'>{isChecked ? 'กลับ' : 'ยกเลิก'}</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  )
}