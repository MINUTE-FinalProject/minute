import { useState, useEffect } from "react";
// --- 👇 [수정 1] react-router-dom에서 Link를 import 합니다. ---
import { useNavigate, useParams, Link } from "react-router-dom"; 
import apiClient from '../../api/apiClient.js';
import MypageNav from "../../components/MypageNavBar/MypageNav";
import Modal from "../../components/Modal/Modal";
import bookmarkStyle from "../../assets/styles/bookmark.module.css";

const Bookmark = () => {
    const navigate = useNavigate();
    const { folderId: urlFolderId } = useParams();
    const [folders, setFolders] = useState([]);
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [folderIdPendingAction, setFolderIdPendingAction] = useState(null);
    const [selectedFolderVideos, setSelectedFolderVideos] = useState([]);
    const [newFolderName, setNewFolderName] = useState("");
    const [renameFolderName, setRenameFolderName] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [isDeleteVideoModalOpen, setIsDeleteVideoModalOpen] = useState(false);
    const [bookmarkIdPendingDelete, setBookmarkIdPendingDelete] = useState(null);

    // --- useEffect 및 핸들러 함수들은 이전과 동일 (생략) ---
    useEffect(() => {
        apiClient.get("/folder")
            .then((res) => {
                const foldersData = Array.isArray(res.data) ? res.data : res.data.folders || [];
                setFolders(foldersData);
            })
            .catch((err) => {
                console.error("***** 폴더 목록 로딩 중 오류 발생! *****:", err);
            });
    }, []);

    useEffect(() => {
        if (urlFolderId) {
            const id = parseInt(urlFolderId);
            if (isNaN(id)) {
                navigate("/bookmark", { replace: true });
                return;
            }
            setSelectedFolderId(id);
            apiClient.get(`/folder/${id}/videos`)
                .then((res) => {
                    setSelectedFolderVideos(Array.isArray(res.data) ? res.data : []);
                })
                .catch((err) => {
                    console.error(`폴더 ID ${id}의 영상 목록 로딩 실패:`, err);
                    setSelectedFolderVideos([]);
                });
        } else {
            setSelectedFolderId(null);
            setSelectedFolderVideos([]);
        }
    }, [urlFolderId, navigate]);
    
    // (이하 다른 핸들러 함수들은 기존과 동일)
    const handleAddModalSubmit = () => {
        const name = newFolderName.trim().slice(0, 10);
        if (name) {
            apiClient.post("/folder", { folderName: name })
                .then((res) => {
                    setFolders((prev) => [res.data, ...prev]);
                    setNewFolderName("");
                    setIsAddModalOpen(false);
                })
                .catch((err) => console.error("***** 폴더 추가 실패! *****:", err));
        }
    };
    const handleRenameModalSubmit = () => {
        const newName = renameFolderName.trim().slice(0, 10);
        if (newName && folderIdPendingAction !== null) {
            apiClient.put(`/folder/${folderIdPendingAction}`, { folderName: newName })
                .then(() => {
                    setFolders((prev) => prev.map((f) => f.folderId === folderIdPendingAction ? { ...f, folderName: newName } : f));
                    setRenameFolderName("");
                    setIsRenameModalOpen(false);
                    setFolderIdPendingAction(null);
                })
                .catch((err) => {
                    console.error("***** 폴더 이름 변경 실패! *****:", err);
                    setIsRenameModalOpen(false);
                    setFolderIdPendingAction(null);
                });
        }
    };
    const handleDeleteModalSubmit = () => {
        if (folderIdPendingAction === null) return;
        apiClient.delete(`/folder/${folderIdPendingAction}`)
            .then(() => {
                setFolders((prev) => prev.filter((f) => f.folderId !== folderIdPendingAction));
                if (urlFolderId && parseInt(urlFolderId) === folderIdPendingAction) {
                    navigate("/bookmark");
                }
                if (selectedFolderId === folderIdPendingAction) {
                    setSelectedFolderId(null);
                }
                setIsDeleteModalOpen(false);
                setFolderIdPendingAction(null);
            })
            .catch((err) => {
                console.error("***** 폴더 삭제 실패! *****:", err);
                setIsDeleteModalOpen(false);
                setFolderIdPendingAction(null);
            });
    };
    const handleAddFolder = () => setIsAddModalOpen(true);
    const handleAddModalCancel = () => {
        setNewFolderName("");
        setIsAddModalOpen(false);
    };
    const handleOpenOptionsModal = (currentFolderId) => {
        setSelectedFolderId(currentFolderId);
        const folder = folders.find((f) => f.folderId === currentFolderId);
        if (folder) setRenameFolderName(folder.folderName);
        setIsOptionsModalOpen(true);
    };
    const handleOpenRenameModal = () => {
        setIsOptionsModalOpen(false);
        if (selectedFolderId !== null) {
            setFolderIdPendingAction(selectedFolderId);
            setIsRenameModalOpen(true);
        }
    };
    const handleRenameModalCancel = () => {
        setRenameFolderName("");
        setIsRenameModalOpen(false);
        setFolderIdPendingAction(null);
    };
    const handleDeleteFolder = () => {
        setIsOptionsModalOpen(false);
        if (selectedFolderId !== null) {
            setFolderIdPendingAction(selectedFolderId);
            setIsDeleteModalOpen(true);
        }
    };
    const handleDeleteModalCancel = () => {
        setIsDeleteModalOpen(false);
        setFolderIdPendingAction(null);
    };
    const handleFolderClick = (currentFolderId) => {
        if (currentFolderId === null) return;
        setIsLoading(true);
        setTimeout(() => {
            navigate(`/bookmark/${currentFolderId}`);
            setIsLoading(false);
        }, 300);
    };
    const handleOpenDeleteVideoModal = (bookmarkId) => {
        setBookmarkIdPendingDelete(bookmarkId);
        setIsDeleteVideoModalOpen(true);
    };
    const handleDeleteVideoModalCancel = () => {
        setBookmarkIdPendingDelete(null);
        setIsDeleteVideoModalOpen(false);
    };
    const handleDeleteVideoModalSubmit = () => {
        if (!bookmarkIdPendingDelete) return;
        apiClient.delete(`/bookmarks/${bookmarkIdPendingDelete}`)
            .then(() => {
                setSelectedFolderVideos(prev => prev.filter(v => v.bookmarkId !== bookmarkIdPendingDelete));
                handleDeleteVideoModalCancel();
            })
            .catch(err => {
                console.error("북마크 삭제 실패:", err);
                alert("북마크 삭제에 실패했습니다.");
                handleDeleteVideoModalCancel();
            });
    };

    return (
        <>
            <MypageNav />
            <div className={bookmarkStyle.layout}>
                <div className={bookmarkStyle.container}>
                    <div className={bookmarkStyle.container2}>
                        <main className={bookmarkStyle.mainContent}>
                            <header className={bookmarkStyle.header}>
                                <h1>
                                    {urlFolderId && folders.find(f => f.folderId === parseInt(urlFolderId))
                                        ? `MY BOOKMARK - ${folders.find((f) => f.folderId === parseInt(urlFolderId))?.folderName || ""}`
                                        : "MY BOOKMARK"
                                    }
                                </h1>
                                {!urlFolderId && (
                                    <div className={bookmarkStyle.buttons}>
                                        <button className={bookmarkStyle.btn} onClick={handleAddFolder}>폴더 추가</button>
                                    </div>
                                )}
                            </header>
                            <section className={bookmarkStyle.bookmarkGrid}>
                                {isLoading ? (
                                    <div className={bookmarkStyle.loading}>로딩 중...</div>
                                ) : urlFolderId ? (
                                    selectedFolderVideos.length === 0 ? (
                                        <div className={bookmarkStyle.emptyState}>이 폴더에 영상이 없습니다.</div>
                                    ) : (
                                        selectedFolderVideos.map((video, index) => {
                                            const videoId = video.youtubeVideoId || video.videoId || video.youtube_video_id || video.video_id;
                                            const videoTitle = video.title || video.videoTitle || "제목 없음";
                                            const bookmarkId = video.bookmarkId;
                                            const placeholderImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 180'%3E%3Crect width='100%' height='100%' fill='%23cccccc'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16px' fill='%23333333'%3ENo Image%3C/text%3E%3C/svg%3E`;
                                            const thumbnailUrl = video.thumbnailUrl || video.thumbnail_url || (videoId ? `https://www.youtube.com/shorts/동영상ID2{videoId}/0.jpg` : placeholderImage);
                                            
                                            // --- 👇 [수정 2] 외부 URL 변수를 제거하고 Link 컴포넌트로 전체를 감쌉니다. ---
                                            return (
                                                <Link to={videoId ? `/shorts/${videoId}` : '#'} key={bookmarkId || videoId || index} className={bookmarkStyle.bookmarkItem}>
                                                    <div className={bookmarkStyle.bookmarkCard}>
                                                        <div className={bookmarkStyle.placeholderImage}>
                                                            <img 
                                                                src={thumbnailUrl} 
                                                                alt={videoTitle} 
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className={bookmarkStyle.bookmarkFooter}>
                                                        <div className={bookmarkStyle.bookmarkTitle}>{videoTitle}</div>
                                                        <div
                                                            className={bookmarkStyle.bookmarkOptions}
                                                            onClick={(e) => {
                                                                e.preventDefault(); // Link 이동을 막고 옵션 메뉴만 열리도록 함
                                                                e.stopPropagation();
                                                                handleOpenDeleteVideoModal(bookmarkId);
                                                            }}
                                                        >
                                                            ⋯
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    )
                                ) : (
                                    folders.map((f) => (
                                        <div key={f.folderId} className={bookmarkStyle.bookmarkItem} onClick={() => handleFolderClick(f.folderId)}>
                                            <div className={bookmarkStyle.bookmarkCard}>
                                                <div className={bookmarkStyle.placeholderImage}></div>
                                            </div>
                                            <div className={bookmarkStyle.bookmarkFooter}>
                                                <div className={bookmarkStyle.bookmarkTitle}>{f.folderName}</div>
                                                <div
                                                    className={bookmarkStyle.bookmarkOptions}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenOptionsModal(f.folderId);
                                                    }}
                                                >
                                                    ⋯
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </section>
                            
                            {/* --- Modal 컴포넌트들은 기존과 동일 --- */}
                            <Modal isOpen={isAddModalOpen} onClose={handleAddModalCancel} title="폴더 추가" onConfirm={handleAddModalSubmit} confirmText="확인" cancelText="취소">
                                <input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} maxLength={10} placeholder="폴더 이름을 입력하세요 (최대 10자)" className={bookmarkStyle.modalInput}/>
                            </Modal>
                            <Modal isOpen={isOptionsModalOpen} onClose={() => setIsOptionsModalOpen(false)} title="폴더 옵션" confirmText="이름 변경" cancelText="삭제" onConfirm={handleOpenRenameModal} onCancel={handleDeleteFolder}>
                                <p>폴더에 대한 작업을 선택하세요.</p>
                            </Modal>
                            <Modal isOpen={isRenameModalOpen} onClose={handleRenameModalCancel} title="폴더 이름 변경" onConfirm={handleRenameModalSubmit} confirmText="변경" cancelText="취소">
                                <input type="text" value={renameFolderName} onChange={(e) => setRenameFolderName(e.target.value)} maxLength={10} placeholder="새 폴더 이름을 입력하세요 (최대 10자)" className={bookmarkStyle.modalInput}/>
                            </Modal>
                            <Modal isOpen={isDeleteModalOpen} onClose={handleDeleteModalCancel} title="폴더 삭제" onConfirm={handleDeleteModalSubmit} confirmText="삭제" cancelText="취소">
                                <p>
                                    {folderIdPendingAction && folders.find(f => f.folderId === folderIdPendingAction) ? `'${folders.find(f => f.folderId === folderIdPendingAction).folderName}' 폴더를 삭제하시겠습니까?` : "선택한 폴더를 삭제하시겠습니까?"}
                                    <br />(폴더 내 북마크도 모두 삭제됩니다.)
                                </p>
                            </Modal>
                            <Modal isOpen={isDeleteVideoModalOpen} onClose={handleDeleteVideoModalCancel} title="북마크 삭제" onConfirm={handleDeleteVideoModalSubmit} confirmText="삭제" cancelText="취소">
                                <p>이 북마크를 폴더에서 삭제하시겠습니까?</p>
                            </Modal>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Bookmark;