import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/CustomNavbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Odalar from "./pages/Odalar";
import Dashboard from "./pages/admin/Dashboard";
import Haberler from "./pages/Haberler";
import Oda from "./pages/Oda";
import { Contact } from "./pages/Contact";
import SSS from "./pages/SSS";
import History from "./pages/History";  
import Misyon from "./pages/Misyon";
import Yonetim from "./pages/Yonetim";
import DuyuruDetay from "./pages/DuyuruDetay";
import Duyurular from "./pages/Duyurular";
import AdminGate from "./pages/admin/AdminGate";
import UyelikIslemleri from "./pages/Uyelik-islemleri";
import YonetimPage from "./pages/admin/YonetimPage";
import OdalarPage from "./pages/admin/OdalarPage";      
import DuyurularPage from "./pages/admin/DuyurularPage";
import GenelgelerPage from "./pages/admin/GenelgelerPage";
import HaberlerPage from "./pages/admin/HaberlerPage";
import Kanunlar from "./pages/Kanunlar"
import Yonetmelikler from "./pages/Yonetmelikler"
import Tebligler from "./pages/Tebligler"
import HaberDetay from "./pages/HaberDetay"

import "./App.css"; // CSS dosyası
import Genelgeler from "./pages/Genelgeler";

function AppRoutes() {
  const location = useLocation(); 

  const hideNavbar = location.pathname.startsWith("/admin-esob-2025");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin-esob-2025/admin-login" element={<AdminGate />} />
        <Route path="/admin-esob-2025/anasayfa" element={<Dashboard />} />
        <Route path="/bilgi-bankasi/haberler" element={<Haberler />} />
        <Route path="/haberler/:id" element={<HaberDetay />} />
        <Route path="/odalar" element={<Odalar />} />
        <Route path="/oda/:id" element={<Oda />} />
        <Route path="/iletisim" element={<Contact />} />
        <Route path="/bilgi-bankasi/sss" element={<SSS />} />
        <Route path="/kurumsal/tarihce" element={<History />} />
        <Route path="/kurumsal/misyon" element={<Misyon />} />
        <Route path="/kurumsal/yonetim" element={<Yonetim />} />
        <Route path="/duyurular/:id" element={<DuyuruDetay />} />
        <Route path="/mevzuat/kanunlar" element = {<Kanunlar/>} />
        <Route path="/mevzuat/yonetmelikler" element = {<Yonetmelikler/>} />
        <Route path="/mevzuat/tebligler" element = {<Tebligler />} />
        <Route path="/genelgeler" element={<Genelgeler />} />
        <Route path="/duyurular" element={<Duyurular />} />
        <Route path="/hizmetler/uyelik-islemleri" element={<UyelikIslemleri />} />
        <Route path="/admin-esob-2025/admin-yonetim" element={<YonetimPage />} />
        <Route path="/admin-esob-2025/admin-odalar" element={<OdalarPage />} />
        <Route path="/admin-esob-2025/admin-duyurular" element={<DuyurularPage />} />
        <Route path="/admin-esob-2025/admin-haberler" element={<HaberlerPage />} />
        <Route path="/admin-esob-2025/admin-genelgeler" element={<GenelgelerPage />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
