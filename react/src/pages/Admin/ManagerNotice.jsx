// src/pages/Admin/Notice/ManagerNotice.jsx

import axios from 'axios'; // axios import
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import searchButtonIcon from "../../assets/images/search_icon.png"; // 경로 수정 가능성 (상위 폴더 depth)
import styles from '../../assets/styles/ManagerNotice.module.css'; // 경로 수정 가능성
import Modal from '../../components/Modal/Modal';
import Pagination from '../../components/Pagination/Pagination';

function ManagerNotice() {
    const navigate = useNavigate();

    // --- UI 입력용 상태 ---
    const [inputSearchTerm, setInputSearchTerm] = useState('');
    const [inputDateRange, setInputDateRange] = useState({ start: '', end: '' });
    const [inputImportanceFilter, setInputImportanceFilter] = useState('all');

    // --- API 호출 시 실제 사용될 "적용된" 필터 상태 ---
    const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
    const [appliedDateRange, setAppliedDateRange] = useState({ start: '', end: '' });
    const [appliedImportanceFilter, setAppliedImportanceFilter] = useState('all');

    // --- 목록 및 페이징 상태 ---
    const [noticesToDisplay, setNoticesToDisplay] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const itemsPerPage = 10;
    const [isLoading, setIsLoading] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false); // 개별 액션 로딩 상태

    // --- 모달 상태 ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalProps, setModalProps] = useState({
        title: '', message: '', onConfirm: null, confirmText: '확인',
        cancelText: null, type: 'default', confirmButtonType: 'primary',
        cancelButtonType: 'secondary', onClose: () => setIsModalOpen(false)
    });
    
    const getToken = () => localStorage.getItem('token');

    // API 호출 함수
    const fetchAdminNotices = useCallback(async () => {
        setIsLoading(true);
        const apiPage = currentPage - 1;
        let apiUrl = `/api/notices?page=${apiPage}&size=${itemsPerPage}`;

        if (appliedSearchTerm.trim() !== "") {
            apiUrl += `&searchKeyword=${encodeURIComponent(appliedSearchTerm.trim())}`;
        }
        if (appliedImportanceFilter === 'important') {
            apiUrl += `&isImportant=true`;
        } else if (appliedImportanceFilter === 'general') {
            apiUrl += `&isImportant=false`;
        }
        if (appliedDateRange.start) {
            try {
                const startDate = new Date(appliedDateRange.start);
                startDate.setHours(0, 0, 0, 0);
                apiUrl += `&dateFrom=${startDate.toISOString().split('.')[0]}`;
            } catch (e) { console.error("Invalid start date format for API:", appliedDateRange.start, e); }
        }
        if (appliedDateRange.end) {
            try {
                const endDate = new Date(appliedDateRange.end);
                endDate.setHours(23, 59, 59, 999);
                apiUrl += `&dateTo=${endDate.toISOString().split('.')[0]}`;
            } catch (e) { console.error("Invalid end date format for API:", appliedDateRange.end, e); }
        }
        
        // GET 요청은 일반적으로 토큰이 필수는 아니지만, 관리자 섹션임을 감안하여 추가 가능 (선택적)
        // const token = getToken();
        // const headers = token ? { Authorization: `Bearer ${token}` } : {};

        try {
            // const response = await axios.get(apiUrl, { headers });
            const response = await axios.get(apiUrl); // GET은 permitAll이므로 토큰 없이 요청
            const data = response.data;

            let generalNoticeCounterBase = (data.currentPage - 1) * data.size; // API가 반환하는 currentPage(1-based)와 size 사용
            let generalNoticeIndex = 0;
            
            const mappedNotices = data.content.map(notice => {
                const dateObj = new Date(notice.noticeCreatedAt);
                const formattedDate = `${dateObj.getFullYear().toString().slice(2)}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;
                
                let displayNoToShow;
                if (notice.noticeIsImportant) {
                    displayNoToShow = '중요';
                } else {
                    generalNoticeIndex++;
                    displayNoToShow = generalNoticeCounterBase + generalNoticeIndex;
                }

                return {
                    id: notice.noticeId,
                    displayNo: displayNoToShow,
                    authorId: notice.authorId,
                    authorNickname: notice.authorNickname,
                    title: notice.noticeTitle,
                    date: formattedDate,
                    isImportant: notice.noticeIsImportant,
                    viewCount: notice.noticeViewCount // 조회수 추가 (필요시)
                };
            });

            setNoticesToDisplay(mappedNotices);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);

        } catch (error) {
            console.error("Error fetching admin notices:", error);
            setModalProps({
                title: "오류",
                message: error.response?.data?.message || error.message || "공지사항 목록을 불러오는 중 오류가 발생했습니다.",
                type: "error",
                confirmText: "확인",
                confirmButtonType: 'blackButton',
                onConfirm: () => setIsModalOpen(false),
                onClose: () => setIsModalOpen(false)
            });
            setIsModalOpen(true);
            setNoticesToDisplay([]);
            setTotalPages(0);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, appliedSearchTerm, appliedImportanceFilter, appliedDateRange]); // itemsPerPage 제거 (상수)

    useEffect(() => {
        fetchAdminNotices();
    }, [fetchAdminNotices]);

    const handleSearchOrFilterClick = () => {
        setAppliedSearchTerm(inputSearchTerm);
        setAppliedImportanceFilter(inputImportanceFilter);
        setAppliedDateRange(inputDateRange);
        if (currentPage === 1) {
            fetchAdminNotices(); // 이미 1페이지면 바로 호출
        } else {
            setCurrentPage(1); // 페이지 변경이 useEffect 트리거
        }
    };
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRowClick = (noticeId) => { navigate(`/admin/managerNoticeDetail/${noticeId}`); };
    const handleEdit = (id) => { navigate(`/admin/managerNoticeEdit/${id}`); };

    const handleToggleImportant = async (id, currentIsImportant) => {
        const token = getToken();
        if (!token) {
            setModalProps({ title: "인증 오류", message: "로그인이 필요합니다.", type: "error", confirmButtonType: 'blackButton', onConfirm: () => setIsModalOpen(false), onClose: () => setIsModalOpen(false) });
            setIsModalOpen(true);
            return;
        }
        setIsActionLoading(true);
        try {
            await axios.patch(`/api/notices/${id}/importance`, 
                { noticeIsImportant: !currentIsImportant },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setModalProps({ title: "성공", message: "중요도가 변경되었습니다.", type: "success", confirmButtonType: 'blackButton', onConfirm: () => { setIsModalOpen(false); fetchAdminNotices(); }, onClose: () => { setIsModalOpen(false); fetchAdminNotices(); } });
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error toggling importance:", error);
            setModalProps({ title: "오류", message: error.response?.data?.message || "중요도 변경 중 오류 발생", type: "error", confirmButtonType: 'blackButton', onConfirm: () => setIsModalOpen(false), onClose: () => setIsModalOpen(false) });
            setIsModalOpen(true);
        } finally {
            setIsActionLoading(false);
        }
    };

    const processDeleteNotice = async (idToDelete) => {
        const token = getToken();
        if (!token) {
            setModalProps({ title: "인증 오류", message: "로그인이 필요합니다.", type: "error", confirmButtonType: 'blackButton', onConfirm: () => setIsModalOpen(false), onClose: () => setIsModalOpen(false) });
            setIsModalOpen(true);
            return;
        }
        setIsActionLoading(true);
        try {
            await axios.delete(`/api/notices/${idToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setModalProps({ title: "성공", message: "공지사항이 삭제되었습니다.", type: "success", confirmButtonType: 'blackButton', 
                onConfirm: () => { 
                    setIsModalOpen(false); 
                    // 현재 페이지의 아이템이 모두 삭제되었을 경우 페이지 조정
                    if (noticesToDisplay.length === 1 && currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                    } else {
                        fetchAdminNotices();
                    }
                },
                onClose: () => { 
                    setIsModalOpen(false); 
                    if (noticesToDisplay.length === 1 && currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                    } else {
                        fetchAdminNotices();
                    }
                }
            });
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error deleting notice:", error);
            setModalProps({ title: "오류", message: error.response?.data?.message || "삭제 중 오류 발생", type: "error", confirmButtonType: 'blackButton', onConfirm: () => setIsModalOpen(false), onClose: () => setIsModalOpen(false) });
            setIsModalOpen(true);
        } finally {
            setIsActionLoading(false);
        }
    };
    
    const handleDelete = (id, noticeTitle) => {
        setModalProps({
            title: "삭제 확인",
            message: `"${noticeTitle}" 공지사항을 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
            type: "warning",
            confirmText: "삭제",
            cancelText: "취소",
            confirmButtonType: 'redButton', //  'dangerButton' or 'redButton'
            cancelButtonType: 'grayButton',
            onConfirm: () => { 
                // setIsModalOpen(false); // processDeleteNotice 내부에서 모달을 다시 열 수 있으므로 여기서 닫지 않거나, processDeleteNotice 성공/실패 시 명확히 제어
                processDeleteNotice(id); 
            },
            onClose: () => setIsModalOpen(false)
        });
        setIsModalOpen(true);
    };

    // asset 경로 수정 (상위 폴더 depth 고려)
    // 예: "../../assets/images/search_icon.png" -> "../../../assets/images/search_icon.png"
    // 스타일 경로도 마찬가지로 수정 필요할 수 있음

    return (
        <>
            <div className={styles.container}>
                <main className={styles.managerContent}>
                    <h1 className={styles.pageTitle}>공지사항 관리</h1>
                    <div className={styles.filterBar}>
                        <input type="date" className={styles.filterElement} value={inputDateRange.start} onChange={(e) => setInputDateRange(prev => ({ ...prev, start: e.target.value }))} />
                        <span className={styles.dateSeparator}>~</span>
                        <input type="date" className={styles.filterElement} value={inputDateRange.end} onChange={(e) => setInputDateRange(prev => ({ ...prev, end: e.target.value }))} />
                        
                        <select className={`${styles.filterElement} ${styles.filterSelect}`} value={inputImportanceFilter} onChange={(e) => setInputImportanceFilter(e.target.value)}>
                            <option value="all">중요도 (전체)</option>
                            <option value="important">중요 공지</option>
                            <option value="general">일반 공지</option>
                        </select>
                        
                        <input 
                            type="text" 
                            placeholder="통합 검색 (제목, 내용, 작성자ID/닉네임)" 
                            className={`${styles.filterElement} ${styles.filterSearchInput}`} 
                            value={inputSearchTerm} 
                            onChange={(e) => setInputSearchTerm(e.target.value)} 
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchOrFilterClick()}
                        />
                        <button type="button" className={styles.filterSearchButton} onClick={handleSearchOrFilterClick}>
                            <img src={searchButtonIcon} alt="검색" className={styles.searchIcon} />
                        </button>
                    </div>

                    {(isLoading || isActionLoading) && <p style={{ textAlign: 'center', margin: '20px' }}>{isActionLoading ? '처리 중입니다...' : '목록을 불러오는 중입니다...'}</p>}
                    {!isLoading && !isActionLoading && noticesToDisplay.length === 0 && (
                        <div style={{ textAlign: 'center', margin: '20px', padding: '20px', border: '1px solid #eee' }}>
                            표시할 공지사항이 없습니다. 다른 검색 조건으로 시도해보세요.
                        </div>
                    )}
                    
                    {!isLoading && noticesToDisplay.length > 0 && (
                        <table className={styles.noticeTable}>
                            <thead>
                                <tr>
                                    <th>NO/중요</th>
                                    <th>작성자ID</th>
                                    <th>닉네임</th>
                                    <th className={styles.titleHeaderColumn}>제목</th>
                                    <th>조회수</th>
                                    <th>작성일</th>
                                    <th>중요</th>
                                    <th>수정</th>
                                    <th>삭제</th>
                                </tr>
                            </thead>
                            <tbody>
                                {noticesToDisplay.map((notice) => (
                                    <tr key={notice.id} onClick={() => handleRowClick(notice.id)} className={`${styles.clickableRow} ${notice.isImportant ? styles.importantRow : ''}`}>
                                        <td>{notice.isImportant ? <span className={styles.importantTag}>{notice.displayNo}</span> : notice.displayNo}</td>
                                        <td>{notice.authorId}</td>
                                        <td>{notice.authorNickname}</td>
                                        <td className={styles.titleDataColumn}>{notice.title}</td>
                                        <td>{notice.viewCount}</td>
                                        <td>{notice.date}</td>
                                        <td className={styles.checkboxCell} onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={notice.isImportant}
                                                onChange={() => handleToggleImportant(notice.id, notice.isImportant)}
                                                disabled={isActionLoading}
                                            />
                                        </td>
                                        <td className={styles.actionCell} onClick={(e) => e.stopPropagation()}>
                                            <button onClick={(e) => { e.stopPropagation(); handleEdit(notice.id); }} className={`${styles.actionButton} ${styles.editButton}`} disabled={isActionLoading}>수정</button>
                                        </td>
                                        <td className={styles.actionCell} onClick={(e) => e.stopPropagation()}>
                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(notice.id, notice.title); }} className={`${styles.actionButton} ${styles.deleteButton}`} disabled={isActionLoading}>삭제</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                     <div className={styles.bottomActions}>
                        <Link to="/admin/managerNoticeWrite" className={`${styles.actionButton} ${styles.writeButton}`}>작성</Link>
                    </div>

                    {totalPages > 1 && !isLoading && (
                        <div className={styles.pagination}>
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                        </div>
                    )}
                </main>
            </div>
            <Modal
                isOpen={isModalOpen}
                // onClose는 modalProps에 이미 포함되어 있거나, Modal 컴포넌트 자체적으로 닫기 버튼을 가질 수 있음
                // 필요시: onClose={() => setIsModalOpen(false)}
                {...modalProps}
            />
        </>
    );
}

export default ManagerNotice;