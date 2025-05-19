// ReportedPosts.jsx (기존 컬럼 순서 유지, "신고 누적 횟수"만 정확한 위치에 추가)
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import searchButtonIcon from "../../assets/images/search_icon.png"; // 실제 경로로 수정해주세요.
import Pagination from '../../components/Pagination/Pagination'; // 실제 경로로 수정해주세요.
import styles from './ReportedPosts.module.css'; // 실제 경로로 수정해주세요.

const generateInitialReportedItems = (count = 45) => {
    const items = [];
    const postTypes = ['게시글', '댓글'];
    const userNicknames = ['여행가고파', '맛집킬러', '정의의사도', '친구찾기', '새로운유저', '익명123'];
    const hiddenStatuses = ['공개', '숨김'];
    for (let i = 0; i < count; i++) {
        const postType = postTypes[i % postTypes.length];
        items.push({
            id: `reportItem-${i + 1}`,
            postType: postType,
            originalPostId: `${postType === '게시글' ? 'fp' : 'fc'}${100 + i}`,
            titleOrContentSnippet: `${postType} 내용 ${i + 1} - ${i % 3 === 0 ? '약간 긴 내용으로 테스트합니다. 잘리는지 확인해보세요.' : '짧은 내용.'} (신고 사유: ${i % 4 === 0 ? '욕설' : (i % 4 === 1 ? '광고' : '비방')})`,
            authorId: `user${String.fromCharCode(65 + (i % 10))}${i}`,
            authorNickname: userNicknames[i % userNicknames.length],
            originalPostDate: `2025.0${(i % 6) + 1}.${String(25 - (i % 25) + 1).padStart(2, '0')}`,
            reportCount: Math.floor(Math.random() * 10) + (i % 7 === 0 ? 5 : 0), // <<< 신고 누적 횟수 필드 (데이터에 이미 있었던 것으로 보임, 없었다면 추가)
            hiddenStatus: hiddenStatuses[i % hiddenStatuses.length],
        });
    }
    return items;
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
        // 목업 데이터에 reportCount가 없다면 여기서 추가하거나 generateInitialReportedItems에서 추가
        const initialItems = generateInitialReportedItems().map(item => ({
            ...item,
            reportCount: item.reportCount === undefined ? (Math.floor(Math.random() * 5) + (item.id.endsWith_seed % 3 === 0 ? 3:0) ) : item.reportCount // 예시 값
        }));
        setAllReportedItems(initialItems);
    }, []);

    useEffect(() => {
        let itemsToFilter = [...allReportedItems];

        if (activeContentTypeTab === 'post') {
            itemsToFilter = itemsToFilter.filter(item => item.postType === '게시글');
        } else if (activeContentTypeTab === 'comment') {
            itemsToFilter = itemsToFilter.filter(item => item.postType === '댓글');
        }
        // 날짜 필터 로직 (주석 유지)
        // if (dateRange.start && dateRange.end) { ... }

        if (hideFilter !== 'all') {
            itemsToFilter = itemsToFilter.filter(item => item.hiddenStatus === hideFilter);
        }

        if (searchTerm.trim() !== '') {
            const lowercasedFilter = searchTerm.toLowerCase();
            itemsToFilter = itemsToFilter.filter(item =>
                item.authorId.toLowerCase().includes(lowercasedFilter) ||
                item.authorNickname.toLowerCase().includes(lowercasedFilter) ||
                item.titleOrContentSnippet.toLowerCase().includes(lowercasedFilter)
                // 검색어 필터에 postType은 포함하지 않음 (원래 코드 기준)
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

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRowClick = (item) => {
        // 상세 페이지 이동 시 originalPostId 사용
        navigate(`/admin/managerFreeboardDetail/${item.originalPostId}${item.postType === '댓글' ? `?commentFocusId=${item.id}`: ''}`);
    };

    return (
        <div className={styles.container}>
            <main className={styles.reportedPostsContentCard}>
                <h1 className={styles.pageTitle}>신고된 게시물 관리</h1>

                <div className={styles.tabContainer}>
                    <button className={`${styles.tabButton} ${activeContentTypeTab === 'all' ? styles.activeTab : ''}`} onClick={() => setActiveContentTypeTab('all')}>전체</button>
                    <button className={`${styles.tabButton} ${activeContentTypeTab === 'post' ? styles.activeTab : ''}`} onClick={() => setActiveContentTypeTab('post')}>게시글</button>
                    <button className={`${styles.tabButton} ${activeContentTypeTab === 'comment' ? styles.activeTab : ''}`} onClick={() => setActiveContentTypeTab('comment')}>댓글</button>
                </div>

                <div className={styles.filterBar}>
                    <input type="date" className={styles.filterElement} value={dateRange.start} onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}/>
                    <span className={styles.dateSeparator}>~</span>
                    <input type="date" className={styles.filterElement} value={dateRange.end} onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}/>
                    <select className={`${styles.filterElement} ${styles.filterSelect}`} value={hideFilter} onChange={(e) => setHideFilter(e.target.value)}>
                        <option value="all">숨김상태 (전체)</option>
                        <option value="공개">공개</option>
                        <option value="숨김">숨김</option>
                    </select>
                    <input type="text" placeholder="ID, 닉네임, 내용 검색" className={`${styles.filterElement} ${styles.filterSearchInput}`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                    <button type="button" className={styles.filterSearchButton}><img src={searchButtonIcon} alt="검색" className={styles.searchIcon} /></button>
                </div>

                <table className={styles.reportsTable}>
                    <thead>
                        <tr>
                            <th>NO</th>
                            <th>ID</th>
                            <th>닉네임</th>
                            <th className={styles.titleColumn}>제목/내용일부</th> {/* (신고 사유)는 titleOrContentSnippet에 포함되어 있음 */}
                            <th>작성일</th>
                            <th>누적횟수</th> {/* <<< "작성일"과 "숨김상태" 사이에 추가된 컬럼 */}
                            <th>숨김상태</th>
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
                                        {item.titleOrContentSnippet.length > 30 // 원래 30이었음
                                            ? `${item.titleOrContentSnippet.substring(0, 30)}...`
                                            : item.titleOrContentSnippet}
                                    </td>
                                    <td>{item.originalPostDate}</td>
                                    <td>{item.reportCount}</td> {/* <<< 신고 누적 횟수 데이터 표시 */}
                                    <td>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleHiddenStatus(item.id);
                                            }}
                                            className={`${styles.status} ${item.hiddenStatus === '공개' ? styles.activeStatus : styles.inactiveStatus}`}
                                            title={`${item.hiddenStatus} 상태 (클릭하여 변경)`}
                                        >
                                            {item.hiddenStatus}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">표시할 신고된 항목이 없습니다.</td> {/* 컬럼 7개에 맞게 colSpan 수정 */}
                            </tr>
                        )}
                    </tbody>
                </table>

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
    );
}

export default ReportedPosts;