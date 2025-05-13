import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'; // useNavigate는 목록 버튼 등에 사용 가능
import Header from '../../components/Header/Header'; // 실제 경로 확인 필요
import Sidebar from '../../components/Sidebar/Sidebar'; // 실제 경로 확인 필요
import styles from './ManagerFreeboardDetail.module.css'; // CSS 모듈 import

// 아이콘 import (자유게시판 상세에서 사용했던 것과 동일)
import reportOffIcon from "../../assets/images/able-alarm.png";
import likeOffIcon from "../../assets/images/b_thumbup.png";
import reportOnIcon from "../../assets/images/disable-alarm.png";
import likeOnIcon from "../../assets/images/thumbup.png";
// import banner from "../../assets/images/banner.png"; // 상세페이지 배너가 있다면 경로 확인

// 예시: 현재 로그인한 관리자 ID (실제 앱에서는 로그인 정보에서 가져옴)
const LOGGED_IN_ADMIN_ID = 'adminUser'; 

function ManagerFreeboardDetail() {
    const { postId } = useParams(); // URL에서 postId 가져오기
    const navigate = useNavigate();

    // --- 상태 관리 (자유게시판 상세페이지 로직 참고) ---
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    // 관리자 페이지에서는 관리자가 직접 댓글을 달 일은 적을 수 있으므로 commentInput 관련은 일단 제외하거나 필요시 추가
    // const [commentInput, setCommentInput] = useState(''); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 게시글 및 댓글 상태 (좋아요/신고는 관리자도 확인 가능해야 함)
    const [isPostReported, setIsPostReported] = useState(false); // 게시글의 현재 신고 상태
    const [reportedCommentIds, setReportedCommentIds] = useState([]); // 댓글 신고 상태

    // 댓글 수정 관련 (관리자가 댓글을 수정할 일이 있다면 필요, 아니라면 제외 가능)
    // const [editingCommentId, setEditingCommentId] = useState(null);
    // const [currentEditText, setCurrentEditText] = useState('');
    // const editInputRef = useRef(null);

    // --- 데이터 로딩 (자유게시판 상세페이지 로직 참고) ---
    useEffect(() => {
        setIsLoading(true);
        setError(null);
        console.log(`Workspaceing data for admin view of postId: ${postId}`);
        // setTimeout을 사용한 예시 데이터 로딩 (실제로는 API 호출)
        setTimeout(() => {
            const fetchedPost = {
                id: postId,
                title: `관리자 확인용 게시글 (ID: ${postId})`,
                author: '사용자A',
                authorId: 'user123',
                createdAt: '2025.05.01',
                likeCount: 35,
                isLikedByCurrentUser: true, // 이 값은 특정 사용자 기준이므로 관리자 뷰에서는 다르게 해석될 수 있음
                viewCount: 250,
                content: `이것은 ID ${postId} 게시글의 내용입니다. 관리자 페이지에서 확인 중입니다.\n\n여러 줄의 내용도 표시됩니다.\n\n- 항목 1\n- 항목 2`,
                // bannerImageUrl: banner, // 배너 이미지가 있다면
            };
            const fetchedComments = [
                { id: 101, postId: postId, author: '댓글러1', authorId: 'user789', content: '좋은 글이네요!', createdAt: '2025.05.02', likeCount: 5, isLiked: false },
                { id: 102, postId: postId, author: '댓글러2', authorId: 'userABC', content: '저도 그렇게 생각합니다.', createdAt: '2025.05.03', likeCount: 2, isLiked: true },
            ];

            if (postId === "error_test_admin") {
                setError("관리자용 데이터를 가져오는 중 오류 발생.");
                setPost(null);
            } else {
                setPost(fetchedPost);
                setComments(fetchedComments);
                setIsPostReported(postId === "reportedPostExample"); // 예시: 특정 게시글이 신고된 상태라고 가정
            }
            setIsLoading(false);
        }, 800);
    }, [postId]);

    // --- 이벤트 핸들러 (자유게시판 상세페이지 로직 참고, 관리자용으로 일부 수정/제외 가능) ---
    // 관리자 페이지에서는 보통 '좋아요'를 직접 누르진 않지만, 상태 확인 및 테스트를 위해 로직 유지 가능
    const handlePostLikeClick = () => {
        if (!post) return;
        setPost(prevPost => ({
            ...prevPost,
            isLikedByCurrentUser: !prevPost.isLikedByCurrentUser,
            likeCount: prevPost.isLikedByCurrentUser ? prevPost.likeCount - 1 : prevPost.likeCount + 1,
        }));
        console.log("관리자: 게시글 좋아요 상태 변경 (테스트용)");
    };

    // 관리자는 게시글 신고 상태를 변경(해제 등)하거나, 신고 내용을 확인할 수 있음
    const handlePostReportClick = () => {
        if (!post) return;
        // 여기서는 단순 토글로 예시 (실제 관리자 기능은 더 복잡할 수 있음)
        setIsPostReported(prev => !prev);
        alert(isPostReported ? "게시글 신고 상태 해제 (관리자)" : "게시글 신고 상태 설정 (관리자)");
    };

    // 댓글 좋아요/신고 핸들러 (자유게시판 상세와 동일하게 유지 가능)
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

    // --- 로딩 및 에러 처리 UI ---
    if (isLoading) return <div className={styles.loadingContainer}>데이터 로딩 중...</div>;
    if (error) return <div className={styles.errorContainer}>오류: {error}</div>;
    if (!post) return <div className={styles.errorContainer}>게시글을 찾을 수 없습니다.</div>;

    return (
        <>
            <Header />
            <div className={styles.container}> {/* Sidebar와 메인 콘텐츠를 감싸는 flex 컨테이너 */}
                <Sidebar />
                <main className={styles.managerFreeboardDetailContent}> {/* 메인 콘텐츠 영역 */}
                    
                    {/* 페이지 제목 ("자유게시판 상세" 또는 게시글 제목) 및 목록으로 돌아가기 링크 */}
                    <div className={styles.pageHeader}>
                        <Link to="/admin/freeboard" className={styles.toListLink}> {/* 관리자 자유게시판 목록 경로로 수정 */}
                            <h1>자유게시판 관리</h1>
                        </Link>
                        {/* 여기에 "목록으로" 버튼을 추가해도 좋습니다. */}
                    </div>

                    {/* 배너 이미지가 있다면 표시 */}
                    {/* {post.bannerImageUrl && (
                        <div className={styles.imageBannerContainer}>
                            <img src={post.bannerImageUrl} alt="게시판 배너" className={styles.bannerImage} />
                        </div>
                    )} */}

                    {/* 게시글 내용 컨테이너 (자유게시판 상세의 .postContentContainer 참고) */}
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
                                // disabled={isPostReported} // 관리자는 신고 상태를 변경할 수 있으므로 disabled는 상황에 따라
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
                        {/* 게시글 수정/삭제 버튼은 관리자 페이지에 불필요하다고 하셨으므로 제외 */}
                    </div>

                    {/* 댓글 목록 (자유게시판 상세의 .commentListContainer 참고) */}
                    <div className={styles.commentListContainer}>
                        <h3>댓글 ({comments.length})</h3>
                        {comments.length > 0 ? (
                            comments.map(comment => (
                                <div key={comment.id} className={styles.commentItem}>
                                    <div className={styles.commentMeta}>
                                        <div>
                                            <span className={styles.commentAuthor}>{comment.author}</span>
                                            <span className={styles.commentCreatedAt}>{comment.createdAt}</span>
                                        </div>
                                        {/* 관리자는 댓글 삭제 기능이 있을 수 있음 (여기서는 일단 제외) */}
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
                            <p className={styles.noComments}>등록된 댓글이 없습니다.</p>
                        )}
                    </div>
                    {/* 관리자용 댓글 입력 폼은 보통 필요 없으므로 제외 */}
                    {/* 페이지네이션도 댓글이 많을 경우 필요 */}
                </main>
            </div>
        </>
    );
}

export default ManagerFreeboardDetail;