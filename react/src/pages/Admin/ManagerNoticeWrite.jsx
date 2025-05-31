// src/pages/Admin/Notice/ManagerNoticeWrite.jsx
import axios from 'axios'; // axios import
import { useState } from 'react'; // React import
import { useNavigate } from 'react-router-dom';
// 경로 확인: 현재 파일 위치에 따라 ../../../assets/... 등으로 변경될 수 있습니다.
import styles from "../../assets/styles/ManagerNoticeWrite.module.css";
import Modal from '../../components/Modal/Modal';

function ManagerNoticeWrite() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isImportant, setIsImportant] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // API 호출 중 로딩 상태

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalProps, setModalProps] = useState({
        title: '', message: '', onConfirm: null, confirmText: '확인',
        cancelText: null, type: 'default', confirmButtonType: 'primary',
        cancelButtonType: 'secondary', onClose: () => setIsModalOpen(false)
    });

    const getToken = () => localStorage.getItem('token');

    const handleSubmit = async (e) => { // async 키워드 추가
        e.preventDefault();
        if (!title.trim()) {
            setModalProps({
                title: '입력 오류', message: '제목을 입력해주세요.',
                confirmText: '확인', type: 'adminWarning', 
                confirmButtonType: 'primary', onClose: () => setIsModalOpen(false)
            });
            setIsModalOpen(true);
            return;
        }
        if (!content.trim()) {
            setModalProps({
                title: '입력 오류', message: '내용을 입력해주세요.',
                confirmText: '확인', type: 'adminWarning',
                confirmButtonType: 'primary', onClose: () => setIsModalOpen(false)
            });
            setIsModalOpen(true);
            return;
        }

        const token = getToken();
        if (!token) {
            setModalProps({
                title: '인증 오류', message: '로그인이 필요합니다. 다시 로그인해주세요.',
                type: 'error', confirmText: '로그인으로 이동',
                confirmButtonType: 'blackButton', 
                onConfirm: () => { setIsModalOpen(false); navigate('/login'); },
                onClose: () => setIsModalOpen(false)
            });
            setIsModalOpen(true);
            return;
        }

        setIsSubmitting(true); // 로딩 시작

        try {
            const noticeData = {
                noticeTitle: title,
                noticeContent: content,
                noticeIsImportant: isImportant
            };

            // API 호출: POST /api/notices
            const response = await axios.post('/api/notices', noticeData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // 성공 시 (HTTP 201 Created)
            if (response.status === 201) {
                setModalProps({
                    title: '등록 완료',
                    message: '공지사항이 성공적으로 등록되었습니다.',
                    confirmText: '목록으로 이동',
                    type: 'adminSuccess', 
                    confirmButtonType: 'primary', // 또는 'blackButton' 등 테마에 맞게
                    onConfirm: () => { setIsModalOpen(false); navigate('/admin/managerNotice'); },
                    onClose: () => { setIsModalOpen(false); navigate('/admin/managerNotice'); }
                });
                setIsModalOpen(true);
                // 폼 초기화 (선택적)
                setTitle('');
                setContent('');
                setIsImportant(false);
            }
        } catch (error) {
            console.error("Error creating notice:", error);
            setModalProps({
                title: '등록 실패',
                message: error.response?.data?.message || '공지사항 등록 중 오류가 발생했습니다.',
                confirmText: '확인',
                type: 'adminError',
                confirmButtonType: 'primary',
                onClose: () => setIsModalOpen(false)
            });
            setIsModalOpen(true);
        } finally {
            setIsSubmitting(false); // 로딩 종료
        }
    };

    const handleCancel = () => {
        if (title.trim() || content.trim() || isImportant) {
            setModalProps({
                title: '작성 취소',
                message: '작성을 취소하시겠습니까?\n변경사항이 저장되지 않습니다.',
                confirmText: '예, 취소합니다',
                cancelText: '계속 작성',
                onConfirm: () => { setIsModalOpen(false); navigate('/admin/managerNotice'); },
                type: 'adminConfirm', 
                confirmButtonType: 'redButton',
                cancelButtonType: 'grayButton',
                onClose: () => setIsModalOpen(false)
            });
            setIsModalOpen(true);
        } else {
            navigate('/admin/managerNotice');
        }
    };

    return (
        <>
            <div className={styles.container}>
                <main className={styles.writeContentCard}>
                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitleText}>공지사항 작성</h1> 
                    </div>

                    <form onSubmit={handleSubmit} className={styles.writeForm}>
                        <div className={styles.metadataSection}>
                            <label className={styles.checkboxContainer}>
                                <input
                                    type="checkbox"
                                    checked={isImportant}
                                    onChange={(e) => setIsImportant(e.target.checked)}
                                    className={styles.checkboxInput}
                                    disabled={isSubmitting}
                                />
                                <span className={styles.checkboxLabel}>중요 공지로 설정</span>
                            </label>
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="noticeTitle" className={styles.label}>제목</label>
                            <input
                                type="text"
                                id="noticeTitle"
                                className={styles.titleInput}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="공지사항 제목을 입력하세요"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="noticeContent" className={styles.label}>내용</label>
                            <textarea
                                id="noticeContent"
                                className={styles.contentTextarea}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="공지사항 내용을 입력하세요"
                                rows="15"
                                disabled={isSubmitting}
                            ></textarea>
                        </div>

                        <div className={styles.actionsBar}>
                            <button 
                                type="button" 
                                onClick={handleCancel} 
                                className={`${styles.actionButton} ${styles.cancelButton}`}
                                disabled={isSubmitting}
                            >
                                취소
                            </button>
                            <button 
                                type="submit" 
                                className={`${styles.actionButton} ${styles.submitButton}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? '등록 중...' : '등록'}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
            <Modal
                isOpen={isModalOpen}
                // onClose는 modalProps에 기본값으로 설정되어 있음
                {...modalProps}
            />
        </>
    );
}

export default ManagerNoticeWrite;