// src/pages/Admin/Notice/ManagerNoticeWrite.jsx (또는 해당 파일의 실제 경로)
import { useState } from 'react'; // React import 추가
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/Modal/Modal'; // Modal 컴포넌트 경로 확인
import styles from "./ManagerNoticeWrite.module.css";

function ManagerNoticeWrite() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isImportant, setIsImportant] = useState(false);

    // 모달 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalProps, setModalProps] = useState({
        title: '',
        message: '',
        onConfirm: null,
        confirmText: '확인',
        cancelText: null,
        type: 'default', // 관리자 페이지이므로 'adminDefault', 'adminWarning' 등 사용 고려
        confirmButtonType: 'primary',
        cancelButtonType: 'secondary'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setModalProps({
                title: '입력 오류',
                message: '제목을 입력해주세요.',
                confirmText: '확인',
                type: 'adminWarning', // 관리자용 경고 타입
                confirmButtonType: 'primary'
            });
            setIsModalOpen(true);
            return;
        }
        if (!content.trim()) {
            setModalProps({
                title: '입력 오류',
                message: '내용을 입력해주세요.',
                confirmText: '확인',
                type: 'adminWarning', // 관리자용 경고 타입
                confirmButtonType: 'primary'
            });
            setIsModalOpen(true);
            return;
        }
        console.log("새 공지사항 등록 내용:", { isImportant, title, content });
        // TODO: 실제 서버로 데이터 전송 로직 (API 호출)

        setModalProps({
            title: '등록 완료',
            message: '공지사항이 성공적으로 등록되었습니다.',
            confirmText: '확인',
            type: 'adminSuccess', // 관리자용 성공 타입 (CSS에서 .content-adminSuccess 등으로 스타일 정의 가능)
            confirmButtonType: 'primary',
            onConfirm: () => navigate('/admin/notice') // 공지사항 목록으로 이동
        });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        if (title.trim() || content.trim() || isImportant) { // isImportant도 변경 사항으로 간주
            setModalProps({
                title: '작성 취소',
                message: '작성을 취소하시겠습니까?\n변경사항이 저장되지 않습니다.',
                confirmText: '예, 취소합니다',
                cancelText: '계속 작성',
                onConfirm: () => navigate('/admin/notice'), // 공지사항 목록으로 이동
                type: 'adminConfirm', // 관리자용 확인 타입
                confirmButtonType: 'danger',
                cancelButtonType: 'secondary'
            });
            setIsModalOpen(true);
        } else {
            navigate('/admin/notice'); // 내용 없으면 바로 이동
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
                                // required 속성은 브라우저 기본 유효성 검사를 트리거하므로, 커스텀 모달을 사용하려면 제거하거나 handleSubmit에서만 처리
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
                                // required
                            ></textarea>
                        </div>

                        <div className={styles.actionsBar}>
                            <button type="button" onClick={handleCancel} className={`${styles.actionButton} ${styles.cancelButton}`}>
                                취소
                            </button>
                            <button type="submit" className={`${styles.actionButton} ${styles.submitButton}`}>
                                등록
                            </button>
                        </div>
                    </form>
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

export default ManagerNoticeWrite;