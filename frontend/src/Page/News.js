import React from 'react'
import axios from "axios";
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Keyboard, Scrollbar, Navigation, FreeMode } from 'swiper/modules';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import the CSS
import Navbar from "../Component/Navbar"
import Footer from "../Component/Footer";

export default function News() {
  AOS.init(); // Initialize AOS

  const [news, setnews] = useState([]);
  const [typenews, settypenews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);

  useEffect(() => {
    getNews();
    getTypeNews();

  }, []);

  const getNews = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API + `news.php?xCase=0`
      );
      setnews(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getTypeNews = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API + `news.php?xCase=4`
      );
      const modifiedData = response.data.map((item) => ({
        ...item,
        isActive: false,
      }));
      settypenews(modifiedData);
    } catch (error) {
      console.error(error);
    }
  };
  // แสดงข้อมูลตามtypenews
  const filterNewsByType = (type) => {
    const filtered = news.filter((item) => item.typeNewsID === type);
    setFilteredNews(filtered);
  };

  const handleButtonClick = (index) => {
    const updatedStates = typenews.map((item, i) => ({ ...item, isActive: i === index, }));
    settypenews(updatedStates);
  };


  return (
    <div className="body-header">
      <Navbar />
      <section className='container'>
        <div className='topPic fs-1 fw-bold text-center'>
          ข่าวสาร
        </div>
        <div className='ban-news' >

          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            autoplay={{
              delay: 10000,
              disableOnInteraction: false,
            }}
            keyboard={{
              enabled: true,
            }}
            navigation={true}
            modules={[Autoplay, Keyboard, Scrollbar, Navigation]}
            className="mySwiper"
          >
            {news.map((news) => (
              <SwiperSlide>
                <Link to={`${news.newsID}`} className='text-dark'>
                  <div><img src={process.env.REACT_APP_API + news.newsimg} className="d-block object-fit-cover image-news-inswipper rounded" alt="..." /></div>
                  <div className='fs-5 truncate-text fw-bold mt-2'>{news.titleName}</div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          <div>
            <Swiper
              slidesPerView={'auto'}
              // spaceBetween={10}
              freeMode={true}
              modules={[FreeMode]}
              className="mySwiper py-3"
            >
              <SwiperSlide className='w-auto px-1'><div className={`btn ${filteredNews.length === 0 ? 'btn-more ' : 'btn-light detailnewsheader fs-6'} button-shadow radius-50 px-3 fs-5 fw-bold my-auto`} onClick={() => { filterNewsByType(''); handleButtonClick(999); }}>ทั้งหมด</div></SwiperSlide>
              {typenews.map((typenews, key) => (
                <SwiperSlide className='w-auto px-1'><div key={key} className={`btn ${typenews.isActive ? 'btn-more' : 'btn-light detailnewsheader fs-6'} button-shadow radius-50 px-3 fs-5 fw-bold my-auto`} onClick={() => { filterNewsByType(typenews.typeNewsID); handleButtonClick(key); }}>{typenews.typeNewsName}</div></SwiperSlide>
              ))}
            </Swiper>

            <div className='row'>
              {filteredNews.length > 0
                ? filteredNews.map((item) => (
                  <div className='col-12 col-md-6 col-lg-4 mb-3' >
                    <Link className='card card-shadow border-0 text-dark' to={`${item.newsID}`} data-aos="fade-up">
                      <div className="d-flex flex-lg-column">
                        <div className="col-5 col-lg-12 flex-shrink-0">
                          <img src={process.env.REACT_APP_API + item.newsimg} className='img-fluid fixed-size-image object-fit-cover' alt="..." />
                        </div>
                        <div className=" col-7 col-lg-12 fs-6">
                          <div className="card-body ">
                            <small className='text-body-secondary'><i className="far fa-calendar-alt"> </i> {item.created_at} </small>
                            <div className="card-title truncate-text fw-bold">{item.titleName}</div>
                            <p className="card-text truncate-text">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
                : news.map((item) => (
                  <div className='col-12 col-md-6 col-lg-4 mb-4'>
                    <Link className='card card-shadow border-0 text-dark ' to={`${item.newsID}`} data-aos="fade-up">
                      <div className="d-flex flex-lg-column">
                        <div className="col-5 col-lg-12 flex-shrink-0">
                          <img src={process.env.REACT_APP_API + item.newsimg} className='img-fluid fixed-size-image object-fit-cover' alt="..." />
                        </div>

                        <div className=" col-7 col-lg-12 fs-6">
                          <div className="card-body ">
                            <small className='text-body-secondary'><i className="far fa-calendar-alt"> </i> {item.created_at} </small>
                            <div className="card-title truncate-text fw-bold">{item.titleName}</div>
                            <p className="card-text truncate-text">{item.description}</p>
                          </div>
                        </div>

                      </div>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
