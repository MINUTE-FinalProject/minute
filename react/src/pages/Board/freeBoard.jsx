// src/pages/FreeBoard/FreeBoard.jsx
import axios from "axios"; // axios import 추가
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import banner from "../../assets/images/banner.png";
import FreeBoardStyle from "../../assets/styles/freeboard.module.css";

import Modal from "../../components/Modal/Modal";
import Pagination from "../../components/Pagination/Pagination";

import reportOffIcon from "../../assets/images/able-alarm.png";
import likeOffIcon from "../../assets/images/b_thumbup.png";
import reportOnIcon from "../../assets/images/disable-alarm.png";
import searchButtonIcon from "../../assets/images/search_icon.png";
import likeOnIcon from "../../assets/images/thumbup.png";

const API_BASE_URL = "http://localhost:8080/api/v1";

function FreeBoard() {
    const [activeTab, setActiveTab] = useState("all"); // "all", "myActivity"
    const [posts, setPosts] = useState([]); // API로부터 받은 게시글 또는 댓글 목록
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // 페이징 상태
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 10; // 한 페이지에 보여줄 항목 수

    // 필터링 및 정렬 상태
    const [sortOption, setSortOption] = useState("latest"); // "latest", "views", "likes"
    const [searchQuery, setSearchQuery] = useState("");
    const [currentSearch, setCurrentSearch] = useState(""); // 실제 검색 실행 시 사용될 검색어
    
    // "내 글" 탭 내부 필터: "myPosts" (내 게시글), "myComments" (내 댓글)
    const [myContentType, setMyContentType] = useState("myPosts"); 

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

    const getToken = () => localStorage.getItem("token");
    const getUserId = () =>localStorage.getItem("userId");

    const isUserLoggedIn = () => !!getToken();

    // 날짜 포맷팅 함수 (간단 버전)
    const formatDate = (dateString) => {
        if (!dateString) return "";
        // 예: "2025-05-29T10:00:00" -> "25.05.29"
        // 실제 프로젝트에서는 date-fns 또는 moment.js 사용 권장
        try {
            const date = new Date(dateString);
            const year = date.getFullYear().toString().slice(-2);
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");
            return `${year}.${month}.${day}`;
        } catch (e) {
            return dateString; // 파싱 실패 시 원본 반환
        }
    };


    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        let url = "";
        const params = {
            page: currentPage - 1, // 백엔드는 0-indexed page
            size: itemsPerPage,
            sort: sortOption === "latest" ? "postId,desc" : // 또는 postCreatedAt,desc - 백엔드 DTO 필드명 기준
                  sortOption === "views" ? "postViewCount,desc" :
                  sortOption === "likes" ? "postLikeCount,desc" : "postId,desc",
        };

        const headers = {};
        const token = getToken();
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        if (activeTab === "all") {
            url = `${API_BASE_URL}/board/free`;
            if (currentSearch) {
                params.searchKeyword = currentSearch;
            }
        } else if (activeTab === "myActivity") {
            const currentUserId = getUserId();
            if (!currentUserId) {
                setIsModalOpen(true);
                setModalProps({
                    title: "로그인 필요",
                    message: "내 활동을 보려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?",
                    confirmText: "로그인",
                    cancelText: "취소",
                    onConfirm: () => navigate("/login"),
                    type: 'warning'
                });
                setIsLoading(false);
                setPosts([]); // 내 활동 탭에서 로그아웃 시 목록 비우기
                setTotalPages(0);
                return;
            }

            if (myContentType === "myPosts") {
                url = `${API_BASE_URL}/board/free`;
                params.authorUserId = currentUserId;
                 if (currentSearch) { // 내 글에서도 검색 지원 시
                    params.searchKeyword = currentSearch;
                }
            } else if (myContentType === "myComments") {
                url = `${API_BASE_URL}/board/free/comments/by-user`;
                // params.authorUserId = currentUserId; // 이 API는 authorUserId를 경로가 아닌 파라미터로 받지 않음 (currentUserId는 토큰으로 식별)
                                                      // 서비스에서 currentUserId 파라미터로 받도록 수정했었음. 백엔드 컨트롤러 확인 필요
                                                      // FreeboardPostController에는 /comments/by-user 에 userId 파라미터가 없음. @AuthenticationPrincipal 사용.
                                                      // 따라서 이 API 호출 시 params에 authorUserId는 불필요.
                // 댓글 정렬 옵션 (백엔드 FreeboardCommentService.getCommentsByAuthor Pageable 확인 필요)
                // 예: "latest" -> "commentCreatedAt,desc", "likes" -> "commentLikeCount,desc"
                 params.sort = sortOption === "latest" ? "commentCreatedAt,desc" :
                               sortOption === "likes" ? "commentLikeCount,desc" : "commentCreatedAt,desc";
                // params.searchKeyword = currentSearch; // 댓글 내용 검색은 AdminMyCommentFilterDTO에 있음. 해당 API가 이 필터를 받는지 확인 필요.
                                                        // 현재 FreeboardCommentService.getCommentsByAuthor는 AdminMyCommentFilterDTO를 받음.
                                                        // 이 필터 DTO에 searchKeyword가 있으므로, 만약 댓글 내용 검색을 지원한다면,
                                                        // params에 filter 관련 내용을 추가해야 함. 여기서는 일단 단순화.
            }
        } else {
            setIsLoading(false);
            return;
        }


        try {
            const response = await axios.get(url, { params, headers });
            const data = response.data;
            if (data) { // PageResponseDTO 구조에 맞게
                setPosts(data.content || []);
                setTotalPages(data.totalPages || 0);
                setCurrentPage(data.currentPage || 1); // 백엔드가 1-based currentPage를 준다고 가정
            } else {
                setPosts([]);
                setTotalPages(0);
            }
        } catch (err) {
            console.error("Error fetching posts:", err);
            setError(err.response?.data?.message || "데이터를 불러오는 데 실패했습니다.");
            setPosts([]);
            setTotalPages(0);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, activeTab, sortOption, currentSearch, myContentType, navigate]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleTabClick = (tabName) => {
        if (tabName === "myActivity" && !isUserLoggedIn()) {
            setIsModalOpen(true);
            setModalProps({
                title: "로그인 필요",
                message: "내 활동을 보려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?",
                confirmText: "로그인",
                cancelText: "취소",
                onConfirm: () => navigate("/login"),
                type: 'warning'
            });
            return;
        }
        setActiveTab(tabName);
        setCurrentPage(1); // 탭 변경 시 1페이지로
        setMyContentType("myPosts"); // "내 글" 탭 기본은 "내 게시글"
        setCurrentSearch(""); // 탭 변경 시 검색어 초기화
        setSearchQuery(""); 
    };

    const handleMyContentTypeChange = (e) => {
        setMyContentType(e.target.value);
        setCurrentPage(1); // 콘텐츠 타입 변경 시 1페이지로
    }

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        setCurrentPage(1); // 정렬 변경 시 1페이지로
    };

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1); // 검색 시 1페이지로
        setCurrentSearch(searchQuery);
    };

    const handlePostLikeToggle = async (e, postId) => {
        e.stopPropagation();
        if (!isUserLoggedIn()) {
            setIsModalOpen(true);
            setModalProps({
                title: "로그인 필요",
                message: "좋아요 기능은 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?",
                confirmText: "로그인",
                cancelText: "취소",
                onConfirm: () => navigate("/login"),
                type: 'warning'
            });
            return;
        }

        try {
            const token = getToken();
            const response = await axios.post(`${API_BASE_URL}/board/free/${postId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data; // PostLikeResponseDTO
            setPosts(prevPosts => prevPosts.map(p => 
                (activeTab === "myActivity" && myContentType === "myComments" ? p.commentId : p.postId) === postId // postId 또는 commentId에 따라 비교
                ? { ...p, 
                    isLikedByCurrentUser: data.likedByCurrentUser, 
                    postLikeCount: data.currentLikeCount, // 게시글 DTO 필드명
                    commentLikeCount: data.currentLikeCount // 댓글 DTO 필드명 (렌더링 시 구분 필요)
                  } 
                : p
            ));
        } catch (err) {
            console.error("Error toggling like:", err);
            setModalProps({ title: "오류", message: err.response?.data?.message || "좋아요 처리에 실패했습니다.", type: 'error' });
            setIsModalOpen(true);
        }
    };

    const processActualPostReport = async (postIdToReport) => {
        if (!isUserLoggedIn()) {
             // 이 함수는 handlePostReportToggle에서 로그인 체크 후 호출되므로 중복일 수 있으나 방어적으로 둠
            setIsModalOpen(true);
            setModalProps({ title: "로그인 필요", message: "신고 기능은 로그인이 필요합니다.", type: 'warning', onConfirm: () => navigate("/login") });
            return;
        }
        try {
            const token = getToken();
            await axios.post(`${API_BASE_URL}/board/free/${postIdToReport}/report`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(prevPosts => prevPosts.map(p => 
                p.postId === postIdToReport 
                ? { ...p, isReportedByCurrentUser: true } 
                : p
            ));
            setModalProps({
                title: "신고 완료",
                message: `게시글 ID ${postIdToReport}이(가) 성공적으로 신고되었습니다.`,
                confirmText: "확인",
                type: "success",
                confirmButtonType: 'primary'
            });
        } catch (err) {
            console.error("Error reporting post:", err);
            setModalProps({ title: "오류", message: err.response?.data?.message || "신고 처리에 실패했습니다.", type: 'error' });
        } finally {
            setIsModalOpen(true); // 성공/실패 모달 모두 표시
        }
    };

    const handlePostReportToggle = (e, postId, postTitle) => {
        e.stopPropagation();
        if (!isUserLoggedIn()) {
            setIsModalOpen(true);
            setModalProps({
                title: "로그인 필요",
                message: "신고 기능은 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?",
                confirmText: "로그인",
                cancelText: "취소",
                onConfirm: () => navigate("/login"),
                type: 'warning'
            });
            return;
        }
        
        const postToReport = posts.find(p => p.postId === postId);
        if (postToReport && postToReport.isReportedByCurrentUser) { 
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
            confirmButtonType: 'danger'
        });
        setIsModalOpen(true);
    };

    const handleRowClick = (item) => {
        if (activeTab === "myActivity" && myContentType === "myComments") {
            // 댓글 클릭 시, 댓글이 달린 원본 게시글 상세 페이지로 이동
             if (item.originalPostId) {
                navigate(`/freeboardDetail/${item.originalPostId}?commentId=${item.commentId}`);
            } else {
                // 혹시 모를 예외 처리
                console.warn("Original post ID not found for this comment.");
            }
        } else { // 게시글 클릭 시
            navigate(`/freeboardDetail/${item.postId}`);
        }
    };
    
    const handleWriteButtonClick = () => {
        if (!isUserLoggedIn()) {
            setIsModalOpen(true);
            setModalProps({
                title: "로그인 필요",
                message: "글을 작성하려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?",
                confirmText: "로그인",
                cancelText: "취소",
                onConfirm: () => navigate("/login"),
                type: 'warning'
            });
            return;
        }
        navigate("/freeboardWrite");
    };


    // 렌더링할 아이템 (게시글 또는 댓글)
    const itemsToDisplay = posts;


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
                            className={`${FreeBoardStyle["nav-button"]} ${activeTab === "myActivity" ? FreeBoardStyle["active-tab"] : FreeBoardStyle["inactive-tab"]}`}
                            onClick={() => handleTabClick("myActivity")}
                        >
                            내 활동
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
                            value={sortOption}
                            onChange={handleSortChange}
                        >
                            <option value="latest">최신순</option>
                            {!(activeTab === "myActivity" && myContentType === "myComments") && <option value="views">조회순</option> /* 댓글은 조회순 없음 */}
                            <option value="likes">좋아요순</option>
                        </select>
                        
                        {activeTab === "all" && (
                            /* "전체 목록" 탭에서는 게시글 타입 필터 없음 (항상 게시글) */
                            null 
                        )}

                        {activeTab === "myActivity" && (
                            <select 
                                name="myContentType" 
                                id="myContentTypeSelect" 
                                className={`${FreeBoardStyle["type-select"]} ${FreeBoardStyle["control-element"]}`}
                                value={myContentType}
                                onChange={handleMyContentTypeChange}
                            >
                                <option value="myPosts">내 게시글</option>
                                <option value="myComments">내 댓글</option>
                            </select>
                        )}
                    </div>
                    <form onSubmit={handleSearchSubmit} className={FreeBoardStyle["search-area"]}>
                        <input 
                            type="text" 
                            placeholder="Search" 
                            className={`${FreeBoardStyle["search-input"]} ${FreeBoardStyle["control-element"]}`} 
                            aria-label="게시글 검색" 
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                        />
                        <button type="submit" className={`${FreeBoardStyle["search-button"]} ${FreeBoardStyle["control-element"]}`} aria-label="검색">
                            <img src={searchButtonIcon} alt="검색 아이콘" className={FreeBoardStyle["search-button-icon"]} />
                        </button>
                    </form>
                </div>

                <div className={FreeBoardStyle["board-list-container"]}>
                    <table className={FreeBoardStyle["board-table"]}>
                        <thead>
                            <tr>
                                <th scope="col">NO</th>
                                <th scope="col">타입</th>
                                <th scope="col">제목/내용</th>
                                <th scope="col">작성자</th>
                                <th scope="col">날짜</th>
                                {!(activeTab === "myActivity" && myContentType === "myComments") && <th scope="col">조회수</th>}
                                <th scope="col">좋아요</th>
                                <th scope="col">신고</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="8">로딩 중...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="8">{error}</td></tr>
                            ) : itemsToDisplay.length > 0 ? (
                                itemsToDisplay.map((item, index) => {
                                    // "내 활동" 탭에서 "내 댓글"을 보는 경우와 그 외(게시글)를 구분
                                    const isCommentView = activeTab === "myActivity" && myContentType === "myComments";
                                    const id = isCommentView ? item.commentId : item.postId;
                                    const titleOrContent = isCommentView ? (item.commentContent?.length > 30 ? item.commentContent.substring(0,30)+"..." : item.commentContent) : item.postTitle;
                                    const typeText = isCommentView ? "댓글" : "글";
                                    const author = item.userNickName || "알 수 없는 사용자";
                                    const date = formatDate(item.postCreatedAt || item.commentCreatedAt); // 날짜 필드 통일 또는 구분
                                    const views = isCommentView ? "-" : item.postViewCount; // 댓글은 조회수 없음
                                    const likes = item.postLikeCount ?? item.commentLikeCount ?? 0; // 좋아요 수 필드 통일 또는 구분
                                    const isLiked = item.isLikedByCurrentUser || false;
                                    const isReported = item.isReportedByCurrentUser || false; // 댓글 DTO에 이 필드가 없다면 항상 false 또는 다른 처리

                                    return (
                                        <tr key={id || index} onClick={() => handleRowClick(item)} className={FreeBoardStyle["board-row"]}>
                                            <td>{ (activeTab === "all" || (activeTab === "myActivity" && myContentType === "myPosts")) 
                                                    ? item.postId // 게시글 목록일 때 postId
                                                    : item.commentId // 댓글 목록일 때 commentId (또는 index + 1)
                                                }
                                            </td>
                                            <td>{typeText}</td>
                                            <td className={FreeBoardStyle["post-title"]} onClick={(e) => { e.stopPropagation(); handleRowClick(item); }}>
                                                 {/* 댓글인 경우 원본 게시글로, 게시글인 경우 해당 게시글로 링크 */}
                                                <Link to={isCommentView ? `/freeboardDetail/${item.originalPostId}?commentId=${item.commentId}` : `/freeboardDetail/${item.postId}`}>
                                                    {titleOrContent}
                                                    {isCommentView && item.originalPostTitle && <span className={FreeBoardStyle["comment-original-post"]}> (원본글: {item.originalPostTitle?.length > 10 ? item.originalPostTitle.substring(0,10)+"..." : item.originalPostTitle})</span>}
                                                </Link>
                                            </td>
                                            <td>{author}</td>
                                            <td>{date}</td>
                                            {!isCommentView && <td>{views}</td>}
                                            <td>
                                                <button
                                                    className={`${FreeBoardStyle["like-button"]} ${isLiked ? FreeBoardStyle.toggled : ""}`}
                                                    onClick={(e) => handlePostLikeToggle(e, id)} // TODO: 댓글 좋아요 API 경로 및 로직 분기 필요
                                                    aria-pressed={isLiked}
                                                    aria-label={isLiked ? "좋아요 취소" : "좋아요"}
                                                    disabled={isCommentView} // TODO: 댓글 좋아요 기능 구현 시 disabled 해제
                                                >
                                                    <img src={isLiked ? likeOnIcon : likeOffIcon} alt={isLiked ? "좋아요 된 상태" : "좋아요 안된 상태"} className={FreeBoardStyle["button-icon"]} />
                                                </button>
                                                <span className={FreeBoardStyle["like-count"]}>{likes}</span>
                                            </td>
                                            <td>
                                                <button
                                                    className={`${FreeBoardStyle["report-button"]} ${isReported ? FreeBoardStyle.toggled : ""}`}
                                                    onClick={(e) => handlePostReportToggle(e, id, titleOrContent)} // TODO: 댓글 신고 API 경로 및 로직 분기 필요
                                                    aria-pressed={isReported}
                                                    disabled={isReported || isCommentView} // TODO: 댓글 신고 기능 구현 시 disabled 조건 수정
                                                    aria-label={isReported ? "신고됨" : "신고하기"}
                                                >
                                                    <img src={isReported ? reportOnIcon : reportOffIcon} alt={isReported ? "신고 된 상태" : "신고 안된 상태"} className={FreeBoardStyle["button-icon"]} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr><td colSpan={activeTab === "myActivity" && myContentType === "myComments" ? "7" : "8"}>표시할 내용이 없습니다.</td></tr>
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
                         <button onClick={handleWriteButtonClick} className={FreeBoardStyle["write-button"]}>
                            작성
                        </button>
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