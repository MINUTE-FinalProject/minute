import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../assets/styles/ShortsVideoPage.module.css";
import Header from "../../components/Header/Header";
import SearchBar from "../../components/MainSearchBar/SearchBar";

// Icon imports
import arrowIcon from "../../assets/images/arrow.png";
import starOutlinedIcon from "../../assets/images/b_star.png";
import thumbDownOutlinedIcon from "../../assets/images/b_thumbdowm.png";
import thumbUpOutlinedIcon from "../../assets/images/b_thumbup.png";
import starIcon from "../../assets/images/star.png";
import thumbDownIcon from "../../assets/images/thumbdowm.png";
import thumbUpIcon from "../../assets/images/thumbup.png";

function ShortsVideoPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. 카드 클릭시 state로 넘어온 데이터 받기
  const passedShorts = location.state?.shorts || [];
  const passedStartIdx = location.state?.startIdx || 0;

  // 2. state로 넘어온 데이터가 있으면 그걸로 시작, 없으면 fetch
  const [shorts, setShorts] = useState(passedShorts);
  const [currentIdx, setCurrentIdx] = useState(passedStartIdx);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 3. fetch only if direct 접근 등으로 state 없을 때만!
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (passedShorts && passedShorts.length > 0) return; // state 있으면 fetch 안함

    const dbFetch = fetch(`/api/v1/youtube/db/shorts?maxResults=15`)
      .then(res => res.ok ? res.json() : [])
      .catch(() => []);
  
    const apiFetch = fetch(`/api/v1/youtube/shorts?maxResults=15`)
      .then(res => res.ok ? res.json() : [])
      .catch(() => []);
  
    Promise.all([dbFetch, apiFetch]).then(([dbVideos, apiVideos]) => {
      const dbItems = Array.isArray(dbVideos)
        ? dbVideos.map((v) => ({
            id: { videoId: v.youtubeVideoId || v.videoId || v.youtube_video_id || v.video_id },
            snippet: {
              title: v.title || v.videoTitle || v.video_title,
              description: v.description || v.videoDescription || v.video_description,
              thumbnails: {
                medium: { url: v.thumbnailUrl || v.thumbnail_url }
              }
            }
          }))
        : [];
  
      const apiItems = Array.isArray(apiVideos) ? apiVideos : [];
      const allItems = [...dbItems, ...apiItems];
  
      setShorts(allItems);
      setCurrentIdx(0);
    });
  }, [passedShorts]);

  const video = shorts[currentIdx];
  const videoId = video?.id?.videoId || null;

  // 좋아요 처리
  const handleThumbUpClick = async () => {
    if (!videoId) return;
    if (!isLoggedIn) { setIsLoginModalOpen(true); return; }
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const isNowLiked = !!likes[videoId];
    try {
      if (!isNowLiked) {
        await axios.post(`/api/v1/auth/${userId}/videos/${videoId}/like`, 
        null, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.delete(`/api/v1/auth/${userId}/videos/${videoId}/like`,
         { headers: { Authorization: `Bearer ${token}` } });
      }
      setLikes(prev => ({ ...prev, [videoId]: !isNowLiked }));
      setDislikes(prev => ({ ...prev, [videoId]: false }));
    } catch (err) {
      console.error("좋아요 API 에러", err);
    }
  };

  // 싫어요 처리
  const handleThumbDownClick = async () => {
    if (!videoId) return;
    if (!isLoggedIn) { setIsLoginModalOpen(true); return; }
  
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const isNowDisliked = !!dislikes[videoId];
  
    try {
      if (!isNowDisliked) {
        await axios.post(
          `/api/v1/auth/${userId}/videos/${videoId}/dislike`,
          null,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.delete(
          `/api/v1/auth/${userId}/videos/${videoId}/dislike`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
  
      setDislikes(prev => ({ ...prev, [videoId]: !isNowDisliked }));
      setLikes(prev => ({ ...prev, [videoId]: false })); // 싫어요 누르면 좋아요 해제
    } catch (err) {
      console.error("싫어요 API 에러", err);
    }
  };

  const handleStarClick = () => {
    if (!videoId) return;
    if (!isLoggedIn) { setIsLoginModalOpen(true); return; }
    setIsFolderOpen(prev => !prev);
  };

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      setFolders(prev => [...prev, newFolderName.trim()]);
      setNewFolderName("");
    }
  };

  const handleFolderClick = (name) => {
    setSelectedFolder(name);
    setIsFolderOpen(false);
  };

  // 순환형: 맨끝-맨처음 자연스럽게 이동
  const handlePrev = () => {
    setCurrentIdx(idx => (idx - 1 + shorts.length) % shorts.length);
  };
  const handleNext = () => {
    setCurrentIdx(idx => (idx + 1) % shorts.length);
  };

  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <SearchBar showTitle={false} compact className={styles.searchCompact} textboxClassName={styles.textboxCompact} />
        <div className={styles.mainContent}>
          <div className={styles.contentWrap}>
            <div className={styles.shortVideo}>
              {videoId ? (
                <iframe
                  width="470"
                  height="720"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  title={video.snippet?.title || "short video"}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  style={{ borderRadius: 18, boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}
                />
              ) : (
                <p style={{ textAlign: 'center', marginTop: '50%' }}>영상이 없습니다.</p>
              )}
            </div>
            <div className={styles.reactionWrap}>
              <ul>
                <li>
                  <img
                    src={videoId && likes[videoId] ? thumbUpIcon : thumbUpOutlinedIcon}
                    alt="thumbUp"
                    onClick={handleThumbUpClick}
                    className={styles.reactionIcon}
                  />
                </li>
                <li>
                  <img
                    src={videoId && dislikes[videoId] ? thumbDownIcon : thumbDownOutlinedIcon}
                    alt="thumbDown"
                    onClick={handleThumbDownClick}
                    className={styles.reactionIcon}
                  />
                </li>
                <li>
                  <img
                    src={videoId && selectedFolder ? starIcon : starOutlinedIcon}
                    alt="bookmark"
                    onClick={handleStarClick}
                    className={styles.reactionIcon}
                  />
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.arrowWrap}>
            <ul>
              <li>
                <img src={arrowIcon} alt="prev" className={styles.arrowTop} onClick={handlePrev} />
              </li>
              <li>
                <img src={arrowIcon} alt="next" className={styles.arrowBottom} onClick={handleNext} />
              </li>
            </ul>
          </div>
          {isFolderOpen && (
            <div className={styles.folderModal} style={{ bottom: '120px' }}>
              <div className={styles.folderInputWrap}>
                <input
                  type="text"
                  className={styles.folderInput}
                  placeholder="새 폴더 이름"
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                />
                <button className={styles.folderBtn} onClick={handleAddFolder}>+</button>
              </div>
              <ul className={styles.folderList}>
                {folders.length === 0 ? (
                  <li className={styles.emptyFolder}>폴더가 없습니다.</li>
                ) : (
                  folders.map(name => (
                    <li key={name} className={styles.folderItem} onClick={() => handleFolderClick(name)}>
                      <span className={styles.folderName}>{name}</span>
                      {selectedFolder === name && <span className={styles.checkmark}>✔</span>}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
        {isLoginModalOpen && (
          <div className={styles.loginModalOverlay} onClick={closeLoginModal}>
            <div className={styles.loginModal} onClick={e => e.stopPropagation()}>
              <h2>로그인이 필요합니다</h2>
              <button onClick={() => { setIsLoginModalOpen(false); navigate("/login"); }}>로그인</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ShortsVideoPage;
