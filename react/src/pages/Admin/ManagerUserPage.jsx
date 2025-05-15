import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./ManagerUserPage.module.css"; // Correct CSS Module import

//임시데이터
const data = [
  { no: 1, count: 7, id: "yujin0712", type: "게시판", title: "*****", content: "***", date: "2025-04-24", status: "처리" },
  { no: 2, count: 6, id: "yujin0712", type: "댓글", title: "여행지 추천받아요~", content: "***", date: "2025-04-24", status: "처리" },
  { no: 3, count: 5, id: "yujin0712", type: "댓글", title: "min:ute로 여행 계획...", content: "****", date: "2025-04-24", status: "처리" },
  { no: 4, count: 4, id: "yujin0712", type: "댓글", title: "여름 여행지 추천", content: "**", date: "2025-04-24", status: "완료" },
  { no: 5, count: 3, id: "yujin0712", type: "문의사항", title: "*****", content: "*****", date: "2025-04-24", status: "완료" },
];

const ManagerUserPage = () => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.main}>
        <Sidebar />
        <section className={styles.content}>
          <h1>신고관리</h1>
          <h2>신고 내역 상세 - yujin0712</h2>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>누적횟수</th>
                <th>ID</th>
                <th>위치</th>
                <th>제목</th>
                <th>신고내용</th>
                <th>작성일</th>
                <th>처리/완료</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.no}>
                  <td>{row.no}</td>
                  <td>{row.count}</td>
                  <td>{row.id}</td>
                  <td>{row.type}</td>
                  <td>{row.title}</td>
                  <td>{row.content}</td>
                  <td>{row.date}</td>
                  <td>
                    
                    <button className={`${styles.status} ${row.status === "처리" ? styles.pending : styles.done}`}>
                      {row.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.pagination}>
                      <button>&lt;</button>
                      <button className={styles.active}>1</button>
                      <button>2</button>
                      <button>3</button>
                      <button>&gt;</button>
                    </div>
        </section>
      </div>
    </div>
  );
};

export default ManagerUserPage;
