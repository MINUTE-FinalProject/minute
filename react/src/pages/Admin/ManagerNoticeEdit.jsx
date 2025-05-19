// ManagerNoticeEdit.jsx (수정 전용 페이지, ID 형식 일관성 중요)
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './ManagerNoticeEdit.module.css'; // CSS 모듈 경로 확인

// 예시 목업 데이터: 키 값과 객체 내부의 id 값이 일치해야 하며,
// 이 키 값(ID)이 URL 파라미터로 전달되는 값과 형식이 같아야 합니다.
const sampleNotices = {
    'sticky': { 
        id: 'sticky', 
        isImportant: true, 
        title: '이벤트 당첨자 발표 안내 (필독)', 
        author: '관리자', 
        views: 1024, 
        createdAt: '25.04.21', 
        content: "안녕하세요. 사용자 여러분께 안내 말씀드립니다.\n\n보다 안정적인 서비스 제공을 위해 아래와 같이 서버 점검을 실시할 예정입니다.\n점검 시간 동안에는 서비스 이용이 일시적으로 중단될 수 있으니 양해 부탁드립니다.\n\n- 점검 일시: 2025년 5월 15일 (목) 02:00 ~ 04:00 (2시간)\n- 점검 내용: 서버 안정화 및 성능 개선 작업\n\n항상 최선을 다하는 서비스가 되겠습니다.\n감사합니다." 
    },
    '1': { 
        id: '1', 
        isImportant: false, 
        title: '첫 번째 일반 공지사항입니다.', 
        author: '운영팀A', 
        views: 123, 
        createdAt: '25.05.02', 
        content: "첫 번째 공지사항의 내용입니다. \n\n상세 내용을 확인해주세요." 
    },
    '2': { 
        id: '2', 
        isImportant: true, 
        title: '두 번째 중요 공지사항입니다.', 
        author: '관리자2', 
        views: 456, 
        createdAt: '25.05.01', 
        content: "두 번째 중요 공지사항의 내용입니다. \n\n필독 바랍니다." 
    },
};

// 목업 데이터 조회 함수
const getNoticeByIdMock = (id) => {
    // console.log("ManagerNoticeEdit - getNoticeByIdMock searching for ID:", id);
    return sampleNotices[id] || null;
};
// --- 목업 데이터 끝 ---

function ManagerNoticeEdit() {
    const { id: noticeIdFromUrl } = useParams(); // App.js에서 라우트 파라미터가 :id 이므로 id로 받음
    const navigate = useNavigate();

    const [isImportant, setIsImportant] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [originalPostData, setOriginalPostData] = useState({ author: "", views: 0, createdAt: "" });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); // 오류 상태 추가

    useEffect(() => {
        setIsLoading(true);
        setError(null); // 에러 상태 초기화

        if (!noticeIdFromUrl) { 
            console.error("ManagerNoticeEdit: noticeIdFromUrl is undefined. Check routing and Link.");
            setError("잘못된 접근입니다. 수정할 공지사항 ID가 없습니다.");
            setIsLoading(false);
            // navigate('/admin/notice'); // ID 없으면 목록으로 강제 이동 (선택적)
            return;
        }

        // console.log(`ManagerNoticeEdit: 수정 모드 - 공지 ID "${noticeIdFromUrl}" 데이터 로드 시도`);
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
                console.error(`ManagerNoticeEdit: 해당 공지사항을 찾을 수 없습니다. ID: ${noticeIdFromUrl}`);
                setError(`해당 공지사항(ID: ${noticeIdFromUrl})을 찾을 수 없습니다.`);
                // alert("해당 공지사항을 찾을 수 없습니다. 목록으로 돌아갑니다.");
                // navigate('/admin/notice'); 
            }
            setIsLoading(false);
        }, 300); // API 호출 시뮬레이션 시간
    }, [noticeIdFromUrl, navigate]);

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

        const formData = { 
            isImportant, 
            title, 
            content, 
            noticeId: noticeIdFromUrl 
        };

        console.log("공지사항 수정 데이터:", formData);
        // TODO: API로 수정 요청 (예: updateNoticeAPI(noticeIdFromUrl, formData).then(...))
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
    
    if (error) { // 오류 발생 시 UI
        return (
             <div className={styles.container}>
                <main className={styles.editContentCard}>
                     <div className={styles.pageHeader}>
                        <Link to="/admin/notice" className={styles.toListLink}>
                            <h1>공지사항 수정</h1>
                        </Link>
                    </div>
                    <p style={{ color: 'red' }}>오류: {error}</p>
                     <div className={styles.actionsBar}>
                        <button type="button" className={`${styles.actionButton} ${styles.cancelButton}`} onClick={() => navigate('/admin/notice')}>목록으로</button>
                    </div>
                </main>
            </div>
        );
    }
    
    // 데이터 로드 성공 후 폼을 보여주기 전에, originalPostData.author 등이 채워졌는지 확인
    // (fetchedNotice가 null이 아니었지만, 내부 데이터가 비정상적일 경우 대비)
    if (!originalPostData.author && !title && !content && !isLoading) {
         return ( // 데이터는 있으나 내용이 비정상적일 경우 (거의 발생 안함)
             <div className={styles.container}>
                <main className={styles.editContentCard}>
                     <div className={styles.pageHeader}>
                        <Link to="/admin/notice" className={styles.toListLink}>
                            <h1>공지사항 수정</h1>
                        </Link>
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
                <div className={styles.pageHeader}>
                    <Link to="/admin/notice" className={styles.toListLink}>
                        <h1>공지사항 수정</h1>
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