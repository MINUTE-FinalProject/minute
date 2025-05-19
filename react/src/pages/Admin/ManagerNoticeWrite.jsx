// ManagerNoticeWrite.jsx (상단 제목 링크 기능 제거)
import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom'; // Link는 이제 필요 없음
import { useNavigate } from 'react-router-dom'; // useNavigate는 버튼에 사용
import styles from "./ManagerNoticeWrite.module.css";

function ManagerNoticeWrite() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isImportant, setIsImportant] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }
        if (!content.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }
        console.log("새 공지사항 등록 내용:");
        console.log("중요여부:", isImportant);
        console.log("제목:", title);
        console.log("내용:", content);
        alert("공지사항이 등록되었습니다. (실제 저장은 구현 필요)");
        navigate('/admin/notice'); 
    };

    const handleCancel = () => {
        if (window.confirm("작성을 취소하시겠습니까? 변경사항이 저장되지 않습니다.")) {
            navigate('/admin/notice'); 
        }
    };

    return (
        <div className={styles.container}>
            <main className={styles.writeContentCard}>
                {/* === 상단 제목 (링크 기능 제거) === */}
                <div className={styles.pageHeader}>
                    {/* Link 태그 대신 h1 태그만 사용 */}
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
                            required
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
                            required
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
    );
}

export default ManagerNoticeWrite;