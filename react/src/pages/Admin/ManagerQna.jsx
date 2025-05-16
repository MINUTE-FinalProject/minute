// ManagerQna.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가 (선택적: 행 전체 클릭 시)
import reportOffIcon from '../../assets/images/able-alarm.png';
import reportOnIcon from '../../assets/images/disable-alarm.png';
import searchButtonIcon from '../../assets/images/search_icon.png';
import Pagination from '../../components/Pagination/Pagination';
import styles from './ManagerQna.module.css';

const generateInitialQnaData = (count = 42) => {
    const data = [];
    const answerStatuses = ['답변완료', '미답변'];
    for (let i = 0; i < count; i++) {
        const isReported = i % 10 === 0;
        data.push({
            qnaId: i + 1, NO: count - i, ID: `user${1000 + i}`, 닉네임: `문의자${i + 1}`,
            제목: `문의사항 제목입니다 - 테스트 ${i + 1}`,
            작성일: `2025.05.${String(15 - (i % 15)).padStart(2, '0')}`,
            isReported: isReported, 답변상태: answerStatuses[i % answerStatuses.length],
        });
    }
    return data;
};

function ManagerQna() {
    const navigate = useNavigate(); // 행 전체 클릭을 원할 경우 사용
    const [allQnaData, setAllQnaData] = useState([]);
    const [qnaListToDisplay, setQnaListToDisplay] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadedQnaData = generateInitialQnaData();
        setAllQnaData(loadedQnaData);
    }, []);

    useEffect(() => {
        let filteredData = allQnaData;
        if (dateRange.start && dateRange.end) { /* ... 날짜 필터 ... */ }
        if (statusFilter !== 'all') {
            filteredData = filteredData.filter(qna => qna.답변상태 === statusFilter);
        }
        if (searchTerm) { /* ... 검색어 필터 ... */ }
        setQnaListToDisplay(filteredData);
        setCurrentPage(1);
    }, [dateRange, statusFilter, searchTerm, allQnaData]);

    const handleQnaReportToggle = (e, qnaId) => { /* ... (기존 로직) ... */ e.stopPropagation(); };
    const totalPages = Math.ceil(qnaListToDisplay.length / itemsPerPage);
    const indexOfLastQna = currentPage * itemsPerPage;
    const indexOfFirstQna = indexOfLastQna - itemsPerPage;
    const currentDisplayedQnaItems = qnaListToDisplay.slice(indexOfFirstQna, indexOfLastQna);
    const handlePageChange = (pageNumber) => { setCurrentPage(pageNumber); };

    // 행 전체 클릭을 원할 경우
    const handleRowClick = (qnaId) => {
        navigate(`/admin/managerQnaDetail/${qnaId}`);
    };

    return (
        <>
            <div className={styles.container}>
                <main className={styles.qnaContent}>
                    <h1 className={styles.pageTitle}>문의 관리</h1>
                    <div className={styles.filterBar}>
                        {/* ... 필터 요소들 ... */}
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
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">답변상태 (전체)</option>
                            <option value="답변완료">답변완료</option>
                            <option value="미답변">미답변</option>
                        </select>
                        <input
                            type="text"
                            placeholder="ID, 닉네임, 제목 검색"
                            className={`${styles.filterElement} ${styles.filterSearchInput}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="button" className={styles.filterSearchButton}>
                            <img src={searchButtonIcon} alt="검색" className={styles.searchIcon} />
                        </button>
                    </div>
                    <table className={styles.qnaTable}>
                        <thead>
                            <tr>
                                <th>NO</th><th>ID</th><th>닉네임</th>
                                <th className={styles.titleHeaderColumn}>제목</th>
                                <th>작성일</th><th>신고</th><th>답변상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDisplayedQnaItems.length > 0 ? (
                                currentDisplayedQnaItems.map((qna) => (
                                    <tr key={qna.qnaId} onClick={() => handleRowClick(qna.qnaId)} className={styles.clickableRow}>
                                        <td>{qna.NO}</td>
                                        <td>{qna.ID}</td>
                                        <td>{qna.닉네임}</td>
                                        <td className={styles.titleDataColumn}>
                                            {/* Link를 사용하지 않고 행 전체 클릭으로 변경, 또는 Link 유지 시 to 경로 수정 */}
                                            {/* <Link to={`/admin/managerQnaDetail/${qna.qnaId}`} className={styles.titleLink} onClick={(e) => e.stopPropagation()}>
                                                {qna.제목}
                                            </Link> */}
                                            {qna.제목} {/* 행 전체 클릭 시 제목은 텍스트로만 표시 */}
                                        </td>
                                        <td>{qna.작성일}</td>
                                        <td>
                                            <button
                                                onClick={(e) => handleQnaReportToggle(e, qna.qnaId)}
                                                className={`${styles.iconButton} ${qna.isReported ? styles.reportedButton : ''}`}
                                                title={qna.isReported ? "신고 처리됨 (클릭 시 해제 가능)" : "신고 처리하기"}
                                            >
                                                <img src={qna.isReported ? reportOnIcon : reportOffIcon} alt="신고" className={styles.buttonIcon}/>
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className={`${styles.statusButton} ${qna.답변상태 === '답변완료' ? styles.answeredStatus : styles.unansweredStatus}`}
                                                disabled
                                            >
                                                {qna.답변상태}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : ( <tr><td colSpan="7">표시할 문의사항이 없습니다.</td></tr> )}
                        </tbody>
                    </table>
                    <div className={styles.pagination}>
                        {/* ... Pagination ... */}
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

export default ManagerQna;