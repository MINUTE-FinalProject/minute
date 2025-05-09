import qnaDetailStyle from './qnaDetail.module.css';
// Q&A 목록으로 이동하기 위해 react-router-dom의 Link 컴포넌트 또는 다른 네비게이션 방법을 사용할 수 있습니다.
// import { Link } from 'react-router-dom';

function QnaDetail() {
    return (
        // 사용자께서 의도하신 페이지 전체를 감싸는 가장 큰 div 입니다.
        <div className={qnaDetailStyle.background}>
            
            {/* Q&A 문구를 클릭하면 Q&A로 가는 리다이렉트 기능 */}
            {/* 이 div는 qnaDetailStyle.background 내부에 위치하며, 
                필요에 따라 직접 className을 추가하여 스타일링할 수 있습니다. 
            */}
            <div>
                {/* React Router를 사용하신다면 <Link to="/qna">Q&A</Link> 와 같이 작성할 수 있습니다.
                  여기서는 간단한 HTML a 태그로 리디렉션 기능을 표현했습니다.
                */}
                <a href="/qna">Q&A</a>
            </div>

            {/* --- 사용자가 작성한 기존 코드 시작 (className 및 내용 수정 없음) --- */}
            {/* Q&A 링크 아래에 기존 컨텐츠가 위치합니다. */}
            <div className={qnaDetailStyle.contentArea}>

                <div className={qnaDetailStyle.info}>
                    <span>답변상태</span>
                    <span>작성자</span>
                    <span>제목</span>
                    <span>작성날짜</span>
                </div>

                <div className={qnaDetailStyle.textbox}>
                    <p>내용</p>
                </div>

                <div className={qnaDetailStyle.img}>
                    <img src="" alt="업로드이미지" />
                </div>
            </div>

            <div className={qnaDetailStyle.answer}>
                {/* 사용자가 작성한 'clasName'을 그대로 유지합니다. */}
                <div clasName={qnaDetailStyle.text}> 
                    <span>답변</span>
                    <span>관리자</span>
                    <span>답변내용</span>
                    <span>작성날짜</span>
                </div>
            </div>
            {/* --- 사용자가 작성한 기존 코드 끝 --- */}

        </div>
    );
}

export default QnaDetail;