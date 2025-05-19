import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from "../../components/Pagination/Pagination";
import qnaStyle from "./qna.module.css";

import searchButtonIcon from "../../assets/images/search_icon.png";
import MypageNav from '../../components/MypageNavBar/MypageNav';

// 예시: 현재 로그인한 사용자 이름 (실제 앱에서는 로그인 정보에서 가져옵니다)
const LOGGED_IN_USER_AUTHOR_NAME = '김*진';

const generateInitialQnaData = (count = 25) => {
    const items = [];
    const statuses = ['완료', '대기'];
    const authors = ['김*진', '이*서', '박*훈', '최*아', '정*원', '김*진', '정*원']; // '김*진' 추가하여 테스트 용이하게
    for (let i = 0; i < count; i++) {
        items.push({
            id: `qna-${i + 1}`,
            status: statuses[i % statuses.length],
            author: authors[i % authors.length],
            title: `문의사항 ${i + 1}: ${i % 3 === 0 ? '결제 관련 문의입니다.' : (i % 3 === 1 ? '서비스 이용 중 궁금한 점이 있습니다.' : '기타 문의 드립니다.')}`,
            date: `25.04.${String(28 - (i % 28)).padStart(2, '0')}`,
        });
    }
    return items;
};

function Qna() {
    const [allQnaItems, setAllQnaItems] = useState([]); // 모든 QnA 데이터 (원본)
    const [qnaToDisplay, setQnaToDisplay] = useState([]); // 화면에 실제로 표시될 QnA (필터링된)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const loadedQnaData = generateInitialQnaData();
        setAllQnaItems(loadedQnaData);

        // === 본인 문의만 필터링 ===
        const myInquiries = loadedQnaData.filter(item => item.author === LOGGED_IN_USER_AUTHOR_NAME);
        setQnaToDisplay(myInquiries);
        // =======================

    }, []); // 마운트 시 한 번만 실행

    useEffect(() => {
        if (qnaToDisplay.length > 0) {
            const calculatedTotalPages = Math.ceil(qnaToDisplay.length / itemsPerPage);
            setTotalPages(calculatedTotalPages);
            // 현재 페이지가 전체 페이지 수보다 크면 1페이지로 (데이터가 줄었을 경우)
            if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
                setCurrentPage(1);
            } else if (calculatedTotalPages === 0 && qnaToDisplay.length === 0) { // 데이터가 없을 경우
                setCurrentPage(1);
                setTotalPages(1); // 최소 1페이지
            }
        } else { // 표시할 데이터가 없을 경우
            setTotalPages(1);
            setCurrentPage(1);
        }
    }, [qnaToDisplay, itemsPerPage, currentPage]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDisplayedQnaItems = qnaToDisplay.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // TODO: 검색 및 날짜/상태 필터링 로직 추가 시, allQnaItems를 기준으로 필터링한 후
    // 그 결과에서 다시 LOGGED_IN_USER_AUTHOR_NAME으로 필터링하거나,
    // LOGGED_IN_USER_AUTHOR_NAME으로 먼저 필터링된 목록(myInquiries)을 기준으로 추가 필터링합니다.
    // 예: const handleSearch = () => {
    // let filtered = allQnaItems.filter(item => item.author === LOGGED_IN_USER_AUTHOR_NAME);
    // if (searchTerm) {
    // filtered = filtered.filter(item => item.title.includes(searchTerm));
    // }
    // setQnaToDisplay(filtered);
    // }

    return (
        <>
            <MypageNav />
            <div className={qnaStyle.layout}>
                <div className={qnaStyle.container}>
                    <div className={qnaStyle.inner}>
                        <div className={qnaStyle.title}>
                            <Link to="/qna" className={qnaStyle.pageTitleLink}>
                                <h1>Q&A</h1>
                            </Link>
                        </div>

                        <div className={qnaStyle.searchbar}>
                            <input type="date" className={qnaStyle.dateFilter} />
                            <input type="date" className={qnaStyle.dateFilter} />
                            <select>
                                <option value="">상태 (전체)</option>
                                <option value="completed">완료</option>
                                <option value="pending">대기</option>
                            </select>
                            <div className={qnaStyle.searchInputGroup}>
                                <input
                                    type="text"
                                    placeholder="검색어를 입력하세요"
                                    className={qnaStyle.searchInput}
                                />
                                <button type="button" className={qnaStyle.searchBtn}>
                                    <img
                                        src={searchButtonIcon}
                                        alt="검색"
                                        className={qnaStyle.searchIcon}
                                    />
                                </button>
                            </div>
                        </div>

                        <table className={qnaStyle.table}>
                            <thead>
                                <tr>
                                    <th>상태</th>
                                    <th>작성자</th>
                                    <th>제목</th>
                                    <th>날짜</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentDisplayedQnaItems.length > 0 ? (
                                    currentDisplayedQnaItems.map(qna => (
                                        <tr key={qna.id}>
                                            <td>
                                                <span
                                                    className={`${qnaStyle.statusBadge} ${qna.status === '완료' ? qnaStyle.completed : qnaStyle.pending}`}
                                                >
                                                    {qna.status}
                                                </span>
                                            </td>
                                            <td>{qna.author}</td>
                                            <td className={qnaStyle.tableTitleCell}>
                                                <Link to={`/qnaDetail/${qna.id}`} className={qnaStyle.titleLink}> {/* 상세 페이지 경로 수정 */}
                                                    {qna.title}
                                                </Link>
                                            </td>
                                            <td>{qna.date}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">등록된 문의사항이 없습니다.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className={qnaStyle.bottomControls}>
                            <div className={qnaStyle.paginationContainerInBottomControls}>
                                {totalPages > 1 && ( // totalPages가 1보다 클 때만 페이지네이션 표시
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                )}
                            </div>
                            <div className={qnaStyle.writeButtonContainerInBottomControls}>
                                <Link to="/qnaWrite" className={qnaStyle.writeButton}>
                                    작성
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Qna;