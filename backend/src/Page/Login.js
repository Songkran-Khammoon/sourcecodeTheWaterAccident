import React from 'react'
import axios from "axios";
import Swal from 'sweetalert2';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState([]);
    const storedToken = sessionStorage.getItem('Token');
    useEffect(() => {
        if (storedToken !== null) {
            navigate('/dashboard');
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'คุณได้ล็อคอินแล้ว',
                showConfirmButton: false,
                timer: 2500,
            })
        }
      }, []);
   
  
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        var formData = new FormData();
        formData.append('email', inputs.email);
        formData.append('password', inputs.password);
        axios.post(process.env.REACT_APP_API+`admin.php?xCase=0`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((result) => {
            console.log(result.data);
            if (result.data.status === 1) {
                sessionStorage.setItem('Token', JSON.stringify(result.data));
                Swal.fire({
                    icon: 'success',
                    title: 'เข้าระบบสำเร็จ',
                    text: 'ล็อคอินสำเร็จ',
                    showConfirmButton: false,
                    timer: 2500,
                }).then(() => {
                    navigate(`/dashboard`);
                    window.location.reload();
                  })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'เข้าระบบไม่สำเร็จ',
                    text: 'อีเมลไม่ถูกต้องหรือรหัสผ่านผิดพลาด',
                    showConfirmButton: false,
                    timer: 2500,
                })
            }
        })
    };

    return (
        <div className='container-fluid'>
            <div className='row vh-100'>
                <div className="col-12 col-lg-6 col-xl-5 mx-auto my-auto">
                    <img src={process.env.REACT_APP_PATH + `img/Login-amico.png`} className='w-100' alt="" />
                </div>
                <div className="col-12 col-lg-6 d-flex align-items-center">
                    <form onSubmit={handleSubmit}>
                        <div className='fs-1 fw-bold text-center'>เข้าสู่ระบบ<span className="text-primary">สำหรับผู้ดูแลระบบ</span></div>
                        <div className='fs-5 text-center'>ระบบเฝ้าระวังและเตือนภัยอุบัติเหตุทางน้ำ</div>
                        <div className="row my-3">
                            <div class="col-12 col-lg-12 my-2">
                                <label for="exampleInputPassword1" class="form-label fs-5">อีเมล</label>
                                <input type="text" class="form-control fs-6" id="exampleInputPassword1" placeholder="ป้อนอีเมล" name='email' onChange={handleChange} />
                            </div>
                            <div class="col-12 my-2">
                                <label for="exampleInputPassword1" class="form-label fs-5">รหัสผ่าน</label>
                                <input type="password" class="form-control fs-6" id="exampleInputPassword1" placeholder="ป้อนรหัสผ่าน" name='password' onChange={handleChange} />
                            </div>
                            <div className="col-7 my-2 mx-auto">
                                <button type="submit" className='btn btn-primary btn-lg w-100 mt-2 fs-5'>เข้าสู่ระบบ</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
