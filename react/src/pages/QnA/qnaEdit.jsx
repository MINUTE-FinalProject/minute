import { Link } from 'react-router-dom'; // Link import 추가
import MypageNav from '../../components/MypageNavBar/MypageNav';
import qnaEditStyle from './qnaEdit.module.css';
// 수정 페이지이므로 기존 데이터를 불러오고 상태를 관리하기 위해 useState, useEffect 등을 사용할 수 있습니다.
// import { useState, useEffect } from 'react';

function QnaEdit() {
    // --- 실제 구현 시 ---
    // const [title, setTitle] = useState(''); // 기존 제목
    // const [content, setContent] = useState(''); // 기존 내용
    // const [existingImages, setExistingImages] = useState([]); // 기존 첨부 이미지 목록
    // const [newFiles, setNewFiles] = useState([]); // 새로 첨부할 파일 목록

    // useEffect(() => {
    //   // 예: const qnaId = '123'; // 실제로는 URL 파라미터 등에서 가져옵니다.
    //   // fetchQnaData(qnaId).then(data => {
    //   //   setTitle(data.title);
    //   //   setContent(data.content);
    //   //   setExistingImages(data.images);
    //   // });
    // }, []); // 페이지 로드 시 한 번 실행

    // const handleFileChange = (event) => {
    //   // 새로 선택된 파일 처리
    //   // setNewFiles(Array.from(event.target.files));
    // };

    // const handleUpdateSubmit = (event) => {
    //   event.preventDefault();
    //   // 수정된 내용(title, content, existingImages, newFiles)을 서버로 전송하는 로직
    //   console.log('수정 내용 전송:', { title, content, existingImages, newFiles });
    // };
    // --- /실제 구현 시 ---

    return (
        // <form onSubmit={handleUpdateSubmit}> {/* 전체를 form으로 감쌀 경우 */}
        <>
            <MypageNav/>
            <div className={qnaEditStyle.layout}>
                <div className={qnaEditStyle.container}>
                    <div className={qnaEditStyle.background}>

                        <div className={qnaEditStyle.title}>
                            {/* Q&A 문구를 Link 컴포넌트로 변경하고 클래스 적용 */}
                            <Link to="/qna" className={qnaEditStyle.pageTitleLink}>
                                <h1>Q&A</h1> {/* 또는 "문의 수정" 등으로 변경 가능 */}
                            </Link>
                        </div>

                        <div className={qnaEditStyle.contentArea}>

                            {/* 제목 입력 필드 */}
                            <div className={qnaEditStyle.info}>
                                <label htmlFor="qnaEditFormTitle" className={qnaEditStyle.label}>제목</label>
                                <input
                                    type="text"
                                    id="qnaEditFormTitle"
                                    // value={title}
                                    // onChange={(e) => setTitle(e.target.value)}
                                    placeholder="제목을 입력해주세요"
                                    className={qnaEditStyle.inputField} // CSS 모듈 클래스 적용
                                />
                            </div>

                            {/* 내용 입력 필드 */}
                            <div className={qnaEditStyle.textbox}>
                                <label htmlFor="qnaEditFormContent" className={qnaEditStyle.label}>내용</label>
                                <textarea
                                    id="qnaEditFormContent"
                                    // value={content}
                                    // onChange={(e) => setContent(e.target.value)}
                                    placeholder="내용을 입력해주세요."
                                    className={qnaEditStyle.textareaField} // CSS 모듈 클래스 적용
                                ></textarea>
                            </div>

                            {/* 이미지 업로드/표시 영역 */}
                            <div className={qnaEditStyle.img}>
                                <label htmlFor="qnaEditFormImages" className={qnaEditStyle.label}>이미지 첨부</label>
                                <input
                                    type="file"
                                    id="qnaEditFormImages"
                                    multiple
                                    accept="image/*"
                                    // onChange={handleFileChange}
                                    style={{ display: 'none' }} 
                                />
                                <div className={qnaEditStyle.imagePreviewContainer}>
                                    {/* 기존 이미지를 여기에 표시하는 로직 (예시) */}
                                    {/* existingImages.map((image, index) => (
                                        <div key={`existing-${index}`} className={qnaEditStyle.existingImageWrapper}>
                                            <img src={image.url} alt={`기존 이미지 ${index + 1}`} className={qnaEditStyle.imageItem} />
                                            <button type="button" onClick={() => removeExistingImage(index)}>삭제</button>
                                        </div>
                                    )) */}
                                    <div
                                        className={qnaEditStyle.imagePlaceholder}
                                        onClick={() => document.getElementById('qnaEditFormImages').click()}
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={(e) => { if (e.key === 'Enter') document.getElementById('qnaEditFormImages').click(); }}
                                    >
                                        이미지 변경/추가 1
                                    </div>
                                    <div
                                        className={qnaEditStyle.imagePlaceholder}
                                        onClick={() => document.getElementById('qnaEditFormImages').click()}
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={(e) => { if (e.key === 'Enter') document.getElementById('qnaEditFormImages').click(); }}
                                    >
                                        이미지 변경/추가 2
                                    </div>
                                    <div
                                        className={qnaEditStyle.imagePlaceholder}
                                        onClick={() => document.getElementById('qnaEditFormImages').click()}
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={(e) => { if (e.key === 'Enter') document.getElementById('qnaEditFormImages').click(); }}
                                    >
                                        이미지 변경/추가 3
                                    </div>
                                </div>
                            </div>

                            <div className={qnaEditStyle.buttons}>
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('qnaEditFormImages').click()}
                                >
                                    이미지 변경
                                </button>
                                <button
                                    type="submit"
                                >
                                    수정
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

export default QnaEdit;