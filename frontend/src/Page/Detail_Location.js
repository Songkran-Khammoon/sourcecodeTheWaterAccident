import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import the CSS
import Navbar from "../Component/Navbar"
import Footer from "../Component/Footer";

export default function Detail_Location() {
  AOS.init(); // Initialize AOS

  const [locations, setlocations] = useState([]);
  const [PreviewFile2, setPreviewFile2] = useState([]);
  const [PreviewFile3, setPreviewFile3] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const response1 = await axios.get(
        process.env.REACT_APP_API + `location.php/${id}/?xCase=0`
      );
      const data1 = response1.data;
      setlocations(data1); // กำหนดค่าให้ Data
      // console.log("dataLoca", data1);
      // img2
      const data2Array = []; // สร้างอาร์เรย์เปล่าเพื่อเก็บข้อมูลพฤติกรรมล่าสุด
      const response2 = await axios.get(
        process.env.REACT_APP_API + `location.php/${data1.equipPlaceID}/?xCase=6`
      );
      const responseData2 = response2.data;
      data2Array.push(responseData2);
      setPreviewFile2(data2Array); // เพิ่มข้อมูลทั้งหมดจาก data2Array ลงใน setPreviewFile2
      // console.log("data2", data2Array);
      // img3
      const data3Array = []; // สร้างอาร์เรย์เปล่าเพื่อเก็บข้อมูลพฤติกรรมล่าสุด
      const response3 = await axios.get(
        process.env.REACT_APP_API + `location.php/${data1.equipPlaceID}/?xCase=7`
      );
      const responseData3 = response3.data;
      data3Array.push(responseData3);
      setPreviewFile3(data3Array); // เพิ่มข้อมูลทั้งหมดจาก data3Array ลงใน setPreviewFile3
      // console.log("data3", data3Array);
    } catch (error) {
      console.error(error);
    }
  };

  // เช็คข้อมูล ว่ามี \n ให้ทำการแยกข้อมูล
  const formattedPracticeArea = locations && locations.practiceArea ? locations.practiceArea.split('\n') : [];
  const formattedPreventArea = locations && locations.preventArea ? locations.preventArea.split('\n') : [];


  return (
    <div className='body-header'>
      <Navbar />
      <section >
        <div className='container'>
          <div className='topPic fs-1 fw-bold text-center'>
            พื้นที่เสี่ยง {locations.namelocation}
          </div>
        </div>
        <div className='page-header w-100 py-2'>
          <div className='container'>
            <ol className="breadcrumb d-flex align-items-center">
              <li className="breadcrumb-item "><Link to={`/Location`} className='detailheader fw-bold'>สถานที่</Link></li>
              <li className="breadcrumb-item active" aria-current="page">{locations.namelocation}</li>
            </ol>
          </div>
        </div>
        <div className='container'>
          <div className={`bg accident-${parseInt(locations.typeriskID)} text-center p-3 my-4 p-md-5 my-md-5 cursor-pointer`} data-bs-toggle="modal" data-bs-target={`#imgModalrisk`} >
            <div className="row mx-auto align-items-center">
              <div className="col-12 col-lg-4 m-auto my-2"><i className="fa-solid fa-triangle-exclamation icon-s warning"></i></div>
              <div className="col-12 col-lg-8 m-auto my-2"><h className='fs-1 text-white fw-bold '>พื้นที่{locations.typeriskName}</h></div>
            </div>
          </div>

          <div className='detailheader fw-bold' data-aos="fade-up">
            กดเลือกรูปภาพเพื่อขยาย
          </div>
          {/* content */}
          <div className='row'>
            <div className='col-12 col-lg-6 text-center my-3 px-3' data-aos="fade-up">
              <div className="card border-0 card-shadow h-100">
                <div className='detailheader fw-bold fs-4 py-2'>
                  จุดวางอุปกรณ์
                </div>
                <div className="my-3 mx-2">
                  {PreviewFile2[0] ? (PreviewFile2[0].map((preview, index) => (
                    <img key={index} src={process.env.REACT_APP_API + preview.equipPlaceName} alt={`Preview ${index + 1}`} className='mx-2 my-4 object-fit-cover cursor-pointer' data-bs-toggle="modal" data-bs-target={`#imgModalequipPlace${index}`} style={{ width: "150px", height: "150px" }} />
                  ))) : ""}
                </div>
              </div>
            </div>
            {/* content */}
            <div className='col-12 col-lg-6 text-center my-3 px-3' data-aos="fade-up">
              <div className="card border-0 card-shadow h-100">
                <div className='detailheader fw-bold fs-4 py-2'>
                  วิธีการใช้อุปกรณ์
                </div>
                <div className="my-3 mx-2">
                  {PreviewFile3[0] ? (PreviewFile3[0].map((preview, index) => (
                    <img key={index} src={process.env.REACT_APP_API + preview.howtoUseName} alt={`Preview ${index + 1}`} className='mx-2 my-4 object-fit-cover cursor-pointer' data-bs-toggle="modal" data-bs-target={`#imgModalhowtoUse${index}`} style={{ width: "150px", height: "150px" }} />
                  ))) : ""}
                </div>
              </div>
            </div>
            {/* content */}
            <div className='col-12 col-lg-6 my-3 px-3' data-aos="fade-up">
              <div className="card border-0 card-shadow h-100">
                <div className='card-title detailheader fw-bold fs-4 mt-3 px-3'>
                  การปฏิบัติตัวภายในพื้นที่
                </div>
                <div className="card-body">
                  {formattedPracticeArea.map((item, index) => (
                    <span key={index}>
                      {item}
                      <br /> {/* เพิ่ม <br> tag เพื่อสร้างบรรทัดใหม่ */}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {/* content */}
            <div className='col-12 col-lg-6 my-3 px-3' data-aos="fade-up">
              <div className="card border-0 card-shadow h-100">
                <div className='card-title detailheader fw-bold fs-4 mt-3  px-3'>
                  การป้องกัน
                </div>
                <div className="card-body">
                  {formattedPreventArea.map((item, index) => (
                    <span key={index}>
                      {item}
                      <br /> {/* เพิ่ม <br> tag เพื่อสร้างบรรทัดใหม่ */}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Modal */}
      <div className="modal fade" id={`imgModalrisk`} tabIndex="-1" aria-labelledby="imgmodal" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              <div className='text-end'>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="fs-3 fw-bold text-center">คำเตือนภายในพื้นที่</div>
              <div className={`bg accident-1 text-center p-3 my-1 p-md-5 my-md-5`}>
                <div className="row mx-auto align-items-center">
                  <div className="col-12 col-lg-4 m-auto my-2"><i className="fa-solid fa-triangle-exclamation icon-s warning"></i></div>
                  <div className="col-12 col-lg-8 m-auto my-2"><h className='fs-1 text-white fw-bold '>พื้นที่เสี่ยงต่ำ</h></div>
                </div>
              </div>
              <div className='fs-5'>
                <ol>
                  <li>สามารถเข้าพื้นที่ทำกิจกรรมได้</li>
                  <li>สามารถทำกิจกรรมทางน้ำได้ตามปกติแต่ต้องระมัดระวังระมัดอุบัติเหตุทางน้ำ</li>
                </ol>
              </div>
              <div className={`bg accident-2 text-center p-3 my-1 p-md-5 my-md-5`}>
                <div className="row mx-auto align-items-center">
                  <div className="col-12 col-lg-4 m-auto my-2"><i className="fa-solid fa-triangle-exclamation icon-s warning"></i></div>
                  <div className="col-12 col-lg-8 m-auto my-2"><h className='fs-1 text-white fw-bold '>พื้นที่เสี่ยงปานกลาง</h></div>
                </div>
              </div>
              <ol>
                <li>ควรระมัดระวังเมื่อเข้าใกล้แหล่งน้ำเสี่ยง</li>
                <li>เมื่อทำกิจกรรมควรระมัดระวังและป้องกันตัวเอง</li>
                <li>ดูพยากรณ์อากาศของพื้นที่นั้นก่อนที่จะเข้าไปในสถานที่นั้น</li>
              </ol>
              <div className={`bg accident-3 text-center p-3 my-1 p-md-5 my-md-5`}>
                <div className="row mx-auto align-items-center">
                  <div className="col-12 col-lg-4 m-auto my-2"><i className="fa-solid fa-triangle-exclamation icon-s warning"></i></div>
                  <div className="col-12 col-lg-8 m-auto my-2"><h className='fs-1 text-white fw-bold '>พื้นที่เสี่ยงสูง</h></div>
                </div>
              </div>
              <ol>
                <li>หลีกเลี่ยงการเข้าใกล้แหล่งน้ำ</li>
                <li>ไม่ควรทำกิจกรรมในสถานที่แหล่งน้ำอันตราย</li>
                <li>ดูพยากรณ์อากาศของพื้นที่นั้นก่อนที่จะเข้าไปในสถานที่นั้น</li>
                <li>ควรปฏิบัติตามกฎของสถานที่เคร่งครัด</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      {/* imgModalequipPlace */}
      {PreviewFile2[0] ? (PreviewFile2[0].map((preview, index) => (
        <div className="modal fade" id={`imgModalequipPlace${index}`} tabIndex="-1" aria-labelledby="imgmodal" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div className="modal-content">
              <div className="modal-body">
                <div className='text-end'>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <img
                  src={process.env.REACT_APP_API + preview.equipPlaceName}
                  className="img-fluid w-100 d-block rounded"
                  alt="Boat on Calm Water"
                />
              </div>
            </div>
          </div>
        </div>
      ))) : ""}
      {PreviewFile3[0] ? (PreviewFile3[0].map((preview, index) => (
        <div className="modal fade" id={`imgModalhowtoUse${index}`} tabIndex="-1" aria-labelledby="imgmodal" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div className="modal-content">
              <div className="modal-body">
                <div className='text-end'>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <img
                  src={process.env.REACT_APP_API + preview.howtoUseName}
                  className="img-fluid w-100 d-block rounded"
                  alt="Boat on Calm Water"
                />
              </div>
            </div>
          </div>
        </div>
      ))) : ""}
      <Footer />
    </div>
  )
}
