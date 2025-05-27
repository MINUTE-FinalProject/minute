// src/pages/Admin/Notice/ManagerNotice.jsx

import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import searchButtonIcon from "../../assets/images/search_icon.png";
import styles from '../../assets/styles/ManagerNotice.module.css';
import Modal from '../../components/Modal/Modal';
import Pagination from '../../components/Pagination/Pagination';

function ManagerNotice() {
    const navigate = useNavigate();

    // --- UI 입력용 상태 (사용자가 직접 변경하는 값) ---
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

    // --- 모달 상태 ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalProps, setModalProps] = useState({
        title: '', message: '', onConfirm: null, confirmText: '확인',
        cancelText: null, type: 'default', confirmButtonType: 'primary',
        cancelButtonType: 'secondary'
    });

    // API 호출 함수
    const fetchAdminNotices = useCallback(async () => {
        setIsLoading(true);
        const apiPage = currentPage - 1; // API는 0-based 페이지
        let apiUrl = `/api/notices?page=${apiPage}&size=${itemsPerPage}`;

        // "적용된" 필터 값들을 사용하여 URL 구성
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

        // console.log("Fetching URL:", apiUrl); // 디버깅용

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
                throw new Error(errorData.message);
            }
            const data = await response.json();

            let generalNoticeCounterBase = (currentPage - 1) * itemsPerPage;
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
                };
            });

            setNoticesToDisplay(mappedNotices);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);

        } catch (error) {
            console.error("Error fetching admin notices:", error);
            setModalProps({ /* ... 오류 모달 설정 ... */ });
            setIsModalOpen(true);
            setNoticesToDisplay([]);
            setTotalPages(0);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, itemsPerPage, appliedSearchTerm, appliedImportanceFilter, appliedDateRange]);

    // "적용된" 필터 또는 현재 페이지가 변경될 때 데이터 다시 불러오기
    useEffect(() => {
        fetchAdminNotices();
    }, [fetchAdminNotices]); // fetchAdminNotices는 useCallback으로 감싸져 있고, 그 의존성에 applied* 상태들이 포함됨

    // "검색" 버튼 클릭 핸들러
    const handleSearchOrFilterClick = () => {
        setAppliedSearchTerm(inputSearchTerm);
        setAppliedImportanceFilter(inputImportanceFilter);
        setAppliedDateRange(inputDateRange);
        // 검색 시에는 항상 첫 페이지부터 결과를 보여주도록 설정
        if (currentPage === 1) {
            // 이미 1페이지면, applied* 상태 변경만으로 useEffect가 트리거되어 fetchAdminNotices 호출
        } else {
            setCurrentPage(1); // currentPage 변경이 useEffect를 트리거
        }
    };
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRowClick = (noticeId) => { navigate(`/admin/managerNoticeDetail/${noticeId}`); };
    const handleEdit = (id) => { navigate(`/admin/managerNoticeEdit/${id}`); };

    // --- 중요도 변경, 삭제 핸들러 (API 호출 준비) ---
    const handleToggleImportant = async (id, currentIsImportant) => {
        // TODO: API 호출 (PATCH /api/notices/{id}/importance) 및 목록 새로고침 (fetchAdminNotices())
        console.log(`Toggle importance for ID: ${id}. API call pending.`);
        alert("중요도 변경 API 연동 후 목록 새로고침 필요");
    };

    const processDeleteNotice = async (idToDelete) => {
        // TODO: API 호출 (DELETE /api/notices/{idToDelete}) 및 목록 새로고침 (fetchAdminNotices())
        console.log(`Delete notice ID: ${idToDelete}. API call pending.`);
        alert("삭제 API 연동 후 목록 새로고침 필요");
    };
    
    const handleDelete = (id, noticeTitle) => {
        setModalProps({ /* ... 삭제 확인 모달 설정 ... */
            onConfirm: () => { processDeleteNotice(id); setIsModalOpen(false); },
            onClose: () => setIsModalOpen(false)
        });
        setIsModalOpen(true);
    };

    return (
        <>
            <div className={styles.container}>
                <main className={styles.managerContent}>
                    <h1 className={styles.pageTitle}>공지사항 관리</h1>
                    <div className={styles.filterBar}>
                        {/* UI 입력 필드들은 input* 상태와 연결 */}
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
                        />
                        {/* 검색 버튼은 handleSearchOrFilterClick 호출 */}
                        <button type="button" className={styles.filterSearchButton} onClick={handleSearchOrFilterClick}>
                            <img src={searchButtonIcon} alt="검색" className={styles.searchIcon} />
                        </button>
                    </div>

                    {/* ... (테이블 및 나머지 JSX는 이전과 거의 동일, noticesToDisplay 사용) ... */}
                    {isLoading && <p style={{ textAlign: 'center', margin: '20px' }}>목록을 불러오는 중입니다...</p>}
                    {!isLoading && noticesToDisplay.length === 0 && (
                        <div style={{ textAlign: 'center', margin: '20px', padding: '20px', border: '1px solid #eee' }}>
                            표시할 공지사항이 없습니다. 다른 검색 조건으로 시도해보세요.
                        </div>
                    )}
                    
                    {!isLoading && noticesToDisplay.length > 0 && (
                        <table className={styles.noticeTable}>
                            {/* thead 생략 - 이전과 동일 */}
                            <thead>
                                <tr>
                                    <th>NO/중요</th>
                                    <th>작성자ID</th>
                                    <th>닉네임</th>
                                    <th className={styles.titleHeaderColumn}>제목</th>
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
                                        <td>{notice.date}</td>
                                        <td className={styles.checkboxCell} onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={notice.isImportant}
                                                onChange={() => handleToggleImportant(notice.id, notice.isImportant)}
                                            />
                                        </td>
                                        <td className={styles.actionCell} onClick={(e) => e.stopPropagation()}>
                                            <button onClick={(e) => { e.stopPropagation(); handleEdit(notice.id); }} className={`${styles.actionButton} ${styles.editButton}`}>수정</button>
                                        </td>
                                        <td className={styles.actionCell} onClick={(e) => e.stopPropagation()}>
                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(notice.id, notice.title); }} className={`${styles.actionButton} ${styles.deleteButton}`}>삭제</button>
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
                onClose={() => setIsModalOpen(false)}
                {...modalProps}
            />
        </>
    );
}

export default ManagerNotice;