import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Pagination from '../../components/Pagination/Pagination'; // 실제 경로에 맞게 수정해주세요.
import styles from "./ReportedMemberDetail.module.css";

// 목업 데이터 생성 함수 (닉네임 의미 변경)
const generateInitialReportData = (reportedUserId, count = 15) => { // reportedUserId: 신고 '당한' 사용자의 ID
  const items = [];
  // '닉네임'은 "신고된 컨텐츠의 원본 작성자" 닉네임으로 변경
  const contentAuthorNicknames = ["게시글주인공", "댓글작성자A", "문의글쓴이", "오리지널포스터", "콘텐츠생성자"];
  const titlesAndContents = [
    { title: "부적절한 게시물 발견됨", content: "사용자 ID '" + reportedUserId + "'에 의해 작성된 광고성 스팸 게시물입니다." },
    { title: "악의적인 댓글 확인", content: "'" + reportedUserId + "' 사용자의 댓글에서 타인 비방 및 욕설이 포함되어 있습니다." },
    { title: "개인정보 포함 게시글", content: "'" + reportedUserId + "'의 게시글에 개인정보가 있습니다." },
    { title: "허위 정보 유포 의심", content: "'" + reportedUserId + "'가 작성한 글이 혼란을 야기합니다." },
    { title: "저작권 침해 자료 게시", content: "'" + reportedUserId + "'가 올린 자료가 불법 공유 자료로 보입니다." }
  ];
  const visibilityStatuses = ["공개", "숨김"];

  for (let i = 0; i < count; i++) {
    const tc = titlesAndContents[i % titlesAndContents.length];
    items.push({
      reportDetailId: `detail-${reportedUserId}-${i + 1}`,
      NO: count - i,
      ID: reportedUserId, // 이 ID는 '신고된 컨텐츠를 작성한 사용자' 또는 '신고된 사용자'의 ID를 의미.
                          // 테이블 컬럼에서는 '신고된 컨텐츠 작성자 ID'로 해석될 수 있음.
      닉네임: contentAuthorNicknames[i % contentAuthorNicknames.length], // "신고된 컨텐츠의 작성자" 닉네임
      '제목/내용일부': `${tc.title} - ${tc.content.substring(0, 30)}...`, // 내용 일부 표시 길이 조정
      작성일: `2024.1${(i % 3) + 0}.${String((i % 28) + 1).padStart(2, '0')}`, // 날짜 형식 유지 또는 변경
      숨김상태: visibilityStatuses[i % visibilityStatuses.length],
    });
  }
  return items;
};

const ReportedMemberDetail = () => {
  const { memberId } = useParams(); // URL 파라미터에서 '신고된 사용자'의 ID를 가져옴
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
    setReportsToDisplay(updateLogic);

    const changedItem = updateLogic(allReportItems).find(it => it.reportDetailId === reportDetailId);
    if (changedItem) {
        console.log(`Visibility changed for report detail ID: ${reportDetailId} to ${changedItem.숨김상태}`);
    }
  };

  const displayMemberId = memberId || "특정사용자";

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <section className={styles.content}>
          <h1>신고 관리</h1>
          {/* 부제목은 왼쪽 정렬되도록 CSS에서 처리 */}
          <h2>신고 내역 상세 - {displayMemberId}</h2>
          <table>
            <thead>
              <tr>
                <th>NO</th>
                <th>ID</th> {/* 이 ID는 신고된 컨텐츠의 작성자 ID를 의미 */}
                <th>닉네임</th> {/* 이 닉네임은 신고된 컨텐츠의 작성자 닉네임 */}
                <th>제목/내용일부</th>
                <th>작성일</th>
                <th>숨김상태</th>
              </tr>
            </thead>
            <tbody>
              {currentDisplayedItems.length > 0 ? (
                currentDisplayedItems.map((row) => (
                  <tr key={row.reportDetailId}>
                    <td>{row.NO}</td>
                    <td>{row.ID}</td>
                    <td>{row.닉네임}</td>
                    <td>{row['제목/내용일부']}</td>
                    <td>{row.작성일}</td>
                    <td>
                      <button
                        className={`${styles.status} ${
                          row.숨김상태 === "숨김" ? styles.hidden : styles.public
                        }`}
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
};

export default ReportedMemberDetail;