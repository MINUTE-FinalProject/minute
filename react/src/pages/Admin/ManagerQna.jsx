import { useEffect, useState } from 'react'; // useEffect 추가
import { Link } from 'react-router-dom';
import reportOffIcon from '../../assets/images/able-alarm.png';
import reportOnIcon from '../../assets/images/disable-alarm.png';
import searchButtonIcon from '../../assets/images/search_icon.png';
import styles from './ManagerQna.module.css';

// Pagination 컴포넌트 임포트
import Pagination from '../../components/Pagination/Pagination';

// 예시 데이터 생성 함수 (더 많은 데이터로 페이지네이션 테스트 용이하게)
const generateInitialQnaData = (count = 42) => { // 42개의 목업 데이터 생성
    const data = [];
    const statuses = ['답변완료', '미답변'];
    for (let i = 0; i < count; i++) {
        const isReported = i % 10 === 0;
        data.push({
            qnaId: i + 1,
            displayNo: count - i, // 최신글이 위로 오도록 (번호는 역순)
            authorId: `user${1000 + i}`,
            authorNickname: `문의자${i + 1}`,
            title: `문의사항 제목입니다 - 테스트 ${i + 1}`,
            status: statuses[i % statuses.length],
            date: `2025.05.${String(15 - (i % 15)).padStart(2, '0')}`,
            isReported: isReported, // 초기 isReported 값은 데이터에 포함
        });
    }
    return data;
};


function ManagerQna() {
    const [allQnaData, setAllQnaData] = useState([]); // 원본 또는 필터링될 전체 데이터
    const [qnaListToDisplay, setQnaListToDisplay] = useState([]); // 현재 테이블에 표시될 전체 목록 (페이지네이션 전)
    
    // reportedQnaIds는 qnaListToDisplay가 변경될 때 동기화되거나,
    // 또는 allQnaData의 isReported 플래그를 직접 변경하는 방식으로 관리될 수 있습니다.
    // 여기서는 qnaListToDisplay의 isReported 플래그를 직접 토글하는 방식으로 변경합니다.
    // const [reportedQnaIds, setReportedQnaIds] = useState([]); // 이 방식 대신 각 qna 객체에 isReported 직접 사용

    // --- 페이지네이션 상태 ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // 페이지 당 문의 수

    useEffect(() => {
        const loadedQnaData = generateInitialQnaData();
        setAllQnaData(loadedQnaData);
        // TODO: 실제 필터링/검색 로직 적용하여 setQnaListToDisplay 호출
        setQnaListToDisplay(loadedQnaData); 
        setCurrentPage(1); // 데이터/필터 변경 시 1페이지로
    }, []); // 초기 로드 시 한 번만 실행 (실제로는 필터 조건 변경 시에도 실행될 수 있음)

    const handleQnaReportToggle = (qnaId) => {
        const Sorter = (arr) => arr.map(qna =>
            qna.qnaId === qnaId ? { ...qna, isReported: !qna.isReported } : qna
        );

        setAllQnaData(Sorter);
        setQnaListToDisplay(Sorter);

        const targetQna = allQnaData.find(qna => qna.qnaId === qnaId);
        if (targetQna) {
            if (!targetQna.isReported) { // isReported가 false가 될 예정 (즉, 원래 true였음)
                 if (window.confirm(`ID ${qnaId} 문의에 대한 신고 상태를 해제하시겠습니까?`)) {
                    console.log(`Q&A ID ${qnaId} 신고 해제 처리`);
                    // API 호출 등
                } else { // 사용자가 취소하면 상태 변경 되돌리기 (선택적)
                    const Reverter = (arr) => arr.map(qna =>
                        qna.qnaId === qnaId ? { ...qna, isReported: true } : qna
                    );
                    setAllQnaData(Reverter);
                    setQnaListToDisplay(Reverter);
                    return;
                }
            } else { // isReported가 true가 될 예정 (즉, 원래 false였음)
                if (window.confirm(`ID ${qnaId} 문의를 신고된 것으로 처리하시겠습니까?`)) {
                    console.log(`Q&A ID ${qnaId} 신고 처리`);
                    // API 호출 등
                } else { // 사용자가 취소하면 상태 변경 되돌리기 (선택적)
                     const Reverter = (arr) => arr.map(qna =>
                        qna.qnaId === qnaId ? { ...qna, isReported: false } : qna
                    );
                    setAllQnaData(Reverter);
                    setQnaListToDisplay(Reverter);
                    return;
                }
            }
        }
    };

    // --- 페이지네이션 로직 ---
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
                        <input type="date" className={styles.filterElement} />
                        <span className={styles.dateSeparator}>~</span>
                        <input type="date" className={styles.filterElement} />
                        <select className={styles.filterElement}>
                            <option value="all">상태 (전체)</option>
                            <option value="answered">답변완료</option>
                            <option value="unanswered">미답변</option>
                        </select>
                        <input type="text" placeholder="검색어를 입력하세요" className={`${styles.filterElement} ${styles.filterSearchInput}`} />
                        <button type="button" className={styles.filterSearchButton}>
                            <img src={searchButtonIcon} alt="검색" className={styles.searchIcon} />
                        </button>
                    </div>

                    <table className={styles.qnaTable}>
                        <thead>
                            <tr>
                                <th>NO</th>
                                <th>ID</th>
                                <th>작성자닉네임</th>
                                <th className={styles.titleColumn}>제목</th>
                                <th>상태</th>
                                <th>작성일</th>
                                <th>신고</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDisplayedQnaItems.length > 0 ? (
                                currentDisplayedQnaItems.map((qna, index) => ( // index는 displayNo 계산 시 사용 가능
                                    <tr key={qna.qnaId}>
                                        {/* displayNo는 전체 목록 기준이므로, 페이지네이션 시 계산 필요
                                            예: (qnaListToDisplay.length - (indexOfFirstQna + index)) 
                                            또는 qna 객체에 서버에서 받은 displayNo 사용 */}
                                        <td>{qna.displayNo}</td> 
                                        <td>{qna.authorId}</td>
                                        <td>{qna.authorNickname}</td>
                                        <td className={styles.tableTitle}>
                                            <Link to={`/admin/qna/${qna.qnaId}`} className={styles.titleLink}>
                                                {qna.title}
                                            </Link>
                                        </td>
                                        <td>
                                            <span className={`${styles.statusTag} ${qna.status === '답변완료' ? styles.answered : styles.unanswered}`}>
                                                {qna.status}
                                            </span>
                                        </td>
                                        <td>{qna.date}</td>
                                        <td>
                                            <button
                                                onClick={() => handleQnaReportToggle(qna.qnaId)}
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
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">표시할 문의사항이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* 페이지네이션 컴포넌트 적용 */}
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