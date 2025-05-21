// src/pages/Notice/notice.js

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import noticeStyle from "../../assets/styles/notice.module.css";
import Modal from '../../components/Modal/Modal';
import Pagination from '../../components/Pagination/Pagination';

// generateInitialNotices 함수는 이제 사용하지 않으므로 삭제하거나 주석 처리합니다.
// const generateInitialNotices = (count = 28) => { ... };

function Notice() {
    // const [allNotices, setAllNotices] = useState([]); // API에서 전체 목록을 한번에 다루지 않으므로 이 상태는 불필요할 수 있습니다.
    const [noticesToDisplay, setNoticesToDisplay] = useState([]); // 현재 페이지에 표시될 공지사항
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 (UI에서는 1부터 시작)
    const [totalPages, setTotalPages] = useState(0);   // 전체 페이지 수 (API로부터 받음)
    const [totalElements, setTotalElements] = useState(0); // 전체 게시물 수 (선택적)

    const itemsPerPage = 10; // 페이지 당 아이템 수 (API 요청 시 size 파라미터로 사용)
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalProps, setModalProps] = useState({ /* ... 기존 모달 설정 ... */ });

    // API 호출 로직
    useEffect(() => {
        const fetchNoticesFromAPI = async () => {
            try {
                // API 요청 시 페이지 번호는 0부터 시작하므로 (currentPage - 1)
                const response = await fetch(`/api/notices?page=${currentPage - 1}&size=${itemsPerPage}`);
                // 기본 정렬은 백엔드 @PageableDefault에 의해 처리됩니다.
                // (필요시 &sort=field,direction 파라미터 추가 가능)

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ // JSON 파싱 실패 대비
                        message: `HTTP error! status: ${response.status}`
                    }));
                    throw new Error(errorData.message || `서버에서 공지사항 목록을 불러오는 데 실패했습니다.`);
                }

                const data = await response.json(); // PageResponseDTO<NoticeListResponseDTO> 형태의 응답

                // 데이터 매핑 (백엔드 DTO -> 프론트엔드에서 사용하는 형태)
                let regularNoticeCounter = 1; // 일반 공지 번호 매기기용
                const mappedNotices = data.content.map(notice => {
                    // 날짜 포맷팅 (YY.MM.DD)
                    const dateObj = new Date(notice.noticeCreatedAt);
                    const formattedDate = `${dateObj.getFullYear().toString().slice(2)}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;

                    const displayNo = notice.noticeIsImportant ? '중요' : regularNoticeCounter++;

                    return {
                        id: notice.noticeId, // 백엔드 noticeId
                        no: displayNo,      // '중요' 또는 일반 공지 번호
                        title: notice.noticeTitle,
                        author: notice.authorNickname, // 백엔드 authorNickname
                        views: notice.noticeViewCount,
                        date: formattedDate,
                        isImportant: notice.noticeIsImportant,
                    };
                });
                
                // 중요 공지를 위로, 그 다음 일반 공지를 정렬하는 로직은 백엔드에서 이미 처리됨.
                // 프론트엔드에서는 백엔드가 준 순서대로 표시.
                // 만약 프론트엔드에서 일반 공지 번호를 페이지와 관계없이 전체 순번으로 매기고 싶다면,
                // (currentPage - 1) * itemsPerPage + regularNoticeCounter++ 와 같이 계산 필요.
                // 여기서는 페이지 내 순번으로 간단히 처리합니다.

                setNoticesToDisplay(mappedNotices);
                setTotalPages(data.totalPages);
                setTotalElements(data.totalElements); // 선택적: 총 게시물 수 상태 업데이트

            } catch (error) {
                console.error("Error fetching notices:", error);
                setModalProps({
                    title: "오류 발생",
                    message: error.message || "공지사항을 불러오는 중 문제가 발생했습니다.\n잠시 후 다시 시도해주세요.",
                    confirmText: "확인",
                    type: "error",
                    confirmButtonType: 'blackButton',
                    onConfirm: () => setIsModalOpen(false)
                });
                setIsModalOpen(true);
                setNoticesToDisplay([]); // 오류 발생 시 목록 비우기
                setTotalPages(0);
            }
        };

        fetchNoticesFromAPI();
    }, [currentPage]); // currentPage가 변경될 때마다 API 다시 호출

    // currentDisplayedNotices는 이제 noticesToDisplay 상태를 직접 사용합니다.
    // const indexOfLastNotice = currentPage * itemsPerPage;
    // const indexOfFirstNotice = indexOfLastNotice - itemsPerPage;
    // const currentDisplayedNotices = noticesToDisplay.slice(indexOfFirstNotice, indexOfLastNotice);
    // 위 로직은 API가 이미 현재 페이지에 맞는 데이터를 주므로 불필요해집니다.

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber); // 이 변경이 useEffect를 트리거하여 API를 다시 호출
    };

    const handleRowClick = (noticeId) => {
        // noticeId는 이제 백엔드의 실제 notice_id (Integer) 입니다.
        // generateInitialNotices에서 생성하던 'sticky-0' 같은 문자열 ID가 아닙니다.
        navigate(`/noticeDetail/${noticeId}`);
    };

    return (
        <>
            <div className={noticeStyle.background}>
                {/* ... (기존 JSX 구조 유지) ... */}
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
                            {/* noticesToDisplay를 사용하여 목록 렌더링 */}
                            {noticesToDisplay.length > 0 ? (
                                noticesToDisplay.map(notice => (
                                    <tr
                                        key={notice.id} // 실제 noticeId 사용
                                        className={notice.isImportant ? noticeStyle.important : ''}
                                        onClick={() => handleRowClick(notice.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td>
                                            {notice.isImportant ? (
                                                <span className={noticeStyle.importantTag}>중요</span>
                                            ) : (
                                                notice.no // 일반 공지 번호
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

                    {/* Pagination 컴포넌트에 totalPages와 currentPage를 props로 전달 */}
                    {totalPages > 1 && !isModalOpen && (
                        <div className={noticeStyle.paginationWrapper}>
                            <Pagination
                                currentPage={currentPage} // UI 기준 현재 페이지 (1부터 시작)
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