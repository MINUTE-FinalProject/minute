import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import reportOffIcon from "../../assets/images/able-alarm.png"; // 실제 경로로 수정
import likeOffIcon from "../../assets/images/b_thumbup.png"; // 실제 경로로 수정
import reportOnIcon from "../../assets/images/disable-alarm.png"; // 실제 경로로 수정
import searchButtonIcon from "../../assets/images/search_icon.png"; // 실제 경로로 수정
import likeOnIcon from "../../assets/images/thumbup.png"; // 실제 경로로 수정
import Pagination from '../../components/Pagination/Pagination'; // 실제 경로로 수정
import styles from './ManagerFreeboard.module.css';

const CURRENT_ADMIN_ID = '관리자1';

const generateInitialPosts = (count = 47) => {
    const posts = [];
    const authors = ['관리자1', '사용자A', '사용자B', '관리자2', '사용자C'];
    for (let i = 1; i <= count; i++) {
        posts.push({
            id: i,
            title: `자유게시판 테스트 게시물 ${i}`,
            author: authors[i % authors.length],
            date: `2025.05.${String(10 + (i % 15)).padStart(2, '0')}`,
            views: Math.floor(Math.random() * 500) + 50,
            likes: Math.floor(Math.random() * 100),
            reports: i % 10 === 0 ? Math.floor(Math.random() * 5) + 1 : 0,
            isLikedByManager: i % 4 === 0 && authors[i % authors.length] === CURRENT_ADMIN_ID,
            isReportedBySomeone: i % 10 === 0,
            adminActionedOnReport: i % 10 === 0 && i % 2 === 0, // 신고글 중 일부는 관리자가 조치한 것으로 가정
        });
    }
    return posts;
};

function ManagerFreeboard() {
    const [allPosts, setAllPosts] = useState([]);
    const [postsToDisplay, setPostsToDisplay] = useState([]);

    const [activeTab, setActiveTab] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('latest'); // 정렬 순서 상태 추가 (기본값: 최신순)

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setAllPosts(generateInitialPosts());
    }, []);

    useEffect(() => {
        let processedData = [...allPosts]; // 원본 배열을 복사하여 작업

        if (activeTab === 'myPosts') {
            processedData = processedData.filter(post => post.author === CURRENT_ADMIN_ID);
        }

        if (dateRange.start && dateRange.end) {
            processedData = processedData.filter(post => {
                const postDate = new Date(post.date.replace(/\./g, '-'));
                const startDate = new Date(dateRange.start);
                const endDate = new Date(dateRange.end);
                endDate.setHours(23, 59, 59, 999);
                return postDate >= startDate && postDate <= endDate;
            });
        }

        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            processedData = processedData.filter(post =>
                post.author.toLowerCase().includes(lowerSearchTerm) ||
                post.title.toLowerCase().includes(lowerSearchTerm)
            );
        }

        // 정렬 로직 추가
        if (sortOrder === 'latest') {
            processedData.sort((a, b) => b.id - a.id); // ID 내림차순 (최신순)
        } else if (sortOrder === 'views') {
            processedData.sort((a, b) => b.views - a.views); // 조회수 내림차순
        } else if (sortOrder === 'likes') {
            processedData.sort((a, b) => b.likes - a.likes); // 좋아요수 내림차순
        }

        setPostsToDisplay(processedData);
        setCurrentPage(1);
    }, [allPosts, activeTab, dateRange, searchTerm, sortOrder]); // sortOrder 의존성 배열에 추가

    const handleLikeToggle = (postId) => {
        setAllPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId ? {
                    ...post,
                    isLikedByManager: !post.isLikedByManager,
                    likes: post.isLikedByManager ? post.likes - 1 : post.likes + 1
                } : post
            )
        );
    };

    const handleReportActionToggle = (postId) => {
        setAllPosts(prevPosts =>
            prevPosts.map(post => {
                if (post.id === postId) {
                    const alreadyActioned = post.adminActionedOnReport;
                    return { ...post, adminActionedOnReport: !alreadyActioned };
                }
                return post;
            })
        );
        const targetPost = allPosts.find(p => p.id === postId);
        if(targetPost){
            const message = !targetPost.adminActionedOnReport // 변경될 상태 기준
                ? `게시물 ID ${postId}의 신고에 대해 관리자 조치가 완료되었습니다.`
                : `게시물 ID ${postId}의 신고에 대해 관리자 조치가 해제되었습니다.`;
            alert(message);
        }
    };

    const totalPages = Math.ceil(postsToDisplay.length / itemsPerPage);
    const indexOfLastPost = currentPage * itemsPerPage;
    const indexOfFirstPost = indexOfLastPost - itemsPerPage;
    const currentDisplayedPosts = postsToDisplay.slice(indexOfFirstPost, indexOfLastPost);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className={styles.container}>
                <main className={styles.managerFreeboardContent}>
                    <h1 className={styles.pageTitle}>자유게시판 관리</h1>

                    <div className={styles.tabContainer}>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'all' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            전체 게시물
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'myPosts' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('myPosts')}
                        >
                            내 작성글
                        </button>
                    </div>

                    <div className={styles.filterBar}>
                        <input
                            type="date"
                            className={styles.filterElement}
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        />
                        <span className={styles.dateSeparator}>~</span>
                        <input
                            type="date"
                            className={styles.filterElement}
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        />
                        {/* 정렬 옵션 select 추가 */}
                        <select
                            className={`${styles.filterElement} ${styles.filterSelect}`}
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="latest">최신순</option>
                            <option value="views">조회순</option>
                            <option value="likes">좋아요순</option>
                        </select>
                        <input
                            type="text"
                            placeholder="닉네임, 제목 검색"
                            className={`${styles.filterElement} ${styles.filterSearchInput}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="button" className={styles.filterSearchButton}>
                            <img src={searchButtonIcon} alt="검색" className={styles.searchIcon} />
                        </button>
                    </div>

                    <table className={styles.boardTable} id="boardTableAnchor">
                        <thead>
                            <tr>
                                <th>NO</th>
                                <th>닉네임</th>
                                <th className={styles.titleColumn}>제목/내용일부</th>
                                <th>작성일</th>
                                <th>조회수</th>
                                <th>좋아요수</th>
                                <th>신고버튼</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDisplayedPosts.length > 0 ? (
                                currentDisplayedPosts.map(post => (
                                    <tr key={post.id}>
                                        <td>{post.id}</td>
                                        <td>{post.author}</td>
                                        <td className={styles.postTitleCell}>
                                            <Link to={`/freeboard/${post.id}`} className={styles.titleLink} target="_blank" rel="noopener noreferrer">
                                                {post.title.length > 30 ? `${post.title.substring(0,30)}...` : post.title}
                                            </Link>
                                        </td>
                                        <td>{post.date}</td>
                                        <td>{post.views}</td>
                                        <td>
                                            <button onClick={() => handleLikeToggle(post.id)} className={styles.iconButton} title="관리자 좋아요 토글">
                                                <img
                                                    src={post.isLikedByManager ? likeOnIcon : likeOffIcon}
                                                    alt="좋아요"
                                                    className={styles.buttonIcon}
                                                />
                                            </button>
                                            <span className={styles.countText}>{post.likes}</span>
                                        </td>
                                        <td>
                                            <button onClick={() => handleReportActionToggle(post.id)} className={styles.iconButton} title="신고 확인/조치 토글">
                                                <img
                                                    src={post.isReportedBySomeone ? reportOnIcon : reportOffIcon}
                                                    alt="신고"
                                                    className={`${styles.buttonIcon} ${post.adminActionedOnReport ? styles.reportActioned : ''}`}
                                                />
                                            </button>
                                            {post.reports > 0 && <span className={styles.countText}>{post.reports}</span>}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">표시할 게시물이 없습니다.</td>
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
        </>
    );
}

export default ManagerFreeboard;