import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Login from "./Page/Login"
import Dashboard from "./Page/Dashboard"
import Location from "./Page/Location/ListLocation"
import DetailLocation from "./Page/Location/DetailLocation"
import NewLocation from "./Page/Location/NewLocation"
import News from "./Page/News/ListNews"
import DetailNews from "./Page/News/DetailNews"
import NewNews from "./Page/News/NewNews"
import NewTypeNews from "./Page/TypeNews/NewTypeNews"
import TypeNews from "./Page/TypeNews/ListTypeNews"
import DetailTypeNews from "./Page/TypeNews/DetailTypeNews"
import Prevent from "./Page/Prevent/ListPrevent"
import NewPrevent from "./Page/Prevent/NewPrevent"
import ListCall from "./Page/Call/ListCall"
import NewCall from "./Page/Call/NewCall"

import ImageUpload from "./Page/ImageUpload"

function App() {
  return (
    <BrowserRouter basename="/APIWaterAccident">
      <Routes>
        {/* หน้าหลัก */}
        <Route index element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
        {/* สถานที่ */}
        <Route path="location" element={<Location />} />
        <Route path="location/new" element={<NewLocation />} />
        <Route path="location/:id" element={<DetailLocation />} />
        {/* ข่าว */}
        <Route path="news" element={<News />} />
        <Route path="news/new" element={<NewNews />} />
        <Route path="news/:id" element={<DetailNews />} />
        {/* ประเภทข่าว */}
        <Route path="typenews" element={<TypeNews />} />
        <Route path="typenews/new" element={<NewTypeNews />} />
        <Route path="typenews/:id" element={<DetailTypeNews />} />
        {/* การป้องกัน */}
        <Route path="prevent" element={<Prevent />} />
        <Route path="prevent/new" element={<NewPrevent />} />
        {/* เบอร์โทร */}
        <Route path="call" element={<ListCall />} />
        <Route path="call/new" element={<NewCall />} />

        {/* test */}
        <Route path="imgup" element={<ImageUpload />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
