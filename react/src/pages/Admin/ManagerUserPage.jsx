import { useEffect, useState } from 'react'; // useState, useEffect 임포트
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./ManagerUserPage.module.css";

// Pagination 컴포넌트 임포트
import Pagination from '../../components/Pagination/Pagination';

// 목업 데이터 생성 함수
const generateInitialReportData = (count = 33) => { // 33개의 목업 데이터 생성
    const items = [];
    const userIds = ["yujin0712", "hodu1030", "adminTest", "userNew", "reporterX"];
    const types = ["게시판", "댓글", "문의사항", "프로필"];
    const statuses = ["처리", "완료"];
    for (let i = 0; i < count; i++) {
        items.push({
            // no는 페이지네이션 후 현재 페이지 내의 순번으로 다시 계산하거나, 고유 ID를 사용합니다.
            // 여기서는 고유 ID 역할을 할 수 있는 reportId를 추가하고, no는 표시용으로 남겨둡니다.
            reportId: `report-${i + 1}`, // 고유 ID
            no: count - i, // 최신이 위로 오도록 (역순 번호)
            count: Math.floor(Math.random() * 10) + 1,
            id: userIds[i % userIds.length],
            type: types[i % types.length],
            title: `신고 관련 제목 ${i + 1} (위치: ${types[i % types.length]})`,
            content: `신고된 내용의 요약 또는 상세 ${i + 1}`,
            date: `2025.05.${String(18 - (i % 18)).padStart(2, '0')}`,
            status: statuses[i % statuses.length],
        });
    }
    return items;
};


const ManagerUserPage = () => {
    const [allReportItems, setAllReportItems] = useState([]); // 원본 또는 필터링될 전체 데이터
    const [reportsToDisplay, setReportsToDisplay] = useState([]); // 현재 테이블에 표시될 전체 목록 (페이지네이션 전)

    // --- 페이지네이션 상태 ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // 페이지 당 보여줄 항목 수

    useEffect(() => {
        const loadedReports = generateInitialReportData();
        setAllReportItems(loadedReports);
        // TODO: 실제 필터링/검색 로직 적용하여 setReportsToDisplay 호출
        setReportsToDisplay(loadedReports);
        setCurrentPage(1); // 데이터/필터 변경 시 1페이지로
    }, []); // 초기 로드 시

    // --- 페이지네이션 로직 ---
    const totalPages = Math.ceil(reportsToDisplay.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDisplayedItems = reportsToDisplay.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 처리 상태 변경 핸들러 (예시)
    const handleStatusChange = (reportId) => {
        // 실제로는 API 호출 후 상태를 변경해야 합니다.
        // 여기서는 로컬 상태만 변경하는 예시입니다.
        const updateLogic = (prevItems) => prevItems.map(item => {
            if (item.reportId === reportId) {
                return { ...item, status: item.status === "처리" ? "완료" : "처리" };
            }
            return item;
        });
        setAllReportItems(updateLogic);
        setReportsToDisplay(updateLogic);
        console.log(`Status changed for report ID: ${reportId}`);
    };


    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.main}>
                <Sidebar />
                <section className={styles.content}>
                    <h1>신고 관리</h1>
                    {/* 특정 사용자 ID가 URL 파라미터 등으로 넘어온다면 해당 사용자 필터링 가능 */}
                    <h2>신고 내역 상세 { /* - yujin0712 */ }</h2> 
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>누적횟수</th>
                                <th>사용자 ID</th>
                                <th>위치</th>
                                <th>제목</th>
                                <th>신고내용</th>
                                <th>작성일</th>
                                <th>처리/완료</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDisplayedItems.length > 0 ? (
                                currentDisplayedItems.map((row) => (
                                    <tr key={row.reportId}> {/* 고유 ID로 key 변경 */}
                                        <td>{row.no}</td>
                                        <td>{row.count}</td>
                                        <td>{row.id}</td>
                                        <td>{row.type}</td>
                                        <td>{row.title}</td>
                                        <td>{row.content}</td>
                                        <td>{row.date}</td>
                                        <td>
                                            <button 
                                                className={`${styles.status} ${row.status === "처리" ? styles.pending : styles.done}`}
                                                onClick={() => handleStatusChange(row.reportId)} // 상태 변경 기능 추가
                                                title={`클릭하여 상태 변경: ${row.status === "처리" ? "완료로" : "처리로"}`}
                                            >
                                                {row.status}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8">표시할 신고 내역이 없습니다.</td>
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
                </section>
            </div>
        </div>
    );
};

export default ManagerUserPage;