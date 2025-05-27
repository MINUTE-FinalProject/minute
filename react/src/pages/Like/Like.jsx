import axios from "axios";
import { useEffect, useState } from "react";
import likeStyle from "../../assets/styles/Like.module.css";
import Modal from "../../components/Modal/Modal"; // Modal 컴포넌트 import
import MypageNav from "../../components/MypageNavBar/MypageNav";

const VIDEO_WIDTH = 220;
const GAP = 20;
const VISIBLE_COUNT = 6;
const SCROLL_STEP = VIDEO_WIDTH + GAP;

const Like = () => {
  const [likedVideos, setLikedVideos] = useState([]);
  const [recentWatched, setRecentWatched] = useState([]);
  const [filter, setFilter] = useState("전체");

  // 북마크 및 삭제 모달 상태 정의: type으로 리스트 구분
  const [modal, setModal] = useState({ show: false, index: -1, type: null });
  const [folderModal, setFolderModal] = useState(false);
  const [createFolderModal, setCreateFolderModal] = useState(false);
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [bookmarkMsg, setBookmarkMsg] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // 초기 API 호출
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      console.warn("로그인 정보가 없습니다. 로그인 후 이용해주세요.");
      return;
    }

    axios
      .get(`http://localhost:8080/api/v1/auth/${userId}/likes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setLikedVideos(res.data))
      .catch((err) => console.error("좋아요 영상 API 에러:", err));

    axios
      .get(`http://localhost:8080/api/v1/auth/${userId}/watch-history`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRecentWatched(res.data))
      .catch((err) => console.error("시청 기록 API 에러:", err));
  }, []);

  // 리스트 스크롤
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

  // 좋아요/시청 기록 삭제 핸들러
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const { index, type } = modal;
    const list = type === "like" ? likedVideos : recentWatched;
    const item = list[index];
    const videoId = item.videoId;

    try {
      if (type === "like") {
        await axios.delete(
          `http://localhost:8080/api/v1/auth/${userId}/videos/${videoId}/like`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLikedVideos((prev) => prev.filter((_, i) => i !== index));
      } else if (type === "history") {
        await axios.delete(
          `http://localhost:8080/api/v1/auth/${userId}/watch-history/${videoId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecentWatched((prev) => prev.filter((_, i) => i !== index));
      }
    } catch (err) {
      console.error("삭제 API 에러:", err);
    }

    closeModal();
  };

  const openFolderModal = () => {
    closeModal();
    if (folders.length === 0) setCreateFolderModal(true);
    else setFolderModal(true);
  };

  const handleSaveBookmark = () => {
    // 북마크 로직 (생략)
  };
  const handleCreateFolder = () => {
    // 폴더 생성 로직 (생략)
  };

  const closeModal = () => {
    setModal({ show: false, index: -1, type: null });
    setFolderModal(false);
    setCreateFolderModal(false);
    setBookmarkMsg(false);
    setSelectedFolderId(null);
    setNewFolderName("");
  };

  const getFilteredVideos = () =>
    filter === "최근"
      ? [...likedVideos].sort((a, b) => new Date(b.likedAt) - new Date(a.likedAt))
      : likedVideos;

  // 영상 렌더링 함수에 modal 오픈 시 type 전달
  const renderVideos = (videoList, containerId, type) => (
    <div className={likeStyle.videoListWrapper}>
      {videoList.length > VISIBLE_COUNT && (
        <button className={likeStyle.arrow} onClick={() => scroll(containerId, -1)}>‹</button>
      )}
      <div className={likeStyle.videoList} id={containerId}>
        {videoList.map((video, index) => (
          <div key={video.videoId} className={likeStyle.videoItem}>
            <div className={likeStyle.thumbnailWrapper}>
              <img
                src={video.thumbnailUrl || "https://via.placeholder.com/220x124"}
                alt={video.videoTitle || "No Title"}
                className={likeStyle.thumbnail}
                loading="lazy"
              />
            </div>
            <div className={likeStyle.textWrapper}>
              <span className={likeStyle.videoTitleText}>{video.videoTitle || "No Title"}</span>
              <button
                className={likeStyle.moreBtn}
                onClick={() => setModal({ show: true, index, type })}
              >⋯</button>
            </div>
          </div>
        ))}
      </div>
      {videoList.length > VISIBLE_COUNT && (
        <button className={likeStyle.arrow} onClick={() => scroll(containerId, 1)}>›</button>
      )}
    </div>
  );

  return (
    <div className={likeStyle.wrapper}>
      <MypageNav />
      <div className={likeStyle.mainContent}>
        <h1 className={likeStyle.header}>좋아요 한 영상</h1>
        <div className={likeStyle.filterMenu}>
          {["전체", "최근"].map((type) => (
            <button
              key={type}
              className={`${likeStyle.filterButton} ${filter === type ? likeStyle.active : ""}`} onClick={() => setFilter(type)}>
              {type}
            </button>
          ))}
        </div>
        {getFilteredVideos().length > 0 ? renderVideos(getFilteredVideos(), "likedVideoList", "like")
          : <p className={likeStyle.noData}>좋아요 한 영상이 없습니다.</p>}

        <h2 className={likeStyle.sectionTitle}>최근 시청한 영상</h2>
        {recentWatched.length > 0 ? renderVideos(recentWatched, "recentVideoList", "history")
          : <p className={likeStyle.noData}>최근 시청한 영상이 없습니다.</p>}

        <Modal isOpen={modal.show} onClose={closeModal} title="옵션"
          children={
            <div className={likeStyle.optionsContainer}>
              <button className={likeStyle.optionButton} onClick={handleDelete}>삭제</button>
              <button className={likeStyle.optionButton} onClick={openFolderModal}>북마크에 저장</button>
            </div>
          }
          cancelText="취소" onCancel={closeModal} />
        {/* 폴더/생성/메시지 모달 생략 */}
      </div>
    </div>
  );
};

export default Like;
