import { useState } from "react";
import MypageNav from "../../components/MypageNavBar/MypageNav";
import bookmarkStyle from "./bookmark.module.css";

const Bookmark = () => {
  const [folders, setFolders] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [renameFolderName, setRenameFolderName] = useState("");
  const [selectedFolders, setSelectedFolders] = useState([]); // 체크된 폴더 ID 저장

  // 폴더 추가 모달 열기
  const handleAddFolder = () => {
    setIsAddModalOpen(true);
  };

  // 폴더 추가 확인
  const handleAddModalSubmit = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: Date.now(),
        title: newFolderName,
      };
      setFolders([...folders, newFolder]);
      setNewFolderName("");
      setIsAddModalOpen(false);
    }
  };

  // 폴더 추가 취소
  const handleAddModalCancel = () => {
    setNewFolderName("");
    setIsAddModalOpen(false);
  };

  // 옵션 모달 열기 (⋯ 버튼 클릭 시)
  const handleOpenOptionsModal = (folderId) => {
    setSelectedFolderId(folderId);
    setIsOptionsModalOpen(true);
  };

  // 이름 변경하기 모달 열기
  const handleOpenRenameModal = () => {
    const folder = folders.find((f) => f.id === selectedFolderId);
    setRenameFolderName(folder.title);
    setIsOptionsModalOpen(false);
    setIsRenameModalOpen(true);
  };

  // 이름 변경 확인
  const handleRenameModalSubmit = () => {
    if (renameFolderName.trim()) {
      setFolders(
        folders.map((folder) =>
          folder.id === selectedFolderId
            ? { ...folder, title: renameFolderName }
            : folder
        )
      );
      setRenameFolderName("");
      setIsRenameModalOpen(false);
      setSelectedFolderId(null);
    }
  };

  // 이름 변경 취소
  const handleRenameModalCancel = () => {
    setRenameFolderName("");
    setIsRenameModalOpen(false);
    setSelectedFolderId(null);
  };

  // 체크박스 선택/해제 처리
  const handleCheckboxChange = (folderId) => {
    if (selectedFolders.includes(folderId)) {
      setSelectedFolders(selectedFolders.filter((id) => id !== folderId));
    } else {
      setSelectedFolders([...selectedFolders, folderId]);
    }
  };

  // 삭제 모달 열기
  const handleDeleteFolder = () => {
    if (selectedFolders.length > 0) {
      setIsDeleteModalOpen(true);
    }
  };

  // 삭제 확인
  const handleDeleteModalSubmit = () => {
    setFolders(
      folders.filter((folder) => !selectedFolders.includes(folder.id))
    );
    setSelectedFolders([]);
    setIsDeleteModalOpen(false);
  };

  // 삭제 취소
  const handleDeleteModalCancel = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <MypageNav />
      <div className={bookmarkStyle.layout}>
        <div className={bookmarkStyle.container}>
          <div className={bookmarkStyle.container2}>
            <div className={bookmarkStyle.navWrap}></div>
            <main className={bookmarkStyle.mainContent}>
              <header className={bookmarkStyle.header}>
                <h1>BOOKMARK</h1>
                <div className={bookmarkStyle.buttons}>
                  <button
                    className={bookmarkStyle.btn}
                    onClick={handleAddFolder}
                  >
                    추가
                  </button>
                  <button
                    className={bookmarkStyle.btn}
                    onClick={handleDeleteFolder}
                  >
                    삭제
                  </button>
                </div>
              </header>
              <section className={bookmarkStyle.bookmarkGrid}>
                {folders.map((folder) => (
                  <div key={folder.id} className={bookmarkStyle.bookmarkItem}>
                    <div className={bookmarkStyle.bookmarkCard}>
                      <div className={bookmarkStyle.placeholderImage}>
                        <input
                          type="checkbox"
                          className={bookmarkStyle.bookmarkCheckbox}
                          checked={selectedFolders.includes(folder.id)}
                          onChange={() => handleCheckboxChange(folder.id)}
                        />
                      </div>
                    </div>
                    <div className={bookmarkStyle.bookmarkFooter}>
                      <div className={bookmarkStyle.bookmarkTitle}>
                        {folder.title}
                      </div>
                      <div
                        className={bookmarkStyle.bookmarkOptions}
                        onClick={() => handleOpenOptionsModal(folder.id)}
                      >
                        ⋯
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* 폴더 추가 모달 */}
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

              {/* 옵션 모달 (이름 변경하기) */}
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

              {/* 이름 변경 모달 */}
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

              {/* 삭제 확인 모달 */}
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
