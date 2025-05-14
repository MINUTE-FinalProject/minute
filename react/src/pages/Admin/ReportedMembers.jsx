import { useEffect, useState } from 'react';
import Header from "../../components/Header/Header";
import Pagination from '../../components/Pagination/Pagination';
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./ReportedMembers.module.css";

// 목업 데이터 생성 함수 (상태: 정지, 대기만 사용)
const generateInitialReportedMembers = (count = 37) => {
    const items = [];
    const userIds = ["yujin0712", "hodu1030", "mad09", "cjak3974", "qowui08", "akn45", "dgvv123", "newUser1", "vipUser"];
    const positions = ["게시판", "댓글", "프로필", "채팅"];
    const statuses = ["정지", "대기"]; // "경고" 상태 제거
    for (let i = 0; i < count; i++) {
        items.push({
            reportEntryId: `rep-${i + 1}`,
            no: count - i,
            count: Math.floor(Math.random() * 10) + 1,
            id: userIds[i % userIds.length],
            position: positions[i % positions.length],
            title: `관련 컨텐츠 제목 또는 요약 ${i + 1}`,
            content: `신고 내용 상세 또는 사유 ${i + 1}`,
            date: `2025.05.${String(20 - (i % 20)).padStart(2, '0')}`,
            status: statuses[i % statuses.length], // 정지 또는 대기
        });
    }
    return items;
};

const ReportedMembers = () => {
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
                // "정지" 상태면 "대기"로, "대기" 상태면 "정지"로 토글
                return { ...member, status: member.status === "정지" ? "대기" : "정지" };
            }
            return member;
        });

        setAllReportedMembers(updateLogic);
        setMembersToDisplay(updateLogic); // 보여지는 목록도 바로 업데이트
        
        const changedMember = allReportedMembers.find(m => m.reportEntryId === reportEntryId);
        if (changedMember) {
             console.log(`Status changed for report entry ID: ${reportEntryId} to ${changedMember.status === "정지" ? "대기" : "정지"}`);
            // TODO: 실제 API 호출로 서버에 상태 업데이트
        }
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                <Sidebar />
                <main className={styles.reportedContent}>
                    <h2 className={styles.title1}>신고 회원 관리</h2>
                    <div className={styles.filterBar}>
                        <input type="date" className={styles.filterElement} />
                        <input type="date" className={styles.filterElement} />
                        <select className={styles.filterElement}><option>정렬순▼</option></select>
                        <button className={`${styles.filterElement} ${styles.typeBtn}`}>타입</button>
                        <input type="text" placeholder="검색" className={`${styles.filterElement} ${styles.filterSearchInput}`} />
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
                                    <tr key={m.reportEntryId}> 
                                        <td>{m.no}</td><td>{m.count}</td><td>{m.id}</td><td>{m.position}</td>
                                        <td>{m.title}</td><td>{m.content}</td><td>{m.date}</td>
                                        <td>
                                            <button 
                                                className={`${styles.status} ${
                                                    m.status === "정지" ? styles.stop : styles.wait // "경고" 상태 로직 제거
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