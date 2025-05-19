// ReportedPosts.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import searchButtonIcon from "../../assets/images/search_icon.png";
import Pagination from '../../components/Pagination/Pagination';
import styles from './ReportedPosts.module.css';

// Header 및 Sidebar 임포트 (AdminLayout을 사용하지 않는 경우 필요)
// AdminLayout을 사용하신다면 이 부분은 주석 처리하거나 삭제합니다.
import Header from '../../components/Header/Header'; // 경로를 실제 프로젝트에 맞게 수정하세요.
import Sidebar from '../../components/Sidebar/Sidebar'; // 경로를 실제 프로젝트에 맞게 수정하세요.


// generateInitialReportedItems 함수 (이전 제공된 버전과 동일하다고 가정)
const generateInitialReportedItems = (count = 45) => {
    const items = []; const postTypes = ['게시글', '댓글']; const userNicknames = ['여행가고파', '맛집킬러', '정의의사도', '친구찾기', '새로운유저', '익명123']; const hiddenStatuses = ['공개', '숨김'];
    for (let i = 0; i < count; i++) {
        const postType = postTypes[i % postTypes.length];
        items.push({
            id: `reportItem-${i + 1}`, postType: postType, originalPostId: `${postType === '게시글' ? 'fp' : 'fc'}${100 + i}`,
            titleOrContentSnippet: `${postType} 내용 ${i + 1} - ${i % 3 === 0 ? '약간 긴 내용으로 테스트합니다. 잘리는지 확인해보세요.' : '짧은 내용.'} (신고 사유: ${i % 4 === 0 ? '욕설' : (i % 4 === 1 ? '광고' : '비방')})`,
            authorId: `user${String.fromCharCode(65 + (i % 10))}${i}`, authorNickname: userNicknames[i % userNicknames.length],
            originalPostDate: `2025.0${(i % 6) + 1}.${String(25 - (i % 25) + 1).padStart(2, '0')}`, hiddenStatus: hiddenStatuses[i % hiddenStatuses.length],
        });
    } return items;
};


function ReportedPosts() {
    const navigate = useNavigate();
    const [allReportedItems, setAllReportedItems] = useState([]);
    const [filteredReportedItems, setFilteredReportedItems] = useState([]);
    const [activeContentTypeTab, setActiveContentTypeTab] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [hideFilter, setHideFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        // 데이터 로드
        setAllReportedItems(generateInitialReportedItems());
    }, []);

    useEffect(() => {
        // 필터링 로직
        let itemsToFilter = [...allReportedItems]; // 원본 배열을 복사하여 사용

        if (activeContentTypeTab === 'post') {
            itemsToFilter = itemsToFilter.filter(item => item.postType === '게시글');
        } else if (activeContentTypeTab === 'comment') {
            itemsToFilter = itemsToFilter.filter(item => item.postType === '댓글');
        }

        // 날짜 범위 필터 (실제 날짜 비교 로직 필요)
        if (dateRange.start && dateRange.end) {
            itemsToFilter = itemsToFilter.filter(item => {
                // item.originalPostDate를 실제 Date 객체로 변환하여 비교해야 합니다.
                // 예시: return new Date(item.originalPostDate) >= new Date(dateRange.start) && new Date(item.originalPostDate) <= new Date(dateRange.end);
                // 단순 문자열 비교는 정확하지 않을 수 있으므로, 날짜 형식에 맞춰 파싱 및 비교 로직을 구현해야 합니다.
                // 여기서는 예시로 남겨둡니다.
                return true; // 실제 날짜 필터 로직으로 교체 필요
            });
        }

        if (hideFilter !== 'all') {
            itemsToFilter = itemsToFilter.filter(item => item.hiddenStatus === hideFilter);
        }

        if (searchTerm.trim() !== '') {
            const lowercasedFilter = searchTerm.toLowerCase();
            itemsToFilter = itemsToFilter.filter(item =>
                item.authorId.toLowerCase().includes(lowercasedFilter) ||
                item.authorNickname.toLowerCase().includes(lowercasedFilter) ||
                item.titleOrContentSnippet.toLowerCase().includes(lowercasedFilter)
            );
        }

        setFilteredReportedItems(itemsToFilter);
        setCurrentPage(1); // 필터 변경 시 1페이지로
    }, [activeContentTypeTab, allReportedItems, dateRange, hideFilter, searchTerm]);

    // === toggleHiddenStatus 함수 수정 ===
    const toggleHiddenStatus = (reportId) => {
        setAllReportedItems(prevItems =>
            prevItems.map(item =>
                item.id === reportId
                    ? { ...item, hiddenStatus: item.hiddenStatus === '공개' ? '숨김' : '공개' }
                    : item
            )
        );
        // filteredReportedItems는 allReportedItems가 변경되면 useEffect에 의해 자동으로 업데이트됩니다.
    };
    // === 수정 끝 ===

    const totalPages = Math.ceil(filteredReportedItems.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDisplayedItems = filteredReportedItems.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChange = (pageNumber) => { setCurrentPage(pageNumber); };

    const handleRowClick = (item) => {
        navigate(`/admin/managerFreeboardDetail/${item.originalPostId}`); // 페이지명 확인 필요 (managerFreeboardDetail or freeboardDetail 등)
    };

    // AdminLayout 사용 여부에 따라 JSX 구조 선택
    // const isAdminLayoutUsed = true; // 또는 false
    // 아래 return 문은 AdminLayout을 사용하지 않는 경우를 가정하고 Header/Sidebar를 포함합니다.
    // AdminLayout을 사용한다면, <Header />와 <Sidebar /> 및 <div className={styles.container}>를 제거하고
    // <main className={styles.reportedPostsContentCard}> (새로운 CSS 클래스 또는 기존 클래스 조정) 로 시작해야 합니다.
    // 아래는 AdminLayout을 사용하지 않고, 각 페이지가 Header/Sidebar를 가지는 구조입니다.

    return (
        <>
            <Header /> {/* AdminLayout 미사용 시 */}
            <div className={styles.container}> {/* AdminLayout 미사용 시 */}
                <Sidebar /> {/* AdminLayout 미사용 시 */}
                <main className={styles.reportedPostsContent}> {/* AdminLayout 미사용 시 이 클래스명 사용, 사용 시엔 카드 스타일 클래스로 변경 */}
                    <h1 className={styles.pageTitle}>신고된 게시물 관리</h1>
                    <div className={styles.tabContainer}>
                        <button className={`${styles.tabButton} ${activeContentTypeTab === 'all' ? styles.activeTab : ''}`} onClick={() => setActiveContentTypeTab('all')}>전체</button>
                        <button className={`${styles.tabButton} ${activeContentTypeTab === 'post' ? styles.activeTab : ''}`} onClick={() => setActiveContentTypeTab('post')}>게시글</button>
                        <button className={`${styles.tabButton} ${activeContentTypeTab === 'comment' ? styles.activeTab : ''}`} onClick={() => setActiveContentTypeTab('comment')}>댓글</button>
                    </div>
                    <div className={styles.filterBar}>
                        <input type="date" className={styles.filterElement} value={dateRange.start} onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))} />
                        <span className={styles.dateSeparator}>~</span>
                        <input type="date" className={styles.filterElement} value={dateRange.end} onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))} />
                        <select className={`${styles.filterElement} ${styles.filterSelect}`} value={hideFilter} onChange={(e) => setHideFilter(e.target.value)}>
                            <option value="all">숨김상태 (전체)</option><option value="공개">공개</option><option value="숨김">숨김</option>
                        </select>
                        <input type="text" placeholder="ID, 닉네임, 내용 검색" className={`${styles.filterElement} ${styles.filterSearchInput}`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <button type="button" className={styles.filterSearchButton}><img src={searchButtonIcon} alt="검색" className={styles.searchIcon} /></button>
                    </div>
                    <table className={styles.reportsTable}>
                        <thead>
                            <tr>
                                <th>NO</th><th>ID</th><th>닉네임</th>
                                <th className={styles.titleColumn}>제목/내용일부</th>
                                <th>작성일</th><th>숨김상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDisplayedItems.length > 0 ? (
                                currentDisplayedItems.map((item, index) => (
                                    <tr key={item.id} onClick={() => handleRowClick(item)} className={styles.clickableRow}>
                                        <td>{indexOfFirstItem + index + 1}</td>
                                        <td>{item.authorId}</td>
                                        <td>{item.authorNickname}</td>
                                        <td className={styles.contentSnippetCell}>
                                            {item.titleOrContentSnippet.length > 30 ? `${item.titleOrContentSnippet.substring(0, 30)}...` : item.titleOrContentSnippet}
                                        </td>
                                        <td>{item.originalPostDate}</td>
                                        <td>
                                            <button
                                                onClick={(e) => {e.stopPropagation(); toggleHiddenStatus(item.id);}}
                                                className={`${styles.status} ${item.hiddenStatus === '공개' ? styles.activeStatus : styles.inactiveStatus}`}
                                                title={`${item.hiddenStatus} 상태 (클릭하여 변경)`}
                                            >
                                                {item.hiddenStatus}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (<tr><td colSpan="6">표시할 신고된 항목이 없습니다.</td></tr>)}
                        </tbody>
                    </table>
                    <div className={styles.pagination}>
                        {totalPages > 0 && ( <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/> )}
                    </div>
                </main>
            </div>
        </>
    );
}

export default ReportedPosts;