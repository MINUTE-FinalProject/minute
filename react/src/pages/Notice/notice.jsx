import { useEffect, useState } from 'react'; // useState, useEffect 임포트
import { Link } from 'react-router-dom';
import noticeStyle from "./notice.module.css";

// Pagination 컴포넌트 임포트 (경로를 실제 프로젝트 구조에 맞게 조정해주세요)
// 예: src/pages/Notice/Notice.jsx 에 있다면, src/components/Pagination/Pagination.jsx 는 ../../components/...
import Pagination from '../../components/Pagination/Pagination';

// 목업 데이터 생성 함수
const generateInitialNotices = (count = 28) => { // 28개의 목업 데이터 생성
    const items = [];
    const importantIndices = [0, 5, 12]; // 중요 공지로 만들 인덱스 (예시)
    let regularNoticeCounter = 1;

    for (let i = 0; i < count; i++) {
        const isImportant = importantIndices.includes(i);
        const date = new Date(2025, 4, 28 - i); // 날짜를 하루씩 줄여가며 생성 (5월 28일부터)
        const formattedDate = `${date.getFullYear().toString().slice(2)}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
        
        items.push({
            id: isImportant ? `sticky-${i}` : (i + 1).toString(),
            no: isImportant ? '중요' : 0, // 일반 공지 NO는 나중에 재할당
            title: `${isImportant ? '📌 [필독] 중요 공지사항입니다: ' : ''}공지사항 제목 ${count - i}`,
            author: '관리자',
            views: Math.floor(Math.random() * 1000) + 50,
            date: formattedDate,
            isImportant: isImportant,
        });
    }
    // 중요 공지 아닌 것들만 no 재할당 (최신순으로 가정)
    items.filter(item => !item.isImportant)
         .sort((a,b) => new Date(b.date.split('.').join('-')) - new Date(a.date.split('.').join('-'))) // 날짜 내림차순 정렬
         .forEach(item => {
            item.no = regularNoticeCounter++;
         });

    return items;
};


function Notice() {
    const [allNotices, setAllNotices] = useState([]); // 원본 데이터 (정렬/필터링 전)
    const [noticesToDisplay, setNoticesToDisplay] = useState([]); // 화면에 표시될 공지 (정렬/필터링 후, 페이지네이션 전)

    // --- 페이지네이션 상태 ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // 페이지 당 보여줄 공지 수

    useEffect(() => {
        const loadedRawNotices = generateInitialNotices();
        
        // 중요 공지 상단, 그 외에는 최신순(날짜 내림차순) 정렬
        const sortedNotices = [...loadedRawNotices].sort((a, b) => {
            if (a.isImportant && !b.isImportant) return -1; // a가 중요공지면 위로
            if (!a.isImportant && b.isImportant) return 1;  // b가 중요공지면 b를 위로 (a는 아래로)
            // 둘 다 중요 공지이거나 둘 다 일반 공지이면 날짜로 정렬
            return new Date(b.date.split('.').join('-')) - new Date(a.date.split('.').join('-'));
        });

        // 일반 공지에 대해서만 NO를 다시 매기기 (중요 공지가 상단에 고정된 후)
        let regularNoticeCounter = 1;
        const finalSortedNotices = sortedNotices.map(notice => {
            if (!notice.isImportant) {
                return { ...notice, no: regularNoticeCounter++ };
            }
            return notice;
        });
        
        setAllNotices(finalSortedNotices); // 정렬된 전체 목록 저장
        setNoticesToDisplay(finalSortedNotices); // 페이지네이션 대상 목록 업데이트
        setCurrentPage(1); // 데이터 로드/변경 시 1페이지로 리셋
    }, []); // 초기 로드 시 한 번만 실행


    // --- 페이지네이션 로직 ---
    const totalPages = Math.ceil(noticesToDisplay.length / itemsPerPage);
    const indexOfLastNotice = currentPage * itemsPerPage;
    const indexOfFirstNotice = indexOfLastNotice - itemsPerPage;
    const currentDisplayedNotices = noticesToDisplay.slice(indexOfFirstNotice, indexOfLastNotice);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // 페이지 변경 시 페이지 상단으로 스크롤 (선택 사항)
        // window.scrollTo(0, 0); 
    };

    return (
        <div className={noticeStyle.background}>
            <div className={noticeStyle.title}>
                {/* 아래와 같이 h1을 Link로 감싸줍니다. */}
                <Link to="/notice" className={noticeStyle.pageTitleLink}>
                    <h1>공지사항</h1>
                </Link>
            </div>
            <div className={noticeStyle.contentArea}>
                <table className={noticeStyle.table}>
                    <thead>
                        <tr>
                            <th scope="col">NO</th>
                            <th scope="col">제목</th>
                            <th scope="col">작성자</th>
                            <th scope="col">조회수</th>
                            <th scope="col">날짜</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentDisplayedNotices.length > 0 ? (
                            currentDisplayedNotices.map(notice => (
                                <tr key={notice.id} className={notice.isImportant ? noticeStyle.important : ''}>
                                    <td>
                                        {notice.isImportant ? (
                                            <span className={noticeStyle.importantTag}>중요</span>
                                        ) : (
                                            notice.no // 정렬 후 일반 공지에 부여된 NO 사용
                                        )}
                                    </td>
                                    <td className={noticeStyle.tableTitle}>
                                        {/* App.js에서 /notice/:noticeId 와 같이 경로 설정 필요 */}
                                        <Link to={`/notice/${notice.id}`} className={noticeStyle.titleLink}>
                                            {notice.title}
                                        </Link>
                                    </td>
                                    <td>{notice.author}</td>
                                    <td>{notice.views}</td>
                                    <td>{notice.date}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">등록된 공지사항이 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* 페이지네이션 컴포넌트 추가 */}
                {totalPages > 1 && ( // 1페이지 이하면 페이지네이션 숨김
                    <div className={noticeStyle.paginationWrapper}> {/* 페이지네이션 정렬 등을 위한 래퍼 */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Notice;