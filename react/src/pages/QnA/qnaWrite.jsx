import MypageNav from '../../components/MypageNavBar/MypageNav';
import qnaWriteStyle from './qnaWrite.module.css';
// React Router를 사용한다면 Link를 import 하세요.
// import { Link } from 'react-router-dom';

function QnaWrite() {
    // 실제 상태 관리 로직 (useState) 및 이벤트 핸들러는 여기에 추가됩니다.
    // const [title, setTitle] = useState('');
    // const [content, setContent] = useState('');
    // const [images, setImages] = useState([]);

    // const handleFileSelect = (event) => {
    //     // 파일 선택 로직
    // };

    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     // 폼 제출 로직
    // };

    return (
        // <form onSubmit={handleSubmit}> {/* 전체를 form으로 감쌀 경우 */}
        <>
          <MypageNav/>
         <div className={qnaWriteStyle.layout}>
            <div className={qnaWriteStyle.container}>
                 <div className={qnaWriteStyle.background}>

            <div className={qnaWriteStyle.title}>
                {/* Q&A 문구를 클릭하면 Q&A로 가는 리다이렉트 기능 */}
                {/* React Router 사용 시: <Link to="/qna"><h1>Q&A</h1></Link> */}
                <a href="/qna" style={{ textDecoration: 'none', color: 'inherit' }}> {/* 기본 a 태그 사용 시, 스타일 초기화 */}
                    <h1>Q&A</h1>
                </a>
            </div>

            <div className={qnaWriteStyle.contentArea}>

                {/* 제목 입력 필드 */}
                <div className={qnaWriteStyle.info}> {/* 기존 클래스명 유지 */}
                    <label htmlFor="qnaFormTitle" className={qnaWriteStyle.label}>제목</label> {/* qnaWriteStyle.label은 새로 추가해야 할 수 있음 */}
                    <input
                        type="text"
                        id="qnaFormTitle"
                        // className={qnaWriteStyle.inputTitle} // 필요시 qnaWriteStyle.module.css에 정의
                        placeholder="제목을 입력해주세요"
                        // value={title}
                        // onChange={(e) => setTitle(e.target.value)}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} // 인라인 스타일 예시, CSS 모듈 권장
                    />
                </div>

                {/* 내용 입력 필드 */}
                <div className={qnaWriteStyle.textbox}> {/* 기존 클래스명 유지 */}
                    <label htmlFor="qnaFormContent" className={qnaWriteStyle.label}>내용</label> {/* qnaWriteStyle.label은 새로 추가해야 할 수 있음 */}
                    <textarea
                        id="qnaFormContent"
                        // className={qnaWriteStyle.textareaContent} // 필요시 qnaWriteStyle.module.css에 정의
                        placeholder="내용을 입력해주세요."
                        // value={content}
                        // onChange={(e) => setContent(e.target.value)}
                        style={{ width: '100%', minHeight: '150px', padding: '8px', boxSizing: 'border-box' }} // 인라인 스타일 예시, CSS 모듈 권장
                    ></textarea>
                </div>

                {/* 이미지 업로드 영역 */}
                <div className={qnaWriteStyle.img}> {/* 기존 클래스명 유지 */}
                    <label htmlFor="qnaFormImages" className={qnaWriteStyle.label}>이미지 첨부</label>
                    {/* 실제 파일 입력을 위한 input (숨김 처리 가능) */}
                    <input
                        type="file"
                        id="qnaFormImages"
                        multiple
                        accept="image/*"
                        // onChange={handleFileSelect}
                        style={{ display: 'none' }} // 버튼으로 트리거하기 위해 숨김
                    />
                    {/* 이미지 미리보기 또는 파일 선택을 유도하는 UI (첨부 이미지 참고하여 3개 배치) */}
                    <div className={qnaWriteStyle.imagePreviewContainer}> {/* 이 클래스도 새로 정의 필요 */}
                        <div
                            className={qnaWriteStyle.imagePlaceholder} // 이 클래스도 새로 정의 필요
                            onClick={() => document.getElementById('qnaFormImages').click()}
                            role="button" // 접근성을 위해 역할 명시
                            tabIndex={0} // 키보드 포커스 가능하게
                            onKeyPress={(e) => { if (e.key === 'Enter') document.getElementById('qnaFormImages').click(); }} // Enter 키로도 동작
                        >
                            이미지 1
                        </div>
                        <div
                            className={qnaWriteStyle.imagePlaceholder}
                            onClick={() => document.getElementById('qnaFormImages').click()}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => { if (e.key === 'Enter') document.getElementById('qnaFormImages').click(); }}
                        >
                            이미지 2
                        </div>
                        <div
                            className={qnaWriteStyle.imagePlaceholder}
                            onClick={() => document.getElementById('qnaFormImages').click()}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => { if (e.key === 'Enter') document.getElementById('qnaFormImages').click(); }}
                        >
                            이미지 3
                        </div>
                    </div>
                    {/* 선택된 이미지 파일 목록을 여기에 표시할 수 있습니다. */}
                    {/* {images.map(file => <p key={file.name}>{file.name}</p>)} */}
                </div>

                {/* 버튼 영역 */}
                <div className={qnaWriteStyle.buttons}> {/* 기존 클래스명 유지 */}
                    <button
                        type="button"
                        // className={qnaWriteStyle.uploadButton} // 필요시 qnaWriteStyle.module.css에 정의 (기존 버튼 클래스에 추가 스타일 가능)
                        onClick={() => document.getElementById('qnaFormImages').click()} // 파일 선택창 열기
                    >
                        업로드 {/* 텍스트는 '파일 선택' 또는 '이미지 추가' 등이 더 적절할 수 있음 */}
                    </button>
                    <button
                        type="submit" // 폼 제출 버튼 (form 태그로 감쌌을 경우) 또는 type="button" (JS로 직접 핸들링 시)
                        // className={qnaWriteStyle.submitButton} // 필요시 qnaWriteStyle.module.css에 정의
                    >
                        작성
                    </button>
                </div>
            </div>
        </div>
            </div>
            </div>
        </>
       
        // </form>
    );
}

export default QnaWrite;