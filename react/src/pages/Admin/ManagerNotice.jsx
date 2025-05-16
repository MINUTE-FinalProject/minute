import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 추가
import searchButtonIcon from "../../assets/images/search_icon.png"; // 실제 경로에 맞게 수정
import Pagination from '../../components/Pagination/Pagination'; // 실제 경로에 맞게 수정
import styles from './ManagerNotice.module.css';

// 예시 데이터 생성 함수 (ID, 닉네임 추가)
const generateInitialNotices = (count = 35) => {
    const notices = [];
    const authors = [
        { id: 'adminUser', nickname: '관리자' },
        { id: 'editor01', nickname: '편집자A' },
        { id: 'staff02', nickname: '운영팀B' }
    ];
    for (let i = 1; i <= count; i++) {
        const isImportant = i % 7 === 0 || i === 1;
        const author = authors[i % authors.length];
        notices.push({
            id: `notice-${i}`, // 공지사항 고유 ID
            displayNo: '', // 정렬 후 재계산될 번호
            authorId: author.id, // 작성자 ID
            authorNickname: author.nickname, // 작성자 닉네임
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

    useEffect(() => {
        const loadedNotices = generateInitialNotices();
        setAllNotices(loadedNotices);
    }, []);

    useEffect(() => {
        let filtered = allNotices;
        if (dateRange.start && dateRange.end) {
            filtered = filtered.filter(n => {
                const noticeDate = new Date(n.date.replace(/\./g, '-'));
                return noticeDate >= new Date(dateRange.start) && noticeDate <= new Date(dateRange.end);
            });
        }
        if (importanceFilter !== 'all') {
            filtered = filtered.filter(n =>
                importanceFilter === 'important' ? n.isImportant : !n.isImportant
            );
        }
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(n =>
                n.title.toLowerCase().includes(lowerSearchTerm) ||
                n.authorId.toLowerCase().includes(lowerSearchTerm) ||
                n.authorNickname.toLowerCase().includes(lowerSearchTerm)
            );
        }
        setNoticesToDisplay(filtered);
        setCurrentPage(1);
    }, [allNotices, dateRange, importanceFilter, searchTerm]);

    // --- 페이지네이션 로직 (currentDisplayedNotices 정의를 위로 이동) ---
    const totalPages = Math.ceil(noticesToDisplay.length / itemsPerPage);
    const indexOfLastNotice = currentPage * itemsPerPage;
    const indexOfFirstNotice = indexOfLastNotice - itemsPerPage;
    const currentDisplayedNotices = noticesToDisplay.slice(indexOfFirstNotice, indexOfLastNotice);

    // --- currentDisplayedNotices를 사용하는 변수 및 함수는 이 아래에 위치해야 합니다 ---
    const areAllInCurrentPageImportant = currentDisplayedNotices.length > 0 && currentDisplayedNotices.every(n => n.isImportant);

    const handleToggleImportant = (id) => {
        const updateLogic = (prevNotices) =>
            prevNotices.map(notice =>
                notice.id === id ? { ...notice, isImportant: !notice.isImportant } : notice
            ).sort((a, b) => {
                if (a.isImportant !== b.isImportant) return a.isImportant ? -1 : 1;
                const idA = parseInt(a.id.split('-')[1]);
                const idB = parseInt(b.id.split('-')[1]);
                return idB - idA;
            }).map((notice, index, arr) => {
                let generalCount = 0;
                arr.slice(0, index + 1).forEach(n => { if (!n.isImportant) generalCount++; });
                return { ...notice, displayNo: notice.isImportant ? '중요' : generalCount };
            });
        setAllNotices(updateLogic);
        console.log(`Notice ID ${id} importance toggled.`);
    };

    const handleToggleAllImportantInCurrentPage = (e) => {
        const newImportance = e.target.checked;
        const currentIds = currentDisplayedNotices.map(n => n.id); // 이제 currentDisplayedNotices 접근 가능

        const updateLogic = (prevNotices) =>
            prevNotices.map(notice =>
                currentIds.includes(notice.id) ? { ...notice, isImportant: newImportance } : notice
            ).sort((a, b) => {
                if (a.isImportant !== b.isImportant) return a.isImportant ? -1 : 1;
                const idA = parseInt(a.id.split('-')[1]);
                const idB = parseInt(b.id.split('-')[1]);
                return idB - idA;
            }).map((notice, index, arr) => {
                let generalCount = 0;
                arr.slice(0, index + 1).forEach(n => { if (!n.isImportant) generalCount++; });
                return { ...notice, displayNo: notice.isImportant ? '중요' : generalCount };
            });
        setAllNotices(updateLogic);
        console.log(`Current page notices importance toggled to: ${newImportance}`);
    };

    const handleEdit = (id) => {
        console.log(`Edit notice: ${id}`);
        navigate(`/admin/notice/edit/${id}`);
    };

    const handleDelete = (id) => {
        if (window.confirm(`정말로 공지사항(ID: ${id})을 삭제하시겠습니까?`)) {
            const updateLogic = (prevNotices) => prevNotices.filter(n => n.id !== id)
                .sort((a, b) => {
                    if (a.isImportant !== b.isImportant) return a.isImportant ? -1 : 1;
                    const idA = parseInt(a.id.split('-')[1]);
                    const idB = parseInt(b.id.split('-')[1]);
                    return idB - idA;
                }).map((notice, index, arr) => {
                    let generalCount = 0;
                    arr.slice(0, index + 1).forEach(n => { if (!n.isImportant) generalCount++; });
                    return { ...notice, displayNo: notice.isImportant ? '중요' : generalCount };
                });
            setAllNotices(updateLogic);
            console.log(`Delete notice: ${id}`);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className={styles.container}>
                <main className={styles.managerContent}>
                    <h1 className={styles.pageTitle}>공지사항 관리</h1>

                    <div className={styles.filterBar}>
                        <input
                            type="date"
                            className={styles.filterElement}
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        />
                        <span className={styles.dateSeparator}>~</span>
                        <input
                            type="date"
                            className={styles.filterElement}
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        />
                        <select
                            className={`${styles.filterElement} ${styles.filterSelect}`}
                            value={importanceFilter}
                            onChange={(e) => setImportanceFilter(e.target.value)}
                        >
                            <option value="all">중요도 (전체)</option>
                            <option value="important">중요 공지</option>
                            <option value="general">일반 공지</option>
                        </select>
                        <input
                            type="text"
                            placeholder="제목, 작성자ID, 닉네임 검색"
                            className={`${styles.filterElement} ${styles.filterSearchInput}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="button" className={styles.filterSearchButton}>
                            <img src={searchButtonIcon} alt="검색" className={styles.searchIcon} />
                        </button>
                    </div>

                    <h2 className={styles.subTitle}>공지사항 목록</h2>

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
                                        checked={areAllInCurrentPageImportant} // 이제 currentDisplayedNotices가 정의된 후 사용됨
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
                                    <tr key={notice.id} className={notice.isImportant ? styles.importantRow : ''}>
                                        <td>{notice.isImportant ? <span className={styles.importantTag}>중요</span> : notice.displayNo}</td>
                                        <td>{notice.authorId}</td>
                                        <td>{notice.authorNickname}</td>
                                        <td className={styles.titleDataColumn}>
                                            <Link to={`/admin/notice/view/${notice.id}`} className={styles.titleLink}>
                                                {notice.title}
                                            </Link>
                                        </td>
                                        <td>{notice.date}</td>
                                        <td className={styles.checkboxCell}>
                                            <input
                                                type="checkbox"
                                                checked={notice.isImportant}
                                                onChange={() => handleToggleImportant(notice.id)}
                                                title={notice.isImportant ? "중요 공지 해제" : "중요 공지로 설정"}
                                            />
                                        </td>
                                        <td className={styles.actionCell}>
                                            <button onClick={() => handleEdit(notice.id)} className={`${styles.actionButton} ${styles.editButton}`}>수정</button>
                                        </td>
                                        <td className={styles.actionCell}>
                                            <button onClick={() => handleDelete(notice.id)} className={`${styles.actionButton} ${styles.deleteButton}`}>삭제</button>
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
                        <Link to="/admin/notice/write" className={`${styles.actionButton} ${styles.writeButton}`}>작성</Link>
                    </div>

                    <div className={styles.pagination}>
                        {totalPages > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}

export default ManagerNotice;