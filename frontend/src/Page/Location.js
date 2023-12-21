import React from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import the CSS
import Navbar from "../Component/Navbar"
import Footer from "../Component/Footer";

export default function Location() {
  AOS.init(); // Initialize AOS

  const [locations, setlocations] = useState([]);

  useEffect(() => {
    getLocation();
  }, []);
  const getLocation = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API+`location.php?xCase=0`
      );
      setlocations(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="body-header">
      <Navbar />
      <section className='container'>
        <div className='topPic fs-1 fw-bold text-center'>
          พื้นที่เสี่ยง
        </div>
        <div className='mt-1 mb-3 detailheader text-center fs-6 fw-bold'>
          กดเลือกรูปภาพเพื่อดูรายละเอียด
        </div>
        <div data-aos="fade-up">
          <div className="row">
            {locations.map((location) => (
              <div className="col-lg-4">
                <Link to={`${location.id}`}>
                  <div className="card news-img border-0 bg-inverse mb-3">
                    {/* <div className="card-header text-center text-white fw-bold fs-4 bg-risk-1"> */}
                    <div className={`card-header text-center text-white fw-bold fs-4 bg risk-${location.typeriskID}`}>
                      {location.typeriskName}
                    </div>
                    <img className="card-img-bottom object-fit-cover" src={process.env.REACT_APP_API+location.img} alt="Card image cap" height={250} />
                    <div className="card-img-overlay h-100 d-flex flex-column justify-content-end img-shadow-title">
                    <hr className='text-white border border-2 opacity-100 w-75 mx-auto'/>
                      <div className="card-title text-center text-white fs-3">{location.namelocation}</div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
