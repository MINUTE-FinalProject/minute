// src/pages/FreeBoard/FreeBoard.js (또는 해당 파일의 실제 경로)
import { useEffect, useState } from "react"; // React import 추가
import { Link, useNavigate } from "react-router-dom";
import banner from "../../assets/images/banner.png";
import FreeBoardStyle from "./freeBoard.module.css";

import Modal from "../../components/Modal/Modal"; // Modal 컴포넌트 import
import Pagination from "../../components/Pagination/Pagination";

import reportOffIcon from "../../assets/images/able-alarm.png";
import likeOffIcon from "../../assets/images/b_thumbup.png";
import reportOnIcon from "../../assets/images/disable-alarm.png";
import searchButtonIcon from "../../assets/images/search_icon.png";
import likeOnIcon from "../../assets/images/thumbup.png";

function FreeBoard() {
    const [activeTab, setActiveTab] = useState("all");
    const [allPosts, setAllPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    // 모달 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalProps, setModalProps] = useState({
        title: '',
        message: '',
        onConfirm: null,
        confirmText: '확인',
        cancelText: null,
        type: 'default',
        confirmButtonType: 'primary',
        cancelButtonType: 'secondary'
    });

    useEffect(() => {
        const fetchedPosts = Array.from({ length: 53 }, (_, i) => ({
            id: i + 1,
            type: "글",
            title: `자유게시판 ${activeTab === "myPosts" ? "내 글 " : ""}테스트 제목 ${i + 1}`,
            author: `사용자${(i % 5) + 1}`,
            date: `25.05.${String(10 + (i % 15)).padStart(2, "0")}`,
            views: Math.floor(Math.random() * 1000),
            likes: Math.floor(Math.random() * 200),
            isLiked: i % 3 === 0,
            isReported: i % 10 === 0, // 이미 신고된 게시물 예시
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
        // console.log("Selected Tab:", tabName); // 이전 코드에서는 console.log 있었음
    };

    const handlePostLikeToggle = (e, postId) => {
        e.stopPropagation();
        // console.log(`Toggling like for post ${postId}`); // 이전 코드
        setAllPosts((prevPosts) =>
            prevPosts.map((p) =>
                p.id === postId
                    ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
                    : p
            )
        );
    };

    // --- 게시물 신고 처리 (Modal 적용) ---
    const processActualPostReport = (postIdToReport) => {
        console.log(`게시글 ID ${postIdToReport} 신고 처리 실행`);
        setAllPosts((prevPosts) =>
            prevPosts.map((p) => (p.id === postIdToReport ? { ...p, isReported: true } : p))
        );
        // TODO: API로 실제 신고 로직 호출

        setModalProps({
            title: "신고 완료",
            message: `게시글 ID ${postIdToReport}이(가) 성공적으로 신고되었습니다.`,
            confirmText: "확인",
            type: "success", // 성공 시 핑크색 버튼
            confirmButtonType: 'primary'
        });
        setIsModalOpen(true);
    };

    const handlePostReportToggle = (e, postId, postTitle) => {
        e.stopPropagation();
        
        const postToReport = allPosts.find(p => p.id === postId);
        // 버튼이 disabled 상태이므로 이 조건은 사실상 불필요하나, 방어적으로 남겨둘 수 있음
        if (postToReport && postToReport.isReported) { 
            setModalProps({
                title: "알림",
                message: "이미 신고된 게시글입니다.",
                confirmText: "확인",
                type: "warning", 
                confirmButtonType: 'primary'
            });
            setIsModalOpen(true);
            return;
        }

        setModalProps({
            title: "게시글 신고",
            message: `"${postTitle}" (ID: ${postId}) 게시글을 정말로 신고하시겠습니까?\n신고는 취소할 수 없습니다.`,
            onConfirm: () => processActualPostReport(postId),
            confirmText: "신고하기",
            cancelText: "취소",
            type: "warning",
            confirmButtonType: 'danger' // 신고는 주요 작업이므로 danger
        });
        setIsModalOpen(true);
    };

    const handleRowClick = (postId) => {
        navigate(`/freeboardDetail/${postId}`);
    };

    return (
        <>
            <div className={FreeBoardStyle["board-container"]}>
                <div className={FreeBoardStyle["board-header"]}>
                    <Link to="/freeboard" className={FreeBoardStyle["board-title-link"]}>
                        <h1>자유게시판</h1>
                    </Link>
                    <nav className={FreeBoardStyle["board-navigation"]}>
                        <button
                            className={`${FreeBoardStyle["nav-button"]} ${activeTab === "all" ? FreeBoardStyle["active-tab"] : FreeBoardStyle["inactive-tab"]}`}
                            onClick={() => handleTabClick("all")}
                        >
                            전체 목록
                        </button>
                        <button
                            className={`${FreeBoardStyle["nav-button"]} ${activeTab === "myPosts" ? FreeBoardStyle["active-tab"] : FreeBoardStyle["inactive-tab"]}`}
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
                        <select name="sortOrder" id="sortOrderSelect" className={`${FreeBoardStyle["sort-select"]} ${FreeBoardStyle["control-element"]}`}>
                            <option value="latest">최신순</option>
                            <option value="views">조회순</option>
                            <option value="likes">좋아요순</option>
                        </select>
                        <select name="contentType" id="contentTypeSelect" className={`${FreeBoardStyle["type-select"]} ${FreeBoardStyle["control-element"]}`}>
                            <option value="all">전체</option>
                            <option value="post">글</option>
                            <option value="comment">댓글</option>
                        </select>
                    </div>
                    <div className={FreeBoardStyle["search-area"]}>
                        <input type="text" placeholder="Search" className={`${FreeBoardStyle["search-input"]} ${FreeBoardStyle["control-element"]}`} aria-label="게시글 검색" />
                        <button className={`${FreeBoardStyle["search-button"]} ${FreeBoardStyle["control-element"]}`} aria-label="검색">
                            <img src={searchButtonIcon} alt="검색 아이콘" className={FreeBoardStyle["search-button-icon"]} />
                        </button>
                    </div>
                </div>

                <div className={FreeBoardStyle["board-list-container"]}>
                    <table className={FreeBoardStyle["board-table"]}>
                        <thead>
                            <tr>
                                <th scope="col">NO</th><th scope="col">타입</th><th scope="col">제목</th>
                                <th scope="col">작성자</th><th scope="col">날짜</th><th scope="col">조회수</th>
                                <th scope="col">좋아요</th><th scope="col">신고</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPostsToDisplay.length > 0 ? (
                                currentPostsToDisplay.map((post) => (
                                    <tr key={post.id} onClick={() => handleRowClick(post.id)} className={FreeBoardStyle["board-row"]}>
                                        <td>{post.id}</td>
                                        <td>{post.type}</td>
                                        <td className={FreeBoardStyle["post-title"]} onClick={(e) => e.stopPropagation()}>
                                            <Link to={`/freeboardDetail/${post.id}`}>{post.title}</Link>
                                        </td>
                                        <td>{post.author}</td>
                                        <td>{post.date}</td>
                                        <td>{post.views}</td>
                                        <td>
                                            <button
                                                className={`${FreeBoardStyle["like-button"]} ${post.isLiked ? FreeBoardStyle.toggled : ""}`}
                                                onClick={(e) => handlePostLikeToggle(e, post.id)}
                                                aria-pressed={post.isLiked}
                                                aria-label={post.isLiked ? "좋아요 취소" : "좋아요"}
                                            >
                                                <img src={post.isLiked ? likeOnIcon : likeOffIcon} alt={post.isLiked ? "좋아요 된 상태" : "좋아요 안된 상태"} className={FreeBoardStyle["button-icon"]} />
                                            </button>
                                            <span className={FreeBoardStyle["like-count"]}>{post.likes}</span>
                                        </td>
                                        <td>
                                            <button
                                                className={`${FreeBoardStyle["report-button"]} ${post.isReported ? FreeBoardStyle.toggled : ""}`}
                                                onClick={(e) => handlePostReportToggle(e, post.id, post.title)} // post.title 추가 전달
                                                aria-pressed={post.isReported} // isReported로 aria-pressed 사용
                                                disabled={post.isReported} // isReported가 true면 disabled
                                                aria-label={post.isReported ? "신고됨" : "신고하기"}
                                            >
                                                <img src={post.isReported ? reportOnIcon : reportOffIcon} alt={post.isReported ? "신고 된 상태" : "신고 안된 상태"} className={FreeBoardStyle["button-icon"]} />
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
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                        )}
                    </div>
                    <div className={FreeBoardStyle["write-button-container"]}>
                        <Link to="/freeboardWrite" className={FreeBoardStyle["write-button"]}>
                            작성
                        </Link>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                {...modalProps}
            />
        </>
    );
}

export default FreeBoard;