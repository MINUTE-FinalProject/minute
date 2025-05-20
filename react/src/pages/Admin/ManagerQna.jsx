// src/pages/Admin/Qna/ManagerQna.jsx (또는 해당 파일의 실제 경로)
import { useEffect, useState } from 'react'; // React import 추가
import { useNavigate } from 'react-router-dom';
import reportOffIcon from '../../assets/images/able-alarm.png';
import reportOnIcon from '../../assets/images/disable-alarm.png';
import searchButtonIcon from '../../assets/images/search_icon.png';
import styles from '../../assets/styles/ManagerQna.module.css';
import Modal from '../../components/Modal/Modal'; // Modal 컴포넌트 import
import Pagination from '../../components/Pagination/Pagination';

const generateInitialQnaData = (count = 42) => {
    // ... (기존 generateInitialQnaData 함수 내용 유지)
    const data = [];
    const answerStatuses = ['답변완료', '미답변'];
    for (let i = 0; i < count; i++) {
        const userReported = i % 10 === 0;
        const adminActioned = userReported && (i + 1) % 2 === 0;
        data.push({
            qnaId: i + 1,
            NO: count - i,
            ID: `user${1000 + i}`,
            닉네임: `문의자${i + 1}`,
            제목: `문의사항 제목입니다 - 테스트 ${i + 1}`,
            작성일: `2025.05.${String(15 - (i % 15)).padStart(2, '0')}`,
            isReportedBySomeone: userReported,
            adminActionedOnReport: adminActioned,
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
        const loadedQnaData = generateInitialQnaData();
        setAllQnaData(loadedQnaData);
    }, []);

    useEffect(() => {
        let filteredData = [...allQnaData];
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
        if (searchTerm.trim()) {
            const lowerSearchTerm = searchTerm.toLowerCase().trim();
            filteredData = filteredData.filter(qna =>
                qna.ID.toLowerCase().includes(lowerSearchTerm) ||
                qna.닉네임.toLowerCase().includes(lowerSearchTerm) ||
                qna.제목.toLowerCase().includes(lowerSearchTerm)
            );
        }
        filteredData.sort((a, b) => b.qnaId - a.qnaId);
        setQnaListToDisplay(filteredData);
        setCurrentPage(1);
    }, [dateRange, statusFilter, searchTerm, allQnaData]);

    // --- 문의 신고 조치 핸들러 (Modal 적용) ---
    const processQnaReportAction = (qnaIdToUpdate) => {
        setAllQnaData(prevQnaData =>
            prevQnaData.map(qna =>
                qna.qnaId === qnaIdToUpdate
                ? { ...qna, adminActionedOnReport: true, isReportedBySomeone: true }
                : qna
            )
        );
        // TODO: API로 실제 DB 업데이트
        setModalProps({
            title: '조치 완료',
            message: `문의 ID ${qnaIdToUpdate}에 대해 성공적으로 조치했습니다.`,
            confirmText: '확인',
            type: 'adminSuccess', // 핑크 버튼 원하시면 'success'
            confirmButtonType: 'primary'
        });
        setIsModalOpen(true);
    };

    const handleQnaReportAction = (e, qnaId) => {
        e.stopPropagation(); 

        const qnaToUpdate = allQnaData.find(q => q.qnaId === qnaId);

        if (!qnaToUpdate) {
            setModalProps({
                title: '오류',
                message: '해당 문의를 찾을 수 없습니다.',
                confirmText: '확인',
                type: 'adminError',
                confirmButtonType: 'primary'
            });
            setIsModalOpen(true);
            return;
        }

        if (qnaToUpdate.adminActionedOnReport) {
            setModalProps({
                title: '알림',
                message: `문의 ID ${qnaId}는 이미 관리자가 조치한 문의입니다. 추가 조치가 불가능합니다.`,
                confirmText: '확인',
                type: 'adminWarning',
                confirmButtonType: 'primary'
            });
            setIsModalOpen(true);
            return;
        }

        let confirmMessage = `문의 ID ${qnaId}`;
        if (qnaToUpdate.isReportedBySomeone) {
            confirmMessage += ` (사용자 신고됨)`;
        } else {
            confirmMessage += ` (사용자 신고 없음)`;
        }
        confirmMessage += `에 대해 "관리자 조치함"으로 상태를 변경하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`;

        setModalProps({
            title: '신고 조치 확인',
            message: confirmMessage,
            onConfirm: () => processQnaReportAction(qnaId),
            confirmText: '조치 실행',
            cancelText: '취소',
            type: 'adminConfirm', // 또는 'adminWarning'
            confirmButtonType: 'danger'
        });
        setIsModalOpen(true);
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
                                            {qna.제목}
                                        </td>
                                        <td>{qna.작성일}</td>
                                        <td>
                                            <button
                                                onClick={(e) => handleQnaReportAction(e, qna.qnaId)}
                                                className={`${styles.iconButton} ${qna.adminActionedOnReport ? styles.reportActioned : ''}`} // 'reportActioned' 클래스명 확인 및 필요시 CSS 추가
                                                title={
                                                    qna.adminActionedOnReport
                                                    ? `관리자가 조치 완료한 문의입니다.`
                                                    : (qna.isReportedBySomeone
                                                        ? `사용자 신고 접수됨 (클릭하여 조치)`
                                                        : "신고된 내역 없음 (관리자가 직접 조치 가능)")
                                                }
                                                disabled={qna.adminActionedOnReport}
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
                                                disabled 
                                                onClick={(e) => e.stopPropagation()}
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
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                {...modalProps}
            />
        </>
    );
}

export default ManagerQna;