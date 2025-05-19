import React, { useState } from "react";
import styles from "./Like.module.css";
import MypageNav from "../../components/MypageNavBar/MypageNav";

const VIDEO_WIDTH = 220;
const GAP = 20;
const VISIBLE_COUNT = 6;
const SCROLL_STEP = VIDEO_WIDTH + GAP;

const likedVideos = [];
const recentWatched = [];

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
    updated.splice(modal.index, 1);
    setVideos(updated);
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
      alert("폴더를 선택해주세요.");
      return;
    }

    setFolderModal(false);
    setSelectedFolderId(null);
    setBookmarkMsg(true);

    setTimeout(() => setBookmarkMsg(false), 2000);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim() === "") {
      alert("폴더 이름을 입력해주세요.");
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
            style={{ backgroundImage: `url(${video.thumbnail})` }}
          >
            <div className={styles.videoTitle}>
              <span>{video.title}</span>
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
        {modal.show && (
          <div className={styles.modal}>
            <button onClick={handleDelete}>삭제</button>
            <button onClick={openFolderModal}>북마크에 저장</button>
            <button onClick={closeModal}>닫기</button>
          </div>
        )}

        {/* 폴더 선택 모달 */}
        {folderModal && (
          <div className={styles.modal}>
            <h3>저장할 폴더 선택</h3>
            <ul className={styles.folderList}>
              {folders.map((folder) => (
                <li key={folder.id}>
                  <label>
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
            <button onClick={handleSaveBookmark}>저장</button>
            <button onClick={() => setFolderModal(false)}>취소</button>
            <button onClick={() => {
              setFolderModal(false);
              setCreateFolderModal(true);
            }}>
              새 폴더 만들기
            </button>
          </div>
        )}

        {/* 폴더 생성 모달 */}
        {createFolderModal && (
          <div className={styles.modal}>
            <h3>새 폴더 만들기</h3>
            <input
              type="text"
              maxLength={10}
              placeholder="폴더 이름 입력"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <button onClick={handleCreateFolder}>생성</button>
            <button onClick={() => {
              setCreateFolderModal(false);
              if (folders.length > 0) setFolderModal(true);
            }}>취소</button>
          </div>
        )}

        {/* 북마크 저장 메시지 */}
        {bookmarkMsg && (
          <div className={styles.bookmarkMessage}>북마크에 저장되었습니다.</div>
        )}
      </div>
    </div>
  );
};

export default Like;
