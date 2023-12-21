import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import the CSS
import Navbar from "../Component/Navbar"
import Footer from "../Component/Footer";

export default function Detail_News() {
  AOS.init(); // Initialize AOS

  const [news, setnews] = useState([]);

  const { newsid } = useParams();

  useEffect(() => {
    getLocation();
  }, []);
  const getLocation = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API + `news.php/${newsid}/?xCase=0`
      );
      setnews(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const formattedDescription = news && news.description ? news.description.split('\n') : [];

  return (
    <div className='body-header'>
      <Navbar />
      <section >
        <div className='container' data-aos="fade-up">
          <div className='topPic fs-1 fw-bold text-center'>
            ข่าวสาร {news.namelocation}
          </div>
        </div>
        <div className='page-header w-100 py-2'>
          <div className='container'>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to={`/News`} className='detailheader fw-bold'>ข่าวสาร</Link></li>
              <li className="breadcrumb-item active" aria-current="page">{news.titleName}</li>
            </ol>
          </div>
        </div>
        <div className='container' data-aos="fade-up">
          <div className='text-center detailnewsheader fs-3 fw-bold my-3'>
            {news.titleName}
          </div>
          <div className='d-flex justify-content-center m-3'>
            <img src={process.env.REACT_APP_API + news.newsimg} alt="" className='w-50' />
          </div>
          <div className='newscontent news-descript mt-4'>
            {/* {news.description} */}
            {formattedDescription.map((item, index) => (
              <span key={index}>
                {item}
                <br /> {/* เพิ่ม <br> tag เพื่อสร้างบรรทัดใหม่ */}
              </span>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
