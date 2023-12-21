import React from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Keyboard, Scrollbar, Navigation } from 'swiper/modules';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import the CSS
import Navbar from "../Component/Navbar"
import Footer from "../Component/Footer";
// import Weather from "../APIdata/Weather";

function Home() {
  AOS.init(); // Initialize AOS
  const [locations, setlocations] = useState([]);
  const [news, setnews] = useState([]);

  useEffect(() => {
    welcomwebme();
    getLocation();
    getNews();
  }, []);

  const getLocation = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API + `location.php?xCase=0`
      );
      setlocations(response.data);
    } catch (error) {
      console.error(error);
    }
  };
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
  // text fadedown opacity 0
  window.addEventListener('scroll', function () {
    const fadeOutText = document.getElementById('fade-out-text');

    // Check if the element exists
    if (fadeOutText) {
      const scrollPosition = window.scrollY;

      // Adjust the opacity based on the scroll position
      fadeOutText.style.opacity = 1 - scrollPosition / 250; // Adjust the '250' as needed

      // Ensure opacity doesn't go below 0
      if (fadeOutText.style.opacity < 0) {
        fadeOutText.style.opacity = 0;
      }
    }
  });
  // visitor
  const welcomwebme = async () => {
    try {
      // ตรวจสอบว่าเป็นวันใหม่หรือไม่
      const currentDate = new Date().toLocaleDateString();
      const lastVisitedDate = localStorage.getItem('lastVisitedDate');

      if (currentDate !== lastVisitedDate) {
        // รีเซ็ตค่าเป็น 0 เมื่อเป็นวันใหม่
        localStorage.setItem('lastVisitedDate', currentDate);
        localStorage.setItem('visitorCount', 0);
      }

      // เช็คว่ายังไม่เกิน 1 คนในวันนี้
      const visitorCount = parseInt(localStorage.getItem('visitorCount')) || 0;
      if (visitorCount < 1) {
        const response = await axios.get(
          process.env.REACT_APP_API + `visitor.php?xCase=1`
        );

        // เพิ่มจำนวนผู้เข้าชม
        localStorage.setItem('visitorCount', visitorCount + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='topBar'>
      <Navbar />
      {/* หน้าแรก */}
      <section className="w-100 vh-100 d-flex flex-column justify-content-center align-items-center banner">
        <div className="text-white text-uppercase fs-1 fw-bold text-center mx-3">
          ระบบเฝ้าระวังและเตือนภัยอุบัติเหตุทางน้ำ
        </div>
        <div id="fade-out-text" className="position-absolute bottom-0 text-white pointing-down-container">
          เลื่อนลงดูเพิ่มเติม <br />
          <i class="fa-solid fa-chevron-down"></i>
        </div>
      </section>
      {/* พื้นที่เสี่ยง */}
      <section className='container' data-aos="fade-up">
        <div className='topPic fs-1 fw-bold text-center'>
          พื้นที่เสี่ยง
        </div>
        <div className='mx-3 my-2 detailnewsheader fs-5 fw-bold'>
          กดที่รูปเลือกพื้นที่
        </div>
        <div>
          {/* new code slide */}
          <div>
            <Swiper
              slidesPerView={1}
              spaceBetween={30}
              autoplay={{
                delay: 5500,
                disableOnInteraction: false,
              }}
              keyboard={{
                enabled: true,
              }}
              breakpoints={{
                576: {
                  slidesPerView: 2,
                },
                992: {
                  slidesPerView: 3,
                },
              }}
              navigation={true}
              modules={[Autoplay, Keyboard, Scrollbar, Navigation]}
              className="mySwiper"
            >
              {locations.map((location) => (
                <SwiperSlide>
                  <Link to={`Location/${location.id}`}>
                    <div className="card card-shadow border-0 bg-inverse mx-3">
                      {/* <div className="card-header text-center text-white fw-bold fs-4 bg-risk-1"> */}
                      <div className={`card-header text-center text-white fw-bold fs-4 bg risk-${location.typeriskID}`}>
                        {location.typeriskName}
                      </div>
                      <img className="card-img-bottom object-fit-cover" src={process.env.REACT_APP_API + location.img} alt="Card image cap" height={250} />
                      <div className="card-img-overlay h-100 d-flex flex-column justify-content-end img-shadow-title">
                        <hr className='text-white border border-2 opacity-100 w-75 mx-auto' />
                        <div className="card-title text-center text-white fs-3">{location.namelocation}</div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className='d-flex justify-content-center m-3'>
              <Link to={`/Location`} className='btn btn-more button-theme-shadow radius px-4'>
                ดูทั้งหมด
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* สภาพอากาศ */}
      {/* <Weather/> */}
      <section className="weather-sunny text-white text-center" data-aos="fade-up">
        <div className="fs-1 text-center">
          เชียงราย
        </div>
        <iframe src="https://www.tmd.go.th/weatherForecast7DaysWidget?province=เชียงราย" height="320" className="w-100 rounded" scrolling="no" frameBorder="0">
        </iframe>
        
      </section >
      {/* ข่าวสาร */}
      <section className='container' data-aos="fade-up">
        <div className='topPic fs-1 fw-bold text-center'>
          ข่าวสาร
        </div>
        <div>
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            autoplay={{
              delay: 5500,
              disableOnInteraction: false,
            }}
            keyboard={{
              enabled: true,
            }}
            breakpoints={{
              576: {
                slidesPerView: 2,
              },
              992: {
                slidesPerView: 3,
              },
            }}
            navigation={true}
            modules={[Autoplay, Keyboard, Scrollbar, Navigation]}
            className="mySwiper"
          >
            {news.map((news) => (
              <SwiperSlide>
                <div className="row">
                  <div className="col">
                    <div className="card card-shadow border-0 my-4">
                      <img src={process.env.REACT_APP_API + news.newsimg} className="card-img-top object-fit-cover" alt="..." height={250} />
                      <div className="card-body">
                        <small className='text-body-secondary'><i className="far fa-calendar-alt"> </i> {news.created_at} </small>
                        <div className="card-title truncate-text fw-bold">{news.titleName}</div>
                        <p className="card-text truncate-text">{news.description}</p>
                        <Link to={`/News/`+news.newsID} className="btn btn-primary w-100">ดูเพิ่มเติม</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='d-flex justify-content-center m-3'>
            <Link to={`/News`} className='btn btn-more button-theme-shadow radius px-4'>
              ดูทั้งหมด
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Home;
