import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { checkTokenAndRedirect } from '../../Component/authUtils'; // Update the import path
import Swal from 'sweetalert2'
import Sidebar from "../../Component/Sidebar"
import Navbar from "../../Component/Navbar"

export default function ListPrevent() {
  const [prevents, setprevents] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getPrevents();
    checkTokenAndRedirect(navigate);
  }, []);

  const getPrevents = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API+`prevent.php?xCase=0`
      );
      setprevents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deletePrevents = (id) => {
    axios.post(process.env.REACT_APP_API+`prevent.php/${id}/?xCase=3`).then(function (response) {
      console.log(response.data);
      getPrevents();
    });
  };
  // sweetalert2
  function showAlertDelete(id) {
    console.log(id)
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
        deletePrevents(id);
        Swal.fire({
          icon: 'success',
          title: 'ลบข้อมูลสำเร็จ',
          text: 'คุณได้ทำการยืนยันลบข้อมูลเรียบร้อยแล้ว!',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.reload();
        })
      }
    })

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
          <div className='card-header row'>
            <div className="col-4 my-auto">
              <Link className="btn btn-sm btn-primary px-3" to='new'>เพื่มข้อมูล</Link>
            </div>
            <div className="col-4 my-auto">
              <h3 className="text-center fw-bold text-center topHeader">การป้องกัน</h3>
            </div>
            <div className="col-4 my-auto d-flex justify-content-end">

            </div>
          </div>
          <div className='card-body text-center'>
            {prevents.map((prevent, key) => (
              <span className=''>
                <img src={process.env.REACT_APP_API+`${prevent.prevent_img}`} className='object-fit-cover rounded m-2 cursor-pointer' alt=""
                  style={{ width: 235, height: 235 }} data-bs-toggle="modal" data-bs-target={`#imgModal${prevent.id}`} />

                <div className="modal fade" id={`imgModal${prevent.id}`} tabIndex="-1" aria-labelledby="imgmodal" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div className="modal-content">
                      <div className="modal-body">
                        <span className='d-flex justify-content-between'>
                          <small className='opacity-50'>
                            สร้างเมื่อ {prevent.created_at}
                          </small>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </span>
                        <img
                          src={process.env.REACT_APP_API+`${prevent.prevent_img}`}
                          data-mdb-img={process.env.REACT_APP_API+`${prevent.prevent_img}`}
                          className="img-fluid w-100 d-block rounded"
                          alt="Boat on Calm Water"
                        />
                        <span className='d-flex justify-content-center'>
                          <button className="btn btn-sm btn-danger my-3 px-3" onClick={() => showAlertDelete(prevent.id)}>ลบ</button>
                        </span>

                      </div>
                    </div>
                  </div>
                </div>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
