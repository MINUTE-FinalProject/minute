// src/pages/Admin/ManagerFreeboardDetail.jsx (또는 해당 파일의 실제 경로)
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import reportOffIcon from "../../assets/images/able-alarm.png";
import likeOffIcon from "../../assets/images/b_thumbup.png";
import reportOnIcon from "../../assets/images/disable-alarm.png";
import likeOnIcon from "../../assets/images/thumbup.png";
import Modal from '../../components/Modal/Modal'; // Modal 컴포넌트 import
import Pagination from '../../components/Pagination/Pagination';
import styles from './ManagerFreeboardDetail.module.css';

const LOGGED_IN_ADMIN_ID = 'adminUser'; 

function ManagerFreeboardDetail() {
    const { postId } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isPostReportedByAdmin, setIsPostReportedByAdmin] = useState(false); 
    const [reportedCommentIdsByAdmin, setReportedCommentIdsByAdmin] = useState([]);

    const [currentCommentPage, setCurrentCommentPage] = useState(1);
    const commentsPerPage = 5;

    const [newComment, setNewComment] = useState('');
    const newCommentInputRef = useRef(null);

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [currentEditText, setCurrentEditText] = useState('');
    const editInputRef = useRef(null);

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
                title: `관리자 확인용 게시글 (ID: ${postId})`,
                author: '사용자A',
                authorId: 'user123',
                createdAt: '2025.05.01',
                likeCount: 35,
                isLikedByCurrentUser: postId === '1' || postId === 'adminPost1',
                viewCount: 250,
                content: `이것은 ID ${postId} 게시글의 내용입니다. 관리자 페이지에서 확인 중입니다.\n\n여러 줄의 내용도 표시됩니다.\n\n- 항목 1\n- 항목 2\n\n목업 데이터입니다.`,
            };
            const fetchedComments = Array.from({ length: 17 }, (_, i) => ({
                id: `comment-${101 + i}`,
                postId: postId,
                author: i % 4 === 0 ? '관리자' : `댓글러${i + 1}`,
                authorId: i % 4 === 0 ? LOGGED_IN_ADMIN_ID : `user${100 + i}`,
                content: `게시글 ID ${postId}에 대한 ${i + 1}번째 댓글입니다. ${i % 4 === 0 ? '이것은 관리자가 작성한 댓글입니다. 더블클릭하면 수정 가능합니다.' : '일반 사용자가 작성한 댓글입니다.'}`,
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
                setIsPostReportedByAdmin(postId === "adminReportedPostExample"); 
                setReportedCommentIdsByAdmin(['comment-102', 'comment-107']);
            }
            setIsLoading(false);
            setCurrentCommentPage(1);
        }, 800);
    }, [postId]);

    useEffect(() => {
        if (editingCommentId && editInputRef.current) {
            editInputRef.current.focus();
            const len = editInputRef.current.value.length;
            editInputRef.current.selectionStart = len;
            editInputRef.current.selectionEnd = len;
        }
    }, [editingCommentId]);

    const handlePostLikeClick = () => {
        if (!post) return;
        setPost(prevPost => ({
            ...prevPost,
            isLikedByCurrentUser: !prevPost.isLikedByCurrentUser,
            likeCount: prevPost.isLikedByCurrentUser ? prevPost.likeCount - 1 : prevPost.likeCount + 1,
        }));
    };

    const processAdminPostReport = () => {
        console.log(`관리자: 게시글 ID ${post.id} 신고 처리`);
        setIsPostReportedByAdmin(true);
        setModalProps({
            title: '신고 처리 완료',
            message: `관리자: 게시글(ID: ${post.id})을 성공적으로 신고 처리했습니다.`,
            confirmText: '확인',
            type: 'success',
            confirmButtonType: 'primary'
        });
        setIsModalOpen(true);
    };

    const handlePostReportClickByAdmin = () => {
        if (!post || isPostReportedByAdmin) return; 
        setModalProps({
            title: '게시글 신고 처리',
            message: '관리자 권한으로 이 게시글을 신고 처리하시겠습니까?\n이 작업은 되돌릴 수 없습니다.',
            onConfirm: processAdminPostReport,
            confirmText: '신고 처리',
            cancelText: '취소',
            type: 'warning',
            confirmButtonType: 'danger'
        });
        setIsModalOpen(true);
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
    
    const processAdminCommentReport = (commentIdToReport) => {
        console.log(`관리자: 댓글 ID ${commentIdToReport} 신고 처리`);
        setReportedCommentIdsByAdmin(prevIds => [...prevIds, commentIdToReport]);
        setModalProps({
            title: '신고 처리 완료',
            message: `관리자: 댓글(ID: ${commentIdToReport})을 성공적으로 신고 처리했습니다.`,
            confirmText: '확인',
            type: 'success',
            confirmButtonType: 'primary'
        });
        setIsModalOpen(true);
    };

    const handleCommentReportClickByAdmin = (commentId) => {
        if (reportedCommentIdsByAdmin.includes(commentId)) return; 
        
        const comment = comments.find(c => c.id === commentId);
        if (!comment || comment.authorId === LOGGED_IN_ADMIN_ID) {
            return;
        }
        setModalProps({
            title: '댓글 신고 처리',
            message: `관리자 권한으로 이 댓글(ID: ${commentId})을 신고 처리하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
            onConfirm: () => processAdminCommentReport(commentId),
            confirmText: '신고 처리',
            cancelText: '취소',
            type: 'warning',
            confirmButtonType: 'danger'
        });
        setIsModalOpen(true);
    };

    const handleNewCommentChange = (e) => setNewComment(e.target.value);

    const handleSubmitNewComment = () => {
        if (!newComment.trim()) {
            setModalProps({
                title: '입력 오류',
                message: '댓글 내용을 입력해주세요.',
                confirmText: '확인',
                type: 'warning',
                confirmButtonType: 'primary'
            });
            setIsModalOpen(true);
            newCommentInputRef.current?.focus();
            return;
        }
        const newCommentData = {
            id: `comment-${Date.now()}`, 
            postId: postId,
            author: '관리자', 
            authorId: LOGGED_IN_ADMIN_ID, 
            content: newComment,
            createdAt: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.$/, '').replace(/ /g, ''),
            likeCount: 0,
            isLiked: false,
        };
        setComments(prevComments => [newCommentData, ...prevComments]);
        setNewComment('');
        console.log("관리자 댓글 등록 완료 (알림창 없이)"); // 성공 알림 모달 제거, 콘솔 로그로 대체
        setCurrentCommentPage(1); 
    };

    const handleCommentDoubleClick = (comment) => {
        if (comment.authorId === LOGGED_IN_ADMIN_ID) {
            setEditingCommentId(comment.id);
            setCurrentEditText(comment.content);
        }
    };

    const handleCommentEditChange = (event) => setCurrentEditText(event.target.value);

    const saveAdminCommentEdit = (commentId) => {
        if (!currentEditText.trim()) {
            setModalProps({
                title: '입력 오류',
                message: '댓글 내용은 비워둘 수 없습니다.',
                confirmText: '확인',
                type: 'warning',
                confirmButtonType: 'primary'
            });
            setIsModalOpen(true);
            const originalComment = comments.find(c => c.id === commentId);
            if (originalComment) setCurrentEditText(originalComment.content);
            return;
        }
        setComments(prevComments =>
            prevComments.map(c =>
                c.id === commentId ? { ...c, content: currentEditText } : c
            )
        );
        setEditingCommentId(null);
        setModalProps({
            title: '수정 완료',
            message: `관리자: 댓글(ID: ${commentId})이 성공적으로 수정되었습니다.`,
            confirmText: '확인',
            type: 'success',
            confirmButtonType: 'primary'
        });
        setIsModalOpen(true);
    };

    const handleCommentEditKeyDown = (commentId, event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            saveAdminCommentEdit(commentId);
        } else if (event.key === 'Escape') {
            event.preventDefault();
            const originalComment = comments.find(c => c.id === commentId);
            if (originalComment) setCurrentEditText(originalComment.content);
            setEditingCommentId(null);
        }
    };
    
    const handleCancelCommentEdit = (commentId) => {
        const originalComment = comments.find(c => c.id === commentId);
        if (originalComment) setCurrentEditText(originalComment.content);
        setEditingCommentId(null);
    };

    const processAdminCommentDelete = (commentIdToDelete) => {
        console.log(`관리자: 댓글 ID ${commentIdToDelete} 삭제 처리`);
        setComments(prevComments => prevComments.filter(comment => comment.id !== commentIdToDelete));
        setModalProps({
            title: '삭제 완료',
            message: `관리자: 댓글(ID: ${commentIdToDelete})이 삭제되었습니다.`,
            confirmText: '확인',
            type: 'success',
            confirmButtonType: 'primary'
        });
        setIsModalOpen(true);
    };

    const handleDeleteComment = (commentId) => {
        setModalProps({
            title: '댓글 삭제 확인',
            message: `관리자: 이 댓글(ID: ${commentId})을 정말 삭제하시겠습니까?`,
            onConfirm: () => processAdminCommentDelete(commentId),
            confirmText: '삭제',
            cancelText: '취소',
            type: 'warning',
            confirmButtonType: 'danger'
        });
        setIsModalOpen(true);
    };

    const totalCommentPages = Math.ceil(comments.length / commentsPerPage);
    const indexOfLastComment = currentCommentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentDisplayedComments = comments.slice(indexOfFirstComment, indexOfLastComment);

    const handleCommentPageChange = (pageNumber) => {
        setCurrentCommentPage(pageNumber);
    };

    if (isLoading) return ( <div className={styles.container}><main className={styles.managerFreeboardDetailContentCard}><div className={styles.loadingContainer}>데이터 로딩 중...</div></main></div> );
    if (error) return ( <div className={styles.container}><main className={styles.managerFreeboardDetailContentCard}><div className={styles.errorContainer}>오류: {error}</div></main></div> );
    if (!post) return ( <div className={styles.container}><main className={styles.managerFreeboardDetailContentCard}><div className={styles.errorContainer}>게시글을 찾을 수 없습니다.</div></main></div> );

    return (
        <>
            <div className={styles.container}>
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
                                    title={post.isLikedByCurrentUser ? "좋아요 취소 (관리자)" : "좋아요 (관리자)"}
                                >
                                    <img src={post.isLikedByCurrentUser ? likeOnIcon : likeOffIcon} alt="좋아요 상태" className={styles.buttonIcon}/>
                                </button>
                                <span className={styles.countText}>좋아요: {post.likeCount}</span>
                                <span className={styles.countText}>조회수: {post.viewCount}</span>
                            </div>
                            <button
                                onClick={handlePostReportClickByAdmin}
                                className={`${styles.iconButton} ${isPostReportedByAdmin ? styles.reported : ''}`}
                                disabled={isPostReportedByAdmin}
                                title={isPostReportedByAdmin ? "관리자가 신고 처리한 게시글" : "관리자 권한으로 신고 처리"}
                            >
                                <img src={isPostReportedByAdmin ? reportOnIcon : reportOffIcon} alt="게시글 신고 상태" className={styles.buttonIcon}/>
                            </button>
                        </div>
                        <div className={styles.postBody}>
                            {post.content.split('\n').map((line, index) => (
                                <React.Fragment key={index}>{line}{index < post.content.split('\n').length -1 && <br />}</React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className={styles.commentSection}>
                        <div className={styles.commentInputContainer}>
                            <h4 className={styles.commentInputTitle}>관리자 댓글 작성</h4>
                            <textarea
                                ref={newCommentInputRef}
                                className={styles.commentTextarea}
                                value={newComment}
                                onChange={handleNewCommentChange}
                                placeholder="관리자 댓글을 입력하세요..."
                                rows="5"
                            />
                            <div className={styles.commentSubmitButtonContainer}>
                                <button type="button" onClick={handleSubmitNewComment} className={`${styles.button} ${styles.submitButton}`}>
                                    댓글 등록
                                </button>
                            </div>
                        </div>
                        
                        <div className={styles.commentListContainer}>
                            <h3>댓글 ({comments.length})</h3>
                            {currentDisplayedComments.length > 0 ? (
                                currentDisplayedComments.map(comment => {
                                    const isOwnComment = comment.authorId === LOGGED_IN_ADMIN_ID;
                                    const isAdminReportedThisComment = reportedCommentIdsByAdmin.includes(comment.id);
                                    
                                    return (
                                        <div key={comment.id} className={styles.commentItem}>
                                            <div className={styles.commentMeta}>
                                                <div>
                                                    <span className={`${styles.commentAuthor} ${isOwnComment ? styles.adminAuthor : ''}`}>
                                                        {comment.author}
                                                        {isOwnComment && <span className={styles.adminBadge}>관리자</span>}
                                                    </span>
                                                    <span className={styles.commentCreatedAt}>{comment.createdAt}</span>
                                                </div>
                                                {isOwnComment && editingCommentId !== comment.id && (
                                                    <div className={styles.commentAdminActions}>
                                                        <button 
                                                            onClick={() => handleDeleteComment(comment.id)} 
                                                            className={`${styles.button} ${styles.deleteCommentButton}`}
                                                        >
                                                            삭제
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {editingCommentId === comment.id && isOwnComment ? (
                                                <div>
                                                    <textarea
                                                        ref={editInputRef}
                                                        className={styles.commentEditTextarea}
                                                        value={currentEditText}
                                                        onChange={handleCommentEditChange}
                                                        onKeyDown={(e) => handleCommentEditKeyDown(comment.id, e)}
                                                        rows="3"
                                                    />
                                                    <div className={styles.editActionsContainer}>
                                                        <button onClick={() => saveAdminCommentEdit(comment.id)} className={`${styles.button} ${styles.saveCommentButton}`}>저장</button> {/* saveAdminCommentEdit 호출로 변경 */}
                                                        <button onClick={() => handleCancelCommentEdit(comment.id)} className={`${styles.button} ${styles.cancelEditButton}`}>취소</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p
                                                    className={styles.commentContent}
                                                    onDoubleClick={() => isOwnComment && handleCommentDoubleClick(comment)}
                                                    title={isOwnComment ? "더블클릭하여 수정" : ""}
                                                >
                                                    {comment.content.split('\n').map((line, index) => (
                                                        <React.Fragment key={index}>{line}{index < comment.content.split('\n').length -1 && <br />}</React.Fragment>
                                                    ))}
                                                </p>
                                            )}

                                            <div className={styles.commentActions}>
                                                <div>
                                                    <button onClick={() => handleCommentLikeToggle(comment.id)} className={`${styles.iconButton} ${comment.isLiked ? styles.liked : ''}`} title={comment.isLiked ? "좋아요 취소" : "좋아요"}>
                                                        <img src={comment.isLiked ? likeOnIcon : likeOffIcon} alt="댓글 좋아요" className={styles.buttonIcon} />
                                                    </button>
                                                    <span className={styles.countText}>{comment.likeCount}</span>
                                                </div>
                                                {!isOwnComment && (
                                                    <button 
                                                        onClick={() => handleCommentReportClickByAdmin(comment.id)}
                                                        className={`${styles.iconButton} ${isAdminReportedThisComment ? styles.reported : ''}`}
                                                        disabled={isAdminReportedThisComment}
                                                        title={isAdminReportedThisComment ? "관리자가 신고 처리한 댓글" : "관리자 권한으로 신고 처리"}
                                                    >
                                                        <img 
                                                            src={isAdminReportedThisComment ? reportOnIcon : reportOffIcon} 
                                                            alt="댓글 신고 상태" 
                                                            className={styles.buttonIcon} 
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })
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

export default ManagerFreeboardDetail;