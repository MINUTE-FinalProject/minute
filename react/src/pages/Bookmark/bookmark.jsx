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
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  // URL에서 folderId가 변경될 때 상태 업데이트
  useEffect(() => {
    if (folderId) {
      const folder = folders.find((f) => f.id === parseInt(folderId));
      if (folder) {
        setSelectedFolderId(parseInt(folderId));
        // 폴더 제목, 영상 데이터는 별도 관리
        setSelectedFolderVideos([]); // 영상 데이터 초기화 (사용자가 나중에 추가)
      }
    } else {
      setSelectedFolderId(null);
      setSelectedFolderVideos([]);
    }
  }, [folderId, folders]);

  // 폴더 추가 버튼 누를 때
  const handleAddFolder = () => {
    setIsAddModalOpen(true);
  };

  // 폴더 추가 모달 확인
  const handleAddModalSubmit = () => {
    if (newFolderName.trim()) {
      const trimmedFolderName = newFolderName.trim().slice(0, 10);
      const newFolder = { id: Date.now(), title: trimmedFolderName };
      setFolders([...folders, newFolder]);
      setNewFolderName("");
      setIsAddModalOpen(false);
    }
  };

  // 폴더 추가 모달 취소
  const handleAddModalCancel = () => {
    setNewFolderName("");
    setIsAddModalOpen(false);
  };

  // 폴더 옵션 모달 열기 (이름 변경 등)
  const handleOpenOptionsModal = (folderId) => {
    setSelectedFolderId(folderId);
    setIsOptionsModalOpen(true);
  };

  // 이름 변경 모달 열기
  const handleOpenRenameModal = () => {
    const folder = folders.find((f) => f.id === selectedFolderId);
    setRenameFolderName(folder.title);
    setIsOptionsModalOpen(false);
    setIsRenameModalOpen(true);
  };

  // 이름 변경 모달 확인
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

  // 이름 변경 모달 취소
  const handleRenameModalCancel = () => {
    setRenameFolderName("");
    setIsRenameModalOpen(false);
    setSelectedFolderId(null);
  };

  // 체크박스 선택 변경
  const handleCheckboxChange = (folderId) => {
    if (selectedFolders.includes(folderId)) {
      setSelectedFolders(selectedFolders.filter((id) => id !== folderId));
    } else {
      setSelectedFolders([...selectedFolders, folderId]);
    }
  };

  // 폴더 삭제 버튼 클릭
  const handleDeleteFolder = () => {
    if (selectedFolders.length > 0) {
      setIsDeleteModalOpen(true);
    }
  };

  // 폴더 삭제 모달 확인
  const handleDeleteModalSubmit = () => {
    setFolders(folders.filter((folder) => !selectedFolders.includes(folder.id)));
    setSelectedFolders([]);
    setIsDeleteModalOpen(false);

    // 만약 현재 보고있는 폴더가 삭제되면, URL 이동 혹은 상태 초기화 필요할 수 있음
    if (selectedFolderId && selectedFolders.includes(selectedFolderId)) {
      navigate("/bookmark");
      setSelectedFolderId(null);
    }
  };

  // 폴더 삭제 모달 취소
  const handleDeleteModalCancel = () => {
    setIsDeleteModalOpen(false);
  };

  // 폴더 클릭 시 1초 딜레이 후 URL 이동
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
                {/* 제목이 폴더 선택 여부에 따라 다르게 표시됨 */}
                <h1>
                  {selectedFolderId === null
                    ? "MY BOOKMARK"
                    : `MY BOOKMARK - ${
                        folders.find((f) => f.id === selectedFolderId)?.title || ""
                      }`}
                </h1>

                {/* 폴더 추가/삭제 버튼은 폴더 선택 안 했을 때만 표시 */}
                <div className={bookmarkStyle.buttons}>
                  {selectedFolderId === null && (
                    <>
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
                    </>
                  )}
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
                  // 선택된 폴더 안의 영상들 렌더링 (영상 데이터가 있을 때)
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

              {/* 폴더 추가 모달 */}
              {isAddModalOpen && (
                <div className={bookmarkStyle.modalOverlay}>
                  <div className={bookmarkStyle.modalContent}>
                    <h2>추가할 폴더의 이름을 입력하세요</h2>
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      maxLength={10}
                      placeholder="폴더 이름 (최대 10자)"
                    />
                    <div className={bookmarkStyle.modalButtons}>
                      <button onClick={handleAddModalSubmit}>확인</button>
                      <button onClick={handleAddModalCancel}>취소</button>
                    </div>
                  </div>
                </div>
              )}

              {/* 폴더 옵션 모달 */}
              {isOptionsModalOpen && (
                <div className={bookmarkStyle.modalOverlay}>
                  <div className={bookmarkStyle.modalContent}>
                    <button onClick={handleOpenRenameModal}>이름 변경</button>
                    <button
                      onClick={() => {
                        setIsOptionsModalOpen(false);
                        setSelectedFolderId(null);
                      }}
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}

              {/* 폴더 이름 변경 모달 */}
              {isRenameModalOpen && (
                <div className={bookmarkStyle.modalOverlay}>
                  <div className={bookmarkStyle.modalContent}>
                    <h2>폴더 이름 변경</h2>
                    <input
                      type="text"
                      value={renameFolderName}
                      onChange={(e) => setRenameFolderName(e.target.value)}
                      maxLength={10}
                      placeholder="새 폴더 이름 (최대 10자)"
                    />
                    <div className={bookmarkStyle.modalButtons}>
                      <button onClick={handleRenameModalSubmit}>확인</button>
                      <button onClick={handleRenameModalCancel}>취소</button>
                    </div>
                  </div>
                </div>
              )}

              {/* 폴더 삭제 확인 모달 */}
              {isDeleteModalOpen && (
                <div className={bookmarkStyle.modalOverlay}>
                  <div className={bookmarkStyle.modalContent}>
                    <h2>선택한 폴더를 삭제하시겠습니까?</h2>
                    <div className={bookmarkStyle.modalButtons}>
                      <button onClick={handleDeleteModalSubmit}>삭제</button>
                      <button onClick={handleDeleteModalCancel}>취소</button>
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
