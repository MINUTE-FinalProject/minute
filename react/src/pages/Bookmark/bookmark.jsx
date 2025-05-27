import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from '../../api/apiClient.js';
import MypageNav from "../../components/MypageNavBar/MypageNav";
import Modal from "../../components/Modal/Modal";
import bookmarkStyle from "../../assets/styles/bookmark.module.css";

const Bookmark = () => {
  const navigate = useNavigate();
  const { folderId: urlFolderId } = useParams();
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
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
        navigate("/bookmark", { replace: true }); // 혹은 오류 페이지로 이동
        return;
      }
      setSelectedFolderId(id);
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
      setSelectedFolderVideos([]); // folderId가 없으면 비디오 목록 초기화
    }
  }, [urlFolderId, navigate]); // navigate를 의존성 배열에 추가

  const handleAddModalSubmit = () => {
    const name = newFolderName.trim().slice(0, 10);
    if (name) {
      apiClient
        .post("/folder", { folderName: name })
        .then((res) => {
          setFolders((prev) => [res.data, ...prev]); // 새 폴더를 맨 앞에 추가
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
    if (newName && selectedFolderId !== null) {
      apiClient
        .put(`/folder/${selectedFolderId}`, { folderName: newName })
        .then(() => {
          setFolders((prev) =>
            prev.map((f) =>
              f.folderId === selectedFolderId ? { ...f, folderName: newName } : f
            )
          );
          setRenameFolderName("");
          setIsRenameModalOpen(false);
        })
        .catch((err) => {
          console.error("***** 폴더 이름 변경 실패! *****:", err);
        });
    }
  };

  const handleDeleteModalSubmit = () => {
    if (selectedFolderId === null || typeof selectedFolderId === 'undefined') {
      console.error("삭제할 폴더 ID가 유효하지 않습니다.");
      setIsDeleteModalOpen(false);
      return;
    }
    const idToDelete = selectedFolderId;
    apiClient
      .delete(`/folder/${idToDelete}`)
      .then(() => {
        setFolders((prev) => prev.filter((f) => f.folderId !== idToDelete));
        if (urlFolderId && parseInt(urlFolderId) === idToDelete) {
          navigate("/bookmark"); // 현재 보고 있는 폴더가 삭제되면 기본 북마크 페이지로 이동
        }
        setIsDeleteModalOpen(false);
        setSelectedFolderId(null); // 선택된 폴더 ID 초기화
      })
      .catch((err) => {
        console.error("***** 폴더 삭제 실패! *****:", err);
        setIsDeleteModalOpen(false);
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
    setSelectedFolderId(currentFolderId);
    const folder = folders.find((f) => f.folderId === currentFolderId);
    if (folder) {
      setRenameFolderName(folder.folderName);
    }
    setIsOptionsModalOpen(true);
  };

  const handleOpenRenameModal = () => {
    console.warn(`handleOpenRenameModal: 이름 변경 모달 열기 시도. 현재 선택된 폴더 ID: ${selectedFolderId}`);
    setIsOptionsModalOpen(false);
    setIsRenameModalOpen(true);
  };

  const handleRenameModalCancel = () => {
    setRenameFolderName("");
    setIsRenameModalOpen(false);
  };

  const handleDeleteFolder = () => {
    console.warn("handleDeleteFolder: 삭제 모달 열기 시도. 현재 옵션 폴더 ID:", selectedFolderId);
    if (selectedFolderId !== null) {
      setIsDeleteModalOpen(true);
    } else {
      console.warn("삭제할 폴더가 선택되지 않았습니다 (옵션 메뉴 통해 선택되지 않음).");
    }
    setIsOptionsModalOpen(false);
  };

  const handleDeleteModalCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const handleFolderClick = (currentFolderId) => {
    console.warn(`handleFolderClick: 폴더 클릭됨. 폴더 ID: ${currentFolderId}`);
    if (typeof currentFolderId === 'undefined' || currentFolderId === null) {
      console.error("handleFolderClick: 클릭된 폴더의 ID가 유효하지 않습니다.", currentFolderId);
      return;
    }
    setIsLoading(true);
    // 사용자 경험을 위해 약간의 딜레이 후 페이지 이동 (선택 사항)
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
                              ) : videoUrl.includes("youtube.com/embed") || videoUrl.includes("youtu.be") ? ( // YouTube URL 패턴 개선
                                <iframe
                                  width="100%"
                                  src={videoUrl.includes("youtu.be") ? `https://www.youtube.com/embed/${videoUrl.split('/').pop().split('?')[0]}` : videoUrl.replace("watch?v=", "embed/")} // youtu.be 및 watch?v= 링크 처리
                                  title={videoTitle}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                  style={{ aspectRatio: '16/9' }}
                                ></iframe>
                              ): (
                                <video controls width="100%" height="auto" preload="metadata">
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
                          <div className={bookmarkStyle.placeholderImage}>
                            {/* 폴더 아이콘 또는 대표 이미지를 표시할 수 있습니다. */}
                          </div>
                        </div>
                        <div className={bookmarkStyle.bookmarkFooter}>
                          <div className={bookmarkStyle.bookmarkTitle}>{f.folderName}</div>
                          <div
                            className={bookmarkStyle.bookmarkOptions}
                            onClick={(e) => {
                              console.warn("옵션(⋯) 버튼 클릭됨 - 이벤트 전파 중지 시도");
                              e.stopPropagation(); // 폴더 클릭 이벤트 전파 방지
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
              <Modal isOpen={isOptionsModalOpen} onClose={() => { setIsOptionsModalOpen(false); setSelectedFolderId(null); }} title="폴더 옵션" confirmText="이름 변경" cancelText="삭제" onConfirm={handleOpenRenameModal} onCancel={handleDeleteFolder}>
                <p>폴더에 대한 작업을 선택하세요.</p>
              </Modal>
              <Modal isOpen={isRenameModalOpen} onClose={handleRenameModalCancel} title="폴더 이름 변경" onConfirm={handleRenameModalSubmit} confirmText="변경" cancelText="취소">
                <input type="text" value={renameFolderName} onChange={(e) => setRenameFolderName(e.target.value)} maxLength={10} placeholder="새 폴더 이름을 입력하세요 (최대 10자)" className={bookmarkStyle.modalInput}/>
              </Modal>
              <Modal isOpen={isDeleteModalOpen} onClose={handleDeleteModalCancel} title="폴더 삭제" onConfirm={handleDeleteModalSubmit} confirmText="삭제" cancelText="취소">
                <p>
                  {selectedFolderId && folders.find(f => f.folderId === selectedFolderId)
                    ? `'${folders.find(f => f.folderId === selectedFolderId).folderName}' 폴더를 삭제하시겠습니까?`
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