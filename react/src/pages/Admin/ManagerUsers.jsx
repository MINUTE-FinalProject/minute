import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import searchButtonIcon from '../../assets/images/search_icon.png';
import Pagination from '../../components/Pagination/Pagination';
import styles from "./ReportedMembers.module.css";

//더미
const generateUserMockData = () => {
  const userIds = ["yujin0712", "hodu1030", "mad09", "cjak3974", "qowui08", "akn45", "dgvv123", "newUser1", "vipUser","yujin0712", "hodu1030", "mad09", "cjak3974", "qowui08", "akn45", "dgvv123", "newUser1", "vipUser"];
  const names = ["유진", "호두", "매드", "철수", "지은", "성현", "민재", "새로운유저", "VIP회원","유진", "호두", "매드", "철수", "지은", "성현", "민재", "새로운유저", "VIP회원"];
  const nicknames = ["고양이냥", "멍멍이짱", "매드맥스", "뚝심", "지지", "천재코더", "빠른개발자", "신입왕", "VVIP","고양이냥", "멍멍이짱", "매드맥스", "뚝심", "지지", "천재코더", "빠른개발자", "신입왕", "VVIP"];
  const genders = ["여", "남"];
  const statuses = ["정상", "정지", "탈퇴"];

  const users = userIds.map((id, index) => {
    return {
      reportEntryId: `entry-${index + 1}`, // 상태 변경을 위한 고유 ID
      no: index + 1,
      name: names[index % names.length],
      id,
      birth: `199${index % 10}-0${(index % 9) + 1}-1${index}`,
      nickname: nicknames[index % nicknames.length],
      gender: genders[index % 2],
      registeredAt: `202${Math.floor(index / 3)}.0${(index % 9) + 1}.1${index}`,
      status: statuses[index % statuses.length],
    };
  });

  return users;
};

const ReportedMembers = () => {
  const navigate = useNavigate();
  const [allReportedMembers, setAllReportedMembers] = useState([]);
  const [membersToDisplay, setMembersToDisplay] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadedMembers = generateUserMockData(); 
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
    const updateLogic = (prevMembers) =>
      prevMembers.map((member) => {
        if (member.reportEntryId === reportEntryId) {
          return {
            ...member,
            status: member.status === "정지" ? "대기" : "정지",
          };
        }
        return member;
      });

    setAllReportedMembers(updateLogic);
    setMembersToDisplay(updateLogic);

    const changedMember = allReportedMembers.find((m) => m.reportEntryId === reportEntryId);
    if (changedMember) {
      const newStatus = changedMember.status === "정지" ? "대기" : "정지";
      console.log(`Status changed for report entry ID: ${reportEntryId} to ${newStatus}`);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.reportedContent}>
        <h2 className={styles.title1}>회원 관리</h2>

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
              <th>No</th>
              <th>이름</th>
              <th>ID</th>
              <th>생일</th>
              <th>닉네임</th>
              <th>성별</th>
              <th>등록일</th>
              <th>회원상태</th>
            </tr>
          </thead>
          <tbody>
            {currentDisplayedMembers.length > 0 ? (
              currentDisplayedMembers.map((user) => (
                <tr key={user.reportEntryId}
                 onClick={() => navigate(`/admin/member-detail/${user.id}`)}> 
                  <td>{user.no}</td>
                  <td>{user.name}</td>
                  <td>{user.id}</td>
                  <td>{user.birth}</td>
                  <td>{user.nickname}</td>
                  <td>{user.gender}</td>
                  <td>{user.registeredAt}</td>
                  <td>
                    <button
                      className={`${styles.status} ${
                       user.status === "정지" ? styles.stop : styles.wait
                       }`}
                      onClick={() => handleStatusChange(user.reportEntryId)}
                    >
                      {user.status}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">회원 데이터가 없습니다.</td>
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

export default ReportedMembers;
