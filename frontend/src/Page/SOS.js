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
          ขอความช่วยเหลือ
        </div>
        <div className='text-center fs-5 my-2 detailheader'>
          กดเพื่อโทรทันที
        </div>
        <div className='row d-flex justify-content-center mx-auto'>
          {call.map((call, key) => (
            <div className='col-lg-5 m-2' key={key}>
              <a href={`tel:${call.callPhone}`} className='row text-center d-flex align-items-center card card-shadow border-0 d-flex flex-row'>
                <div className='col-4'>
                  <img className='d-block w-100 p-4' src={`img/call${call.typeriskID}.png`} alt="" />
                </div>
                <div className='col-8'>
                  <div className={`call phone-${call.typeriskID} fs-1`}>{call.callPhone}</div>
                  <div className={`call phone-${call.typeriskID} fs-3`}>{call.callName}</div>
                </div>
              </a>
            </div>
          ))}
        </div>

      </section >
      <Footer />
    </div >


  )
}
