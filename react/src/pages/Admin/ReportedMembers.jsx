import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import searchButtonIcon from '../../assets/images/search_icon.png';
import Pagination from '../../components/Pagination/Pagination';
import styles from "./ReportedMembers.module.css";



// 목업 데이터 생성 함수 (상태: 정지, 대기만 사용)
const generateInitialReportedMembers = (count = 37) => {
    

    const items = [];
    const userIds = ["yujin0712", "hodu1030", "mad09", "cjak3974", "qowui08", "akn45", "dgvv123", "newUser1", "vipUser"];
    // "위치"는 "게시판", "댓글", "문의사항"만 사용하도록 수정
    const positions = ["게시판", "댓글", "문의사항"]; 
    const statuses = ["정지", "대기"]; 
    for (let i = 0; i < count; i++) {
        items.push({
            reportEntryId: `rep-${i + 1}`,
            no: count - i,
            count: Math.floor(Math.random() * 10) + 1,
            id: userIds[i % userIds.length],
            position: positions[i % positions.length], // 수정된 positions 배열 사용
            title: `관련 컨텐츠 제목 또는 요약 ${i + 1}`,
            content: `신고 내용 상세 또는 사유 ${i + 1}`,
            date: `2025.05.${String(20 - (i % 20)).padStart(2, '0')}`,
            status: statuses[i % statuses.length], 
        });
    }
    return items;
};

const ReportedMembers = () => {
    const navigate = useNavigate();
    const [allReportedMembers, setAllReportedMembers] = useState([]);
    const [membersToDisplay, setMembersToDisplay] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const loadedMembers = generateInitialReportedMembers();
        setAllReportedMembers(loadedMembers);
        setMembersToDisplay(loadedMembers); 
        setCurrentPage(1);
    }, []);

    const totalPages = Math.ceil(membersToDisplay.length / itemsPerPage);
    const indexOfLastMember = currentPage * itemsPerPage;
    const indexOfFirstMember = indexOfLastMember - itemsPerPage;
    const currentDisplayedMembers = membersToDisplay.slice(indexOfFirstMember, indexOfLastMember);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleStatusChange = (reportEntryId) => {
        const updateLogic = (prevMembers) => prevMembers.map(member => {
            if (member.reportEntryId === reportEntryId) {
                return { ...member, status: member.status === "정지" ? "대기" : "정지" };
            }
            return member;
        });

        setAllReportedMembers(updateLogic);
        setMembersToDisplay(updateLogic); 
        
        const changedMember = allReportedMembers.find(m => m.reportEntryId === reportEntryId); // 이 시점에서는 allReportedMembers가 아직 이전 상태일 수 있습니다.
                                                                                             // 정확한 변경 후 상태를 보려면 업데이트된 상태를 기준으로 찾아야 합니다.
                                                                                             // 또는 단순히 토글된 상태를 직접 사용합니다.
        if (changedMember) { // changedMember가 존재하고, 그 상태가 토글될 것이므로
             const newStatus = changedMember.status === "정지" ? "대기" : "정지";
             console.log(`Status changed for report entry ID: ${reportEntryId} to ${newStatus}`);
            // TODO: 실제 API 호출로 서버에 상태 업데이트
        }
    };

    return (
        <>

            <div className={styles.container}>

                <main className={styles.reportedContent}>
                    <h2 className={styles.title1}>신고 회원 관리</h2>
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
                    <table>
                        <thead>
                            <tr>
                                <th>No</th><th>누적횟수</th><th>ID</th><th>위치</th><th>제목</th><th>신고내용</th><th>신고일</th><th>회원상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDisplayedMembers.length > 0 ? (
                                currentDisplayedMembers.map((m) => (
                                    <tr key={m.reportEntryId}
                                    onClick={() => navigate(`/admin/reportedmember-detail/${m.id}`)}> 
                                        <td>{m.no}</td><td>{m.count}</td><td>{m.id}</td><td>{m.position}</td>
                                        <td>{m.title}</td><td>{m.content}</td><td>{m.date}</td>
                                        <td>
                                            <button 
                                                className={`${styles.status} ${
                                                    m.status === "정지" ? styles.stop : styles.wait
                                                }`}
                                                onClick={() => handleStatusChange(m.reportEntryId)}
                                                title={`클릭하여 상태 변경: ${m.status}`}
                                            >
                                                {m.status}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8">표시할 신고 회원이 없습니다.</td>
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
};

export default ReportedMembers;