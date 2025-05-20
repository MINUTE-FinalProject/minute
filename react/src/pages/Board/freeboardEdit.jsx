// src/pages/Board/FreeboardEdit.jsx (또는 해당 파일의 실제 경로)
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import banner from "../../assets/images/banner.png";
import Modal from '../../components/Modal/Modal';
import freeboardEditStyle from './freeboardEdit.module.css';

function FreeboardEdit() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const freeboardPath = '/freeboard';
    const freeboardDetailPath = postId ? `/freeboardDetail/${postId}` : freeboardPath;

    // console.log("FreeboardEdit loaded with postId:", postId); 

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [originalData, setOriginalData] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 

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

    useEffect(() => {
        // console.log("useEffect triggered, postId:", postId);
        
        // !!!!! 디자인 확인을 위해 "잘못된 접근" 모달을 항상 띄우도록 임시 수정 !!!!!
        setIsLoading(false); // 로딩 상태 해제
        setModalProps({
            title: "잘못된 접근 (디자인 테스트)", // 테스트 중임을 명시
            message: "수정할 게시물 ID가 없습니다. 목록으로 돌아갑니다. (이 메시지는 디자인 테스트용입니다)",
            confirmText: "확인 (검정 버튼 테스트)",
            type: "error", // 에러 타입 모달
            confirmButtonType: 'blackButton', // 요청하신 검정색 버튼 타입
            onConfirm: () => {
                setIsModalOpen(false); // 모달 닫기 (테스트 중에는 페이지 이동 안 함)
                console.log("디자인 테스트용 모달의 '확인' 버튼 클릭됨");
            }
        });
        setIsModalOpen(true); 
        // !!!!! 임시 수정 끝 - 디자인 확인 후 이 블록을 삭제하고 아래 주석 처리된 원래 로직을 복원하세요 !!!!!

        // --- 원래 useEffect 로직 시작 (현재 주석 처리) ---
        /*
        setIsLoading(true);
        const fetchPostData = async (id) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (id === "1") {
                        resolve({ title: "기존 게시물 제목 예시 1", content: "기존 게시물 내용입니다. ID: 1" });
                    } else if (id === "error_fetch") {
                        reject(new Error("서버 통신 오류 발생 (테스트)"));
                    } else if (id && id !== "undefined" && id !== "null") {
                         resolve({ title: `"${id}"번 게시글 제목`, content: `"${id}"번 게시글의 기존 내용입니다. 수정해주세요.` });
                    }
                    else {
                        reject(new Error("유효하지 않은 게시물 ID 입니다."));
                    }
                }, 500);
            });
        };

        if (postId && postId !== "undefined" && postId !== "null") {
            fetchPostData(postId).then(data => {
                setTitle(data.title);
                setContent(data.content);
                setOriginalData(data);
                setIsLoading(false);
            }).catch(error => {
                console.error("게시물 데이터를 불러오는 데 실패했습니다.", error);
                setIsLoading(false);
                setModalProps({
                    title: "데이터 로딩 실패",
                    message: `게시물 정보를 불러오는 데 실패했습니다: ${error.message}\n목록으로 돌아갑니다.`,
                    confirmText: "확인",
                    type: "error",
                    confirmButtonType: 'blackButton',
                    onConfirm: () => navigate(freeboardPath)
                });
                setIsModalOpen(true);
            });
        } else {
            setIsLoading(false);
            setModalProps({
                title: "잘못된 접근",
                message: "수정할 게시물 ID가 없습니다. 목록으로 돌아갑니다.",
                confirmText: "확인",
                type: "error",
                confirmButtonType: 'blackButton',
                onConfirm: () => navigate(freeboardPath)
            });
            setIsModalOpen(true); 
        }
        */
        // --- 원래 useEffect 로직 끝 ---

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 페이지 로드 시 한 번만 실행되도록 의존성 배열을 비워둠 (테스트 목적)
            // 원래 의존성: [postId, navigate, freeboardPath]


    const handleEditSubmit = (event) => {
        // ... (기존 handleSubmit 로직은 그대로 둡니다) ...
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
        console.log('수정된 제목:', title);
        console.log('수정된 내용:', content);
        console.log('게시물 ID:', postId);
        setModalProps({
            title: '수정 완료',
            message: '게시글이 성공적으로 수정되었습니다.',
            confirmText: '확인',
            type: 'success',
            confirmButtonType: 'primary',
            onConfirm: () => navigate(freeboardDetailPath)
        });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        // ... (기존 handleCancel 로직은 그대로 둡니다) ...
        const hasChanges = originalData && (title !== originalData.title || content !== originalData.content);
        const navigateTo = postId ? freeboardDetailPath : freeboardPath;

        if (hasChanges) {
            setModalProps({
                title: '수정 취소',
                message: '변경사항이 저장되지 않았습니다.\n정말로 수정을 취소하시겠습니까?',
                confirmText: '예, 취소합니다',
                cancelText: '계속 수정',
                onConfirm: () => navigate(navigateTo),
                type: 'warning',
                confirmButtonType: 'danger',
                cancelButtonType: 'secondary'
            });
            setIsModalOpen(true);
        } else {
            navigate(navigateTo);
        }
    };
    
    // 로딩 중이거나, 임시 모달이 떠 있는 동안에는 아래 폼이 보이지 않도록 할 수 있습니다.
    // 현재는 isLoading이 false로 바로 설정되므로 폼이 배경에 깔리게 됩니다.
    // 모달이 떠 있을 때 폼을 완전히 가리거나, 아래 JSX 렌더링을 조건부로 할 수 있습니다.
    // if (isLoading) return <p>Loading...</p>; // 간단한 로딩 처리
    // if (isModalOpen && modalProps.title === "잘못된 접근 (디자인 테스트)") return <Modal ... />; // 모달만 렌더링

    return (
        <>
            <div className={freeboardEditStyle.background}>
                <div className={freeboardEditStyle.title}>
                    <Link to={freeboardPath} className={freeboardEditStyle.titleLink}>
                        <h1>자유게시판</h1>
                    </Link>
                </div>

                {/* 데이터가 로드되지 않았거나 (originalData가 null), 로딩 중일 때는 폼을 숨길 수 있습니다. 
                    현재는 임시로 모달을 띄우는 로직 때문에 이부분이 모달과 함께 보일 수 있습니다. */}
                {(!isLoading && originalData) || !postId /* postId가 없을 때도 폼은 일단 보이지 않도록 */ ? (
                    <form onSubmit={handleEditSubmit} className={freeboardEditStyle.contentArea}>
                        <div className={freeboardEditStyle.img}>
                            <img src={banner} alt="자유게시판배너" />
                        </div> 

                        <div className={freeboardEditStyle.content}>
                            <label htmlFor="postEditTitle" className={freeboardEditStyle.label}>제목</label> 
                            <input 
                                type="text"
                                id="postEditTitle"
                                className={freeboardEditStyle.info} 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="제목을 입력하세요"
                            />

                            <label htmlFor="postEditContent" className={`${freeboardEditStyle.label} ${freeboardEditStyle.contentLabel}`}>내용</label>
                            <textarea 
                                id="postEditContent"
                                className={freeboardEditStyle.textbox}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="내용을 입력하세요"
                                rows="10"
                            ></textarea>

                            <div className={freeboardEditStyle.edit}>
                                <button 
                                    type="button"
                                    onClick={handleCancel}
                                    className={`${freeboardEditStyle.submitButton} ${freeboardEditStyle.cancelButton || ''}`}
                                    style={{ marginRight: '10px', backgroundColor: '#6c757d', borderColor: '#6c757d' }}
                                >
                                    취소
                                </button>
                                <button 
                                    type="submit"
                                    className={freeboardEditStyle.submitButton}
                                >
                                    수정 완료
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    // 로딩 중이거나, postId가 없어 모달이 뜰 때 보여줄 내용 (선택적)
                    // 현재는 useEffect에서 모달을 바로 띄우므로 이 부분이 크게 의미 없을 수 있음
                    <div className={freeboardEditStyle.contentArea} style={{textAlign: 'center', padding: '50px'}}>
                        {isLoading ? "게시물 정보를 불러오는 중입니다..." : ""}
                    </div>
                )}
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    // 만약 "잘못된 접근" 모달의 확인 버튼에서 페이지 이동을 막았다면,
                    // 여기서 사용자가 X로 닫을 때 강제로 이동시킬 수 있습니다.
                    // if (modalProps.title === "잘못된 접근 (디자인 테스트)") {
                    //     navigate(freeboardPath);
                    // }
                }}
                {...modalProps}
            />
        </>
    );
}

export default FreeboardEdit;