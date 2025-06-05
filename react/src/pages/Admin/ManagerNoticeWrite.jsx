// src/pages/Admin/Notice/ManagerNoticeWrite.jsx
import axios from 'axios'; // axios import
import { useState } from 'react'; // React import 추가
import { useNavigate } from 'react-router-dom';
import styles from "../../assets/styles/ManagerNoticeWrite.module.css";
import Modal from '../../components/Modal/Modal'; // Modal 컴포넌트 경로 확인

const API_BASE_URL = "/api/v1"; // 프록시 설정을 활용하기 위해 상대 경로로 변경

function ManagerNoticeWrite() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isImportant, setIsImportant] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // 제출 중 상태

    // 모달 상태 관리 (객체 형태로 유지)
    const [isModalOpen, setIsModalOpen] = useState({ state: false, config: {} });

    const getToken = () => localStorage.getItem("token");

    // ⭐ 수정: 실제 공지사항 작성 API 호출
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!title.trim()) {
            setIsModalOpen({
                state: true,
                config: {
                    title: '입력 오류', message: '제목을 입력해주세요.', confirmText: '확인',
                    type: 'warning', confirmButtonType: 'primary',
                    onConfirm: () => setIsModalOpen({ state: false, config: {} })
                }
            });
            return;
        }
        if (!content.trim()) {
            setIsModalOpen({
                state: true,
                config: {
                    title: '입력 오류', message: '내용을 입력해주세요.', confirmText: '확인',
                    type: 'warning', confirmButtonType: 'primary',
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
                    title: '인증 오류', message: '관리자 로그인이 필요합니다. 로그인 페이지로 이동합니다.',
                    confirmText: '확인', type: 'error',
                    onConfirm: () => { setIsModalOpen({ state: false, config: {} }); navigate('/login'); }
                }
            });
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/notices`, 
                { noticeTitle: title, noticeContent: content, noticeIsImportant: isImportant },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setIsModalOpen({
                state: true,
                config: {
                    title: '등록 완료', message: '공지사항이 성공적으로 등록되었습니다.', confirmText: '확인',
                    type: 'success', confirmButtonType: 'primary',
                    onConfirm: () => { setIsModalOpen({ state: false, config: {} }); navigate('/admin/managerNotice'); } // 공지사항 목록으로 이동
                }
            });

        } catch (error) {
            console.error("Error creating notice:", error);
            const errorMsg = error.response?.data?.message || "공지사항 등록에 실패했습니다.";
            setIsModalOpen({
                state: true,
                config: {
                    title: "등록 실패", message: errorMsg, confirmText: "확인", type: 'error',
                    onConfirm: () => {
                        setIsModalOpen({ state: false, config: {} });
                        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                            navigate('/login');
                        }
                    }
                }
            });
        } finally {
            setIsSubmitting(false); // 제출 종료
        }
    };

    const handleCancel = () => {
        if (title.trim() || content.trim() || isImportant) { // isImportant도 변경 사항으로 간주
            setIsModalOpen({
                state: true,
                config: {
                    title: '작성 취소',
                    message: '작성을 취소하시겠습니까?\n입력하신 내용은 저장되지 않습니다.',
                    confirmText: '예, 취소합니다', cancelText: '계속 작성',
                    onConfirm: () => { setIsModalOpen({ state: false, config: {} }); navigate('/admin/managerNotice'); }, // 공지사항 목록으로 이동
                    onCancel: () => setIsModalOpen({ state: false, config: {} }), // 취소 버튼 클릭 시 모달만 닫기
                    type: 'warning', confirmButtonType: 'danger', cancelButtonType: 'secondary'
                }
            });
        } else {
            navigate('/admin/managerNotice'); // 내용 없으면 바로 이동
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
                                    disabled={isSubmitting} // 제출 중 비활성화
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
                                disabled={isSubmitting} // 제출 중 비활성화
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
                                disabled={isSubmitting} // 제출 중 비활성화
                            ></textarea>
                        </div>

                        <div className={styles.actionsBar}>
                            <button type="button" onClick={handleCancel} className={`${styles.actionButton} ${styles.cancelButton}`} disabled={isSubmitting}>
                                취소
                            </button>
                            <button type="submit" className={`${styles.actionButton} ${styles.submitButton}`} disabled={isSubmitting || !title.trim() || !content.trim()}>
                                {isSubmitting ? "등록 중..." : "등록"}
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

export default ManagerNoticeWrite;