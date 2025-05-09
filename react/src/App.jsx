import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Layout from "./layouts/Layout";
import CampingPage from "./pages/CampingPage";
import GangwondoPage from "./pages/GangwondoPage";
import HealingPage from "./pages/HealingPage";
import Main from "./pages/Main";
import MountainPage from "./pages/MountainPage";
import Mypage from "./pages/Mypage";
import ShortsVideoPage from "./pages/ShortsVideoPage";
import ThemeParkPage from "./pages/ThemeParkPage";
import Bookmark from './pages/bookmark';
import Search from './pages/search';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route index element={<Main />} />
        <Route path="/camping" element={<CampingPage />} />
        <Route path="/healing" element={<HealingPage />} />
        <Route path="/mountain" element={<MountainPage />} />
        <Route path="/themepark" element={<ThemeParkPage />} />
        <Route path="/shorts" element={<ShortsVideoPage />} />
        <Route path="/area" element={<GangwondoPage />} />

        <Route path="/mypage" element={<div className="mypage"><Mypage /></div>} />
        <Route path="/" element={<div className="search-wrapper"><Search /></div>} />
          <Route path="/search" element={<div className="search-wrapper"><Search /></div>} />
          <Route path="/bookmark" element={<div className="bookmark-wrapper"><Bookmark /></div>} />
          <Route path="/mypage" element={<div className="mypage"><Mypage /></div>} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
