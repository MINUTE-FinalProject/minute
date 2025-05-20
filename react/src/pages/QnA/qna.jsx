// src/pages/QnA/qna.js (또는 해당 파일의 실제 경로)
import { useEffect, useState } from 'react'; // React import 추가
import { Link, useNavigate } from 'react-router-dom';
import searchButtonIcon from "../../assets/images/search_icon.png";
import Modal from '../../components/Modal/Modal'; // Modal 컴포넌트 import
import MypageNav from '../../components/MypageNavBar/MypageNav';
import Pagination from "../../components/Pagination/Pagination";
import qnaStyle from "./qna.module.css";

const LOGGED_IN_USER_AUTHOR_NAME = '김*진';

const generateInitialQnaData = (count = 25) => {
    // ... (기존 generateInitialQnaData 함수 내용 유지)
    const items = [];
    const statuses = ['완료', '대기'];
    const authors = ['김*진', '이*서', '박*훈', '최*아', '정*원', '김*진', '정*원']; 
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
        const MOCK_API_QNA_LIST_SHOULD_FAIL = false; // 이 값을 true로 바꾸면 에러 모달 테스트 가능

        const fetchQnaData = async () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (MOCK_API_QNA_LIST_SHOULD_FAIL) {
                        reject(new Error("서버에서 문의 목록을 불러오는 데 실패했습니다."));
                    } else {
                        const loadedQnaData = generateInitialQnaData();
                        resolve(loadedQnaData);
                    }
                }, 500); // 0.5초 딜레이
            });
        };

        fetchQnaData()
            .then(loadedQnaData => {
                setAllQnaItems(loadedQnaData);
                // 초기 필터링 (내 문의만)은 allQnaItems 설정 후 다른 useEffect에서 처리되거나 여기서 바로 처리
                const myInquiries = loadedQnaData.filter(item => item.author === LOGGED_IN_USER_AUTHOR_NAME);
                setQnaToDisplay(myInquiries); // 필터된 데이터로 qnaToDisplay 설정
            })
            .catch(error => {
                console.error("Error fetching Q&A data:", error);
                setModalProps({
                    title: "오류 발생",
                    message: error.message || "문의 목록을 불러오는 중 문제가 발생했습니다.\n잠시 후 다시 시도해주세요.",
                    confirmText: "확인",
                    type: "error", 
                    confirmButtonType: 'blackButton', // 사용자용 에러 모달 확인 버튼은 검정색
                    onConfirm: () => { /* 필요시 특정 동작, 예: 메인 페이지로 이동 navigate('/') */ }
                });
                setIsModalOpen(true);
                setQnaToDisplay([]); // 에러 발생 시 빈 목록 표시
            });
    }, []); // 마운트 시 한 번만 실행

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

    const handleRowClick = (qnaId) => {
        navigate(`/qnaDetail/${qnaId}`); 
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

                        <div className={qnaStyle.searchbar}>
                            <input type="date" className={qnaStyle.dateFilter} />
                            <span className={qnaStyle.dateSeparator}>~</span> 
                            <input type="date" className={qnaStyle.dateFilter} />
                            <select className={qnaStyle.statusSelect}>
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
                                        <tr key={qna.id} onClick={() => handleRowClick(qna.id)} className={qnaStyle.clickableRow}>
                                            <td>
                                                <span
                                                    className={`${qnaStyle.statusBadge} ${qna.status === '완료' ? qnaStyle.completed : qnaStyle.pending}`}
                                                >
                                                    {qna.status}
                                                </span>
                                            </td>
                                            <td>{qna.author}</td>
                                            <td className={qnaStyle.tableTitleCell}>
                                                <Link 
                                                    to={`/qnaDetail/${qna.id}`} 
                                                    className={qnaStyle.titleLink}
                                                    onClick={(e) => e.stopPropagation()} 
                                                >
                                                    {qna.title}
                                                </Link>
                                            </td>
                                            <td>{qna.date}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">
                                            {isModalOpen ? "오류로 인해 내용을 표시할 수 없습니다." : "등록된 문의사항이 없습니다."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className={qnaStyle.bottomControls}>
                            <div className={qnaStyle.paginationContainerInBottomControls}>
                                {/* 모달이 열려있지 않고, 페이지가 있을 때만 페이지네이션 표시 */}
                                {!isModalOpen && totalPages > 1 && qnaToDisplay.length > 0 && (
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
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                {...modalProps}
            />
        </>
    );
}

export default Qna;