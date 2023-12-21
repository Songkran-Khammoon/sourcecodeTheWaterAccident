import React from 'react'
import axios from "axios";
import Swal from 'sweetalert2';
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { checkTokenAndRedirect } from '../../Component/authUtils'; // Update the import path
import Sidebar from "../../Component/Sidebar"
import Navbar from "../../Component/Navbar"

export default function DetailLocation() {
  const [isChecked, setisChecked] = useState(true);
  const navigate = useNavigate();

  const [locations, setlocations] = useState([]);
  const [risks, setrisks] = useState([]);
  const [File1, setFile1] = useState([]);
  const [File2, setFile2] = useState([]);
  const [PreviewFile2, setPreviewFile2] = useState([]);
  const [File3, setFile3] = useState([]);
  const [PreviewFile3, setPreviewFile3] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    checkTokenAndRedirect(navigate);
    getLocation();
    getRisk();
  }, []);

  const getLocation = async () => {
    try {
      const response1 = await axios.get(
        process.env.REACT_APP_API + `location.php/${id}/?xCase=0`
      );
      const data1 = response1.data;
      setlocations(data1); // กำหนดค่าให้ Data
      console.log("dataLoca", data1);
      // img2
      const data2Array = []; // สร้างอาร์เรย์เปล่าเพื่อเก็บข้อมูลพฤติกรรมล่าสุด
      const response2 = await axios.get(
        process.env.REACT_APP_API + `location.php/${data1.equipPlaceID}/?xCase=6`
      );
      const responseData2 = response2.data;
      data2Array.push(responseData2);
      setPreviewFile2(data2Array); // เพิ่มข้อมูลทั้งหมดจาก data2Array ลงใน setPreviewFile2
      console.log("data2", data2Array);
      // img3
      const data3Array = []; // สร้างอาร์เรย์เปล่าเพื่อเก็บข้อมูลพฤติกรรมล่าสุด
      const response3 = await axios.get(
        process.env.REACT_APP_API + `location.php/${data1.equipPlaceID}/?xCase=7`
      );
      const responseData3 = response3.data;
      data3Array.push(responseData3);
      setPreviewFile3(data3Array); // เพิ่มข้อมูลทั้งหมดจาก data3Array ลงใน setPreviewFile3
      console.log("data3", data3Array);
    } catch (error) {
      console.error(error);
    }
  };


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

  const editChange = (event) => {
    setisChecked(!isChecked);
  }

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    var formData = new FormData();
    var imagefile1 = document.querySelector('#img');
    formData.append('id', id);
    formData.append("img1", imagefile1.files[0]);
    formData.append('namelocation', locations.namelocation);
    formData.append('locationLat', locations.locationLat);
    formData.append('locationLng', locations.locationLng);
    formData.append('typeriskID', locations.typeriskID);
    formData.append('equipPlaceID', locations.equipPlaceID);
    for (const image of File2) {
      formData.append('img2[]', image);
    }
    formData.append('equipLat', locations.equipLat);
    formData.append('equipLng', locations.equipLng);
    formData.append('practiceArea', locations.practiceArea);
    formData.append('preventArea', locations.preventArea);
    formData.append('howtoUseID', locations.howtoUseID);
    for (const image of File3) {
      formData.append('img3[]', image);
    }

    try {
      const response = await axios.post(
        process.env.REACT_APP_API+`location.php/${id}/?xCase=2`,
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
          <div className='card-header row'>
            <div className="col-4 my-auto">
              <small className='opacity-50'>
                {locations.updated_at === null ? `สร้างเมื่อ ${locations.created_at}` : `อัพเดทล่าสุด ${locations.updated_at}`}
              </small>
            </div>
            <div className="col-4">
              <h3 className="text-center fw-bold text-center topHeader">{isChecked ? 'ดูรายละเอียด' : 'แก้ไข'}สถานที่</h3>
            </div>
            <div className="col-4 d-flex justify-content-end align-items-center form-check form-switch form-check-reverse text-warning">
              <label className="form-check-label mx-2" htmlFor="flexSwitchCheckReverse">แก้ไขข้อมูล</label>
              <input className="form-check-input color-edit-checked" type="checkbox" role="switch" id="flexSwitchCheckReverse" onChange={editChange} />
              {/* <Link className="btn btn-outline-warning button-size" to='../Location'>แก้ไข</Link> */}
            </div>
          </div>
          <div className='card-body'>
            <form id="formAccountSettings" onSubmit={handleSubmit}>
              <div className='row'>
                <div className="mb-3">
                  <label htmlFor="img" className="form-label">รูปหน้าปก :</label>
                  {isChecked ? '' : <input className="form-control" type="file" name="img" id="img" onChange={imgChange1} />}
                  <div><img src={File1 == '' ? process.env.REACT_APP_API + `${locations.img}` : File1} alt="" className='w-25 my-2' /></div>
                </div>
                <div className="mb-3">
                  <label htmlFor="namelocation" className="form-label">พื้นที่ :</label>
                  <input type="text" id="namelocation" name='namelocation' value={locations.namelocation} onChange={handleChange} className="form-control" disabled={isChecked} required />
                </div>
                <div className="mb-3 col-6">
                  <label htmlFor="locationLat" className="form-label">พิกัดจุดวางอุปกรณ์ (ละติจูด) :</label>
                  <input type="number" id="locationLat" name='locationLat' value={locations.locationLat} onChange={handleChange} className="form-control" disabled={isChecked} required />
                </div>
                <div className="mb-3 col-6">
                  <label htmlFor="locationLng" className="form-label">พิกัดจุดวางอุปกรณ์ (ลองจิจูด) :</label>
                  <input type="number" id="locationLng" name='locationLng' value={locations.locationLng} onChange={handleChange} className="form-control" disabled={isChecked} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="typeriskID" className="form-label">ความเสี่ยง :</label>
                  {/* <input type="text" id="risk" name='risk' value={locations.riskName} onChange={handleChange} className="form-control" disabled={isChecked} /> */}
                  <select class="form-select" id="typeriskID" name='typeriskID' value={locations ? locations.typeriskID : ''} onChange={handleChange} disabled={isChecked} required>
                    <option value="" hidden>เลือกประเภทความเสี่ยง</option>
                    {risks.map((risk, key) => (
                      <option key={risk.typeriskID} value={risk.typeriskID} >{risk.typeriskName}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="FileequipPlace" className="form-label">จุดวางอุปกรณ์ :</label>
                  {isChecked ? '' : <input className="form-control" type="file" name="FileequipPlace" id="FileequipPlace" onChange={imgChange2} multiple />}
                  <div className="my-3">
                    {File2 == '' && PreviewFile2[0] ? (PreviewFile2[0].map((preview, index) => (
                      <img key={index} src={process.env.REACT_APP_API + preview.equipPlaceName} alt={`Preview ${index + 1}`} className='mx-2 my-4 object-fit-cover' style={{ width: "150px" , height: "150px"}} />
                    ))) :
                      (PreviewFile2.map((preview, index) => (
                        <img key={index} src={preview} alt={`Preview ${index + 1}`} className='mx-2 my-2 object-fit-cover' style={{ width: "150px" , height: "150px"}} />
                      )))
                    }
                  </div>
                </div>
                <div className="mb-3 col-6">
                  <label htmlFor="equipLat" className="form-label">พิกัดจุดวางอุปกรณ์ (ละติจูด) :</label>
                  <input type="number" id="equipLat" name='equipLat' value={locations.equipLat} onChange={handleChange} className="form-control" disabled={isChecked} required />
                </div>
                <div className="mb-3 col-6">
                  <label htmlFor="equipLng" className="form-label">พิกัดจุดวางอุปกรณ์ (ลองจิจูด) :</label>
                  <input type="number" id="equipLng" name='equipLng' value={locations.equipLng} onChange={handleChange} className="form-control" disabled={isChecked} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="practiceArea" className="form-label">การปฏิบัติตัวภายในพื้นที่ :</label>
                  <textarea type="text" rows={4} id="practiceArea" name='practiceArea' value={locations.practiceArea} onChange={handleChange} className="form-control" disabled={isChecked} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="preventArea" className="form-label">การป้องกันในพื้นที่ :</label>
                  <textarea type="text" rows={4} id="preventArea" name='preventArea' value={locations.preventArea} onChange={handleChange} className="form-control" disabled={isChecked} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="FilehowtoUse" className="form-label">วิธีการใช้อุปกรณ์ :</label>
                  {isChecked ? '' : <input className="form-control" type="file" name="FilehowtoUse" id="FilehowtoUse" onChange={imgChange3} multiple />}
                  {/* <div><img src={File3 == '' ? process.env.REACT_APP_API + `${locations.howtoUse}` : File3} alt="" className='w-25 my-2' /></div> */}
                  <div className="my-3">
                    {File3 == '' && PreviewFile3[0] ? (PreviewFile3[0].map((preview, index) => (
                      <img key={index} src={process.env.REACT_APP_API + preview.howtoUseName} alt={`Preview ${index + 1}`} className='mx-2 my-4 object-fit-cover' style={{ width: "150px" , height: "150px"}} />
                    ))) :
                      (PreviewFile3.map((preview, index) => (
                        <img key={index} src={preview} alt={`Preview ${index + 1}`} className='mx-2 my-2 object-fit-cover' style={{ width: "150px" , height: "150px"}} />
                      )))
                    }
                  </div>
                </div>
                <div className="col-12 text-center p-3">
                  {isChecked ? '' : <button type="submit" class="btn btn-success button-size">บันทึก</button>}
                  <Link className="btn btn-secondary button-size" to='/location'>{isChecked ? 'กลับ' : 'ยกเลิก'}</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  )
}