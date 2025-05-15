import { useEffect, useState } from 'react'; // useEffect 추가
import { Link } from 'react-router-dom';
import styles from './ManagerFreeboard.module.css';

// Pagination 컴포넌트 임포트 (경로는 프로젝트 구조에 맞게 확인해주세요)
// 이전 이미지 기준으로 src/components/Pagination/Pagination.jsx
import Pagination from '../../components/Pagination/Pagination';

import reportOffIcon from "../../assets/images/able-alarm.png";
import likeOffIcon from "../../assets/images/b_thumbup.png";
import reportOnIcon from "../../assets/images/disable-alarm.png";
import searchButtonIcon from "../../assets/images/search_icon.png";
import likeOnIcon from "../../assets/images/thumbup.png";

// 예시 데이터 (실제로는 API를 통해 받아옵니다)
// 이 데이터는 외부에서 오거나, 검색/필터 조건에 따라 변경될 수 있습니다.
const allFetchedPosts = Array.from({ length: 47 }, (_, i) => ({ // 47개의 목업 게시물
    id: i + 1,
    type: i % 3 === 0 ? '정보' : (i % 3 === 1 ? '질문' : '후기'),
    title: `관리자 페이지 테스트 게시물 ${i + 1}`,
    author: `관리자${(i % 3) + 1}`,
    date: `25.05.${String(10 + (i % 15)).padStart(2, '0')}`,
    views: Math.floor(Math.random() * 500) + 50,
    likes: Math.floor(Math.random() * 100),
    reports: i % 10 === 0 ? 1 : 0,
    isLiked: i % 4 === 0,
    isReported: i % 10 === 0,
}));


function ManagerFreeboard() {
    const [activeTab, setActiveTab] = useState('all');
    // 'posts'는 필터링/정렬된 결과가 될 수 있으므로, 원본 데이터는 다른 곳에 두거나
    // 필터링 시 원본을 참조하도록 합니다. 여기서는 'allFetchedPosts'를 원본처럼 사용합니다.
    const [posts, setPosts] = useState(allFetchedPosts); // 현재 화면에 표시될 전체 목록 (필터링/정렬 후)

    // --- 페이지네이션 상태 ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // 페이지 당 보여줄 아이템 수

    // TODO: 실제 필터링 및 정렬 로직 추가
    // 예: activeTab, 검색어, 날짜 등에 따라 allFetchedPosts를 필터링하여 setPosts() 호출
    useEffect(() => {
        // activeTab 또는 다른 필터 조건이 변경될 때 posts 상태를 업데이트합니다.
        // 여기서는 단순히 activeTab에 따라 로그만 남기지만, 실제로는 필터링 로직이 들어갑니다.
        console.log(`Current tab: ${activeTab}. Posts count: ${allFetchedPosts.length}`);
        // 예시: if (activeTab === 'myPosts') { setPosts(allFetchedPosts.filter(p => p.author === '현재로그인관리자')); }
        // else { setPosts(allFetchedPosts) }
        setPosts(allFetchedPosts); // 지금은 전체 목록을 그대로 사용
        setCurrentPage(1); // 탭이나 필터 변경 시 1페이지로 이동
    }, [activeTab]);


    const handleLikeToggle = (postId) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 } : post
            )
        );
    };

    const handleReportToggle = (postId) => {
        // 관리자 페이지에서는 신고 토글보다는 신고 처리/해제 기능이 있을 수 있습니다.
        // 여기서는 기존 로직을 유지하되, isReported 상태를 토글합니다.
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId ? { ...post, isReported: !post.isReported, reports: post.isReported ? post.reports -1 : post.reports + 1 } : post
            )
        );
    };

    // --- 페이지네이션 로직 ---
    const totalPages = Math.ceil(posts.length / itemsPerPage);
    const indexOfLastPost = currentPage * itemsPerPage;
    const indexOfFirstPost = indexOfLastPost - itemsPerPage;
    const currentDisplayedPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // 페이지 변경 시 필요한 경우, 게시물 목록의 맨 위로 스크롤
        // window.scrollTo(0, document.getElementById('boardTableAnchor')?.offsetTop || 0);
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
                            전체 목록
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'reported' ? styles.activeTab : ''}`} // 예: 'reported' 탭
                            onClick={() => setActiveTab('reported')}
                        >
                            신고된 글
                        </button>
                    </div>

                    <div className={styles.filterBar}>
                        <input type="date" className={styles.filterInput} />
                        <input type="date" className={styles.filterInput} />
                        <select className={styles.filterSelect}>
                            <option value="">최신순▼</option>
                            <option value="latest">최신순</option>
                            <option value="views">조회순</option>
                        </select>
                        <select className={styles.filterSelect}>
                            <option value="">신고순▼</option> {/* 이 필터가 '정렬순'으로 되어있어 '신고순'으로 변경 */}
                            <option value="likes">좋아요순</option>
                            <option value="reports">신고순</option>
                        </select>
                        <input type="text" placeholder="검색어를 입력하세요" className={styles.filterSearchInput} />
                        <button type="button" className={styles.filterSearchButton}>
                            <img src={searchButtonIcon} alt="검색" className={styles.filterSearchIcon} />
                        </button>
                    </div>

                    {/* id를 추가하여 스크롤 타겟으로 사용 가능 */}
                    <table className={styles.boardTable} id="boardTableAnchor">
                        <thead>
                            <tr>
                                <th>NO</th>
                                <th>타입</th>
                                <th className={styles.titleColumn}>제목</th>
                                <th>작성자</th>
                                <th>작성날짜</th>
                                <th>조회수</th>
                                <th>좋아요</th>
                                <th>신고</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDisplayedPosts.length > 0 ? (
                                currentDisplayedPosts.map(post => (
                                    <tr key={post.id}>
                                        <td>{post.id}</td>
                                        <td>{post.type}</td>
                                        <td className={styles.postTitleCell}>
                                            <Link to={`/freeboard/${post.id}`} className={styles.titleLink}> {/* 실제 상세 페이지 경로로 수정 필요 */}
                                                {post.title}
                                            </Link>
                                        </td>
                                        <td>{post.author}</td>
                                        <td>{post.date}</td>
                                        <td>{post.views}</td>
                                        <td>
                                            <button onClick={() => handleLikeToggle(post.id)} className={styles.iconButton}>
                                                <img
                                                    src={post.isLiked ? likeOnIcon : likeOffIcon}
                                                    alt="좋아요"
                                                    className={styles.buttonIcon}
                                                />
                                            </button>
                                            <span className={styles.countText}>{post.likes}</span>
                                        </td>
                                        <td>
                                            <button onClick={() => handleReportToggle(post.id)} className={styles.iconButton}>
                                                <img
                                                    src={post.isReported ? reportOnIcon : reportOffIcon} // 신고 여부에 따라 아이콘 변경
                                                    alt="신고"
                                                    className={styles.buttonIcon}
                                                />
                                            </button>
                                            <span className={styles.countText}>{post.reports}</span> {/* 신고 횟수 표시 */}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8">표시할 게시물이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    
                    {/* 페이지네이션 컴포넌트 적용 */}
                    {/* styles.pagination 클래스를 가진 div로 한번 감싸서 기존 CSS의 레이아웃(중앙정렬 등)을 활용할 수 있습니다. */}
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