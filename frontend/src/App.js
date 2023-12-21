import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Page/Home";
import Detail_Location from "./Page/Detail_Location";
import Detail_News from "./Page/Detail_News";
import Location_map from "./Page/Location_map";
import Location from "./Page/Location";
import News from "./Page/News";
import Prevent from "./Page/Prevent";
import SOS from "./Page/SOS";
import About from "./Page/About";

function App() {

  return (
    <BrowserRouter basename="/TheWaterAccident">
      <Routes>
        <Route index element={<Home />} />
        <Route path="News" element={<News />} />
        <Route path="News/:newsid" element={<Detail_News />} />
        <Route path="Location" element={<Location />} />
        <Route path="Location/:id" element={<Detail_Location />} />
        <Route path="Location_map" element={<Location_map />} />
        <Route path="Prevent" element={<Prevent />} />
        <Route path="SOS" element={<SOS />} />
        <Route path="About" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
