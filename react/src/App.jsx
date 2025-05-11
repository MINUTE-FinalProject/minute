import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Layout from "./layouts/Layout";
import Main from "./pages/Main/Main";
import CampingPage from "./pages/Category/CampingPage";
import HealingPage from "./pages/Category/HealingPage";
import MountainPage from "./pages/Category/MountainPage";
import ThemeParkPage from "./pages/Category/ThemeParkPage";
import ShortsVideoPage from "./pages/Shorts/ShortsVideoPage";
import GangwondoPage from "./pages/Area/GangwondoPage";
import Mypage from "./pages/Mypage/Mypage";
import Calendarpage from "./pages/Calendar/Calendarpage";
import Bookmark from "./pages/Bookmark/bookmark";
import Search from "./pages/Bookmark/search";
import Notice from "./pages/Notice/notice";
import NoticeDetail from "./pages/Notice/noticeDetail";
import FreeBoard from "./pages/Board/freeBoard";
import FreeboardDetail from "./pages/Board/freeboardDetail";
import FreeboardWrite from "./pages/Board/freeboardWrite";
import FreeboardEdit from "./pages/Board/freeboardEdit";
import Qna from "./pages/QnA/qna";
import QnaDetail from "./pages/QnA/qnaDetail";
import QnaWrite from "./pages/QnA/qnaWrite";
import QnaEdit from "./pages/QnA/qnaEdit";
import FindID from "./pages/Auth/FindID";
import SuccessID from "./pages/Auth/SuccessID";
import SuccessPwd from "./pages/Auth/SuccessPwd";
import SignUpForm from "./pages/Auth/SignUpForm";  
import SignUpForm2 from "./pages/Auth/SignUpForm2";
import FindPwd from "./pages/Auth/FindPwd";
import FindPwd2 from "./pages/Auth/FindPwd2";
import FailFindID from "./pages/Auth/FailFindID";
import DeleteAccount from "./pages/Auth/DeleteAccount";
import CheckInfo from "./pages/Auth/CheckInfo";
import CheckDelete from "./pages/Auth/CheckDelete";
import Test from "./pages/test";
import LoginPage from "./pages/auth/LoginPage";

import ManagerMyPage from "./pages/Admin/ManagerMyPage";
import ManagerUserPage from "./pages/Admin/ManagerUserPage";
import MemberDetail from "./pages/Admin/MemberDetail";
import ReportedMembers from "./pages/Admin/ReportedMembers";



function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route index element={<Main/>} />
        <Route path="/camping" element={<CampingPage />} />
        <Route path="/healing" element={<HealingPage />} />
        <Route path="/mountain" element={<MountainPage />} />
        <Route path="/themepark" element={<ThemeParkPage />} />
        <Route path="/shorts" element={<ShortsVideoPage />} />
        <Route path="/area" element={<GangwondoPage />} />

        <Route path="/mypage" element={<div className="mypage"><Mypage /></div>} />
        <Route path="/calendar" element={<div className="mypage"><Calendarpage /></div>} />
        <Route path="/bookmark" element={<div className="bookmark-wrapper"><Bookmark /></div>} />
        <Route path="/search" element={<div className="search-wrapper"><Search /></div>} />

        <Route path="/notice" element={<Notice />} />

        <Route path="/noticeDetail" element={<NoticeDetail />} />

        <Route path="/freeboard" element={<FreeBoard />} />

        <Route path="/test" element={<Test />} />

        <Route path="/freeboardDetail" element={<FreeboardDetail />} />

        <Route path="/freeboardWrite" element={<FreeboardWrite />} />

        <Route path="/freeboardEdit" element={<FreeboardEdit />} />

        <Route path="/qna" element={<Qna />} />

        <Route path="/qnaDetail" element={<QnaDetail />} />

        <Route path="/qnaWrite" element={<QnaWrite />} />

        <Route path="/qnaEdit" element={<QnaEdit />} />

        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/findid" element={<FindID/>}/>
        <Route path="/successid" element={<SuccessID/>}/>
        <Route path="/successpwd" element={<SuccessPwd/>}/>
        <Route path="/signupform" element={<SignUpForm/>}/>
        <Route path="/signupform2" element={<SignUpForm2/>}/>
        <Route path="/findpwd" element={<FindPwd/>}/>
        <Route path="/findpwd2" element={<FindPwd2/>}/>
        <Route path="/failfindid" element={<FailFindID/>}/>
        <Route path="/deleteaccount" element={<DeleteAccount/>}/>
        <Route path="/checkinfo" element={<CheckInfo/>}/>
        <Route path="/checkdelete" element={<CheckDelete/>}/>
        <Route path="/manageruserpage" element={<ManagerUserPage/>}/>
        <Route path="/reportedmembers" element={<ReportedMembers />} />
        <Route path="/member-detail/:id" element={<MemberDetail />} />
        <Route path="/managermypage" element={<ManagerMyPage />} />

      </Routes>
    </BrowserRouter>
  )
}
export default App
