import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate 추가
import banner from "../../assets/images/banner.png";
import FreeBoardStyle from "./freeBoard.module.css";

import Pagination from "../../components/Pagination/Pagination";

import reportOffIcon from "../../assets/images/able-alarm.png";
import likeOffIcon from "../../assets/images/b_thumbup.png";
import reportOnIcon from "../../assets/images/disable-alarm.png";
import likeOnIcon from "../../assets/images/thumbup.png";

import searchButtonIcon from "../../assets/images/search_icon.png";

function FreeBoard() {
  const [activeTab, setActiveTab] = useState("all");
  const [allPosts, setAllPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const fetchedPosts = Array.from({ length: 53 }, (_, i) => ({
      id: i + 1,
      type: "글",
      title: `자유게시판 ${activeTab === "myPosts" ? "내 글 " : ""}테스트 제목 ${
        i + 1
      }`,
      author: `사용자${(i % 5) + 1}`,
      date: `25.05.${String(10 + (i % 15)).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 200),
      isLiked: i % 3 === 0,
      isReported: i % 10 === 0,
    }));
    setAllPosts(fetchedPosts);
    setCurrentPage(1);
  }, [activeTab]);

  const totalPages = Math.ceil(allPosts.length / itemsPerPage);
  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPostsToDisplay = allPosts.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    console.log("Selected Tab:", tabName);
  };

  const handlePostLikeToggle = (e, postId) => {
    e.stopPropagation(); // 이벤트 전파 중단
    console.log(`Toggling like for post ${postId}`);
    setAllPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const handlePostReportToggle = (e, postId) => {
    e.stopPropagation(); // 이벤트 전파 중단
    console.log(`Toggling report for post ${postId}`);
    setAllPosts((prevPosts) =>
      prevPosts.map((p) => (p.id === postId ? { ...p, isReported: true } : p))
    );
  };

  // 행 클릭 시 상세 페이지로 이동하는 함수
  const handleRowClick = (postId) => {
    navigate(`/freeboardDetail/${postId}`);
  };

  return (
    <div className={FreeBoardStyle["board-container"]}>
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
              <th scope="col">날짜</th>
              <th scope="col">조회수</th>
              <th scope="col">좋아요</th>
              <th scope="col">신고</th>
            </tr>
          </thead>
          <tbody>
            {currentPostsToDisplay.length > 0 ? (
              currentPostsToDisplay.map((post) => (
                <tr
                  key={post.id}
                  onClick={() => handleRowClick(post.id)} // 행 클릭 핸들러 추가
                  className={FreeBoardStyle["board-row"]} // 클릭 가능한 행임을 나타내는 스타일 (CSS 모듈에 추가 필요)
                >
                  <td>{post.id}</td>
                  <td>{post.type}</td>
                  <td
                    className={FreeBoardStyle["post-title"]}
                    onClick={(e) => e.stopPropagation()} // 제목 링크 클릭 시 행 클릭 이벤트 중복 방지
                  >
                    {/* 상세 페이지 경로 수정 */}
                    <Link to={`/freeboardDetail/${post.id}`}>{post.title}</Link>
                  </td>
                  <td>{post.author}</td>
                  <td>{post.date}</td>
                  <td>{post.views}</td>
                  <td>
                    <button
                      className={`${FreeBoardStyle["like-button"]} ${
                        post.isLiked ? FreeBoardStyle.toggled : ""
                      }`}
                      onClick={(e) => handlePostLikeToggle(e, post.id)} // 이벤트 객체(e) 전달
                      aria-pressed={post.isLiked}
                      aria-label={post.isLiked ? "좋아요 취소" : "좋아요"}
                    >
                      <img
                        src={post.isLiked ? likeOnIcon : likeOffIcon}
                        alt={
                          post.isLiked ? "좋아요 된 상태" : "좋아요 안된 상태"
                        }
                        className={FreeBoardStyle["button-icon"]}
                      />
                    </button>
                    <span className={FreeBoardStyle["like-count"]}>
                      {post.likes}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`${FreeBoardStyle["report-button"]} ${
                        post.isReported ? FreeBoardStyle.toggled : ""
                      }`}
                      onClick={(e) => handlePostReportToggle(e, post.id)} // 이벤트 객체(e) 전달
                      aria-pressed={post.isReported}
                      disabled={post.isReported}
                      aria-label={post.isReported ? "신고됨" : "신고하기"}
                    >
                      <img
                        src={post.isReported ? reportOnIcon : reportOffIcon}
                        alt={
                          post.isReported ? "신고 된 상태" : "신고 안된 상태"
                        }
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
          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
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