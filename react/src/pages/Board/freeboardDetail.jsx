// src/pages/Board/FreeboardDetail.jsx
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'; // useLocation 추가
import freeboardDetailStyle from '../../assets/styles/freeboardDetail.module.css';

import reportOffIcon from "../../assets/images/able-alarm.png";
import likeOffIcon from "../../assets/images/b_thumbup.png";
import reportOnIcon from "../../assets/images/disable-alarm.png";
import likeOnIcon from "../../assets/images/thumbup.png";

import Modal from '../../components/Modal/Modal';
import Pagination from '../../components/Pagination/Pagination';

const API_BASE_URL = "http://localhost:8080/api/v1";

function FreeboardDetail() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const location = useLocation(); // URL 쿼리 파라미터(commentId)를 읽기 위해 추가

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentPageInfo, setCommentPageInfo] = useState({
        currentPage: 1,
        totalPages: 0,
        totalElements: 0,
    });
    const commentsPerPage = 5;

    const [commentInput, setCommentInput] = useState('');
    const [isLoadingPost, setIsLoadingPost] = useState(true);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [error, setError] = useState(null);
    
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [currentEditText, setCurrentEditText] = useState('');
    const editInputRef = useRef(null);
    const commentsEndRef = useRef(null); // 새 댓글 작성 후 스크롤용

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalProps, setModalProps] = useState({
        title: '', message: '', onConfirm: null, confirmText: '확인',
        cancelText: null, type: 'default', confirmButtonType: 'primary',
        cancelButtonType: 'secondary', onCancel: () => setIsModalOpen(false)
    });

    const getToken = () => localStorage.getItem("token");
    const getLoggedInUserId = () => localStorage.getItem("userId");
    const isUserLoggedIn = () => !!getToken();

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return `${date.getFullYear().toString().slice(-2)}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
        } catch (e) {
            return "N/A";
        }
    };
    
    const fetchPostDetail = useCallback(async () => {
        setIsLoadingPost(true);
        setError(null);
        try {
            const headers = {};
            const token = getToken();
            if (token) headers.Authorization = `Bearer ${token}`;
            
            const response = await axios.get(`${API_BASE_URL}/board/free/${postId}`, { headers });
            setPost(response.data); // FreeboardPostResponseDTO (isLikedByCurrentUser, reportedByCurrentUser 포함 가정)
        } catch (err) {
            console.error("Error fetching post detail:", err);
            setError(err.response?.data?.message || "게시글을 불러오는 데 실패했습니다. 존재하지 않거나 삭제된 게시글일 수 있습니다.");
            setPost(null);
        } finally {
            setIsLoadingPost(false);
        }
    }, [postId]);

    const fetchComments = useCallback(async (page = 1) => {
        if (!postId) return;
        setIsLoadingComments(true);
        try {
            const headers = {};
            const token = getToken();
            if (token) headers.Authorization = `Bearer ${token}`;

            const response = await axios.get(`${API_BASE_URL}/board/free/${postId}/comments`, {
                params: { page: page - 1, size: commentsPerPage, sort: "commentCreatedAt,asc" },
                headers
            });
            const data = response.data; // PageResponseDTO<FreeboardCommentResponseDTO>
            setComments(data.content || []);
            setCommentPageInfo({
                currentPage: data.currentPage || 1,
                totalPages: data.totalPages || 0,
                totalElements: data.totalElements || 0,
            });
        } catch (err) {
            console.error("Error fetching comments:", err);
            setComments([]);
            setCommentPageInfo({ currentPage: 1, totalPages: 0, totalElements: 0 });
        } finally {
            setIsLoadingComments(false);
        }
    }, [postId, commentsPerPage]);

    useEffect(() => {
        fetchPostDetail();
        fetchComments(1);
    }, [fetchPostDetail, fetchComments]); // postId 변경 시 호출되도록 fetchPostDetail, fetchComments 의존성 추가

    // URL 쿼리 파라미터에서 commentId 읽어서 해당 댓글로 스크롤 (선택적 기능)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const targetCommentId = params.get('commentId');
        if (targetCommentId && comments.length > 0) {
            const commentElement = document.getElementById(`comment-${targetCommentId}`);
            if (commentElement) {
                commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // 강조 효과 추가 가능
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

    const handleCommentPageChange = (pageNumber) => {
        fetchComments(pageNumber);
    };

    const handlePostLikeClick = async () => {
        if (!isUserLoggedIn()) { 
            setModalProps({ title: "로그인 필요", message: "좋아요는 로그인 후 가능합니다.", type: 'warning', onConfirm: () => navigate("/login")});
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
                isLikedByCurrentUser: data.likedByCurrentUser,
                postLikeCount: data.currentLikeCount,
            }));
        } catch (err) { 
            setModalProps({ title: "오류", message: err.response?.data?.message || "좋아요 처리에 실패했습니다.", type: 'error' });
            setIsModalOpen(true);
        }
    };

    const processPostReport = async () => {
        if (!isUserLoggedIn() || !post || post.userId === getLoggedInUserId() || post.reportedByCurrentUser) return;
        try {
            const token = getToken();
            await axios.post(`${API_BASE_URL}/board/free/${post.postId}/report`, {}, { headers: { Authorization: `Bearer ${token}` }});
            setPost(prev => ({ ...prev, reportedByCurrentUser: true }));
            setModalProps({ title: '신고 완료', message: '게시물이 성공적으로 신고되었습니다.', type: 'success', confirmButtonType: 'primary' });
        } catch (err) { 
            setModalProps({ title: '오류', message: err.response?.data?.message || "게시글 신고에 실패했습니다.", type: 'error' });
        } finally {
            setIsModalOpen(true);
        }
    };
    const handlePostReportClick = () => {
        if (!isUserLoggedIn()) {
            setModalProps({ title: "로그인 필요", message: "신고는 로그인 후 가능합니다.", type: 'warning', onConfirm: () => navigate("/login")});
            setIsModalOpen(true); return; 
        }
        if (!post || post.reportedByCurrentUser || post.userId === getLoggedInUserId()) return;
        setModalProps({
            title: '게시물 신고', message: '이 게시물을 신고하시겠습니까?\n신고 후에는 취소할 수 없습니다.',
            onConfirm: processPostReport, confirmText: '신고하기', cancelText: '취소', type: 'warning', confirmButtonType: 'danger'
        });
        setIsModalOpen(true);
    };

    const handlePostEditClick = () => {
        if (post && isUserLoggedIn() && post.userId === getLoggedInUserId()) {
            navigate(`/freeboardEdit/${post.postId}`);
        } else if (!isUserLoggedIn()) {
            setModalProps({ title: "로그인 필요", message: "수정은 로그인 후 가능합니다.", type: 'warning', onConfirm: () => navigate("/login")});
            setIsModalOpen(true);
        } else {
             setModalProps({ title: '권한 없음', message: '본인이 작성한 글만 수정할 수 있습니다.', type: 'error' });
             setIsModalOpen(true);
        }
    };

    const processPostDelete = async () => {
        if (!isUserLoggedIn() || !post || post.userId !== getLoggedInUserId()) return;
        try {
            const token = getToken();
            await axios.delete(`${API_BASE_URL}/board/free/${post.postId}`, { headers: { Authorization: `Bearer ${token}` }});
            setModalProps({ title: '삭제 완료', message: '게시글이 삭제되었습니다.', onConfirm: () => navigate('/freeboard'), type: 'success', confirmButtonType: 'primary'});
            setIsModalOpen(true);
        } catch (err) { 
            setModalProps({ title: '오류', message: err.response?.data?.message || "게시글 삭제에 실패했습니다.", type: 'error' });
            setIsModalOpen(true);
        }
    };
    const handlePostDeleteClick = () => {
         if (post && isUserLoggedIn() && post.userId === getLoggedInUserId()) {
            setModalProps({
                title: '게시글 삭제', message: `"${post.postTitle}" 게시글을 정말로 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`,
                onConfirm: processPostDelete, confirmText: '삭제', cancelText: '취소', type: 'warning', confirmButtonType: 'danger'
            });
            setIsModalOpen(true);
        } else if (!isUserLoggedIn()) {
            setModalProps({ title: "로그인 필요", message: "삭제는 로그인 후 가능합니다.", type: 'warning', onConfirm: () => navigate("/login")});
            setIsModalOpen(true);
        } else {
            setModalProps({ title: '권한 없음', message: '본인이 작성한 글만 삭제할 수 있습니다.', type: 'error' });
            setIsModalOpen(true);
        }
    };

    const handleCommentLikeToggle = async (commentId) => {
        if (!isUserLoggedIn()) { 
            setModalProps({ title: "로그인 필요", message: "좋아요는 로그인 후 가능합니다.", type: 'warning', onConfirm: () => navigate("/login")});
            setIsModalOpen(true); return; 
        }
        try {
            const token = getToken();
            const response = await axios.post(`${API_BASE_URL}/board/free/comments/${commentId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data;
            setComments(prevComments => prevComments.map(c => 
                c.commentId === commentId ? { ...c, isLikedByCurrentUser: data.likedByCurrentUser, commentLikeCount: data.currentLikeCount } : c
            ));
        } catch (err) { 
            setModalProps({ title: "오류", message: err.response?.data?.message || "댓글 좋아요 처리에 실패했습니다.", type: 'error' });
            setIsModalOpen(true);
        }
    };

    const processCommentReport = async (commentIdToReport) => {
        if (!isUserLoggedIn()) return;
        try {
            const token = getToken();
            await axios.post(`${API_BASE_URL}/board/free/comments/${commentIdToReport}/report`, {}, { headers: { Authorization: `Bearer ${token}` }});
            setComments(prev => prev.map(c => c.commentId === commentIdToReport ? {...c, reportedByCurrentUser: true } : c));
            setModalProps({ title: '신고 완료', message: `댓글 ID ${commentIdToReport}이(가) 신고되었습니다.`, type: 'success', confirmButtonType: 'primary'});
        } catch (err) {
            setModalProps({ title: '오류', message: err.response?.data?.message || "댓글 신고에 실패했습니다.", type: 'error' });
        } finally {
            setIsModalOpen(true);
        }
    };
    const handleCommentReportClick = (comment) => {
        if (!isUserLoggedIn()) {
            setModalProps({ title: "로그인 필요", message: "신고는 로그인 후 가능합니다.", type: 'warning', onConfirm: () => navigate("/login")});
            setIsModalOpen(true); return;
        }
        // reportedByCurrentUser, authorRole은 백엔드 DTO에 포함되어 있다고 가정
        if (comment.reportedByCurrentUser || comment.userId === getLoggedInUserId() || comment.authorRole === 'ADMIN') {
            if (comment.userId === getLoggedInUserId()) {
                 setModalProps({ title: '신고 불가', message: '자신의 댓글은 신고할 수 없습니다.', type: 'warning'});
                 setIsModalOpen(true);
            } else if (comment.authorRole === 'ADMIN') {
                 setModalProps({ title: '신고 불가', message: '관리자 댓글은 신고할 수 없습니다.', type: 'warning'});
                 setIsModalOpen(true);
            } else if (comment.reportedByCurrentUser) {
                 setModalProps({ title: '알림', message: '이미 신고한 댓글입니다.', type: 'info'});
                 setIsModalOpen(true);
            }
            return;
        }
        setModalProps({
            title: '댓글 신고', message: '이 댓글을 신고하시겠습니까?\n이 작업은 되돌릴 수 없습니다.',
            onConfirm: () => processCommentReport(comment.commentId), confirmText: '신고하기', cancelText: '취소', type: 'warning', confirmButtonType: 'danger'
        });
        setIsModalOpen(true);
    };
    
    const processCommentDelete = async (commentIdToDelete) => {
        if (!isUserLoggedIn()) return; 
        try {
            const token = getToken();
            await axios.delete(`${API_BASE_URL}/board/free/comments/${commentIdToDelete}`, { headers: { Authorization: `Bearer ${token}` }});
            setModalProps({ title: '삭제 완료', message: '댓글이 삭제되었습니다.', type: 'success', confirmButtonType: 'primary' });
            setIsModalOpen(true);
            fetchComments(commentPageInfo.currentPage); 
        } catch (err) { 
            setModalProps({ title: '오류', message: err.response?.data?.message || "댓글 삭제에 실패했습니다.", type: 'error' });
            setIsModalOpen(true);
        }
    };
    const handleCommentDeleteClick = (comment) => {
        if (isUserLoggedIn() && comment.userId === getLoggedInUserId()) {
            setModalProps({
                title: '댓글 삭제', message: `댓글을 정말로 삭제하시겠습니까?`,
                onConfirm: () => processCommentDelete(comment.commentId), confirmText: '삭제', cancelText: '취소', type: 'warning', confirmButtonType: 'danger'
            });
            setIsModalOpen(true);
        } else if (!isUserLoggedIn()){
            setModalProps({ title: "로그인 필요", message: "삭제는 로그인 후 가능합니다.", type: 'warning', onConfirm: () => navigate("/login")});
            setIsModalOpen(true);
        } else {
            setModalProps({ title: '권한 없음', message: '본인이 작성한 댓글만 삭제할 수 있습니다.', type: 'error' });
            setIsModalOpen(true);
        }
    };

    const handleCommentInputChange = (event) => setCommentInput(event.target.value);

    const handleCommentFormSubmit = async (event) => {
        event.preventDefault();
        if (!isUserLoggedIn()) { 
            setModalProps({ title: "로그인 필요", message: "댓글 작성은 로그인 후 가능합니다.", type: 'warning', onConfirm: () => navigate("/login")});
            setIsModalOpen(true); return; 
        }
        if (!commentInput.trim()) { 
            setModalProps({ title: '입력 오류', message: '댓글 내용을 입력해주세요.', type: 'warning' });
            setIsModalOpen(true); return; 
        }
        
        try {
            const token = getToken();
            await axios.post(`${API_BASE_URL}/board/free/${postId}/comments`, 
                { commentContent: commentInput },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            setCommentInput('');
            // 댓글 작성 성공 후, 마지막 페이지 또는 현재 페이지 댓글 목록 새로고침
            // totalElements가 변경되므로, 새로운 totalPages를 계산하여 마지막 페이지로 이동하는 것이 좋음
            // 간단하게는 현재 페이지를 다시 로드하거나, 마지막 페이지가 확실하면 그곳으로.
            // 여기서는 댓글 수에 따라 마지막 페이지를 다시 계산하여 fetchComments 호출
            const newTotalComments = commentPageInfo.totalElements + 1;
            const newTotalPages = Math.ceil(newTotalComments / commentsPerPage);
            fetchComments(newTotalPages > 0 ? newTotalPages : 1);

            // 스크롤을 댓글 목록 끝으로 이동 (선택적)
            setTimeout(() => { // DOM 업데이트 후 스크롤
                commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);

        } catch (err) { 
            setModalProps({ title: '오류', message: err.response?.data?.message || "댓글 등록에 실패했습니다.", type: 'error' });
            setIsModalOpen(true);
        }
    };

    const handleCommentDoubleClick = (comment) => {
        if (isUserLoggedIn() && comment.userId === getLoggedInUserId()) {
            setEditingCommentId(comment.commentId);
            setCurrentEditText(comment.commentContent);
        }
    };
    const handleCommentEditChange = (event) => setCurrentEditText(event.target.value);

    const saveCommentEdit = async (commentId) => {
        if (!isUserLoggedIn()) return false; 
        if (!currentEditText.trim()) { 
            setModalProps({ title: '입력 오류', message: '댓글 내용은 비워둘 수 없습니다.', type: 'warning'});
            setIsModalOpen(true);
            // 원래 내용 복원 (선택적)
            const originalComment = comments.find(c => c.commentId === commentId);
            if (originalComment) setCurrentEditText(originalComment.commentContent);
            return false; 
        }
        
        try {
            const token = getToken();
            const response = await axios.put(`${API_BASE_URL}/board/free/comments/${commentId}`,
                { commentContent: currentEditText }, 
                { headers: { Authorization: `Bearer ${token}` }}
            );
            // 수정된 댓글 정보(response.data)로 comments 상태 업데이트
            setComments(prevComments =>
                prevComments.map(c => c.commentId === commentId ? {...c, ...response.data, isLikedByCurrentUser: c.isLikedByCurrentUser } : c) // 좋아요 상태는 유지
            );
            setEditingCommentId(null);
            return true;
        } catch (err) {
            setModalProps({ title: '오류', message: err.response?.data?.message || "댓글 수정에 실패했습니다.", type: 'error' });
            setIsModalOpen(true);
            return false;
        }
    };
    const cancelCommentEdit = () => { setEditingCommentId(null); };
    const handleCommentEditKeyDown = (commentId, event) => { 
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            saveCommentEdit(commentId);
        } else if (event.key === 'Escape') {
            event.preventDefault();
            cancelCommentEdit();
        }
     };

    if (isLoadingPost) return <div className={freeboardDetailStyle.loadingContainer}>게시글을 불러오는 중입니다...</div>;
    if (error) return <div className={freeboardDetailStyle.errorContainer}>오류: {error} <button onClick={() => { fetchPostDetail(); fetchComments(1); }}>다시 시도</button></div>;
    if (!post) return <div className={freeboardDetailStyle.errorContainer}>게시글을 찾을 수 없습니다. <Link to="/freeboard">목록으로</Link></div>;

    const isPostAuthor = isUserLoggedIn() && post.userId === getLoggedInUserId();

    return (
        <>
            <div className={freeboardDetailStyle.pageContainer}>
                <div className={freeboardDetailStyle.boardLinkContainer}>
                    <Link to="/freeboard"><h2>자유게시판</h2></Link>
                </div>

                {/* 백엔드 FreeboardPostResponseDTO에 bannerImageUrl 필드가 있다면 표시됩니다. 현재는 없으므로 주석 처리 또는 제거.
                {post.bannerImageUrl && ( 
                    <div className={freeboardDetailStyle.imageBannerContainer}>
                        <img src={post.bannerImageUrl} alt="게시판 배너" className={freeboardDetailStyle.bannerImage} />
                    </div>
                )}
                */}


                <div className={freeboardDetailStyle.postContentContainer}>
                    <h1 className={freeboardDetailStyle.postTitle}>{post.postTitle}</h1>
                    <div className={freeboardDetailStyle.postMeta}>
                        <div>
                            <span className={freeboardDetailStyle.postAuthor}> {post.userNickName || '알 수 없는 사용자'}</span>
                            <span className={freeboardDetailStyle.postCreatedAt}>{formatDate(post.postCreatedAt)}</span>
                        </div>
                    </div>
                    <div className={freeboardDetailStyle.postSubMeta}>
                        <div className={freeboardDetailStyle.postStats}>
                            <button
                                onClick={handlePostLikeClick}
                                className={`${freeboardDetailStyle.iconButton} ${post.isLikedByCurrentUser ? freeboardDetailStyle.liked : ''}`}
                                title={post.isLikedByCurrentUser ? "좋아요 취소" : "좋아요"}
                                disabled={!isUserLoggedIn()}
                            >
                                <img src={post.isLikedByCurrentUser ? likeOnIcon : likeOffIcon} alt="좋아요" className={freeboardDetailStyle.buttonIcon} />
                            </button>
                            <span className={freeboardDetailStyle.countText}>좋아요: {post.postLikeCount}</span>
                            <span className={freeboardDetailStyle.countText}>조회수: {post.postViewCount}</span>
                        </div>
                        {isUserLoggedIn() && !isPostAuthor && ( // 로그인했고, 내 글이 아닐 때만 신고 버튼 표시
                             <button
                                onClick={handlePostReportClick}
                                className={`${freeboardDetailStyle.iconButton} ${post.reportedByCurrentUser ? freeboardDetailStyle.reported : ''}`}
                                disabled={post.reportedByCurrentUser} // 이미 신고했으면 비활성화
                                title={post.reportedByCurrentUser ? "신고됨" : "신고하기"}
                            >
                                <img src={post.reportedByCurrentUser ? reportOnIcon : reportOffIcon} alt="신고" className={freeboardDetailStyle.buttonIcon} />
                            </button>
                        )}
                    </div>
                    <div className={freeboardDetailStyle.postBody}>
                        {post.postContent.split('\n').map((line, index) => (
                            <React.Fragment key={`post-line-${index}`}>{line}{index < post.postContent.split('\n').length -1 && <br />}</React.Fragment>
                        ))}
                    </div>
                    {isPostAuthor && (
                        <div className={freeboardDetailStyle.postActions}>
                            <button onClick={handlePostEditClick} className={`${freeboardDetailStyle.actionButton} ${freeboardDetailStyle.editButton}`}>수정</button>
                            <button onClick={handlePostDeleteClick} className={`${freeboardDetailStyle.actionButton} ${freeboardDetailStyle.deleteButton}`}>삭제</button>
                        </div>
                    )}
                </div>

                <form className={freeboardDetailStyle.commentInputContainer} onSubmit={handleCommentFormSubmit}>
                    <textarea
                        placeholder={isUserLoggedIn() ? "따뜻한 댓글을 남겨주세요 :)" : "댓글을 작성하려면 로그인해주세요."}
                        className={freeboardDetailStyle.commentTextarea}
                        value={commentInput}
                        onChange={handleCommentInputChange}
                        rows="3"
                        disabled={!isUserLoggedIn()}
                    />
                    <button type="submit" className={freeboardDetailStyle.commentSubmitButton} disabled={!isUserLoggedIn() || !commentInput.trim()}>등록</button>
                </form>

                <div className={freeboardDetailStyle.commentListContainer}>
                    <h3>댓글 ({commentPageInfo.totalElements || 0})</h3>
                    {isLoadingComments ? <p>댓글 로딩 중...</p> : comments.length > 0 ? (
                        comments.map(comment => {
                            const isOwnComment = isUserLoggedIn() && comment.userId === getLoggedInUserId();
                            const isAdminComment = comment.authorRole === 'ADMIN'; 
                            const isCommentReportedByCurrentUser = comment.reportedByCurrentUser || false;

                            return (
                                <div key={comment.commentId} id={`comment-${comment.commentId}`} className={freeboardDetailStyle.commentItem}>
                                    <div className={freeboardDetailStyle.commentMeta}>
                                        <div>
                                            <span className={freeboardDetailStyle.commentAuthor}>{comment.userNickName || '알 수 없는 사용자'}</span>
                                            <span className={freeboardDetailStyle.commentCreatedAt}>{formatDate(comment.commentCreatedAt)}</span>
                                        </div>
                                        {isOwnComment && editingCommentId !== comment.commentId && (
                                            <div className={freeboardDetailStyle.commentUserActions}>
                                                 <button
                                                    onClick={() => handleCommentDoubleClick(comment)}
                                                    className={`${freeboardDetailStyle.actionButton} ${freeboardDetailStyle.editCommentButton}`}>
                                                    수정
                                                </button>
                                                <button
                                                    onClick={() => handleCommentDeleteClick(comment)}
                                                    className={`${freeboardDetailStyle.actionButton} ${freeboardDetailStyle.deleteButton} ${freeboardDetailStyle.commentDeleteButton}`}>
                                                    삭제
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {editingCommentId === comment.commentId && isOwnComment ? (
                                        <div className={freeboardDetailStyle.commentEditForm}>
                                            <textarea
                                                ref={editInputRef}
                                                className={freeboardDetailStyle.commentEditTextarea}
                                                value={currentEditText}
                                                onChange={handleCommentEditChange}
                                                onKeyDown={(e) => handleCommentEditKeyDown(comment.commentId, e)}
                                                rows="3"
                                            />
                                            <div className={freeboardDetailStyle.editActionsContainer}>
                                                <button type="button" onClick={() => saveCommentEdit(comment.commentId)} className={`${freeboardDetailStyle.actionButton} ${freeboardDetailStyle.saveCommentButton}`}>저장</button>
                                                <button type="button" onClick={() => cancelCommentEdit()} className={`${freeboardDetailStyle.actionButton} ${freeboardDetailStyle.cancelEditButton}`}>취소</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p
                                            className={freeboardDetailStyle.commentContent}
                                            onDoubleClick={() => isOwnComment && handleCommentDoubleClick(comment)}
                                            title={isOwnComment ? "더블클릭하여 수정" : ""}
                                        >
                                            {comment.commentContent.split('\n').map((line, index) => (
                                                <React.Fragment key={`comment-line-${comment.commentId}-${index}`}>{line}{index < comment.commentContent.split('\n').length -1 && <br />}</React.Fragment>
                                            ))}
                                        </p>
                                    )}

                                    <div className={freeboardDetailStyle.commentActions}>
                                        <div>
                                            <button
                                                onClick={() => handleCommentLikeToggle(comment.commentId)}
                                                className={`${freeboardDetailStyle.iconButton} ${comment.isLikedByCurrentUser ? freeboardDetailStyle.liked : ''}`}
                                                title={comment.isLikedByCurrentUser ? "좋아요 취소" : "좋아요"}
                                                disabled={!isUserLoggedIn()}
                                            >
                                                <img src={comment.isLikedByCurrentUser ? likeOnIcon : likeOffIcon} alt="댓글 좋아요" className={freeboardDetailStyle.buttonIcon}/>
                                            </button>
                                            <span className={freeboardDetailStyle.countText}>{comment.commentLikeCount}</span>
                                        </div>
                                        {isUserLoggedIn() && !isOwnComment && !isAdminComment && (
                                            <button
                                                onClick={() => handleCommentReportClick(comment)}
                                                className={`${freeboardDetailStyle.iconButton} ${isCommentReportedByCurrentUser ? freeboardDetailStyle.reported : ''}`}
                                                disabled={isCommentReportedByCurrentUser}
                                                title={isCommentReportedByCurrentUser ? "신고됨" : "신고하기"}
                                            >
                                                <img src={isCommentReportedByCurrentUser ? reportOnIcon : reportOffIcon} alt="댓글 신고" className={freeboardDetailStyle.buttonIcon}/>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    ) : ( 
                        <p className={freeboardDetailStyle.noComments}>
                            {commentPageInfo.totalElements > 0 && commentPageInfo.currentPage > commentPageInfo.totalPages ? '마지막 페이지입니다.' : '등록된 댓글이 없습니다. 첫 댓글을 남겨보세요!'}
                        </p>
                    )}
                </div>

                {commentPageInfo.totalElements > 0 && commentPageInfo.totalPages > 1 && (
                    <div className={freeboardDetailStyle.commentPaginationContainer}>
                        <Pagination 
                            currentPage={commentPageInfo.currentPage} 
                            totalPages={commentPageInfo.totalPages} 
                            onPageChange={handleCommentPageChange} 
                            pageNeighbours={1} // 페이지네이션 좌우 표시 개수
                        />
                    </div>
                )}
                <div ref={commentsEndRef} /> {/* 새 댓글 작성 후 스크롤 대상 */}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalProps.title}
                message={modalProps.message}
                onConfirm={modalProps.onConfirm}
                confirmText={modalProps.confirmText}
                cancelText={modalProps.cancelText}
                onCancel={modalProps.onCancel || (() => {setIsModalOpen(false); if(modalProps.onConfirm && modalProps.cancelText) modalProps.onConfirm = null;}) } // 취소 시 onConfirm도 null 처리
                type={modalProps.type}
                confirmButtonType={modalProps.confirmButtonType}
                cancelButtonType={modalProps.cancelButtonType}
            />
        </>
    );
}

export default FreeboardDetail;