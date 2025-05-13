import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./ReportedMembers.module.css";

const ReportedMembers = () => {
  const members = [
    { no: 1, count: 7, id: "yujin0712", position: "게시판", title: "****", content: "***", date: "2025-04-24", status: "정지" },
    { no: 2, count: 2, id: "hodu1030", position: "댓글", title: "여행지 추천받아요~", content: "***", date: "2025-04-24", status: "대기" },
    { no: 3, count: 3, id: "mad09", position: "댓글", title: "min:ute로 여행 계획...", content: "****", date: "2025-04-24", status: "정지" },
    { no: 4, count: 1, id: "cjak3974", position: "댓글", title: "여름 여행지 추천", content: "**", date: "2025-04-24", status: "대기" },
    { no: 5, count: 1, id: "qowui08", position: "문의사항", title: "*****", content: "******", date: "2025-04-24", status: "대기" },
    { no: 6, count: 1, id: "akn45", position: "댓글", title: "이번휴가 어디로", content: "**", date: "2025-04-24", status: "대기" },
    { no: 7, count: 3, id: "dgvv123", position: "댓글", title: "항공권 특가 정보", content: "****", date: "2025-04-24", status: "정지" },
  ];

  return (
    <>
      <Header />
      <div className="container">
        <Sidebar />
        <main className="reported-content">
          <h2 className="title1">신고관리</h2>
          <div className="filter-bar">
            <input type="date" />
            <input type="date" />
            <select><option>정렬순▼</option></select>
            <button className="type-btn">타입</button>
            <input type="text" placeholder="검색" />
          </div>
          <table>
            <thead>
              <tr>
                <th>No</th><th>누적횟수</th><th>ID</th><th>위치</th><th>제목</th><th>신고내용</th><th>신고일</th><th>회원상태</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.no} className={m.no % 2 === 0 ? "gray" : ""}>
                  <td>{m.no}</td><td>{m.count}</td><td>{m.id}</td><td>{m.position}</td>
                  <td>{m.title}</td><td>{m.content}</td><td>{m.date}</td>
                  <td><button className={`status ${m.status === "정지" ? "stop" : "wait"}`}>{m.status}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button>&lt;</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>&gt;</button>
          </div>
        </main>
      </div>
    </>
  );
};

export default ReportedMembers;
