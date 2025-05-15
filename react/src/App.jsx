import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'; // App.css는 전역 스타일을 위해 유지합니다.

// Layout Components
import AdminLayout from "./layouts/AdminLayout"; // 새로 만든 AdminLayout 임포트
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
import LoginPage from "./pages/Auth/LoginPage";
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
import ManagerQnaWrite from "./pages/Admin/ManagerQnaWrite"; // 오타 수정 (Wrtie -> Write)
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

          <Route path="mypage" element={<Mypage />} />
          <Route path="calendar" element={<Calendarpage />} />
          <Route path="bookmark" element={<Bookmark />} />
          <Route path="search" element={<Search />} />

          {/* 공지사항, 게시판 등 className="mainContentWithFixedHeader" 사용 부분은 그대로 유지합니다. */}
          <Route path="notice" element={<div className="mainContentWithFixedHeader"><Notice /></div>} />
          <Route path="noticeDetail/:id" element={<div className="mainContentWithFixedHeader"><NoticeDetail /></div>} /> {/* :id 파라미터 추가 권장 */}

          <Route path="freeboard" element={<div className="mainContentWithFixedHeader"><FreeBoard /></div>} />
          <Route path="freeboardDetail/:id" element={<div className="mainContentWithFixedHeader"><FreeboardDetail /></div>} /> {/* :id 파라미터 추가 권장 */}
          <Route path="freeboardWrite" element={<div className="mainContentWithFixedHeader"><FreeboardWrite /></div>} />
          <Route path="freeboardEdit/:id" element={<div className="mainContentWithFixedHeader"><FreeboardEdit /></div>} /> {/* :id 파라미터 추가 권장 */}

          <Route path="qna" element={<div className="mainContentWithFixedHeader"><Qna /></div>} />
          <Route path="qnaDetail/:id" element={<div className="mainContentWithFixedHeader"><QnaDetail /></div>} /> {/* :id 파라미터 추가 권장 */}
          <Route path="qnaWrite" element={<div className="mainContentWithFixedHeader"><QnaWrite /></div>} />
          <Route path="qnaEdit/:id" element={<div className="mainContentWithFixedHeader"><QnaEdit /></div>} /> {/* :id 파라미터 추가 권장 */}

          {/* ▼▼▼ 관리자 페이지 그룹: AdminLayout 적용 ▼▼▼ */}
          <Route path="admin" element={<AdminLayout />}>
            {/* /admin 경로 접속 시 기본으로 보여줄 페이지 (예: 회원 관리) */}
            <Route index element={<ManagerUserPage />} /> 
            {/* 또는 <Route path="users" element={<ManagerUserPage />} /> 등으로 명시적 경로 사용 가능 */}
            
            <Route path="users" element={<ManagerUserPage />} /> {/* 명시적으로 /admin/users */}
            <Route path="reportedmembers" element={<ReportedMembers />} />
            <Route path="member-detail/:id" element={<MemberDetail />} />
            <Route path="mypage" element={<ManagerMyPage />} /> {/* /admin/mypage */}
            
            <Route path="managerFreeboard" element={<ManagerFreeboard />} />
            <Route path="managerFreeboardDetail/:id" element={<ManagerFreeboardDetail />} /> {/* :id 파라미터 추가 권장 */}
            
            <Route path="managerNotice" element={<ManagerNotice />} />
            <Route path="managerNoticeDetail/:id" element={<ManagerNoticeDetail />} /> {/* :id 파라미터 추가 권장 */}
            <Route path="managerNoticeEdit/:id" element={<ManagerNoticeEdit />} /> {/* :id 파라미터 추가 권장 */}
            <Route path="managerNoticeWrite" element={<ManagerNoticeWrite />} />
            
            <Route path="managerQna" element={<ManagerQna />} />
            <Route path="managerQnaDetail/:id" element={<ManagerQnaDetail />} /> {/* :id 파라미터 추가 권장 */}
            <Route path="managerQnaEdit/:id" element={<ManagerQnaEdit />} /> {/* :id 파라미터 추가 권장 */}
            <Route path="managerQnaWrite" element={<ManagerQnaWrite />} />
            
            <Route path="reportedposts" element={<ReportedPosts />} />
            {/* 추가적인 관리자 페이지들은 여기에 계속 정의 */}
          </Route>
          {/* ▲▲▲ 관리자 페이지 그룹 끝 ▲▲▲ */}

          {/* 인증 관련 페이지들은 Layout(헤더/푸터)을 사용하지 않는 경우가 많으므로 밖에 두거나, */}
          {/* 필요하다면 별도의 AuthLayout 등을 구성할 수 있습니다. 현재는 Layout 내에 배치된 것으로 보입니다. */}
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

        {/* --- Routes that DO NOT use the main Layout --- */}
        {/* ShortsVideoPage는 Layout을 사용하지 않는다면 이 위치가 적절합니다. */}
        <Route path="shorts" element={<ShortsVideoPage />} />

        {/* 404 Not Found 페이지는 모든 라우트 규칙 가장 마지막에 위치 */}
        <Route path="/*" element={<NotFound />} /> 
        {/* 참고: NotFound 페이지도 Layout을 사용하게 하려면 Layout 내부의 마지막에 배치해야 합니다. */}
        {/* 만약 Layout 바깥에 둔다면, NotFound 페이지는 헤더/푸터 없이 표시됩니다. */}
        {/* 현재는 Layout 내부에 있으므로 Layout의 헤더/푸터를 가집니다. */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;