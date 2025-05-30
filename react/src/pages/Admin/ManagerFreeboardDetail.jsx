// src/pages/Admin/ManagerFreeboardDetail.jsx
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from '../../assets/styles/ManagerFreeboardDetail.module.css';

import reportOffIcon from "../../assets/images/able-alarm.png";
import likeOffIcon from "../../assets/images/b_thumbup.png";
import reportOnIcon from "../../assets/images/disable-alarm.png";
import likeOnIcon from "../../assets/images/thumbup.png";

import Modal from '../../components/Modal/Modal';
import Pagination from '../../components/Pagination/Pagination';

const API_BASE_URL = "http://localhost:8080/api/v1";

const getToken = () => localStorage.getItem("token");
const getLoggedInUserIdFromStorage = () => localStorage.getItem("userId");
const isUserLoggedIn = () => !!getToken(); // 이 함수는 이제 이 파일 내에서 사용됩니다.

function ManagerFreeboardDetail() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentPageInfo, setCommentPageInfo] = useState({
        currentPage: 1, totalPages: 0, totalElements: 0,
    });
    const commentsPerPage = 5;

    const [newComment, setNewComment] = useState('');
    const [isLoadingPost, setIsLoadingPost] = useState(true);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [error, setError] = useState(null);
    
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [currentEditText, setCurrentEditText] = useState('');
    const editInputRef = useRef(null);
    const newCommentInputRef = useRef(null);
    const commentsEndRef = useRef(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalProps, setModalProps] = useState({
        title: '', message: '', onConfirm: null, confirmText: '확인',
        cancelText: null, type: 'default', confirmButtonType: 'primary',
        cancelButtonType: 'secondary', onCancel: () => setIsModalOpen(false)
    });

    const loggedInAdminId = getLoggedInUserIdFromStorage();

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return `${date.getFullYear().toString().slice(-2)}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
        } catch (e) { return "N/A"; }
    };
    
    const fetchPostDetail = useCallback(async () => {
        setIsLoadingPost(true); setError(null);
        try {
            const headers = {};
            const token = getToken();
            if (!token && !isUserLoggedIn()) { // 관리자 페이지는 항상 로그인 필요
                setError("관리자 인증이 필요합니다. 로그인해주세요.");
                setIsLoadingPost(false);
                setModalProps({ title: "인증 오류", message: "관리자 로그인이 필요합니다.", onConfirm: () => navigate("/login"), type: 'error' });
                setIsModalOpen(true);
                return;
            }
            if (token) headers.Authorization = `Bearer ${token}`;
            
            const response = await axios.get(`${API_BASE_URL}/board/free/${postId}`, { headers });
            setPost(response.data); 
        } catch (err) {
            console.error("Error fetching post detail for admin:", err);
            setError(err.response?.data?.message || "게시글 정보를 불러오는 데 실패했습니다.");
            setPost(null);
        } finally {
            setIsLoadingPost(false);
        }
    }, [postId, navigate]);

    const fetchComments = useCallback(async (page = 1) => {
        if (!postId) return;
        setIsLoadingComments(true);
        try {
            const headers = {};
            const token = getToken();
            if (token) headers.Authorization = `Bearer ${token}`;
            // 관리자 페이지이므로 댓글 조회 시에도 토큰 필요 가정

            const response = await axios.get(`${API_BASE_URL}/board/free/${postId}/comments`, {
                params: { page: page - 1, size: commentsPerPage, sort: "commentCreatedAt,asc" },
                headers
            });
            const data = response.data;
            setComments(data.content || []);
            setCommentPageInfo({
                currentPage: data.currentPage ? data.currentPage + 1 : 1,
                totalPages: data.totalPages || 0,
                totalElements: data.totalElements || 0,
            });
        } catch (err) { 
            console.error("Error fetching comments for admin:", err);
            setComments([]);
            setCommentPageInfo({ currentPage: 1, totalPages: 0, totalElements: 0 });
        } 
        finally { setIsLoadingComments(false); }
    }, [postId, commentsPerPage]);

    useEffect(() => {
        if (!isUserLoggedIn()) { // 페이지 접근 시 최상단에서 한 번 더 로그인 체크
            navigate("/login"); // 또는 관리자용 로그인 페이지
            return;
        }
        fetchPostDetail();
        fetchComments(1);
    }, [fetchPostDetail, fetchComments, navigate]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const targetCommentId = params.get('highlightCommentId');
        if (targetCommentId && comments.length > 0) {
            const commentElement = document.getElementById(`comment-${targetCommentId}`);
            if (commentElement) {
                commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [location.search, comments]);

    useEffect(() => { 
        if (editingCommentId && editInputRef.current) {
            editInputRef.current.focus();
            const len = editInputRef.current.value.length;
            editInputRef.current.selectionStart = len;
            editInputRef.current.selectionEnd = len;
        }
    }, [editingCommentId]);

    const handleCommentPageChange = (pageNumber) => { fetchComments(pageNumber); };

    const handlePostLikeClickByAdmin = async () => {
        if (!isUserLoggedIn()) { 
            setModalProps({ title: "인증 오류", message: "좋아요는 관리자 로그인 후 가능합니다.", type: 'warning', onConfirm: () => navigate("/login")});
            setIsModalOpen(true); return; 
        }
        if (!post) return;
        try {
            const token = getToken();
            const response = await axios.post(`${API_BASE_URL}/board/free/${post.postId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data;
            setPost(prevPost => ({
                ...prevPost,
                isLikedByCurrentUser: data.likedByCurrentUser, // 백엔드 DTO 필드명: isLikedByCurrentUser
                postLikeCount: data.currentLikeCount,
            }));
        } catch (err) { 
            setModalProps({ title: "오류", message: err.response?.data?.message || "좋아요 처리에 실패했습니다.", type: 'error' });
            setIsModalOpen(true);
        }
    };

    const processAdminPostReport = async () => {
        if (!isUserLoggedIn() || !post || post.reportedByCurrentUser) return; // post.reportedByCurrentUser 사용
        try {
            const token = getToken();
            await axios.post(`${API_BASE_URL}/board/free/${post.postId}/report`, {}, { headers: { Authorization: `Bearer ${token}` }});
            setPost(prev => ({ ...prev, reportedByCurrentUser: true })); 
            setModalProps({ title: '신고 접수', message: `게시글(ID: ${post.postId})을 신고 접수했습니다.`, type: 'success', confirmButtonType: 'primary' });
        } catch (err) { 
            if (err.response && (err.response.status === 409 || err.response.status === 400) ) {
                setModalProps({ title: '알림', message: err.response.data.message || "이미 신고한 게시글입니다.", type: 'warning'});
            } else {
                setModalProps({ title: '오류', message: err.response?.data?.message || "게시글 신고에 실패했습니다.", type: 'error' });
            }
        } finally {
            setIsModalOpen(true);
        }
    };
    const handlePostReportClickByAdmin = () => {
        if (!isUserLoggedIn()) {
            setModalProps({ title: "인증 오류", message: "신고는 관리자 로그인 후 가능합니다.", type: 'warning', onConfirm: () => navigate("/login")});
            setIsModalOpen(true); return; 
        }
        // post.reportedByCurrentUser 사용
        if (!post || post.reportedByCurrentUser) { // 관리자 본인 글도 신고 가능 (정책), 단 이미 신고했으면 불가
            if (post && post.reportedByCurrentUser) {
                 setModalProps({ title: '알림', message: '이미 관리자님께서 신고한 게시글입니다.', type: 'info' });
                 setIsModalOpen(true);
            }
            return;
        }
        setModalProps({
            title: '게시글 신고 (관리자)',
            message: `관리자 권한으로 이 게시글(ID: ${post.postId})을 신고 처리하시겠습니까?`,
            onConfirm: processAdminPostReport,
            confirmText: '신고 처리', cancelText: '취소', type: 'warning', confirmButtonType: 'danger'
        });
        setIsModalOpen(true);
    };

    const handleCommentLikeToggleByAdmin = async (commentId) => {
        if (!isUserLoggedIn()) { /* ... */ }
        try {
            const token = getToken();
            const response = await axios.post(`${API_BASE_URL}/board/free/comments/${commentId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data;
            setComments(prevComments => prevComments.map(c => 
                c.commentId === commentId ? { ...c, isLikedByCurrentUser: data.likedByCurrentUser, commentLikeCount: data.currentLikeCount } : c
            ));
        } catch (err) { /* ... */ }
    };
    
    const processAdminCommentReport = async (commentIdToReport) => {
        if (!isUserLoggedIn()) return;
        try {
            const token = getToken();
            await axios.post(`${API_BASE_URL}/board/free/comments/${commentIdToReport}/report`, {}, { headers: { Authorization: `Bearer ${token}` }});
            setComments(prev => prev.map(c => c.commentId === commentIdToReport ? {...c, reportedByCurrentUser: true } : c)); // 필드명 reportedByCurrentUser
            setModalProps({ title: '신고 접수', message: `댓글(ID: ${commentIdToReport})을 신고 접수했습니다.`, type: 'success', confirmButtonType: 'primary'});
        } catch (err) { /* ... */ } finally { setIsModalOpen(true); }
    };

    const handleCommentReportClickByAdmin = (comment) => {
        if (!isUserLoggedIn()) { /* ... */ }
        // comment.reportedByCurrentUser 와 comment.authorRole 사용
        if (comment.reportedByCurrentUser || comment.userId === loggedInAdminId || comment.authorRole === 'ADMIN') {
            // ... (알림 모달 로직은 이전과 동일)
            return;
        }
        setModalProps({ /* ... 신고 확인 모달 ... */ });
        setIsModalOpen(true);
    };
    
    const handleNewCommentChange = (e) => setNewComment(e.target.value);
    const handleSubmitNewComment = async (event) => { /* ... 이전 API 연동 코드와 동일 ... */ };
    const handleCommentDoubleClick = (comment) => {
        if (isUserLoggedIn() && comment.userId === loggedInAdminId) {
            setEditingCommentId(comment.commentId);
            setCurrentEditText(comment.commentContent);
        }
    };
    const handleCommentEditChange = (event) => setCurrentEditText(event.target.value);
    const saveAdminCommentEdit = async (commentId) => { /* ... 이전 API 연동 코드와 동일 (단, 작성자 확인은 loggedInAdminId 사용) ... */ };
    const cancelAdminCommentEdit = () => { setEditingCommentId(null); };
    const handleCommentEditKeyDown = (commentId, event) => { /* ... 이전과 동일 ... */ };
    
    const processAdminCommentDelete = async (commentIdToDelete) => {
        if (!isUserLoggedIn()) return; 
        const commentToDelete = comments.find(c => c.commentId === commentIdToDelete);
        if (!commentToDelete || commentToDelete.userId !== loggedInAdminId) { // 관리자 본인 댓글만 삭제
            setModalProps({ title: '권한 없음', message: '관리자 본인이 작성한 댓글만 삭제할 수 있습니다.', type: 'error' });
            setIsModalOpen(true);
            return;
        }
        try {
            const token = getToken();
            await axios.delete(`${API_BASE_URL}/board/free/comments/${commentIdToDelete}`, { headers: { Authorization: `Bearer ${token}` }});
            setModalProps({ title: '삭제 완료', message: '댓글이 삭제되었습니다.', type: 'success', confirmButtonType: 'primary' });
            setIsModalOpen(true);
            fetchComments(commentPageInfo.currentPage); 
        } catch (err) { /* ... */ }
    };
    const handleDeleteCommentByAdmin = (comment) => {
        if (isUserLoggedIn() && comment.userId === loggedInAdminId) { // 관리자 본인 댓글만 삭제
            setModalProps({
                title: '댓글 삭제 확인 (관리자)',
                message: `관리자 본인이 작성한 이 댓글(ID: ${comment.commentId})을 정말 삭제하시겠습니까?`,
                onConfirm: () => processAdminCommentDelete(comment.commentId),
                confirmText: '삭제', cancelText: '취소', type: 'warning', confirmButtonType: 'danger'
            });
            setIsModalOpen(true);
        } else {
             // 다른 사람 댓글에 대한 삭제 버튼은 아예 표시하지 않으므로, 이 else는 사실상 도달하지 않음
            setModalProps({ title: "권한 없음", message: "본인 댓글만 삭제할 수 있습니다.", type: 'error'});
            setIsModalOpen(true);
        }
    };

    if (isLoadingPost) return ( <div className={styles.container}><main className={styles.managerFreeboardDetailContentCard}><div className={styles.loadingContainer}>게시글 정보를 불러오는 중...</div></main></div> );
    if (error && !post) return ( <div className={styles.container}><main className={styles.managerFreeboardDetailContentCard}><div className={styles.errorContainer}>오류: {error} <button onClick={() => { fetchPostDetail(); fetchComments(1); }}>다시 시도</button></div></main></div> );
    if (!post) return ( <div className={styles.container}><main className={styles.managerFreeboardDetailContentCard}><div className={styles.errorContainer}>게시글을 찾을 수 없습니다. <Link to="/admin/managerFreeboard">목록으로</Link></div></main></div> );
    
    return (
        <>
            <div className={styles.container}>
                <main className={styles.managerFreeboardDetailContentCard}>
                    <div className={styles.pageHeader}>
                        <Link to="/admin/managerFreeboard" className={styles.toListLink}>
                            <h1>자유게시판 관리</h1>
                        </Link>
                    </div>

                    <div className={styles.postContentContainer}>
                        <h2 className={styles.postTitle}>{post.postTitle} (ID: {post.postId})</h2>
                        <div className={styles.postMeta}>
                            <div>
                                <span className={styles.postAuthor}>작성자: {post.userNickName || 'N/A'} ({post.userId})</span>
                                <span className={styles.postCreatedAt}>{formatDate(post.postCreatedAt)}</span>
                            </div>
                        </div>
                        <div className={styles.postSubMeta}>
                            <div className={styles.postStats}>
                                <button
                                    onClick={handlePostLikeClickByAdmin}
                                    className={`${styles.iconButton} ${post.isLikedByCurrentUser ? styles.liked : ''}`}
                                    title={post.isLikedByCurrentUser ? "좋아요 취소 (관리자)" : "좋아요 (관리자)"}
                                    disabled={!isUserLoggedIn()} 
                                >
                                    <img src={post.isLikedByCurrentUser ? likeOnIcon : likeOffIcon} alt="좋아요 상태" className={styles.buttonIcon}/>
                                </button>
                                <span className={styles.countText}>좋아요: {post.postLikeCount}</span>
                                <span className={styles.countText}>조회수: {post.postViewCount}</span>
                            </div>
                            {isUserLoggedIn() && ( // 관리자는 모든 게시글에 대해 신고 버튼을 볼 수 있음 (본인 신고 여부만 체크)
                                 <button
                                    onClick={handlePostReportClickByAdmin}
                                    className={`${styles.iconButton} ${post.reportedByCurrentUser ? styles.reported : ''}`} // 필드명 reportedByCurrentUser
                                    disabled={post.reportedByCurrentUser}
                                    title={post.reportedByCurrentUser ? "관리자가 신고함" : "관리자가 신고하기"}
                                >
                                    <img src={post.reportedByCurrentUser ? reportOnIcon : reportOffIcon} alt="게시글 신고 상태" className={styles.buttonIcon}/>
                                </button>
                            )}
                        </div>
                        <div className={styles.postBody} dangerouslySetInnerHTML={{ __html: post.postContent?.replace(/\n/g, '<br />') || '' }}></div>
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
                                rows={3} 
                                disabled={!isUserLoggedIn()}
                            />
                            <div className={styles.commentSubmitButtonContainer}>
                                <button 
                                    type="button" 
                                    onClick={handleSubmitNewComment} 
                                    className={`${styles.button} ${styles.submitButton}`}
                                    disabled={!isUserLoggedIn() || !newComment.trim()}
                                >
                                    댓글 등록
                                </button>
                            </div>
                        </div>
                        
                        <div className={styles.commentListContainer}>
                            <h3>댓글 ({commentPageInfo.totalElements || 0})</h3>
                            {isLoadingComments ? <p>댓글 로딩 중...</p> : comments.length > 0 ? (
                                comments.map(comment => {
                                    const isOwnAdminComment = isUserLoggedIn() && comment.userId === loggedInAdminId;
                                    const isOtherAdminComment = !isOwnAdminComment && comment.authorRole === 'ADMIN';
                                    // 필드명 reportedByCurrentUser (백엔드 DTO 확인)
                                    const isCommentReportedByThisAdmin = comment.reportedByCurrentUser || false; 

                                    return (
                                        <div key={comment.commentId} id={`comment-${comment.commentId}`} className={styles.commentItem}>
                                            <div className={styles.commentMeta}>
                                                <div>
                                                    <span className={`${styles.commentAuthor} ${comment.authorRole === 'ADMIN' ? styles.adminAuthor : ''}`}>
                                                        {comment.userNickName || 'N/A'}
                                                        {comment.authorRole === 'ADMIN' && <span className={styles.adminBadge}>관리자</span>}
                                                    </span>
                                                    <span className={styles.commentCreatedAt}>{formatDate(comment.commentCreatedAt)}</span>
                                                </div>
                                                {isOwnAdminComment && editingCommentId !== comment.commentId && (
                                                    <div className={styles.commentAdminActions}>
                                                         <button onClick={() => handleCommentDoubleClick(comment)} className={`${styles.button} ${styles.editCommentButton}`}>수정</button>
                                                         <button onClick={() => handleDeleteCommentByAdmin(comment)} className={`${styles.button} ${styles.deleteCommentButton}`}>삭제</button>
                                                    </div>
                                                )}
                                                {/* 관리자는 다른 사용자/관리자 댓글 삭제 버튼 없음 (본인 댓글만 위에서 처리) */}
                                            </div>
                                            
                                            {editingCommentId === comment.commentId && isOwnAdminComment ? (
                                                <div className={styles.commentEditForm}>
                                                    <textarea
                                                        ref={editInputRef}
                                                        className={styles.commentEditTextarea}
                                                        value={currentEditText}
                                                        onChange={handleCommentEditChange}
                                                        onKeyDown={(e) => handleCommentEditKeyDown(comment.commentId, e)}
                                                        rows="3"
                                                    />
                                                    <div className={styles.editActionsContainer}>
                                                        <button type="button" onClick={() => saveAdminCommentEdit(comment.commentId)} className={`${styles.button} ${styles.saveCommentButton}`}>저장</button>
                                                        <button type="button" onClick={() => cancelAdminCommentEdit()} className={`${styles.button} ${styles.cancelEditButton}`}>취소</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p
                                                    className={styles.commentContent}
                                                    onDoubleClick={() => isOwnAdminComment && handleCommentDoubleClick(comment)}
                                                    title={isOwnAdminComment ? "더블클릭하여 수정" : ""}
                                                    dangerouslySetInnerHTML={{ __html: comment.commentContent?.replace(/\n/g, '<br />') || '' }}
                                                />
                                            )}

                                            <div className={styles.commentActions}>
                                                <div>
                                                    <button 
                                                        onClick={() => handleCommentLikeToggleByAdmin(comment.commentId)} 
                                                        // 필드명 isLikedByCurrentUser (백엔드 DTO 확인)
                                                        className={`${styles.iconButton} ${comment.isLikedByCurrentUser ? styles.liked : ''}`}
                                                        title={comment.isLikedByCurrentUser ? "좋아요 취소" : "좋아요"}
                                                        disabled={!isUserLoggedIn()}
                                                    >
                                                        <img src={comment.isLikedByCurrentUser ? likeOnIcon : likeOffIcon} alt="댓글 좋아요" className={styles.buttonIcon}/>
                                                    </button>
                                                    <span className={styles.countText}>{comment.commentLikeCount}</span>
                                                </div>
                                                {isUserLoggedIn() && !isOwnAdminComment && !isOtherAdminComment && ( // 본인 댓글, 다른 관리자 댓글 신고 불가
                                                    <button
                                                        onClick={() => handleCommentReportClickByAdmin(comment)}
                                                        // 필드명 reportedByCurrentUser (백엔드 DTO 확인)
                                                        className={`${styles.iconButton} ${isCommentReportedByThisAdmin ? styles.reported : ''}`}
                                                        disabled={isCommentReportedByThisAdmin}
                                                        title={isCommentReportedByThisAdmin ? "관리자가 신고함" : "관리자가 신고하기"}
                                                    >
                                                        <img src={isCommentReportedByThisAdmin ? reportOnIcon : reportOffIcon} alt="댓글 신고" className={styles.buttonIcon}/>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : ( <p className={styles.noComments}>
                                {commentPageInfo.totalElements > 0 && commentPageInfo.currentPage > commentPageInfo.totalPages 
                                    ? '마지막 페이지입니다.' 
                                    : '댓글이 없습니다.'}
                                </p>
                            )}
                        </div>
                        
                        {commentPageInfo.totalElements > 0 && commentPageInfo.totalPages > 1 && (
                            <div className={styles.commentPaginationWrapper}>
                                <Pagination 
                                    currentPage={commentPageInfo.currentPage} 
                                    totalPages={commentPageInfo.totalPages} 
                                    onPageChange={handleCommentPageChange} 
                                    pageNeighbours={1}
                                />
                            </div>
                        )}
                        <div ref={commentsEndRef} />
                    </div>
                </main>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} {...modalProps} />
        </>
    );
}

export default ManagerFreeboardDetail;