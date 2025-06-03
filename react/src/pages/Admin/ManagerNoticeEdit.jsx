// src/pages/Admin/Notice/ManagerNoticeEdit.jsx
import axios from 'axios'; // axios import
import { useEffect, useState } from 'react'; // React import
import { useNavigate, useParams } from 'react-router-dom';
// 경로 확인: 현재 파일 위치에 따라 ../../../assets/... 등으로 변경될 수 있습니다.
import styles from '../../assets/styles/ManagerNoticeEdit.module.css';
import Modal from '../../components/Modal/Modal';

function ManagerNoticeEdit() {
    const { id: noticeIdFromUrl } = useParams();
    const navigate = useNavigate();

    const [isImportant, setIsImportant] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    
    const [originalPostData, setOriginalPostData] = useState({ 
        title: '', content: '', isImportant: false,
        author: "", views: 0, createdAt: "", rawCreatedAt: null // 원본 날짜 저장용
    });

    const [isLoading, setIsLoading] = useState(true); // 페이지 초기 데이터 로딩
    const [isSubmitting, setIsSubmitting] = useState(false); // 폼 제출 로딩

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalProps, setModalProps] = useState({
        title: '', message: '', onConfirm: null, confirmText: '확인',
        cancelText: null, type: 'default', confirmButtonType: 'primary',
        cancelButtonType: 'secondary', onClose: () => setIsModalOpen(false)
    });

    const getToken = () => localStorage.getItem('token');

    useEffect(() => {
        setIsLoading(true);
        if (!noticeIdFromUrl || isNaN(Number(noticeIdFromUrl))) {
            setModalProps({
                title: "잘못된 접근", message: "유효하지 않은 공지사항 ID 입니다.", type: "error",
                confirmText: "목록으로", confirmButtonType: 'blackButton',
                onConfirm: () => { setIsModalOpen(false); navigate('/admin/managerNotice'); },
                onClose: () => { setIsModalOpen(false); navigate('/admin/managerNotice'); }
            });
            setIsModalOpen(true);
            setIsLoading(false);
            return;
        }

        const fetchNoticeData = async () => {
            try {
                // GET /api/notices/{id}는 permitAll이므로 토큰 없이 요청 가능
                const response = await axios.get(`/api/notices/${noticeIdFromUrl}`);
                const data = response.data; // NoticeDetailResponseDTO

                const dateObj = new Date(data.noticeCreatedAt);
                const formattedDate = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;

                setTitle(data.noticeTitle);
                setContent(data.noticeContent);
                setIsImportant(data.noticeIsImportant);
                setOriginalPostData({
                    title: data.noticeTitle,
                    content: data.noticeContent,
                    isImportant: data.noticeIsImportant,
                    author: data.authorNickname,
                    views: data.noticeViewCount,
                    createdAt: formattedDate,
                    rawCreatedAt: data.noticeCreatedAt // 원본 날짜 저장
                });

            } catch (error) {
                console.error("Error fetching notice for edit:", error);
                setModalProps({
                    title: "데이터 로드 실패", 
                    message: error.response?.data?.message || "공지사항 정보를 불러오는 데 실패했습니다.",
                    type: "error", confirmText: "목록으로", confirmButtonType: 'blackButton',
                    onConfirm: () => { setIsModalOpen(false); navigate('/admin/managerNotice'); },
                    onClose: () => { setIsModalOpen(false); navigate('/admin/managerNotice'); }
                });
                setIsModalOpen(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNoticeData();
    }, [noticeIdFromUrl, navigate]);

    const handleSubmit = async (e) => { // async 추가
        e.preventDefault();
        if (!title.trim()) {
            setModalProps({
                title: "입력 오류", message: "제목을 입력해주세요.", type: "adminWarning",
                confirmButtonType: 'primary', onClose: () => setIsModalOpen(false)
            });
            setIsModalOpen(true);
            return;
        }
        if (!content.trim()) {
            setModalProps({
                title: "입력 오류", message: "내용을 입력해주세요.", type: "adminWarning",
                confirmButtonType: 'primary', onClose: () => setIsModalOpen(false)
            });
            setIsModalOpen(true);
            return;
        }

        const token = getToken();
        if (!token) {
            setModalProps({
                title: '인증 오류', message: '로그인이 필요합니다. 다시 로그인해주세요.',
                type: 'error', confirmText: '로그인으로 이동', confirmButtonType: 'blackButton',
                onConfirm: () => { setIsModalOpen(false); navigate('/login'); },
                onClose: () => setIsModalOpen(false)
            });
            setIsModalOpen(true);
            return;
        }

        setIsSubmitting(true);
        try {
            const updatedData = {
                noticeTitle: title,
                noticeContent: content,
                noticeIsImportant: isImportant
            };
            // API 호출: PUT /api/notices/{id}
            const response = await axios.put(`/api/notices/${noticeIdFromUrl}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                setModalProps({
                    title: "수정 완료", message: "공지사항이 성공적으로 수정되었습니다.",
                    type: "adminSuccess", confirmText: "상세보기로 이동", confirmButtonType: 'primary',
                    onConfirm: () => { setIsModalOpen(false); navigate(`/admin/managerNoticeDetail/${noticeIdFromUrl}`); },
                    onClose: () => { setIsModalOpen(false); navigate(`/admin/managerNoticeDetail/${noticeIdFromUrl}`); }
                });
                setIsModalOpen(true);
                 // 수정 성공 시 originalPostData도 업데이트 (선택적)
                setOriginalPostData(prev => ({
                    ...prev,
                    title: title,
                    content: content,
                    isImportant: isImportant
                }));
            }
        } catch (error) {
            console.error("Error updating notice:", error);
            setModalProps({
                title: "수정 실패", 
                message: error.response?.data?.message || "공지사항 수정 중 오류가 발생했습니다.",
                type: "adminError", confirmButtonType: 'primary', onClose: () => setIsModalOpen(false)
            });
            setIsModalOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        const hasChanges = title !== originalPostData.title ||
                           content !== originalPostData.content ||
                           isImportant !== originalPostData.isImportant;

        const navigateBack = () => {
            if (noticeIdFromUrl) {
                navigate(`/admin/managerNoticeDetail/${noticeIdFromUrl}`);
            } else {
                navigate('/admin/managerNotice'); 
            }
        };

        if (hasChanges) {
            setModalProps({
                title: "수정 취소", message: "변경사항이 저장되지 않았습니다.\n정말로 수정을 취소하시겠습니까?",
                confirmText: "예, 취소합니다", cancelText: "계속 수정",
                onConfirm: () => { setIsModalOpen(false); navigateBack(); },
                type: "adminConfirm", confirmButtonType: 'redButton', cancelButtonType: 'grayButton',
                onClose: () => setIsModalOpen(false)
            });
            setIsModalOpen(true);
        } else {
            navigateBack();
        }
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <main className={styles.editContentCard}><p>데이터를 불러오는 중...</p></main>
            </div>
        );
    }
    
    if (!originalPostData.author && !isLoading) { // 데이터 로드 실패 또는 없는 ID
        return (
             <div className={styles.container}>
                <main className={styles.editContentCard}>
                     <div className={styles.pageHeader}><h1 className={styles.pageTitleText}>공지사항 수정</h1></div>
                    <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>
                        공지사항(ID: {noticeIdFromUrl}) 정보를 찾을 수 없거나 불러오는 데 실패했습니다.
                    </p>
                    <div className={styles.actionsBar} style={{justifyContent: 'center'}}>
                        <button type="button" className={`${styles.actionButton} ${styles.cancelButton}`} onClick={() => navigate('/admin/managerNotice')}>목록으로</button>
                    </div>
                </main>
            </div>
        );
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
                                        disabled={isSubmitting}
                                    />
                                    <span className={styles.checkboxLabel}>중요 공지</span>
                                </label>
                            </div>
                            <div className={styles.rightMeta}>
                                <span>작성자: {originalPostData.author}</span>
                                <span>조회수: {originalPostData.views}</span>
                                <span>작성일: {originalPostData.createdAt}</span>
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
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? '수정 중...' : '수정 완료'}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
            <Modal
                isOpen={isModalOpen}
                {...modalProps} // onClose는 modalProps에 포함되어 있음
            />
        </>
    );
}

export default ManagerNoticeEdit;