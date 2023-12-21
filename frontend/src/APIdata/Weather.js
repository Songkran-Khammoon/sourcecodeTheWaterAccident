import React, { useEffect, useState } from "react";
import axios from "axios";
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import the CSS

export default function Weather() {
  AOS.init(); // Initialize AOS
  const [data, setData] = useState(null);

  useEffect(() => {
    // Define the URL
    const url = 'http://localhost:3001/weather-data';


    // Make the HTTP GET request
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse the response body as JSON
      })
      .then((jsonData) => {
        // Handle the JSON data
        setData(jsonData);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  }, []); // Empty dependency array to run the effect only once

  return (
    <section className="weather-sunny text-white text-center" data-aos="fade-up">
      <div>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>



    </section >

  );
}
