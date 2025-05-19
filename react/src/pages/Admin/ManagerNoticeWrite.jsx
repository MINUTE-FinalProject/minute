// ManagerNoticeWrite.jsx (디자인 통일을 위한 구조 및 클래스명 조정)
import { useState } from 'react'; // useEffect는 현재 필요 없으므로 제거 가능
import { Link, useNavigate } from 'react-router-dom';
import styles from "./ManagerNoticeWrite.module.css";

function ManagerNoticeWrite() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isImportant, setIsImportant] = useState(false);
    // const [files, setFiles] = useState(null); 

    const handleSubmit = (e) => { // form 태그의 onSubmit에 연결하므로 event 객체 받음
        e.preventDefault(); // 실제 form 제출 방지
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
        // console.log("첨부파일:", files);
        alert("공지사항이 등록되었습니다. (실제 저장은 구현 필요)");
        navigate('/admin/notice'); // 등록 후 공지사항 관리 목록 페이지로 이동 (경로 확인!)
    };

    const handleCancel = () => {
        if (window.confirm("작성을 취소하시겠습니까? 변경사항이 저장되지 않습니다.")) {
            navigate('/admin/notice'); // 공지사항 관리 목록 페이지로 이동 (경로 확인!)
        }
    };

    // const handleFileChange = (e) => {
    //     setFiles(e.target.files);
    // };

    return (
        // 다른 관리자 페이지와 동일한 .container > .contentCard 구조
        <div className={styles.container}>
            <main className={styles.writeContentCard}> {/* 클래스명 변경 또는 CSS에서 .writeContent를 카드 스타일로 */}
                {/* 페이지 상단 "공지사항 관리" 제목 (목록으로 이동) */}
                <div className={styles.pageHeader}>
                    <Link to="/admin/notice" className={styles.toListLink}>
                        <h1>공지사항 작성</h1>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className={styles.writeForm}> {/* 클래스명 변경 또는 CSS에서 .editForm 스타일 공유 */}
                    {/* 중요 여부 체크박스 - ManagerNoticeEdit과 유사한 구조로 변경 */}
                    <div className={styles.metadataSection}>
                        <label className={styles.checkboxContainer}>
                            <input
                                type="checkbox"
                                checked={isImportant}
                                onChange={(e) => setIsImportant(e.target.checked)}
                                className={styles.checkboxInput} // 기본 HTML 체크박스 사용 시
                            />
                            <span className={styles.checkboxLabel}>중요 공지로 설정</span>
                        </label>
                        {/* 작성자, 작성일 등은 새 글 작성 시 보통 자동으로 들어가거나 표시 안 함 */}
                    </div>
                    
                    {/* 제목 입력 - ManagerNoticeEdit과 유사한 구조 */}
                    <div className={styles.formGroup}> {/* 또는 titleInputSection */}
                        <label htmlFor="noticeTitle" className={styles.label}>제목</label>
                        <input
                            type="text"
                            id="noticeTitle"
                            className={styles.titleInput} // ManagerNoticeEdit의 .titleInput 스타일 적용
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="공지사항 제목을 입력하세요"
                            required
                        />
                    </div>

                    {/* 내용 입력 - ManagerNoticeEdit과 유사한 구조 */}
                    <div className={styles.formGroup}> {/* 또는 contentSection */}
                        <label htmlFor="noticeContent" className={styles.label}>내용</label>
                        <textarea
                            id="noticeContent"
                            className={styles.contentTextarea} // ManagerNoticeEdit의 .contentTextarea 스타일 적용
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="공지사항 내용을 입력하세요"
                            rows="15"
                            required
                        ></textarea>
                    </div>

                    {/* 파일 첨부 (주석 처리 유지) */}
                    {/* ... */}

                    {/* 버튼 그룹 - ManagerNoticeEdit과 유사한 구조 */}
                    <div className={styles.actionsBar}> {/* ManagerNoticeEdit의 .actionsBar 스타일 적용 */}
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