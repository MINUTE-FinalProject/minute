// ManagerNoticeEdit.jsx (상단 제목 링크 기능 제거)
import { useEffect, useState } from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom'; // Link 제거
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ManagerNoticeEdit.module.css';

// 예시 목업 데이터
const sampleNotices = {
    'sticky': { id: 'sticky', isImportant: true, title: '이벤트 당첨자 발표 안내 (필독)', author: '관리자', views: 1024, createdAt: '25.04.21', content: "..." },
    '1': { id: '1', isImportant: false, title: '첫 번째 일반 공지사항입니다.', author: '운영팀A', views: 123, createdAt: '25.05.02', content: "..." },
    '2': { id: '2', isImportant: true, title: '두 번째 중요 공지사항입니다.', author: '관리자2', views: 456, createdAt: '25.05.01', content: "..." },
};

const getNoticeByIdMock = (id) => {
    return sampleNotices[id] || null;
};
// --- 목업 데이터 끝 ---

function ManagerNoticeEdit() {
    const { id: noticeIdFromUrl } = useParams();
    const navigate = useNavigate();

    const [isImportant, setIsImportant] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [originalPostData, setOriginalPostData] = useState({ author: "", views: 0, createdAt: "" });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        if (!noticeIdFromUrl) { 
            setError("잘못된 접근입니다. 수정할 공지사항 ID가 없습니다.");
            setIsLoading(false);
            return;
        }
        setTimeout(() => { 
            const fetchedNotice = getNoticeByIdMock(noticeIdFromUrl);
            if (fetchedNotice) {
                setTitle(fetchedNotice.title);
                setContent(fetchedNotice.content);
                setIsImportant(fetchedNotice.isImportant);
                setOriginalPostData({
                    author: fetchedNotice.author,
                    views: fetchedNotice.views,
                    createdAt: fetchedNotice.createdAt
                });
            } else {
                setError(`해당 공지사항(ID: ${noticeIdFromUrl})을 찾을 수 없습니다.`);
            }
            setIsLoading(false);
        }, 300);
    }, [noticeIdFromUrl, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }
        const formData = { isImportant, title, content, noticeId: noticeIdFromUrl };
        console.log("공지사항 수정 데이터:", formData);
        alert(`공지사항이 성공적으로 수정되었습니다. (실제 저장은 구현 필요)`);
        navigate(`/admin/managerNoticeDetail/${noticeIdFromUrl}`); 
    };

    const handleCancel = () => {
        if (noticeIdFromUrl) {
            navigate(`/admin/managerNoticeDetail/${noticeIdFromUrl}`);
        } else {
            navigate('/admin/notice'); 
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
    
    if (error) {
        return (
             <div className={styles.container}>
                <main className={styles.editContentCard}>
                     <div className={styles.pageHeader}>
                        {/* Link 제거, h1에 직접 pageTitleText 클래스 적용 또는 기존 pageTitle 사용 */}
                        <h1 className={styles.pageTitleText}>공지사항 수정</h1>
                    </div>
                    <p style={{ color: 'red' }}>오류: {error}</p>
                     <div className={styles.actionsBar}>
                        <button type="button" className={`${styles.actionButton} ${styles.cancelButton}`} onClick={() => navigate('/admin/notice')}>목록으로</button>
                    </div>
                </main>
            </div>
        );
    }
    
    if (!originalPostData.author && !title && !content && !isLoading) {
         return ( 
             <div className={styles.container}>
                <main className={styles.editContentCard}>
                     <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitleText}>공지사항 수정</h1>
                    </div>
                    <p>공지사항 정보를 표시할 수 없습니다.</p>
                     <div className={styles.actionsBar}>
                        <button type="button" className={`${styles.actionButton} ${styles.cancelButton}`} onClick={() => navigate('/admin/notice')}>목록으로</button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <main className={styles.editContentCard}>
                {/* === 상단 제목 (링크 기능 제거) === */}
                <div className={styles.pageHeader}>
                    {/* Link 태그 대신 h1 태그만 사용, 클래스명은 pageTitleText 또는 기존 pageTitle 사용 */}
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
                            required
                        />
                    </div>

                    <div className={styles.contentSection}>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className={styles.contentTextarea}
                            placeholder="내용을 입력하세요"
                            rows={15}
                            required
                        />
                    </div>

                    <div className={styles.actionsBar}>
                        <button 
                            type="button" 
                            className={`${styles.actionButton} ${styles.cancelButton}`} 
                            onClick={handleCancel}
                        >
                            취소
                        </button>
                        <button 
                            type="submit" 
                            className={`${styles.actionButton} ${styles.submitButton}`}
                        >
                            수정 완료
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default ManagerNoticeEdit;