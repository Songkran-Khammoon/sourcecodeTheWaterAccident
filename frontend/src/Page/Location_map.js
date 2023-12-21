import React, { useEffect, useState } from 'react';
import axios from "axios";
import Map from "../APIdata/Maps"
import Navbar from "../Component/Navbar"
import Footer from "../Component/Footer";
import Swal from 'sweetalert2';

export default function Location_map() {
  const [status, setStatus] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API + `esp32.php/?xCase=1&esp32ID=1`
      );
      setStatus(response.data.status);
    } catch (error) {
      console.error(error);
    }
  };
  const clickAlertIOT = (e) => {
    e.preventDefault();
    axios.get(process.env.REACT_APP_API + `esp32.php/?xCase=2&esp32ID=1&status=1`).then((result) => {
      if (result.data.status == 1) {
        Swal.fire({
          icon: 'success',
          title: 'ส่งขอความช่วยเหลือแล้ว',
          showConfirmButton: false,
          timer: 2500,
        })
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'ส่งขอความช่วยเหลือไม่สำเร็จ',
          showConfirmButton: false,
          timer: 2500,
        })
      }
    })
  };


  return (
    <div className='body-header'>
      <Navbar />
      <section className='container-lg'>
        <div className='topPic fs-1 fw-bold text-center'>
          แผนที่
        </div>
        <div className='my-2 detailheader fs-6 fw-bold'>
          กดที่มาร์คเลือกพื้นที่
        </div>
        <div>
          <Map />
        </div>
        {status !== null ? (
          <div>
            <p></p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <div className="text-center">
          <card className={`button-theme-shadow radius px-4 m-3 btn ${status == 1 ? 'btn-success' : 'btn-danger'}`} style={{ width: "350px"}}>
            <div className="m-3" style={{ fontSize: "80px" }}><i class="fa-solid fa-camera"></i></div>
            <div className="fs-5 m-3">กล้อง : {status == 1 ? "ทำงานอยู่" : "ไม่ทำงาน"}</div></card>

          <card onClick={(e) => clickAlertIOT(e)} className='btn btn-more button-theme-shadow radius px-4 m-3' style={{ width: "350px"}}>
            <div className="m-3" style={{ fontSize: "80px"}}><i class="fa-regular fa-bell"></i></div>
            <div className="fs-5 m-3">กดปุ่มส่งเสียงขอความช่วยเหลือ</div></card>
        </div>
      </section>
      <Footer />
    </div>
  )
}
