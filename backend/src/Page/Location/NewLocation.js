import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { checkTokenAndRedirect } from '../../Component/authUtils'; // Update the import path
import Swal from 'sweetalert2'
import Sidebar from "../../Component/Sidebar"
import Navbar from "../../Component/Navbar"

export default function NewLocation() {
  const navigate = useNavigate();

  const [locations, setlocations] = useState([]);
  const [risks, setrisks] = useState([]);
  const [File1, setFile1] = useState([]);
  const [File2, setFile2] = useState([]);
  const [PreviewFile2, setPreviewFile2] = useState([]);
  const [File3, setFile3] = useState([]);
  const [PreviewFile3, setPreviewFile3] = useState([]);

  useEffect(() => {
    getRisk();
    checkTokenAndRedirect(navigate);
  }, []);
  const getRisk = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API + `location.php?xCase=4`
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
  const imgChange1 = (event) => {
    setFile1(URL.createObjectURL(event.target.files[0]));
  }
  const imgChange2 = (event) => {
    const files = event.target.files;
    setFile2(files);

    // Generate image previews for selected files
    const previews = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        previews.push(event.target.result);
        if (previews.length === files.length) {
          setPreviewFile2(previews);
        }
      };
      reader.readAsDataURL(file);
    }
  }
  const imgChange3 = (event) => {
    const files = event.target.files;
    setFile3(files);

    // Generate image previews for selected files
    const previews = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        previews.push(event.target.result);
        if (previews.length === files.length) {
          setPreviewFile3(previews);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    var formData = new FormData();
    var imagefile1 = document.querySelector('#img');
    formData.append("img1", imagefile1.files[0]);
    formData.append('namelocation', locations.namelocation);
    formData.append('locationLat', locations.locationLat);
    formData.append('locationLng', locations.locationLng);
    formData.append('typeriskID', locations.typeriskID);
    for (const image of File2) {
      formData.append('img2[]', image);
    }
    formData.append('equipLat', locations.equipLat);
    formData.append('equipLng', locations.equipLng);
    formData.append('practiceArea', locations.practiceArea);
    formData.append('preventArea', locations.preventArea);
    for (const image of File3) {
      formData.append('img3[]', image);
    }

    try {
      const response = await axios.post(
        process.env.REACT_APP_API + `location.php/?xCase=1`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(response.data);
      navigate('/location');
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
              <h3 className="text-center fw-bold text-center topHeader">เพิ่มข้อมูลสถานที่</h3>
            </div>
            <div className="col-4 d-flex justify-content-end">

            </div>
          </div>
          <div className='card-body'>
            <form id="formAccountSettings" onSubmit={handleSubmit}>
              <div className='row'>
                <div className="mb-3">
                  <label htmlFor="img" className="form-label">รูปหน้าปก :</label>
                  <input className="form-control" type="file" name="img" id="img" onChange={imgChange1} />
                  {File1 == '' ? '' : <img src={File1} alt="" className='w-25 my-3' />}
                </div>
                <div className="mb-3">
                  <label htmlFor="namelocation" className="form-label">พื้นที่ :</label>
                  <input type="text" id="namelocation" name='namelocation' onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-3">พิกัดพื้นที่ </div>
                <div className="mb-3 col-6">
                  <label htmlFor="locationLat" className="form-label">พิกัดจุดวางอุปกรณ์ (ละติจูด) :</label>
                  <input type="number" id="locationLat" name='locationLat' onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-3 col-6">
                  <label htmlFor="locationLng" className="form-label">พิกัดจุดวางอุปกรณ์ (ลองจิจูด) :</label>
                  <input type="number" id="locationLng" name='locationLng' onChange={handleChange} className="form-control" required />
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
                <div className="mb-3">
                  <label htmlFor="FileequipPlace" className="form-label">จุดวางอุปกรณ์ :</label>
                  <input className="form-control" type="file" name="FileequipPlace" id="FileequipPlace" onChange={imgChange2} multiple />
                  {/* {File2 == '' ? '' :<img src={File2} alt="" className='w-25 my-3' />} */}
                  <div className="my-3">
                    {PreviewFile2.map((preview, index) => (
                      <img key={index} src={preview} alt={`Preview ${index + 1}`} className='mx-2 my-2 object-fit-cover' style={{ width: "150px", height: "150px" }} />
                    ))}
                  </div>
                </div>
                <div className="mb-3 col-6">
                  <label htmlFor="equipLat" className="form-label">พิกัดจุดวางอุปกรณ์ (ละติจูด) :</label>
                  <input type="number" id="equipLat" name='equipLat' onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-3 col-6">
                  <label htmlFor="equipLng" className="form-label">พิกัดจุดวางอุปกรณ์ (ลองจิจูด) :</label>
                  <input type="number" id="equipLng" name='equipLng' onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="practiceArea" className="form-label">การปฏิบัติตัวภายในพื้นที่ :</label>
                  <input type="text" id="practiceArea" name='practiceArea' onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="preventArea" className="form-label">การป้องกันในพื้นที่ :</label>
                  <input type="text" id="preventArea" name='preventArea' onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="FilehowtoUse" className="form-label">วิธีการใช้อุปกรณ์ :</label>
                  <input className="form-control" type="file" name="FilehowtoUse" id="FilehowtoUse" onChange={imgChange3} multiple />
                  <div className="my-3">
                    {File3 == '' ? '' : <img src={File3} alt="" className='w-25 my-3' />}
                    {/* {File2 == '' ? '' :<img src={File2} alt="" className='w-25 my-3' />} */}
                    {PreviewFile3.map((preview, index) => (
                      <img key={index} src={preview} alt={`Preview ${index + 1}`} className='mx-2 my-2 object-fit-cover' style={{ width: "150px", height: "150px" }} />
                    ))}
                  </div>

                </div>
                <div className="col-12 text-center p-3">
                  <button type="submit" className="btn btn-success button-size">บันทึก</button>
                  <Link className="btn btn-danger button-size" to='/location'>ยกเลิก</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
