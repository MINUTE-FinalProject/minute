import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './ManagerFreeboardDetail.module.css'; // 페이지 내부 스타일은 계속 사용

// Pagination 컴포넌트 임포트
import Pagination from '../../components/Pagination/Pagination';

// 아이콘 임포트
import reportOffIcon from "../../assets/images/able-alarm.png";
import likeOffIcon from "../../assets/images/b_thumbup.png";
import reportOnIcon from "../../assets/images/disable-alarm.png";
import likeOnIcon from "../../assets/images/thumbup.png";

// !!! AdminLayout을 사용하므로 Header, Sidebar 직접 임포트 및 사용 안 함 !!!
// import Header from '../../components/Header/Header';
// import Sidebar from '../../components/Sidebar/Sidebar';

const LOGGED_IN_ADMIN_ID = 'adminUser';

function ManagerFreeboardDetail() {
    const { postId } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isPostReported, setIsPostReported] = useState(false);
    const [reportedCommentIds, setReportedCommentIds] = useState([]);

    const [currentCommentPage, setCurrentCommentPage] = useState(1);
    const commentsPerPage = 5;

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        console.log(`Workspaceing data for admin view of postId: ${postId}`);

        setTimeout(() => {
            const fetchedPost = {
                id: postId,
                title: `관리자 확인용 게시글 (ID: ${postId})`,
                author: '사용자A',
                authorId: 'user123',
                createdAt: '2025.05.01',
                likeCount: 35,
                isLikedByCurrentUser: true,
                viewCount: 250,
                content: `이것은 ID ${postId} 게시글의 내용입니다. 관리자 페이지에서 확인 중입니다.\n\n여러 줄의 내용도 표시됩니다.\n\n- 항목 1\n- 항목 2`,
            };
            const fetchedComments = Array.from({ length: 17 }, (_, i) => ({
                id: 101 + i,
                postId: postId,
                author: `댓글러${i + 1}`,
                authorId: `user${100 + i}`,
                content: `게시글 ID ${postId}에 대한 ${i + 1}번째 댓글입니다. 내용이 충분히 길어지면 다음 줄로 넘어갑니다. 아니면 그냥 한 줄입니다.`,
                createdAt: `2025.05.${String(3 + (i % 10)).padStart(2, '0')}`,
                likeCount: Math.floor(Math.random() * 11),
                isLiked: i % 3 === 0,
            }));

            if (postId === "error_test_admin") {
                setError("관리자용 데이터를 가져오는 중 오류 발생.");
                setPost(null);
            } else {
                setPost(fetchedPost);
                setComments(fetchedComments);
                setIsPostReported(postId === "2");
                setReportedCommentIds(fetchedComments.filter((c, i) => i % 5 === 0).map(c => c.id));
            }
            setIsLoading(false);
            setCurrentCommentPage(1);
        }, 800);
    }, [postId]);

    // ... (handlePostLikeClick, handlePostReportClick 등 핸들러 함수들은 그대로 유지) ...
    const handlePostLikeClick = () => {
        if (!post) return;
        setPost(prevPost => ({
            ...prevPost,
            isLikedByCurrentUser: !prevPost.isLikedByCurrentUser,
            likeCount: prevPost.isLikedByCurrentUser ? prevPost.likeCount - 1 : prevPost.likeCount + 1,
        }));
    };

    const handlePostReportClick = () => {
        if (!post) return;
        setIsPostReported(prev => !prev);
        alert(isPostReported ? "게시글 신고 상태 해제 (관리자)" : "게시글 신고 상태 설정 (관리자)");
    };

    const handleCommentLikeToggle = (commentId) => {
        setComments(prevComments =>
            prevComments.map(comment =>
                comment.id === commentId
                    ? { ...comment, isLiked: !comment.isLiked, likeCount: comment.isLiked ? Math.max(0, comment.likeCount - 1) : comment.likeCount + 1 }
                    : comment
            )
        );
    };
    
    const handleCommentReportClick = (commentId) => {
        if (window.confirm(`관리자: 이 댓글(ID: ${commentId})의 신고 상태를 변경하시겠습니까?`)) {
            setReportedCommentIds(prevIds =>
                prevIds.includes(commentId) ? prevIds.filter(id => id !== commentId) : [...prevIds, commentId]
            );
            alert(`관리자: 댓글(ID: ${commentId}) 신고 상태 변경됨`);
        }
    };

    const totalCommentPages = Math.ceil(comments.length / commentsPerPage);
    const indexOfLastComment = currentCommentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentDisplayedComments = comments.slice(indexOfFirstComment, indexOfLastComment);

    const handleCommentPageChange = (pageNumber) => {
        setCurrentCommentPage(pageNumber);
    };

    if (isLoading) return <div className={styles.loadingContainer}>데이터 로딩 중...</div>;
    if (error) return <div className={styles.errorContainer}>오류: {error}</div>;
    if (!post) return <div className={styles.errorContainer}>게시글을 찾을 수 없습니다.</div>;

    // AdminLayout의 PageContentOutlet으로 렌더링될 내용
    // 최상위 div.container 제거, Header/Sidebar 제거
    return (
        // 이 main 태그가 페이지 콘텐츠의 루트 역할을 하며, AdminLayout의 padding: '20px' 내부에 위치하게 됩니다.
        // 기존의 managerFreeboardDetailContent 스타일을 카드 스타일에 맞게 조정합니다.
        <main className={styles.managerFreeboardDetailContentCard}>
            <div className={styles.pageHeader}>
                <Link to="/admin/freeboard" className={styles.toListLink}>
                    <h1>자유게시판 관리</h1>
                </Link>
            </div>

            <div className={styles.postContentContainer}>
                <h2 className={styles.postTitle}>{post.title}</h2>
                <div className={styles.postMeta}>
                    <div>
                        <span className={styles.postAuthor}>작성자: {post.author}</span>
                        <span className={styles.postCreatedAt}>작성일: {post.createdAt}</span>
                    </div>
                </div>
                <div className={styles.postSubMeta}>
                    <div className={styles.postStats}>
                        <button
                            onClick={handlePostLikeClick}
                            className={`${styles.iconButton} ${post.isLikedByCurrentUser ? styles.liked : ''}`}
                            title={post.isLikedByCurrentUser ? "좋아요 취소 (테스트)" : "좋아요 (테스트)"}
                        >
                            <img
                                src={post.isLikedByCurrentUser ? likeOnIcon : likeOffIcon}
                                alt="좋아요 상태"
                                className={styles.buttonIcon}
                            />
                        </button>
                        <span className={styles.countText}>좋아요: {post.likeCount}</span>
                        <span className={styles.countText}>조회수: {post.viewCount}</span>
                    </div>
                    <button
                        onClick={handlePostReportClick}
                        className={`${styles.iconButton} ${isPostReported ? styles.reported : ''}`}
                        title={isPostReported ? "신고 상태 해제 (테스트)" : "신고 상태로 변경 (테스트)"}
                    >
                        <img
                            src={isPostReported ? reportOnIcon : reportOffIcon}
                            alt="신고 상태"
                            className={styles.buttonIcon}
                        />
                    </button>
                </div>
                <div className={styles.postBody}>
                    {post.content.split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                            {line}
                            <br />
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className={styles.commentListContainer}>
                <h3>댓글 ({comments.length})</h3>
                {currentDisplayedComments.length > 0 ? (
                    currentDisplayedComments.map(comment => (
                        <div key={comment.id} className={styles.commentItem}>
                            <div className={styles.commentMeta}>
                                <div>
                                    <span className={styles.commentAuthor}>{comment.author}</span>
                                    <span className={styles.commentCreatedAt}>{comment.createdAt}</span>
                                </div>
                            </div>
                            <p className={styles.commentContent}>
                                {comment.content.split('\n').map((line, index) => (
                                    <React.Fragment key={index}>{line}<br /></React.Fragment>
                                ))}
                            </p>
                            <div className={styles.commentActions}>
                                <div>
                                    <button onClick={() => handleCommentLikeToggle(comment.id)} className={styles.iconButton} title={comment.isLiked ? "좋아요 취소 (테스트)" : "좋아요 (테스트)"}>
                                        <img src={comment.isLiked ? likeOnIcon : likeOffIcon} alt="댓글 좋아요" className={styles.buttonIcon} />
                                    </button>
                                    <span className={styles.countText}>{comment.likeCount}</span>
                                </div>
                                <button onClick={() => handleCommentReportClick(comment.id)} className={`${styles.iconButton} ${reportedCommentIds.includes(comment.id) ? styles.reported : ''}`} title={reportedCommentIds.includes(comment.id) ? "댓글 신고 상태 해제 (테스트)" : "댓글 신고 상태로 변경 (테스트)"}>
                                    <img src={reportedCommentIds.includes(comment.id) ? reportOnIcon : reportOffIcon} alt="댓글 신고" className={styles.buttonIcon} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    comments.length > 0 ? <p>해당 페이지에 댓글이 없습니다.</p> : <p className={styles.noComments}>등록된 댓글이 없습니다.</p>
                )}

                {comments.length > 0 && totalCommentPages > 1 && (
                    <div className={styles.commentPaginationWrapper}>
                        <Pagination
                            currentPage={currentCommentPage}
                            totalPages={totalCommentPages}
                            onPageChange={handleCommentPageChange}
                            pageNeighbours={0}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}

export default ManagerFreeboardDetail;