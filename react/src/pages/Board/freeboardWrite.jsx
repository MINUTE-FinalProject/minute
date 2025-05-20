// src/pages/Board/FreeboardWrite.jsx (또는 해당 파일의 실제 경로)
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import banner from "../../assets/images/banner.png";
import freeboardWriteStyle from "../../assets/styles/freeboardWrite.module.css";
import Modal from '../../components/Modal/Modal'; // Modal 컴포넌트 경로 확인

function FreeboardWrite() {
    const freeboardPath = "/freeboard";
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

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

    const handleSubmit = (event) => {
        event.preventDefault(); 
        if (!title.trim()) {
            setModalProps({
                title: '입력 오류',
                message: '제목을 입력해주세요.',
                confirmText: '확인',
                type: 'warning',
                confirmButtonType: 'primary'
            });
            setIsModalOpen(true);
            return;
        }
        if (!content.trim()) {
            setModalProps({
                title: '입력 오류',
                message: '내용을 입력해주세요.',
                confirmText: '확인',
                type: 'warning',
                confirmButtonType: 'primary'
            });
            setIsModalOpen(true);
            return;
        }

        console.log("게시글 작성 데이터:", { title, content });
        // TODO: 실제 서버로 데이터 전송 로직 (API 호출)

        setModalProps({
            title: '등록 완료',
            message: '게시글이 성공적으로 등록되었습니다.',
            confirmText: '확인',
            type: 'success',
            confirmButtonType: 'primary',
            onConfirm: () => {
                navigate(freeboardPath); 
            }
        });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        if (title.trim() || content.trim()) {
            setModalProps({
                title: '작성 취소',
                message: '작성을 취소하시겠습니까?\n입력하신 내용은 저장되지 않습니다.',
                confirmText: '예, 취소합니다',
                cancelText: '계속 작성',
                onConfirm: () => navigate(freeboardPath),
                type: 'warning',
                confirmButtonType: 'danger',
                cancelButtonType: 'secondary'
            });
            setIsModalOpen(true);
        } else {
            navigate(freeboardPath); 
        }
    };

    return (
        <>
            <div className={freeboardWriteStyle.background}>
                <div className={freeboardWriteStyle.title}>
                    <Link to={freeboardPath} className={freeboardWriteStyle.titleLink}>
                        <h1>자유게시판</h1>
                    </Link>
                </div>

                {/* form으로 변경하고 onSubmit 연결 */}
                <form onSubmit={handleSubmit} className={freeboardWriteStyle.contentArea}> 
                    <div className={freeboardWriteStyle.img}>
                        <img src={banner} alt="자유게시판배너" />
                    </div>

                    <div className={freeboardWriteStyle.content}>
                        <label htmlFor="postTitle" className={freeboardWriteStyle.label}>
                            제목
                        </label>
                        <input
                            type="text"
                            id="postTitle"
                            className={freeboardWriteStyle.info}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="제목을 입력하세요"
                        />

                        <label
                            htmlFor="postContent"
                            className={`${freeboardWriteStyle.label} ${freeboardWriteStyle.contentLabel}`}
                        >
                            내용
                        </label>
                        <textarea
                            id="postContent"
                            className={freeboardWriteStyle.textbox}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="내용을 입력하세요"
                            rows="10"
                        ></textarea>

                        {/* 버튼 컨테이너: 기존 .wirte 클래스명을 사용하시거나, 필요에 따라 변경하세요. */}
                        {/* 예시로 .buttonsContainer 라는 클래스명을 사용했습니다. 기존 .wirte를 그대로 사용하셔도 됩니다. */}
                        <div className={freeboardWriteStyle.wirte}> {/* 또는 freeboardWriteStyle.buttonsContainer 등 */}
                            <button
                                type="button" 
                                onClick={handleCancel}
                                // freeboardWriteStyle.cancelButton 등의 클래스를 CSS 파일에 직접 정의하여 사용하세요.
                                className={`${freeboardWriteStyle.submitButton} ${freeboardWriteStyle.cancelButton || ''}`} 
                                style={{ marginRight: '10px' }} // 임시 인라인 스타일, CSS에서 조정 권장
                            >
                                취소
                            </button>
                            <button
                                type="submit" 
                                className={freeboardWriteStyle.submitButton} 
                            >
                                작성
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                {...modalProps}
            />
        </>
    );
}

export default FreeboardWrite;