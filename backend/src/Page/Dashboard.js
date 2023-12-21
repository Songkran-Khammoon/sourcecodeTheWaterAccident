import React, { useEffect, useState } from 'react'
import axios from "axios";
import Sidebar from "../Component/Sidebar"
import Navbar from "../Component/Navbar"
import { checkTokenAndRedirect } from '../Component/authUtils'; // Update the import path
import { useNavigate } from "react-router-dom";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

export default function Dashboard() {
  const [prevents, setprevents] = useState([]);
  const [news, setnews] = useState([]);
  const [call, setcall] = useState([]);
  const [locations, setlocations] = useState([]);
  const [visitor, setvisitor] = useState([]);
  const [visitormonth, setvisitormonth] = useState([]);
  const [visitoryear, setvisitoryear] = useState([]);
  const [visitorall, setvisitorall] = useState([]);
  const [status, setStatus] = useState(0);

  // Calculate the current year
  const currentYear = new Date().getFullYear();

  // Create an array of data for each month of the current year
  const seriesData = visitormonth.map(element => {
    const month = parseInt(element.month);
    const count = parseInt(element.visit_count);
    const timeInMilliseconds = Date.UTC(currentYear, month - 1, 1); // Subtract 1 from month to match JavaScript months (0-11)
    return [timeInMilliseconds, count];
  });

  // Define Thai month names
  const thaiMonthNames = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม'
  ];

  // Set Thai month names
  Highcharts.setOptions({
    lang: {
      months: thaiMonthNames
    }
  });

  const options = {
    chart: {
      borderRadius: 10,
      type: 'line', // Ensure you specify the chart type
    },
    title: {
      // text: ''จำนวนผู้เข้าชมต่อเดือนในปี ' + currentYear',
      text: '',
      align: 'left',
      style: {
        fontSize: '20px',
      },
      margin: 40,
    },
    xAxis: {
      type: 'datetime',
      labels: {
        format: '{value:%b}', // Display month abbreviation
      },
      title: {
        text: 'เวลา',
      },
      dateTimeLabelFormats: {
        month: '%b', // Display month abbreviation
      },
      tickInterval: 30 * 24 * 3600 * 1000, // Tick every 30 days (approximately 1 month)
      min: Date.UTC(currentYear, 0, 1), // Start from January of the current year
      max: Date.UTC(currentYear, 11, 31), // End at December of the current year
    },
    yAxis: {
      title: {
        text: 'จำนวนผู้เข้าชม',
      },
    },
    series: [{
      name: 'ผู้ชม',
      data: seriesData,
    }],
  };

  const navigate = useNavigate();
  useEffect(() => {
    getPrevents();
    getNews();
    getCall();
    getLocation();
    getVisitor();
    getVisitormonth();
    getVisitorYear();
    getVisitorAll();
    checkTokenAndRedirect(navigate);
    fetchData();
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
  const getVisitorAll = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API + `visitor.php?xCase=0`
      );
      setvisitorall(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const getVisitor = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API + `visitor.php?xCase=2`
      );
      setvisitor(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const getVisitormonth = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API + `visitor.php?xCase=3`
      );
      setvisitormonth(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const getVisitorYear = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API + `visitor.php?xCase=4`
      );
      setvisitoryear(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getPrevents = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API + `prevent.php?xCase=0`
      );
      setprevents(response.data);
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

  const fetchData = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API + `esp32.php/?xCase=1&esp32ID=1`
      );
      setStatus(response.data.status);
      console.log(response.data)
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="row">
      <div className="col-2">
        <Sidebar />
      </div>
      {/* Body */}
      <div className="col-10 px-md-4 py-4">
        <Navbar />
        <div className="row d-flex justify-content-center mx-auto">
          <div className="col-lg-3 col-4">
            <div className="small-box bg-warning">
              <div className="inner">
                {/* {DataVoterDow.map((Data, key) => (
                    <h3 className="text-white">{Data.TotalD}</h3>
                  ))} */}
                <div className='fs-2 text-white fw-bold'>{locations.length}</div>
                <div className='py-2 fs-6 text-white'>จำนวนสถานที่ทั้งหมด</div>
              </div>
              <div className="icon">
                <i className="fas fa-exclamation-circle"></i>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-4">
            <div className="small-box bg-secondary">
              <div className="inner">
                {/* {DataVoter.map((Data, key) => (
                    <h3>{Data.Total}</h3>
                  ))} */}
                <div className='fs-2 text-white fw-bold'>{prevents.length}</div>
                <div className='py-2 fs-6 text-white'>จำนวนรูปทั้งหมด</div>
              </div>
              <div className="icon">
                <i className="fas fa-user"></i>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-4">
            <div className="small-box bg-danger">
              <div className="inner">
                {/* {DataVoterAdd.map((Data, key) => (
                    <h3>{Data === 0 ? 0 : `${Data.TotalA}`}</h3>
                  ))} */}
                <div className='fs-2 text-white fw-bold'>{news.length}</div>
                <div className='py-2 fs-6 text-white'>จำนวนข่าวทั้งหมด</div>
              </div>
              <div className="icon">
                <i className="fas fa-check-circle"></i>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-4">
            <div className="small-box bg-success">
              <div className="inner">
                {/* {DataVoterDow.map((Data, key) => (
                    <h3 className="text-white">{Data.TotalD}</h3>
                  ))} */}
                <div className='fs-2 text-white fw-bold'>{call.length}</div>
                <div className='py-2 fs-6 text-white'>จำนวนเบอร์ติดต่อทั้งหมด</div>
              </div>
              <div className="icon">
                <i class="fa-solid fa-phone-volume"></i>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-4">
            <div className="small-box bg-primary">
              <div className="inner">
                <div className='fs-2 text-white fw-bold'>{visitorall.length}</div>
                <div className='py-2 fs-6 text-white'>จำนวนผู้ชมทั้งหมด</div>
              </div>
              <div className="icon">
                <i class="fa-solid fa-eye"></i>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-4">
            <div className="small-box bg-primary">
              <div className="inner">
                <div className='fs-2 text-white fw-bold'>{status == 1 ? "ทำงานอยู่" : "ไม่ทำงาน"}</div>
                <div className='py-2 fs-6 text-white'>กล้อง</div>
              </div>
              <div className="icon">
                <i class="fa-solid fa-camera"></i>
              </div>
            </div>
          </div>

        </div>
        <div className='fs-4'>จำนวนผู้เข้าชมในปี {currentYear} ({visitoryear.visit_count})</div>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </div>
    </div>
  )
}
