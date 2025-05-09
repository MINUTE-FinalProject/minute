import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import banner from "../assets/banner.png";
import freeboardDetailStyle from './freeboardDetail.module.css';

// (실제 앱에서는 Context API, Redux, Zustand 등에서 가져오거나 로그인 시 설정됩니다)
const LOGGED_IN_USER_ID = 'user123'; // 예시: 현재 로그인한 사용자 ID

function FreeboardDetail() {
    const { postId } = useParams(); // URL에서 postId 가져오기
    const navigate = useNavigate(); // 수정/삭제 후 페이지 이동 시 사용

    // --- 상태 관리 ---
    const [post, setPost] = useState(null); // 게시글 데이터
    const [comments, setComments] = useState([]); // 댓글 데이터
    const [commentInput, setCommentInput] = useState(''); // 댓글 입력 값
    const [currentPage, setCurrentPage] = useState(1); // 현재 댓글 페이지
    const [totalPages, setTotalPages] = useState(1); // 전체 댓글 페이지 수
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    // --- 댓글 수정 관련 상태 및 ref ---
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [currentEditText, setCurrentEditText] = useState('');
    const editInputRef = useRef(null);

    // --- 게시글 신고 상태 추가 ---
    const [isPostReported, setIsPostReported] = useState(false);


    // --- 데이터 예시 및 로딩 (실제로는 API 호출) ---
    useEffect(() => {
        setIsLoading(true);
        setError(null);
        console.log(`Workspaceing data for postId: ${postId}`);
        setTimeout(() => {
            const fetchedPost = {
                id: postId,
                title: `게시글 (ID: ${postId}) - 최종 기능 통합`,
                author: '최종 작성자',
                authorId: 'user456', // 게시글 작성자의 고유 ID
                createdAt: '2025.05.07',
                likeCount: 20,
                isLikedByCurrentUser: false, // <<< 게시글 좋아요 상태 추가 (초기값: false)
                viewCount: 150,
                content: `이것은 ID ${postId} 게시글의 최종 내용입니다.\n\n모든 기능이 통합되었습니다:\n- 게시글 좋아요 토글\n- 게시글 신고 (일회성, 비활성화)\n- 댓글 인라인 수정 (더블클릭 후 Enter)\n- 기타 기본 기능들...\n\n즐겁게 테스트해보세요!`,
                bannerImageUrl: 'https://via.placeholder.com/800x200?text=Final+Feature+Banner',
            };

            const fetchedComments = [
                { id: 101, postId: postId, author: '일반 댓글러', authorId: 'user789', content: '잘 봤습니다!', createdAt: '2025.05.07', likeCount: 5, isLiked: false },
                { id: 102, postId: postId, author: '나 (로그인 사용자)', authorId: LOGGED_IN_USER_ID, content: '내 댓글입니다. 더블클릭해서 수정하고 Enter를 누르세요.\nShift+Enter로 줄바꿈도 가능합니다.', createdAt: '2025.05.07', likeCount: 2, isLiked: true },
                { id: 103, postId: postId, author: '또 다른 나', authorId: LOGGED_IN_USER_ID, content: '이것도 내 댓글. ESC로 수정 취소도 가능해요.', createdAt: '2025.05.07', likeCount: 0, isLiked: false },
            ];

            if (postId === "error_test") { // 에러 테스트용
                setError("서버에서 데이터를 가져오는 중 오류가 발생했습니다.");
                setPost(null);
            } else {
                setPost(fetchedPost);
                setComments(fetchedComments);
                setTotalPages(2); // 예시 댓글 총 페이지 수
                setIsPostReported(false); // 게시글 로드 시 신고 상태 초기화 (실제로는 사용자별 이력 필요)
            }
            setIsLoading(false);
        }, 1200); // 딜레이 약간 늘림
    }, [postId]);

    // --- 댓글 수정 textarea 자동 포커스 ---
    useEffect(() => {
        if (editingCommentId && editInputRef.current) {
            editInputRef.current.focus();
            const len = editInputRef.current.value.length;
            editInputRef.current.selectionStart = len;
            editInputRef.current.selectionEnd = len;
        }
    }, [editingCommentId]);

    // --- 이벤트 핸들러 함수 ---
    const handlePostLikeClick = () => {
        if (!post) return;
        console.log("게시글 좋아요 토글 실행:", post.id, !post.isLikedByCurrentUser);
        setPost(prevPost => {
            const newIsLiked = !prevPost.isLikedByCurrentUser;
            const newLikeCount = newIsLiked ? prevPost.likeCount + 1 : prevPost.likeCount - 1;
            // TODO: API로 서버에 좋아요 상태 업데이트
            return {
                ...prevPost,
                isLikedByCurrentUser: newIsLiked,
                likeCount: newLikeCount < 0 ? 0 : newLikeCount,
            };
        });
    };

    const handlePostReportClick = () => {
        if (!post || isPostReported) return;
        if (window.confirm("이 게시물을 신고하시겠습니까? 신고 후에는 이 세션에서 취소할 수 없습니다.")) {
            console.log("게시글 신고 처리:", post.id);
            setIsPostReported(true);
            // TODO: API로 서버에 신고 정보 전송
            alert("게시물이 신고되었습니다.");
        }
    };

    const handlePostEditClick = () => {
        console.log(`게시글 ID ${post.id} 수정 페이지로 이동 요청`);
        navigate(`/freeboard/${post.id}/edit`);
    };

    const handlePostDeleteClick = () => {
        if (window.confirm("정말로 이 게시글을 삭제하시겠습니까? (임시 버튼)")) {
            console.log(`게시글 ID ${post.id} 삭제 처리 요청`);
            // TODO: API로 게시글 삭제 요청
            // navigate('/freeboard'); // 성공 시 목록으로 이동
        }
    };

    const handleCommentLikeToggle = (commentId) => {
        console.log(`댓글 ID ${commentId} 좋아요 토글`);
        setComments(prevComments =>
            prevComments.map(comment =>
                comment.id === commentId
                    ? { ...comment, isLiked: !comment.isLiked, likeCount: comment.isLiked ? Math.max(0, comment.likeCount - 1) : comment.likeCount + 1 }
                    : comment
            )
        );
        // TODO: API로 댓글 좋아요 상태 업데이트
    };

    const handleCommentReportClick = (commentId) => {
        if(window.confirm(`댓글 ID ${commentId}을(를) 신고하시겠습니까?`)){
            console.log(`댓글 ID ${commentId} 신고 처리`);
            // TODO: API로 댓글 신고 처리
            alert(`댓글 ID ${commentId}이(가) 신고되었습니다.`);
        }
    };

    const handleCommentDeleteClick = (commentId) => {
        if (window.confirm(`댓글 ID ${commentId}을(를) 정말로 삭제하시겠습니까?`)) {
            console.log(`댓글 ID ${commentId} 삭제 처리`);
            setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
            // TODO: API로 댓글 삭제 처리
        }
    };

    const handleCommentInputChange = (event) => {
        setCommentInput(event.target.value);
    };

    const handleCommentFormSubmit = (event) => {
        event.preventDefault();
        if (!commentInput.trim()) {
            alert("댓글 내용을 입력해주세요.");
            return;
        }
        console.log("새 댓글 등록:", commentInput, "for postId:", postId);
        const newComment = {
            id: Date.now(), // 임시 ID
            postId: postId,
            author: '나 (로그인 사용자)',
            authorId: LOGGED_IN_USER_ID,
            content: commentInput,
            createdAt: new Date().toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\./g, '.').slice(0, -1),
            likeCount: 0,
            isLiked: false
        };
        setComments(prevComments => [newComment, ...prevComments]);
        setCommentInput('');
        // TODO: API로 새 댓글 등록
    };

    const handlePageChange = (pageNumber) => {
        console.log(`댓글 페이지 ${pageNumber}로 이동`);
        setCurrentPage(pageNumber);
        // TODO: 해당 페이지 댓글 목록 API 호출
    };

    const handleCommentDoubleClick = (comment) => {
        if (LOGGED_IN_USER_ID === comment.authorId) {
            setEditingCommentId(comment.id);
            setCurrentEditText(comment.content);
        }
    };

    const handleCommentEditChange = (event) => {
        setCurrentEditText(event.target.value);
    };

    const handleCommentEditKeyDown = (commentId, event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (!currentEditText.trim()) {
                alert("댓글 내용은 비워둘 수 없습니다.");
                const originalComment = comments.find(c => c.id === commentId);
                if (originalComment) setCurrentEditText(originalComment.content);
                return;
            }
            console.log(`댓글 ID ${commentId} 내용 수정 완료:`, currentEditText);
            setComments(prevComments =>
                prevComments.map(c =>
                    c.id === commentId ? { ...c, content: currentEditText } : c
                )
            );
            setEditingCommentId(null);
            // TODO: API로 댓글 수정 내용 전송
        } else if (event.key === 'Escape') {
            event.preventDefault();
            setEditingCommentId(null);
        }
    };

    // --- 로딩 및 에러 처리 UI ---
    if (isLoading) {
        return <div className={freeboardDetailStyle.loadingContainer}>게시글을 불러오는 중입니다...</div>;
    }
    if (error) {
        return <div className={freeboardDetailStyle.errorContainer}>오류: {error}</div>;
    }
    if (!post) {
        return <div className={freeboardDetailStyle.errorContainer}>게시글을 찾을 수 없습니다.</div>;
    }

    return (
        <div className={freeboardDetailStyle.pageContainer}>
            <div className={freeboardDetailStyle.boardLinkContainer}>
                <Link to="/freeboard">
                    <h2>자유게시판</h2>
                </Link>
            </div>

            {post.bannerImageUrl && (
                <div className={freeboardDetailStyle.imageBannerContainer}>
                    <img src={banner} alt="게시판 배너" className={freeboardDetailStyle.bannerImage} />
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
                            {post.isLikedByCurrentUser ? '❤️' : '🤍'}
                        </button>
                        <span>좋아요: {post.likeCount}</span>
                        <span>조회수: {post.viewCount}</span>
                    </div>
                    <button
                        onClick={handlePostReportClick}
                        className={`${freeboardDetailStyle.reportButton} ${isPostReported ? freeboardDetailStyle.reported : ''}`}
                        disabled={isPostReported}
                    >
                        {isPostReported ? '신고됨' : '신고'}
                    </button>
                </div>

                <div className={freeboardDetailStyle.postBody}>
                    {post.content.split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                            {line}
                            <br />
                        </React.Fragment>
                    ))}
                </div>
                
                {true && ( // 게시글 수정/삭제 버튼 (위치 확인을 위해 항상 표시되도록 임시 설정)
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
                <h3>댓글 ({comments.length})</h3>
                {comments.length > 0 ? (
                    comments.map(comment => (
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
                                    <button onClick={() => handleCommentLikeToggle(comment.id)} className={freeboardDetailStyle.commentLikeButton} aria-label="댓글 좋아요">
                                        {comment.isLiked ? '❤️' : '🤍'}
                                    </button>
                                    <span className={freeboardDetailStyle.commentLikeCount}>{comment.likeCount}</span>
                                </div>
                                {LOGGED_IN_USER_ID !== comment.authorId && ( // 자신의 댓글이 아닐 때만 신고 버튼 표시
                                    <button onClick={() => handleCommentReportClick(comment.id)} className={`${freeboardDetailStyle.reportButton} ${freeboardDetailStyle.commentReportButton}`}>신고</button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className={freeboardDetailStyle.noComments}>등록된 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
                )}
            </div>

            {comments.length > 0 && totalPages > 1 && (
                 <div className={freeboardDetailStyle.commentPaginationContainer}>
                    <div>
                        {[...Array(totalPages).keys()].map(num => (
                            <button
                                key={num + 1}
                                onClick={() => handlePageChange(num + 1)}
                                className={`${freeboardDetailStyle.paginationButton} ${currentPage === num + 1 ? freeboardDetailStyle.activePage : ''}`}
                            >
                                {num + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FreeboardDetail;