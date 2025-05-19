import { useEffect, useState } from 'react'; // useState, useEffect 추가
import { Link } from 'react-router-dom';
import xIcon from '../../assets/images/x.png'; // X 아이콘 import (경로 확인 필요)
import MypageNav from '../../components/MypageNavBar/MypageNav';
import qnaWriteStyle from './qnaWrite.module.css';

function QnaWrite() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]); // 선택된 파일 객체들을 저장
    const [previewImages, setPreviewImages] = useState([]); // 미리보기 URL들을 저장

    // 파일 선택 시 호출될 함수
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        // 최대 3개까지만 선택 가능하도록 (선택사항)
        const newFiles = files.slice(0, 3 - selectedFiles.length);

        if (newFiles.length === 0 && files.length > 0) {
            alert('이미지는 최대 3개까지 첨부할 수 있습니다.');
            return;
        }

        setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);

        const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
        setPreviewImages(prevPreviews => [...prevPreviews, ...newPreviewUrls]);

        // 파일 입력 초기화 (같은 파일을 다시 선택할 수 있도록)
        event.target.value = null;
    };

    // 이미지 제거 시 호출될 함수
    const handleRemoveImage = (indexToRemove) => {
        // 미리보기 URL 해제
        URL.revokeObjectURL(previewImages[indexToRemove]);

        setSelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
        setPreviewImages(prevPreviews => prevPreviews.filter((_, index) => index !== indexToRemove));
    };

    // 폼 제출 핸들러 (실제 구현 필요)
    const handleSubmit = (event) => {
        event.preventDefault();
        // title, content, selectedFiles를 사용하여 폼 데이터 구성 및 서버 전송
        console.log({ title, content, files: selectedFiles });
        alert('문의가 등록되었습니다. (실제 서버 연동 필요)');
        // 성공 시 상태 초기화 또는 페이지 이동
        // setTitle('');
        // setContent('');
        // setSelectedFiles([]);
        // previewImages.forEach(url => URL.revokeObjectURL(url)); // 모든 미리보기 URL 해제
        // setPreviewImages([]);
    };

    // 컴포넌트 언마운트 시 미리보기 URL 해제 (메모리 누수 방지)
    useEffect(() => {
        return () => {
            previewImages.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewImages]);

    return (
        <form onSubmit={handleSubmit}> {/* form 태그로 감싸고 onSubmit 연결 */}
            <MypageNav />
            <div className={qnaWriteStyle.layout}>
                <div className={qnaWriteStyle.container}>
                    <div className={qnaWriteStyle.background}>

                        <div className={qnaWriteStyle.title}>
                            <Link to="/qna" className={qnaWriteStyle.pageTitleLink}>
                                <h1>Q&A</h1>
                            </Link>
                        </div>

                        <div className={qnaWriteStyle.contentArea}>
                            <div className={qnaWriteStyle.info}>
                                <label htmlFor="qnaFormTitle" className={qnaWriteStyle.label}>제목</label>
                                <input
                                    type="text"
                                    id="qnaFormTitle"
                                    className={qnaWriteStyle.inputField}
                                    placeholder="제목을 입력해주세요"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={qnaWriteStyle.textbox}>
                                <label htmlFor="qnaFormContent" className={qnaWriteStyle.label}>내용</label>
                                <textarea
                                    id="qnaFormContent"
                                    className={qnaWriteStyle.textareaField}
                                    placeholder="내용을 입력해주세요."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <div className={qnaWriteStyle.imgSection}> {/* 클래스명 변경 img -> imgSection */}
                                <label htmlFor="qnaFormImages" className={qnaWriteStyle.label}>이미지 첨부 (최대 3개)</label>
                                <input
                                    type="file"
                                    id="qnaFormImages"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                <div className={qnaWriteStyle.imagePreviewContainer}>
                                    {previewImages.map((previewUrl, index) => (
                                        <div key={previewUrl} className={qnaWriteStyle.imagePreviewItem}>
                                            <img src={previewUrl} alt={`미리보기 ${index + 1}`} className={qnaWriteStyle.previewImage} />
                                            <button
                                                type="button"
                                                className={qnaWriteStyle.removeImageButton}
                                                onClick={() => handleRemoveImage(index)}
                                                title="이미지 제거"
                                            >
                                                <img src={xIcon} alt="제거" className={qnaWriteStyle.removeIcon} />
                                            </button>
                                        </div>
                                    ))}
                                    {/* 이미지 첨부 버튼 (플레이스홀더 역할) - 최대 3개까지 */}
                                    {previewImages.length < 3 && (
                                        <div
                                            className={qnaWriteStyle.imagePlaceholder}
                                            onClick={() => document.getElementById('qnaFormImages').click()}
                                            role="button"
                                            tabIndex={0}
                                            onKeyPress={(e) => { if (e.key === 'Enter') document.getElementById('qnaFormImages').click(); }}
                                        >
                                            + 이미지 추가 ({previewImages.length}/3)
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={qnaWriteStyle.buttons}>
                                {/* '업로드' 버튼은 파일 선택 input을 트리거하는 용도라면 유지, 아니면 제거 */}
                                {/* <button
                                    type="button"
                                    onClick={() => document.getElementById('qnaFormImages').click()}
                                >
                                    업로드
                                </button> */}
                                <button type="submit" className={qnaWriteStyle.submitButton}> {/* 클래스 추가 */}
                                    작성
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default QnaWrite;