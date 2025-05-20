import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import searchButtonIcon from '../../assets/images/search_icon.png'; // 실제 경로에 맞게 수정해주세요.
import styles from "../../assets/styles/ManagerUsers.module.css";
import Pagination from '../../components/Pagination/Pagination'; // 실제 경로에 맞게 수정해주세요.

// 더미 데이터 생성 함수 (새로운 분류에 맞게 수정)
const generateUserMockData = () => {
  const ids = ["yujin0712", "hodu1030", "mad09", "cjak3974", "qowui08", "akn45", "dgvv123", "newUser1", "vipUser", "guest001", "testUser55", "adminSample"];
  const nicknames = ["고양이냥", "멍멍이짱", "매드맥스", "뚝심", "지지", "천재코더", "빠른개발자", "신입왕", "VVIP", "손님1", "테스트유저", "관리자샘플"];
  const emails = ["yujin@example.com", "hodu@example.com", "mad@example.com", "cjak@example.com", "qowui@example.com", "akn@example.com", "dgvv@example.com", "new@example.com", "vip@example.com", "guest@example.com", "test@example.com", "admin@example.com"];
  const genders = ["여", "남"];
  const memberStatuses = ["정상", "정지"];

  const users = ids.map((id, index) => {
    const birthYear = 1990 + (index % 10);
    const birthMonth = (index % 12) + 1;
    const birthDay = (index % 28) + 1;
    return {
      uniqueId: `user-${index + 1}`, // 상태 변경 및 key를 위한 고유 ID
      NO: index + 1,
      ID: id,
      닉네임: nicknames[index % nicknames.length],
      'E-mail': emails[index % emails.length], // 키에 특수문자가 있으면 따옴표로 감싸줍니다.
      성별: genders[index % genders.length],
      생년월일: `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`,
      회원상태: memberStatuses[index % memberStatuses.length],
    };
  });
  return users;
};

const ManagerUsers = () => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [usersToDisplay, setUsersToDisplay] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadedUsers = generateUserMockData();
    setAllUsers(loadedUsers);
    setUsersToDisplay(loadedUsers);
    setCurrentPage(1);
  }, []);

  const totalPages = Math.ceil(usersToDisplay.length / itemsPerPage);
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentDisplayedUsers = usersToDisplay.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 회원상태 변경 핸들러 (정상, 정지 토글)
  const handleStatusChange = (e, uniqueId) => {
    e.stopPropagation(); // 행 클릭 이벤트 전파 방지

    const updateLogic = (prevUsers) =>
      prevUsers.map((user) => {
        if (user.uniqueId === uniqueId) {
          return {
            ...user,
            회원상태: user.회원상태 === "정지" ? "정상" : "정지",
          };
        }
        return user;
      });

    setAllUsers(updateLogic);
    setUsersToDisplay(updateLogic); // 검색/필터 결과에도 반영되도록

    // 콘솔 로그 (디버깅용)
    const changedUser = allUsers.find((u) => u.uniqueId === uniqueId);
    if (changedUser) {
        // 이 시점에서는 상태가 이미 변경되었으므로, 변경 '후'의 상태를 기준으로 로그를 남기려면
        // updateLogic 내에서 변경 전 상태를 기록하거나, 아래와 같이 다시 찾아야 합니다.
        // 여기서는 간단히 변경될 상태를 로깅합니다.
        const newStatus = changedUser.회원상태 === "정지" ? "정상" : "정지"; // 이 부분은 사실상 토글 전의 상태를 기반으로 다음 상태를 예측
        console.log(`회원 ID: ${changedUser.ID}, 고유 ID: ${uniqueId}의 상태가 ${changedUser.회원상태}(으)로 변경됨`);
    }
  };

  // 필터링 및 검색 로직 (예시 - 실제 구현 필요)
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let filteredUsers = allUsers;

    // 날짜 필터 (생년월일 기준 예시 - 실제 필터링 대상 필드는 요구사항에 따라 변경)
    if (dateRange.start && dateRange.end) {
        // 실제로는 user.생년월일과 dateRange.start, dateRange.end를 비교해야 합니다.
        // 여기서는 단순화를 위해 로직을 생략합니다.
    }

    // 상태 필터
    if (statusFilter !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.회원상태 === statusFilter);
    }

    // 검색어 필터 (ID, 닉네임, 이메일 등)
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(user =>
        user.ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.닉네임.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user['E-mail'].toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setUsersToDisplay(filteredUsers);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로
  }, [dateRange, statusFilter, searchTerm, allUsers]);


  const handleRowClick = (userId) => {
    navigate(`/admin/member-detail/${userId}`); // 상세 페이지 경로
  };

  return (
    <div className={styles.container}>
      <main className={styles.contentArea}> {/* 클래스명 변경: reportedContent -> contentArea */}
        <h2 className={styles.title1}>전체 회원 관리</h2>

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
              <th>생년월일</th>
              <th>회원상태</th>
            </tr>
          </thead>
          <tbody>
            {currentDisplayedUsers.length > 0 ? (
              currentDisplayedUsers.map((user) => (
                <tr
                  key={user.uniqueId}
                  onClick={() => handleRowClick(user.ID)}
                  className={styles.clickableRow}
                >
                  <td>{user.NO}</td>
                  <td>{user.ID}</td>
                  <td>{user.닉네임}</td>
                  <td>{user['E-mail']}</td>
                  <td>{user.성별}</td>
                  <td>{user.생년월일}</td>
                  <td>
                    <button
                      className={`${styles.status} ${
                        user.회원상태 === "정지" ? styles.stop : styles.active // '정상' 상태에 active 스타일 적용
                      }`}
                      onClick={(e) => handleStatusChange(e, user.uniqueId)}
                    >
                      {user.회원상태}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">회원 데이터가 없습니다.</td> {/* colSpan 변경 */}
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
  );
};

export default ManagerUsers;