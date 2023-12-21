import React from 'react'
import axios from "axios";
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import the CSS
import Navbar from "../Component/Navbar"
import Footer from "../Component/Footer";

export default function Prevent() {
  AOS.init(); // Initialize AOS

  const [locations, setlocations] = useState([]);

  useEffect(() => {
    getLocation();
  }, []);


  const getLocation = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API+`prevent.php?xCase=0`
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
          การป้องกัน
        </div>
        <div className='detailheader fs-6 fw-bold ps-2'>
          กดที่รูปเลือกพื้นที่
        </div>
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
        >
          <Masonry columnsCount={3}>
            {locations.map((prevent, key) => (
              <div>
                <img
                key={key}
                src={process.env.REACT_APP_API+prevent.prevent_img}
                // data-mdb-img={process.env.REACT_APP_API+prevent.prevent_img}
                className="w-100 rounded p-2 cursor-pointer"
                alt="Boat on Calm Water"
                data-bs-toggle="modal" data-bs-target={`#imgModal${prevent.id}`} 
                />
                <div className="modal fade" id={`imgModal${prevent.id}`} tabIndex="-1" aria-labelledby="imgmodal" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div className="modal-content">
                      <div className="modal-body">
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
                        <img
                          src={process.env.REACT_APP_API+prevent.prevent_img}
                          data-mdb-img={process.env.REACT_APP_API+prevent.prevent_img}
                          className="img-fluid w-100 d-block rounded"
                          alt="Boat on Calm Water"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </section>
      <Footer />
    </div>
  )
}
