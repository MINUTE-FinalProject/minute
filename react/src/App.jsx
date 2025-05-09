import { BrowserRouter, Route, Routes } from "react-router-dom";
import FreeBoard from "../../react/src/pages/freeBoard";
import FreeboardDetail from "../../react/src/pages/freeboardDetail";
import FreeboardEdit from "../../react/src/pages/freeboardEdit";
import FreeboardWrite from "../../react/src/pages/freeboardWrite";
import Notice from "../../react/src/pages/notice";
import NoticeDetail from "../../react/src/pages/noticeDetail";
import Qna from "../../react/src/pages/qna";
import QnaDetail from "../../react/src/pages/qnaDetail";
import QnaEdit from "../../react/src/pages/qnaEdit";
import QnaWrite from "../../react/src/pages/qnaWrite";
import Test from "../../react/src/pages/test";
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

import Calendarpage from "./pages/Calendarpage";
import CheckDelete from "./pages/CheckDelete";
import CheckInfo from "./pages/CheckInfo";
import DeleteAccount from "./pages/DeleteAccount";
import FailFindID from "./pages/FailFindID";
import FindID from "./pages/FindID";
import FindPwd from "./pages/FindPwd";
import FindPwd2 from "./pages/FindPwd2";
import SignUpForm2 from "./pages/SignUpForm2";
import SuccessID from "./pages/SuccessID";
import SuccessPwd from "./pages/SuccessPwd";
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

        <Route path="/findid" element={<FindID/>}/>
        <Route path="/successid" element={<SuccessID/>}/>
        <Route path="/successpwd" element={<SuccessPwd/>}/>
        <Route path="/signupform2" element={<SignUpForm2/>}/>
        <Route path="/findpwd" element={<FindPwd/>}/>
        <Route path="/findpwd2" element={<FindPwd2/>}/>
        <Route path="/failfindid" element={<FailFindID/>}/>
        <Route path="/deleteaccount" element={<DeleteAccount/>}/>
        <Route path="/checkinfo" element={<CheckInfo/>}/>
        <Route path="/checkdelete" element={<CheckDelete/>}/>

      </Routes>
    </BrowserRouter>
  )
}
export default App
