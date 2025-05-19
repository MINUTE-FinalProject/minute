// ManagerFreeboard.jsx (신고 조치 1회만 가능하도록 수정, 신고 버튼 로직 수정)
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reportOffIcon from "../../assets/images/able-alarm.png"; // 아이콘: "사용자 신고 없음, 관리자 조치 가능" 상태
import likeOffIcon from "../../assets/images/b_thumbup.png";
import reportOnIcon from "../../assets/images/disable-alarm.png"; // 아이콘: "사용자 신고 있음" 또는 "관리자 조치 완료" 상태
import searchButtonIcon from "../../assets/images/search_icon.png";
import likeOnIcon from "../../assets/images/thumbup.png";
import Pagination from '../../components/Pagination/Pagination';
import styles from './ManagerFreeboard.module.css';

const CURRENT_ADMIN_ID = '관리자1';

const generateInitialPosts = (count = 47) => {
    const posts = [];
    const authors = ['관리자1', '사용자A', '사용자B', '관리자2', '사용자C'];
    for (let i = 1; i <= count; i++) {
        const isReported = i % 10 === 0; // 사용자 신고 여부
        const isAdminActioned = isReported && i % 5 === 0; // 관리자 조치 여부 (데모를 위해 사용자 신고된 것 중 일부만 조치된 것으로 설정)
        // 관리자가 사용자 신고 없는 게시물을 조치하는 테스트 케이스:
        // const isAdminActioned = (isReported && i % 5 === 0) || (!isReported && i % 7 === 0)

        posts.push({
            id: i,
            title: `자유게시판 테스트 게시물 ${i}`,
            author: authors[i % authors.length],
            date: `2025.05.${String(10 + (i % 15)).padStart(2, '0')}`,
            views: Math.floor(Math.random() * 500) + 50,
            likes: Math.floor(Math.random() * 100),
            reports: isReported ? Math.floor(Math.random() * 5) + 1 : 0,
            isLikedByManager: i % 4 === 0 && authors[i % authors.length] === CURRENT_ADMIN_ID,
            isReportedBySomeone: isReported,
            adminActionedOnReport: isAdminActioned,
        });
    }
    return posts;
};


function ManagerFreeboard() {
    const navigate = useNavigate();
    const [allPosts, setAllPosts] = useState([]);
    const [postsToDisplay, setPostsToDisplay] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('latest');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setAllPosts(generateInitialPosts());
    }, []);

    useEffect(() => {
        let processedData = [...allPosts];
        if (activeTab === 'myPosts') {
            processedData = processedData.filter(post => post.author === CURRENT_ADMIN_ID);
        }
        // 날짜 및 검색어 필터 로직 (현재는 주석 처리, 필요시 구현)
        // if (dateRange.start && dateRange.end) { /* ... */ }
        // if (searchTerm.trim()) {
        //     const lowerSearchTerm = searchTerm.toLowerCase().trim();
        //     processedData = processedData.filter(post =>
        //         post.title.toLowerCase().includes(lowerSearchTerm) ||
        //         post.author.toLowerCase().includes(lowerSearchTerm)
        //         // 필요시 다른 필드도 검색 대상에 포함
        //     );
        // }

        if (sortOrder === 'latest') {
            processedData.sort((a, b) => b.id - a.id);
        } else if (sortOrder === 'views') {
            processedData.sort((a, b) => b.views - a.views);
        } else if (sortOrder === 'likes') {
            processedData.sort((a, b) => b.likes - a.likes);
        }
        setPostsToDisplay(processedData);
        setCurrentPage(1);
    }, [allPosts, activeTab, dateRange, searchTerm, sortOrder]);

    const handleLikeToggle = (postId) => {
        setAllPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                ? { ...post,
                    isLikedByManager: !post.isLikedByManager,
                    likes: post.isLikedByManager ? post.likes -1 : post.likes + 1
                  }
                : post
            )
        );
    };

    // 신고 조치 핸들러 (1회만 조치 가능하도록 수정됨, 관리자는 사용자 신고 없어도 조치 가능)
    const handleReportAction = (postId) => {
        const postToUpdate = allPosts.find(p => p.id === postId);

        if (!postToUpdate) {
            alert("오류: 해당 게시물을 찾을 수 없습니다.");
            return;
        }

        // 이미 관리자가 조치한 경우
        if (postToUpdate.adminActionedOnReport) {
            alert(`게시물 ID ${postId}는 이미 관리자가 조치한 게시물입니다. 추가 조치가 불가능합니다.`);
            return;
        }

        // 사용자 신고가 있었는지 여부에 따라 확인 메시지 변경
        let confirmMessage = `게시물 ID ${postId}`;
        if (postToUpdate.isReportedBySomeone) {
            confirmMessage += ` (사용자 신고 ${postToUpdate.reports}건)`;
        } else {
            confirmMessage += ` (사용자 신고 없음)`;
        }
        confirmMessage += `에 대해 "관리자 조치함"으로 상태를 변경하시겠습니까? 이 작업은 되돌릴 수 없습니다.`;

        if (window.confirm(confirmMessage)) {
            setAllPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId
                    ? { ...post, adminActionedOnReport: true, reports: post.reports > 0 ? post.reports : 1 } // 조치 시 reports가 0이면 1로 설정 (선택적)
                    : post
                )
            );
            alert(`게시물 ID ${postId}의 신고에 대해 조치했습니다. (실제 DB 업데이트 필요)`);
        }
    };

    const totalPages = Math.ceil(postsToDisplay.length / itemsPerPage);
    const indexOfLastPost = currentPage * itemsPerPage;
    const indexOfFirstPost = indexOfLastPost - itemsPerPage;
    const currentDisplayedPosts = postsToDisplay.slice(indexOfFirstPost, indexOfLastPost);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRowClick = (postId) => {
        navigate(`/admin/managerFreeboardDetail/${postId}`);
    };

    return (
        <>
            <div className={styles.container}>
                <main className={styles.managerFreeboardContent}>
                    <h1 className={styles.pageTitle}>자유게시판 관리</h1>
                    <div className={styles.tabContainer}>
                        <button className={`${styles.tabButton} ${activeTab === 'all' ? styles.activeTab : ''}`} onClick={() => setActiveTab('all')}>전체 게시물</button>
                        <button className={`${styles.tabButton} ${activeTab === 'myPosts' ? styles.activeTab : ''}`} onClick={() => setActiveTab('myPosts')}>내 댓글</button>
                    </div>
                    <div className={styles.filterBar}>
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
                                <th>작성일</th><th>조회수</th><th>좋아요수</th><th>신고</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDisplayedPosts.length > 0 ? (
                                currentDisplayedPosts.map(post => (
                                    <tr key={post.id} onClick={() => handleRowClick(post.id)} className={styles.clickableRow}>
                                        <td>{post.id}</td>
                                        <td>{post.author}</td>
                                        <td className={styles.postTitleCell}>
                                            {post.title.length > 30 ? `${post.title.substring(0,30)}...` : post.title}
                                        </td>
                                        <td>{post.date}</td>
                                        <td>{post.views}</td>
                                        <td>
                                            <button onClick={(e) => {e.stopPropagation(); handleLikeToggle(post.id);}} className={`${styles.iconButton} ${post.isLikedByManager ? styles.liked : ''}`} title="관리자 좋아요 토글">
                                                <img src={post.isLikedByManager ? likeOnIcon : likeOffIcon} alt="좋아요" className={styles.buttonIcon}/>
                                            </button>
                                            <span className={styles.countText}>{post.likes}</span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={(e) => {e.stopPropagation(); handleReportAction(post.id);}}
                                                className={`${styles.iconButton} ${post.adminActionedOnReport ? styles.reportActioned : ''}`}
                                                title={
                                                    post.adminActionedOnReport
                                                      ? `관리자가 조치 완료한 게시물입니다. (신고 ${post.reports}건)` // 관리자 조치 완료 시 title
                                                      : (post.isReportedBySomeone
                                                          ? `사용자 신고 ${post.reports}건 접수됨 (클릭하여 조치)` // 사용자 신고 있고, 관리자 조치 전 title
                                                          : "신고된 내역 없음 (관리자가 직접 조치 가능)") // 사용자 신고 없고, 관리자 조치 전 title
                                                }
                                                disabled={post.adminActionedOnReport} // 관리자가 조치했으면 비활성화
                                            >
                                                <img
                                                    src={(post.isReportedBySomeone || post.adminActionedOnReport) ? reportOnIcon : reportOffIcon}
                                                    alt="신고 조치 상태"
                                                    className={styles.buttonIcon}
                                                />
                                            </button>
                                            {/* 필요시 버튼 옆에 신고 건수 표시 (선택 사항) */}
                                            {/* {post.reports > 0 && <span className={styles.countText}>{post.reports}</span>} */}
                                        </td>
                                    </tr>
                                ))
                            ) : (<tr><td colSpan="7">표시할 게시물이 없습니다.</td></tr>)}
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

export default ManagerFreeboard;