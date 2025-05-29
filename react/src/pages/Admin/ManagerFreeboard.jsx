// src/pages/Admin/ManagerFreeboard.jsx
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reportOffIcon from "../../assets/images/able-alarm.png";
import likeOffIcon from "../../assets/images/b_thumbup.png";
import reportOnIcon from "../../assets/images/disable-alarm.png";
import searchButtonIcon from "../../assets/images/search_icon.png";
import likeOnIcon from "../../assets/images/thumbup.png";
import styles from '../../assets/styles/ManagerFreeboard.module.css';
import Modal from '../../components/Modal/Modal';
import Pagination from '../../components/Pagination/Pagination';

const API_BASE_URL = "http://localhost:8080/api/v1";

function ManagerFreeboard() {
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState('all'); 
    const [items, setItems] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [searchTerm, setSearchTerm] = useState(''); 
    const [currentSearch, setCurrentSearch] = useState(''); 
    const [sortOrder, setSortOrder] = useState('latest'); 

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 10;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalProps, setModalProps] = useState({
        title: '', message: '', onConfirm: null, confirmText: '확인',
        cancelText: null, type: 'default', confirmButtonType: 'primary',
        cancelButtonType: 'secondary', onCancel: () => setIsModalOpen(false)
    });

    const getToken = () => localStorage.getItem("token");
    const getLoggedInUserId = () => localStorage.getItem("userId"); 

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return `${date.getFullYear().toString().slice(-2)}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
        } catch (e) { return "N/A"; }
    };

    const fetchItems = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        let url = "";
        const params = {
            page: currentPage - 1,
            size: itemsPerPage,
            startDate: dateRange.start || null,
            endDate: dateRange.end || null,
        };
        let defaultSortField;

        const headers = {};
        const token = getToken();
        if (!token) {
            setIsLoading(false);
            setModalProps({ title: "인증 오류", message: "로그인이 필요합니다.", onConfirm: () => navigate("/login"), type: 'error' });
            setIsModalOpen(true);
            return;
        }
        headers.Authorization = `Bearer ${token}`;

        if (activeTab === 'all') { 
            url = `${API_BASE_URL}/board/free`;
            if (currentSearch) params.searchKeyword = currentSearch;
            defaultSortField = "postId,desc";
            params.sort = sortOrder === 'latest' ? "postId,desc" :
                          sortOrder === 'views' ? "postViewCount,desc" :
                          sortOrder === 'likes' ? "postLikeCount,desc" : defaultSortField;
        } else if (activeTab === 'myComments') { 
            url = `${API_BASE_URL}/board/free/comments/by-user`; 
            defaultSortField = "commentCreatedAt,desc";
            params.sort = sortOrder === 'latest' ? "commentCreatedAt,desc" :
                          sortOrder === 'likes' ? "commentLikeCount,desc" : defaultSortField;
            // params에 AdminMyCommentFilterDTO 관련 필드(예: searchKeyword) 추가 가능
        } else {
            setIsLoading(false); setError("알 수 없는 탭입니다."); return;
        }
        
        if (!url) { 
            setIsLoading(false); setItems([]); setTotalPages(0); setCurrentPage(1);
            setError("잘못된 접근입니다."); return;
        }

        try {
            const response = await axios.get(url, { params, headers });
            const data = response.data;
            if (data && data.content) {
                setItems(data.content);
                setTotalPages(data.totalPages || 0);
                setCurrentPage(data.currentPage || 1);
            } else {
                setItems([]); setTotalPages(0); setCurrentPage(1);
            }
        } catch (err) {
            console.error("Error fetching items for admin:", err);
            const errorMsg = err.response?.data?.message || "데이터를 불러오는 데 실패했습니다.";
            setError(errorMsg);
            setItems([]); setTotalPages(0); setCurrentPage(1);
             if (err.response?.status === 401) {
                 setModalProps({ title: "인증 오류", message: "세션이 만료되었거나 인증에 실패했습니다.", onConfirm: () => navigate("/login"), type: 'error' });
                 setIsModalOpen(true);
            } else if (err.response?.status === 403) {
                 setModalProps({ title: "권한 없음", message: "이 페이지에 접근할 권한이 없습니다.", type: 'error' });
                 setIsModalOpen(true);
            }
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, activeTab, dateRange, currentSearch, sortOrder, navigate]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
        setCurrentSearch(''); setSearchTerm(''); 
        setSortOrder('latest'); 
        setDateRange({ start: '', end: '' }); 
    };
    
    const handleSearch = () => {
        setCurrentPage(1);
        setCurrentSearch(searchTerm);
    };
    
    const handleItemLikeToggle = async (e, itemId, itemType) => {
        e.stopPropagation();
        const endpoint = itemType === "comment"
            ? `${API_BASE_URL}/board/free/comments/${itemId}/like`
            : `${API_BASE_URL}/board/free/${itemId}/like`;
        try {
            const token = getToken();
            const response = await axios.post(endpoint, {}, { headers: { Authorization: `Bearer ${token}` }});
            const data = response.data;
            setItems(prevItems => prevItems.map(item => {
                const currentItemIdField = itemType === "comment" ? "commentId" : "postId";
                if (item[currentItemIdField] === itemId) {
                    return {
                        ...item,
                        isLikedByCurrentUser: data.likedByCurrentUser,
                        ...(itemType === "comment" 
                            ? { commentLikeCount: data.currentLikeCount } 
                            : { postLikeCount: data.currentLikeCount })
                    };
                }
                return item;
            }));
        } catch (err) { 
            setModalProps({ title: "오류", message: err.response?.data?.message || "좋아요 처리에 실패했습니다.", type: 'error' });
            setIsModalOpen(true);
        }
    };

    const processPostReport = async (postIdToReport) => {
        try {
            const token = getToken();
            await axios.post(`${API_BASE_URL}/board/free/${postIdToReport}/report`, {}, { headers: { Authorization: `Bearer ${token}` }});
            setItems(prevItems => prevItems.map(p => 
                p.postId === postIdToReport 
                ? { ...p, isReportedByCurrentUser: true } 
                : p
            ));
            setModalProps({ title: '신고 접수', message: `게시물 ID ${postIdToReport}을(를) 신고 접수했습니다.`, type: 'success' });
        } catch (err) {
             if (err.response && (err.response.status === 409 || err.response.status === 400) && err.response.data.message === "이미 신고한 게시글입니다.") {
                setModalProps({ title: '알림', message: "이미 관리자님께서 신고한 게시글입니다.", type: 'warning'});
            } else {
                setModalProps({ title: '오류', message: err.response?.data?.message || "신고 처리에 실패했습니다.", type: 'error' });
            }
        } finally {
            setIsModalOpen(true);
        }
    };

    const handlePostReportClick = (e, post) => {
        e.stopPropagation();
        // 관리자는 어떤 글이든 신고 버튼이 있으며, 본인이 이미 신고했으면 비활성화
        if (post.reportedByCurrentUser) { // isReportedByCurrentUser는 현재 로그인한 관리자 기준
            setModalProps({ title: '알림', message: '이미 관리자님께서 신고한 게시글입니다.', type: 'info' });
            setIsModalOpen(true);
            return;
        }
        setModalProps({
            title: '게시글 신고 (관리자)',
            message: `"${post.postTitle}" (ID: ${post.postId}) 게시글을 신고 시스템에 등록하시겠습니까?`,
            onConfirm: () => processPostReport(post.postId),
            confirmText: '신고 등록', cancelText: '취소', type: 'warning', confirmButtonType: 'danger'
        });
        setIsModalOpen(true);
    };

    const handleRowClick = (item) => {
        const isCommentView = activeTab === 'myComments';
        if (isCommentView) {
            if (item.originalPostId) {
                 navigate(`/admin/managerFreeboardDetail/${item.originalPostId}?highlightCommentId=${item.commentId}`);
            }
        } else { 
            navigate(`/admin/managerFreeboardDetail/${item.postId}`);
        }
    };

    return (
        <>
            <div className={styles.container}>
                <main className={styles.managerFreeboardContent}>
                    <h1 className={styles.pageTitle}>자유게시판 관리</h1>
                    <div className={styles.tabContainer}>
                        <button className={`${styles.tabButton} ${activeTab === 'all' ? styles.activeTab : ''}`} onClick={() => handleTabClick('all')}>전체 게시물</button>
                        <button className={`${styles.tabButton} ${activeTab === 'myComments' ? styles.activeTab : ''}`} onClick={() => handleTabClick('myComments')}>관리자 작성 댓글</button>
                    </div>
                    <div className={styles.filterBar}>
                        <input type="date" className={styles.filterElement} value={dateRange.start} onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}/>
                        <span className={styles.dateSeparator}>~</span>
                        <input type="date" className={styles.filterElement} value={dateRange.end} onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}/>
                        <select className={`${styles.filterElement} ${styles.filterSelect}`} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="latest">최신순</option>
                            {activeTab !== 'myComments' && <option value="views">조회순</option>}
                            <option value="likes">좋아요순</option>
                        </select>
                        <input 
                            type="text" 
                            placeholder={activeTab === 'myComments' ? "댓글 내용 검색 (구현 필요)" : "닉네임, 제목 검색"} 
                            className={`${styles.filterElement} ${styles.filterSearchInput}`} 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={activeTab === 'myComments'} // 댓글 검색 미구현 시 비활성화
                        />
                        <button 
                            type="button" 
                            className={styles.filterSearchButton} 
                            onClick={handleSearch}
                            disabled={activeTab === 'myComments'} // 댓글 검색 미구현 시 비활성화
                        >
                            <img src={searchButtonIcon} alt="검색" className={styles.searchIcon} />
                        </button>
                    </div>
                    <table className={styles.boardTable} id="boardTableAnchor">
                        <thead>
                            <tr>
                                <th>NO</th>
                                {activeTab === 'myComments' ? <th>댓글 내용</th> : <th>제목/내용일부</th>}
                                <th>닉네임(작성자)</th>
                                <th>작성일</th>
                                {activeTab !== 'myComments' && <th>조회수</th>}
                                <th>좋아요수</th>
                                <th>신고</th> {/* 신고 컬럼은 유지 */}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={activeTab === 'myComments' ? 6 : 7}>로딩 중...</td></tr>
                            ) : error ? (
                                <tr><td colSpan={activeTab === 'myComments' ? 6 : 7}>{error}</td></tr>
                            ) : items.length > 0 ? (
                                items.map(item => {
                                    const isCommentView = activeTab === 'myComments';
                                    const itemId = isCommentView ? item.commentId : item.postId;
                                    const displayContent = isCommentView 
                                        ? (item.commentContent?.length > 30 ? `${item.commentContent.substring(0,30)}...` : item.commentContent)
                                        : (item.postTitle?.length > 30 ? `${item.postTitle.substring(0,30)}...` : item.postTitle);
                                    
                                    const isLikedByAdmin = item.isLikedByCurrentUser || false; 
                                    const isReportedByAdmin = item.reportedByCurrentUser || false;
                                    // const totalReports = !isCommentView ? (item.totalReportCount || 0) : '-'; // 이 부분 제거

                                    return (
                                        <tr key={itemId} onClick={() => handleRowClick(item)} className={styles.clickableRow}>
                                            <td>{itemId}</td>
                                            {isCommentView ? (
                                                <td className={styles.postTitleCell}>
                                                    {displayContent}
                                                    {item.originalPostTitle && <span> (원본글: {item.originalPostTitle})</span>}
                                                </td>
                                            ) : (
                                                <td className={styles.postTitleCell}>{displayContent}</td>
                                            )}
                                            <td>{item.userNickName || 'N/A'}</td>
                                            <td>{formatDate(isCommentView ? item.commentCreatedAt : item.postCreatedAt)}</td>
                                            {!isCommentView && <td>{item.postViewCount}</td>}
                                            <td>
                                                <button onClick={(e) => {e.stopPropagation(); handleItemLikeToggle(e, itemId, isCommentView ? "comment" : "post");}} className={`${styles.iconButton} ${isLikedByAdmin ? styles.liked : ''}`} title="관리자 좋아요 토글">
                                                    <img src={isLikedByAdmin ? likeOnIcon : likeOffIcon} alt="좋아요" className={styles.buttonIcon}/>
                                                </button>
                                                <span className={styles.countText}>{isCommentView ? item.commentLikeCount : item.postLikeCount}</span>
                                            </td>
                                            <td>
                                                {/* 관리자는 댓글에 대해선 신고 버튼 없음 (본인 댓글이므로) */}
                                                {!isCommentView ? (
                                                    <button
                                                        onClick={(e) => handlePostReportClick(e, item)}
                                                        className={`${styles.iconButton} ${isReportedByAdmin ? styles.reportActioned : ''}`} // reportActioned는 조치 완료된 스타일일 수 있음. 신고된 상태 스타일로 변경 필요시 수정.
                                                        title={isReportedByAdmin ? "관리자가 신고함" : "관리자가 신고하기"}
                                                        disabled={isReportedByAdmin} // 관리자가 이미 신고했으면 비활성화
                                                    >
                                                        <img src={isReportedByAdmin ? reportOnIcon : reportOffIcon} alt="신고" className={styles.buttonIcon}/>
                                                    </button>
                                                    // {/* 총 신고 횟수 표시 제거 */}
                                                ) : (
                                                    <span>-</span> 
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (<tr><td colSpan={activeTab === 'myComments' ? 6 : 7}>표시할 항목이 없습니다.</td></tr>)}
                        </tbody>
                    </table>
                    <div className={styles.pagination}>
                        {totalPages > 0 && ( <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/> )}
                    </div>
                </main>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} {...modalProps} />
        </>
    );
}

export default ManagerFreeboard;