// src/pages/Admin/ManagerFreeboard.jsx (또는 해당 파일의 실제 경로)
import { useEffect, useState } from 'react'; // React import 추가
import { useNavigate } from 'react-router-dom';
import reportOffIcon from "../../assets/images/able-alarm.png";
import likeOffIcon from "../../assets/images/b_thumbup.png";
import reportOnIcon from "../../assets/images/disable-alarm.png";
import searchButtonIcon from "../../assets/images/search_icon.png";
import likeOnIcon from "../../assets/images/thumbup.png";
import Modal from '../../components/Modal/Modal'; // Modal 컴포넌트 import
import Pagination from '../../components/Pagination/Pagination';
import styles from './ManagerFreeboard.module.css';

const CURRENT_ADMIN_ID = '관리자1';

const generateInitialPosts = (count = 47) => {
    // ... (기존 generateInitialPosts 함수 내용 유지)
    const posts = [];
    const authors = ['관리자1', '사용자A', '사용자B', '관리자2', '사용자C'];
    for (let i = 1; i <= count; i++) {
        const isReported = i % 10 === 0; 
        const isAdminActioned = isReported && i % 5 === 0;
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
        setAllPosts(generateInitialPosts());
    }, []);

    useEffect(() => {
        let processedData = [...allPosts];
        if (activeTab === 'myPosts') {
            processedData = processedData.filter(post => post.author === CURRENT_ADMIN_ID);
        }
        // 날짜 및 검색어 필터 로직 (현재는 주석 처리, 필요시 구현)
        // if (dateRange.start && dateRange.end) { /* ... */ }
        // if (searchTerm.trim()) { /* ... */ }

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

    // --- 신고 조치 핸들러 (Modal 적용) ---
    const processReportAction = (postIdToUpdate) => {
        setAllPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postIdToUpdate
                ? { ...post, adminActionedOnReport: true, reports: post.reports > 0 ? post.reports : 1 }
                : post
            )
        );
        // TODO: API로 실제 DB 업데이트
        setModalProps({
            title: '조치 완료',
            message: `게시물 ID ${postIdToUpdate}의 신고에 대해 성공적으로 조치했습니다.`,
            confirmText: '확인',
            type: 'adminSuccess', // 관리자용 성공 알림
            confirmButtonType: 'primary' // 여기도 핑크색을 원하시면 type: 'success'로 변경 가능
        });
        setIsModalOpen(true);
    };

    const handleReportAction = (e, postId) => { // 이벤트 객체(e)를 받아 stopPropagation 호출
        e.stopPropagation(); // 행 클릭 이벤트 전파 방지
        
        const postToUpdate = allPosts.find(p => p.id === postId);

        if (!postToUpdate) {
            setModalProps({
                title: '오류',
                message: '해당 게시물을 찾을 수 없습니다.',
                confirmText: '확인',
                type: 'adminError',
                confirmButtonType: 'primary'
            });
            setIsModalOpen(true);
            return;
        }

        if (postToUpdate.adminActionedOnReport) {
            setModalProps({
                title: '알림',
                message: `게시물 ID ${postId}는 이미 관리자가 조치한 게시물입니다. 추가 조치가 불가능합니다.`,
                confirmText: '확인',
                type: 'adminWarning', // 정보성 경고
                confirmButtonType: 'primary'
            });
            setIsModalOpen(true);
            return;
        }

        let confirmMessage = `게시물 ID ${postId}`;
        if (postToUpdate.isReportedBySomeone) {
            confirmMessage += ` (사용자 신고 ${postToUpdate.reports}건)`;
        } else {
            confirmMessage += ` (사용자 신고 없음)`;
        }
        confirmMessage += `에 대해 "관리자 조치함"으로 상태를 변경하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`;

        setModalProps({
            title: '신고 조치 확인',
            message: confirmMessage,
            onConfirm: () => processReportAction(postId),
            confirmText: '조치 실행',
            cancelText: '취소',
            type: 'adminConfirm', // 관리자용 확인
            confirmButtonType: 'danger' // 조치 실행은 주요 액션이므로 danger 또는 primary
        });
        setIsModalOpen(true);
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
                        <button className={`${styles.tabButton} ${activeTab === 'myPosts' ? styles.activeTab : ''}`} onClick={() => setActiveTab('myPosts')}>내 댓글</button> {/* '내 댓글' 이 아니라 '내 게시물'이 맞을 것 같습니다. */}
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
                                                onClick={(e) => handleReportAction(e, post.id)} // 이벤트 객체(e) 전달
                                                className={`${styles.iconButton} ${post.adminActionedOnReport ? styles.reportActioned : ''}`}
                                                title={
                                                    post.adminActionedOnReport
                                                    ? `관리자가 조치 완료한 게시물입니다. (신고 ${post.reports}건)`
                                                    : (post.isReportedBySomeone
                                                        ? `사용자 신고 ${post.reports}건 접수됨 (클릭하여 조치)`
                                                        : "신고된 내역 없음 (관리자가 직접 조치 가능)")
                                                }
                                                disabled={post.adminActionedOnReport}
                                            >
                                                <img
                                                    src={(post.isReportedBySomeone || post.adminActionedOnReport) ? reportOnIcon : reportOffIcon}
                                                    alt="신고 조치 상태"
                                                    className={styles.buttonIcon}
                                                />
                                            </button>
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
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                {...modalProps}
            />
        </>
    );
}

export default ManagerFreeboard;