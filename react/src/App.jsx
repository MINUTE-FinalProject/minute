import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'; // App.css는 전역 스타일을 위해 유지합니다.

// Layout Component
import Layout from "./layouts/Layout";

// Page Components
import GangwondoPage from "./pages/Area/GangwondoPage";
import CampingPage from "./pages/Category/CampingPage";
import HealingPage from "./pages/Category/HealingPage";
import MountainPage from "./pages/Category/MountainPage";
import ThemeParkPage from "./pages/Category/ThemeParkPage";
import Main from "./pages/Main/Main";
import ShortsVideoPage from "./pages/Shorts/ShortsVideoPage";

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
import ManagerMyPage from './pages/Admin/ManagerMyPage';
import ManagerUserPage from './pages/Admin/ManagerUserPage';
import MemberDetail from './pages/Admin/MemberDetail';
import ReportedMembers from './pages/Admin/ReportedMembers';

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
          <Route path="shorts" element={<ShortsVideoPage />} />
          <Route path="area" element={<GangwondoPage />} />

          {/* Note: className="mypage", "bookmark-wrapper" etc. 
            should now be applied within Mypage.js, Bookmark.js components respectively.
          */}
          <Route path="mypage" element={<Mypage />} />
          <Route path="calendar" element={<Calendarpage />} />
          <Route path="bookmark" element={<Bookmark />} />
          <Route path="search" element={<Search />} />

          {/* Note: className="mainContentWithFixedHeader"
            should now be applied within Notice.js, FreeBoard.js components,
            or managed by the Layout component if it's a global style.
          */}
          <Route path="notice" element={<Notice />} />
          <Route path="noticeDetail" element={<NoticeDetail />} /> {/* Consider /notice/:id */}

          <Route path="freeboard" element={<FreeBoard />} />
          <Route path="freeboardDetail" element={<FreeboardDetail />} /> {/* Consider /freeboard/:id */}
          <Route path="freeboardWrite" element={<FreeboardWrite />} />
          <Route path="FreeboardEdit" element={<FreeboardEdit />} /> {/* Consider /freeboard/edit/:id */}

          <Route path="qna" element={<Qna />} />
          <Route path="qnaDetail" element={<QnaDetail />} /> {/* Consider /qna/:id */}
          <Route path="qnaWrite" element={<QnaWrite />} />
          <Route path="qnaEdit" element={<QnaEdit />} /> {/* Consider /qna/edit/:id */}
          
          {/* Admin pages - using the main Layout for now */}
          <Route path="admin" element={<ManagerUserPage />} />
          <Route path="reportedmembers" element={<ReportedMembers />} />
          <Route path="member-detail/:id" element={<MemberDetail />} /> {/* Using path parameter :id */}
          <Route path="managermypage" element={<ManagerMyPage />} />
        </Route>

        {/* --- Routes that DO NOT use the main Layout (e.g., Auth pages) --- */}
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

      </Routes>
    </BrowserRouter>
  );
}

export default App;