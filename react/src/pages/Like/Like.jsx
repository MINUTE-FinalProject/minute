import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import likeStyle from "../../assets/styles/Like.module.css";
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

  // 모달 상태 관리
  const [modal, setModal] = useState({ show: false, index: -1, type: null });
  const [folderModal, setFolderModal] = useState(false);
  const [createFolderModal, setCreateFolderModal] = useState(false);
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [bookmarkMsg, setBookmarkMsg] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token || !userId) return;
    axios
      .get(`/api/v1/auth/${userId}/likes`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setLikedVideos(res.data))
      .catch(err => console.error("좋아요 영상 API 에러:", err));

    // 최근 시청한 영상 목록 API 호출
    axios
      .get(`/api/v1/auth/${userId}/watch-history`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setRecentWatched(res.data))
      .catch(err => console.error("시청 기록 API 에러:", err));
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
        console.log(`좋아요 영상 삭제 API 호출: userId=${userId}, videoId=${currentVideoId}`);
        await axios.delete(
          `/api/v1/auth/${userId}/videos/${videoId}/like`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLikedVideos(prev => prev.filter((_, i) => i !== index));
      } else {
        await axios.delete(
          `/api/v1/auth/${userId}/watch-history/${videoId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecentWatched(prev => prev.filter((_, i) => i !== index));
      }
    } catch (err) {
      console.error("삭제 API 에러:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
    closeAllModals();
  };

  // --- 👇 북마크 관련 함수들 제거 또는 주석 처리 ---
  /*
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
  */
  // --- ------------------------------------ ---

  const getFilteredVideos = () =>
    filter === "최근"
      ? [...likedVideos].sort((a, b) => new Date(b.likedAt) - new Date(a.likedAt)) // likedAt 필드가 있다고 가정
      : likedVideos;

  const renderVideos = (videoList, containerId, type) => (
    <div className={styles.videoListWrapper}> {/* likeStyle -> styles */}
      {videoList.length > VISIBLE_COUNT && (
        <button className={styles.arrow} onClick={() => scroll(containerId, -1)}>‹</button>
      )}
      <div className={likeStyle.videoList} id={containerId}>
        {videoList.map((video, idx) => (
          <div key={video.videoId} className={likeStyle.videoItem}>
            <div className={likeStyle.thumbnailWrapper}>
              <img src={video.thumbnailUrl} alt={video.videoTitle} className={likeStyle.thumbnail} loading="lazy" />
            </div>
            <div className={likeStyle.textWrapper}>
              <span className={likeStyle.videoTitleText}>{video.videoTitle}</span>
              <button className={likeStyle.moreBtn} onClick={() => setModal({ show: true, index: idx, type })}>⋯</button>
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
    <div className={styles.wrapper}> {/* likeStyle -> styles */}
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

        <h2 className={likeStyle.sectionTitle}>최근 시청한 영상</h2>
        {recentWatched.length ? renderVideos(recentWatched, 'recentVideoList', 'history') : <p className={likeStyle.noData}>최근 시청한 영상이 없습니다.</p>}

        <Modal
          isOpen={modal.show}
          onClose={closeAllModals}
          title="옵션"
          children={
            <div className={likeStyle.optionsContainer}>
              <button className={likeStyle.optionButton} onClick={handleDelete}>삭제</button>
              <button className={likeStyle.optionButton} onClick={openFolderModal}>북마크에 저장</button>
            </div>
          }
          cancelText="취소"
          onCancel={closeAllModals}
        />

        {/* 폴더 선택 모달 */}
        <Modal
          isOpen={folderModal}
          onClose={closeAllModals}
          title="저장할 폴더 선택"
          children={
            <>
              <ul className={likeStyle.folderList}>
                {folders.map(folder => (
                  <li key={folder.id}>
                    <label>
                      <input type="radio" name="folder" value={folder.id} checked={selectedFolderId === folder.id} onChange={() => setSelectedFolderId(folder.id)} /> {folder.name}
                    </label>
                  </li>
                ))}
              </ul>
            </>
          }
          onConfirm={handleSaveBookmark}
          confirmText="저장"
          cancelText="취소"
        />

        {/* 폴더 생성 모달 */}
        <Modal
          isOpen={createFolderModal}
          onClose={closeAllModals}
          title="새 폴더 만들기"
          children={
            <input type="text" placeholder="폴더 이름" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} className={likeStyle.modalInput} />
          }
          onConfirm={handleCreateFolder}
          confirmText="생성"
          cancelText="취소"
        />

        {/* 북마크 저장 메시지 */}
        <Modal
          isOpen={bookmarkMsg}
          onClose={closeAllModals}
          title="알림"
          message={selectedFolderId == null ? "폴더를 선택해주세요." : "북마크에 저장되었습니다!"}
          onConfirm={closeAllModals}
          confirmText="확인"
        />
      </div>
    </div>
  );
}
