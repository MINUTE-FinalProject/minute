import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 추가
import Pagination from '../../components/Pagination/Pagination';
import noticeStyle from "./notice.module.css";

const generateInitialNotices = (count = 28) => {
    const items = [];
    const importantIndices = [0, 5, 12]; 
    let regularNoticeCounter = 1; // 이 변수는 최종 정렬 후 다시 사용됩니다.

    for (let i = 0; i < count; i++) {
        const isImportant = importantIndices.includes(i);
        const date = new Date(2025, 4, 28 - i); 
        const formattedDate = `${date.getFullYear().toString().slice(2)}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
        
        items.push({
            id: isImportant ? `sticky-${i}` : (count - i).toString(), // ID는 고유해야 하므로, 일반 공지 ID도 역순으로 부여하거나 다른 방식으로 고유성 보장
            no: isImportant ? '중요' : 0, 
            title: `${isImportant ? '📌 [필독] 중요 공지사항입니다: ' : ''}공지사항 제목 ${count - i}`,
            author: '관리자',
            views: Math.floor(Math.random() * 1000) + 50,
            date: formattedDate,
            isImportant: isImportant,
        });
    }
    // 중요 공지가 아닌 것들의 NO는 정렬 후 다시 매깁니다.
    return items;
};


function Notice() {
    const [allNotices, setAllNotices] = useState([]); 
    const [noticesToDisplay, setNoticesToDisplay] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const navigate = useNavigate(); // useNavigate 훅 사용

    useEffect(() => {
        const loadedRawNotices = generateInitialNotices();
        
        const sortedNotices = [...loadedRawNotices].sort((a, b) => {
            if (a.isImportant && !b.isImportant) return -1;
            if (!a.isImportant && b.isImportant) return 1; 
            return new Date(b.date.split('.').join('-')) - new Date(a.date.split('.').join('-'));
        });

        let regularNoticeCounter = 1;
        const finalSortedNotices = sortedNotices.map(notice => {
            if (!notice.isImportant) {
                return { ...notice, no: regularNoticeCounter++ };
            }
            return notice;
        });
        
        setAllNotices(finalSortedNotices); 
        setNoticesToDisplay(finalSortedNotices); 
        setCurrentPage(1); 
    }, []); 


    const totalPages = Math.ceil(noticesToDisplay.length / itemsPerPage);
    const indexOfLastNotice = currentPage * itemsPerPage;
    const indexOfFirstNotice = indexOfLastNotice - itemsPerPage;
    const currentDisplayedNotices = noticesToDisplay.slice(indexOfFirstNotice, indexOfLastNotice);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 행 클릭 시 상세 페이지로 이동하는 함수
    const handleRowClick = (noticeId) => {
        // App.js에 정의된 공지사항 상세 페이지 경로로 수정합니다.
        // 예: /noticeDetail/:id
        navigate(`/noticeDetail/${noticeId}`);
    };

    return (
        <div className={noticeStyle.background}>
            <div className={noticeStyle.title}>
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
                                <tr 
                                    key={notice.id} 
                                    className={notice.isImportant ? noticeStyle.important : ''}
                                    onClick={() => handleRowClick(notice.id)} // 행 클릭 핸들러 추가
                                    // CSS에 이미 tr:hover { cursor: pointer; } 스타일이 적용되어 있습니다.
                                >
                                    <td>
                                        {notice.isImportant ? (
                                            <span className={noticeStyle.importantTag}>중요</span>
                                        ) : (
                                            notice.no 
                                        )}
                                    </td>
                                    <td className={noticeStyle.tableTitle}>
                                        {/* 상세 페이지 경로를 handleRowClick과 일치시킵니다. */}
                                        <Link 
                                            to={`/noticeDetail/${notice.id}`} 
                                            className={noticeStyle.titleLink}
                                            onClick={(e) => e.stopPropagation()} // 링크 클릭 시 행 클릭 이벤트 중복 방지
                                        >
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

                {totalPages > 1 && (
                    <div className={noticeStyle.paginationWrapper}>
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