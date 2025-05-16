import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import searchButtonIcon from '../../assets/images/search_icon.png'; // 실제 경로에 맞게 수정해주세요.
import Pagination from '../../components/Pagination/Pagination'; // 실제 경로에 맞게 수정해주세요.
import styles from "./ReportedMembers.module.css";

// 목업 데이터 생성 함수 (새로운 분류에 맞게 수정)
const generateInitialReportedMembers = (count = 37) => {
  const items = [];
  const userIds = ["yujin0712", "hodu1030", "mad09", "cjak3974", "qowui08", "akn45", "dgvv123", "newUser1", "vipUser", "userX01", "testAcc", "reporter99"];
  const nicknames = ["똑똑한기린", "용감한사자", "빠른치타", "친절한코끼리", "조용한올빼미", "신중한거북이", "활발한원숭이", "장난꾸러기다람쥐", "아름다운백조", "멋진독수리", "강한호랑이", "부지런한개미"];
  const emails = ["giraffe@example.com", "lion@example.com", "cheetah@example.com", "elephant@example.com", "owl@example.com", "turtle@example.com", "monkey@example.com", "squirrel@example.com", "swan@example.com", "eagle@example.com", "tiger@example.com", "ant@example.com"];
  const genders = ["여", "남", "비공개"]; // 성별 옵션 추가
  const memberStatuses = ["정상", "정지"]; // 회원 상태: 정상, 정지

  for (let i = 0; i < count; i++) {
    items.push({
      reportEntryId: `rep-${i + 1}`, // 고유 ID (key 및 상태 변경용)
      NO: count - i,
      ID: userIds[i % userIds.length],
      닉네임: nicknames[i % nicknames.length],
      'E-mail': emails[i % emails.length],
      성별: genders[i % genders.length],
      누적횟수: Math.floor(Math.random() * 10) + 1,
      회원상태: memberStatuses[i % memberStatuses.length],
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

  // 필터링 및 검색 상태
  const [dateRange, setDateRange] = useState({ start: '', end: '' }); // 날짜 필터는 현재 데이터 모델에 없으므로 UI만 존재
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    const loadedMembers = generateInitialReportedMembers();
    setAllReportedMembers(loadedMembers);
    // setMembersToDisplay(loadedMembers); // 필터링 로직으로 대체
    // setCurrentPage(1); // 필터링 로직으로 대체
  }, []);

  // 필터링 및 검색 로직 적용
  useEffect(() => {
    let filteredMembers = allReportedMembers;

    // 상태 필터
    if (statusFilter !== 'all') {
      filteredMembers = filteredMembers.filter(member => member.회원상태 === statusFilter);
    }

    // 검색어 필터 (ID, 닉네임, E-mail)
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredMembers = filteredMembers.filter(member =>
        member.ID.toLowerCase().includes(lowerSearchTerm) ||
        member.닉네임.toLowerCase().includes(lowerSearchTerm) ||
        member['E-mail'].toLowerCase().includes(lowerSearchTerm)
      );
    }
    // 날짜 필터는 현재 데이터에 없으므로, 필요시 해당 필드 추가 후 구현

    setMembersToDisplay(filteredMembers);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로
  }, [statusFilter, searchTerm, allReportedMembers, dateRange]);


  const totalPages = Math.ceil(membersToDisplay.length / itemsPerPage);
  const indexOfLastMember = currentPage * itemsPerPage;
  const indexOfFirstMember = indexOfLastMember - itemsPerPage;
  const currentDisplayedMembers = membersToDisplay.slice(indexOfFirstMember, indexOfLastMember);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleStatusChange = (e, reportEntryId) => {
    e.stopPropagation(); // 행 클릭 이벤트 전파 방지

    const updateLogic = (prevMembers) => prevMembers.map(member => {
      if (member.reportEntryId === reportEntryId) {
        return { ...member, 회원상태: member.회원상태 === "정지" ? "정상" : "정지" };
      }
      return member;
    });

    setAllReportedMembers(updateLogic);
    // membersToDisplay는 useEffect에 의해 allReportedMembers가 변경되면 자동으로 업데이트됨

    // 콘솔 로그 (디버깅용)
    const updatedMembersList = updateLogic(allReportedMembers); // 임시로 업데이트된 리스트를 만듦
    const changedMember = updatedMembersList.find(m => m.reportEntryId === reportEntryId);
    if (changedMember) {
      console.log(`Status changed for report entry ID: ${reportEntryId} to ${changedMember.회원상태}`);
      // TODO: 실제 API 호출로 서버에 상태 업데이트
    }
  };

  const handleRowClick = (memberId) => {
    // 신고 회원 상세 페이지로 이동 (경로는 예시)
    navigate(`/admin/user-detail/${memberId}`); // 또는 /admin/reported-member-detail/${memberId}
  };


  return (
    <>
      <div className={styles.container}>
        <main className={styles.reportedContent}>
          <h2 className={styles.title1}>신고 회원 관리</h2>
          <div className={styles.filterBar}>
            <input
              type="date"
              className={styles.filterElement}
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({...prev, start: e.target.value}))}
            />
            <span className={styles.dateSeparator}>~</span>
            <input
              type="date"
              className={styles.filterElement}
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({...prev, end: e.target.value}))}
            />
            <select
              className={`${styles.filterElement} ${styles.filterSelect}`}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">회원상태 (전체)</option>
              <option value="정상">정상</option>
              <option value="정지">정지</option>
            </select>
            <input
              type="text"
              placeholder="ID, 닉네임, E-mail 검색"
              className={`${styles.filterElement} ${styles.filterSearchInput}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="button" className={styles.filterSearchButton}>
              <img src={searchButtonIcon} alt="검색" className={styles.searchIcon} />
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>NO</th>
                <th>ID</th>
                <th>닉네임</th>
                <th>E-mail</th>
                <th>성별</th>
                <th>누적횟수</th>
                <th>회원상태</th>
              </tr>
            </thead>
            <tbody>
              {currentDisplayedMembers.length > 0 ? (
                currentDisplayedMembers.map((m) => (
                  <tr
                    key={m.reportEntryId}
                    onClick={() => handleRowClick(m.ID)}
                    className={styles.clickableRow}
                  >
                    <td>{m.NO}</td>
                    <td>{m.ID}</td>
                    <td>{m.닉네임}</td>
                    <td>{m['E-mail']}</td>
                    <td>{m.성별}</td>
                    <td>{m.누적횟수}</td>
                    <td>
                      <button
                        className={`${styles.status} ${
                          m.회원상태 === "정지" ? styles.stop : styles.active // '정상'일 때 active 스타일
                        }`}
                        onClick={(e) => handleStatusChange(e, m.reportEntryId)}
                        title={`클릭하여 상태 변경: ${m.회원상태}`}
                      >
                        {m.회원상태}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">표시할 신고 회원이 없습니다.</td> {/* colSpan 7로 수정 */}
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