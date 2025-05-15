import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import searchButtonIcon from "../../assets/images/search_icon.png";
import styles from './ReportedPosts.module.css';

// Pagination 컴포넌트 임포트
import Pagination from '../../components/Pagination/Pagination';

// 예시 데이터 생성 함수 (더 많은 데이터로 페이지네이션 테스트 용이하게)
const generateInitialReportedItems = (count = 45) => { // 45개의 목업 데이터 생성
    const items = [];
    const postTypes = ['게시글', '댓글'];
    const userNicknames = ['여행가고파', '맛집킬러', '정의의사도', '친구찾기', '새로운유저', '익명123'];
    const hiddenStatuses = ['공개', '숨김'];
    for (let i = 0; i < count; i++) {
        const postType = postTypes[i % postTypes.length];
        items.push({
            id: i + 1, // 신고 항목 자체의 고유 ID
            postType: postType,
            originalPostId: `${postType === '게시글' ? 'fp' : 'fc'}${100 + i}`, // 원본 게시글/댓글 ID
            titleOrContentSnippet: `${postType} 내용 ${i + 1} - ${i % 3 === 0 ? '약간 긴 내용으로 테스트합니다. 잘리는지 확인해보세요.' : '짧은 내용.'} (신고 사유: ${i % 4 === 0 ? '욕설' : (i % 4 === 1 ? '광고' : '비방')})`,
            authorId: `user${String.fromCharCode(65 + (i % 10))}${i}`, // 사용자 ID
            authorNickname: userNicknames[i % userNicknames.length],
            reportCount: Math.floor(Math.random() * 10) + 1,
            originalPostDate: `2025.05.${String(25 - (i % 25)).padStart(2, '0')}`,
            hiddenStatus: hiddenStatuses[i % hiddenStatuses.length],
        });
    }
    return items;
};


// 숨김 상태에 따른 스타일을 위한 헬퍼 함수 (기존 코드 유지)
const getHiddenStatusStyle = (status) => {
    if (status === '숨김') {
        return styles.statusHidden;
    }
    return styles.statusPublic;
};

function ReportedPosts() {
    const [allReportedItems, setAllReportedItems] = useState([]); // 필터링 전 원본 데이터
    const [filteredReportedItems, setFilteredReportedItems] = useState([]); // 필터링 후 데이터 (페이지네이션 대상)
    
    const [activeContentTypeTab, setActiveContentTypeTab] = useState('post'); 

    // --- 페이지네이션 상태 ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // 페이지 당 보여줄 항목 수

    // 데이터 초기 로드
    useEffect(() => {
        setAllReportedItems(generateInitialReportedItems());
    }, []);

    // 필터링 로직 (탭 변경 또는 원본 데이터 변경 시 실행)
    useEffect(() => {
        let itemsToFilter = allReportedItems;
        
        if (activeContentTypeTab === 'post') {
            itemsToFilter = allReportedItems.filter(item => item.postType === '게시글');
        } else if (activeContentTypeTab === 'comment') {
            itemsToFilter = allReportedItems.filter(item => item.postType === '댓글');
        }
        // TODO: 여기에 날짜, 숨김상태, 검색어 등 다른 필터 로직 추가
        setFilteredReportedItems(itemsToFilter);
        setCurrentPage(1); // 필터 변경 시 항상 1페이지로 리셋
    }, [activeContentTypeTab, allReportedItems]);


    const toggleHiddenStatus = (reportId) => {
        // allReportedItems에서 상태 변경 (이것이 filteredReportedItems에 반영됨)
        setAllReportedItems(prevItems =>
            prevItems.map(item =>
                item.id === reportId ? { ...item, hiddenStatus: item.hiddenStatus === '공개' ? '숨김' : '공개' } : item
            )
        );
        // TODO: API로 서버에 상태 업데이트
    };
    
    // --- 페이지네이션 로직 ---
    const totalPages = Math.ceil(filteredReportedItems.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDisplayedItems = filteredReportedItems.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>

            <div className={styles.container}>

                <main className={styles.reportedPostsContent}>
                    <h1 className={styles.pageTitle}>신고된 게시물 관리</h1>

                    <div className={styles.tabContainer}>
                        <button
                            className={`${styles.tabButton} ${activeContentTypeTab === 'post' ? styles.activeTab : ''}`}
                            onClick={() => setActiveContentTypeTab('post')}
                        >
                            게시글
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeContentTypeTab === 'comment' ? styles.activeTab : ''}`}
                            onClick={() => setActiveContentTypeTab('comment')}
                        >
                            댓글
                        </button>
                    </div>
                    
                 <div className={styles.filterBar}>
                                            <input type="date" className={styles.filterElement} />
                                            <span className={styles.dateSeparator}>~</span>
                                            <input type="date" className={styles.filterElement} />
                                            <select className={styles.filterElement}>
                                                <option value="all">상태 (전체)</option>
                                                <option value="answered">답변완료</option>
                                                <option value="unanswered">미답변</option>
                                            </select>
                                            <input type="text" placeholder="검색어를 입력하세요" className={`${styles.filterElement} ${styles.filterSearchInput}`} />
                                            <button type="button" className={styles.filterSearchButton}>
                                                <img src={searchButtonIcon} alt="검색" className={styles.searchIcon} />
                                            </button>
                                        </div>

                    <table className={styles.reportsTable}>
                        <thead>
                            <tr>
                                <th>No</th> {/* 페이지네이션 적용 시 NO는 현재 페이지 내의 순번 or 전체 목록에서의 순번 */}
                                <th>신고횟수</th>
                                <th>ID</th>
                                <th>닉네임</th>
                                <th className={styles.titleColumn}>제목/내용(일부)</th>
                                <th>작성일</th>
                                <th>숨김상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDisplayedItems.length > 0 ? (
                                currentDisplayedItems.map((item, index) => ( // index를 사용하여 NO 계산 가능
                                    <tr key={item.id}>
                                        <td>{indexOfFirstItem + index + 1}</td> {/* 현재 페이지 내 NO */}
                                        <td>{item.reportCount}</td>
                                        <td>{item.authorId}</td>
                                        <td>{item.authorNickname}</td>
                                        <td className={styles.contentSnippetCell}>
                                            <Link 
                                                to={`/admin/${item.postType === '게시글' ? 'freeboard' : 'qna'}/${item.originalPostId}`} // 관리자용 상세 페이지 경로로 수정
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                title="원본 콘텐츠 상세 보기 (관리자용)"
                                                className={styles.contentLink}
                                            >
                                                {item.titleOrContentSnippet.length > 25 ? `${item.titleOrContentSnippet.substring(0, 25)}...` : item.titleOrContentSnippet}
                                            </Link>
                                        </td>
                                        <td>{item.originalPostDate}</td>
                                        <td>
                                            <button 
                                                onClick={() => toggleHiddenStatus(item.id)} 
                                                className={`${styles.statusButton} ${getHiddenStatusStyle(item.hiddenStatus)}`}
                                                title={`${item.hiddenStatus} 상태 (클릭하여 변경)`}
                                            >
                                                {item.hiddenStatus}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">표시할 신고된 항목이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    
                    {/* 페이지네이션 컴포넌트 적용 */}
                    <div className={styles.pagination}>
                        {totalPages > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}

export default ReportedPosts;