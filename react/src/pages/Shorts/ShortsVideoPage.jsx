import { Link, useNavigate } from "react-router-dom";
import styles from "../../assets/styles/ShortsVideoPage.module.css";
import Header from "../../components/Header/Header";
import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";

import bThumbUpIcon from "../../assets/images/b_thumbup.png";
import thumbUpIconFilled from "../../assets/images/thumbup.png";
import bThumbDownIcon from "../../assets/images/b_thumbdown.png";
import thumbDownIconFilled from "../../assets/images/thumbdown.png";
import bStarIcon from "../../assets/images/b_star.png";
import starIconFilled from "../../assets/images/star.png";
import arrowIcon from "../../assets/images/arrow.png";
// import folderIconImg from "../../assets/images/folder_icon.png"; // 실제 파일이 있다면 주석 해제

function ShortsVideoPage({ currentVideoId = "defaultVideoId_from_props" }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [thumbUp, setThumbUp] = useState(bThumbUpIcon);
  const [thumbDown, setThumbDown] = useState(bThumbDownIcon);
  const [star, setStar] = useState(bStarIcon);

  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState(null); // 이 상태가 사용되는지 확인 필요

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    // Reset star icon if video changes or login status changes
    setStar(bStarIcon); // 영상이 바뀌면 북마크 상태 초기화 (필요시 API 호출로 실제 북마크 상태 반영)
  }, [currentVideoId]); // currentVideoId 변경 시 로그인 상태 및 아이콘 상태 재확인

  const fetchFolders = async () => {
    if (!isLoggedIn) return;
    try {
      console.log("[ShortsPage] API CALL: GET /folder (폴더 목록 가져오기)");
      const response = await apiClient.get("/folder");
      setFolders(response.data || []);
      console.log("[ShortsPage] 가져온 폴더 목록:", response.data);
    } catch (error) {
      console.error("[ShortsPage] 폴더 목록 가져오기 실패:", error.response?.data || error.message);
      alert("폴더 목록을 가져오는데 실패했습니다. 다시 시도해주세요.");
      setFolders([]);
    }
  };

  const handleStarClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      setIsFolderModalOpen(false); // 로그인 필요 시 폴더 모달은 닫음
      return;
    }
    const newModalState = !isFolderModalOpen;
    setIsFolderModalOpen(newModalState);
    if (newModalState) {
      fetchFolders(); // 폴더 모달이 열릴 때 폴더 목록 가져오기
    }
  };

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) {
      alert("새 폴더 이름을 입력해주세요.");
      return;
    }
    if (!isLoggedIn) {
        alert("폴더를 추가하려면 로그인이 필요합니다.");
        setIsLoginModalOpen(true);
        return;
    }
    try {
      console.log("[ShortsPage] API CALL: POST /folder, data:", { folderName: newFolderName.trim() });
      const response = await apiClient.post("/folder", { folderName: newFolderName.trim() });
      // 서버 응답이 새 폴더 객체라고 가정하고, 기존 방식대로 맨 뒤에 추가 또는 맨 앞에 추가
      // 현재는 맨 뒤에 추가하는 방식:
      // setFolders(prevFolders => [...prevFolders, response.data]);
      // 만약 맨 앞에 추가하고 싶다면:
      setFolders(prevFolders => [response.data, ...prevFolders]);
      setNewFolderName("");
      alert("새 폴더가 추가되었습니다.");
    } catch (error) {
      console.error("[ShortsPage] 새 폴더 추가 실패:", error.response?.data || error.message);
      alert(`새 폴더 추가에 실패했습니다: ${error.response?.data?.message || '알 수 없는 서버 오류입니다.'}`);
    }
  };

  const handleFolderItemClick = async (folder) => {
    if (!currentVideoId) {
      alert("현재 영상 정보를 알 수 없습니다. 페이지를 새로고침 해주세요.");
      return;
    }
    if (!isLoggedIn) {
        alert("영상을 저장하려면 로그인이 필요합니다.");
        setIsLoginModalOpen(true);
        return;
    }
    // setSelectedFolderId(folder.folderId); // API 호출 시 folderId를 직접 사용하므로, 이 상태는 UI 피드백용이 아니라면 불필요할 수 있음

    try {
      console.log(`[ShortsPage] API CALL: POST /bookmark, data: videoId=${currentVideoId}, folderId=${folder.folderId}`);
      await apiClient.post("/bookmark", {
        videoId: currentVideoId, // 실제 비디오 ID props 또는 상태에서 가져와야 함
        folderId: folder.folderId,
      });
      setStar(starIconFilled); // 북마크 성공 시 아이콘 변경
      setIsFolderModalOpen(false); // 폴더 모달 닫기
      alert(`'${folder.folderName}' 폴더에 영상이 성공적으로 저장되었습니다!`);
    } catch (error) {
      console.error("[ShortsPage] 영상 저장(북마크) 실패:", error.response?.data || error.message);
      alert(`영상 저장에 실패했습니다: ${error.response?.data?.message || '알 수 없는 서버 오류입니다.'}`);
      // 실패 시 setStar(bStarIcon); 등으로 아이콘 원래대로 돌리는 처리도 고려 가능
    }
  };

  const handleThumbUpClick = () => {
    if (!isLoggedIn) { 
      setIsLoginModalOpen(true); 
      setIsFolderModalOpen(false); // 다른 모달 닫기
      return; 
    }
    // 실제 좋아요 API 호출 및 상태 업데이트 로직 필요
    setThumbUp(prev => (prev === bThumbUpIcon ? thumbUpIconFilled : bThumbUpIcon));
    console.log("Thumb Up clicked, Video ID:", currentVideoId);
  };

  const handleThumbDownClick = () => {
    if (!isLoggedIn) { 
      setIsLoginModalOpen(true); 
      setIsFolderModalOpen(false); // 다른 모달 닫기
      return; 
    }
    // 실제 싫어요 API 호출 및 상태 업데이트 로직 필요
    setThumbDown(prev => (prev === bThumbDownIcon ? thumbDownIconFilled : bThumbDownIcon));
    console.log("Thumb Down clicked, Video ID:", currentVideoId);
  };

  const closeLoginModal = () => setIsLoginModalOpen(false);

  const handleNavigateToLogin = () => {
    navigate("/login");
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
              {/* 실제 비디오 플레이어 컴포넌트가 여기에 위치할 수 있습니다. */}
              <p style={{ textAlign: "center", marginTop: "50%" }}>
                영상 플레이어 영역 (ID: {currentVideoId})
              </p>
            </div>
            <div className={styles.reactionWrap}>
              <ul>
                <li><img src={thumbUp} alt="Thumb Up" onClick={handleThumbUpClick} className={styles.reactionIcon} /></li>
                <li><img src={thumbDown} alt="Thumb Down" onClick={handleThumbDownClick} className={styles.reactionIcon} /></li>
                <li><img src={star} alt="Star/Bookmark" onClick={handleStarClick} className={styles.reactionIcon} /></li>
              </ul>
            </div>
          </div>

          <div className={styles.arrowWrap}>
            {/* 다음/이전 영상 네비게이션 기능 구현 시 로직 추가 */}
            <ul>
              <li><img src={arrowIcon} alt="up" className={styles.arrowTop} /></li>
              <li><img src={arrowIcon} alt="down" className={styles.arrowBottom} /></li>
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