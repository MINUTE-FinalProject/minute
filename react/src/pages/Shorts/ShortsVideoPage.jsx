import { useEffect, useState } from "react";
import styles from "../../assets/styles/ShortsVideoPage.module.css";
import Header from "../../components/Header/Header";

function ShortsVideoPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 유튜브 쇼츠 리스트 & 재생중인 인덱스
  const [shorts, setShorts] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  // 좋아요/싫어요 상태(영상마다 분리)
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  // 폴더
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  // 로그인 유도 모달
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 유튜브 쇼츠 불러오기 (예시: 서울 쇼츠)
  useEffect(() => {
    fetch(`/api/v1/youtube/shorts?region=한국&maxResults=15`)
      .then(res => res.json())
      .then(data => {
        setShorts(Array.isArray(data) ? data : []);
        setCurrentIdx(0);
      });
  }, []);

  // 좋아요/싫어요 토글 핸들러
  const handleThumbUpClick = () => {
    if (!isLoggedIn) return setIsLoginModalOpen(true);
    setLikes(prev => ({ ...prev, [currentIdx]: !prev[currentIdx] }));
    setDislikes(prev => ({ ...prev, [currentIdx]: false }));
  };
  const handleThumbDownClick = () => {
    if (!isLoggedIn) return setIsLoginModalOpen(true);
    setDislikes(prev => ({ ...prev, [currentIdx]: !prev[currentIdx] }));
    setLikes(prev => ({ ...prev, [currentIdx]: false }));
  };

  // 폴더 관련
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

  // 현재 영상
  const video = shorts[currentIdx];

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.searchbar}>
          <input type="text" className={styles.searchInput} placeholder="검색..." />
        </div>

        <div className={styles.mainContent}>
          <div className={styles.contentWrap}>
            <div className={styles.shortVideo}>
              {video && video.id?.videoId ? (
                <iframe
                  width="470"
                  height="720"
                  src={`https://www.youtube.com/embed/${video.id.videoId}?autoplay=1`}
                  title={video.snippet?.title || ""}
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
