import MypageNav from '../../components/MypageNavBar/MypageNav';
import qnaEditStyle from './qnaEdit.module.css';
// React Router를 사용한다면 Link를 import 하세요.
// import { Link } from 'react-router-dom';
// 수정 페이지이므로 기존 데이터를 불러오고 상태를 관리하기 위해 useState, useEffect 등을 사용할 수 있습니다.
// import React, { useState, useEffect } from 'react';

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
                {/* Q&A 문구를 클릭하면 Q&A 목록 페이지로 가는 기능 */}
                {/* React Router 사용 시: <Link to="/qna"><h1>Q&A</h1></Link> */}
                <a href="/qna" style={{ textDecoration: 'none', color: 'inherit' }}> {/* 기본 a 태그 사용 시 */}
                    <h1>Q&A</h1> {/* 또는 "문의 수정" 등으로 변경 가능 */}
                </a>
            </div>

            <div className={qnaEditStyle.contentArea}>

                {/* 제목 입력 필드 */}
                <div className={qnaEditStyle.info}>
                    <label htmlFor="qnaEditFormTitle" className={qnaEditStyle.label}>제목</label>
                    <input
                        type="text"
                        id="qnaEditFormTitle"
                        // value={title} // 기존 제목을 상태에서 받아옴
                        // onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력해주세요"
                        // className={qnaEditStyle.inputTitle} // 필요시 qnaEditStyle.module.css에 개별 스타일 정의
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} // CSS 모듈 사용 권장
                    />
                </div>

                {/* 내용 입력 필드 (클래스명 textbox로 수정) */}
                <div className={qnaEditStyle.textbox}>
                    <label htmlFor="qnaEditFormContent" className={qnaEditStyle.label}>내용</label>
                    <textarea
                        id="qnaEditFormContent"
                        // value={content} // 기존 내용을 상태에서 받아옴
                        // onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 입력해주세요."
                        // className={qnaEditStyle.textareaContent} // 필요시 qnaEditStyle.module.css에 개별 스타일 정의
                        style={{ width: '100%', minHeight: '200px', padding: '8px', boxSizing: 'border-box' }} // CSS 모듈 사용 권장
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
                        style={{ display: 'none' }} // 버튼으로 트리거하기 위해 숨김
                    />
                    {/* 기존 이미지 표시 및 새 이미지 추가 UI */}
                    <div className={qnaEditStyle.imagePreviewContainer}>
                        {/* 기존 이미지를 여기에 표시하는 로직 (예시) */}
                        {/* existingImages.map((image, index) => (
                            <div key={`existing-${index}`} className={qnaEditStyle.existingImageWrapper}>
                                <img src={image.url} alt={`기존 이미지 ${index + 1}`} className={qnaEditStyle.imageItem} />
                                <button type="button" onClick={() => removeExistingImage(index)}>삭제</button>
                            </div>
                        )) */}

                        {/* 새 이미지 추가를 위한 플레이스홀더 (작성 페이지와 유사) */}
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
                    {/* 새로 선택된 파일 목록을 여기에 표시할 수 있습니다. */}
                    {/* newFiles.map(file => <p key={file.name}>{file.name}</p>)} */}
                </div>

                {/* 버튼 영역 */}
                <div className={qnaEditStyle.buttons}>
                    <button
                        type="button"
                        // className={qnaEditStyle.uploadButton} // 필요시 스타일 추가
                        onClick={() => document.getElementById('qnaEditFormImages').click()} // 파일 선택창 열기
                    >
                        이미지 변경 {/* 또는 "파일 선택" */}
                    </button>
                    <button
                        type="submit" // 폼 제출 버튼
                        // className={qnaEditStyle.submitButton} // 필요시 스타일 추가
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