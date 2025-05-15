import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './ManagerFreeboardDetail.module.css';

// Pagination 컴포넌트 임포트
import Pagination from '../../components/Pagination/Pagination';

import reportOffIcon from "../../assets/images/able-alarm.png";
import likeOffIcon from "../../assets/images/b_thumbup.png";
import reportOnIcon from "../../assets/images/disable-alarm.png";
import likeOnIcon from "../../assets/images/thumbup.png";

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

    // --- 댓글 페이지네이션 상태 ---
    const [currentCommentPage, setCurrentCommentPage] = useState(1);
    const commentsPerPage = 5; // 페이지 당 보여줄 댓글 수

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
            // 댓글 목업 데이터 개수 증가 (페이지네이션 테스트용)
            const fetchedComments = Array.from({ length: 17 }, (_, i) => ({ // 17개 댓글 생성
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
                setIsPostReported(postId === "2"); // 예시: ID가 2인 게시글이 신고된 상태라고 가정
                // 댓글 신고 상태도 초기화 (예시)
                setReportedCommentIds(fetchedComments.filter((c, i) => i % 5 === 0).map(c => c.id));
            }
            setIsLoading(false);
            setCurrentCommentPage(1); // 데이터 로드 시 댓글 페이지 1로 초기화
        }, 800);
    }, [postId]);

    const handlePostLikeClick = () => {
        if (!post) return;
        setPost(prevPost => ({
            ...prevPost,
            isLikedByCurrentUser: !prevPost.isLikedByCurrentUser,
            likeCount: prevPost.isLikedByCurrentUser ? prevPost.likeCount - 1 : prevPost.likeCount + 1,
        }));
        console.log("관리자: 게시글 좋아요 상태 변경 (테스트용)");
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

    // --- 댓글 페이지네이션 로직 ---
    const totalCommentPages = Math.ceil(comments.length / commentsPerPage);
    const indexOfLastComment = currentCommentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentDisplayedComments = comments.slice(indexOfFirstComment, indexOfLastComment);

    const handleCommentPageChange = (pageNumber) => {
        setCurrentCommentPage(pageNumber);
        // 댓글 페이지 변경 시 댓글 목록 상단으로 스크롤 (선택적)
        // const commentSection = document.getElementById('commentListContainer');
        // if (commentSection) {
        //     commentSection.scrollIntoView({ behavior: 'smooth' });
        // }
    };

    if (isLoading) return <div className={styles.loadingContainer}>데이터 로딩 중...</div>;
    if (error) return <div className={styles.errorContainer}>오류: {error}</div>;
    if (!post) return <div className={styles.errorContainer}>게시글을 찾을 수 없습니다.</div>;

    return (
        <>

            <div className={styles.container}>

                <main className={styles.managerFreeboardDetailContent}>
                    
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

                    {/* 댓글 목록 */}
                    <div className={styles.commentListContainer} id="commentListContainer">
                        <h3>댓글 ({comments.length})</h3>
                        {currentDisplayedComments.length > 0 ? ( // comments -> currentDisplayedComments
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
                        
                        {/* 댓글 페이지네이션 */}
                        {comments.length > 0 && totalCommentPages > 1 && ( // 댓글이 있고, 댓글 페이지가 2개 이상일 때만 표시
                            <div className={styles.commentPaginationWrapper}> {/* 필요시 이 div로 감싸서 추가 스타일링 */}
                                <Pagination
                                    currentPage={currentCommentPage}
                                    totalPages={totalCommentPages}
                                    onPageChange={handleCommentPageChange}
                                    pageNeighbours={0} // 댓글 페이지네이션은 더 간결하게 (옵션)
                                />
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}

export default ManagerFreeboardDetail;