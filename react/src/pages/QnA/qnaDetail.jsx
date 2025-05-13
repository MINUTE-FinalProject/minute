import React from 'react'; // React import 추가 (습관적으로)
import { Link } from 'react-router-dom'; // Link와 useParams 추가
import qnaDetailStyle from './qnaDetail.module.css';
// import banner from "../../assets/images/banner.png"; // 배너 이미지가 필요하다면 주석 해제 및 경로 확인

// (실제 앱에서는 Context API, Redux, Zustand 등에서 가져오거나 로그인 시 설정됩니다)
// const LOGGED_IN_USER_ID = 'user123'; // 예시: 현재 로그인한 사용자 ID (수정 권한 확인 등에 필요)

function QnaDetail() {
    // const { qnaId } = useParams(); // URL에서 qnaId 가져오기 (데이터 연동 시 필요)

    // 예시 데이터 (실제로는 qnaId를 기반으로 API에서 가져옵니다)
    const qnaPost = {
        id: "sampleQna1", // qnaId
        status: "답변완료", // 또는 "대기"
        author: "김문의",
        title: "이용 관련하여 문의드립니다.",
        createdAt: "2025.05.10",
        content: "안녕하세요. 서비스 이용 중 궁금한 점이 있어 문의드립니다.\n\n이러이러한 부분은 어떻게 처리되나요?\n\n자세한 답변 부탁드립니다.",
        imageUrl: "" // 예: "https://via.placeholder.com/100" 또는 실제 이미지 경로, 여러 개일 경우 배열
    };

    const adminAnswer = {
        author: "관리자",
        createdAt: "2025.05.11",
        content: "안녕하세요, 문의주셔서 감사합니다.\n\n문의하신 내용에 대해 답변드립니다.\n\n해당 부분은 다음과 같이 처리되고 있습니다: [상세 설명]\n\n추가 문의사항이 있으시면 언제든지 다시 질문해주세요."
    };
    // --- 예시 데이터 끝 ---

    return (
        // 페이지 전체를 감싸는 가장 큰 div
        <div className={qnaDetailStyle.background}>

            {/* Q&A 문구를 클릭하면 Q&A 목록으로 이동 */}
            {/* CSS 모듈의 .qnaLinkContainer 와 .qnaLink 스타일 적용 */}
            <div className={qnaDetailStyle.qnaLinkContainer}>
                <Link to="/qna" className={qnaDetailStyle.qnaLink}>Q&A</Link> {/* Link 컴포넌트 사용 및 클래스 적용 */}
            </div>

            {/* 문의 내용 영역 */}
            <div className={qnaDetailStyle.contentArea}>
                <div className={qnaDetailStyle.info}>
                    {/* 각 span에 고유 클래스명을 부여하거나, CSS에서 nth-child 대신 사용할 수 있도록 구조화 */}
                    <span className={qnaDetailStyle.statusTag}>{qnaPost.status}</span>
                    <span className={qnaDetailStyle.authorName}>{qnaPost.author}</span>
                    <span className={qnaDetailStyle.postTitleMain}>{qnaPost.title}</span> {/* 제목을 위한 별도 클래스 */}
                    <span className={qnaDetailStyle.postDate}>{qnaPost.createdAt}</span>
                </div>

                <div className={qnaDetailStyle.textbox}>
                    {/* 실제 내용을 표시할 때는 pre 태그나, \n을 <br/>로 변환하는 로직 필요 */}
                    {qnaPost.content.split('\n').map((line, index) => (
                        <React.Fragment key={index}>{line}<br /></React.Fragment>
                    ))}
                </div>

                {/* 첨부 이미지 (실제로는 qnaPost.imageUrl 등을 사용) */}
                {qnaPost.imageUrl && (
                    <div className={qnaDetailStyle.img}>
                        <img src={qnaPost.imageUrl} alt="업로드이미지" />
                        {/* 이미지가 여러 개일 경우 map으로 반복 처리 */}
                    </div>
                )}

                {/* --- 문의글 수정 버튼 (항상 보이도록) --- */}
                {/* 실제로는 작성자만 보이도록 조건부 렌더링 필요 */}
                <div className={qnaDetailStyle.qnaMainActions}>
                    <button
                        onClick={() => console.log(`Q&A ID ${qnaPost.id} 수정 페이지로 이동`)}
                        className={`${qnaDetailStyle.actionButton} ${qnaDetailStyle.editButton}`}
                    >
                        수정
                    </button>
                    {/* "문의는 수정만 가능해" 라고 하셨으므로 삭제 버튼은 제외합니다. */}
                </div>
                {/* ------------------------------------ */}
            </div>

            {/* 관리자 답변 영역 (댓글처럼 디자인) */}
            {adminAnswer && ( // 답변이 있을 경우에만 표시
                <div className={qnaDetailStyle.answerSection}>
                    <h4 className={qnaDetailStyle.answerTitle}>답변</h4>
                    <div className={qnaDetailStyle.adminAnswerItem}>
                        <div className={qnaDetailStyle.adminAnswerMeta}>
                            <span className={qnaDetailStyle.adminAnswerAuthor}>{adminAnswer.author}</span>
                            <span className={qnaDetailStyle.adminAnswerDate}>{adminAnswer.createdAt}</span>
                        </div>
                        <div className={qnaDetailStyle.adminAnswerContent}>
                            {adminAnswer.content.split('\n').map((line, index) => (
                                <React.Fragment key={index}>{line}<br /></React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {/* --- 관리자 답변 영역 끝 --- */}

        </div>
    );
}

export default QnaDetail;