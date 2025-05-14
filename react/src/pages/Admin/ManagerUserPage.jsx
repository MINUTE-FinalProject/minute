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
    // "위치"는 "게시판", "댓글", "문의사항"만 사용하도록 수정
    const types = ["게시판", "댓글", "문의사항"]; 
    const statuses = ["처리", "완료"];
    for (let i = 0; i < count; i++) {
        items.push({
            reportId: `report-${i + 1}`, 
            no: count - i, 
            count: Math.floor(Math.random() * 10) + 1,
            id: userIds[i % userIds.length],
            type: types[i % types.length], // 수정된 types 배열 사용
            title: `신고 관련 제목 ${i + 1} (위치: ${types[i % types.length]})`,
            content: `신고된 내용의 요약 또는 상세 ${i + 1}`,
            date: `2025.05.${String(18 - (i % 18)).padStart(2, '0')}`,
            status: statuses[i % statuses.length],
        });
    }
    return items;
};


const ManagerUserPage = () => {
    const [allReportItems, setAllReportItems] = useState([]); 
    const [reportsToDisplay, setReportsToDisplay] = useState([]); 

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 

    useEffect(() => {
        const loadedReports = generateInitialReportData();
        setAllReportItems(loadedReports);
        setReportsToDisplay(loadedReports);
        setCurrentPage(1); 
    }, []); 

    const totalPages = Math.ceil(reportsToDisplay.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDisplayedItems = reportsToDisplay.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleStatusChange = (reportId) => {
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
                                    <tr key={row.reportId}> 
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
                                                onClick={() => handleStatusChange(row.reportId)} 
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