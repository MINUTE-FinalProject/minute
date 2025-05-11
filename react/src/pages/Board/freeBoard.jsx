import { useState } from "react"; // useState import 확인
import { Link } from "react-router-dom";
import banner from "../../assets/images/banner.png";
import FreeBoardStyle from "./freeBoard.module.css";

function FreeBoard() {
  // --- 상태 추가 ---
  const [activeTab, setActiveTab] = useState("all"); // 'all' 또는 'myPosts'

  // --- 기존 상태 및 핸들러 (예시) ---
  const [isLiked, setIsLiked] = useState(true);
  const [isReported, setIsReported] = useState(false);
  const postIdExample = 12;
  const handleLikeToggle = () => setIsLiked(!isLiked);
  const handleReportToggle = () => setIsReported(!isReported);
  // ------------------------------------

  // --- 탭 클릭 핸들러 ---
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    // 여기에 실제 데이터 로딩 또는 필터링 로직 추가
    // 예: if (tabName === 'all') fetchAllPosts(); else fetchMyPosts();
    console.log("Selected Tab:", tabName); // 동작 확인용 로그
  };
  // --------------------

  return (
    <div className={FreeBoardStyle["board-container"]}>
      {/* 헤더 */}
      <div className={FreeBoardStyle["board-header"]}>
        <Link to="/freeboard" className={FreeBoardStyle["board-title-link"]}>
          <h1>자유게시판</h1>
        </Link>
        <nav className={FreeBoardStyle["board-navigation"]}>
          {/* 버튼 className 및 onClick 수정 */}
          <button
            className={`${FreeBoardStyle["nav-button"]} ${
              activeTab === "all"
                ? FreeBoardStyle["active-tab"]
                : FreeBoardStyle["inactive-tab"]
            }`}
            onClick={() => handleTabClick("all")} // 클릭 시 상태 변경
          >
            전체 목록
          </button>
          <button
            className={`${FreeBoardStyle["nav-button"]} ${
              activeTab === "myPosts"
                ? FreeBoardStyle["active-tab"]
                : FreeBoardStyle["inactive-tab"]
            }`}
            onClick={() => handleTabClick("myPosts")} // 클릭 시 상태 변경
          >
            내 글
          </button>
        </nav>
      </div>

      {/* --- 배너, 컨트롤 영역, 테이블, 푸터 (이전과 동일) --- */}
      <div className={FreeBoardStyle["board-banner"]}>
        <img src={banner} alt="게시판 배너" />
      </div>

      <div className={FreeBoardStyle["board-controls"]}>
        {/* ... Controls ... */}
        <div className={FreeBoardStyle["controls-left"]}>
          <select
            name="sortOrder"
            id="sortOrderSelect"
            className={`${FreeBoardStyle["sort-select"]} ${FreeBoardStyle["control-element"]}`}
          >
            <option value="latest">최신순</option>
            <option value="views">조회순</option>
            <option value="likes">좋아요순</option>
          </select>
          <select
            name="contentType"
            id="contentTypeSelect"
            className={`${FreeBoardStyle["type-select"]} ${FreeBoardStyle["control-element"]}`}
          >
            <option value="all">전체</option>
            <option value="post">글</option>
            <option value="comment">댓글</option>
          </select>
        </div>
        <div className={FreeBoardStyle["search-area"]}>
          <input
            type="text"
            placeholder="Search"
            className={`${FreeBoardStyle["search-input"]} ${FreeBoardStyle["control-element"]}`}
            aria-label="게시글 검색"
          />
          <button
            className={`${FreeBoardStyle["search-button"]} ${FreeBoardStyle["control-element"]}`}
            aria-label="검색"
          >
            <span>🔍</span>
          </button>
        </div>
      </div>

      <div className={FreeBoardStyle["board-list-container"]}>
        <table className={FreeBoardStyle["board-table"]}>
          <thead>
            <tr>
              <th scope="col">NO</th>
              <th scope="col">타입</th>
              <th scope="col">제목</th>
              <th scope="col">작성자</th>
              <th scope="col">작성날짜</th>
              <th scope="col">조회수</th>
              <th scope="col">좋아요</th>
              <th scope="col">신고</th>
            </tr>
          </thead>
          <tbody>
            {/* Example Row */}
            <tr>
              <td>{postIdExample}</td>
              <td>글</td>
              <td className={FreeBoardStyle["post-title"]}>
                <Link to={`/post/${postIdExample}`}>
                  결국 국수는 설렁탕 vs 소금?
                </Link>
              </td>
              <td>관리자</td>
              <td>25.04.21</td>
              <td>111</td>
              <td>
                <button
                  className={`${FreeBoardStyle["like-button"]} ${
                    isLiked ? FreeBoardStyle.toggled : ""
                  }`}
                  onClick={handleLikeToggle}
                  aria-pressed={isLiked}
                  aria-label={`...`}
                >
                  <span>👍</span>
                </button>
                <span className={FreeBoardStyle["like-count"]}>111</span>
              </td>
              <td>
                <button
                  className={`${FreeBoardStyle["report-button"]} ${
                    isReported ? FreeBoardStyle.toggled : ""
                  }`}
                  onClick={handleReportToggle}
                  aria-pressed={isReported}
                  aria-label={`...`}
                >
                  <span>🚩</span>
                </button>
              </td>
            </tr>
            {/* More Rows... */}
          </tbody>
        </table>
      </div>

      <div className={FreeBoardStyle["board-footer"]}>
        <div className={FreeBoardStyle["pagination-wrapper"]}>
          <div className={FreeBoardStyle.pagination}>
            <button aria-label="이전 페이지">&lt;</button>
            {/* Pagination active class should be handled based on pagination state, not the tab state */}
            <button
              aria-current="page"
              className={/* testStyle.active - Pagination logic needed */ " "}
            >
              1
            </button>
            <button>2</button>
            <button>3</button>
            <button aria-label="다음 페이지">&gt;</button>
          </div>
        </div>
        <div className={FreeBoardStyle["write-button-container"]}>
          <Link to="/write" className={FreeBoardStyle["write-button"]}>
            작성
          </Link>
        </div>
      </div>
      {/* ---------------------------------------- */}
    </div>
  );
}

export default FreeBoard;
