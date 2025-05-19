import { useEffect, useState } from 'react'; // useState, useEffect 추가
import { Link } from 'react-router-dom'; // useParams 추가 (실제 데이터 로딩 시)
import xIcon from '../../assets/images/x.png'; // X 아이콘 import (경로 확인 필요)
import MypageNav from '../../components/MypageNavBar/MypageNav';
import qnaEditStyle from './qnaEdit.module.css';

// 예시: QnA 데이터 (실제로는 API를 통해 가져옴)
const sampleQnaData = {
    id: 'qna123',
    title: '기존 문의 제목입니다.',
    content: '기존 문의 내용입니다.\n이미지가 잘 수정되는지 테스트 중입니다.',
    images: [
        { id: 'img1', url: 'https://via.placeholder.com/100/FF0000/FFFFFF?Text=기존이미지1' },
        // { id: 'img2', url: 'https://via.placeholder.com/100/00FF00/FFFFFF?Text=기존이미지2' }, // 필요시 추가
    ],
};

function QnaEdit() {
    // const { qnaId } = useParams(); // URL 파라미터에서 qnaId 가져오기

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [existingImages, setExistingImages] = useState([]); // 서버에서 불러온 기존 이미지 {id, url}
    const [imagesToDelete, setImagesToDelete] = useState([]); // 삭제할 기존 이미지의 ID 목록
    const [newSelectedFiles, setNewSelectedFiles] = useState([]); // 새로 선택된 파일 객체들
    const [newPreviewImages, setNewPreviewImages] = useState([]); // 새 파일의 미리보기 URL들

    // 페이지 로드 시 기존 문의 데이터 불러오기 (useEffect 사용)
    useEffect(() => {
        // TODO: 실제로는 qnaId를 사용하여 API 호출
        // 예시로 샘플 데이터 사용
        setTitle(sampleQnaData.title);
        setContent(sampleQnaData.content);
        setExistingImages(sampleQnaData.images || []);
    }, []); // qnaId가 있다면 [qnaId]를 의존성 배열에 추가

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const currentVisibleExistingCount = existingImages.filter(img => !imagesToDelete.includes(img.id)).length;
        const totalAllowedNew = 3 - (currentVisibleExistingCount + newSelectedFiles.length);

        const filesToAdd = files.slice(0, Math.max(0, totalAllowedNew));

        if (filesToAdd.length < files.length) {
            alert(`이미지는 최대 3개까지 첨부할 수 있습니다. (현재 ${filesToAdd.length}개 추가 가능)`);
        }

        if (filesToAdd.length > 0) {
            setNewSelectedFiles(prevFiles => [...prevFiles, ...filesToAdd]);
            const newUrls = filesToAdd.map(file => URL.createObjectURL(file));
            setNewPreviewImages(prevPreviews => [...prevPreviews, ...newUrls]);
        }
        event.target.value = null; // 파일 입력 초기화
    };

    const handleRemoveExistingImage = (imageIdToRemove) => {
        setImagesToDelete(prevDeleted => [...prevDeleted, imageIdToRemove]);
        // 시각적으로만 제거 (실제 삭제는 폼 제출 시)
        // setExistingImages(prevImages => prevImages.filter(img => img.id !== imageIdToRemove));
        // 위 방식 대신, 렌더링 시 imagesToDelete를 확인하여 필터링
    };

    const handleRemoveNewImage = (indexToRemove) => {
        URL.revokeObjectURL(newPreviewImages[indexToRemove]); // 중요: 메모리 누수 방지
        setNewSelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
        setNewPreviewImages(prevPreviews => prevPreviews.filter((_, index) => index !== indexToRemove));
    };

    const handleUpdateSubmit = (event) => {
        event.preventDefault();
        // TODO: 수정된 데이터 서버로 전송
        // FormData 사용 시:
        // const formData = new FormData();
        // formData.append('title', title);
        // formData.append('content', content);
        // imagesToDelete.forEach(id => formData.append('deleteImageIds[]', id));
        // newSelectedFiles.forEach(file => formData.append('newImages[]', file));
        // 서버 전송 로직...

        console.log('수정 내용 전송:', {
            title,
            content,
            deleteImageIds: imagesToDelete,
            newFiles: newSelectedFiles.map(f => f.name) // 파일 이름만 로그
        });
        alert('문의가 수정되었습니다. (실제 서버 연동 필요)');
    };

    // 컴포넌트 언마운트 시 새 이미지 미리보기 URL 해제
    useEffect(() => {
        return () => {
            newPreviewImages.forEach(url => URL.revokeObjectURL(url));
        };
    }, [newPreviewImages]);

    const visibleExistingImages = existingImages.filter(img => !imagesToDelete.includes(img.id));
    const totalCurrentImageCount = visibleExistingImages.length + newPreviewImages.length;

    return (
        <form onSubmit={handleUpdateSubmit}>
            <MypageNav />
            <div className={qnaEditStyle.layout}>
                <div className={qnaEditStyle.container}>
                    <div className={qnaEditStyle.background}>
                        <div className={qnaEditStyle.title}>
                            <Link to="/qna" className={qnaEditStyle.pageTitleLink}>
                                <h1>Q&A 수정</h1>
                            </Link>
                        </div>

                        <div className={qnaEditStyle.contentArea}>
                            <div className={qnaEditStyle.info}>
                                <label htmlFor="qnaEditFormTitle" className={qnaEditStyle.label}>제목</label>
                                <input
                                    type="text"
                                    id="qnaEditFormTitle"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="제목을 입력해주세요"
                                    className={qnaEditStyle.inputField}
                                    required
                                />
                            </div>

                            <div className={qnaEditStyle.textbox}>
                                <label htmlFor="qnaEditFormContent" className={qnaEditStyle.label}>내용</label>
                                <textarea
                                    id="qnaEditFormContent"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="내용을 입력해주세요."
                                    className={qnaEditStyle.textareaField}
                                    required
                                ></textarea>
                            </div>

                            <div className={qnaEditStyle.imgSection}> {/* 클래스명 img -> imgSection */}
                                <label htmlFor="qnaEditFormImages" className={qnaEditStyle.label}>
                                    이미지 첨부 (현재 {totalCurrentImageCount}개 / 최대 3개)
                                </label>
                                <input
                                    type="file"
                                    id="qnaEditFormImages"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    disabled={totalCurrentImageCount >= 3} // 3개 꽉 차면 비활성화
                                />
                                <div className={qnaEditStyle.imagePreviewContainer}>
                                    {/* 기존 이미지 표시 */}
                                    {visibleExistingImages.map((image) => (
                                        <div key={image.id} className={qnaEditStyle.imagePreviewItem}>
                                            <img src={image.url} alt={`기존 이미지 ${image.id}`} className={qnaEditStyle.previewImage} />
                                            <button
                                                type="button"
                                                className={qnaEditStyle.removeImageButton}
                                                onClick={() => handleRemoveExistingImage(image.id)}
                                                title="기존 이미지 제거"
                                            >
                                                <img src={xIcon} alt="제거" className={qnaEditStyle.removeIcon} />
                                            </button>
                                        </div>
                                    ))}
                                    {/* 새로 추가된 이미지 미리보기 */}
                                    {newPreviewImages.map((previewUrl, index) => (
                                        <div key={previewUrl} className={qnaEditStyle.imagePreviewItem}>
                                            <img src={previewUrl} alt={`새 미리보기 ${index + 1}`} className={qnaEditStyle.previewImage} />
                                            <button
                                                type="button"
                                                className={qnaEditStyle.removeImageButton}
                                                onClick={() => handleRemoveNewImage(index)}
                                                title="새 이미지 제거"
                                            >
                                                <img src={xIcon} alt="제거" className={qnaEditStyle.removeIcon} />
                                            </button>
                                        </div>
                                    ))}
                                    {/* 이미지 추가 플레이스홀더 */}
                                    {totalCurrentImageCount < 3 && (
                                        <div
                                            className={qnaEditStyle.imagePlaceholder}
                                            onClick={() => document.getElementById('qnaEditFormImages').click()}
                                            role="button"
                                            tabIndex={0}
                                            onKeyPress={(e) => { if (e.key === 'Enter') document.getElementById('qnaEditFormImages').click(); }}
                                        >
                                            + 이미지 추가
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={qnaEditStyle.buttons}>
                                <button
                                    type="button"
                                    className={qnaEditStyle.triggerButton} // 새 클래스 또는 기존 버튼 스타일 활용
                                    onClick={() => document.getElementById('qnaEditFormImages').click()}
                                    disabled={totalCurrentImageCount >= 3}
                                >
                                    이미지 파일 선택
                                </button>
                                <button type="submit" className={qnaEditStyle.submitButton}>
                                    수정 완료
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default QnaEdit;