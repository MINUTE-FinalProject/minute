import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MypageNav from "../../components/MypageNavBar/MypageNav";
import bookmarkStyle from "./bookmark.module.css";

const Bookmark = () => {
  const navigate = useNavigate();
  const { folderId } = useParams(); // URL에서 folderId 가져오기
  const [folders, setFolders] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [renameFolderName, setRenameFolderName] = useState("");
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [selectedFolderVideos, setSelectedFolderVideos] = useState([]); // 선택한 폴더의 영상 데이터
  const [currentFolderTitle, setCurrentFolderTitle] = useState("MY BOOKMARK"); // 현재 표시할 h1 제목
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  // URL에서 folderId가 변경될 때 상태 업데이트
  useEffect(() => {
    if (folderId) {
      const folder = folders.find((f) => f.id === parseInt(folderId));
      if (folder) {
        setSelectedFolderId(parseInt(folderId));
        setCurrentFolderTitle(folder.title);
        setSelectedFolderVideos([]); // 영상 데이터 초기화 (사용자가 나중에 추가)
      }
    } else {
      setSelectedFolderId(null);
      setCurrentFolderTitle("MY BOOKMARK");
      setSelectedFolderVideos([]);
    }
  }, [folderId, folders]);

  const handleAddFolder = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalSubmit = () => {
    if (newFolderName.trim()) {
      const trimmedFolderName = newFolderName.trim().slice(0, 10);
      const newFolder = { id: Date.now(), title: trimmedFolderName };
      setFolders([...folders, newFolder]);
      setNewFolderName("");
      setIsAddModalOpen(false);
    }
  };

  const handleAddModalCancel = () => {
    setNewFolderName("");
    setIsAddModalOpen(false);
  };

  const handleOpenOptionsModal = (folderId) => {
    setSelectedFolderId(folderId);
    setIsOptionsModalOpen(true);
  };

  const handleOpenRenameModal = () => {
    const folder = folders.find((f) => f.id === selectedFolderId);
    setRenameFolderName(folder.title);
    setIsOptionsModalOpen(false);
    setIsRenameModalOpen(true);
  };

  const handleRenameModalSubmit = () => {
    if (renameFolderName.trim()) {
      const trimmedFolderName = renameFolderName.trim().slice(0, 10);
      setFolders(
        folders.map((folder) =>
          folder.id === selectedFolderId
            ? { ...folder, title: trimmedFolderName }
            : folder
        )
      );
      setRenameFolderName("");
      setIsRenameModalOpen(false);
      setSelectedFolderId(null);
    }
  };

  const handleRenameModalCancel = () => {
    setRenameFolderName("");
    setIsRenameModalOpen(false);
    setSelectedFolderId(null);
  };

  const handleCheckboxChange = (folderId) => {
    if (selectedFolders.includes(folderId)) {
      setSelectedFolders(selectedFolders.filter((id) => id !== folderId));
    } else {
      setSelectedFolders([...selectedFolders, folderId]);
    }
  };

  const handleDeleteFolder = () => {
    if (selectedFolders.length > 0) {
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteModalSubmit = () => {
    setFolders(
      folders.filter((folder) => !selectedFolders.includes(folder.id))
    );
    setSelectedFolders([]);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteModalCancel = () => {
    setIsDeleteModalOpen(false);
  };

  // 폴더 클릭 시 3초 딜레이 후 URL 이동
  const handleFolderClick = (folderId, folderTitle) => {
    setIsLoading(true);
    setTimeout(() => {
      navigate(`/bookmark/${folderId}`); // URL 변경으로 페이지 이동
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <MypageNav />
      <div className={bookmarkStyle.layout}>
        <div className={bookmarkStyle.container}>
          <div className={bookmarkStyle.container2}>
            <main className={bookmarkStyle.mainContent}>
              <header className={bookmarkStyle.header}>
                <h1>{currentFolderTitle}</h1>
                <div className={bookmarkStyle.buttons}>
                  <button
                    className={bookmarkStyle.btn}
                    onClick={handleAddFolder}
                  >
                    폴더 추가
                  </button>
                  <button
                    className={bookmarkStyle.btn}
                    onClick={handleDeleteFolder}
                    disabled={selectedFolders.length === 0}
                  >
                    폴더 삭제
                  </button>
                </div>
              </header>
              <section className={bookmarkStyle.bookmarkGrid}>
                {isLoading ? (
                  <div className={bookmarkStyle.loading}>로딩 중...</div>
                ) : selectedFolderId === null ? (
                  folders.length === 0 ? (
                    <div className={bookmarkStyle.emptyState}></div>
                  ) : (
                    folders.map((folder) => (
                      <div
                        key={folder.id}
                        className={bookmarkStyle.bookmarkItem}
                        onClick={() => handleFolderClick(folder.id, folder.title)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className={bookmarkStyle.bookmarkCard}>
                          <div className={bookmarkStyle.placeholderImage}>
                            <input
                              type="checkbox"
                              className={bookmarkStyle.bookmarkCheckbox}
                              checked={selectedFolders.includes(folder.id)}
                              onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 차단
                              onChange={(e) => {
                                e.stopPropagation(); // 변경 이벤트 전파 차단
                                console.log("Checkbox clicked, propagation stopped");
                                handleCheckboxChange(folder.id);
                              }}
                            />
                          </div>
                        </div>
                        <div className={bookmarkStyle.bookmarkFooter}>
                          <div className={bookmarkStyle.bookmarkTitle}>
                            {folder.title}
                          </div>
                          <div
                            className={bookmarkStyle.bookmarkOptions}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenOptionsModal(folder.id);
                            }}
                          >
                            ⋯
                          </div>
                        </div>
                      </div>
                    ))
                  )
                ) : (
                  selectedFolderVideos.map((video, index) => (
                    <div key={index} className={bookmarkStyle.bookmarkItem}>
                      <div className={bookmarkStyle.bookmarkCard}>
                        <div className={bookmarkStyle.placeholderImage}>
                          <video controls>
                            <source src={video} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      </div>
                      <div className={bookmarkStyle.bookmarkFooter}>
                        <div className={bookmarkStyle.bookmarkTitle}>
                          {video}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </section>

              {isAddModalOpen && (
                <div className={bookmarkStyle.modalOverlay}>
                  <div className={bookmarkStyle.modalContent}>
                    <h2>추가할 폴더의 이름을 입력하세요</h2>
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="이름"
                      className={bookmarkStyle.modalInput}
                      maxLength={10}
                    />
                    <div className={bookmarkStyle.modalButtons}>
                      <button
                        onClick={handleAddModalSubmit}
                        className={bookmarkStyle.btn}
                      >
                        확인
                      </button>
                      <button
                        onClick={handleAddModalCancel}
                        className={bookmarkStyle.btn}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {isOptionsModalOpen && (
                <div className={bookmarkStyle.modalOverlay}>
                  <div className={bookmarkStyle.optionsModalContent}>
                    <button
                      className={bookmarkStyle.optionButton}
                      onClick={handleOpenRenameModal}
                    >
                      이름 변경하기
                    </button>
                  </div>
                </div>
              )}

              {isRenameModalOpen && (
                <div className={bookmarkStyle.modalOverlay}>
                  <div className={bookmarkStyle.modalContent}>
                    <h2>변경할 이름을 입력하세요</h2>
                    <input
                      type="text"
                      value={renameFolderName}
                      onChange={(e) => setRenameFolderName(e.target.value)}
                      placeholder="이름"
                      className={bookmarkStyle.modalInput}
                      maxLength={10}
                    />
                    <div className={bookmarkStyle.modalButtons}>
                      <button
                        onClick={handleRenameModalSubmit}
                        className={bookmarkStyle.btn}
                      >
                        확인
                      </button>
                      <button
                        onClick={handleRenameModalCancel}
                        className={bookmarkStyle.btn}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {isDeleteModalOpen && (
                <div className={bookmarkStyle.modalOverlay}>
                  <div className={bookmarkStyle.modalContent}>
                    <h2>삭제 하시겠습니까?</h2>
                    <p className={bookmarkStyle.deleteWarning}>
                      삭제하면 되돌릴 수 없습니다.
                    </p>
                    <div className={bookmarkStyle.modalButtons}>
                      <button
                        onClick={handleDeleteModalSubmit}
                        className={bookmarkStyle.btn}
                      >
                        확인
                      </button>
                      <button
                        onClick={handleDeleteModalCancel}
                        className={bookmarkStyle.btn}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Bookmark;