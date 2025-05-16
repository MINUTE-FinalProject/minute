// ManagerFreeboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import reportOffIcon from "../../assets/images/able-alarm.png";
import likeOffIcon from "../../assets/images/b_thumbup.png";
import reportOnIcon from "../../assets/images/disable-alarm.png";
import searchButtonIcon from "../../assets/images/search_icon.png";
import likeOnIcon from "../../assets/images/thumbup.png";
import Pagination from '../../components/Pagination/Pagination';
import styles from './ManagerFreeboard.module.css';

const CURRENT_ADMIN_ID = '관리자1';
// generateInitialPosts 함수는 이전 제공된 버전 사용
const generateInitialPosts = (count = 47) => { /* ... 이전 코드와 동일 ... */
    const posts = []; const authors = ['관리자1', '사용자A', '사용자B', '관리자2', '사용자C'];
    for (let i = 1; i <= count; i++) {
        posts.push({
            id: i, title: `자유게시판 테스트 게시물 ${i}`, author: authors[i % authors.length],
            date: `2025.05.${String(10 + (i % 15)).padStart(2, '0')}`,
            views: Math.floor(Math.random() * 500) + 50, likes: Math.floor(Math.random() * 100),
            reports: i % 10 === 0 ? Math.floor(Math.random() * 5) + 1 : 0,
            isLikedByManager: i % 4 === 0 && authors[i % authors.length] === CURRENT_ADMIN_ID,
            isReportedBySomeone: i % 10 === 0, adminActionedOnReport: i % 10 === 0 && i % 2 === 0,
        });
    } return posts;
};


function ManagerFreeboard() {
    const navigate = useNavigate(); // useNavigate 사용
    const [allPosts, setAllPosts] = useState([]);
    const [postsToDisplay, setPostsToDisplay] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('latest');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => { /* ... (데이터 로드 useEffect) ... */ setAllPosts(generateInitialPosts()); }, []);
    useEffect(() => { /* ... (필터링 및 정렬 useEffect) ... */
        let processedData = [...allPosts];
        // 필터링 (탭, 날짜, 검색어)
        if (activeTab === 'myPosts') { processedData = processedData.filter(post => post.author === CURRENT_ADMIN_ID); }
        if (dateRange.start && dateRange.end) { /* ... */ }
        if (searchTerm) { /* ... */ }
        // 정렬
        if (sortOrder === 'latest') { processedData.sort((a, b) => b.id - a.id); }
        else if (sortOrder === 'views') { processedData.sort((a, b) => b.views - a.views); }
        else if (sortOrder === 'likes') { processedData.sort((a, b) => b.likes - a.likes); }
        setPostsToDisplay(processedData); setCurrentPage(1);
    }, [allPosts, activeTab, dateRange, searchTerm, sortOrder]);

    const handleLikeToggle = (postId) => { /* ... (기존 로직) ... */ };
    const handleReportActionToggle = (postId) => { /* ... (기존 로직) ... */ };
    const totalPages = Math.ceil(postsToDisplay.length / itemsPerPage);
    const indexOfLastPost = currentPage * itemsPerPage;
    const indexOfFirstPost = indexOfLastPost - itemsPerPage;
    const currentDisplayedPosts = postsToDisplay.slice(indexOfFirstPost, indexOfLastPost);
    const handlePageChange = (pageNumber) => { setCurrentPage(pageNumber); };

    // 행 클릭 핸들러
    const handleRowClick = (postId) => {
        navigate(`/admin/managerFreeboardDetail/${postId}`);
    };

    return (
        <>
            <div className={styles.container}>
                <main className={styles.managerFreeboardContent}>
                    <h1 className={styles.pageTitle}>자유게시판 관리</h1>
                    <div className={styles.tabContainer}> {/* ... 탭 버튼들 ... */}
                        <button className={`${styles.tabButton} ${activeTab === 'all' ? styles.activeTab : ''}`} onClick={() => setActiveTab('all')}>전체 게시물</button>
                        <button className={`${styles.tabButton} ${activeTab === 'myPosts' ? styles.activeTab : ''}`} onClick={() => setActiveTab('myPosts')}>내 작성글</button>
                    </div>
                    <div className={styles.filterBar}>
                        {/* ... 필터 요소들 (정렬 select 포함) ... */}
                        <input type="date" className={styles.filterElement} value={dateRange.start} onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}/>
                        <span className={styles.dateSeparator}>~</span>
                        <input type="date" className={styles.filterElement} value={dateRange.end} onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}/>
                        <select className={`${styles.filterElement} ${styles.filterSelect}`} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="latest">최신순</option><option value="views">조회순</option><option value="likes">좋아요순</option>
                        </select>
                        <input type="text" placeholder="닉네임, 제목 검색" className={`${styles.filterElement} ${styles.filterSearchInput}`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                        <button type="button" className={styles.filterSearchButton}><img src={searchButtonIcon} alt="검색" className={styles.searchIcon} /></button>
                    </div>
                    <table className={styles.boardTable} id="boardTableAnchor">
                        <thead>
                            <tr>
                                <th>NO</th><th>닉네임</th>
                                <th className={styles.titleColumn}>제목/내용일부</th>
                                <th>작성일</th><th>조회수</th><th>좋아요수</th><th>신고버튼</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDisplayedPosts.length > 0 ? (
                                currentDisplayedPosts.map(post => (
                                    <tr key={post.id} onClick={() => handleRowClick(post.id)} className={styles.clickableRow}>
                                        <td>{post.id}</td>
                                        <td>{post.author}</td>
                                        <td className={styles.postTitleCell}>
                                            {/* Link 대신 행 전체 클릭 사용, 또는 Link 유지 시 경로 수정 및 stopPropagation */}
                                            {/* <Link to={`/admin/managerFreeboardDetail/${post.id}`} className={styles.titleLink} onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer">
                                                {post.title.length > 30 ? `${post.title.substring(0,30)}...` : post.title}
                                            </Link> */}
                                            {post.title.length > 30 ? `${post.title.substring(0,30)}...` : post.title}
                                        </td>
                                        <td>{post.date}</td>
                                        <td>{post.views}</td>
                                        <td>
                                            <button onClick={(e) => {e.stopPropagation(); handleLikeToggle(post.id);}} className={styles.iconButton} title="관리자 좋아요 토글">
                                                <img src={post.isLikedByManager ? likeOnIcon : likeOffIcon} alt="좋아요" className={styles.buttonIcon}/>
                                            </button>
                                            <span className={styles.countText}>{post.likes}</span>
                                        </td>
                                        <td>
                                            <button onClick={(e) => {e.stopPropagation(); handleReportActionToggle(post.id);}} className={styles.iconButton} title="신고 확인/조치 토글">
                                                <img src={post.isReportedBySomeone ? reportOnIcon : reportOffIcon} alt="신고" className={`${styles.buttonIcon} ${post.adminActionedOnReport ? styles.reportActioned : ''}`}/>
                                            </button>
                                            {post.reports > 0 && <span className={styles.countText}>{post.reports}</span>}
                                        </td>
                                    </tr>
                                ))
                            ) : (<tr><td colSpan="7">표시할 게시물이 없습니다.</td></tr>)}
                        </tbody>
                    </table>
                    <div className={styles.pagination}>
                        {/* ... Pagination ... */}
                        {totalPages > 0 && ( <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/> )}
                    </div>
                </main>
            </div>
        </>
    );
}

export default ManagerFreeboard;