// src/pages/QnA/QnaWrite.jsx (또는 해당 파일의 실제 경로)
import { useEffect, useState } from 'react'; // React import 추가
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 추가
import xIcon from '../../assets/images/x.png';
import qnaWriteStyle from '../../assets/styles/qnaWrite.module.css';
import Modal from '../../components/Modal/Modal'; // Modal 컴포넌트 import
import MypageNav from '../../components/MypageNavBar/MypageNav';

function QnaWrite() {
    const navigate = useNavigate(); // 페이지 이동을 위해
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    // 모달 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalProps, setModalProps] = useState({
        title: '',
        message: '',
        onConfirm: null,
        confirmText: '확인',
        cancelText: null,
        type: 'default',
        confirmButtonType: 'primary',
        cancelButtonType: 'secondary'
    });

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const totalAllowedNew = 3 - (selectedFiles.length + files.length);

        if (files.length > 0 && (selectedFiles.length + files.length > 3)) {
            setModalProps({
                title: '첨부파일 개수 초과',
                message: `이미지는 최대 3개까지 첨부할 수 있습니다. (현재 ${selectedFiles.length}개 선택됨, ${files.length}개 시도)`,
                confirmText: '확인',
                type: 'warning',
                confirmButtonType: 'primary'
            });
            setIsModalOpen(true);
            event.target.value = null; // 파일 입력 초기화
            return;
        }
        
        const filesToAdd = files.slice(0, 3 - selectedFiles.length); // 실제 추가될 파일만

        if (filesToAdd.length > 0) {
            setSelectedFiles(prevFiles => [...prevFiles, ...filesToAdd]);
            const newPreviewUrls = filesToAdd.map(file => URL.createObjectURL(file));
            setPreviewImages(prevPreviews => [...prevPreviews, ...newPreviewUrls]);
        }
        event.target.value = null;
    };

    const handleRemoveImage = (indexToRemove) => {
        URL.revokeObjectURL(previewImages[indexToRemove]);
        setSelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
        setPreviewImages(prevPreviews => prevPreviews.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!title.trim()) {
            setModalProps({ title: '입력 오류', message: '제목을 입력해주세요.', confirmText: '확인', type: 'warning', confirmButtonType: 'primary' });
            setIsModalOpen(true);
            return;
        }
        if (!content.trim()) {
            setModalProps({ title: '입력 오류', message: '내용을 입력해주세요.', confirmText: '확인', type: 'warning', confirmButtonType: 'primary' });
            setIsModalOpen(true);
            return;
        }

        console.log("문의 등록 데이터:", { title, content, files: selectedFiles.map(f => f.name) });
        // TODO: 실제 서버로 데이터 전송 로직 (API 호출)

        setModalProps({
            title: '등록 완료',
            message: '문의가 성공적으로 등록되었습니다.',
            confirmText: '확인',
            type: 'success',
            confirmButtonType: 'primary',
            onConfirm: () => {
                // 성공 후 상태 초기화 및 페이지 이동
                setTitle('');
                setContent('');
                previewImages.forEach(url => URL.revokeObjectURL(url));
                setSelectedFiles([]);
                setPreviewImages([]);
                navigate('/qna'); // Q&A 목록 페이지로 이동 (경로 확인 필요)
            }
        });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        if (title.trim() || content.trim() || selectedFiles.length > 0) {
            setModalProps({
                title: '작성 취소',
                message: '작성을 취소하시겠습니까?\n입력하신 내용은 저장되지 않습니다.',
                confirmText: '예, 취소합니다',
                cancelText: '계속 작성',
                onConfirm: () => {
                    previewImages.forEach(url => URL.revokeObjectURL(url)); // URL 해제
                    navigate('/qna'); // Q&A 목록 페이지로 이동
                },
                type: 'warning',
                confirmButtonType: 'danger',
                cancelButtonType: 'secondary'
            });
            setIsModalOpen(true);
        } else {
            navigate('/qna'); // 내용 없으면 바로 목록으로 이동
        }
    };

    useEffect(() => {
        return () => {
            previewImages.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewImages]);

    return (
        <>
            <MypageNav />
            <div className={qnaWriteStyle.layout}>
                <div className={qnaWriteStyle.container}>
                    <div className={qnaWriteStyle.background}>
                        <div className={qnaWriteStyle.title}>
                            <Link to="/qna" className={qnaWriteStyle.pageTitleLink}>
                                <h1>Q&A</h1>
                            </Link>
                        </div>

                        <form onSubmit={handleSubmit} className={qnaWriteStyle.contentArea}> {/* form 태그 위치 변경 */}
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
                                    rows="10" // qnaWrite.module.css 에서 min-height 설정 있으므로 rows는 보조적
                                ></textarea>
                            </div>

                            <div className={qnaWriteStyle.imgSection}>
                                <label htmlFor="qnaFormImages" className={qnaWriteStyle.label}>
                                    이미지 첨부 (현재 {selectedFiles.length}개 / 최대 3개)
                                </label>
                                <input
                                    type="file"
                                    id="qnaFormImages"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    disabled={selectedFiles.length >= 3}
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
                                    {selectedFiles.length < 3 && (
                                        <div
                                            className={qnaWriteStyle.imagePlaceholder}
                                            onClick={() => document.getElementById('qnaFormImages').click()}
                                            role="button"
                                            tabIndex={0}
                                            onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('qnaFormImages').click(); }}
                                        >
                                            + 이미지 추가 ({selectedFiles.length}/3)
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={qnaWriteStyle.buttons}>
                                <button type="button" onClick={handleCancel} className={`${qnaWriteStyle.actionButton} ${qnaWriteStyle.cancelButton}`}> {/* actionButton 클래스 추가 */}
                                    취소
                                </button>
                                <button type="submit" className={`${qnaWriteStyle.actionButton} ${qnaWriteStyle.submitButton}`}>
                                    작성
                                </button>
                            </div>
                        </form>
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

export default QnaWrite;