import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import styles from "../../assets/styles/Like.module.css";
import Modal from "../../components/Modal/Modal";
import MypageNav from "../../components/MypageNavBar/MypageNav";

const VIDEO_WIDTH = 220;
const GAP = 20;
const VISIBLE_COUNT = 6;
const SCROLL_STEP = VIDEO_WIDTH + GAP;

export default function Like() {
  const navigate = useNavigate();
  const [likedVideos, setLikedVideos] = useState([]);
  const [recentWatched, setRecentWatched] = useState([]);
  const [filter, setFilter] = useState("전체");

  const [modal, setModal] = useState({ show: false, index: -1, type: null, videoId: null });

  const [toastMessage, setToastMessage] = useState("");
  const [isToastOpen, setIsToastOpen] = useState(false);

  const showToast = (message) => {
    setToastMessage(message);
    setIsToastOpen(true);
    setTimeout(() => {
      setIsToastOpen(false);
    }, 2500); // 2.5초 후 자동 닫힘
  };

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); 

  useEffect(() => {
    if (!token || !userId) {
      console.warn("Like.jsx: 로그인 정보가 없어 API를 호출하지 않습니다.");
      return;
    }
   
    // 좋아요 영상 가져오기 (원래대로)
    axios
      .get(`/api/v1/auth/${userId}/likes`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setLikedVideos(res.data))
      .catch(err => console.error("좋아요 영상 API 에러:", err));

    // 시청 기록 가져오기 + 중복 제거 + 정렬
    axios
      .get(`/api/v1/auth/${userId}/watch-history`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const rawList = res.data || [];
        const dedupedMap = rawList.reduce((acc, video) => {
          const vid = video.videoId;
          const prev = acc[vid];
          if (!prev || new Date(video.watchedAt) > new Date(prev.watchedAt)) {
            acc[vid] = video;
          }
          return acc;
        }, {});
        const dedupedList = Object.values(dedupedMap);
        dedupedList.sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt));
        setRecentWatched(dedupedList);
      })
      .catch(err => {
        console.error("시청 기록 API 에러:", err.response?.status, err.response?.data || err.message);
        setRecentWatched([]);
      });
  }, [token, userId]);

  const scroll = (containerId, direction) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const newScrollLeft = container.scrollLeft + direction * SCROLL_STEP;
    container.scrollTo({ left: Math.min(Math.max(newScrollLeft, 0), maxScrollLeft), behavior: 'smooth' });
  };

  // 삭제 (좋아요 or 시청기록)
  const handleDelete = async () => {
    const { index, type } = modal;
    const list = type === "like" ? likedVideos : recentWatched;
    const videoId = list[index]?.videoId;
    if (!videoId) return;

    try {
      if (type === "like") {
        setLikedVideos(prev => prev.filter(video => video.videoId !== videoIdToDelete));
        showToast("좋아요 목록에서 삭제되었습니다.");
      } else {
        setRecentWatched(prev => prev.filter(video => video.videoId !== videoIdToDelete));
        showToast("시청 기록에서 삭제되었습니다.");
      }
    } catch (err) {
      console.error(`${type} 삭제 API 에러:`, err);
      showToast("삭제 중 오류가 발생했습니다.");
    }
    closeAllModals();
  };

  const openFolderModal = () => {
    if (folders.length === 0) setCreateFolderModal(true);
    else setFolderModal(true);
    setModal({ show: false, index: -1, type: null });
  };

  const handleSaveBookmark = () => {
    if (!selectedFolderId) {
      setBookmarkMsg(true);
      return;
    }
    // TODO: POST 북마크 API with userId, videoId, selectedFolderId
    console.log(`북마크 저장 folderId=${selectedFolderId}`);
    setBookmarkMsg(true);
    setFolderModal(false);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      setBookmarkMsg(true);
      return;
    }
    const id = folders.length ? Math.max(...folders.map(f => f.id)) + 1 : 1;
    setFolders(prev => [...prev, { id, name: newFolderName.trim() }]);
    setNewFolderName("");
    setCreateFolderModal(false);
    setFolderModal(true);
  };

  const closeAllModals = () => {
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

  const renderVideos = (videoList, containerId, type) => (
    <div className={likeStyle.videoListWrapper}>
      {videoList.length > VISIBLE_COUNT && (
        <button className={likeStyle.arrow} onClick={() => scroll(containerId, -1)}>‹</button>
      )}
      <div className={styles.videoList} id={containerId}>
        {videoList.map((video, idx) => (
          <div key={video.videoId || `video-${idx}`} className={styles.videoItem}
          // onClick={() => navigate(`/shorts/${video.videoId}`)} 
          onClick={() =>
              navigate(`/shorts/${video.videoId}`, {
                state: { origin: type, list: videoList },
              })
            }
          >
            <div className={styles.thumbnailWrapper}>
              <img 
                src={video.thumbnailUrl || "https://via.placeholder.com/220x124"} // 기본 이미지 추가
                alt={video.videoTitle || "제목 없음"} 
                className={styles.thumbnail} 
                loading="lazy" 
              />
            </div>
            <div className={styles.textWrapper}>
              <span className={styles.videoTitleText}>{video.videoTitle || "제목 없음"}</span>
              <button className={styles.moreBtn} 
              onClick={(e) => {
                e.stopPropagation();
                setModal({ show: true, index: idx, type, videoId: video.videoId });
              }}>
                ⋯
              </button>
            </div>
          </div>
        ))}
      </div>
      {videoList.length >= VISIBLE_COUNT && (
        <button className={styles.arrow} onClick={() => scroll(containerId, 1)}>›</button>
      )}
    </div>
  );

  return (
    <div className={likeStyle.wrapper}>
      <MypageNav />
      <div className={likeStyle.mainContent}>
        <h1 className={likeStyle.header}>좋아요 한 영상</h1>
        <div className={likeStyle.filterMenu}>
          {['전체', '최근'].map(f => (
            <button key={f} className={`${likeStyle.filterButton} ${filter === f ? likeStyle.active : ''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        {getFilteredVideos().length ? renderVideos(getFilteredVideos(), 'likedVideoList', 'like') : <p className={likeStyle.noData}>좋아요 한 영상이 없습니다.</p>}

        <h2 className={styles.sectionTitle}>최근 시청한 영상</h2>
        {recentWatched.length
          ? renderVideos(
              [...recentWatched].sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt)), // ← 여기 정렬
              'recentVideoList',
              'history'
            )
          : <p className={styles.noData}>최근 시청한 영상이 없습니다.</p>}

          <Modal
            isOpen={modal.show}
            onClose={closeAllModals}
            title={modal.type === "like" ? "좋아요 한 영상 삭제" : "시청 기록 삭제"}
            message="정말 삭제하시겠습니까?"
            confirmText="삭제"
            cancelText="취소"
            onConfirm={handleDelete}
            onCancel={closeAllModals}
            hideCloseButton={false}
          >
          {/* <div className={styles.optionsContainer}>
            <button className={styles.optionButton} onClick={handleDelete}>
              {modal.type === "like" ? "좋아요 목록에서 삭제" : "시청 기록에서 삭제"}
            </button>
          </div> */}
        </Modal>

        {/* 삭제 완료 토스트용 모달 */}
        <Modal
          isOpen={isToastOpen}
          onClose={() => setIsToastOpen(false)}
          hideCloseButton={true}
          cancelText={null}
          onConfirm={null}
          message={toastMessage}
          type="success"  // 스타일이 있다면 'success' 타입 지정
        />
      </div>
    </div>
  );
}