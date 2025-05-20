// src/pages/Admin/Notice/ManagerNotice.jsx (또는 해당 파일의 실제 경로)
import { useEffect, useState } from 'react'; // React import 추가
import { Link, useNavigate } from 'react-router-dom';
import searchButtonIcon from "../../assets/images/search_icon.png";
import styles from '../../assets/styles/ManagerNotice.module.css';
import Modal from '../../components/Modal/Modal'; // Modal 컴포넌트 import
import Pagination from '../../components/Pagination/Pagination';

const generateInitialNotices = (count = 35) => {
    // ... (기존 generateInitialNotices 함수 내용 유지)
    const notices = [];
    const authors = [
        { id: 'adminUser', nickname: '관리자' }, { id: 'editor01', nickname: '편집자A' }, { id: 'staff02', nickname: '운영팀B' }
    ];
    for (let i = 1; i <= count; i++) {
        const isImportant = i % 7 === 0 || i === 1;
        const author = authors[i % authors.length];
        notices.push({
            id: `notice-${i}`,
            displayNo: '', 
            authorId: author.id,
            authorNickname: author.nickname,
            title: `공지사항 제목 ${i} ${isImportant ? "(필독 이벤트 관련 중요 안내입니다)" : "(일반 공지 사항)"}`,
            date: `2025.0${(i % 5) + 1}.${String(15 - (i % 15) + 1).padStart(2, '0')}`,
            isImportant: isImportant,
        });
    }
    const sortedNotices = notices.sort((a, b) => {
        if (a.isImportant !== b.isImportant) {
            return a.isImportant ? -1 : 1;
        }
        const idA = parseInt(a.id.split('-')[1]);
        const idB = parseInt(b.id.split('-')[1]);
        return idB - idA;
    });
    let generalNoticeCounter = 1;
    return sortedNotices.map(notice => ({
        ...notice,
        displayNo: notice.isImportant ? '중요' : generalNoticeCounter++
    }));
};


function ManagerNotice() {
    const navigate = useNavigate();
    const [allNotices, setAllNotices] = useState([]);
    const [noticesToDisplay, setNoticesToDisplay] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [importanceFilter, setImportanceFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

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
        const loadedNotices = generateInitialNotices();
        setAllNotices(loadedNotices);
    }, []);

    useEffect(() => {
        let filtered = [...allNotices];

        if (importanceFilter !== 'all') {
            const isImportantFilter = importanceFilter === 'important';
            filtered = filtered.filter(notice => notice.isImportant === isImportantFilter);
        }

        if (searchTerm.trim() !== '') {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(notice =>
                notice.title.toLowerCase().includes(lowerSearchTerm) ||
                notice.authorId.toLowerCase().includes(lowerSearchTerm) ||
                notice.authorNickname.toLowerCase().includes(lowerSearchTerm)
            );
        }
        // 날짜 필터 로직 (필요시 구현)

        setNoticesToDisplay(filtered);
        setCurrentPage(1);
    }, [allNotices, dateRange, importanceFilter, searchTerm]);

    const totalPages = Math.ceil(noticesToDisplay.length / itemsPerPage);
    const indexOfLastNotice = currentPage * itemsPerPage;
    const indexOfFirstNotice = indexOfLastNotice - itemsPerPage;
    const currentDisplayedNotices = noticesToDisplay.slice(indexOfFirstNotice, indexOfLastNotice);

    const areAllInCurrentPageImportant = currentDisplayedNotices.length > 0 && currentDisplayedNotices.every(n => n.isImportant);

    const handleToggleImportant = (id) => {
        // 중요도 변경은 즉시 반영 (모달 없이)
        setAllNotices(prevNotices => {
            const updatedNotices = prevNotices.map(notice =>
                notice.id === id ? { ...notice, isImportant: !notice.isImportant } : notice
            );
            const sorted = updatedNotices.sort((a, b) => {
                if (a.isImportant !== b.isImportant) return a.isImportant ? -1 : 1;
                const idA = parseInt(a.id.split('-')[1]);
                const idB = parseInt(b.id.split('-')[1]);
                return idB - idA;
            });
            let counter = 1;
            return sorted.map(n => ({ ...n, displayNo: n.isImportant ? '중요' : counter++ }));
        });
    };

    const handleToggleAllImportantInCurrentPage = (e) => {
        const newImportantState = e.target.checked;
        setAllNotices(prevNotices => {
            const currentIds = currentDisplayedNotices.map(n => n.id);
            const updatedNotices = prevNotices.map(notice =>
                currentIds.includes(notice.id) ? { ...notice, isImportant: newImportantState } : notice
            );
            const sorted = updatedNotices.sort((a, b) => {
                if (a.isImportant !== b.isImportant) return a.isImportant ? -1 : 1;
                const idA = parseInt(a.id.split('-')[1]);
                const idB = parseInt(b.id.split('-')[1]);
                return idB - idA;
            });
            let counter = 1;
            return sorted.map(n => ({ ...n, displayNo: n.isImportant ? '중요' : counter++ }));
        });
    };

    const handleEdit = (id) => {
        navigate(`/admin/managerNoticeEdit/${id}`);
    };

    // --- 공지사항 삭제 처리 (Modal 적용) ---
    const processDeleteNotice = (idToDelete) => {
        setAllNotices(prevNotices => {
            const updatedNotices = prevNotices.filter(notice => notice.id !== idToDelete);
            const sorted = updatedNotices.sort((a, b) => {
                if (a.isImportant !== b.isImportant) return a.isImportant ? -1 : 1;
                const idA = parseInt(a.id.split('-')[1] || 0); // 'sticky' 같은 경우 대비
                const idB = parseInt(b.id.split('-')[1] || 0);
                return idB - idA;
            });
            let counter = 1;
            return sorted.map(n => ({ ...n, displayNo: n.isImportant ? '중요' : counter++ }));
        });
        // TODO: API로 실제 삭제 요청

        setModalProps({
            title: "삭제 완료",
            message: `공지사항 (ID: ${idToDelete})이(가) 성공적으로 삭제되었습니다.`,
            confirmText: "확인",
            type: "adminSuccess", // 또는 'success' (핑크 버튼 원하시면)
            confirmButtonType: 'primary'
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id, noticeTitle) => {
        setModalProps({
            title: "공지사항 삭제 확인",
            message: `"${noticeTitle}" (ID: ${id}) 공지사항을 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
            onConfirm: () => processDeleteNotice(id),
            confirmText: "삭제",
            cancelText: "취소",
            type: "adminConfirm", // 또는 'adminWarning'
            confirmButtonType: 'danger'
        });
        setIsModalOpen(true);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRowClick = (noticeId) => {
        navigate(`/admin/managerNoticeDetail/${noticeId}`);
    };

    return (
        <>
            <div className={styles.container}>
                <main className={styles.managerContent}>
                    <h1 className={styles.pageTitle}>공지사항 관리</h1>
                    <div className={styles.filterBar}>
                        <input type="date" className={styles.filterElement} value={dateRange.start} onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))} />
                        <span className={styles.dateSeparator}>~</span>
                        <input type="date" className={styles.filterElement} value={dateRange.end} onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))} />
                        <select className={`${styles.filterElement} ${styles.filterSelect}`} value={importanceFilter} onChange={(e) => setImportanceFilter(e.target.value)}>
                            <option value="all">중요도 (전체)</option>
                            <option value="important">중요 공지</option>
                            <option value="general">일반 공지</option>
                        </select>
                        <input type="text" placeholder="제목, 작성자ID, 닉네임 검색" className={`${styles.filterElement} ${styles.filterSearchInput}`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <button type="button" className={styles.filterSearchButton}>
                            <img src={searchButtonIcon} alt="검색" className={styles.searchIcon} />
                        </button>
                    </div>

                    <table className={styles.noticeTable}>
                        <thead>
                            <tr>
                                <th>NO/중요</th>
                                <th>ID</th>
                                <th>닉네임</th>
                                <th className={styles.titleHeaderColumn}>제목</th>
                                <th>작성일</th>
                                <th onClick={(e) => e.stopPropagation()}> 
                                    <input
                                        type="checkbox"
                                        title="현재 페이지 전체 중요도 설정/해제"
                                        checked={areAllInCurrentPageImportant}
                                        onChange={handleToggleAllImportantInCurrentPage}
                                        disabled={currentDisplayedNotices.length === 0}
                                        className={styles.headerCheckbox}
                                        onClick={(e) => e.stopPropagation()} 
                                    /> 중요
                                </th>
                                <th>수정</th>
                                <th>삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDisplayedNotices.length > 0 ? (
                                currentDisplayedNotices.map((notice) => (
                                    <tr key={notice.id} onClick={() => handleRowClick(notice.id)} className={`${styles.clickableRow} ${notice.isImportant ? styles.importantRow : ''}`}>
                                        <td>{notice.isImportant ? <span className={styles.importantTag}>{notice.displayNo}</span> : notice.displayNo}</td>
                                        <td>{notice.authorId}</td>
                                        <td>{notice.authorNickname}</td>
                                        <td className={styles.titleDataColumn}>
                                            {notice.title}
                                        </td>
                                        <td>{notice.date}</td>
                                        <td className={styles.checkboxCell} onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={notice.isImportant}
                                                onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    handleToggleImportant(notice.id);
                                                }}
                                                title={notice.isImportant ? "중요 공지 해제" : "중요 공지로 설정"}
                                            />
                                        </td>
                                        <td className={styles.actionCell} onClick={(e) => e.stopPropagation()}>
                                            <button onClick={(e) => { e.stopPropagation(); handleEdit(notice.id); }} className={`${styles.actionButton} ${styles.editButton}`}>수정</button>
                                        </td>
                                        <td className={styles.actionCell} onClick={(e) => e.stopPropagation()}>
                                            {/* handleDelete 호출 시 notice.title도 전달 */}
                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(notice.id, notice.title); }} className={`${styles.actionButton} ${styles.deleteButton}`}>삭제</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8">표시할 공지사항이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className={styles.bottomActions}>
                        <Link to="/admin/managerNoticeWrite" className={`${styles.actionButton} ${styles.writeButton}`}>작성</Link>
                    </div>
                    <div className={styles.pagination}>
                        {totalPages > 0 && (<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />)}
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

export default ManagerNotice;