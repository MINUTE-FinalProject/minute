import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from "../../components/Pagination/Pagination";
import qnaStyle from "./qna.module.css";

import searchButtonIcon from "../../assets/images/search_icon.png"; // 이 import는 유지합니다.
import MypageNav from '../../components/MypageNavBar/MypageNav';

const generateInitialQnaData = (count = 25) => {
    const items = [];
    const statuses = ['완료', '대기'];
    const authors = ['김*진', '이*서', '박*훈', '최*아', '정*원'];
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
    const [allQnaItems, setAllQnaItems] = useState([]);
    const [qnaToDisplay, setQnaToDisplay] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const loadedQnaData = generateInitialQnaData();
        setAllQnaItems(loadedQnaData);
        setQnaToDisplay(loadedQnaData);
    }, []);

    useEffect(() => {
        if (qnaToDisplay.length > 0) {
            const calculatedTotalPages = Math.ceil(qnaToDisplay.length / itemsPerPage);
            setTotalPages(calculatedTotalPages);
            if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
                setCurrentPage(1);
            } else if (calculatedTotalPages === 0 && qnaToDisplay.length === 0) {
                setCurrentPage(1);
                setTotalPages(1);
            }
        } else {
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

                        {/* --- 필터바 (searchbar) JSX 수정 --- */}
                        <div className={qnaStyle.searchbar}>
                            <input type="date" className={qnaStyle.dateFilter} />
                            <input type="date" className={qnaStyle.dateFilter} />
                            <select> {/* select는 기존대로 유지, CSS에서 스타일 적용 */}
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
                                        src={searchButtonIcon} // Admin 페이지와 동일한 아이콘 사용
                                        alt="검색"
                                        className={qnaStyle.searchIcon}
                                    />
                                </button>
                            </div>
                        </div>
                        {/* --- 필터바 (searchbar) JSX 수정 끝 --- */}

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
                                                <Link to={`/qna/${qna.id}`} className={qnaStyle.titleLink}>
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
                                {totalPages > 1 && (
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