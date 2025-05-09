import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import FreeBoard from "./pages/freeBoard";
import FreeboardDetail from "./pages/freeboardDetail";
import FreeboardEdit from "./pages/freeboardEdit";
import FreeboardWrite from "./pages/freeboardWrite";
import Notice from "./pages/notice";
import NoticeDetail from "./pages/noticeDetail";
import Qna from "./pages/qna";
import QnaDetail from "./pages/qnaDetail";
import QnaEdit from "./pages/qnaEdit";
import QnaWrite from "./pages/qnaWrite";
import Test from "./pages/test";


function Home() {
  return (
    <div>
      <h1>홈페이지</h1>

      <nav>
        <Link to="/notice">
          <button type="button">
            공지사항페이지
          </button>
        </Link>

        <Link to="/noticeDetail">
          <button type="button">
            공지사항상세페이지
          </button>
        </Link>

        <Link to="/freeboard">
          <button type="button">
            자유게시판페이지
          </button>
        </Link>

        <Link to="/test">
          <button type="button">
            테스트페이지-자유게시판
          </button>
        </Link>

        <Link to="/freeboardDetail">
          <button type="button">
            자유게시판상세페이지
          </button>
        </Link>

        <Link to="/freeboardWrite">
          <button type="button">
            자유게시판작성페이지
          </button>
        </Link>

        <Link to="/freeboardEdit">
          <button type="button">
            자유게시판수정페이지
          </button>
        </Link>

        <Link to="/qna">
          <button type="button">
            문의페이지
          </button>
        </Link>

        <Link to="/qnaDetail">
          <button type="button">
            문의상세페이지
          </button>
        </Link>

        <Link to="/qnaWrite">
          <button type="button">
            문의작성페이지
          </button>
        </Link>

        <Link to="/qnaEdit">
          <button type="button">
            문의수정페이지
          </button>
        </Link>
      </nav>
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>

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
      </Routes>
    </BrowserRouter>
  );
}

export default App
