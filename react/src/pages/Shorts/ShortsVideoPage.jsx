import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function ShortsVideoPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [thumbUp, setThumbUp] = useState("/src/assets/images/b_thumbup.png");
  const [thumbDown, setThumbDown] = useState("/src/assets/images/b_thumbdowm.png");
  const [star, setStar] = useState("/src/assets/images/b_star.png");

  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const redirectToLogin = () => {
    setIsLoginModalOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    axios.get("/api/v1/youtube/shorts", { params: { maxResults: 100 } })
      .then(res => {
        if (Array.isArray(res.data)) {
          setShorts(res.data);
          setCurrentIdx(0);
        }
      })
      .catch(err => console.error("숏츠 로드 실패", err));
  }, []);

  const video = shorts[currentIdx];
  const videoId = video?.id?.videoId || null;

  const handleThumbUpClick = async () => {
    if (!videoId) return;
    if (!isLoggedIn) { setIsLoginModalOpen(true); return; }
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const isNowLiked = !!likes[videoId];
    try {
      if (!isNowLiked) {
        await axios.post(`/api/v1/auth/${userId}/videos/${videoId}/like`, null, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.delete(`/api/v1/auth/${userId}/videos/${videoId}/like`, { headers: { Authorization: `Bearer ${token}` } });
      }
      setLikes(prev => ({ ...prev, [videoId]: !isNowLiked }));
      setDislikes(prev => ({ ...prev, [videoId]: false }));
    } catch (err) {
      console.error("좋아요 API 에러", err);
    }
  };

  const handleThumbDownClick = () => {
    if (!videoId) return;
    if (!isLoggedIn) { setIsLoginModalOpen(true); return; }
    setDislikes(prev => ({ ...prev, [videoId]: !prev[videoId] }));
    setLikes(prev => ({ ...prev, [videoId]: false }));
  };

  // 폴더 관련
  const handleStarClick = () => {
    if (!videoId) return;
    if (!isLoggedIn) { setIsLoginModalOpen(true); return; }
    setIsFolderOpen(prev => !prev);
  };

  // 폴더 추가
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

  const handlePrev = () => setCurrentIdx(idx => Math.max(idx - 1, 0));
  const handleNext = () => setCurrentIdx(idx => Math.min(idx + 1, shorts.length - 1));

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
              <button onClick={redirectToLogin}>로그인</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ShortsVideoPage;
