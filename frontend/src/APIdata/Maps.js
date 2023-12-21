import React, { useEffect, useRef, useState } from "react";
// import { GoogleMap, useJsApiLoader, Marker,InfoWindow } from '@react-google-maps/api';
import axios from "axios";

export default function Maps() {
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);

  const [locations1, setlocations1] = useState([]);
  const [locations2, setlocations2] = useState([]);
  const [locations3, setlocations3] = useState([]);

  useEffect(() => {
    getLocation1();
    getLocation2();
    getLocation3();
  }, []);
  const getLocation1 = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API + `location.php/1/?xCase=5`
      );
      setlocations1(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const getLocation2 = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API + `location.php/2/?xCase=5`
      );
      setlocations2(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const getLocation3 = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API + `location.php/3/?xCase=5`
      );
      setlocations3(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting geolocation:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: userLocation,
      });
      // รูปuser
      const UserIcon = {
        url: `${process.env.REACT_APP_PATH}img/user.png`, // Path to the custom marker image
        scaledSize: new window.google.maps.Size(60, 60), // Custom width and height for the icon
      };
      // Add user's location marker
      new window.google.maps.Marker({
        position: userLocation,
        map,
        title: "พิกัดปัจจุบัน",
        icon: UserIcon,
      });
      // สร้าง InfoWindow
      const infoWindow = new window.google.maps.InfoWindow();
      // พยาบาล
      const markerhelpIcon = {
        url: `${process.env.REACT_APP_PATH}img/medical.png`, // Path to the custom marker image
        scaledSize: new window.google.maps.Size(40, 40), // Custom width and height for the icon
      };
      // Add other markers
      locations1.forEach((location) => {
        new window.google.maps.Marker({
          position: { lat: parseFloat(location.equipLat), lng: parseFloat(location.equipLng) },
          map,
          // title: location.namelocation,
          icon: markerhelpIcon,
        });
      });
      locations2.forEach((location) => {
        new window.google.maps.Marker({
          position: { lat: parseFloat(location.equipLat), lng: parseFloat(location.equipLng) },
          map,
          // title: location.namelocation,
          icon: markerhelpIcon,
        });
      });
      locations3.forEach((location) => {
        new window.google.maps.Marker({
          position: { lat: parseFloat(location.equipLat), lng: parseFloat(location.equipLng) },
          map,
          // title: location.namelocation,
          icon: markerhelpIcon,
        });
      });

      // สถานที่เสี่ยงต่ำ
      const markerIcon1 = {
        url:  `${process.env.REACT_APP_PATH}img/logreen.png`, // Path to the custom marker image
        scaledSize: new window.google.maps.Size(50, 50), // Custom width and height for the icon
      };
      // Add other markers
      locations1.forEach((location) => {
        const marker = new window.google.maps.Marker({
          position: { lat: parseFloat(location.locationLat), lng: parseFloat(location.locationLng) },
          map,
          title: location.namelocation,
          icon: markerIcon1,
        });

        // Add double click event to open a link
        marker.addListener("dblclick", () => {
          window.location.href = `/TheWaterAccident/Location/${location.id}`; // Change this to your actual route
        });
        // Add click event to open InfoWindow
        marker.addListener("click", () => {
          infoWindow.setContent(location.namelocation);
          infoWindow.open(map, marker);
        });

      });
      // สถานที่เสี่ยงปลานกลาง
      const markerIcon2 = {
        url:  `${process.env.REACT_APP_PATH}img/loyellow.png`, // Path to the custom marker image
        scaledSize: new window.google.maps.Size(50, 50), // Custom width and height for the icon
      };
      // Add other markers
      locations2.forEach((location) => {
        const marker = new window.google.maps.Marker({
          position: { lat: parseFloat(location.locationLat), lng: parseFloat(location.locationLng) },
          map,
          title: location.namelocation,
          icon: markerIcon2,
        });

        // Add double click event to open a link
        marker.addListener("dblclick", () => {
          window.location.href = `/TheWaterAccident/Location/${location.id}`; // Change this to your actual route
        });
        // Add click event to open InfoWindow
        marker.addListener("click", () => {
          infoWindow.setContent(location.namelocation);
          infoWindow.open(map, marker);
        });

      });
      // สถานที่เสี่ยงสูง
      const markerIcon3 = {
        url: `${process.env.REACT_APP_PATH}img/lored.png`, // Path to the custom marker image
        scaledSize: new window.google.maps.Size(50, 50), // Custom width and height for the icon
      };
      // Add other markers
      locations3.forEach((location) => {
        const marker = new window.google.maps.Marker({
          position: { lat: parseFloat(location.locationLat), lng: parseFloat(location.locationLng) },
          map,
          title: location.namelocation,
          icon: markerIcon3,
        });

        // Add double click event to open a link
        marker.addListener("dblclick", () => {
          window.location.href = `/TheWaterAccident/Location/${location.id}`; // Change this to your actual route
        });
        // Add click event to open InfoWindow
        marker.addListener("click", () => {
          infoWindow.setContent(location.namelocation);
          infoWindow.open(map, marker);
        });

      });

    }
  }, [userLocation, locations1]);

  return (
    <div id="map" style={{ width: "100%", height: "400px" }} ref={mapRef} />
  );
};
