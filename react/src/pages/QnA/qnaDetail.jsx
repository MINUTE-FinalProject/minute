// src/pages/QnA/qnaDetail.jsx
import React, { useEffect, useState } from 'react'; // useState, useEffect 추가
import { Link, useNavigate, useParams } from 'react-router-dom'; // useParams, useNavigate 추가
import Modal from '../../components/Modal/Modal'; // Modal 컴포넌트 import
import MypageNav from '../../components/MypageNavBar/MypageNav';
import qnaDetailStyle from './qnaDetail.module.css';

// 예시 데이터베이스 (useEffect에서 qnaId를 기반으로 조회)
const mockQnaDatabase = {
    'qna-1': { // qna.js에서 생성하는 ID 형식과 일치하도록 수정
        id: "qna-1", 
        status: "답변완료", 
        authorId: "user123", // 작성자 ID (본인 글 수정 권한 확인용)
        author: "김문의", 
        title: "이용 관련하여 문의드립니다. (ID: qna-1)",
        createdAt: "2025.05.10",
        content: "안녕하세요. 서비스 이용 중 궁금한 점이 있어 문의드립니다.\n\n이러이러한 부분은 어떻게 처리되나요?\n\n자세한 답변 부탁드립니다.",
        imageUrl: ["https://via.placeholder.com/100/CCCCCC/FFFFFF?Text=이미지1"], // 배열로 변경
        adminAnswer: {
            author: "관리자", 
            createdAt: "2025.05.11",
            content: "안녕하세요, 문의주셔서 감사합니다.\n\n문의하신 내용에 대해 답변드립니다.\n\n해당 부분은 다음과 같이 처리되고 있습니다: [상세 설명]\n\n추가 문의사항이 있으시면 언제든지 다시 질문해주세요."
        }
    },
    'qna-2': { 
        id: "qna-2", 
        status: "미답변", 
        authorId: "user456",
        author: "박질문", 
        title: "새로운 기능 제안합니다. (ID: qna-2)",
        createdAt: "2025.05.12",
        content: "새로운 기능으로 이런 것이 있었으면 좋겠습니다.\n\n구체적인 내용은 다음과 같습니다...",
        imageUrl: [], // 빈 배열로 초기화
        adminAnswer: null
    }
};

// 플레이스홀더 데이터
const PLACEHOLDER_QNA = {
    id: 'placeholder', 
    status: "정보 없음", 
    authorId: "system",
    author: "시스템", 
    title: '문의 제목 (샘플)',
    createdAt: 'YYYY.MM.DD',
    content: "요청하신 문의 정보를 불러올 수 없습니다.\n대신 샘플 문의 내용이 표시됩니다.\n\n페이지 구조 및 UI를 확인해주세요.",
    imageUrl: [],
    adminAnswer: null
};

// 현재 로그인한 사용자 ID (실제로는 Context API나 Redux 등에서 가져옴)
// const LOGGED_IN_USER_ID = 'user123'; 

function QnaDetail() {
    const { id: qnaId } = useParams(); // App.js 라우트가 :id 이므로 id로 받음
    const navigate = useNavigate();
    
    console.log("[QnaDetail] Component rendered. qnaId from URL:", qnaId);

    const [qnaData, setQnaData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalProps, setModalProps] = useState({
        title: '', message: '', onConfirm: null, confirmText: '확인',
        cancelText: null, type: 'default', confirmButtonType: 'primary',
        cancelButtonType: 'secondary'
    });

    useEffect(() => {
        console.log("[QnaDetail useEffect] Started. Current qnaId:", qnaId);
        setIsLoading(true);
        setQnaData(null); 

        const fetchQnaById = async (id) => {
            console.log("[QnaDetail fetchQnaById] Called with id:", id);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const foundQna = mockQnaDatabase[id];
                    if (foundQna) {
                        console.log("[QnaDetail fetchQnaById] QnA found for ID:", id, foundQna);
                        resolve(foundQna);
                    } else {
                        console.log("[QnaDetail fetchQnaById] QnA not found for ID:", id);
                        reject(new Error(`요청하신 문의(ID: ${id})를 찾을 수 없습니다.`));
                    }
                }, 300); 
            });
        };

        if (qnaId && qnaId !== "undefined" && qnaId !== "null") {
            fetchQnaById(qnaId)
                .then(data => {
                    console.log("[QnaDetail useEffect] Fetch successful, setting QnA data:", data);
                    setQnaData(data);
                })
                .catch(err => {
                    console.error("[QnaDetail useEffect] Failed to fetch QnA:", err.message, "-- Displaying placeholder.");
                    setQnaData(PLACEHOLDER_QNA);
                    setModalProps({
                        title: "알림",
                        message: `${err.message}\n샘플 문의 내용을 표시합니다.`,
                        confirmText: "확인",
                        type: "warning", // 정보성 경고
                        confirmButtonType: 'blackButton', // 사용자용 확인 버튼은 검정색
                        onConfirm: () => setIsModalOpen(false) // 모달만 닫음
                    });
                    setIsModalOpen(true);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else { 
            console.log("[QnaDetail useEffect] qnaId is missing. Displaying placeholder.");
            setQnaData(PLACEHOLDER_QNA);
            setIsLoading(false);
            setModalProps({
                title: "알림",
                message: "유효한 문의 ID가 아닙니다.\n샘플 문의 내용을 표시합니다.",
                confirmText: "확인",
                type: "warning",
                confirmButtonType: 'blackButton',
                onConfirm: () => setIsModalOpen(false)
            });
            setIsModalOpen(true);
        }
    }, [qnaId]); // navigate는 현재 onConfirm에서 사용 안하므로 의존성 배열에서 제거

    const handleEditClick = () => {
        // const isOwnQna = qnaData && qnaData.authorId === LOGGED_IN_USER_ID;
        // 실제 사용 시 위와 같이 작성자 확인 로직 추가

        if (qnaData && qnaData.id !== 'placeholder' /* && isOwnQna */) {
            navigate(`/qnaEdit/${qnaData.id}`);
        } else if (qnaData && qnaData.id === 'placeholder') {
             setModalProps({
                title: "알림",
                message: "현재 샘플 문의를 보고 계십니다. 실제 문의 수정은 해당 문의 상세 페이지에서 가능합니다.",
                confirmText: "확인",
                type: "info", 
                confirmButtonType: 'blackButton'
            });
            setIsModalOpen(true);
        } 
        // else if (qnaData && !isOwnQna) {
        //      setModalProps({
        //         title: "권한 없음",
        //         message: "본인이 작성한 문의만 수정할 수 있습니다.",
        //         confirmText: "확인",
        //         type: "error", 
        //         confirmButtonType: 'blackButton'
        //     });
        //     setIsModalOpen(true);
        // }
    };

    if (isLoading) {
        return (
            <>
                <MypageNav/>
                <div className={qnaDetailStyle.layout}>
                    <div className={qnaDetailStyle.container}>
                        <div className={qnaDetailStyle.background} style={{padding: "50px", textAlign: "center"}}>
                            문의 내용을 불러오는 중입니다...
                        </div>
                    </div>
                </div>
            </>
        );
    }
    
    if (!qnaData) {
        return (
             <>
                <MypageNav/>
                <div className={qnaDetailStyle.layout}>
                    <div className={qnaDetailStyle.container}>
                        <div className={qnaDetailStyle.background} style={{padding: "50px", textAlign: "center"}}>
                            오류: 문의 정보를 표시할 수 없습니다. (qnaData is null)
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // qnaData가 객체임을 보장받은 후, 내부 속성에 접근
    const userQuestion = qnaData;
    const adminAnswerData = qnaData.adminAnswer; // 변수명 변경으로 명확화

    return (
        <>
           <MypageNav/>
           <div className={qnaDetailStyle.layout}>
                <div className={qnaDetailStyle.container}>
                    <div className={qnaDetailStyle.background}>
                        <div className={qnaDetailStyle.qnaLinkContainer}>
                            <Link to="/qna" className={qnaDetailStyle.qnaLink}>Q&A</Link>
                        </div>

                        <div className={qnaDetailStyle.contentArea}>
                            <div className={qnaDetailStyle.info}>
                                <span className={`${qnaDetailStyle.statusTag} ${userQuestion.status === '답변완료' ? qnaDetailStyle.answered : qnaDetailStyle.unanswered}`}>{userQuestion.status}</span>
                                <span className={qnaDetailStyle.authorName}>{userQuestion.author}</span>
                                <span className={qnaDetailStyle.postTitleMain}>{userQuestion.title}</span>
                                <span className={qnaDetailStyle.postDate}>{userQuestion.createdAt}</span>
                            </div>

                            <div className={qnaDetailStyle.textbox}>
                                {userQuestion.content.split('\n').map((line, index) => (
                                    <React.Fragment key={`q-${index}`}>{line}<br /></React.Fragment>
                                ))}
                            </div>

                            {/* imageUrl이 배열 형태임을 가정하고 map으로 처리 */}
                            {userQuestion.imageUrl && userQuestion.imageUrl.length > 0 && (
                                <div className={qnaDetailStyle.imgSection}> {/* CSS 클래스명 확인: img 또는 imgSection */}
                                    <p className={qnaDetailStyle.attachmentTitle}>첨부 이미지:</p>
                                    <div className={qnaDetailStyle.imageListContainer}> {/* 이미지 리스트를 감싸는 컨테이너 */}
                                        {userQuestion.imageUrl.map((src, index) => (
                                            <img key={`img-${index}`} src={src} alt={`첨부이미지 ${index + 1}`} className={qnaDetailStyle.attachedImage} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* 수정 버튼은 qnaData.id가 플레이스홀더가 아닐 때만 의미가 있음 */}
                            {/* 실제로는 본인 글일 때만 보이도록 추가 조건 필요 */}
                            <div className={qnaDetailStyle.qnaMainActions}>
                                <button
                                    onClick={handleEditClick}
                                    className={`${qnaDetailStyle.actionButton} ${qnaDetailStyle.editButton}`}
                                >
                                    수정
                                </button>
                            </div>
                        </div>

                        {/* 관리자 답변 표시 */}
                        {adminAnswerData && (
                            <div className={qnaDetailStyle.answerSection}>
                                <h4 className={qnaDetailStyle.answerTitle}>답변</h4>
                                <div className={qnaDetailStyle.adminAnswerItem}>
                                    <div className={qnaDetailStyle.adminAnswerMeta}>
                                        <span className={qnaDetailStyle.adminAnswerAuthor}>{adminAnswerData.author}</span>
                                        <span className={qnaDetailStyle.adminAnswerDate}>{adminAnswerData.createdAt}</span>
                                    </div>
                                    <div className={qnaDetailStyle.adminAnswerContent}>
                                        {adminAnswerData.content.split('\n').map((line, index) => (
                                            <React.Fragment key={`ans-${index}`}>{line}<br /></React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                {...modalProps}
            />
        </>
    );
}

export default QnaDetail;