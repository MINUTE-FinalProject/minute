// src/Bookmark.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MypageNav from "../../components/MypageNavBar/MypageNav";
import Modal from "../../components/Modal/Modal";
import bookmarkStyle from "../../assets/styles/bookmark.module.css";

const Bookmark = () => {
  const navigate = useNavigate();
  const { folderId } = useParams();
  const [folders, setFolders] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [renameFolderName, setRenameFolderName] = useState("");
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [selectedFolderVideos, setSelectedFolderVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (folderId) {
      const folder = folders.find((f) => f.id === parseInt(folderId));
      if (folder) {
        setSelectedFolderId(folder.id);
        setSelectedFolderVideos([]);
      }
    } else {
      setSelectedFolderId(null);
      setSelectedFolderVideos([]);
    }
  }, [folderId, folders]);

  const handleAddFolder = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalSubmit = () => {
    const name = newFolderName.trim().slice(0, 10);
    if (name) {
      const newFolder = { id: Date.now(), title: name };
      setFolders((prev) => [...prev, newFolder]);
      setNewFolderName("");
      setIsAddModalOpen(false);
    }
  };

  const handleAddModalCancel = () => {
    setNewFolderName("");
    setIsAddModalOpen(false);
  };

  const handleOpenOptionsModal = (id) => {
    setSelectedFolderId(id);
    setIsOptionsModalOpen(true);
  };

  const handleOpenRenameModal = () => {
    const folder = folders.find((f) => f.id === selectedFolderId);
    if (folder) setRenameFolderName(folder.title);
    setIsOptionsModalOpen(false);
    setIsRenameModalOpen(true);
  };

  const handleRenameModalSubmit = () => {
    const name = renameFolderName.trim().slice(0, 10);
    if (name) {
      setFolders((prev) =>
        prev.map((f) => (f.id === selectedFolderId ? { ...f, title: name } : f))
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

  const handleCheckboxChange = (id) => {
    setSelectedFolders((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleDeleteFolder = () => {
    if (selectedFolders.length > 0) {
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteModalSubmit = () => {
    setFolders((prev) => prev.filter((f) => !selectedFolders.includes(f.id)));
    if (selectedFolders.includes(selectedFolderId)) {
      navigate("/bookmark");
      setSelectedFolderId(null);
    }
    setSelectedFolders([]);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteModalCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const handleFolderClick = (id) => {
    setIsLoading(true);
    setTimeout(() => {
      navigate(`/bookmark/${id}`);
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
                <h1>
                  {selectedFolderId === null
                    ? "MY BOOKMARK"
                    : `MY BOOKMARK - ${folders.find((f) => f.id === selectedFolderId)?.title || ""}`}
                </h1>
                <div className={bookmarkStyle.buttons}>
                  {selectedFolderId === null && (
                    <>
                      <button className={bookmarkStyle.btn} onClick={handleAddFolder}>폴더 추가</button>
                      <button
                        className={bookmarkStyle.btn}
                        onClick={handleDeleteFolder}
                        disabled={selectedFolders.length === 0}
                      >
                        폴더 삭제
                      </button>
                    </>
                  )}
                </div>
              </header>

              <section className={bookmarkStyle.bookmarkGrid}>
                {isLoading ? (
                  <div className={bookmarkStyle.loading}>로딩 중...</div>
                ) : selectedFolderId === null ? (
                  folders.length === 0 ? (
                    <div className={bookmarkStyle.emptyState}>폴더가 없습니다.</div>
                  ) : (
                    folders.map((folder) => (
                      <div
                        key={folder.id}
                        className={bookmarkStyle.bookmarkItem}
                        onClick={() => handleFolderClick(folder.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className={bookmarkStyle.bookmarkCard}>
                          <div className={bookmarkStyle.placeholderImage}>
                            <input
                              type="checkbox"
                              className={bookmarkStyle.bookmarkCheckbox}
                              checked={selectedFolders.includes(folder.id)}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleCheckboxChange(folder.id);
                              }}
                            />
                          </div>
                        </div>
                        <div className={bookmarkStyle.bookmarkFooter}>
                          <div className={bookmarkStyle.bookmarkTitle}>{folder.title}</div>
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
                        <div className={bookmarkStyle.bookmarkTitle}>{video}</div>
                      </div>
                    </div>
                  ))
                )}
              </section>

              {/* 폴더 추가 모달 */}
              <Modal
                isOpen={isAddModalOpen}
                onClose={handleAddModalCancel}
                title="폴더 추가"
                onConfirm={handleAddModalSubmit}
                confirmText="확인"
                cancelText="취소"
                onCancel={handleAddModalCancel}
              >
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  maxLength={10}
                  placeholder="폴더 이름 (최대 10자)"
                  className={bookmarkStyle.modalInput}
                />
              </Modal>

              {/* 옵션 모달 */}
              <Modal
                isOpen={isOptionsModalOpen}
                onClose={() => {
                  setIsOptionsModalOpen(false);
                  setSelectedFolderId(null);
                }}
                title="옵션"
              >
                <div className={bookmarkStyle.optionsContainer}>
                  <button className={bookmarkStyle.optionButton} onClick={handleOpenRenameModal}>
                    이름 변경
                  </button>
                  <button className={bookmarkStyle.optionButton} onClick={handleDeleteFolder}>
                    삭제
                  </button>
                </div>
              </Modal>

              {/* 이름 변경 모달 */}
              <Modal
                isOpen={isRenameModalOpen}
                onClose={handleRenameModalCancel}
                title="폴더 이름 변경"
                onConfirm={handleRenameModalSubmit}
                confirmText="확인"
                cancelText="취소"
                onCancel={handleRenameModalCancel}
              >
                <input
                  type="text"
                  value={renameFolderName}
                  onChange={(e) => setRenameFolderName(e.target.value)}
                  maxLength={10}
                  placeholder="새 폴더 이름 (최대 10자)"
                  className={bookmarkStyle.modalInput}
                />
              </Modal>

              {/* 삭제 모달 */}
              <Modal
                isOpen={isDeleteModalOpen}
                onClose={handleDeleteModalCancel}
                title="폴더 삭제"
                message="선택한 폴더를 삭제하시겠습니까?"
                onConfirm={handleDeleteModalSubmit}
                confirmText="삭제"
                cancelText="취소"
                onCancel={handleDeleteModalCancel}
                confirmButtonType="danger"
              />
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Bookmark;