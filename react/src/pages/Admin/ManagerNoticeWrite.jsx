import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위해 import
import styles from "./ManagerNoticeWrite.module.css"; // CSS 모듈 import

function ManagerNoticeWrite() {
    const navigate = useNavigate(); // 페이지 이동 함수
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isImportant, setIsImportant] = useState(false); // 중요 공지 여부 상태
    // const [files, setFiles] = useState(null); // 파일 첨부 상태 (필요시)

    const handleSubmit = () => {
        // TODO: 실제 공지사항 등록 로직 (API 호출 등)
        console.log("중요여부:", isImportant);
        console.log("제목:", title);
        console.log("내용:", content);
        // console.log("첨부파일:", files);
        alert("공지사항이 등록되었습니다."); // 임시 알림
        navigate('/admin/notice-management'); // 등록 후 공지사항 관리 목록 페이지로 이동 (경로는 실제 설정에 맞게)
    };

    const handleCancel = () => {
        if (window.confirm("작성을 취소하시겠습니까? 변경사항이 저장되지 않습니다.")) {
            navigate('/admin/notice-management'); // 공지사항 관리 목록 페이지로 이동 (경로는 실제 설정에 맞게)
        }
    };

    // 파일 핸들러 예시 (필요시)
    // const handleFileChange = (e) => {
    //     setFiles(e.target.files);
    // };

    return (
        <>

            <div className={styles.container}> {/* 전체 컨테이너 (Sidebar + Content) */}

                <main className={styles.writeContent}> {/* 메인 콘텐츠 영역 (흰색 카드) */}
                    <h1 className={styles.pageTitle}>공지사항 작성</h1>

                    <form onSubmit={(e) => e.preventDefault()}> {/* 실제 form 제출 방지 */}
                        <div className={styles.formGroup}>
                            <label htmlFor="noticeTitle" className={styles.label}>제목</label>
                            <input
                                type="text"
                                id="noticeTitle"
                                className={styles.inputField}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="공지사항 제목을 입력하세요"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="noticeContent" className={styles.label}>내용</label>
                            <textarea
                                id="noticeContent"
                                className={styles.textareaField}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="공지사항 내용을 입력하세요"
                                rows="15"
                            ></textarea>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={isImportant}
                                    onChange={(e) => setIsImportant(e.target.checked)}
                                    className={styles.checkbox}
                                />
                                중요 공지로 설정
                            </label>
                        </div>

                        {/* 파일 첨부 기능 (필요하다면 주석 해제 후 사용) */}
                        {/*
                        <div className={styles.formGroup}>
                            <label htmlFor="noticeFile" className={styles.label}>파일 첨부</label>
                            <input 
                                type="file" 
                                id="noticeFile" 
                                className={styles.fileInput} 
                                onChange={handleFileChange} 
                                multiple // 여러 파일 선택 가능하게 하려면
                            />
                        </div>
                        */}

                        <div className={styles.buttonGroup}>
                            <button type="button" onClick={handleCancel} className={`${styles.button} ${styles.cancelButton}`}>
                                취소
                            </button>
                            <button type="button" onClick={handleSubmit} className={`${styles.button} ${styles.submitButton}`}>
                                등록
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}

export default ManagerNoticeWrite;