// src/pages/Board/FreeboardDetail.jsx (또는 해당 파일의 실제 경로)
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import banner from "../../assets/images/banner.png";
import freeboardDetailStyle from './freeboardDetail.module.css';

import reportOffIcon from "../../assets/images/able-alarm.png";
import likeOffIcon from "../../assets/images/b_thumbup.png";
import reportOnIcon from "../../assets/images/disable-alarm.png";
import likeOnIcon from "../../assets/images/thumbup.png";

import Modal from '../../components/Modal/Modal'; // Modal 컴포넌트 import
import Pagination from '../../components/Pagination/Pagination';

const LOGGED_IN_USER_ID = 'user456';

function FreeboardDetail() {
    const { postId } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [allComments, setAllComments] = useState([]);
    
    const [commentInput, setCommentInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reportedCommentIds, setReportedCommentIds] = useState([]);
    
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [currentEditText, setCurrentEditText] = useState('');
    const editInputRef = useRef(null);
    const [isPostReported, setIsPostReported] = useState(false);

    const [currentCommentPage, setCurrentCommentPage] = useState(1);
    const commentsPerPage = 5; // const [totalCommentPages, setTotalCommentPages] = useState(1); 는 useEffect에서 계산되므로 제거 가능

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
        setIsLoading(true);
        setError(null);
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
                content: `이것은 ID ${postId} 게시글의 최종 내용입니다.\n\n모든 기능이 통합되었습니다:\n- 게시글 좋아요 토글\n- 게시글 신고 (일회성, 비활성화)\n- 댓글 인라인 수정 (더블클릭 후 Enter 또는 버튼)\n- 기타 기본 기능들...\n\n즐겁게 테스트해보세요!`,
                bannerImageUrl: banner,
            };
            const fetchedComments = Array.from({ length: 17 }, (_, i) => ({
                id: `comment-${101 + i}`,
                postId: postId,
                author: i % 3 === 0 ? '나 (로그인 사용자)' : `댓글러${i + 1}`,
                authorId: i % 3 === 0 ? LOGGED_IN_USER_ID : `user${700 + i}`,
                content: `게시글 ID ${postId}에 대한 ${i + 1}번째 댓글입니다. 댓글 내용 테스트! ${i % 3 === 0 ? '이 댓글은 더블클릭하거나, 수정 중에는 버튼으로 저장/취소 가능합니다.' : ''}`,
                createdAt: `2025.05.${String(7 + (i % 5)).padStart(2, '0')}`,
                likeCount: Math.floor(Math.random() * 6),
                isLiked: i % 4 === 0, 
            }));

            if (postId === "error_test") {
                setError("서버에서 데이터를 가져오는 중 오류가 발생했습니다.");
                setPost(null);
            } else {
                setPost(fetchedPost);
                setAllComments(fetchedComments);
                // setTotalCommentPages(Math.ceil(fetchedComments.length / commentsPerPage)); // useEffect에서 allComments 변경 시 계산
                setIsPostReported(postId === 'reportedPostByUser'); 
                setReportedCommentIds(['comment-103', 'comment-108']); 
            }
            setIsLoading(false);
            setCurrentCommentPage(1);
        }, 1200);
    }, [postId]);
    
    // totalCommentPages는 allComments가 변경될 때마다 다시 계산
    const totalCommentPages = Math.ceil(allComments.length / commentsPerPage);

    useEffect(() => {
        if (editingCommentId && editInputRef.current) {
            editInputRef.current.focus();
            const len = editInputRef.current.value.length;
            editInputRef.current.selectionStart = len;
            editInputRef.current.selectionEnd = len;
        }
    }, [editingCommentId]);

    const indexOfLastComment = currentCommentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentDisplayedComments = allComments.slice(indexOfFirstComment, indexOfLastComment);

    const handleCommentPageChange = (pageNumber) => {
        setCurrentCommentPage(pageNumber);
    };

    const handlePostLikeClick = () => {
        if (!post) return;
        setPost(prevPost => ({
            ...prevPost,
            isLikedByCurrentUser: !prevPost.isLikedByCurrentUser,
            likeCount: prevPost.isLikedByCurrentUser ? prevPost.likeCount - 1 : prevPost.likeCount + 1,
        }));
    };

    // --- 게시글 신고 ---
    const processPostReport = () => {
        console.log(`게시글 ID ${post.id} 신고 처리`);
        setIsPostReported(true); // UI 즉시 반영
        // TODO: API로 실제 신고 로직 호출

        setModalProps({
            title: '신고 완료',
            message: '게시물이 성공적으로 신고되었습니다.',
            confirmText: '확인',
            type: 'success',
            confirmButtonType: 'primary'
        });
        setIsModalOpen(true); // 성공 알림 다시 열기
    };

    const handlePostReportClick = () => {
        if (!post || isPostReported) return;
        setModalProps({
            title: '게시물 신고',
            message: '이 게시물을 신고하시겠습니까?\n신고 후에는 취소할 수 없습니다.',
            onConfirm: processPostReport,
            confirmText: '신고하기',
            cancelText: '취소',
            type: 'warning',
            confirmButtonType: 'danger'
        });
        setIsModalOpen(true);
    };

    // --- 게시글 수정 (권한 확인) ---
    const handlePostEditClick = () => {
        if (post && post.authorId === LOGGED_IN_USER_ID) {
            navigate(`/freeboardEdit/${post.id}`);
        } else {
            setModalProps({
                title: '권한 알림',
                message: '본인이 작성한 글만 수정할 수 있습니다.',
                confirmText: '확인',
                type: 'error',
                confirmButtonType: 'primary'
            });
            setIsModalOpen(true);
        }
    };

    // --- 게시글 삭제 ---
    const processPostDelete = () => {
        console.log(`게시글 ID ${post.id} 삭제 처리 요청`);
        // TODO: API로 실제 삭제 로직 호출
        setModalProps({
            title: '삭제 완료',
            message: '게시글이 삭제되었습니다.',
            confirmText: '확인',
            onConfirm: () => navigate('/freeboard'), // 확인 후 목록으로 이동
            type: 'success',
            confirmButtonType: 'primary'
        });
        setIsModalOpen(true);
    };

    const handlePostDeleteClick = () => {
        if (post && post.authorId === LOGGED_IN_USER_ID) {
            setModalProps({
                title: '게시글 삭제',
                message: `"${post.title}" 게시글을 정말로 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`,
                onConfirm: processPostDelete,
                confirmText: '삭제',
                cancelText: '취소',
                type: 'warning', // 또는 'error'
                confirmButtonType: 'danger'
            });
            setIsModalOpen(true);
        } else {
            setModalProps({
                title: '권한 알림',
                message: '본인이 작성한 글만 삭제할 수 있습니다.',
                confirmText: '확인',
                type: 'error',
                confirmButtonType: 'primary'
            });
            setIsModalOpen(true);
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

    // --- 댓글 신고 ---
    const processCommentReport = (commentIdToReport) => {
        console.log(`댓글 ID ${commentIdToReport} 신고 처리`);
        setReportedCommentIds(prevIds => [...prevIds, commentIdToReport]);
        // TODO: API로 실제 신고 로직 호출
        setModalProps({
            title: '신고 완료',
            message: `댓글 ID ${commentIdToReport}이(가) 신고되었습니다.`,
            confirmText: '확인',
            type: 'success',
            confirmButtonType: 'primary'
        });
        setIsModalOpen(true);
    };

    const handleCommentReportClick = (commentId) => {
        if (reportedCommentIds.includes(commentId)) return; 
        const commentToReport = allComments.find(c => c.id === commentId);
        if (commentToReport && commentToReport.authorId === LOGGED_IN_USER_ID) {
            setModalProps({
                title: '신고 불가',
                message: '자신이 작성한 댓글은 신고할 수 없습니다.',
                confirmText: '확인',
                type: 'error',
                confirmButtonType: 'primary'
            });
            setIsModalOpen(true);
            return;
        }
        setModalProps({
            title: '댓글 신고',
            message: `이 댓글을 신고하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
            onConfirm: () => processCommentReport(commentId),
            confirmText: '신고하기',
            cancelText: '취소',
            type: 'warning',
            confirmButtonType: 'danger'
        });
        setIsModalOpen(true);
    };

    // --- 댓글 삭제 ---
    const processCommentDelete = (commentIdToDelete) => {
        console.log(`댓글 ID ${commentIdToDelete} 삭제 처리`);
        setAllComments(prevComments => prevComments.filter(comment => comment.id !== commentIdToDelete));
        // TODO: API로 실제 삭제 로직 호출
        // totalCommentPages는 allComments 변경에 따라 자동으로 useEffect에서 재계산됨
        setModalProps({
            title: '삭제 완료',
            message: '댓글이 삭제되었습니다.',
            confirmText: '확인',
            type: 'success',
            confirmButtonType: 'primary'
        });
        setIsModalOpen(true);
    };

    const handleCommentDeleteClick = (commentId) => {
        const commentToDelete = allComments.find(c => c.id === commentId);
        if (commentToDelete && commentToDelete.authorId !== LOGGED_IN_USER_ID) {
            setModalProps({
                title: '권한 알림',
                message: '본인이 작성한 댓글만 삭제할 수 있습니다.',
                confirmText: '확인',
                type: 'error',
                confirmButtonType: 'primary'
            });
            setIsModalOpen(true);
            return;
        }
        setModalProps({
            title: '댓글 삭제',
            message: `댓글 ID ${commentId}을(를) 정말로 삭제하시겠습니까?`,
            onConfirm: () => processCommentDelete(commentId),
            confirmText: '삭제',
            cancelText: '취소',
            type: 'warning',
            confirmButtonType: 'danger'
        });
        setIsModalOpen(true);
    };

    const handleCommentInputChange = (event) => setCommentInput(event.target.value);

    const handleCommentFormSubmit = (event) => {
        event.preventDefault();
        if (!commentInput.trim()) {
            setModalProps({
                title: '입력 오류',
                message: '댓글 내용을 입력해주세요.',
                confirmText: '확인',
                type: 'warning',
                confirmButtonType: 'primary'
            });
            setIsModalOpen(true);
            return;
        }
        const newComment = {
            id: `comment-${Date.now()}`, 
            postId: postId,
            author: '나 (로그인 사용자)', 
            authorId: LOGGED_IN_USER_ID,
            content: commentInput,
            createdAt: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.$/, '').replace(/ /g, ''),
            likeCount: 0,
            isLiked: false
        };
        setAllComments(prevComments => [newComment, ...prevComments]);
        // totalCommentPages는 allComments 변경에 따라 자동으로 useEffect에서 재계산됨
        setCommentInput('');
        // setCurrentCommentPage(1); // 새 댓글 작성 후 1페이지로 이동 옵션
    };

    const handleCommentDoubleClick = (comment) => {
        if (LOGGED_IN_USER_ID === comment.authorId) {
            setEditingCommentId(comment.id);
            setCurrentEditText(comment.content);
        }
    };

    const handleCommentEditChange = (event) => setCurrentEditText(event.target.value);

    // --- 댓글 수정 저장 ---
    const saveCommentEdit = (commentId) => {
        if (!currentEditText.trim()) {
            setModalProps({
                title: '입력 오류',
                message: '댓글 내용은 비워둘 수 없습니다.',
                confirmText: '확인',
                type: 'warning',
                confirmButtonType: 'primary'
            });
            setIsModalOpen(true);
            const originalComment = allComments.find(c => c.id === commentId);
            if (originalComment) setCurrentEditText(originalComment.content); // 원래 내용으로 복원
            return false; // 저장 실패
        }
        setAllComments(prevComments =>
            prevComments.map(c =>
                c.id === commentId ? { ...c, content: currentEditText } : c
            )
        );
        setEditingCommentId(null);
        // 수정 성공 알림 (선택적)
        /*
        setModalProps({
            title: '수정 완료',
            message: '댓글이 성공적으로 수정되었습니다.',
            confirmText: '확인',
            type: 'success',
            confirmButtonType: 'primary'
        });
        setIsModalOpen(true);
        */
        return true; // 저장 성공
    };

    const cancelCommentEdit = (commentId) => {
        const originalComment = allComments.find(c => c.id === commentId);
        if (originalComment) setCurrentEditText(originalComment.content);
        setEditingCommentId(null);
    };

    const handleCommentEditKeyDown = (commentId, event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            saveCommentEdit(commentId);
        } else if (event.key === 'Escape') {
            event.preventDefault();
            cancelCommentEdit(commentId);
        }
    };
    
    if (isLoading) return <div className={freeboardDetailStyle.loadingContainer}>게시글을 불러오는 중입니다...</div>;
    if (error) return <div className={freeboardDetailStyle.errorContainer}>오류: {error}</div>;
    if (!post) return <div className={freeboardDetailStyle.errorContainer}>게시글을 찾을 수 없습니다.</div>;

    return (
        <>
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
                                className={`${freeboardDetailStyle.iconButton} ${post.isLikedByCurrentUser ? freeboardDetailStyle.liked : ''}`}
                                title={post.isLikedByCurrentUser ? "좋아요 취소" : "좋아요"}
                            >
                                <img
                                    src={post.isLikedByCurrentUser ? likeOnIcon : likeOffIcon}
                                    alt={post.isLikedByCurrentUser ? "좋아요 된 상태" : "좋아요 안된 상태"}
                                    className={freeboardDetailStyle.buttonIcon}
                                />
                            </button>
                            <span className={freeboardDetailStyle.countText}>좋아요: {post.likeCount}</span>
                            <span className={freeboardDetailStyle.countText}>조회수: {post.viewCount}</span>
                        </div>
                        <button
                            onClick={handlePostReportClick}
                            className={`${freeboardDetailStyle.iconButton} ${isPostReported ? freeboardDetailStyle.reported : ''}`}
                            disabled={isPostReported}
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
                            <React.Fragment key={index}>{line}{index < post.content.split('\n').length -1 &&<br />}</React.Fragment>
                        ))}
                    </div>
                    {post.authorId === LOGGED_IN_USER_ID && (
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
                    <h3>댓글 ({allComments.length})</h3>
                    {currentDisplayedComments.length > 0 ? (
                        currentDisplayedComments.map(comment => {
                            const isOwnComment = comment.authorId === LOGGED_IN_USER_ID;
                            const isCommentReportedByCurrentUser = reportedCommentIds.includes(comment.id);

                            return (
                                <div key={comment.id} className={freeboardDetailStyle.commentItem}>
                                    <div className={freeboardDetailStyle.commentMeta}>
                                        <div>
                                            <span className={freeboardDetailStyle.commentAuthor}>{comment.author}</span>
                                            <span className={freeboardDetailStyle.commentCreatedAt}>{comment.createdAt}</span>
                                        </div>
                                        {isOwnComment && editingCommentId !== comment.id && (
                                            <div className={freeboardDetailStyle.commentUserActions}>
                                                <button
                                                    onClick={() => handleCommentDeleteClick(comment.id)}
                                                    className={`${freeboardDetailStyle.actionButton} ${freeboardDetailStyle.deleteButton} ${freeboardDetailStyle.commentDeleteButton}`}>
                                                    삭제
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {editingCommentId === comment.id && isOwnComment ? (
                                        <div className={freeboardDetailStyle.commentEditForm}>
                                            <textarea
                                                ref={editInputRef}
                                                className={freeboardDetailStyle.commentEditTextarea}
                                                value={currentEditText}
                                                onChange={handleCommentEditChange}
                                                onKeyDown={(e) => handleCommentEditKeyDown(comment.id, e)}
                                                rows="3"
                                            />
                                            <div className={freeboardDetailStyle.editActionsContainer}>
                                                <button type="button" onClick={() => saveCommentEdit(comment.id)} className={`${freeboardDetailStyle.actionButton} ${freeboardDetailStyle.saveCommentButton}`}>저장</button>
                                                <button type="button" onClick={() => cancelCommentEdit(comment.id)} className={`${freeboardDetailStyle.actionButton} ${freeboardDetailStyle.cancelEditButton}`}>취소</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p
                                            className={freeboardDetailStyle.commentContent}
                                            onDoubleClick={() => isOwnComment && handleCommentDoubleClick(comment)}
                                            title={isOwnComment ? "더블클릭하여 수정" : ""}
                                        >
                                            {comment.content.split('\n').map((line, index) => (
                                                <React.Fragment key={index}>{line}{index < comment.content.split('\n').length -1 && <br />}</React.Fragment>
                                            ))}
                                        </p>
                                    )}

                                    <div className={freeboardDetailStyle.commentActions}>
                                        <div>
                                            <button
                                                onClick={() => handleCommentLikeToggle(comment.id)}
                                                className={`${freeboardDetailStyle.iconButton} ${comment.isLiked ? freeboardDetailStyle.liked : ''}`}
                                                title={comment.isLiked ? "좋아요 취소" : "좋아요"}
                                            >
                                                <img src={comment.isLiked ? likeOnIcon : likeOffIcon} alt={comment.isLiked ? "좋아요 된 상태" : "좋아요 안된 상태"} className={freeboardDetailStyle.buttonIcon}/>
                                            </button>
                                            <span className={freeboardDetailStyle.countText}>{comment.likeCount}</span>
                                        </div>
                                        {!isOwnComment && (
                                            <button
                                                onClick={() => handleCommentReportClick(comment.id)}
                                                className={`${freeboardDetailStyle.iconButton} ${isCommentReportedByCurrentUser ? freeboardDetailStyle.reported : ''}`}
                                                disabled={isCommentReportedByCurrentUser}
                                                title={isCommentReportedByCurrentUser ? "신고됨" : "신고하기"}
                                            >
                                                <img src={isCommentReportedByCurrentUser ? reportOnIcon : reportOffIcon} alt={isCommentReportedByCurrentUser ? "신고 된 상태" : "댓글 신고하기"} className={freeboardDetailStyle.buttonIcon}/>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    ) : ( 
                        allComments.length > 0 ? <p>해당 페이지에 댓글이 없습니다.</p> : <p className={freeboardDetailStyle.noComments}>등록된 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
                    )}
                </div>

                {allComments.length > 0 && totalCommentPages > 1 && (
                    <div className={freeboardDetailStyle.commentPaginationContainer}>
                        <Pagination currentPage={currentCommentPage} totalPages={totalCommentPages} onPageChange={handleCommentPageChange} pageNeighbours={1}/>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalProps.title}
                message={modalProps.message}
                onConfirm={modalProps.onConfirm}
                confirmText={modalProps.confirmText}
                cancelText={modalProps.cancelText}
                onCancel={modalProps.onCancel}
                type={modalProps.type}
                confirmButtonType={modalProps.confirmButtonType}
                cancelButtonType={modalProps.cancelButtonType}
            />
        </>
    );
}

export default FreeboardDetail;