// src/pages/QnA/QnaEdit.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import xIcon from '../../assets/images/x.png';
import qnaEditStyle from '../../assets/styles/qnaEdit.module.css';
import Modal from '../../components/Modal/Modal';
import MypageNav from '../../components/MypageNavBar/MypageNav';

// QnaDetail.jsx의 mockQnaDatabase와 키 형식을 일치시킵니다.
const mockQnaDatabaseForEdit = {
    'qna-1': { 
        id: 'qna-1', 
        title: '기존 문의 제목입니다 (ID: qna-1).', 
        content: '기존 문의 내용입니다.\n이미지가 잘 수정되는지 테스트 중입니다. (ID: qna-1)',
        images: [
            { id: 'img1', url: 'https://via.placeholder.com/100/FF0000/FFFFFF?Text=기존이미지1_ID1' },
        ],
    },
    'qna-2': {
        id: 'qna-2',
        title: '다른 문의 제목 (ID: qna-2)',
        content: '이것은 다른 문의 내용입니다. (ID: qna-2)',
        images: [
            { id: 'img_ex1', url: 'https://via.placeholder.com/100/0000FF/FFFFFF?Text=기존이미지_EX1' },
            { id: 'img_ex2', url: 'https://via.placeholder.com/100/00FF00/FFFFFF?Text=기존이미지_EX2' },
        ],
    }
    // 필요에 따라 더 많은 목업 데이터 추가
};

const EMPTY_QNA_FOR_EDIT = {
    title: '',
    content: '',
    images: [] // existingImages는 이 구조를 따름
};


function QnaEdit() {
    const { qnaId } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [existingImages, setExistingImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [newSelectedFiles, setNewSelectedFiles] = useState([]);
    const [newPreviewImages, setNewPreviewImages] = useState([]);

    const [originalData, setOriginalData] = useState(EMPTY_QNA_FOR_EDIT);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalProps, setModalProps] = useState({
        title: '', message: '', onConfirm: null, confirmText: '확인',
        cancelText: null, type: 'default', confirmButtonType: 'primary',
        cancelButtonType: 'secondary'
    });

    useEffect(() => {
        setIsLoading(true);
        setTitle(''); setContent(''); setExistingImages([]);
        setImagesToDelete([]); setNewSelectedFiles([]); setNewPreviewImages([]);
        setOriginalData(EMPTY_QNA_FOR_EDIT); 

        console.log("[QnaEdit useEffect] Fired. qnaId:", qnaId);

        const fetchQnaDataForEdit = (id) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const data = mockQnaDatabaseForEdit[id];
                    if (data) {
                        resolve(data);
                    } else {
                        reject(new Error(`ID '${id}'에 해당하는 수정할 문의를 찾을 수 없습니다.`));
                    }
                }, 300);
            });
        };

        if (qnaId) {
            fetchQnaDataForEdit(qnaId)
                .then(data => {
                    setTitle(data.title);
                    setContent(data.content);
                    setExistingImages(data.images || []);
                    setOriginalData({ 
                        title: data.title,
                        content: data.content,
                        existingImages: data.images || [] 
                    });
                })
                .catch(err => {
                    console.error("QnA 데이터 로드 실패:", err.message, "-- 빈 양식으로 시작합니다.");
                    setModalProps({
                        title: "데이터 로드 실패",
                        message: `${err.message}\n빈 양식으로 문의 수정을 시작합니다.`,
                        confirmText: "확인", type: "warning", confirmButtonType: "blackButton",
                        onConfirm: () => setIsModalOpen(false)
                    });
                    setIsModalOpen(true);
                })
                .finally(() => setIsLoading(false));
        } else {
            console.log("수정할 qnaId 없음. 빈 양식으로 시작합니다.");
            setIsLoading(false);
            setModalProps({
                title: "알림",
                message: "수정할 문의 ID가 제공되지 않았습니다.\n빈 양식으로 문의 수정을 시작합니다.",
                confirmText: "확인", type: "warning", confirmButtonType: "blackButton",
                onConfirm: () => setIsModalOpen(false)
            });
            setIsModalOpen(true);
        }
    }, [qnaId]);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const currentVisibleExistingCount = existingImages.filter(img => !imagesToDelete.includes(img.id)).length;
        const totalCurrentImages = currentVisibleExistingCount + newSelectedFiles.length;
        const remainingSlots = 3 - totalCurrentImages;
        const filesToAdd = files.slice(0, Math.max(0, remainingSlots));

        if (filesToAdd.length < files.length) {
            setModalProps({
                title: "첨부파일 제한",
                message: `이미지는 최대 3개까지 첨부할 수 있습니다. (현재 ${totalCurrentImages}개, 추가 ${filesToAdd.length}개 선택됨)`,
                confirmText: "확인", type: "warning", confirmButtonType: 'blackButton'
            });
            setIsModalOpen(true);
        }
        if (filesToAdd.length > 0) {
            setNewSelectedFiles(prevFiles => [...prevFiles, ...filesToAdd]);
            const newUrls = filesToAdd.map(file => URL.createObjectURL(file));
            setNewPreviewImages(prevPreviews => [...prevPreviews, ...newUrls]);
        }
        event.target.value = null;
    };

    const handleRemoveExistingImage = (imageIdToRemove) => {
        setImagesToDelete(prevDeleted => [...prevDeleted, imageIdToRemove]);
    };

    const handleRemoveNewImage = (indexToRemove) => {
        URL.revokeObjectURL(newPreviewImages[indexToRemove]);
        setNewSelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
        setNewPreviewImages(prevPreviews => prevPreviews.filter((_, index) => index !== indexToRemove));
    };

    const handleUpdateSubmit = (event) => {
        event.preventDefault();
        if (!title.trim()) {
            setModalProps({ title: "입력 오류", message: "제목을 입력해주세요.", confirmText: "확인", type: "warning", confirmButtonType: 'blackButton' });
            setIsModalOpen(true); return;
        }
        if (!content.trim()) {
            setModalProps({ title: "입력 오류", message: "내용을 입력해주세요.", confirmText: "확인", type: "warning", confirmButtonType: 'blackButton' });
            setIsModalOpen(true); return;
        }
        
        console.log('수정 내용 전송:', { qnaId, title, content, deleteImageIds: imagesToDelete, newFiles: newSelectedFiles.map(f => f.name) });
        
        setModalProps({
            title: "수정 완료", message: "문의가 성공적으로 수정되었습니다.", confirmText: "확인",
            type: "success", // 사용자용 성공 모달 (확인 버튼 검정색)
            confirmButtonType: 'primary', // CSS에서 .content-success .primary가 검정색으로 스타일링됨
            onConfirm: () => navigate(qnaId ? `/qnaDetail/${qnaId}` : '/qna')
        });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        const titleChanged = title !== originalData.title;
        const contentChanged = content !== originalData.content;
        const currentExistingImageIds = existingImages.filter(img => !imagesToDelete.includes(img.id)).map(img => img.id);
        const originalExistingImageIds = originalData.existingImages.map(img => img.id);
        const imagesStructureChanged = newSelectedFiles.length > 0 || imagesToDelete.length > 0 ||
                                     currentExistingImageIds.length !== originalExistingImageIds.length ||
                                     !currentExistingImageIds.every(id => originalExistingImageIds.includes(id));

        if (titleChanged || contentChanged || imagesStructureChanged) {
            setModalProps({
                title: '수정 취소', message: '변경사항이 저장되지 않았습니다. 정말 수정을 취소하시겠습니까?',
                confirmText: '예, 취소합니다', cancelText: '계속 수정',
                onConfirm: () => navigate(qnaId ? `/qnaDetail/${qnaId}` : '/qna'),
                type: 'warning', confirmButtonType: 'danger'
            });
            setIsModalOpen(true);
        } else {
            navigate(qnaId ? `/qnaDetail/${qnaId}` : '/qna');
        }
    };

    useEffect(() => {
        return () => {
            newPreviewImages.forEach(url => URL.revokeObjectURL(url));
        };
    }, [newPreviewImages]);

    const visibleExistingImages = existingImages.filter(img => !imagesToDelete.includes(img.id));
    const totalCurrentImageCount = visibleExistingImages.length + newPreviewImages.length;

    if (isLoading) {
        return ( 
            <>
                <MypageNav />
                <div className={qnaEditStyle.layout}><div className={qnaEditStyle.container}><div className={qnaEditStyle.background} style={{padding: "50px", textAlign: "center"}}>문의 정보를 불러오는 중입니다...</div></div></div>
            </>
        );
    }

    return (
        <>
            <MypageNav />
            <div className={qnaEditStyle.layout}>
                <div className={qnaEditStyle.container}>
                    <div className={qnaEditStyle.background}>
                        <div className={qnaEditStyle.title}>
                            <Link to="/qna" className={qnaEditStyle.pageTitleLink}>
                                <h1>Q&A 수정</h1>
                            </Link>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className={qnaEditStyle.contentArea}>
                            <div className={qnaEditStyle.info}>
                                <label htmlFor="qnaEditFormTitle" className={qnaEditStyle.label}>제목</label>
                                <input
                                    type="text" id="qnaEditFormTitle" value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="제목을 입력해주세요" className={qnaEditStyle.inputField}
                                />
                            </div>
                            <div className={qnaEditStyle.textbox}>
                                <label htmlFor="qnaEditFormContent" className={qnaEditStyle.label}>내용</label>
                                <textarea
                                    id="qnaEditFormContent" value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="내용을 입력해주세요." className={qnaEditStyle.textareaField}
                                    rows={10} // CSS에서 min-height가 있으므로 보조적
                                ></textarea>
                            </div>
                            <div className={qnaEditStyle.imgSection}>
                                <label htmlFor="qnaEditFormImages" className={qnaEditStyle.label}>
                                    이미지 첨부 (현재 {totalCurrentImageCount}개 / 최대 3개)
                                </label>
                                <input
                                    type="file" id="qnaEditFormImages" multiple accept="image/*"
                                    onChange={handleFileChange} style={{ display: 'none' }}
                                    disabled={totalCurrentImageCount >= 3}
                                />
                                <div className={qnaEditStyle.imagePreviewContainer}>
                                    {visibleExistingImages.map((image) => (
                                        <div key={image.id} className={qnaEditStyle.imagePreviewItem}>
                                            <img src={image.url} alt={`기존 이미지 ${image.id}`} className={qnaEditStyle.previewImage} />
                                            <button type="button" className={qnaEditStyle.removeImageButton} onClick={() => handleRemoveExistingImage(image.id)} title="기존 이미지 제거">
                                                <img src={xIcon} alt="제거" className={qnaEditStyle.removeIcon} />
                                            </button>
                                        </div>
                                    ))}
                                    {newPreviewImages.map((previewUrl, index) => (
                                        <div key={previewUrl} className={qnaEditStyle.imagePreviewItem}>
                                            <img src={previewUrl} alt={`새 미리보기 ${index + 1}`} className={qnaEditStyle.previewImage} />
                                            <button type="button" className={qnaEditStyle.removeImageButton} onClick={() => handleRemoveNewImage(index)} title="새 이미지 제거">
                                                <img src={xIcon} alt="제거" className={qnaEditStyle.removeIcon} />
                                            </button>
                                        </div>
                                    ))}
                                    {totalCurrentImageCount < 3 && (
                                        <div className={qnaEditStyle.imagePlaceholder} onClick={() => document.getElementById('qnaEditFormImages').click()} role="button" tabIndex={0} onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('qnaEditFormImages').click(); }}>
                                            + 이미지 추가
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={qnaEditStyle.buttons}>
                                {/* '취소' 버튼을 '이미지 파일 선택' 버튼 앞으로 이동시키고, 기존 버튼 스타일 활용 또는 새 스타일 정의 */}
                                <button type="button" onClick={handleCancel} className={`${qnaEditStyle.triggerButton} ${qnaEditStyle.customCancelButton || ''}`} style={{backgroundColor: '#6c757d', borderColor: '#6c757d', order: 1}}> {/* order로 순서 조정 가능, CSS에서 직접 정의 권장 */}
                                    취소
                                </button>
                                <button type="button" onClick={() => document.getElementById('qnaEditFormImages').click()} className={qnaEditStyle.triggerButton} disabled={totalCurrentImageCount >= 3} style={{order: 2}}>
                                    이미지 파일 선택
                                </button>
                                <button type="submit" className={qnaEditStyle.submitButton} style={{order: 3}}>
                                    수정 완료
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} {...modalProps} />
        </>
    );
}

export default QnaEdit;