// src/pages/Admin/Notice/ManagerNoticeEdit.jsx
import axios from 'axios'; // axios import
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../assets/styles/ManagerNoticeEdit.module.css';
import Modal from '../../components/Modal/Modal'; // Modal 컴포넌트 import

const API_BASE_URL = "/api/v1"; // 프록시 설정을 활용하기 위해 상대 경로로 변경

function ManagerNoticeEdit() {
    const { id: noticeId } = useParams(); // URL 파라미터에서 noticeId를 가져옵니다.
    const navigate = useNavigate();

    const [isImportant, setIsImportant] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    
    // 원본 데이터 보관용 (수정 여부 확인 및 취소 시 복원용)
    const [originalPostData, setOriginalPostData] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false); // 제출 중 상태

    // 모달 상태 관리 (객체 형태로 유지)
    const [isModalOpen, setIsModalOpen] = useState({ state: false, config: {} });

    const getToken = () => localStorage.getItem("token");

    // ⭐ 수정: 실제 공지사항 데이터 로드 함수
    const fetchNoticeDataForEdit = useCallback(async () => {
        setIsLoading(true);
        const token = getToken();
        if (!token) {
            setIsLoading(false);
            setIsModalOpen({ 
                state: true, 
                config: { 
                    title: "인증 오류", 
                    message: "관리자 로그인이 필요합니다.", 
                    onConfirm: () => { setIsModalOpen({ state: false, config: {} }); navigate("/login"); }, 
                    type: 'error' 
                } 
            });
            return;
        }

        if (!noticeId || noticeId.trim() === "" || isNaN(Number(noticeId))) {
            setIsLoading(false);
            setIsModalOpen({ 
                state: true, 
                config: { 
                    title: "오류", 
                    message: "수정할 공지사항 ID가 유효하지 않습니다. 목록으로 돌아갑니다.", 
                    type: 'error', 
                    onConfirm: () => { setIsModalOpen({ state: false, config: {} }); navigate('/admin/managerNotice'); } 
                } 
            });
            return;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/notices/${noticeId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = response.data;
            
            const dateObj = new Date(data.noticeCreatedAt);
            const formattedDate = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;

            setTitle(data.noticeTitle);
            setContent(data.noticeContent);
            setIsImportant(data.noticeIsImportant);
            setOriginalPostData({ // 원본 데이터 모두 저장
                title: data.noticeTitle,
                content: data.noticeContent,
                isImportant: data.noticeIsImportant, // 중요도도 원본에 저장
                author: data.authorNickname,
                views: data.noticeViewCount,
                createdAt: formattedDate
            });
        } catch (error) {
            console.error("Error fetching notice for edit:", error);
            const errorMsg = error.response?.data?.message || "공지사항 정보를 불러오는 데 실패했습니다.";
            setIsModalOpen({ 
                state: true, 
                config: { 
                    title: "데이터 로딩 실패", 
                    message: errorMsg, 
                    type: 'error', 
                    onConfirm: () => { setIsModalOpen({ state: false, config: {} }); navigate('/admin/managerNotice'); } 
                } 
            });
            setOriginalPostData(null); // 에러 발생 시 데이터 초기화
        } finally {
            setIsLoading(false);
        }
    }, [noticeId, navigate]);

    useEffect(() => {
        fetchNoticeDataForEdit();
    }, [fetchNoticeDataForEdit]);

    // ⭐ 수정: 실제 공지사항 수정 API 호출
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!title.trim()) {
            setIsModalOpen({ 
                state: true, 
                config: { 
                    title: "입력 오류", 
                    message: "제목을 입력해주세요.", 
                    confirmText: "확인", 
                    type: "warning", 
                    confirmButtonType: 'primary', 
                    onConfirm: () => setIsModalOpen({ state: false, config: {} }) 
                } 
            });
            return;
        }
        if (!content.trim()) {
            setIsModalOpen({ 
                state: true, 
                config: { 
                    title: "입력 오류", 
                    message: "내용을 입력해주세요.", 
                    confirmText: "확인", 
                    type: "warning", 
                    confirmButtonType: 'primary', 
                    onConfirm: () => setIsModalOpen({ state: false, config: {} }) 
                } 
            });
            return;
        }

        // 변경 사항이 있는지 확인 (선택적)
        if (originalPostData && title === originalPostData.title && content === originalPostData.content && isImportant === originalPostData.isImportant) {
            setIsModalOpen({ 
                state: true, 
                config: { 
                    title: '변경 없음', 
                    message: '수정된 내용이 없습니다.', 
                    type: 'info', 
                    onConfirm: () => setIsModalOpen({ state: false, config: {} }) 
                } 
            });
            return;
        }

        setIsSubmitting(true); // 제출 시작
        const token = getToken();
        if (!token) {
            setIsSubmitting(false);
            setIsModalOpen({ 
                state: true, 
                config: { 
                    title: "인증 오류", 
                    message: "관리자 로그인이 필요합니다.", 
                    onConfirm: () => { setIsModalOpen({ state: false, config: {} }); navigate("/login"); }, 
                    type: 'error' 
                } 
            });
            return;
        }

        try {
            await axios.put(`${API_BASE_URL}/notices/${noticeId}`, 
                { noticeTitle: title, noticeContent: content, noticeIsImportant: isImportant },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsModalOpen({
                state: true,
                config: {
                    title: "수정 완료", 
                    message: "공지사항이 성공적으로 수정되었습니다.", 
                    confirmText: "확인",
                    type: "success", 
                    confirmButtonType: 'primary',
                    onConfirm: () => { setIsModalOpen({ state: false, config: {} }); navigate(`/admin/managerNoticeDetail/${noticeId}`); }
                }
            });
        } catch (error) {
            console.error('Error updating notice:', error);
            const errorMsg = error.response?.data?.message || '공지사항 수정 중 오류가 발생했습니다.';
            setIsModalOpen({ 
                state: true, 
                config: { 
                    title: '수정 실패', 
                    message: errorMsg, 
                    type: 'error', 
                    onConfirm: () => setIsModalOpen({ state: false, config: {} }) 
                } 
            });
        } finally {
            setIsSubmitting(false); // 제출 종료
        }
    };

    const handleCancel = () => {
        const hasChanges = originalPostData && (title !== originalPostData.title ||
                                                content !== originalPostData.content ||
                                                isImportant !== originalPostData.isImportant);

        const navigateBack = () => {
            if (noticeId) {
                navigate(`/admin/managerNoticeDetail/${noticeId}`);
            } else {
                navigate('/admin/managerNotice'); 
            }
        };

        if (hasChanges) {
            setIsModalOpen({
                state: true,
                config: {
                    title: "수정 취소",
                    message: "변경사항이 저장되지 않았습니다.\n정말로 수정을 취소하시겠습니까?",
                    confirmText: "예, 취소합니다",
                    cancelText: "계속 수정",
                    onConfirm: () => { setIsModalOpen({ state: false, config: {} }); navigateBack(); },
                    onCancel: () => setIsModalOpen({ state: false, config: {} }),
                    type: "warning",
                    confirmButtonType: 'danger',
                    cancelButtonType: 'secondary'
                }
            });
        } else {
            navigateBack(); // 변경사항 없으면 바로 이동
        }
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <main className={styles.editContentCard}>
                    <p>데이터를 불러오는 중...</p>
                </main>
            </div>
        );
    }
    
    // 초기 로딩 에러나, 데이터를 찾지 못한 경우 (originalPostData가 null인 경우)
    if (!originalPostData && !isLoading) {
        // fetchNoticeDataForEdit에서 이미 모달로 에러 메시지를 띄우고 navigate를 처리하므로,
        // 이 곳에서는 추가적인 UI 렌더링 없이 null을 반환하여 모달만 보이게 합니다.
        return null;
    }
    
    return (
        <>
            <div className={styles.container}>
                <main className={styles.editContentCard}>
                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitleText}>공지사항 수정</h1>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.editForm}>
                        <div className={styles.metadataSection}>
                            <div className={styles.leftMeta}>
                                <label className={styles.checkboxContainer}>
                                    <input
                                        type="checkbox"
                                        checked={isImportant}
                                        onChange={(e) => setIsImportant(e.target.checked)}
                                        className={styles.checkboxInput}
                                        disabled={isSubmitting} // 제출 중 비활성화
                                    />
                                    <span className={styles.checkboxLabel}>중요 공지</span>
                                </label>
                            </div>
                            <div className={styles.rightMeta}>
                                <span>작성자: {originalPostData?.author || 'N/A'}</span>
                                <span>조회수: {originalPostData?.views || 0}</span>
                                <span>작성일: {originalPostData?.createdAt || 'N/A'}</span>
                            </div>
                        </div>
                        
                        <div className={styles.titleInputSection}>
                             <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className={styles.titleInput}
                                placeholder="제목을 입력하세요"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className={styles.contentSection}>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className={styles.contentTextarea}
                                placeholder="내용을 입력하세요"
                                rows={15}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className={styles.actionsBar}>
                            <button 
                                type="button" 
                                className={`${styles.actionButton} ${styles.cancelButton}`} 
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                취소
                            </button>
                            <button 
                                type="submit" 
                                className={`${styles.actionButton} ${styles.submitButton}`}
                                disabled={isSubmitting || !title.trim() || !content.trim()}
                            >
                                {isSubmitting ? "수정 중..." : "수정 완료"}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
            <Modal
                isOpen={isModalOpen.state}
                onClose={() => setIsModalOpen({ state: false, config: {} })}
                {...isModalOpen.config}
            />
        </>
    );
}

export default ManagerNoticeEdit;