// src/pages/Admin/ReportedPosts.jsx
import axios from 'axios'; // axios 직접 import
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import searchButtonIcon from "../../assets/images/search_icon.png";
import styles from '../../assets/styles/ReportedPosts.module.css';
import Modal from '../../components/Modal/Modal';
import Pagination from '../../components/Pagination/Pagination';

const API_BASE_URL = 'http://localhost:8080/api/v1'; // API 기본 URL 정의

function ReportedPosts() {
    const navigate = useNavigate();
    
    const [reportedItems, setReportedItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [activeContentTypeTab, setActiveContentTypeTab] = useState('post');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [hideFilter, setHideFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        console.log("현재 토큰:", token); // 토큰 값 확인
        if (token) {
            return { 'Authorization': `Bearer ${token}` };
        }
        return {};
    };

    const fetchReportedItems = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        if (!token) {
            setModalProps({
                title: '인증 오류',
                message: '로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.',
                confirmText: '확인',
                onConfirm: () => navigate('/login'),
                type: 'error',
                confirmButtonType: 'primary',
            });
            setIsModalOpen(true);
            setIsLoading(false);
            return;
        }
        
        let endpoint = '';
        const params = {
            page: currentPage - 1,
            size: itemsPerPage,
        };

        if (searchTerm.trim() !== '') params.searchKeyword = searchTerm.trim();
        if (hideFilter !== 'all') params.isHidden = hideFilter === '숨김';

        if (activeContentTypeTab === 'post') {
            endpoint = '/board/free/reports/posts';
            if (dateRange.start) params.postCreatedAtStartDate = dateRange.start;
            if (dateRange.end) params.postCreatedAtEndDate = dateRange.end;
        } else if (activeContentTypeTab === 'comment') {
            endpoint = '/board/free/reports/comments';
            if (dateRange.start) params.commentCreatedAtStartDate = dateRange.start;
            if (dateRange.end) params.commentCreatedAtEndDate = dateRange.end;
        } else {
            setIsLoading(false);
            setReportedItems([]);
            setTotalPages(0);
            setTotalItems(0);
            return;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}${endpoint}`, { 
                params,
                headers: getAuthHeaders() // 헤더 직접 추가
            });
            
            const data = response.data;
            if (data && data.content) {
                const mappedItems = data.content.map(item => {
                    const commonProps = {
                        authorId: item.authorUserId,
                        authorNickname: item.authorNickname,
                        reportCount: item.reportCount,
                        hiddenStatus: item.hidden ? '숨김' : '공개',
                        isItemHiddenBoolean: item.hidden
                    };
                    if (activeContentTypeTab === 'post') {
                        return {
                            ...commonProps,
                            id: item.postId,
                            postType: '게시글',
                            originalPostId: item.postId,
                            titleOrContentSnippet: item.postTitle,
                            originalPostDate: item.postCreatedAt ? new Date(item.postCreatedAt).toLocaleDateString() : '-',
                        };
                    } else { // comment
                        return {
                            ...commonProps,
                            id: item.commentId,
                            postType: '댓글',
                            originalPostId: item.originalPostId,
                            titleOrContentSnippet: item.commentContent,
                            originalPostDate: item.commentCreatedAt ? new Date(item.commentCreatedAt).toLocaleDateString() : '-',
                        };
                    }
                });
                setReportedItems(mappedItems);
                setTotalPages(data.totalPages);
                setTotalItems(data.totalElements);
                // setCurrentPage(data.currentPage); // 백엔드가 0-based, 프론트는 1-based. currentPage는 사용자가 직접 변경하므로 여기서 설정X
            } else {
                setReportedItems([]);
                setTotalPages(0);
                setTotalItems(0);
            }
        } catch (err) {
            console.error("Error fetching reported items:", err);
            const errorMsg = err.response?.data?.message || '데이터를 불러오는 중 오류가 발생했습니다.';
            setError(errorMsg);
            setReportedItems([]);
            setTotalPages(0);
            setTotalItems(0);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                 setModalProps({
                    title: '인증 오류',
                    message: '접근 권한이 없거나 세션이 만료되었습니다. 로그인 페이지로 이동합니다.',
                    confirmText: '확인',
                    onConfirm: () => navigate('/login'),
                    type: 'error',
                    confirmButtonType: 'primary',
                });
                setIsModalOpen(true);
            }
        } finally {
            setIsLoading(false);
        }
    }, [activeContentTypeTab, currentPage, dateRange, hideFilter, searchTerm, itemsPerPage, navigate]);

    useEffect(() => {
        if (activeContentTypeTab !== 'all') {
             fetchReportedItems();
        } else {
            setReportedItems([]);
            setTotalPages(0);
            setTotalItems(0);
        }
    }, [fetchReportedItems, activeContentTypeTab]);

    const processToggleHiddenStatus = async (itemId, currentIsHiddenBoolean, itemType) => {
        const newIsHidden = !currentIsHiddenBoolean;
        let endpoint = '';

        if (itemType === '게시글') {
            endpoint = `/board/free/posts/${itemId}/visibility`;
        } else if (itemType === '댓글') {
            endpoint = `/board/free/comments/${itemId}/visibility`;
        } else {
            console.error("Unknown item type for toggling hidden status");
            setModalProps({ title: "오류", message: "알 수 없는 항목 유형입니다.", type: "error", confirmText:"확인", onConfirm: () => setIsModalOpen(false) });
            setIsModalOpen(true);
            return;
        }

        setIsLoading(true);
        try {

            const headersForRequest = getAuthHeaders(); // getAuthHeaders() 호출 결과를 변수에 저장
        
        // --- 👇 이 부분을 추가해주세요 ---
        console.log("PATCH 요청 전송 직전 헤더 객체:", headersForRequest); 
        console.log("전송될 토큰 (getAuthHeaders 내부에서도 확인 가능):", localStorage.getItem('token'));
        // --- 👆 여기까지 추가 ---
        
            await axios.patch(`${API_BASE_URL}${endpoint}`, { isHidden: newIsHidden }, {
                headers: getAuthHeaders() // 헤더 직접 추가
            });
            
            setModalProps({
                title: "상태 변경 완료",
                message: `항목 ID '${itemId}'의 상태가 "${newIsHidden ? '숨김' : '공개'}"(으)로 성공적으로 변경되었습니다.`,
                confirmText: "확인",
                onConfirm: () => {
                    setIsModalOpen(false);
                    fetchReportedItems(); 
                },
                type: "adminSuccess",
                confirmButtonType: 'primary'
            });
            setIsModalOpen(true);

        } catch (err) {
            console.error("Error toggling hidden status:", err);
            setModalProps({
                title: "오류",
                message: err.response?.data?.message || "상태 변경 중 오류가 발생했습니다.",
                confirmText: "확인",
                onConfirm: () => setIsModalOpen(false),
                type: "error",
                confirmButtonType: 'primary'
            });
            setIsModalOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleHiddenStatus = (e, item) => {
        e.stopPropagation();
        const { id, titleOrContentSnippet, postType, isItemHiddenBoolean } = item;
        const newStatusString = isItemHiddenBoolean ? '공개' : '숨김';
        const currentStatusString = isItemHiddenBoolean ? '숨김' : '공개';
        const snippetToShow = titleOrContentSnippet && titleOrContentSnippet.length > 20 ? `${titleOrContentSnippet.substring(0, 20)}...` : titleOrContentSnippet;

        setModalProps({
            title: "숨김 상태 변경 확인",
            message: `"${snippetToShow}" (ID: ${id}) 항목의 상태를 \n"${currentStatusString}"에서 "${newStatusString}"(으)로 변경하시겠습니까?`,
            onConfirm: () => {
                setIsModalOpen(false); // 확인 모달 먼저 닫기
                processToggleHiddenStatus(id, isItemHiddenBoolean, postType);
            },
            cancelText: "취소",
            onCancel: () => setIsModalOpen(false), // 취소 시 모달 닫기
            type: "adminConfirm",
            confirmButtonType: !isItemHiddenBoolean ? 'danger' : 'primary'
        });
        setIsModalOpen(true);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRowClick = (item) => {
        if (item.postType === '게시글') {
            navigate(`/admin/managerFreeboardDetail/${item.originalPostId}`);
        } else if (item.postType === '댓글') {
            navigate(`/admin/managerFreeboardDetail/${item.originalPostId}?commentFocusId=${item.id}`);
        }
    };

    const handleSearch = () => {
        setCurrentPage(1); 
        // fetchReportedItems(); // searchTerm 변경 시 useEffect에 의해 자동 호출되므로 중복 호출 방지
    };
    
    // 검색 입력 변경 시 즉시 검색하지 않고, 검색 버튼 클릭 또는 엔터 시 검색되도록 하려면
    // searchTerm 상태는 그대로 두고, 검색 버튼 클릭 시 fetchReportedItems를 호출하는 방식으로 변경 가능
    // 현재는 searchTerm 변경 시 useEffect에 의해 자동으로 API 호출

    return (
        <>
            <div className={styles.container}>
                <main className={styles.reportedPostsContentCard}>
                    <h1 className={styles.pageTitle}>신고된 게시물 관리</h1>

                    <div className={styles.tabContainer}>
                        <button 
                            className={`${styles.tabButton} ${activeContentTypeTab === 'post' ? styles.activeTab : ''}`} 
                            onClick={() => { setActiveContentTypeTab('post'); setCurrentPage(1); }}
                        >
                            게시글
                        </button>
                        <button 
                            className={`${styles.tabButton} ${activeContentTypeTab === 'comment' ? styles.activeTab : ''}`} 
                            onClick={() => { setActiveContentTypeTab('comment'); setCurrentPage(1); }}
                        >
                            댓글
                        </button>
                    </div>

                    <div className={styles.filterBar}>
                        <input type="date" className={styles.filterElement} value={dateRange.start} onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))} />
                        <span className={styles.dateSeparator}>~</span>
                        <input type="date" className={styles.filterElement} value={dateRange.end} onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))} />
                        <select className={`${styles.filterElement} ${styles.filterSelect}`} value={hideFilter} onChange={(e) => setHideFilter(e.target.value)}>
                            <option value="all">숨김상태 (전체)</option>
                            <option value="공개">공개</option>
                            <option value="숨김">숨김</option>
                        </select>
                        <input 
                            type="text" 
                            placeholder="ID, 닉네임, 내용 검색" 
                            className={`${styles.filterElement} ${styles.filterSearchInput}`} 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }} // 엔터키 검색
                        />
                        <button type="button" className={styles.filterSearchButton} onClick={handleSearch}>
                            <img src={searchButtonIcon} alt="검색" className={styles.searchIcon} />
                        </button>
                    </div>

                    {isLoading && <div className={styles.loadingSpinner}>로딩 중...</div>}
                    {error && <div className={styles.errorMessage}>오류: {error} <button onClick={fetchReportedItems}>재시도</button></div>}
                    
                    {!isLoading && !error && (
                        <table className={styles.reportsTable}>
                            <thead>
                                <tr>
                                    <th>NO</th>
                                    <th>ID (작성자)</th>
                                    <th>닉네임 (작성자)</th>
                                    <th className={styles.titleColumn}>제목/내용일부</th>
                                    <th>작성일</th>
                                    <th>누적신고</th>
                                    <th>상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportedItems.length > 0 ? (
                                    reportedItems.map((item, index) => (
                                        <tr key={`${item.postType}-${item.id}`} onClick={() => handleRowClick(item)} className={styles.clickableRow}>
                                            <td>{totalItems - ((currentPage - 1) * itemsPerPage) - index}</td>
                                            <td>{item.authorId}</td>
                                            <td>{item.authorNickname}</td>
                                            <td className={styles.contentSnippetCell}>
                                                {item.titleOrContentSnippet && item.titleOrContentSnippet.length > 30
                                                    ? `${item.titleOrContentSnippet.substring(0, 30)}...`
                                                    : item.titleOrContentSnippet}
                                            </td>
                                            <td>{item.originalPostDate}</td>
                                            <td>{item.reportCount}</td>
                                            <td>
                                                <button
                                                    onClick={(e) => handleToggleHiddenStatus(e, item)}
                                                    className={`${styles.status} ${item.hiddenStatus === '공개' ? styles.activeStatus : styles.inactiveStatus}`}
                                                    title={`${item.hiddenStatus} 상태 (클릭하여 변경)`}
                                                >
                                                    {item.hiddenStatus}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7">표시할 신고된 항목이 없습니다.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    <div className={styles.pagination}>
                        {totalPages > 0 && !isLoading && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </main>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                {...modalProps}
            />
        </>
    );
}

export default ReportedPosts;