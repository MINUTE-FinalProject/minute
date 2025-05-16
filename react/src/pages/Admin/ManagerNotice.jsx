// ManagerNotice.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import searchButtonIcon from "../../assets/images/search_icon.png";
import Pagination from '../../components/Pagination/Pagination';
import styles from './ManagerNotice.module.css';

// generateInitialNotices 함수는 이전 제공된 버전 사용 (authorId, authorNickname 포함)
const generateInitialNotices = (count = 35) => { /* ... 이전 코드와 동일 ... */
    const notices = [];
    const authors = [
        { id: 'adminUser', nickname: '관리자' }, { id: 'editor01', nickname: '편집자A' }, { id: 'staff02', nickname: '운영팀B' }
    ];
    for (let i = 1; i <= count; i++) {
        const isImportant = i % 7 === 0 || i === 1; const author = authors[i % authors.length];
        notices.push({
            id: `notice-${i}`, displayNo: '', authorId: author.id, authorNickname: author.nickname,
            title: `공지사항 제목 ${i} ${isImportant ? "(필독 이벤트 관련 중요 안내입니다)" : "(일반 공지 사항)"}`,
            date: `2025.0${(i % 5) + 1}.${String(15 - (i % 15) + 1).padStart(2, '0')}`,
            isImportant: isImportant,
        });
    }
    const sortedNotices = notices.sort((a, b) => { /* ... 정렬 로직 ... */
        if (a.isImportant !== b.isImportant) return a.isImportant ? -1 : 1;
        const idA = parseInt(a.id.split('-')[1]); const idB = parseInt(b.id.split('-')[1]);
        return idB - idA;
    });
    let generalNoticeCounter = 1;
    return sortedNotices.map(notice => ({ ...notice, displayNo: notice.isImportant ? '중요' : generalNoticeCounter++ }));
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

    // 페이지네이션 로직 및 currentDisplayedNotices 정의 (앞으로 이동)
    const totalPages = Math.ceil(noticesToDisplay.length / itemsPerPage);
    const indexOfLastNotice = currentPage * itemsPerPage;
    const indexOfFirstNotice = indexOfLastNotice - itemsPerPage;
    const currentDisplayedNotices = noticesToDisplay.slice(indexOfFirstNotice, indexOfLastNotice);

    const areAllInCurrentPageImportant = currentDisplayedNotices.length > 0 && currentDisplayedNotices.every(n => n.isImportant);

    useEffect(() => { /* ... (데이터 로드 useEffect) ... */
        const loadedNotices = generateInitialNotices();
        setAllNotices(loadedNotices);
    }, []);
    useEffect(() => { /* ... (필터링 useEffect) ... */
        let filtered = allNotices;
        // 필터 로직 (날짜, 중요도, 검색어)
        if (dateRange.start && dateRange.end) { /* ... */ }
        if (importanceFilter !== 'all') { /* ... */ }
        if (searchTerm) { /* ... */ }
        setNoticesToDisplay(filtered);
        setCurrentPage(1);
    }, [allNotices, dateRange, importanceFilter, searchTerm]);


    const handleToggleImportant = (id) => { /* ... (기존 로직) ... */ };
    const handleToggleAllImportantInCurrentPage = (e) => { /* ... (기존 로직) ... */};
    const handleEdit = (id) => { navigate(`/admin/managerNoticeEdit/${id}`); }; // 경로 수정
    const handleDelete = (id) => { /* ... (기존 로직) ... */ };
    const handlePageChange = (pageNumber) => { setCurrentPage(pageNumber); };

    // 행 클릭 핸들러
    const handleRowClick = (noticeId) => {
        navigate(`/admin/managerNoticeDetail/${noticeId}`);
    };


    return (
        <>
            <div className={styles.container}>
                <main className={styles.managerContent}>
                    <h1 className={styles.pageTitle}>공지사항 관리</h1>
                    <div className={styles.filterBar}>
                        {/* ... 필터 요소들 ... */}
                        <input type="date" className={styles.filterElement} value={dateRange.start} onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))} />
                        <span className={styles.dateSeparator}>~</span>
                        <input type="date" className={styles.filterElement} value={dateRange.end} onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))} />
                        <select className={`${styles.filterElement} ${styles.filterSelect}`} value={importanceFilter} onChange={(e) => setImportanceFilter(e.target.value)}>
                            <option value="all">중요도 (전체)</option><option value="important">중요 공지</option><option value="general">일반 공지</option>
                        </select>
                        <input type="text" placeholder="제목, 작성자ID, 닉네임 검색" className={`${styles.filterElement} ${styles.filterSearchInput}`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <button type="button" className={styles.filterSearchButton}><img src={searchButtonIcon} alt="검색" className={styles.searchIcon} /></button>
                    </div>
                    <h2 className={styles.subTitle}>공지사항 목록</h2>
                    <table className={styles.noticeTable}>
                        <thead>
                            <tr>
                                <th>NO/중요</th><th>ID</th><th>닉네임</th>
                                <th className={styles.titleHeaderColumn}>제목</th>
                                <th>작성일</th>
                                <th>
                                    <input type="checkbox" title="현재 페이지 전체 중요도 설정/해제" checked={areAllInCurrentPageImportant} onChange={handleToggleAllImportantInCurrentPage} disabled={currentDisplayedNotices.length === 0} className={styles.headerCheckbox}/> 중요
                                </th>
                                <th>수정</th><th>삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDisplayedNotices.length > 0 ? (
                                currentDisplayedNotices.map((notice) => (
                                    // 행 전체 클릭 또는 제목 Link 클릭 중 선택 또는 둘 다 사용 (Link에는 stopPropagation)
                                    <tr key={notice.id} onClick={() => handleRowClick(notice.id)} className={`${styles.clickableRow} ${notice.isImportant ? styles.importantRow : ''}`}>
                                        <td>{notice.isImportant ? <span className={styles.importantTag}>중요</span> : notice.displayNo}</td>
                                        <td>{notice.authorId}</td>
                                        <td>{notice.authorNickname}</td>
                                        <td className={styles.titleDataColumn}>
                                            {/* <Link to={`/admin/managerNoticeDetail/${notice.id}`} className={styles.titleLink} onClick={(e)=> e.stopPropagation()}>
                                                {notice.title}
                                            </Link> */}
                                            {notice.title} {/* 행 전체 클릭 시 제목은 텍스트로만 */}
                                        </td>
                                        <td>{notice.date}</td>
                                        <td className={styles.checkboxCell}>
                                            <input type="checkbox" checked={notice.isImportant} onChange={(e) => {e.stopPropagation(); handleToggleImportant(notice.id);}} title={notice.isImportant ? "중요 공지 해제" : "중요 공지로 설정"} />
                                        </td>
                                        <td className={styles.actionCell}>
                                            <button onClick={(e) => {e.stopPropagation(); handleEdit(notice.id);}} className={`${styles.actionButton} ${styles.editButton}`}>수정</button>
                                        </td>
                                        <td className={styles.actionCell}>
                                            <button onClick={(e) => {e.stopPropagation(); handleDelete(notice.id);}} className={`${styles.actionButton} ${styles.deleteButton}`}>삭제</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (<tr><td colSpan="8">표시할 공지사항이 없습니다.</td></tr>)}
                        </tbody>
                    </table>
                    <div className={styles.bottomActions}>
                        <Link to="/admin/managerNoticeWrite" className={`${styles.actionButton} ${styles.writeButton}`}>작성</Link> {/* 수정된 경로 */}
                    </div>
                    <div className={styles.pagination}>
                        {/* ... Pagination ... */}
                        {totalPages > 0 && ( <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/> )}
                    </div>
                </main>
            </div>
        </>
    );
}

export default ManagerNotice;