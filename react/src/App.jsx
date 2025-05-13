import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Layout from "./layouts/Layout";
import GangwondoPage from "./pages/Area/GangwondoPage";
import CheckDelete from "./pages/Auth/CheckDelete";
import CheckInfo from "./pages/Auth/CheckInfo";
import DeleteAccount from "./pages/Auth/DeleteAccount";
import FailFindID from "./pages/Auth/FailFindID";
import FindID from "./pages/Auth/FindID";
import FindPwd from "./pages/Auth/FindPwd";
import FindPwd2 from "./pages/Auth/FindPwd2";
import LoginPage from "./pages/auth/LoginPage";
import SignUpForm from "./pages/Auth/SignUpForm";
import SignUpForm2 from "./pages/Auth/SignUpForm2";
import SuccessID from "./pages/Auth/SuccessID";
import SuccessPwd from "./pages/Auth/SuccessPwd";
import Freeboard from "./pages/Board/freeBoard";
import FreeboardDetail from "./pages/Board/freeboardDetail";
import FreeboardEdit from "./pages/Board/freeboardEdit";
import FreeboardWrite from "./pages/Board/freeboardWrite";
import Bookmark from "./pages/Bookmark/bookmark";
import Search from "./pages/Bookmark/search";
import Calendarpage from "./pages/Calendar/Calendarpage";
import CampingPage from "./pages/Category/CampingPage";
import HealingPage from "./pages/Category/HealingPage";
import MountainPage from "./pages/Category/MountainPage";
import ThemeParkPage from "./pages/Category/ThemeParkPage";
import Main from "./pages/Main/Main";
import Mypage from "./pages/Mypage/Mypage";
import Notice from "./pages/Notice/notice";
import NoticeDetail from "./pages/Notice/noticeDetail";
import Qna from "./pages/QnA/qna";
import QnaDetail from "./pages/QnA/qnaDetail";
import QnaEdit from "./pages/QnA/qnaEdit";
import QnaWrite from "./pages/QnA/qnaWrite";
import ShortsVideoPage from "./pages/Shorts/ShortsVideoPage";

import ManagerUserPage from './pages/Admin/ManagerUserPage';





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

          <Route path="/freeboard" element={<Freeboard />} />

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
        
        <Route path="/admin" element={<ManagerUserPage/>}/>


          <Route path="/notice" element={<div className="mainContentWithFixedHeader"><Notice /></div>} />

          <Route path="/noticeDetail" element={<div className="mainContentWithFixedHeader"><NoticeDetail /></div>} />

          <Route path="/freeboard" element={<div className="mainContentWithFixedHeader"><Freeboard /></div>} />

          <Route path="/freeboardDetail" element={<div className="mainContentWithFixedHeader"><FreeboardDetail /></div>} />

          <Route path="/freeboardWrite" element={<div className="mainContentWithFixedHeader"><FreeboardWrite /></div>} />

          <Route path="/freeboardEdit" element={<div className="mainContentWithFixedHeader"><FreeboardEdit /></div>} />

          <Route path="/qna" element={<Qna />} />

          <Route path="/qnaDetail" element={<QnaDetail />} />

          <Route path="/qnaWrite" element={<QnaWrite />} />

          <Route path="/qnaEdit" element={<QnaEdit />} />
       
        <Route path="/mypage" element={<div className="mypage"><Mypage /></div>} />
        <Route path="/bookmark" element={<div className="bookmark-wrapper"><Bookmark /></div>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/findid" element={<FindID />} />
        <Route path="/successid" element={<SuccessID />} />
        <Route path="/successpwd" element={<SuccessPwd />} />
        <Route path="/signupform" element={<SignUpForm />} />
        <Route path="/findpwd" element={<FindPwd />} />
        <Route path="/findpwd2" element={<FindPwd2 />} />
        <Route path="/failfindid" element={<FailFindID />} />
        <Route path="/deleteaccount" element={<DeleteAccount />} />
        <Route path="/checkinfo" element={<CheckInfo />} />
        <Route path="/checkdelete" element={<CheckDelete />} />
        <Route path="/admin" element={<ManagerUserPage />} />


        
      </Routes>
    </BrowserRouter>
  )
}
export default App