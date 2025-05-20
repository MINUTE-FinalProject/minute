// src/pages/Notice/notice.js (또는 해당 파일의 실제 경로)
import { useEffect, useState } from 'react'; // React import 추가
import { Link, useNavigate } from 'react-router-dom';
import noticeStyle from "../../assets/styles/notice.module.css";
import Modal from '../../components/Modal/Modal'; // Modal 컴포넌트 import
import Pagination from '../../components/Pagination/Pagination';

const generateInitialNotices = (count = 28) => {
    // ... (기존 generateInitialNotices 함수 내용 유지)
    const items = [];
    const importantIndices = [0, 5, 12]; 
    for (let i = 0; i < count; i++) {
        const isImportant = importantIndices.includes(i);
        const date = new Date(2025, 4, 28 - i); 
        const formattedDate = `${date.getFullYear().toString().slice(2)}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
        items.push({
            id: isImportant ? `sticky-${i}` : (count - i).toString(),
            no: isImportant ? '중요' : 0, 
            title: `${isImportant ? '📌 [필독] 중요 공지사항입니다: ' : ''}공지사항 제목 ${count - i}`,
            author: '관리자',
            views: Math.floor(Math.random() * 1000) + 50,
            date: formattedDate,
            isImportant: isImportant,
        });
    }
    return items;
};

function Notice() {
    const [allNotices, setAllNotices] = useState([]); 
    const [noticesToDisplay, setNoticesToDisplay] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    // 모달 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalProps, setModalProps] = useState({
        title: '',
        message: '',
        onConfirm: null,
        confirmText: '확인',
        cancelText: null,
        type: 'default',
        confirmButtonType: 'primary',
        cancelButtonType: 'secondary'
    });

    useEffect(() => {
        // API 호출 시뮬레이션 및 에러 처리 예시
        const MOCK_API_SHOULD_FAIL = false; // 이 값을 true로 바꾸면 에러 모달 테스트 가능

        const fetchNotices = async () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (MOCK_API_SHOULD_FAIL) {
                        reject(new Error("서버에서 공지사항 목록을 불러오는 데 실패했습니다."));
                    } else {
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
                        resolve(finalSortedNotices);
                    }
                }, 500); // 0.5초 딜레이 시뮬레이션
            });
        };

        fetchNotices()
            .then(finalSortedNotices => {
                setAllNotices(finalSortedNotices); 
                setNoticesToDisplay(finalSortedNotices); 
                setCurrentPage(1); 
            })
            .catch(error => {
                console.error("Error fetching notices:", error);
                setModalProps({
                    title: "오류 발생",
                    message: error.message || "공지사항을 불러오는 중 문제가 발생했습니다.\n잠시 후 다시 시도해주세요.",
                    confirmText: "확인",
                    type: "error", // 에러 타입 모달
                    confirmButtonType: 'blackButton', // 요청하신 검정색 버튼
                    onConfirm: () => { /* 필요시 특정 동작 추가, 예: navigate('/') */ }
                });
                setIsModalOpen(true);
            });
    }, []); 

    const totalPages = Math.ceil(noticesToDisplay.length / itemsPerPage);
    const indexOfLastNotice = currentPage * itemsPerPage;
    const indexOfFirstNotice = indexOfLastNotice - itemsPerPage;
    const currentDisplayedNotices = noticesToDisplay.slice(indexOfFirstNotice, indexOfLastNotice);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRowClick = (noticeId) => {
        navigate(`/noticeDetail/${noticeId}`);
    };

    return (
        <>
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
                                        onClick={() => handleRowClick(notice.id)}
                                        style={{cursor: 'pointer'}} // clickableRow 클래스 대신 인라인 스타일로 클릭 가능함을 표시
                                    >
                                        <td>
                                            {notice.isImportant ? (
                                                <span className={noticeStyle.importantTag}>중요</span>
                                            ) : (
                                                notice.no 
                                            )}
                                        </td>
                                        <td className={noticeStyle.tableTitle}>
                                            <Link 
                                                to={`/noticeDetail/${notice.id}`} 
                                                className={noticeStyle.titleLink}
                                                onClick={(e) => e.stopPropagation()}
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
                                    <td colSpan="5">
                                        {isModalOpen ? "오류로 인해 내용을 표시할 수 없습니다." : "등록된 공지사항이 없습니다."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {totalPages > 1 && !isModalOpen && ( // 모달이 열려있지 않을 때만 페이지네이션 표시
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
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                {...modalProps}
            />
        </>
    );
}

export default Notice;