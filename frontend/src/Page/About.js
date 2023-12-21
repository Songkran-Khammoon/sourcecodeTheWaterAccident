import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import the CSS
import Navbar from "../Component/Navbar"
import Footer from "../Component/Footer";

export default function SOS() {
  const [call, setcall] = useState([]);

  useEffect(() => {
    getCall();
  }, []);
  const getCall = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API + `call.php?xCase=0`
      );
      setcall(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="body-header">
      <Navbar />
      <section className='container'>
        <div className='topPic fs-1 fw-bold text-center'>
          จัดทำโดย
        </div>
        <div className='text-center fw-bold fs-3 my-2 detailheader'>
          มหาวิทยาลัยราชภัฏเชียงราย คณะสาธารณสุข และ คณะเทคโนโลยีดิจิตอล ปี2563
          <br />
          ผู้พัฒนาระบบ
        </div>
        <div className='text-center fs-5 my-2 detailheader'>
          นายสงกรานต์ คำมูล 631463009
        </div>
        <div className='text-center fw-bold fs-4 my-2 detailheader'>
          รวบรวมข้อมูลโดย
        </div>
        <div className='text-center fs-5 my-2 detailheader'>
          นางสาวกฤตยากร สมปานวัง 631473001
          <br />
          นายกีรพัฒน์ จอมมงคล 631473004
          <br />
          นางสาวศิริทิพย์ พูลชู 631473032
          <br />
          นางสาวธีรดา บรรณาลังก์ 631473038
          <br />
          นางสาวสิริภัค ทรงจำปา 631473046
        </div>

      </section >
      <Footer />
    </div >


  )
}
