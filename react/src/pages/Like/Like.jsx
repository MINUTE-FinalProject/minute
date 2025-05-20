// src/Like.jsx
import React, { useState } from "react";
import styles from "./Like.module.css";
import MypageNav from "../../components/MypageNavBar/MypageNav";
import Modal from "../../components/Modal/Modal"; // Modal 컴포넌트 import

const VIDEO_WIDTH = 220;
const GAP = 20;
const VISIBLE_COUNT = 6;
const SCROLL_STEP = VIDEO_WIDTH + GAP;

// 더미 데이터로 초기화 (오류 방지용)
const likedVideos = [
  { id: 1, title: "Sample Video 1", thumbnail: "https://via.placeholder.com/220x124", likedAt: "2025-05-19" },
  { id: 2, title: "Sample Video 2", thumbnail: "https://via.placeholder.com/220x124", likedAt: "2025-05-18" },
];
const recentWatched = [
  { id: 3, title: "Recent Video 1", thumbnail: "https://via.placeholder.com/220x124" },
];

const Like = () => {
  const [videos, setVideos] = useState(likedVideos);
  const [filter, setFilter] = useState("전체");

  const [modal, setModal] = useState({ show: false, index: -1 });
  const [folderModal, setFolderModal] = useState(false);
  const [createFolderModal, setCreateFolderModal] = useState(false);
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [bookmarkMsg, setBookmarkMsg] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const scroll = (containerId, direction) => {
    const container = document.getElementById(containerId);
    if (container) {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      let newScrollLeft = container.scrollLeft + direction * SCROLL_STEP;
      container.scrollTo({
        left: Math.min(Math.max(newScrollLeft, 0), maxScrollLeft),
        behavior: "smooth",
      });
    }
  };

  const handleDelete = () => {
    const updated = [...videos];
    if (modal.index >= 0 && modal.index < updated.length) {
      updated.splice(modal.index, 1);
      setVideos(updated);
    }
    closeModal();
  };

  const openFolderModal = () => {
    closeModal();
    if (folders.length === 0) {
      setCreateFolderModal(true);
    } else {
      setFolderModal(true);
    }
  };

  const handleSaveBookmark = () => {
    if (!selectedFolderId) {
      setBookmarkMsg(true);
      setTimeout(() => setBookmarkMsg(false), 2000);
      setFolderModal(false);
      return;
    }
    setBookmarkMsg(true);
    setTimeout(() => setBookmarkMsg(false), 2000);
    setFolderModal(false);
    setSelectedFolderId(null);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim() === "") {
      setBookmarkMsg(true);
      setTimeout(() => setBookmarkMsg(false), 2000);
      setCreateFolderModal(false);
      return;
    }

    const newId = folders.length > 0
      ? Math.max(...folders.map(f => f.id)) + 1
      : 1;

    const newFolder = {
      id: newId,
      name: newFolderName.trim(),
    };

    setFolders([...folders, newFolder]);
    setNewFolderName("");
    setCreateFolderModal(false);
    setFolderModal(true);
  };

  const closeModal = () => {
    setModal({ show: false, index: -1 });
    setFolderModal(false);
    setCreateFolderModal(false);
    setBookmarkMsg(false);
    setSelectedFolderId(null);
    setNewFolderName("");
  };

  const getFilteredVideos = () => {
    return filter === "최근"
      ? [...videos].sort((a, b) => new Date(b.likedAt) - new Date(a.likedAt))
      : videos;
  };

  const renderVideos = (videoList, containerId) => (
    <div className={styles.videoListWrapper}>
      {videoList.length > VISIBLE_COUNT && (
        <button className={styles.arrow} onClick={() => scroll(containerId, -1)}>‹</button>
      )}
      <div className={styles.videoList} id={containerId}>
        {videoList.map((video, index) => (
          <div
            key={video.id}
            className={styles.videoItem}
            style={{ backgroundImage: `url(${video.thumbnail || 'https://via.placeholder.com/220x124'})` }}
          >
            <div className={styles.videoTitle}>
              <span>{video.title || 'No Title'}</span>
              <button className={styles.moreBtn} onClick={() => setModal({ show: true, index })}>⋯</button>
            </div>
          </div>
        ))}
      </div>
      {videoList.length > VISIBLE_COUNT && (
        <button className={styles.arrow} onClick={() => scroll(containerId, 1)}>›</button>
      )}
    </div>
  );

  return (
    <div className={styles.wrapper}>
      <MypageNav />
      <div className={styles.mainContent}>
        <h1 className={styles.header}>좋아요 한 영상</h1>

        {/* 필터 버튼 */}
        <div className={styles.filterMenu}>
          {["전체", "최근"].map((type) => (
            <button
              key={type}
              className={`${styles.filterButton} ${filter === type ? styles.active : ""}`}
              onClick={() => setFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {/* 좋아요한 영상 리스트 */}
        {getFilteredVideos().length > 0 ? (
          renderVideos(getFilteredVideos(), "likedVideoList")
        ) : (
          <p className={styles.noData}>좋아요 한 영상이 없습니다.</p>
        )}

        {/* 최근 시청한 영상 */}
        <h2 className={styles.sectionTitle}>최근 시청한 영상</h2>
        {recentWatched.length > 0 ? (
          renderVideos(recentWatched, "recentVideoList")
        ) : (
          <p className={styles.noData}>최근 시청한 영상이 없습니다.</p>
        )}

        {/* 삭제/북마크 모달 */}
        <Modal
          isOpen={modal.show}
          onClose={closeModal}
          title="옵션"
          children={
            <div className={styles.optionsContainer}>
              <button className={styles.optionButton} onClick={handleDelete}>
                삭제
              </button>
              <button className={styles.optionButton} onClick={openFolderModal}>
                북마크에 저장
              </button>
            </div>
          }
          cancelText="취소"
          onCancel={closeModal}
        />

        {/* 폴더 선택 모달 */}
        <Modal
          isOpen={folderModal}
          onClose={() => {
            setFolderModal(false);
            setSelectedFolderId(null);
          }}
          title="저장할 폴더 선택"
          children={
            <>
              <ul className={styles.folderList}>
                {folders.map((folder) => (
                  <li key={folder.id}>
                    <label className={styles.folderLabel}>
                      <input
                        type="radio"
                        name="folder"
                        value={folder.id}
                        checked={selectedFolderId === folder.id}
                        onChange={() => setSelectedFolderId(folder.id)}
                      />
                      {folder.name}
                    </label>
                  </li>
                ))}
              </ul>
              <button
                className={styles.newFolderButton}
                onClick={() => {
                  setFolderModal(false);
                  setCreateFolderModal(true);
                }}
              >
                새 폴더 만들기
              </button>
            </>
          }
          onConfirm={handleSaveBookmark}
          confirmText="저장"
          cancelText="취소"
        />

        {/* 폴더 생성 모달 */}
        <Modal
          isOpen={createFolderModal}
          onClose={() => {
            setCreateFolderModal(false);
            if (folders.length > 0) setFolderModal(true);
          }}
          title="새 폴더 만들기"
          children={
            <input
              type="text"
              maxLength={10}
              placeholder="폴더 이름 입력"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className={styles.modalInput}
            />
          }
          onConfirm={handleCreateFolder}
          confirmText="생성"
          cancelText="취소"
        />

        {/* 북마크 저장 메시지 모달 */}
        <Modal
          isOpen={bookmarkMsg}
          onClose={closeModal}
          title="알림"
          message={
            selectedFolderId === null && newFolderName.trim() === ""
              ? "폴더를 선택하거나 이름을 입력해주세요."
              : newFolderName.trim() === ""
              ? "폴더 이름을 입력해주세요."
              : "북마크에 저장되었습니다."
          }
          onConfirm={closeModal}
          confirmText="확인"
        />
      </div>
    </div>
  );
};

export default Like;