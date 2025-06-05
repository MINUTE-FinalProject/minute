// src/pages/Admin/Notice/ManagerNotice.jsx

import axios from 'axios';
import qs from 'qs'; // qs 라이브러리 임포트
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import searchButtonIcon from "../../assets/images/search_icon.png";
import styles from '../../assets/styles/ManagerNotice.module.css';
import Modal from '../../components/Modal/Modal';
import Pagination from '../../components/Pagination/Pagination';

const API_BASE_URL = "/api/v1";

function ManagerNotice() {
    const navigate = useNavigate();

    const [inputSearchTerm, setInputSearchTerm] = useState('');
    const [inputDateRange, setInputDateRange] = useState({ start: '', end: '' });
    const [inputImportanceFilter, setInputImportanceFilter] = useState('all');

    const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
    const [appliedDateRange, setAppliedDateRange] = useState({ start: '', end: '' });
    const [appliedImportanceFilter, setAppliedImportanceFilter] = useState('all');

    const [noticesToDisplay, setNoticesToDisplay] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const itemsPerPage = 10;
    const [isLoading, setIsLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState({ state: false, config: {} });

    const getToken = () => localStorage.getItem("token");

    const fetchAdminNotices = useCallback(async () => {
        setIsLoading(true);
        const apiPage = currentPage - 1;

        const params = {
            page: apiPage,
            size: itemsPerPage,
            sort: [
                'noticeIsImportant,desc',
                'noticeCreatedAt,desc'
            ],
        };

        if (appliedSearchTerm.trim() !== "") {
            params.searchKeyword = appliedSearchTerm.trim();
        }
        if (appliedImportanceFilter === 'important') {
            params.isImportant = true;
        } else if (appliedImportanceFilter === 'general') {
            params.isImportant = false;
        }
        if (appliedDateRange.start) {
            params.dateFrom = `${appliedDateRange.start}T00:00:00`;
        }
        if (appliedDateRange.end) {
            params.dateTo = `${appliedDateRange.end}T23:59:59`;
        }

        const token = getToken();
        if (!token) {
            setIsLoading(false);
            setIsModalOpen({
                state: true,
                config: {
                    title: "인증 오류",
                    message: "관리자 로그인이 필요합니다.",
                    onConfirm: () => { setIsModalOpen({ state: false, config: {} }); navigate("/login"); },
                    type: 'error'
                }
            });
            return;
        }

        try {
            // ⭐ 수정: axios.get 호출 시 paramsSerializer를 함수 형태로 명시적으로 전달
            // 이렇게 하면 Axios가 qs.stringify를 사용하여 쿼리 파라미터를 직렬화합니다.
            const response = await axios.get(`${API_BASE_URL}/notices`, {
                headers: { 'Authorization': `Bearer ${token}` },
                params: params,
                paramsSerializer: params => {
                    return qs.stringify(params, { arrayFormat: 'repeat' })
                }
            });
            const data = response.data;

            let generalNoticeCounter = (currentPage - 1) * itemsPerPage; 
            const mappedNotices = data.content.map(notice => {
                const dateObj = new Date(notice.noticeCreatedAt);
                const formattedDate = `${String(dateObj.getFullYear()).slice(2)}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;
                
                let displayNoToShow;
                if (notice.noticeIsImportant) {
                    displayNoToShow = '중요';
                } else {
                    generalNoticeCounter++;
                    displayNoToShow = generalNoticeCounter;
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
            setCurrentPage(data.currentPage);

        } catch (error) {
            console.error("Error fetching admin notices:", error);
            const errorMsg = error.response?.data?.message || "공지사항 목록을 불러오는 데 실패했습니다.";
            setIsModalOpen({
                state: true,
                config: {
                    title: "오류 발생",
                    message: errorMsg,
                    confirmText: "확인",
                    type: 'error',
                    onConfirm: () => {
                        setIsModalOpen({ state: false, config: {} });
                        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                            navigate('/login');
                        }
                    }
                }
            });
            setNoticesToDisplay([]);
            setTotalPages(0);
            setTotalElements(0);
            setCurrentPage(1);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, itemsPerPage, appliedSearchTerm, appliedImportanceFilter, appliedDateRange, navigate]);

    useEffect(() => {
        fetchAdminNotices();
    }, [fetchAdminNotices]);

    const handleSearchOrFilterClick = () => {
        setAppliedSearchTerm(inputSearchTerm);
        setAppliedImportanceFilter(inputImportanceFilter);
        setAppliedDateRange(inputDateRange);
        if (currentPage === 1) {
        } else {
            setCurrentPage(1);
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
            setIsModalOpen({
                state: true,
                config: {
                    title: "인증 오류",
                    message: "관리자 로그인이 필요합니다.",
                    onConfirm: () => { setIsModalOpen({ state: false, config: {} }); navigate("/login"); },
                    type: 'error'
                }
            });
            return;
        }

        try {
            await axios.patch(`${API_BASE_URL}/notices/${id}/importance`, 
                { noticeIsImportant: !currentIsImportant },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsModalOpen({
                state: true,
                config: {
                    title: "변경 완료",
                    message: "공지사항 중요도가 성공적으로 변경되었습니다.",
                    confirmText: "확인",
                    type: "success",
                    onConfirm: () => { setIsModalOpen({ state: false, config: {} }); fetchAdminNotices(); }
                }
            });
        } catch (error) {
            console.error("Error toggling importance:", error);
            const errorMsg = error.response?.data?.message || "중요도 변경에 실패했습니다.";
            setIsModalOpen({
                state: true,
                config: {
                    title: "오류",
                    message: errorMsg,
                    confirmText: "확인",
                    type: "error",
                    onConfirm: () => setIsModalOpen({ state: false, config: {} })
                }
            });
        }
    };

    const processDeleteNotice = async (idToDelete) => {
        const token = getToken();
        if (!token) {
            setIsModalOpen({
                state: true,
                config: {
                    title: "인증 오류",
                    message: "관리자 로그인이 필요합니다.",
                    onConfirm: () => { setIsModalOpen({ state: false, config: {} }); navigate("/login"); },
                    type: 'error'
                }
            });
            return;
        }

        try {
            await axios.delete(`${API_BASE_URL}/notices/${idToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsModalOpen({
                state: true,
                config: {
                    title: "삭제 완료",
                    message: "공지사항이 성공적으로 삭제되었습니다.",
                    confirmText: "확인",
                    type: "success",
                    onConfirm: () => { setIsModalOpen({ state: false, config: {} }); fetchAdminNotices(); }
                }
            });
        } catch (error) {
            console.error("Error deleting notice:", error);
            const errorMsg = error.response?.data?.message || "공지사항 삭제에 실패했습니다.";
            setIsModalOpen({
                state: true,
                config: {
                    title: "오류",
                    message: errorMsg,
                    confirmText: "확인",
                    type: "error",
                    onConfirm: () => setIsModalOpen({ state: false, config: {} })
                }
            });
        }
    };
    
    const handleDelete = (id, noticeTitle) => {
        setIsModalOpen({
            state: true,
            config: {
                title: `공지사항 삭제 확인`,
                message: `공지사항 "${noticeTitle}" (ID: ${id})을(를) 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
                onConfirm: () => { setIsModalOpen({ state: false, config: {} }); processDeleteNotice(id); },
                confirmText: '삭제', cancelText: '취소',
                type: 'warning', confirmButtonType: 'danger',
                onCancel: () => setIsModalOpen({ state: false, config: {} })
            }
        });
    };

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
                        />
                        <button type="button" className={styles.filterSearchButton} onClick={handleSearchOrFilterClick}>
                            <img src={searchButtonIcon} alt="검색" className={styles.searchIcon} />
                        </button>
                    </div>

                    {isLoading && <p style={{ textAlign: 'center', margin: '20px' }}>목록을 불러오는 중입니다...</p>}
                    {!isLoading && totalElements === 0 && (
                        <div style={{ textAlign: 'center', margin: '20px', padding: '20px', border: '1px solid #eee' }}>
                            표시할 공지사항이 없습니다. 다른 검색 조건으로 시도해보세요.
                        </div>
                    )}
                    
                    {!isLoading && totalElements > 0 && (
                        <table className={styles.noticeTable}>
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
            {/* Modal 컴포넌트에 isModalOpen.state와 isModalOpen.config를 전달 */}
            <Modal
                isOpen={isModalOpen.state}
                onClose={() => setIsModalOpen({ state: false, config: {} })}
                {...isModalOpen.config}
            />
        </>
    );
}

export default ManagerNotice;