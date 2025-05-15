import { useEffect, useState } from "react"; // useEffect 추가
import { Link } from "react-router-dom";
import banner from "../../assets/images/banner.png";
import FreeBoardStyle from "./freeBoard.module.css"; // 사용하고 계신 CSS 모듈

// Pagination 컴포넌트 임포트 (경로는 제공해주신 이미지 기반)
import Pagination from "../../components/Pagination/Pagination";

import reportOffIcon from "../../assets/images/able-alarm.png";
import likeOffIcon from "../../assets/images/b_thumbup.png";
import reportOnIcon from "../../assets/images/disable-alarm.png";
import likeOnIcon from "../../assets/images/thumbup.png";

import searchButtonIcon from "../../assets/images/search_icon.png";

function FreeBoard() {
  const [activeTab, setActiveTab] = useState("all");

  // --- 페이지네이션 및 게시물 데이터 상태 ---
  const [allPosts, setAllPosts] = useState([]); // 전체 게시물 배열
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 페이지 당 보여줄 게시물 수

  // --- 기존 단일 포스트 예시용 상태 (참고용 또는 다른 용도로 활용 가능) ---
  // const [isLikedForSinglePost, setIsLikedForSinglePost] = useState(true);
  // const [isReportedForSinglePost, setIsReportedForSinglePost] = useState(false);
  // const handleLikeToggleForSinglePost = () => setIsLikedForSinglePost(!isLikedForSinglePost);
  // const handleReportToggleForSinglePost = () => setIsReportedForSinglePost(!isReportedForSinglePost);
  // ------------------------------------

  // --- 목업 데이터 생성 및 로드 ---
  useEffect(() => {
    // 실제 애플리케이션에서는 API를 통해 데이터를 가져옵니다.
    const fetchedPosts = Array.from({ length: 53 }, (_, i) => ({ // 예시: 53개의 게시물
      id: i + 1,
      type: "글",
      title: `자유게시판 ${activeTab === "myPosts" ? "내 글 " : ""}테스트 제목 ${i + 1}`,
      author: `사용자${(i % 5) + 1}`,
      date: `25.05.${String(10 + (i % 15)).padStart(2, '0')}`, // 날짜 형식 맞춤
      views: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 200),
      isLiked: i % 3 === 0, // 각 포스트별 좋아요 상태 (목업)
      isReported: i % 10 === 0, // 각 포스트별 신고 상태 (목업)
    }));
    setAllPosts(fetchedPosts);
    setCurrentPage(1); // 데이터가 변경되면 1페이지로 리셋 (필요에 따라)
  }, [activeTab]); // activeTab이 변경될 때마다 데이터 다시 로드 (예시)

  // --- 페이지네이션 로직 ---
  const totalPages = Math.ceil(allPosts.length / itemsPerPage);
  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPostsToDisplay = allPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // 페이지 변경 시 스크롤을 맨 위로 올리는 로직 (선택 사항)
    // window.scrollTo(0, 0);
  };
  // ------------------------

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    // 실제 데이터 로딩 로직:
    // if (tabName === 'all') fetchAllPostsAPI().then(data => setAllPosts(data));
    // else fetchMyPostsAPI().then(data => setAllPosts(data));
    console.log("Selected Tab:", tabName);
  };

  // 각 게시물 행의 좋아요/신고 토글 핸들러 (실제 구현 시 ID 기반으로 상태 업데이트 필요)
  const handlePostLikeToggle = (postId) => {
    console.log(`Toggling like for post ${postId}`);
    // 예시: setAllPosts(prevPosts => prevPosts.map(p => p.id === postId ? {...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes -1 : p.likes + 1} : p));
  };

  const handlePostReportToggle = (postId) => {
    console.log(`Toggling report for post ${postId}`);
    // 예시: setAllPosts(prevPosts => prevPosts.map(p => p.id === postId ? {...p, isReported: true} : p)); // 신고는 보통 취소 안됨
  };


  return (
    <div className={FreeBoardStyle["board-container"]}>
      {/* 헤더 */}
      <div className={FreeBoardStyle["board-header"]}>
        <Link to="/freeboard" className={FreeBoardStyle["board-title-link"]}>
          <h1>자유게시판</h1>
        </Link>
        <nav className={FreeBoardStyle["board-navigation"]}>
          <button
            className={`${FreeBoardStyle["nav-button"]} ${
              activeTab === "all"
                ? FreeBoardStyle["active-tab"]
                : FreeBoardStyle["inactive-tab"]
            }`}
            onClick={() => handleTabClick("all")}
          >
            전체 목록
          </button>
          <button
            className={`${FreeBoardStyle["nav-button"]} ${
              activeTab === "myPosts"
                ? FreeBoardStyle["active-tab"]
                : FreeBoardStyle["inactive-tab"]
            }`}
            onClick={() => handleTabClick("myPosts")}
          >
            내 글
          </button>
        </nav>
      </div>

      <div className={FreeBoardStyle["board-banner"]}>
        <img src={banner} alt="게시판 배너" />
      </div>

      <div className={FreeBoardStyle["board-controls"]}>
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
            <img
              src={searchButtonIcon}
              alt="검색 아이콘"
              className={FreeBoardStyle["search-button-icon"]}
            />
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
            {currentPostsToDisplay.length > 0 ? (
              currentPostsToDisplay.map((post) => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>{post.type}</td>
                  <td className={FreeBoardStyle["post-title"]}>
                    <Link to={`/post/${post.id}`}>{post.title}</Link>
                  </td>
                  <td>{post.author}</td>
                  <td>{post.date}</td>
                  <td>{post.views}</td>
                  <td>
                    <button
                      className={`${FreeBoardStyle["like-button"]} ${
                        post.isLiked ? FreeBoardStyle.toggled : "" // 'toggled' 클래스는 freeBoard.module.css에 정의되어 있어야 함
                      }`}
                      onClick={() => handlePostLikeToggle(post.id)}
                      aria-pressed={post.isLiked}
                      aria-label={post.isLiked ? "좋아요 취소" : "좋아요"}
                    >
                      <img
                        src={post.isLiked ? likeOnIcon : likeOffIcon}
                        alt={post.isLiked ? "좋아요 된 상태" : "좋아요 안된 상태"}
                        className={FreeBoardStyle["button-icon"]}
                      />
                    </button>
                    <span className={FreeBoardStyle["like-count"]}>{post.likes}</span>
                  </td>
                  <td>
                    <button
                      className={`${FreeBoardStyle["report-button"]} ${
                        post.isReported ? FreeBoardStyle.toggled : ""
                      }`}
                      onClick={() => handlePostReportToggle(post.id)}
                      aria-pressed={post.isReported}
                      disabled={post.isReported} // 이미 신고된 경우 버튼 비활성화
                      aria-label={post.isReported ? "신고됨" : "신고하기"}
                    >
                      <img
                        src={post.isReported ? reportOnIcon : reportOffIcon}
                        alt={post.isReported ? "신고 된 상태" : "신고 안된 상태"}
                        className={FreeBoardStyle["button-icon"]}
                      />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">표시할 게시물이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={FreeBoardStyle["board-footer"]}>
        <div className={FreeBoardStyle["pagination-wrapper"]}>
          {/* 기존 버튼들 대신 Pagination 컴포넌트 사용 */}
          {totalPages > 0 && ( // totalPages가 0보다 클 때만 페이지네이션 표시
             <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                // pageNeighbours={1} // 선택적 prop: 현재 페이지 좌우로 몇 개의 페이지 번호를 더 보여줄 지
             />
          )}
        </div>
        <div className={FreeBoardStyle["write-button-container"]}>
          <Link
            to="/freeboardWrite"
            className={FreeBoardStyle["write-button"]}
          >
            작성
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FreeBoard;