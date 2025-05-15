import { useState } from 'react';
import { Link } from 'react-router-dom'; // useParams와 useNavigate 추가
import styles from './ManagerNoticeEdit.module.css'; // CSS 모듈 import (오타 수정)

function ManagerNoticeEdit() {
    // const { noticeId } = useParams(); // 실제로는 URL에서 noticeId를 가져옵니다.
    // const navigate = useNavigate();

    // 예시: 수정할 공지사항 데이터 (실제로는 noticeId로 API에서 가져옵니다)
    const [isImportant, setIsImportant] = useState(true); // "중요" 체크박스 상태
    const [title, setTitle] = useState("4월 이벤트 당첨자"); // 제목 입력 값
    const [content, setContent] = useState("안녕~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"); // 내용 입력 값

    // 예시: 원본 게시물의 메타 정보 (수정 불가, 표시용)
    const originalPostData = {
        author: "관리자",
        views: 111,
        createdAt: "25.04.21"
    };

    // useEffect(() => {
    //     // noticeId를 사용하여 실제 공지사항 데이터 불러오는 로직
    //     // 예: fetchNotice(noticeId).then(data => {
    //     //   setTitle(data.title);
    //     //   setContent(data.content);
    //     //   setIsImportant(data.isImportant);
    //     //   // originalPostData도 여기서 설정
    //     // });
    // }, [noticeId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("수정된 내용:", { isImportant, title, content });
        // TODO: API로 수정된 내용 전송 로직
        // navigate(`/admin/notice/${noticeId}` 또는 목록 페이지로 이동);
        alert("공지사항이 수정되었습니다.");
    };

    return (
        <>

            <div className={styles.container}> {/* Sidebar와 메인 콘텐츠를 감싸는 컨테이너 */}

                <main className={styles.editPageContainer}> {/* 공지사항 수정 페이지 전체 콘텐츠 영역 */}
                    <div className={styles.titleBar}>
                        {/* 페이지 제목 "공지사항" - 클릭 시 목록으로 이동하는 Link 고려 */}
                        <Link to="/admin/notice" className={styles.pageTitleLink}>
                            <h1 className={styles.pageTitle}>공지사항</h1>
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.editForm}>
                        <div className={styles.metadataSection}>
                            <div className={styles.leftMeta}>
                                <label className={styles.checkboxContainer}>
                                    <input
                                        type="checkbox"
                                        checked={isImportant}
                                        onChange={(e) => setIsImportant(e.target.checked)}
                                    />
                                    <span className={styles.checkmark}></span>
                                </label>
                                {isImportant && (
                                    <span className={styles.importantTag}>중요</span>
                                )}
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={styles.titleInput}
                                    placeholder="제목을 입력하세요"
                                />
                            </div>
                            <div className={styles.rightMeta}>
                                <span>작성자: {originalPostData.author}</span>
                                <span>조회수: {originalPostData.views}</span>
                                <span>작성일: {originalPostData.createdAt}</span>
                            </div>
                        </div>

                        <div className={styles.contentSection}>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className={styles.contentTextarea}
                                placeholder="내용을 입력하세요"
                                rows="15" // 이미지에 맞게 충분한 높이
                            />
                        </div>

                        <div className={styles.actionsBar}>
                            <button type="button" className={styles.cancelButton} onClick={() => navigate(-1) /* 이전 페이지 또는 목록으로 */}>
                                취소
                            </button>
                            <button type="submit" className={styles.submitButton}>
                                수정
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}

export default ManagerNoticeEdit;