// ReportedMemberDetail.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // useNavigate 추가
import styles from "../../assets/styles/ReportedMemberDetail.module.css"; // 실제 경로로 수정해주세요.
import Pagination from '../../components/Pagination/Pagination'; // 실제 경로로 수정해주세요.

const generateInitialReportData = (userIdForDetail, count = 15) => {
    const items = [];
    const contentAuthorNicknames = ["게시글주인공", "댓글작성자A", "문의글쓴이", "오리지널포스터", "콘텐츠생성자"];
    const titlesAndContents = [
        { title: "부적절한 게시물 신고", content: "광고성 스팸 게시물입니다. 확인 바랍니다." },
        { title: "악성 댓글 발견", content: "타인 비방 및 욕설 포함된 댓글입니다." },
        { title: "개인정보 노출 게시글", content: "전화번호, 주소 등 개인정보가 포함되어 있습니다." },
    ];
    const visibilityStatuses = ["공개", "숨김"];
    const contentTypes = [ // 원본 콘텐츠 정보 추가
        { typeName: '자유게시판', typeKey: 'freeboard', pathPrefix: '/admin/managerFreeboardDetail/' },
        { typeName: '문의사항', typeKey: 'qna', pathPrefix: '/admin/managerQnaDetail/' }
    ];

    for (let i = 0; i < count; i++) {
        const tc = titlesAndContents[i % titlesAndContents.length];
        const contentTypeInfo = contentTypes[i % contentTypes.length];
        items.push({
            reportDetailId: `detail-${userIdForDetail}-${i + 1}`,
            NO: count - i,
            ID: userIdForDetail, // 신고 '당한' 사용자의 ID (이 페이지의 주체)
            닉네임: contentAuthorNicknames[i % contentAuthorNicknames.length], // '신고된 컨텐츠의 작성자' 닉네임
            '제목/내용일부': `${contentTypeInfo.typeName} - ${tc.title.substring(0,10)}...: ${tc.content.substring(0, 15)}...`,
            작성일: `2024.1${(i % 3) + 0}.${String((i % 28) + 1).padStart(2, '0')}`,
            숨김상태: visibilityStatuses[i % visibilityStatuses.length],
            originalContentType: contentTypeInfo.typeKey, // 'freeboard' 또는 'qna'
            originalContentId: `${contentTypeInfo.typeKey === 'freeboard' ? 'fb' : 'qa'}_${1000 + i}`, // 원본 글/댓글 ID
            navigationPathPrefix: contentTypeInfo.pathPrefix, // 이동 경로 접두사
        });
    }
    return items;
};

function ReportedMemberDetail() {
    const { memberId } = useParams(); // URL에서 신고 '당한' 회원 ID
    const navigate = useNavigate(); // useNavigate 사용
    const [allReportItems, setAllReportItems] = useState([]);
    const [reportsToDisplay, setReportsToDisplay] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const loadedReports = generateInitialReportData(memberId || "unknownUser");
        setAllReportItems(loadedReports);
        setReportsToDisplay(loadedReports);
        setCurrentPage(1);
    }, [memberId]);

    const totalPages = Math.ceil(reportsToDisplay.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDisplayedItems = reportsToDisplay.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleVisibilityChange = (e, reportDetailId) => {
        e.stopPropagation();
        const updateLogic = (prevItems) => prevItems.map(item => {
            if (item.reportDetailId === reportDetailId) {
                return { ...item, 숨김상태: item.숨김상태 === "숨김" ? "공개" : "숨김" };
            }
            return item;
        });
        setAllReportItems(updateLogic);
        setReportsToDisplay(updateLogic); // 필터링된 목록도 함께 업데이트
    };

    // 행 클릭 시 원본 콘텐츠 상세 페이지로 이동
    const handleRowItemClick = (item) => {
        if (item.navigationPathPrefix && item.originalContentId) {
            navigate(`${item.navigationPathPrefix}${item.originalContentId}`);
        } else {
            console.warn("이동 경로 또는 원본 콘텐츠 ID가 없습니다:", item);
        }
    };

    const displayMemberId = memberId || "특정사용자";

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <section className={styles.content}>
                    <h1>신고 관리</h1>
                    <h2>신고 내역 상세 - {displayMemberId}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>NO</th>
                                <th>ID (신고된 사용자)</th>
                                <th>닉네임 (콘텐츠 작성자)</th>
                                <th>제목/내용일부 (신고된 콘텐츠)</th>
                                <th>작성일 (신고된 콘텐츠)</th>
                                <th>숨김상태 (관리자 설정)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDisplayedItems.length > 0 ? (
                                currentDisplayedItems.map((row) => (
                                    <tr key={row.reportDetailId} onClick={() => handleRowItemClick(row)} className={styles.clickableRow}>
                                        <td>{row.NO}</td>
                                        <td>{row.ID}</td>
                                        <td>{row.닉네임}</td>
                                        <td>{row['제목/내용일부']}</td>
                                        <td>{row.작성일}</td>
                                        <td>
                                            <button
                                                className={`${styles.status} ${row.숨김상태 === "숨김" ? styles.hidden : styles.public}`}
                                                onClick={(e) => handleVisibilityChange(e, row.reportDetailId)}
                                                title={`클릭하여 상태 변경: ${row.숨김상태 === "숨김" ? "공개로" : "숨김으로"}`}
                                            >
                                                {row.숨김상태}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">표시할 신고 내역이 없습니다.</td>
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
}

export default ReportedMemberDetail;