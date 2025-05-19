// ManagerNotice.jsx (부제목 "공지사항 목록" 삭제됨)
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import searchButtonIcon from "../../assets/images/search_icon.png"; // 실제 경로로 수정해주세요
import Pagination from '../../components/Pagination/Pagination'; // 실제 경로로 수정해주세요
import styles from './ManagerNotice.module.css'; // 실제 경로로 수정해주세요

// generateInitialNotices 함수는 이전 제공된 버전 사용 (authorId, authorNickname 포함)
const generateInitialNotices = (count = 35) => {
    const notices = [];
    const authors = [
        { id: 'adminUser', nickname: '관리자' }, { id: 'editor01', nickname: '편집자A' }, { id: 'staff02', nickname: '운영팀B' }
    ];
    for (let i = 1; i <= count; i++) {
        const isImportant = i % 7 === 0 || i === 1;
        const author = authors[i % authors.length];
        notices.push({
            id: `notice-${i}`,
            displayNo: '', // 정렬 후 채워짐
            authorId: author.id,
            authorNickname: author.nickname,
            title: `공지사항 제목 ${i} ${isImportant ? "(필독 이벤트 관련 중요 안내입니다)" : "(일반 공지 사항)"}`,
            date: `2025.0${(i % 5) + 1}.${String(15 - (i % 15) + 1).padStart(2, '0')}`,
            isImportant: isImportant,
        });
    }
    // 중요도 및 최신순 정렬
    const sortedNotices = notices.sort((a, b) => {
        if (a.isImportant !== b.isImportant) {
            return a.isImportant ? -1 : 1; // 중요 공지가 위로
        }
        const idA = parseInt(a.id.split('-')[1]); // 'notice-1' -> 1
        const idB = parseInt(b.id.split('-')[1]);
        return idB - idA; // 최신 공지 (ID가 큰 것)가 위로
    });

    // 정렬 후 displayNo 할당
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

    useEffect(() => {
        const loadedNotices = generateInitialNotices();
        setAllNotices(loadedNotices);
    }, []);

    useEffect(() => {
        let filtered = [...allNotices]; // 원본 배열 복사

        // 날짜 필터 (구현 필요 시 주석 해제 및 로직 추가)
        // if (dateRange.start && dateRange.end) {
        //     filtered = filtered.filter(notice => {
        //         const noticeDate = new Date(notice.date.replace(/\./g, '-'));
        //         const startDate = new Date(dateRange.start);
        //         const endDate = new Date(dateRange.end);
        //         return noticeDate >= startDate && noticeDate <= endDate;
        //     });
        // }

        // 중요도 필터
        if (importanceFilter !== 'all') {
            const isImportantFilter = importanceFilter === 'important';
            filtered = filtered.filter(notice => notice.isImportant === isImportantFilter);
        }

        // 검색어 필터 (제목, 작성자ID, 닉네임)
        if (searchTerm.trim() !== '') {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(notice =>
                notice.title.toLowerCase().includes(lowerSearchTerm) ||
                notice.authorId.toLowerCase().includes(lowerSearchTerm) ||
                notice.authorNickname.toLowerCase().includes(lowerSearchTerm)
            );
        }

        setNoticesToDisplay(filtered);
        setCurrentPage(1); // 필터 변경 시 첫 페이지로
    }, [allNotices, dateRange, importanceFilter, searchTerm]);

    const totalPages = Math.ceil(noticesToDisplay.length / itemsPerPage);
    const indexOfLastNotice = currentPage * itemsPerPage;
    const indexOfFirstNotice = indexOfLastNotice - itemsPerPage;
    const currentDisplayedNotices = noticesToDisplay.slice(indexOfFirstNotice, indexOfLastNotice);

    const areAllInCurrentPageImportant = currentDisplayedNotices.length > 0 && currentDisplayedNotices.every(n => n.isImportant);

    const handleToggleImportant = (id) => {
        // 실제로는 API 호출 후 상태를 업데이트해야 합니다.
        setAllNotices(prevNotices => {
            const updatedNotices = prevNotices.map(notice =>
                notice.id === id ? { ...notice, isImportant: !notice.isImportant } : notice
            );
            // 중요도 변경 후 다시 정렬 및 displayNo 재할당
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
            // 중요도 변경 후 다시 정렬 및 displayNo 재할당
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
        navigate(`/admin/managerNoticeEdit/${id}`); // 수정 페이지로 이동
    };

    const handleDelete = (id) => {
        // 실제로는 API 호출로 삭제 후 목록을 다시 불러오거나 상태에서 제거합니다.
        if (window.confirm(`공지사항 ID: ${id}를 정말 삭제하시겠습니까?`)) {
            setAllNotices(prevNotices => {
                const updatedNotices = prevNotices.filter(notice => notice.id !== id);
                // 삭제 후 다시 정렬 및 displayNo 재할당 (옵션, 번호가 유지되길 원하면 생략)
                const sorted = updatedNotices.sort((a, b) => {
                    if (a.isImportant !== b.isImportant) return a.isImportant ? -1 : 1;
                    const idA = parseInt(a.id.split('-')[1]);
                    const idB = parseInt(b.id.split('-')[1]);
                    return idB - idA;
                });
                let counter = 1;
                return sorted.map(n => ({ ...n, displayNo: n.isImportant ? '중요' : counter++ }));
            });
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRowClick = (noticeId) => {
        navigate(`/admin/managerNoticeDetail/${noticeId}`); // 상세 페이지로 이동
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

                    {/* "공지사항 목록" 부제목 <h2 className={styles.subTitle}>공지사항 목록</h2> 이 삭제되었습니다. */}

                    <table className={styles.noticeTable}>
                        <thead>
                            <tr>
                                <th>NO/중요</th>
                                <th>ID</th>
                                <th>닉네임</th>
                                <th className={styles.titleHeaderColumn}>제목</th>
                                <th>작성일</th>
                                <th>
                                    <input
                                        type="checkbox"
                                        title="현재 페이지 전체 중요도 설정/해제"
                                        checked={areAllInCurrentPageImportant}
                                        onChange={handleToggleAllImportantInCurrentPage}
                                        disabled={currentDisplayedNotices.length === 0}
                                        className={styles.headerCheckbox}
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
                                        <td>{notice.isImportant ? <span className={styles.importantTag}>중요</span> : notice.displayNo}</td>
                                        <td>{notice.authorId}</td>
                                        <td>{notice.authorNickname}</td>
                                        <td className={styles.titleDataColumn}>
                                            {notice.title}
                                        </td>
                                        <td>{notice.date}</td>
                                        <td className={styles.checkboxCell}>
                                            <input
                                                type="checkbox"
                                                checked={notice.isImportant}
                                                onChange={(e) => { e.stopPropagation(); handleToggleImportant(notice.id); }}
                                                title={notice.isImportant ? "중요 공지 해제" : "중요 공지로 설정"}
                                            />
                                        </td>
                                        <td className={styles.actionCell}>
                                            <button onClick={(e) => { e.stopPropagation(); handleEdit(notice.id); }} className={`${styles.actionButton} ${styles.editButton}`}>수정</button>
                                        </td>
                                        <td className={styles.actionCell}>
                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(notice.id); }} className={`${styles.actionButton} ${styles.deleteButton}`}>삭제</button>
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
        </>
    );
}

export default ManagerNotice;