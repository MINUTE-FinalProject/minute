import { useEffect, useState } from "react";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [shorts, setShorts] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);

  // 로그인 모달
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 지역 저장
  const [region, setRegion] = useState(getRandomRegion());

  // 3. 자동 저장/불러오기 (최초 1회, region 변경시)
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    axios.get("/api/v1/youtube/shorts", { params: { region: "KR" , maxResults: 50 } })
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
    if (!isLoggedIn) return setIsLoginModalOpen(true);
    setIsFolderOpen(prev => !prev);
  };

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      setFolders(prev => [...prev, newFolderName.trim()]);
      setNewFolderName("");
    }
  };
  const handleFolderClick = folderName => {
    setSelectedFolder(folderName);
    setIsFolderOpen(false);
  };

  // 화살표로 이전/다음 영상
  const handlePrev = () => setCurrentIdx(idx => idx > 0 ? idx - 1 : idx);
  const handleNext = () => setCurrentIdx(idx => idx < shorts.length - 1 ? idx + 1 : idx);

  // 로그인 모달
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const handleLogin = () => { setIsLoggedIn(true); setIsLoginModalOpen(false); };

  // 현재 영상 (DB 저장 구조 맞춰서)
  const video = shorts[currentIdx];

  // 🔥 (선택) 지역 바꾸기 기능
  const handleRegionChange = e => setRegion(e.target.value);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.searchbar}>
          <input type="text" className={styles.searchInput} placeholder="검색..." />
          {/* 지역 선택 드롭다운 (선택사항) */}
          <select value={region} onChange={handleRegionChange} style={{marginLeft: 12}}>
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.contentWrap}>
            <div className={styles.shortVideo}>
              {/* DB 구조에 따라 YoutubeVideo 객체라면 videoId 바로 있음 */}
              {video && (video.youtubeVideoId || video.id?.videoId) ? (
                <iframe
                  width="470"
                  height="720"
                  src={`https://www.youtube.com/embed/${video.youtubeVideoId || video.id.videoId}?autoplay=1`}
                  title={video.title || video.snippet?.title || ""}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  style={{ borderRadius: "18px", boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}
                />
              ) : (
                <p style={{ textAlign: "center", marginTop: "50%" }}>영상이 없습니다.</p>
              )}
            </div>
            <div className={styles.reactionWrap}>
              <ul>
                <li>
                  <img
                    src={likes[currentIdx]
                      ? "/src/assets/images/thumbup.png"
                      : "/src/assets/images/b_thumbup.png"}
                    alt="thumbUp"
                    onClick={handleThumbUpClick}
                    className={styles.reactionIcon}
                  />
                </li>
                <li>
                  <img
                    src={dislikes[currentIdx]
                      ? "/src/assets/images/thumbdowm.png"
                      : "/src/assets/images/b_thumbdowm.png"}
                    alt="thumbDown"
                    onClick={handleThumbDownClick}
                    className={styles.reactionIcon}
                  />
                </li>
                <li>
                  <img
                    src={selectedFolder
                      ? "/src/assets/images/star.png"
                      : "/src/assets/images/b_star.png"}
                    alt="star"
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
                <img src="/src/assets/images/arrow.png" alt="up" className={styles.arrowTop} onClick={handlePrev} />
              </li>
              <li>
                <img src="/src/assets/images/arrow.png" alt="down" className={styles.arrowBottom} onClick={handleNext} />
              </li>
            </ul>
          </div>

          {/* 폴더 모달 */}
          <div
            className={styles.folderModal}
            style={{ bottom: isFolderOpen ? "120px" : "-100%" }}
          >
            <div className={styles.folderInputWrap}>
              <input
                type="text"
                className={styles.folderInput}
                placeholder="새 폴더 이름"
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
              />
              <button className={styles.folderBtn} onClick={handleAddFolder}>
                +
              </button>
            </div>
            <ul className={styles.folderList}>
              {folders.length === 0 ? (
                <li className={styles.emptyFolder}>폴더가 없습니다.</li>
              ) : (
                folders.map(folder => (
                  <li
                    key={folder}
                    className={styles.folderItem}
                    onClick={() => handleFolderClick(folder)}
                  >
                    <img
                      src="/src/assets/images/folder_icon.png"
                      alt="folder"
                      className={styles.folderIcon}
                    />
                    <span className={styles.folderName}>{folder}</span>
                    {selectedFolder === folder && (
                      <span className={styles.checkmark}>✔</span>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* 로그인 유도 모달 */}
      {isLoginModalOpen && (
        <div className={styles.loginModalOverlay} onClick={closeLoginModal}>
          <div className={styles.loginModal} onClick={e => e.stopPropagation()}>
            <h2>로그인이 필요합니다</h2>
            <button onClick={handleLogin}>로그인</button>
          </div>
        </div>
      )}
    </>
  );
}

export default ShortsVideoPage;
