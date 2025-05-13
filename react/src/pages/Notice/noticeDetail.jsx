import React from 'react';
import { Link } from 'react-router-dom'; // Link, useParams import
import NoticeDetailStyle from "./noticeDetail.module.css";
// import banner from "../../assets/images/banner.png"; // 필요하다면 배너 이미지

// 예시 데이터 (실제로는 useParams로 noticeId를 받아와 API로 데이터 호출)
const noticeData = {
    id: '1', // 예시 ID
    isImportant: true,
    title: '중요 공지사항입니다: 서버 점검 안내',
    author: '관리자',
    views: 1024,
    createdAt: '2025.05.10',
    content: "안녕하세요. 사용자 여러분께 안내 말씀드립니다.\n\n보다 안정적인 서비스 제공을 위해 아래와 같이 서버 점검을 실시할 예정입니다.\점검 시간 동안에는 서비스 이용이 일시적으로 중단될 수 있으니 양해 부탁드립니다.\n\n- 점검 일시: 2025년 5월 15일 (목) 02:00 ~ 04:00 (2시간)\n- 점검 내용: 서버 안정화 및 성능 개선 작업\n\n항상 최선을 다하는 서비스가 되겠습니다.\n감사합니다."
};

function NoticeDetail() {
    // const { noticeId } = useParams(); // 실제 사용 시 URL 파라미터에서 ID 추출
    // 실제 데이터 로직: useEffect(() => { /* fetch notice data by noticeId */ }, [noticeId]);

    return (
        <div className={NoticeDetailStyle.background}>

            {/* 페이지 제목 ("공지사항") - 클릭 시 목록으로 이동 */}
            <div className={NoticeDetailStyle.title}>
                <Link to="/notice" className={NoticeDetailStyle.titleLink}>
                    <h1>공지사항</h1>
                </Link>
            </div>

            {/* 메인 콘텐츠 영역 - 연회색 배경, 상단 핑크 테두리 */}
            <div className={NoticeDetailStyle.contentArea}>

                {/* 실제 공지 내용이 담길 흰색 박스 - 테두리, 그림자 적용 */}
                <div className={NoticeDetailStyle.content}>

                    <div className={NoticeDetailStyle.info}>
                        <div className={NoticeDetailStyle.infoLeft}>
                            {noticeData.isImportant && (
                                <span className={NoticeDetailStyle.importantTag}>중요</span>
                            )}
                            <span className={NoticeDetailStyle.postTitleText}>{noticeData.title}</span>
                        </div>
                        <div className={NoticeDetailStyle.infoRight}>
                            <span className={NoticeDetailStyle.author}>작성자: {noticeData.author}</span>
                            <span className={NoticeDetailStyle.views}>조회수: {noticeData.views}</span>
                            <span className={NoticeDetailStyle.createdAt}>작성일: {noticeData.createdAt}</span>
                        </div>
                    </div>

                    <div className={NoticeDetailStyle.textbox}>
                        {/* 실제 내용을 표시할 때는 pre 태그나, \n을 <br/>로 변환하는 로직 필요 */}
                        {noticeData.content.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                    </div>
                    {/* 첨부파일 등이 있다면 여기에 추가 */}
                </div>
                {/* 수정/삭제/목록 버튼은 추후 관리자 기능으로 추가 예정 */}
            </div>
        </div>
    )
}

export default NoticeDetail;