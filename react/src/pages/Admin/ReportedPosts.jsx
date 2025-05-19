// ReportedPosts.jsx (AdminLayout 사용에 맞게 수정)
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import searchButtonIcon from "../../assets/images/search_icon.png";
import Pagination from '../../components/Pagination/Pagination';
import styles from './ReportedPosts.module.css';

// !!! AdminLayout을 사용하므로 Header, Sidebar 직접 임포트 및 사용 안 함 !!!
// import Header from '../../components/Header/Header';
// import Sidebar from '../../components/Sidebar/Sidebar';

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
        setAllReportedItems(generateInitialReportedItems());
    }, []);

    useEffect(() => {
        let itemsToFilter = [...allReportedItems];
        if (activeContentTypeTab === 'post') { itemsToFilter = itemsToFilter.filter(item => item.postType === '게시글'); }
        else if (activeContentTypeTab === 'comment') { itemsToFilter = itemsToFilter.filter(item => item.postType === '댓글');}
        if (dateRange.start && dateRange.end) { /* 날짜 필터 로직 (주석 참고) */ }
        if (hideFilter !== 'all') { itemsToFilter = itemsToFilter.filter(item => item.hiddenStatus === hideFilter); }
        if (searchTerm.trim() !== '') {
            const lowercasedFilter = searchTerm.toLowerCase();
            itemsToFilter = itemsToFilter.filter(item =>
                item.authorId.toLowerCase().includes(lowercasedFilter) ||
                item.authorNickname.toLowerCase().includes(lowercasedFilter) ||
                item.titleOrContentSnippet.toLowerCase().includes(lowercasedFilter)
            );
        }
        setFilteredReportedItems(itemsToFilter);
        setCurrentPage(1);
    }, [activeContentTypeTab, allReportedItems, dateRange, hideFilter, searchTerm]);

    const toggleHiddenStatus = (reportId) => {
        setAllReportedItems(prevItems =>
            prevItems.map(item =>
                item.id === reportId
                    ? { ...item, hiddenStatus: item.hiddenStatus === '공개' ? '숨김' : '공개' }
                    : item
            )
        );
    };

    const totalPages = Math.ceil(filteredReportedItems.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDisplayedItems = filteredReportedItems.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChange = (pageNumber) => { setCurrentPage(pageNumber); };

    const handleRowClick = (item) => {
        navigate(`/admin/managerFreeboardDetail/${item.originalPostId}`);
    };

    // AdminLayout의 <PageContentOutlet /> 으로 렌더링될 내용입니다.
    // <Header />, <Sidebar />, <div className={styles.container}> 제거
    return (
        <main className={styles.reportedPostsContentCard}> {/* CSS 클래스명 변경 또는 기존 클래스 스타일 조정 */}
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
    );
}

export default ReportedPosts;