import { useState } from "react";
import styles from "../../assets/styles/ShortsVideoPage.module.css";
import Header from "../../components/Header/Header";

function ShortsVideoPage() {
  // 로그인 상태 (예시: false면 미로그인 상태)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [thumbUp, setThumbUp] = useState("/src/assets/images/b_thumbup.png");
  const [thumbDown, setThumbDown] = useState("/src/assets/images/b_thumbdowm.png");
  const [star, setStar] = useState("/src/assets/images/b_star.png");

  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);

  // 로그인 유도 모달 상태
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleThumbUpClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      setIsFolderOpen(false);
      return;
    }
    setThumbUp(prev =>
      prev === "/src/assets/images/b_thumbup.png"
        ? "/src/assets/images/thumbup.png"
        : "/src/assets/images/b_thumbup.png"
    );
  };

  const handleThumbDownClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      setIsFolderOpen(false);
      return;
    }
    setThumbDown(prev =>
      prev === "/src/assets/images/b_thumbdowm.png"
        ? "/src/assets/images/thumbdowm.png"
        : "/src/assets/images/b_thumbdowm.png"
    );
  };

  // 별 클릭하면 폴더 모달 토글 (로그인 체크)
  const handleStarClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      setIsFolderOpen(false);
      return;
    }
    setIsFolderOpen(prev => !prev);
  };

  // 폴더 추가
  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      setFolders(prev => [...prev, newFolderName.trim()]);
      setNewFolderName("");
    }
  };

  // 폴더 클릭 → 별 노란색, 체크 표시
  const handleFolderClick = folderName => {
    setSelectedFolder(folderName);
    setStar("/src/assets/images/star.png");
    setIsFolderOpen(false);
  };

  // 로그인 모달 닫기
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  // 로그인 모달 내 로그인 버튼 클릭 (예시: 로그인 처리)
  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.searchbar}>
          {/* 검색 기능 구현 시 input 및 관련 로직 추가 */}
          <input type="text" className={styles.searchInput} placeholder="검색..." />
        </div>

        <div className={styles.mainContent}>
          <div className={styles.contentWrap}>
            <div className={styles.shortVideo}>
              <p style={{ textAlign: "center", marginTop: "50%" }}>영상 플레이어 영역</p>
            </div>
            <div className={styles.reactionWrap}>
              <ul>
                <li>
                  <img
                    src={thumbUp}
                    alt="thumbUp"
                    onClick={handleThumbUpClick}
                    className={styles.reactionIcon}
                  />
                </li>
                <li>
                  <img
                    src={thumbDown}
                    alt="thumbDown"
                    onClick={handleThumbDownClick}
                    className={styles.reactionIcon}
                  />
                </li>
                <li>
                  <img
                    src={star}
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
                <img src="/src/assets/images/arrow.png" alt="up" className={styles.arrowTop} />
              </li>
              <li>
                <img src="/src/assets/images/arrow.png" alt="down" className={styles.arrowBottom} />
              </li>
            </ul>
          </div>

          {isLoggedIn && isFolderModalOpen && (
            <div className={styles.folderModal}>
              <div className={styles.folderInputWrap}>
                <input
                  type="text"
                  className={styles.folderInput}
                  placeholder="새 폴더 이름 (최대 10자)"
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value.slice(0, 10))} // 글자 수 제한
                  maxLength={10}
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
                      key={folder.folderId}
                      className={styles.folderItem}
                      onClick={() => handleFolderItemClick(folder)}
                    >
                      {/* <img src={folderIconImg} alt="folder" className={styles.folderIcon} /> */}
                      <span className={styles.folderName}>{folder.folderName}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {isLoginModalOpen && (
        <div className={styles.loginModalOverlay} onClick={closeLoginModal}>
          <div className={styles.loginModal} onClick={e => e.stopPropagation()}>
            <h2>로그인이 필요합니다</h2>
            <p>이 기능을 사용하려면 로그인을 해주세요.</p>
            <button onClick={handleNavigateToLogin} className={styles.loginModalButton}>로그인 페이지로 이동</button>
            <button onClick={closeLoginModal} className={`${styles.loginModalButton} ${styles.closeButton}`}>닫기</button>
          </div>
        </div>
      )}
    </>
  );
}

export default ShortsVideoPage;