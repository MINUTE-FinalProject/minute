import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import reportOffIcon from '../../assets/images/able-alarm.png'; // 실제 경로에 맞게 수정해주세요.
import reportOnIcon from '../../assets/images/disable-alarm.png'; // 실제 경로에 맞게 수정해주세요.
import searchButtonIcon from '../../assets/images/search_icon.png'; // 실제 경로에 맞게 수정해주세요.
import Pagination from '../../components/Pagination/Pagination'; // 실제 경로에 맞게 수정해주세요.
import styles from './ManagerQna.module.css';

// 예시 데이터 생성 함수
const generateInitialQnaData = (count = 42) => {
    const data = [];
    const answerStatuses = ['답변완료', '미답변'];
    for (let i = 0; i < count; i++) {
        const isReported = i % 10 === 0;
        data.push({
            qnaId: i + 1,
            NO: count - i,
            ID: `user${1000 + i}`,
            닉네임: `문의자${i + 1}`,
            제목: `문의사항 제목입니다 - 테스트 ${i + 1}`,
            작성일: `2025.05.${String(15 - (i % 15)).padStart(2, '0')}`,
            isReported: isReported,
            답변상태: answerStatuses[i % answerStatuses.length],
        });
    }
    return data;
};

function ManagerQna() {
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
        if (dateRange.start && dateRange.end) {
            filteredData = filteredData.filter(qna => {
                const qnaDate = new Date(qna.작성일.replace(/\./g, '-'));
                const startDate = new Date(dateRange.start);
                const endDate = new Date(dateRange.end);
                return qnaDate >= startDate && qnaDate <= endDate;
            });
        }
        if (statusFilter !== 'all') {
            filteredData = filteredData.filter(qna => qna.답변상태 === statusFilter);
        }
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filteredData = filteredData.filter(qna =>
                qna.ID.toLowerCase().includes(lowerSearchTerm) ||
                qna.닉네임.toLowerCase().includes(lowerSearchTerm) ||
                qna.제목.toLowerCase().includes(lowerSearchTerm)
            );
        }
        setQnaListToDisplay(filteredData);
        setCurrentPage(1);
    }, [dateRange, statusFilter, searchTerm, allQnaData]);

    const handleQnaReportToggle = (e, qnaId) => {
        e.stopPropagation();
        const targetQna = allQnaData.find(qna => qna.qnaId === qnaId);
        if (!targetQna) return;

        const actionMessage = targetQna.isReported
            ? `ID ${targetQna.ID} (No.${targetQna.NO}) 문의에 대한 신고 상태를 해제하시겠습니까?`
            : `ID ${targetQna.ID} (No.${targetQna.NO}) 문의를 신고된 것으로 처리하시겠습니까?`;

        if (window.confirm(actionMessage)) {
            const updatedIsReported = !targetQna.isReported;
            const message = updatedIsReported ? `Q&A ID ${qnaId} 신고 처리됨` : `Q&A ID ${qnaId} 신고 해제됨`;
            console.log(message);

            const updateData = (prevData) =>
                prevData.map(qna =>
                    qna.qnaId === qnaId ? { ...qna, isReported: updatedIsReported } : qna
                );
            setAllQnaData(updateData);
        }
    };

    const totalPages = Math.ceil(qnaListToDisplay.length / itemsPerPage);
    const indexOfLastQna = currentPage * itemsPerPage;
    const indexOfFirstQna = indexOfLastQna - itemsPerPage;
    const currentDisplayedQnaItems = qnaListToDisplay.slice(indexOfFirstQna, indexOfLastQna);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className={styles.container}>
                <main className={styles.qnaContent}>
                    <h1 className={styles.pageTitle}>문의 관리</h1>
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
                                <th>NO</th>
                                <th>ID</th>
                                <th>닉네임</th>
                                <th className={styles.titleHeaderColumn}>제목</th>
                                <th>작성일</th>
                                <th>신고</th>
                                <th>답변상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDisplayedQnaItems.length > 0 ? (
                                currentDisplayedQnaItems.map((qna) => (
                                    <tr key={qna.qnaId} onClick={() => { /* 상세 페이지 이동 로직 */ }} className={styles.clickableRow}>
                                        <td>{qna.NO}</td>
                                        <td>{qna.ID}</td>
                                        <td>{qna.닉네임}</td>
                                        <td className={styles.titleDataColumn}>
                                            <Link to={`/admin/qna-detail/${qna.qnaId}`} className={styles.titleLink} onClick={(e) => e.stopPropagation()}>
                                                {qna.제목}
                                            </Link>
                                        </td>
                                        <td>{qna.작성일}</td>
                                        <td>
                                            <button
                                                onClick={(e) => handleQnaReportToggle(e, qna.qnaId)}
                                                className={`${styles.iconButton} ${qna.isReported ? styles.reportedButton : ''}`}
                                                title={qna.isReported ? "신고 처리됨 (클릭 시 해제 가능)" : "신고 처리하기"}
                                            >
                                                <img
                                                    src={qna.isReported ? reportOnIcon : reportOffIcon}
                                                    alt={qna.isReported ? "신고 처리됨" : "신고 처리하기"}
                                                    className={styles.buttonIcon}
                                                />
                                            </button>
                                        </td>
                                        <td>
                                            {/* 답변상태 디자인 변경: button 태그와 새로운 CSS 클래스 적용 */}
                                            <button
                                                className={`${styles.statusButton} ${qna.답변상태 === '답변완료' ? styles.answeredStatus : styles.unansweredStatus}`}
                                                disabled /* 클릭 기능이 없으므로 disabled 처리 */
                                            >
                                                {qna.답변상태}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">표시할 문의사항이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

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

export default ManagerQna;