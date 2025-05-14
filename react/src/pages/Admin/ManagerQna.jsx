import { useState } from 'react';
import { Link } from 'react-router-dom';
import reportOffIcon from '../../assets/images/able-alarm.png'; // 신고 아이콘 (기본)
import reportOnIcon from '../../assets/images/disable-alarm.png'; // 신고 아이콘 (처리됨/신고됨)
import searchButtonIcon from '../../assets/images/search_icon.png'; // 검색 아이콘 경로 확인
import Header from '../../components/Header/Header'; // 경로 확인
import Sidebar from '../../components/Sidebar/Sidebar'; // 경로 확인
import styles from './ManagerQna.module.css';

// 예시 데이터 (실제로는 API를 통해 받아옵니다)
const initialQnaData = [
    { qnaId: 1, displayNo: 5, authorId: 'yujin0712', authorNickname: '최유진', title: '비밀번호 변경 문의입니다.', status: '답변완료', date: '2025-05-10', isReported: false },
    { qnaId: 2, displayNo: 4, authorId: 'hodu1030', authorNickname: '김호두', title: '결제 오류가 발생했습니다.', status: '미답변', date: '2025-05-09', isReported: true },
    { qnaId: 3, displayNo: 3, authorId: 'master99', authorNickname: '이관리', title: '서비스 이용 시간 관련 문의', status: '답변완료', date: '2025-05-09', isReported: false },
    { qnaId: 4, displayNo: 2, authorId: 'user_error', authorNickname: '박오류', title: '앱 실행 시 오류 메시지가 떠요.', status: '미답변', date: '2025-05-08', isReported: false },
    { qnaId: 5, displayNo: 1, authorId: 'partner01', authorNickname: '강제휴', title: '제휴 문의 드립니다.', status: '답변완료', date: '2025-05-07', isReported: true },
];

function ManagerQna() {
    const [qnaList, setQnaList] = useState(initialQnaData);
    const [reportedQnaIds, setReportedQnaIds] = useState(
        initialQnaData.filter(qna => qna.isReported).map(qna => qna.qnaId)
    ); // 초기 신고 상태 반영

    // TODO: 실제 필터링, 정렬, 페이지네이션 상태 및 핸들러 추가

    const handleQnaReportToggle = (qnaId) => {
        // 관리자 페이지에서는 신고 상태를 변경하는 로직 (예: 신고 승인/반려, 또는 단순 토글)
        // 여기서는 임시로 토글하고, reportedQnaIds 상태를 업데이트합니다.
        const isCurrentlyReported = reportedQnaIds.includes(qnaId);
        if (isCurrentlyReported) {
            // 신고 해제 (또는 다른 처리)
            if (window.confirm(`ID ${qnaId} 문의에 대한 신고 상태를 해제하시겠습니까?`)) {
                setReportedQnaIds(prevIds => prevIds.filter(id => id !== qnaId));
                // 실제 API 호출로 서버 데이터 업데이트
                console.log(`Q&A ID ${qnaId} 신고 해제 처리`);
            }
        } else {
            // 신고 처리 (또는 다른 처리)
            if (window.confirm(`ID ${qnaId} 문의를 신고된 것으로 처리하시겠습니까?`)) {
                setReportedQnaIds(prevIds => [...prevIds, qnaId]);
                // 실제 API 호출로 서버 데이터 업데이트
                console.log(`Q&A ID ${qnaId} 신고 처리`);
            }
        }
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                <Sidebar />
                <main className={styles.qnaContent}>
                    <h1 className={styles.pageTitle}>문의 관리</h1>

                    {/* --- 필터 바 수정 시작 --- */}
                    <div className={styles.filterBar}>
                        <input type="date" className={styles.filterElement} />
                        <span className={styles.dateSeparator}>~</span>
                        <input type="date" className={styles.filterElement} />
                        <select className={styles.filterElement}>
                            <option value="all">상태 (전체)</option>
                            <option value="answered">답변완료</option>
                            <option value="unanswered">미답변</option>
                        </select>
                        {/* "유형 (전체)" select 드롭다운이 여기서 삭제되었습니다. */}
                        <input type="text" placeholder="검색어를 입력하세요" className={`${styles.filterElement} ${styles.filterSearchInput}`} />
                        <button type="button" className={styles.filterSearchButton}>
                            <img src={searchButtonIcon} alt="검색" className={styles.searchIcon} />
                        </button>
                    </div>
                    {/* --- 필터 바 수정 끝 --- */}

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
                            {qnaList.map(qna => {
                                const isReported = reportedQnaIds.includes(qna.qnaId);
                                return (
                                    <tr key={qna.qnaId}>
                                        <td>{qna.displayNo}</td>
                                        <td>{qna.authorId}</td>
                                        <td>{qna.authorNickname}</td>
                                        <td className={styles.tableTitle}>
                                            <Link to={`/admin/qna/${qna.qnaId}`} className={styles.titleLink}> {/* 관리자용 상세 경로 예시 */}
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
                                                className={`${styles.iconButton} ${isReported ? styles.reportedButton : ''}`}
                                                title={isReported ? "신고 처리됨 (클릭 시 해제 가능)" : "신고 처리하기"}
                                            >
                                                <img
                                                    src={isReported ? reportOnIcon : reportOffIcon}
                                                    alt={isReported ? "신고 처리됨" : "신고 처리하기"}
                                                    className={styles.buttonIcon}
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className={styles.pagination}>
                        <button>&lt;</button>
                        <button className={styles.active}>1</button>
                        <button>2</button>
                        <button>3</button>
                        <button>&gt;</button>
                    </div>
                </main>
            </div>
        </>
    );
}

export default ManagerQna;