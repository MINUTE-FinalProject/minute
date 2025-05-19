// ManagerQna.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reportOffIcon from '../../assets/images/able-alarm.png'; // 아이콘: "신고 없음, 관리자 조치 가능"
import reportOnIcon from '../../assets/images/disable-alarm.png'; // 아이콘: "신고됨" 또는 "관리자 조치 완료"
import searchButtonIcon from '../../assets/images/search_icon.png';
import Pagination from '../../components/Pagination/Pagination';
import styles from './ManagerQna.module.css';

// 초기 Q&A 데이터 생성 함수 수정
const generateInitialQnaData = (count = 42) => {
    const data = [];
    const answerStatuses = ['답변완료', '미답변'];
    for (let i = 0; i < count; i++) {
        const userReported = i % 10 === 0; // 사용자에 의한 신고 여부
        // 관리자 조치 상태: 사용자가 신고했고, ID가 짝수인 경우 조치된 것으로 가정 (테스트용)
        const adminActioned = userReported && (i + 1) % 2 === 0;

        data.push({
            qnaId: i + 1,
            NO: count - i,
            ID: `user${1000 + i}`,
            닉네임: `문의자${i + 1}`,
            제목: `문의사항 제목입니다 - 테스트 ${i + 1}`,
            작성일: `2025.05.${String(15 - (i % 15)).padStart(2, '0')}`,
            isReportedBySomeone: userReported, // 사용자 신고 여부 (필드명 변경으로 명확화)
            adminActionedOnReport: adminActioned, // 관리자 조치 여부 필드 추가
            답변상태: answerStatuses[i % answerStatuses.length],
        });
    }
    return data;
};

function ManagerQna() {
    const navigate = useNavigate();
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
        let filteredData = [...allQnaData]; // 원본 배열 복사

        // 날짜 필터 (시작일과 종료일이 모두 설정된 경우)
        if (dateRange.start && dateRange.end) {
            filteredData = filteredData.filter(qna => {
                const qnaDate = new Date(qna.작성일.replace(/\./g, '-')); // "YYYY.MM.DD" -> "YYYY-MM-DD"
                const startDate = new Date(dateRange.start);
                const endDate = new Date(dateRange.end);
                // 날짜 비교 시 시간 부분을 제거하기 위해 setHours(0,0,0,0) 사용 고려 가능
                return qnaDate >= startDate && qnaDate <= endDate;
            });
        }

        // 답변상태 필터
        if (statusFilter !== 'all') {
            filteredData = filteredData.filter(qna => qna.답변상태 === statusFilter);
        }

        // 검색어 필터 (ID, 닉네임, 제목 대상)
        if (searchTerm.trim()) {
            const lowerSearchTerm = searchTerm.toLowerCase().trim();
            filteredData = filteredData.filter(qna =>
                qna.ID.toLowerCase().includes(lowerSearchTerm) ||
                qna.닉네임.toLowerCase().includes(lowerSearchTerm) ||
                qna.제목.toLowerCase().includes(lowerSearchTerm)
            );
        }

        // 정렬 (최신순: NO 내림차순으로 가정, 또는 qnaId 내림차순)
        filteredData.sort((a, b) => b.qnaId - a.qnaId); // qnaId를 사용하는 것이 더 일반적일 수 있습니다. NO는 역순.


        setQnaListToDisplay(filteredData);
        setCurrentPage(1); // 필터 변경 시 첫 페이지로
    }, [dateRange, statusFilter, searchTerm, allQnaData]);


    // 신고 조치 핸들러
    const handleQnaReportAction = (e, qnaId) => {
        e.stopPropagation(); // 이벤트 버블링 방지

        const qnaToUpdate = allQnaData.find(q => q.qnaId === qnaId);

        if (!qnaToUpdate) {
            alert("오류: 해당 문의를 찾을 수 없습니다.");
            return;
        }

        // 이미 관리자가 조치한 경우, 더 이상 조치 불가 (버튼은 이미 비활성화 상태여야 함)
        if (qnaToUpdate.adminActionedOnReport) {
            alert(`문의 ID ${qnaId}는 이미 관리자가 조치한 문의입니다.`);
            return;
        }

        let confirmMessage = `문의 ID ${qnaId}`;
        if (qnaToUpdate.isReportedBySomeone) {
            confirmMessage += ` (사용자 신고됨)`;
        } else {
            confirmMessage += ` (사용자 신고 없음)`;
        }
        confirmMessage += `에 대해 "관리자 조치함"으로 상태를 변경하시겠습니까? 이 작업은 되돌릴 수 없습니다.`;

        if (window.confirm(confirmMessage)) {
            setAllQnaData(prevQnaData =>
                prevQnaData.map(qna =>
                    qna.qnaId === qnaId
                    ? { ...qna, adminActionedOnReport: true, isReportedBySomeone: true } // 관리자 조치 시 isReportedBySomeone도 true로 설정
                    : qna
                )
            );
            alert(`문의 ID ${qnaId}에 대해 조치했습니다. (실제 DB 업데이트 필요)`);
        }
    };

    const totalPages = Math.ceil(qnaListToDisplay.length / itemsPerPage);
    const indexOfLastQna = currentPage * itemsPerPage;
    const indexOfFirstQna = indexOfLastQna - itemsPerPage;
    const currentDisplayedQnaItems = qnaListToDisplay.slice(indexOfFirstQna, indexOfLastQna);
    const handlePageChange = (pageNumber) => { setCurrentPage(pageNumber); };

    const handleRowClick = (qnaId) => {
        navigate(`/admin/managerQnaDetail/${qnaId}`);
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
                        <button type="button" className={styles.filterSearchButton} onClick={() => { /* 검색 버튼 자체 클릭 액션은 현재 없음, useEffect로 처리 */ }}>
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
                                            {qna.제목}
                                        </td>
                                        <td>{qna.작성일}</td>
                                        <td>
                                            {/* === 신고 버튼 === */}
                                            <button
                                                onClick={(e) => handleQnaReportAction(e, qna.qnaId)}
                                                className={`${styles.iconButton} ${qna.adminActionedOnReport ? styles.reportActioned : ''}`}
                                                title={
                                                    qna.adminActionedOnReport
                                                      ? `관리자가 조치 완료한 문의입니다.` // 관리자 조치 완료 시
                                                      : (qna.isReportedBySomeone
                                                          ? `사용자 신고 접수됨 (클릭하여 조치)` // 사용자 신고 있고, 관리자 조치 전
                                                          : "신고된 내역 없음 (관리자가 직접 조치 가능)") // 사용자 신고 없고, 관리자 조치 전
                                                }
                                                disabled={qna.adminActionedOnReport} // 관리자가 조치했으면 비활성화
                                            >
                                                <img
                                                    src={(qna.isReportedBySomeone || qna.adminActionedOnReport) ? reportOnIcon : reportOffIcon}
                                                    alt="신고 조치 상태"
                                                    className={styles.buttonIcon}
                                                />
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className={`${styles.statusButton} ${qna.답변상태 === '답변완료' ? styles.answeredStatus : styles.unansweredStatus}`}
                                                disabled // 상태 표기용 버튼, 클릭 기능 없음
                                                onClick={(e) => e.stopPropagation()} // 행 클릭 방지
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