import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import reportOffIcon from '../../assets/images/able-alarm.png'; // 신고 아이콘 (기본)
import reportOnIcon from '../../assets/images/disable-alarm.png'; // 신고된 아이콘
import Header from '../../components/Header/Header'; // 실제 Header 컴포넌트 경로
import Sidebar from '../../components/Sidebar/Sidebar'; // 실제 Sidebar 컴포넌트 경로
import styles from './ManagerQnaDetail.module.css';

// 예시 데이터 함수 (실제 API 호출로 대체 필요)
const getMockQnaDetailById = (qnaId) => {
    const mockData = {
        '1': {
            id: '1',
            status: '미답변',
            title: '비밀번호를 잊어버렸어요. (답변 없는 예시)',
            authorId: 'user123',
            authorNickname: '김문의',
            createdAt: '2025-05-12',
            content: "안녕하세요.\n계정 비밀번호를 잊어버려서 로그인을 못하고 있습니다.\n\n임시 비밀번호 발급이나 비밀번호 재설정 방법을 알려주세요.\n감사합니다.",
            images: [],
            adminAnswer: null,
            isReportedByAdmin: false,
        },
        '2': {
            id: '2',
            status: '답변완료',
            title: '월간 구독 결제가 중복으로 된 것 같아요. (답변 있는 예시)',
            authorId: 'user456',
            authorNickname: '이결제',
            createdAt: '2025-05-10',
            content: "안녕하세요, 지난 달 월간 구독료가 두 번 결제된 것으로 보입니다.\n확인 부탁드립니다.\n첨부파일로 결제 내역 첨부합니다.",
            images: ['https://via.placeholder.com/150?text=결제내역1', 'https://via.placeholder.com/150?text=결제내역2'],
            adminAnswer: {
                author: '운영팀',
                createdAt: '2025-05-11',
                content: "안녕하세요, 고객님. 문의주셔서 감사합니다.\n\n결제 내역 확인 결과, 시스템 오류로 인해 중복 결제가 발생한 것으로 확인되었습니다.\n불편을 드려 대단히 죄송합니다.\n\n중복 결제된 금액은 금일 중으로 환불 처리될 예정입니다.\n다시 한번 이용에 불편을 드린 점 사과드립니다.\n\n감사합니다.\n팀 Minute 드림."
            },
            isReportedByAdmin: false,
        },
        '3': {
            id: '3',
            status: '답변완료',
            title: '이용 정책 위반 의심 게시물 (관리자 신고 예시)',
            authorId: 'user789',
            authorNickname: '박정책',
            createdAt: '2025-05-13',
            content: "이용 정책에 위배되는 내용이 포함된 것 같습니다.",
            images: [],
            adminAnswer: {
                author: '관리자',
                createdAt: '2025-05-14',
                content: "해당 내용 확인 후 조치하겠습니다."
            },
            isReportedByAdmin: true,
        }
    };
    return mockData[qnaId] || mockData['2']; // 기본값으로 ID '2' 데이터 사용
};


function ManagerQnaDetail() {
    const { qnaId } = useParams();
    const navigate = useNavigate();

    const [qnaPost, setQnaPost] = useState(null);
    const [adminReply, setAdminReply] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isEditingAdminAnswer, setIsEditingAdminAnswer] = useState(false);
    const [editedAdminAnswerContent, setEditedAdminAnswerContent] = useState('');
    const adminAnswerEditInputRef = useRef(null);

    useEffect(() => {
        setIsLoading(true);
        const currentQnaIdToDisplay = qnaId || '2';
        const fetchedQna = getMockQnaDetailById(currentQnaIdToDisplay);
        setQnaPost(fetchedQna);
        if (fetchedQna && fetchedQna.adminAnswer) {
            setEditedAdminAnswerContent(fetchedQna.adminAnswer.content);
        }
        setIsLoading(false);
    }, [qnaId]);

    useEffect(() => {
        if (isEditingAdminAnswer && adminAnswerEditInputRef.current) {
            adminAnswerEditInputRef.current.focus();
            const len = adminAnswerEditInputRef.current.value.length;
            adminAnswerEditInputRef.current.selectionStart = len;
            adminAnswerEditInputRef.current.selectionEnd = len;
        }
    }, [isEditingAdminAnswer]);

    const handleReplyChange = (e) => setAdminReply(e.target.value);

    const handleSubmitReply = () => {
        if (!adminReply.trim()) {
            alert("답변 내용을 입력해주세요.");
            return;
        }
        alert("답변이 등록되었습니다. (실제 저장은 구현 필요)");
        setQnaPost(prev => ({
            ...prev,
            adminAnswer: { author: '관리자', createdAt: new Date().toLocaleDateString().slice(0, -1), content: adminReply },
            status: '답변완료'
        }));
        setAdminReply('');
    };

    const handleAdminAnswerDoubleClick = () => {
        if (qnaPost && qnaPost.adminAnswer) {
            setEditedAdminAnswerContent(qnaPost.adminAnswer.content);
            setIsEditingAdminAnswer(true);
        }
    };

    const handleEditedAdminAnswerChange = (e) => setEditedAdminAnswerContent(e.target.value);

    const handleSaveAdminAnswerEdit = () => {
        if (!editedAdminAnswerContent.trim()) {
            alert("답변 내용은 비워둘 수 없습니다.");
            return;
        }
        alert("답변이 수정되었습니다. (실제 저장은 구현 필요)");
        setQnaPost(prev => ({
            ...prev,
            adminAnswer: { ...prev.adminAnswer, content: editedAdminAnswerContent }
        }));
        setIsEditingAdminAnswer(false);
    };

    const handleCancelAdminAnswerEdit = () => {
        if (qnaPost && qnaPost.adminAnswer) {
            setEditedAdminAnswerContent(qnaPost.adminAnswer.content);
        }
        setIsEditingAdminAnswer(false);
    };
    
    const handleDeleteAdminAnswer = () => {
        if (window.confirm("정말로 이 답변을 삭제하시겠습니까?")) {
            alert("답변이 삭제되었습니다. (실제 저장은 구현 필요)");
            setQnaPost(prev => ({ ...prev, adminAnswer: null, status: '미답변' }));
            setIsEditingAdminAnswer(false);
        }
    };

    const handleToggleQnaReport = () => {
        if (!qnaPost) return;
        const newReportedState = !qnaPost.isReportedByAdmin;
        const confirmAction = newReportedState ? "이 문의글을 관리자 신고 상태로 변경하시겠습니까?" : "이 문의글의 관리자 신고 상태를 해제하시겠습니까?";
        if (window.confirm(confirmAction)) {
            setQnaPost(prev => ({ ...prev, isReportedByAdmin: newReportedState }));
            // TODO: API로 서버에 문의글 신고 상태 업데이트
        }
    };

    const handleAdminAnswerEditKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSaveAdminAnswerEdit();
        } else if (event.key === 'Escape') {
            event.preventDefault();
            handleCancelAdminAnswerEdit();
        }
    };

    if (isLoading || !qnaPost) {
        return <div className={styles.loadingContainer}>데이터를 불러오는 중입니다...</div>;
    }

    return (
        <>
            <Header />
            {/* Sidebar와 메인 콘텐츠를 감싸는 Flex 컨테이너 */}
            <div className={styles.container}>
                <Sidebar /> {/* Sidebar 컴포넌트 (자체적으로 너비를 가져야 함) */}
                
                {/* 메인 콘텐츠 영역 */}
                <main className={styles.detailContent}>
                    <div className={styles.breadcrumbContainer}>
                        <Link to="/admin/qna-management" className={styles.breadcrumbLink}>Q&A 관리</Link>
                    </div>

                    <div className={styles.userQuestionArea}>
                        <div className={styles.infoBar}>
                            <div className={styles.infoBarLeft}>
                                <span className={`${styles.statusTag} ${qnaPost.status === '답변완료' ? styles.answered : styles.unanswered}`}>
                                    {qnaPost.status}
                                </span>
                                <h1 className={styles.postTitle}>{qnaPost.title}</h1>
                            </div>
                            <button
                                onClick={handleToggleQnaReport}
                                className={`${styles.iconButton} ${styles.qnaReportButton} ${qnaPost.isReportedByAdmin ? styles.reportedActive : ''}`}
                                title={qnaPost.isReportedByAdmin ? "문의글 신고됨 (해제하려면 클릭)" : "문의글 신고하기"}
                            >
                                <img
                                    src={qnaPost.isReportedByAdmin ? reportOnIcon : reportOffIcon}
                                    alt={qnaPost.isReportedByAdmin ? "신고됨" : "신고하기"}
                                    className={styles.buttonIcon}
                                />
                            </button>
                        </div>
                        <div className={styles.metaInfo}>
                            <span className={styles.author}>작성자: {qnaPost.authorNickname} (ID: {qnaPost.authorId})</span>
                            <span className={styles.createdAt}>작성일: {qnaPost.createdAt}</span>
                            {/* 유형 필드 제거됨 */}
                        </div>

                        <div className={styles.contentBody}>
                            {qnaPost.content.split('\n').map((line, index) => (
                                <React.Fragment key={index}>{line}<br /></React.Fragment>
                            ))}
                        </div>

                        {qnaPost.images && qnaPost.images.length > 0 && (
                            <div className={styles.imageAttachmentSection}>
                                <p className={styles.attachmentTitle}>첨부파일:</p>
                                <div className={styles.imageList}>
                                    {qnaPost.images.map((imgSrc, index) => (
                                        <img key={index} src={imgSrc} alt={`첨부이미지 ${index + 1}`} className={styles.attachedImage} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.adminResponseArea}>
                        {qnaPost.adminAnswer && qnaPost.adminAnswer.content ? (
                            isEditingAdminAnswer ? (
                                <div className={styles.answerEditSection}>
                                    <h4 className={styles.responseTitle}>답변 수정</h4>
                                    <textarea
                                        ref={adminAnswerEditInputRef}
                                        className={styles.answerTextarea}
                                        value={editedAdminAnswerContent}
                                        onChange={handleEditedAdminAnswerChange}
                                        onKeyDown={handleAdminAnswerEditKeyDown}
                                        rows="8"
                                    ></textarea>
                                    <div className={`${styles.buttonGroup} ${styles.editButtonGroup}`}>
                                        <button type="button" onClick={handleCancelAdminAnswerEdit} className={`${styles.button} ${styles.cancelButton}`}>
                                            취소
                                        </button>
                                        <button type="button" onClick={handleSaveAdminAnswerEdit} className={`${styles.button} ${styles.submitButton}`}>
                                            수정 완료
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.answerDisplaySection}>
                                    <div className={styles.answerHeader}>
                                        <h4 className={styles.responseTitle}>등록된 답변</h4>
                                        <button onClick={handleDeleteAdminAnswer} className={`${styles.button} ${styles.deleteAnswerButton}`}>삭제</button>
                                    </div>
                                    <div className={styles.adminAnswerItem} onDoubleClick={handleAdminAnswerDoubleClick} title="더블클릭하여 수정">
                                        <div className={styles.adminAnswerMeta}>
                                            <span className={styles.adminAnswerAuthor}>{qnaPost.adminAnswer.author}</span>
                                            <span className={styles.adminAnswerDate}>{qnaPost.adminAnswer.createdAt}</span>
                                        </div>
                                        <div className={styles.adminAnswerContent}>
                                            {qnaPost.adminAnswer.content.split('\n').map((line, index) => (
                                                <React.Fragment key={index}>{line}<br /></React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className={styles.answerInputSection}>
                                <h4 className={styles.responseTitle}>답변 작성</h4>
                                <textarea
                                    className={styles.answerTextarea}
                                    value={adminReply}
                                    onChange={handleReplyChange}
                                    placeholder="답변을 입력하세요..."
                                    rows="10"
                                ></textarea>
                                <div className={styles.buttonGroup}>
                                    <button type="button" onClick={handleSubmitReply} className={`${styles.button} ${styles.submitButton}`}>
                                        답변 등록
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={styles.actionButtonsBottom}>
                        <button type="button" onClick={() => navigate('/admin/qna-management')} className={`${styles.button} ${styles.listButton}`}>
                            목록
                        </button>
                    </div>
                </main>
            </div>
        </>
    );
}

export default ManagerQnaDetail;