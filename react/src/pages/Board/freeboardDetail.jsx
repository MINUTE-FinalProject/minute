import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import banner from "../../assets/images/banner.png";
import freeboardDetailStyle from './freeboardDetail.module.css';

import reportOffIcon from "../../assets/images/able-alarm.png";
import likeOffIcon from "../../assets/images/b_thumbup.png";
import reportOnIcon from "../../assets/images/disable-alarm.png";
import likeOnIcon from "../../assets/images/thumbup.png";

// Pagination 컴포넌트 임포트 (경로 확인 필요)
import Pagination from '../../components/Pagination/Pagination';

const LOGGED_IN_USER_ID = 'user123'; 

function FreeboardDetail() {
    const { postId } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [allComments, setAllComments] = useState([]); // 전체 댓글 데이터
    
    const [commentInput, setCommentInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reportedCommentIds, setReportedCommentIds] = useState([]);
    
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [currentEditText, setCurrentEditText] = useState('');
    const editInputRef = useRef(null);
    const [isPostReported, setIsPostReported] = useState(false);

    // --- 댓글 페이지네이션 상태 ---
    const [currentCommentPage, setCurrentCommentPage] = useState(1); // 댓글 현재 페이지 (기존 currentPage 이름 변경)
    const [totalCommentPages, setTotalCommentPages] = useState(1); // 댓글 전체 페이지 수 (기존 totalPages 이름 변경)
    const commentsPerPage = 5; // 페이지 당 보여줄 댓글 수

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        console.log(`Workspaceing data for postId: ${postId}`);
        setTimeout(() => {
            const fetchedPost = {
                id: postId,
                title: `게시글 (ID: ${postId}) - 최종 기능 통합`,
                author: '최종 작성자',
                authorId: 'user456',
                createdAt: '2025.05.07',
                likeCount: 20,
                isLikedByCurrentUser: false,
                viewCount: 150,
                content: `이것은 ID ${postId} 게시글의 최종 내용입니다.\n\n모든 기능이 통합되었습니다:\n- 게시글 좋아요 토글\n- 게시글 신고 (일회성, 비활성화)\n- 댓글 인라인 수정 (더블클릭 후 Enter)\n- 기타 기본 기능들...\n\n즐겁게 테스트해보세요!`,
                bannerImageUrl: banner, // banner 이미지 직접 사용
            };

            // 댓글 목업 데이터 개수 증가
            const fetchedComments = Array.from({ length: 17 }, (_, i) => ({ // 17개 댓글 생성
                id: 101 + i,
                postId: postId,
                author: i % 3 === 0 ? '나 (로그인 사용자)' : `댓글러${i + 1}`,
                authorId: i % 3 === 0 ? LOGGED_IN_USER_ID : `user${700 + i}`,
                content: `게시글 ID ${postId}에 대한 ${i + 1}번째 댓글입니다. 댓글 내용 테스트!`,
                createdAt: `2025.05.${String(7 + (i % 5)).padStart(2, '0')}`,
                likeCount: Math.floor(Math.random() * 6),
                isLiked: i % 4 === 0,
            }));

            if (postId === "error_test") {
                setError("서버에서 데이터를 가져오는 중 오류가 발생했습니다.");
                setPost(null);
            } else {
                setPost(fetchedPost);
                setAllComments(fetchedComments); // 전체 댓글 저장
                setTotalCommentPages(Math.ceil(fetchedComments.length / commentsPerPage)); // 전체 댓글 페이지 수 계산
                setIsPostReported(false); 
                setReportedCommentIds(fetchedComments.filter((c,i)=> i%4 ===0 && c.authorId !== LOGGED_IN_USER_ID).map(c => c.id)) // 일부 댓글 신고된 상태로 설정
            }
            setIsLoading(false);
            setCurrentCommentPage(1); // 데이터 로드 시 댓글 페이지 1로 초기화
        }, 1200);
    }, [postId]);

    useEffect(() => {
        if (editingCommentId && editInputRef.current) {
            editInputRef.current.focus();
            const len = editInputRef.current.value.length;
            editInputRef.current.selectionStart = len;
            editInputRef.current.selectionEnd = len;
        }
    }, [editingCommentId]);

    // --- 댓글 페이지네이션 로직 ---
    const indexOfLastComment = currentCommentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentDisplayedComments = allComments.slice(indexOfFirstComment, indexOfLastComment);

    const handleCommentPageChange = (pageNumber) => { // 기존 handlePageChange -> handleCommentPageChange
        console.log(`댓글 페이지 ${pageNumber}로 이동`);
        setCurrentCommentPage(pageNumber);
    };


    // (handlePostLikeClick, handlePostReportClick 등 다른 핸들러들은 기존과 동일하게 유지)
    const handlePostLikeClick = () => {
        if (!post) return;
        setPost(prevPost => ({
            ...prevPost,
            isLikedByCurrentUser: !prevPost.isLikedByCurrentUser,
            likeCount: prevPost.isLikedByCurrentUser ? prevPost.likeCount - 1 : prevPost.likeCount + 1,
        }));
    };

    const handlePostReportClick = () => {
        if (!post || isPostReported) return;
        if (window.confirm("이 게시물을 신고하시겠습니까? 신고 후에는 이 세션에서 취소할 수 없습니다.")) {
            setIsPostReported(true);
            alert("게시물이 신고되었습니다.");
        }
    };

    const handlePostEditClick = () => {
        navigate(`/freeboard/${post.id}/edit`); // App.js에 정의된 경로와 일치해야 함
    };

    const handlePostDeleteClick = () => {
        if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
            console.log(`게시글 ID ${post.id} 삭제 처리 요청`);
            // navigate('/freeboard'); 
        }
    };

    const handleCommentLikeToggle = (commentId) => {
        setAllComments(prevComments =>
            prevComments.map(comment =>
                comment.id === commentId
                    ? { ...comment, isLiked: !comment.isLiked, likeCount: comment.isLiked ? Math.max(0, comment.likeCount - 1) : comment.likeCount + 1 }
                    : comment
            )
        );
    };

    const handleCommentReportClick = (commentId) => {
        if (reportedCommentIds.includes(commentId)) return;
        if (window.confirm(`이 댓글을 신고하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
            setReportedCommentIds(prevIds => [...prevIds, commentId]);
            alert(`댓글 ID ${commentId}이(가) 신고되었습니다.`);
        }
    };

    const handleCommentDeleteClick = (commentId) => {
        if (window.confirm(`댓글 ID ${commentId}을(를) 정말로 삭제하시겠습니까?`)) {
            setAllComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
        }
    };

    const handleCommentInputChange = (event) => setCommentInput(event.target.value);

    const handleCommentFormSubmit = (event) => {
        event.preventDefault();
        if (!commentInput.trim()) {
            alert("댓글 내용을 입력해주세요.");
            return;
        }
        const newComment = {
            id: Date.now(), 
            postId: postId,
            author: '나 (로그인 사용자)',
            authorId: LOGGED_IN_USER_ID,
            content: commentInput,
            createdAt: new Date().toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\./g, '.').slice(0, -1),
            likeCount: 0,
            isLiked: false
        };
        setAllComments(prevComments => [newComment, ...prevComments]); // 새 댓글 맨 위에 추가
        setTotalCommentPages(Math.ceil((allComments.length + 1) / commentsPerPage)); // 전체 페이지 수 업데이트
        setCommentInput('');
    };

    const handleCommentDoubleClick = (comment) => {
        if (LOGGED_IN_USER_ID === comment.authorId) {
            setEditingCommentId(comment.id);
            setCurrentEditText(comment.content);
        }
    };

    const handleCommentEditChange = (event) => setCurrentEditText(event.target.value);

    const handleCommentEditKeyDown = (commentId, event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (!currentEditText.trim()) {
                alert("댓글 내용은 비워둘 수 없습니다.");
                const originalComment = allComments.find(c => c.id === commentId);
                if (originalComment) setCurrentEditText(originalComment.content);
                return;
            }
            setAllComments(prevComments =>
                prevComments.map(c =>
                    c.id === commentId ? { ...c, content: currentEditText } : c
                )
            );
            setEditingCommentId(null);
        } else if (event.key === 'Escape') {
            event.preventDefault();
            setEditingCommentId(null);
        }
    };

    if (isLoading) return <div className={freeboardDetailStyle.loadingContainer}>게시글을 불러오는 중입니다...</div>;
    if (error) return <div className={freeboardDetailStyle.errorContainer}>오류: {error}</div>;
    if (!post) return <div className={freeboardDetailStyle.errorContainer}>게시글을 찾을 수 없습니다.</div>;

    return (
        <div className={freeboardDetailStyle.pageContainer}>
            <div className={freeboardDetailStyle.boardLinkContainer}>
                <Link to="/freeboard">
                    <h2>자유게시판</h2>
                </Link>
            </div>

            {post.bannerImageUrl && (
                <div className={freeboardDetailStyle.imageBannerContainer}>
                    <img src={post.bannerImageUrl} alt="게시판 배너" className={freeboardDetailStyle.bannerImage} />
                </div>
            )}

            <div className={freeboardDetailStyle.postContentContainer}>
                <h1 className={freeboardDetailStyle.postTitle}>{post.title}</h1>
                <div className={freeboardDetailStyle.postMeta}>
                    <div>
                        <span className={freeboardDetailStyle.postAuthor}> {post.author}</span>
                        <span className={freeboardDetailStyle.postCreatedAt}>{post.createdAt}</span>
                    </div>
                </div>
                <div className={freeboardDetailStyle.postSubMeta}>
                    <div className={freeboardDetailStyle.postStats}>
                        <button
                            onClick={handlePostLikeClick}
                            className={`${freeboardDetailStyle.likeButton} ${post.isLikedByCurrentUser ? freeboardDetailStyle.liked : ''}`}
                            aria-label={post.isLikedByCurrentUser ? "게시글 좋아요 취소" : "게시글 좋아요"}
                            title={post.isLikedByCurrentUser ? "좋아요 취소" : "좋아요"}
                        >
                            <img
                                src={post.isLikedByCurrentUser ? likeOnIcon : likeOffIcon}
                                alt={post.isLikedByCurrentUser ? "좋아요 된 상태" : "좋아요 안된 상태"}
                                className={freeboardDetailStyle.buttonIcon}
                            />
                        </button>
                        <span>좋아요: {post.likeCount}</span>
                        <span>조회수: {post.viewCount}</span>
                    </div>
                    <button
                        onClick={handlePostReportClick}
                        className={`${freeboardDetailStyle.reportButton} ${isPostReported ? freeboardDetailStyle.reported : ''}`}
                        disabled={isPostReported}
                        aria-label={isPostReported ? "게시글 신고됨" : "게시글 신고하기"}
                        title={isPostReported ? "신고됨" : "신고하기"}
                    >
                        <img
                            src={isPostReported ? reportOnIcon : reportOffIcon}
                            alt={isPostReported ? "신고 된 상태" : "신고 안된 상태"}
                            className={freeboardDetailStyle.buttonIcon}
                        />
                    </button>
                </div>
                <div className={freeboardDetailStyle.postBody}>
                    {post.content.split('\n').map((line, index) => (
                        <React.Fragment key={index}>{line}<br /></React.Fragment>
                    ))}
                </div>
                {post.authorId === LOGGED_IN_USER_ID && ( // 자신의 글일 때만 수정/삭제 버튼 표시
                    <div className={freeboardDetailStyle.postActions}>
                        <button onClick={handlePostEditClick} className={`${freeboardDetailStyle.actionButton} ${freeboardDetailStyle.editButton}`}>수정</button>
                        <button onClick={handlePostDeleteClick} className={`${freeboardDetailStyle.actionButton} ${freeboardDetailStyle.deleteButton}`}>삭제</button>
                    </div>
                )}
            </div>

            <form className={freeboardDetailStyle.commentInputContainer} onSubmit={handleCommentFormSubmit}>
                <textarea
                    placeholder="따뜻한 댓글을 남겨주세요 :)"
                    className={freeboardDetailStyle.commentTextarea}
                    value={commentInput}
                    onChange={handleCommentInputChange}
                    rows="3"
                />
                <button type="submit" className={freeboardDetailStyle.commentSubmitButton}>등록</button>
            </form>

            <div className={freeboardDetailStyle.commentListContainer}>
                <h3>댓글 ({allComments.length})</h3> {/* 전체 댓글 수 표시 */}
                {currentDisplayedComments.length > 0 ? ( // currentDisplayedComments로 변경
                    currentDisplayedComments.map(comment => (
                        <div key={comment.id} className={freeboardDetailStyle.commentItem}>
                            <div className={freeboardDetailStyle.commentMeta}>
                                <div>
                                    <span className={freeboardDetailStyle.commentAuthor}>{comment.author}</span>
                                    <span className={freeboardDetailStyle.commentCreatedAt}>{comment.createdAt}</span>
                                </div>
                                {LOGGED_IN_USER_ID === comment.authorId && editingCommentId !== comment.id && (
                                    <button
                                        onClick={() => handleCommentDeleteClick(comment.id)}
                                        className={`${freeboardDetailStyle.actionButton} ${freeboardDetailStyle.deleteButton} ${freeboardDetailStyle.commentDeleteButton}`}>
                                        삭제
                                    </button>
                                )}
                            </div>

                            {editingCommentId === comment.id && LOGGED_IN_USER_ID === comment.authorId ? (
                                <textarea
                                    ref={editInputRef}
                                    className={freeboardDetailStyle.commentEditTextarea}
                                    value={currentEditText}
                                    onChange={handleCommentEditChange}
                                    onKeyDown={(e) => handleCommentEditKeyDown(comment.id, e)}
                                    rows="3"
                                />
                            ) : (
                                <p
                                    className={freeboardDetailStyle.commentContent}
                                    onDoubleClick={() => handleCommentDoubleClick(comment)}
                                >
                                    {comment.content.split('\n').map((line, index) => (
                                        <React.Fragment key={index}>{line}<br /></React.Fragment>
                                    ))}
                                </p>
                            )}

                            <div className={freeboardDetailStyle.commentActions}>
                                <div>
                                    <button
                                        onClick={() => handleCommentLikeToggle(comment.id)}
                                        className={freeboardDetailStyle.commentLikeButton} // CSS 클래스 확인
                                        aria-label={comment.isLiked ? "댓글 좋아요 취소" : "댓글 좋아요"}
                                        title={comment.isLiked ? "좋아요 취소" : "좋아요"}
                                    >
                                        <img
                                            src={comment.isLiked ? likeOnIcon : likeOffIcon}
                                            alt={comment.isLiked ? "좋아요 된 상태" : "좋아요 안된 상태"}
                                            className={freeboardDetailStyle.buttonIcon}
                                        />
                                    </button>
                                    <span className={freeboardDetailStyle.commentLikeCount}>{comment.likeCount}</span>
                                </div>
                                {LOGGED_IN_USER_ID !== comment.authorId && (
                                    <button
                                        onClick={() => handleCommentReportClick(comment.id)}
                                        className={`${freeboardDetailStyle.reportButton} ${freeboardDetailStyle.commentReportButton} ${
                                            reportedCommentIds.includes(comment.id) ? freeboardDetailStyle.reported : ''
                                        }`}
                                        disabled={reportedCommentIds.includes(comment.id)}
                                        aria-label={reportedCommentIds.includes(comment.id) ? "댓글 신고됨" : "댓글 신고하기"}
                                        title={reportedCommentIds.includes(comment.id) ? "신고됨" : "신고하기"}
                                    >
                                        <img
                                            src={reportedCommentIds.includes(comment.id) ? reportOnIcon : reportOffIcon}
                                            alt={reportedCommentIds.includes(comment.id) ? "신고 된 상태" : "댓글 신고하기"}
                                            className={freeboardDetailStyle.buttonIcon}
                                        />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                     allComments.length > 0 ? <p>해당 페이지에 댓글이 없습니다.</p> : <p className={freeboardDetailStyle.noComments}>등록된 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
                )}
            </div>

            {/* 기존 버튼식 페이지네이션을 Pagination 컴포넌트로 교체 */}
            {allComments.length > 0 && totalCommentPages > 1 && (
                <div className={freeboardDetailStyle.commentPaginationContainer}>
                    <Pagination
                        currentPage={currentCommentPage}
                        totalPages={totalCommentPages}
                        onPageChange={handleCommentPageChange}
                        pageNeighbours={1} // 댓글 페이지네이션에 적합하게 조절 가능
                    />
                </div>
            )}
        </div>
    );
}

export default FreeboardDetail;