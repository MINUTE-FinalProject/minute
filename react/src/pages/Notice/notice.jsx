import { Link } from 'react-router-dom'; // 상세 페이지로 이동하기 위한 Link
import noticeStyle from "./notice.module.css";

// 예시 데이터 (실제로는 API를 통해 받아옵니다)
// API 연동 전까지 디자인 및 기본 구조 확인용으로 사용합니다.
const notices = [
    { id: 'sticky', no: '중요', title: '📌 상단고정공지 제목입니다. 필독해주세요!', author: '관리자', views: 777, date: '25.05.03', isImportant: true },
    { id: 1, no: 1, title: '첫 번째 일반 공지사항입니다. 많은 관심 부탁드립니다.', author: '관리자', views: 123, date: '25.05.02' },
    { id: 2, no: 2, title: '두 번째 일반 공지사항입니다. 내용을 확인해주세요.', author: '관리자', views: 456, date: '25.05.01' },
    { id: 3, no: 3, title: '시스템 정기 점검 안내 (매월 첫째 주 월요일)', author: '관리자', views: 789, date: '25.04.29' },
    { id: 4, no: 4, title: '새로운 기능 업데이트 소식', author: '관리자', views: 321, date: '25.04.28' },
    { id: 5, no: 5, title: '이용약관 변경 안내 (25.06.01 시행)', author: '관리자', views: 654, date: '25.04.27' },
];

function Notice() {
    return (
        <div className={noticeStyle.background}> {/* 페이지 전체 배경 */}
            <div className={noticeStyle.title}>   {/* 페이지 제목 ("공지사항") */}
                <h1>공지사항</h1>
            </div>
            <div className={noticeStyle.contentArea}> {/* 실제 콘텐츠 영역 (테이블 등) */}
                {/* 검색창은 제거되었습니다 */}
                <table className={noticeStyle.table}>
                    <thead>
                        <tr>
                            <th scope="col">NO</th>
                            <th scope="col">제목</th>
                            <th scope="col">작성자</th>
                            <th scope="col">조회수</th>
                            <th scope="col">작성날짜</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notices.map(notice => (
                            <tr key={notice.id} className={notice.isImportant ? noticeStyle.important : ''}>
                                <td>
                                    {notice.isImportant ? (
                                        <span className={noticeStyle.importantTag}>{notice.no}</span>
                                    ) : (
                                        notice.no
                                    )}
                                </td>
                                <td className={noticeStyle.tableTitle}>
                                    {/* 각 공지 제목을 상세 페이지로 링크 (실제 경로에 맞게 수정 필요) */}
                                    {/* 예시: /notice/detail/${notice.id} 또는 /notice/${notice.id} */}
                                    <Link to={`/noticeDetail/${notice.id}`} className={noticeStyle.titleLink}>
                                        {notice.title}
                                    </Link>
                                </td>
                                <td>{notice.author}</td>
                                <td>{notice.views}</td>
                                <td>{notice.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* 페이지네이션은 제거되었습니다 */}
        </div>
    );
}

export default Notice;