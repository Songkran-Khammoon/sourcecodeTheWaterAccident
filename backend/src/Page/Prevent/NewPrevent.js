import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { checkTokenAndRedirect } from '../../Component/authUtils'; // Update the import path
import Swal from 'sweetalert2'
import Sidebar from "../../Component/Sidebar"
import Navbar from "../../Component/Navbar"

export default function NewPrevent() {
  const navigate = useNavigate();
  useEffect(() => {
    checkTokenAndRedirect(navigate);
  }, []);
  
  const [File1, setFile1] = useState([]);
  const [PreviewFile1, setPreviewFile1] = useState([]);

  // useEffect(() => {
  // }, []);

  const imgChange1 = (event) => {
    const files = event.target.files;
    setFile1(files);

    // Generate image previews for selected files
    const previews = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        previews.push(event.target.result);
        if (previews.length === files.length) {
          setPreviewFile1(previews);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // sweetalert2
  const showAlert = () => {
    Swal.fire({
      icon: 'success',
      title: 'บันทึกเสร็จสิ้น',
      showConfirmButton: false,
      timer: 2000
    })
  };

  // submit
  const handleSubmit = (event) => {
    event.preventDefault();
    var formData = new FormData();
    for (const image of File1) {
      formData.append('img1[]', image);
    }

    axios.post(process.env.REACT_APP_API + `prevent.php/?xCase=1`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(function (response) {
      console.log(response.data);
      navigate('/prevent');
      showAlert();
    });
  }

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
              <h3 className="text-center fw-bold text-center topHeader">เพิ่มข้อมูลการป้องกัน</h3>
            </div>
            <div className="col-4 d-flex justify-content-end">

            </div>
          </div>
          <div className='card-body'>
            <form id="formAccountSettings" onSubmit={handleSubmit}>
              <div className='row'>
                <div className="mb-3">
                  <label htmlFor="prevent_img" className="form-label">รูป :</label>
                  <input className="form-control" type="file" name="prevent_img" id="prevent_img" onChange={imgChange1} multiple />
                  {File1 == '' ? '' : <div className='text-center mt-2'><img src={File1} alt=""  style={{ width: 500 }} /></div>}
                  {PreviewFile1.map((preview, index) => (
                    <img key={index} src={preview} alt={`Preview ${index + 1}`} className='mx-2 my-2 object-fit-cover' style={{ width: "150px" , height: "150px"}} />
                  ))}
                </div>
                <div className="col-12 text-center p-3">
                  <button type="submit" className="btn btn-success button-size">บันทึก</button>
                  <Link className="btn btn-danger button-size" to='/prevent'>ยกเลิก</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
