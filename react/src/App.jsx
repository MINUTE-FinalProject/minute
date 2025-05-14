import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'; // App.css는 전역 스타일을 위해 유지합니다.

// Layout Component
import Layout from "./layouts/Layout";

// Page Components
import CampingPage from "./pages/Category/CampingPage";
import HealingPage from "./pages/Category/HealingPage";
import MountainPage from "./pages/Category/MountainPage";
import ThemeParkPage from "./pages/Category/ThemeParkPage";
import Main from "./pages/Main/Main";
import ShortsVideoPage from "./pages/Shorts/ShortsVideoPage";

import BusanPage from "./pages/Area/BusanPage";
import ChungcheongbukPage from "./pages/Area/ChungcheongbukPage";
import ChungcheongnamPage from "./pages/Area/ChungcheongnamPage";
import GangwondoPage from "./pages/Area/GangwondoPage";
import GyeonggidoPage from "./pages/Area/GyeonggidoPage";
import GyeongsangbukPage from "./pages/Area/GyeongsangbukPage";
import GyeongsangnamPage from "./pages/Area/GyeongsangnamPage";
import JejuPage from "./pages/Area/JejuPage";
import JeollabukPage from "./pages/Area/JeollabukPage";
import JeollanamPage from "./pages/Area/JeollanamPage";
import SeoulPage from "./pages/Area/SeoulPage";

import Bookmark from "./pages/Bookmark/bookmark";
import Search from "./pages/Bookmark/search";
import Calendarpage from "./pages/Calendar/Calendarpage";
import Mypage from "./pages/Mypage/Mypage";

import Notice from "./pages/Notice/notice";
import NoticeDetail from "./pages/Notice/noticeDetail";

import FreeBoard from "./pages/Board/freeBoard";
import FreeboardDetail from "./pages/Board/freeboardDetail";
import FreeboardEdit from "./pages/Board/freeboardEdit";
import FreeboardWrite from "./pages/Board/freeboardWrite";

import Qna from "./pages/QnA/qna";
import QnaDetail from "./pages/QnA/qnaDetail";
import QnaEdit from "./pages/QnA/qnaEdit";
import QnaWrite from "./pages/QnA/qnaWrite";

// Auth Page Components
import CheckDelete from "./pages/Auth/CheckDelete";
import CheckInfo from "./pages/Auth/CheckInfo";
import DeleteAccount from "./pages/Auth/DeleteAccount";
import FailFindID from "./pages/Auth/FailFindID";
import FindID from "./pages/Auth/FindID";
import FindPwd from "./pages/Auth/FindPwd";
import FindPwd2 from "./pages/Auth/FindPwd2";
import LoginPage from "./pages/Auth/LoginPage"; // 경로 대소문자 확인 (Auth)
import LoginRequired from "./pages/Auth/LoginRequired";
import SignupComplete from "./pages/Auth/SignUpComplete";
import SignUpForm from "./pages/Auth/SignUpForm";
import SignUpForm2 from "./pages/Auth/SignUpForm2";
import SuccessID from "./pages/Auth/SuccessID";
import SuccessPwd from "./pages/Auth/SuccessPwd";

// Admin Page Components
import NotFound from "./pages/404";
import ManagerFreeboard from "./pages/Admin/ManagerFreeboard";
import ManagerFreeboardDetail from "./pages/Admin/ManagerFreeboardDetail";
import ManagerMyPage from './pages/Admin/ManagerMyPage';
import ManagerNotice from "./pages/Admin/ManagerNotice";
import ManagerNoticeDetail from "./pages/Admin/ManagerNoticeDetail";
import ManagerNoticeEdit from "./pages/Admin/ManagerNoticeEdit";
import ManagerNoticeWrite from "./pages/Admin/ManagerNoticeWrite";
import ManagerQna from "./pages/Admin/ManagerQna";
import ManagerQnaDetail from "./pages/Admin/ManagerQnaDetail";
import ManagerQnaEdit from "./pages/Admin/ManagerQnaEdit";
import ManagerQnaWrtie from "./pages/Admin/ManagerQnaWrite";
import ManagerUserPage from './pages/Admin/ManagerUserPage';
import MemberDetail from './pages/Admin/MemberDetail';
import ReportedMembers from './pages/Admin/ReportedMembers';
import ReportedPosts from "./pages/Admin/ReportedPosts";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Routes that use the main Layout (Header, Footer) --- */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="camping" element={<CampingPage />} />
          <Route path="healing" element={<HealingPage />} />
          <Route path="mountain" element={<MountainPage />} />
          <Route path="themepark" element={<ThemeParkPage />} />
     

           <Route path="area">
            <Route index element={<GangwondoPage />} />
            <Route path="gangwondo" element={<GangwondoPage />} />
            <Route path="gyeonggido" element={<GyeonggidoPage />} />
            <Route path="chungcheongbuk" element={<ChungcheongbukPage />} />
            <Route path="chungcheongnam" element={<ChungcheongnamPage />} />
            <Route path="jeollabuk" element={<JeollabukPage />} />
            <Route path="jeollanam" element={<JeollanamPage />} />
            <Route path="gyeongsangbuk" element={<GyeongsangbukPage />} />
            <Route path="gyeongsangnam" element={<GyeongsangnamPage />} />
            <Route path="jeju" element={<JejuPage />} />
            <Route path="busan" element={<BusanPage />} />
            <Route path="seoul" element={<SeoulPage />} />
          </Route>

          {/* Note: className="mypage", "bookmark-wrapper" etc. 
            should now be applied within Mypage.js, Bookmark.js components respectively.
          */}
          <Route path="mypage" element={<Mypage />} />
          <Route path="calendar" element={<Calendarpage />} />
          <Route path="bookmark" element={<Bookmark />} />
          <Route path="search" element={<Search />} />

          <Route path="notice" element={<div className="mainContentWithFixedHeader"><Notice /></div>} />
          <Route path="noticeDetail" element={<div className="mainContentWithFixedHeader"><NoticeDetail /></div>} /> {/* Consider /notice/:id */}

          <Route path="freeboard" element={<div className="mainContentWithFixedHeader"><FreeBoard /></div>} />
          <Route path="freeboardDetail" element={<div className="mainContentWithFixedHeader"><FreeboardDetail /></div>} /> {/* Consider /freeboard/:id */}
          <Route path="freeboardWrite" element={<div className="mainContentWithFixedHeader"><FreeboardWrite /></div>} />
          <Route path="FreeboardEdit" element={<div className="mainContentWithFixedHeader"><FreeboardEdit /></div>} /> {/* Consider /freeboard/edit/:id */}

          <Route path="qna" element={<div className="mainContentWithFixedHeader"><Qna /></div>} />
          <Route path="qnaDetail" element={<div className="mainContentWithFixedHeader"><QnaDetail /></div>} /> {/* Consider /qna/:id */}
          <Route path="qnaWrite" element={<div className="mainContentWithFixedHeader"><QnaWrite /></div>} />
          <Route path="qnaEdit" element={<div className="mainContentWithFixedHeader"><QnaEdit /></div>} /> {/* Consider /qna/edit/:id */}

          {/* Admin pages - using the main Layout for now */}
          <Route path="admin" element={<ManagerUserPage />} />
          <Route path="reportedmembers" element={<ReportedMembers />} />
          <Route path="member-detail/:id" element={<MemberDetail />} /> {/* Using path parameter :id */}
          <Route path="managermypage" element={<ManagerMyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/loginrequired" element={<LoginRequired />} />
          <Route path="/findid" element={<FindID />} />
          <Route path="/successid" element={<SuccessID />} />
          <Route path="/successpwd" element={<SuccessPwd />} />
          <Route path="/signupform" element={<SignUpForm />} />
          <Route path="/signupform2" element={<SignUpForm2 />} />
          <Route path="/signupcomplete" element={<SignupComplete />} />
          <Route path="/findpwd" element={<FindPwd />} />
          <Route path="/findpwd2" element={<FindPwd2 />} />
          <Route path="/failfindid" element={<FailFindID />} />
          <Route path="/deleteaccount" element={<DeleteAccount />} />
          <Route path="/checkinfo" element={<CheckInfo />} />
          <Route path="/checkdelete" element={<CheckDelete />} />
        
        
        </Route>

        {/* --- Routes that DO NOT use the main Layout (e.g., Auth pages) --- */}
        
        <Route path="shorts" element={<ShortsVideoPage />} />

        <Route path="/managerFreeboard" element={<ManagerFreeboard />} />

        <Route path="/managerFreeboardDetail" element={<ManagerFreeboardDetail />} />

        <Route path="/managerNotice" element={<ManagerNotice />} />

        <Route path="/managerNoticeDetail" element={<ManagerNoticeDetail />} />

        <Route path="/managerNoticeEdit" element={<ManagerNoticeEdit />} />

        <Route path="/managerNoticeWrite" element={<ManagerNoticeWrite />} />

        <Route path="/managerQna" element={<ManagerQna />} />

        <Route path="/managerQnaDetail" element={<ManagerQnaDetail />} />

        <Route path="/managerQnaEdit" element={<ManagerQnaEdit />} />

        <Route path="/managerQnaWrite" element={<ManagerQnaWrtie />} />

        <Route path="/reportedposts" element={<ReportedPosts />} />

        <Route path="/*" element={<NotFound />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;