import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from '../../api/apiClient.js'; // 경로가 올바른지 확인해주세요.
import MypageNav from "../../components/MypageNavBar/MypageNav"; // 경로가 올바른지 확인해주세요.
import Modal from "../../components/Modal/Modal"; // 경로가 올바른지 확인해주세요.
import bookmarkStyle from "../../assets/styles/bookmark.module.css";

const Bookmark = () => {
  const navigate = useNavigate();
  const { folderId: urlFolderId } = useParams();
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null); // UI 상에서 현재 선택/표시된 폴더 ID
  const [folderIdPendingAction, setFolderIdPendingAction] = useState(null); // 이름 변경/삭제 액션 대상 ID
  const [selectedFolderVideos, setSelectedFolderVideos] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [renameFolderName, setRenameFolderName] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    apiClient
      .get("/folder")
      .then((res) => {
        const foldersData = Array.isArray(res.data)
          ? res.data
          : res.data.folders || [];
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
        console.error("URL에서 가져온 folderId가 유효한 숫자가 아닙니다:", urlFolderId);
        navigate("/bookmark", { replace: true });
        return;
      }
      setSelectedFolderId(id); // 현재 보고 있는 폴더 ID 설정
      apiClient
        .get(`/folder/${id}/videos`)
        .then((res) => {
          setSelectedFolderVideos(Array.isArray(res.data) ? res.data : []);
        })
        .catch((err) => {
          console.error(`폴더 ID ${id}의 영상 목록 로딩 실패:`, err);
          setSelectedFolderVideos([]);
        });
    } else {
      setSelectedFolderId(null); // URL에 폴더 ID가 없으면 선택된 폴더 ID도 초기화
      setSelectedFolderVideos([]);
    }
  }, [urlFolderId, navigate]);

  const handleAddModalSubmit = () => {
    const name = newFolderName.trim().slice(0, 10);
    if (name) {
      apiClient
        .post("/folder", { folderName: name })
        .then((res) => {
          setFolders((prev) => [res.data, ...prev]);
          setNewFolderName("");
          setIsAddModalOpen(false);
        })
        .catch((err) => {
          console.error("***** 폴더 추가 실패! *****:", err);
        });
    }
  };

  const handleRenameModalSubmit = () => {
    const newName = renameFolderName.trim().slice(0, 10);
    if (newName && folderIdPendingAction !== null) {
      apiClient
        .put(`/folder/${folderIdPendingAction}`, { folderName: newName })
        .then(() => {
          setFolders((prev) =>
            prev.map((f) =>
              f.folderId === folderIdPendingAction ? { ...f, folderName: newName } : f
            )
          );
          // 만약 현재 URL의 폴더가 이름 변경된 폴더와 같다면, selectedFolderId에 해당하는 폴더 이름도 업데이트 (UI표시용)
          if (selectedFolderId === folderIdPendingAction) {
            // folders 상태가 이미 업데이트 되었으므로, 헤더 등은 자동으로 반영될 것임.
          }
          setRenameFolderName("");
          setIsRenameModalOpen(false);
          setFolderIdPendingAction(null); // 작업 완료 후 정리
        })
        .catch((err) => {
          console.error("***** 폴더 이름 변경 실패! *****:", err);
          setIsRenameModalOpen(false);
          setFolderIdPendingAction(null);
        });
    } else if (!newName) {
        console.warn("새 폴더 이름이 비어있습니다.");
    } else {
        console.error("이름 변경할 폴더 ID가 유효하지 않습니다 (pending action).", folderIdPendingAction);
        setIsRenameModalOpen(false);
        setFolderIdPendingAction(null);
    }
  };

  const handleDeleteModalSubmit = () => {
    if (folderIdPendingAction === null || typeof folderIdPendingAction === 'undefined') {
      console.error("삭제할 폴더 ID가 유효하지 않습니다 (pending action).", folderIdPendingAction);
      setIsDeleteModalOpen(false);
      setFolderIdPendingAction(null);
      return;
    }
    const idToDelete = folderIdPendingAction;
    apiClient
      .delete(`/folder/${idToDelete}`)
      .then(() => {
        setFolders((prev) => prev.filter((f) => f.folderId !== idToDelete));
        if (urlFolderId && parseInt(urlFolderId) === idToDelete) {
          navigate("/bookmark"); // 현재 보고 있는 폴더가 삭제되면 기본 북마크 페이지로 이동
        }
        // 만약 삭제된 폴더가 UI상 현재 선택된 폴더(selectedFolderId)였다면 초기화
        if (selectedFolderId === idToDelete) {
            setSelectedFolderId(null);
        }
        setIsDeleteModalOpen(false);
        setFolderIdPendingAction(null); // 작업 완료 후 정리
      })
      .catch((err) => {
        console.error("***** 폴더 삭제 실패! *****:", err);
        setIsDeleteModalOpen(false);
        setFolderIdPendingAction(null);
      });
  };

  const handleAddFolder = () => {
    console.warn("handleAddFolder: 폴더 추가 모달 열기 시도");
    setIsAddModalOpen(true);
  };

  const handleAddModalCancel = () => {
    setNewFolderName("");
    setIsAddModalOpen(false);
  };

  const handleOpenOptionsModal = (currentFolderId) => {
    console.warn(`handleOpenOptionsModal: 옵션 모달 열기 시도. 폴더 ID: ${currentFolderId}`);
    setSelectedFolderId(currentFolderId); // 옵션이 열린 폴더를 UI상 선택된 폴더로 설정
    const folder = folders.find((f) => f.folderId === currentFolderId);
    if (folder) {
      setRenameFolderName(folder.folderName); // 이름 변경 입력 필드 초기값 설정
    }
    setIsOptionsModalOpen(true);
  };

  const handleOpenRenameModal = () => {
    const currentId = selectedFolderId; // 옵션 모달이 닫히면서 selectedFolderId가 null이 되기 전 값 사용
    console.warn(`handleOpenRenameModal: 이름 변경 모달 열기 시도. 현재 선택된 폴더 ID: ${currentId}`);
    
    setIsOptionsModalOpen(false); // 옵션 모달 닫기 (이때 selectedFolderId가 null로 바뀔 수 있음 - options modal의 onClose 로직에 따라)

    if (currentId !== null) {
        setFolderIdPendingAction(currentId); // 실제 이름 변경할 ID를 pendingAction에 저장
        // setRenameFolderName은 handleOpenOptionsModal에서 이미 설정됨
        setIsRenameModalOpen(true);
    } else {
        console.error("이름 변경을 위한 폴더 ID가 없습니다.");
    }
  };

  const handleRenameModalCancel = () => {
    setRenameFolderName("");
    setIsRenameModalOpen(false);
    setFolderIdPendingAction(null); // 취소 시 pending ID 정리
  };

  const handleDeleteFolder = () => {
    const currentId = selectedFolderId; // 옵션 모달이 닫히면서 selectedFolderId가 null이 되기 전 값 사용
    console.warn("handleDeleteFolder: 삭제 모달 열기 시도. 현재 옵션 폴더 ID:", currentId);

    setIsOptionsModalOpen(false); // 옵션 모달 닫기

    if (currentId !== null) {
      setFolderIdPendingAction(currentId); // 실제 삭제할 ID를 pendingAction에 저장
      setIsDeleteModalOpen(true);
    } else {
      console.warn("삭제할 폴더가 선택되지 않았습니다 (옵션 메뉴 통해 선택되지 않음).");
    }
  };

  const handleDeleteModalCancel = () => {
    setIsDeleteModalOpen(false);
    setFolderIdPendingAction(null); // 취소 시 pending ID 정리
  };

  const handleFolderClick = (currentFolderId) => {
    console.warn(`handleFolderClick: 폴더 클릭됨. 폴더 ID: ${currentFolderId}`);
    if (typeof currentFolderId === 'undefined' || currentFolderId === null) {
      console.error("handleFolderClick: 클릭된 폴더의 ID가 유효하지 않습니다.", currentFolderId);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      navigate(`/bookmark/${currentFolderId}`);
      setIsLoading(false);
    }, 300);
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
                    ? `MY BOOKMARK - ${
                        folders.find((f) => f.folderId === parseInt(urlFolderId))?.folderName || ""
                      }`
                    : "MY BOOKMARK"
                  }
                </h1>
                {!urlFolderId && (
                  <div className={bookmarkStyle.buttons}>
                    <button
                      className={bookmarkStyle.btn}
                      onClick={handleAddFolder}
                    >
                      폴더 추가
                    </button>
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
                    selectedFolderVideos.map((video) => {
                      const videoKey = video.id || video.videoId || video.url || (typeof video === 'string' ? video : JSON.stringify(video) + Math.random());
                      const videoUrl = video.url || (typeof video === 'string' ? video : '');
                      const videoTitle = video.title || (typeof videoUrl === 'string' ? videoUrl.split('/').pop() : "비디오");
                      return (
                        <div key={videoKey} className={bookmarkStyle.bookmarkItem}>
                          <div className={bookmarkStyle.bookmarkCard}>
                            <div className={bookmarkStyle.placeholderImage}>
                              {video.thumbnailUrl ? (
                                <img src={video.thumbnailUrl} alt={videoTitle} style={{ width: '100%', height: 'auto', objectFit: 'cover' }}/>
                              ) : videoUrl.includes("youtube.com/watch?v=") || videoUrl.includes("youtu.be/") ? (
                                <iframe
                                  width="100%"
                                  src={`https://www.youtube.com/embed/${videoUrl.includes("youtu.be/") ? videoUrl.split('/').pop().split('?')[0] : videoUrl.split('v=')[1].split('&')[0]}`}
                                  title={videoTitle}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                  style={{ aspectRatio: '16/9' }}
                                ></iframe>
                              ) : ( // 일반 비디오 URL 또는 기타 임베드 (YouTube 외)
                                <video controls width="100%" height="auto" preload="metadata" style={{ aspectRatio: '16/9' }}>
                                  <source src={videoUrl} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              )}
                            </div>
                          </div>
                          <div className={bookmarkStyle.bookmarkFooter}>
                            <div className={bookmarkStyle.bookmarkTitle}>{videoTitle}</div>
                          </div>
                        </div>
                      );
                    })
                  )
                ) : (
                  folders.length === 0 ? (
                    <div className={bookmarkStyle.emptyState}>폴더가 없습니다.</div>
                  ) : (
                    folders.map((f) => (
                      <div
                        key={f.folderId}
                        className={bookmarkStyle.bookmarkItem}
                        onClick={() => {
                          console.warn("폴더 아이템 Div 클릭됨 - handleFolderClick 호출 전");
                          handleFolderClick(f.folderId);
                        }}
                      >
                        <div className={bookmarkStyle.bookmarkCard}>
                          <div className={bookmarkStyle.placeholderImage}></div>
                        </div>
                        <div className={bookmarkStyle.bookmarkFooter}>
                          <div className={bookmarkStyle.bookmarkTitle}>{f.folderName}</div>
                          <div
                            className={bookmarkStyle.bookmarkOptions}
                            onClick={(e) => {
                              console.warn("옵션(⋯) 버튼 클릭됨 - 이벤트 전파 중지 시도");
                              e.stopPropagation();
                              handleOpenOptionsModal(f.folderId);
                            }}
                          >
                            ⋯
                          </div>
                        </div>
                      </div>
                    ))
                  )
                )}
              </section>

              {/* Modals */}
              <Modal isOpen={isAddModalOpen} onClose={handleAddModalCancel} title="폴더 추가" onConfirm={handleAddModalSubmit} confirmText="확인" cancelText="취소">
                <input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} maxLength={10} placeholder="폴더 이름을 입력하세요 (최대 10자)" className={bookmarkStyle.modalInput}/>
              </Modal>
              
              <Modal 
                isOpen={isOptionsModalOpen} 
                onClose={() => { 
                  setIsOptionsModalOpen(false); 
                  setSelectedFolderId(null); // 옵션 모달을 그냥 닫으면 UI상 선택된 폴더 ID 초기화
                }} 
                title="폴더 옵션" 
                confirmText="이름 변경" 
                cancelText="삭제" 
                onConfirm={handleOpenRenameModal} 
                onCancel={handleDeleteFolder}
              >
                <p>폴더에 대한 작업을 선택하세요.</p>
              </Modal>

              <Modal isOpen={isRenameModalOpen} onClose={handleRenameModalCancel} title="폴더 이름 변경" onConfirm={handleRenameModalSubmit} confirmText="변경" cancelText="취소">
                <input type="text" value={renameFolderName} onChange={(e) => setRenameFolderName(e.target.value)} maxLength={10} placeholder="새 폴더 이름을 입력하세요 (최대 10자)" className={bookmarkStyle.modalInput}/>
              </Modal>

              <Modal isOpen={isDeleteModalOpen} onClose={handleDeleteModalCancel} title="폴더 삭제" onConfirm={handleDeleteModalSubmit} confirmText="삭제" cancelText="취소">
                <p>
                  {folderIdPendingAction && folders.find(f => f.folderId === folderIdPendingAction)
                    ? `'${folders.find(f => f.folderId === folderIdPendingAction).folderName}' 폴더를 삭제하시겠습니까?`
                    : "선택한 폴더를 삭제하시겠습니까?"}
                  <br />(폴더 내 북마크도 모두 삭제됩니다.)
                </p>
              </Modal>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Bookmark;