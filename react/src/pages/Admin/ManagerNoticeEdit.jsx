// src/pages/Admin/Notice/ManagerNoticeEdit.jsx (또는 해당 파일의 실제 경로)
import { useEffect, useState } from 'react'; // React import 추가
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../assets/styles/ManagerNoticeEdit.module.css';
import Modal from '../../components/Modal/Modal'; // Modal 컴포넌트 import

const sampleNotices = {
    'sticky': { id: 'sticky', isImportant: true, title: '이벤트 당첨자 발표 안내 (필독)', author: '관리자', views: 1024, createdAt: '25.04.21', content: "기존 중요 공지 내용입니다..." },
    '1': { id: '1', isImportant: false, title: '첫 번째 일반 공지사항입니다.', author: '운영팀A', views: 123, createdAt: '25.05.02', content: "첫 번째 일반 공지사항의 기존 내용입니다." },
    '2': { id: '2', isImportant: true, title: '두 번째 중요 공지사항입니다.', author: '관리자2', views: 456, createdAt: '25.05.01', content: "두 번째 중요 공지사항의 기존 내용입니다." },
};

const getNoticeByIdMock = (id) => {
    return sampleNotices[id] || null;
};

function ManagerNoticeEdit() {
    const { id: noticeIdFromUrl } = useParams();
    const navigate = useNavigate();

    const [isImportant, setIsImportant] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    
    // 원본 데이터 저장을 위해 필드 확장
    const [originalPostData, setOriginalPostData] = useState({ 
        title: '', 
        content: '', 
        isImportant: false,
        author: "", 
        views: 0, 
        createdAt: "" 
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 모달 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalProps, setModalProps] = useState({
        title: '',
        message: '',
        onConfirm: null,
        confirmText: '확인',
        cancelText: null,
        type: 'default',
        confirmButtonType: 'primary',
        cancelButtonType: 'secondary'
    });

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
                setOriginalPostData({ // 원본 데이터 모두 저장
                    title: fetchedNotice.title,
                    content: fetchedNotice.content,
                    isImportant: fetchedNotice.isImportant,
                    author: fetchedNotice.author,
                    views: fetchedNotice.views,
                    createdAt: fetchedNotice.createdAt
                });
            } else {
                setError(`해당 공지사항(ID: ${noticeIdFromUrl})을 찾을 수 없습니다.`);
            }
            setIsLoading(false);
        }, 300);
    }, [noticeIdFromUrl]); // navigate는 useEffect의 직접적 의존성이 아니므로 제거 가능

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setModalProps({
                title: "입력 오류",
                message: "제목을 입력해주세요.",
                confirmText: "확인",
                type: "adminWarning",
                confirmButtonType: 'primary'
            });
            setIsModalOpen(true);
            return;
        }
        if (!content.trim()) {
            setModalProps({
                title: "입력 오류",
                message: "내용을 입력해주세요.",
                confirmText: "확인",
                type: "adminWarning",
                confirmButtonType: 'primary'
            });
            setIsModalOpen(true);
            return;
        }
        const formData = { isImportant, title, content, noticeId: noticeIdFromUrl };
        console.log("공지사항 수정 데이터:", formData);
        // TODO: API로 실제 수정 요청

        setModalProps({
            title: "수정 완료",
            message: "공지사항이 성공적으로 수정되었습니다.",
            confirmText: "확인",
            type: "adminSuccess", // 핑크 버튼을 원하시면 type: "success"
            confirmButtonType: 'primary',
            onConfirm: () => navigate(`/admin/managerNoticeDetail/${noticeIdFromUrl}`)
        });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        const hasChanges = title !== originalPostData.title ||
                           content !== originalPostData.content ||
                           isImportant !== originalPostData.isImportant;

        const navigateBack = () => {
            if (noticeIdFromUrl) {
                navigate(`/admin/managerNoticeDetail/${noticeIdFromUrl}`);
            } else {
                navigate('/admin/notice'); 
            }
        };

        if (hasChanges) {
            setModalProps({
                title: "수정 취소",
                message: "변경사항이 저장되지 않았습니다.\n정말로 수정을 취소하시겠습니까?",
                confirmText: "예, 취소합니다",
                cancelText: "계속 수정",
                onConfirm: navigateBack,
                type: "adminConfirm",
                confirmButtonType: 'danger',
                cancelButtonType: 'secondary'
            });
            setIsModalOpen(true);
        } else {
            navigateBack(); // 변경사항 없으면 바로 이동
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
    
    // 초기 로딩 에러나, 데이터를 찾지 못한 경우 (originalPostData.author가 비어있는 것으로 체크)
    if (error || (!originalPostData.author && !isLoading)) {
        const errorMessage = error || `공지사항(ID: ${noticeIdFromUrl}) 정보를 찾을 수 없습니다.`;
        return (
             <div className={styles.container}>
                <main className={styles.editContentCard}>
                     <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitleText}>공지사항 수정</h1>
                    </div>
                    <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>오류: {errorMessage}</p>
                    <div className={styles.actionsBar} style={{justifyContent: 'center'}}>
                        <button type="button" className={`${styles.actionButton} ${styles.cancelButton}`} onClick={() => navigate('/admin/notice')}>목록으로</button>
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
                                        className={styles.checkboxInput} // CSS에서 checkboxInput 클래스 사용
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
                            />
                        </div>

                        <div className={styles.contentSection}>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className={styles.contentTextarea}
                                placeholder="내용을 입력하세요"
                                rows={15}
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
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                {...modalProps}
            />
        </>
    );
}

export default ManagerNoticeEdit;