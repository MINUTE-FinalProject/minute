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
  const [bookmarkedVideos, setBookmarkedVideos] = useState({}); // { videoId: folderId }
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const redirectToLogin = () => {
    setIsLoginModalOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setIsLoggedIn(!!storedToken);
    if (storedToken) {
      fetchUserFolders();
      if (userId) { // userId는 북마크 및 기타 반응 로드에 사용
        fetchUserReactionsAndBookmarks();
      }
    }
  }, [userId, token]);

  useEffect(() => {
    const dbFetch = fetch(`/api/v1/youtube/db/shorts?maxResults=15`)
      .then(res => res.ok ? res.json() : [])
      .catch(() => { console.error("Error fetching DB shorts"); return []; });
  
    const apiFetch = fetch(`/api/v1/youtube/shorts?maxResults=15`) // 'region' 파라미터 관련 오류 가능성
      .then(res => res.ok ? res.json() : [])
      .catch(() => { console.error("Error fetching API shorts"); return []; });
  
    Promise.all([dbFetch, apiFetch]).then(([dbVideos, apiVideos]) => {
      const dbItems = Array.isArray(dbVideos)
        ? dbVideos.map((v) => ({
            id: { videoId: v.youtubeVideoId || v.videoId || v.youtube_video_id || v.video_id },
            snippet: {
              title: v.title || v.videoTitle || v.video_title,
              description: v.description || v.videoDescription || v.video_description,
              thumbnails: { medium: { url: v.thumbnailUrl || v.thumbnail_url } }
            }
          }))
        : [];
      const apiItems = Array.isArray(apiVideos) ? apiVideos : [];
      const allItems = [...dbItems, ...apiItems].filter(item => item.id && item.id.videoId);
      setShorts(allItems);
      setCurrentIdx(0);
    });
  }, [isLoggedIn]);
  
  const video = shorts[currentIdx];
  const videoId = video?.id?.videoId || null;
  const videoTitle = video?.snippet?.title; // 북마크 시 저장할 제목
  // const thumbnailUrl = video?.snippet?.thumbnails?.medium?.url; // 북마크 시 저장할 썸네일

  const fetchUserFolders = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`/api/folder`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFolders(response.data || []);
    } catch (err) {
      console.error("폴더 목록 API 에러:", err.response?.data || err.message);
      setFolders([]); // 에러 시 빈 배열로 초기화
    }
  };

  const fetchUserReactionsAndBookmarks = async () => {
    if (!userId || !token) return;
    try {
      // 1. 북마크 정보 가져오기 (예시: /api/bookmarks/user/mine)
      // 이 API는 [{videoId: "id1", folderId: 1, ...}, ...] 형태의 배열을 반환한다고 가정
      const bookmarkResponse = await axios.get(`/api/bookmarks/user/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(bookmarkResponse.data)) {
        const newBookmarkedVideos = {};
        bookmarkResponse.data.forEach(bm => {
          if (bm.videoId && bm.folderId) { // videoId와 folderId가 있는지 확인
            newBookmarkedVideos[bm.videoId] = bm.folderId;
          }
        });
        setBookmarkedVideos(newBookmarkedVideos);
        console.log("Fetched and set bookmarked videos:", newBookmarkedVideos);
      } else {
        setBookmarkedVideos({});
      }

      // 2. 좋아요/싫어요 정보 가져오기 (기존 로직, 필요시 API 경로 및 응답 형식 확인)
      // const reactionsResponse = await axios.get(`/api/v1/auth/${userId}/videos/reactions`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // if (reactionsResponse.data) {
      //   setLikes(reactionsResponse.data.likes || {});
      //   setDislikes(reactionsResponse.data.dislikes || {});
      // }
    } catch (err) {
      console.error("사용자 반응 및 북마크 정보 API 에러:", err.response?.data || err.message);
      setBookmarkedVideos({}); // 에러 시 북마크 초기화
      // setLikes({});
      // setDislikes({});
    }
  };

  const handleThumbUpClick = async () => {
    if (!videoId || !userId || !isLoggedIn) { if(!isLoggedIn) setIsLoginModalOpen(true); return; }
    const currentLikes = { ...likes };
    const currentDislikes = { ...dislikes };
    const isNowLiked = !currentLikes[videoId];

    try {
      if (isNowLiked) {
        await axios.post(`/api/v1/auth/${userId}/videos/${videoId}/like`, null, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.delete(`/api/v1/auth/${userId}/videos/${videoId}/like`, { headers: { Authorization: `Bearer ${token}` } });
      }
      currentLikes[videoId] = isNowLiked;
      currentDislikes[videoId] = false; // 좋아요 누르면 싫어요 해제
      setLikes(currentLikes);
      setDislikes(currentDislikes);
    } catch (err) {
      console.error("좋아요 API 에러:", err.response?.data || err.message);
    }
  };

  const handleThumbDownClick = async () => {
    if (!videoId || !userId || !isLoggedIn) { if(!isLoggedIn) setIsLoginModalOpen(true); return; }
    const currentLikes = { ...likes };
    const currentDislikes = { ...dislikes };
    const isNowDisliked = !currentDislikes[videoId];

    try {
      if (isNowDisliked) {
        await axios.post(`/api/v1/auth/${userId}/videos/${videoId}/dislike`, null, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.delete(`/api/v1/auth/${userId}/videos/${videoId}/dislike`,{ headers: { Authorization: `Bearer ${token}` } });
      }
      currentDislikes[videoId] = isNowDisliked;
      currentLikes[videoId] = false; // 싫어요 누르면 좋아요 해제
      setDislikes(currentDislikes);
      setLikes(currentLikes);
    } catch (err) {
      console.error("싫어요 API 에러:", err.response?.data || err.message);
    }
  };

  const handleStarClick = () => {
    if (!videoId || !isLoggedIn) { if(!isLoggedIn) setIsLoginModalOpen(true); return; }
    setIsFolderOpen(prev => !prev);
  };

  const handleAddFolder = async () => {
    if (!newFolderName.trim() || !isLoggedIn || !token) { if(!isLoggedIn) setIsLoginModalOpen(true); return; }
    try {
      const response = await axios.post(`/api/folder`,
        { folderName: newFolderName.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFolders(prev => [...prev, response.data]);
      setNewFolderName("");
    } catch (err) {
      console.error("새 폴더 추가 API 에러:", err.response?.data || err.message);
      alert(err.response?.data?.message || "폴더 생성에 실패했습니다. (이름 중복 등 확인)");
    }
  };

  // --- 👇 폴더 클릭 시 영상 저장/해제 기능 수정 ---
  const handleFolderClick = async (folder) => {
    if (!videoId || !isLoggedIn || !token || !video) {
      if (!isLoggedIn) setIsLoginModalOpen(true);
      return;
    }

    const clickedFolderId = folder.folderId; // 👈 folder.folderId 사용
    const clickedFolderName = folder.folderName; // 👈 folder.folderName 사용

    // folderId나 folderName이 유효한지 다시 한번 확인
    if (typeof clickedFolderId === 'undefined' || typeof clickedFolderName === 'undefined') {
      console.error("클릭된 폴더 정보가 올바르지 않습니다. 폴더 객체:", folder);
      alert("선택된 폴더 정보가 올바르지 않습니다. 페이지를 새로고침하거나 다시 시도해주세요.");
      setIsFolderOpen(false);
      return;
    }

    const currentVideoIsBookmarkedInThisFolder = bookmarkedVideos[videoId] === clickedFolderId;

    console.log(`폴더 클릭: 비디오 ID ${videoId} ('${videoTitle}')`);
    console.log(`클릭된 폴더: ID ${clickedFolderId}, 이름 '${clickedFolderName}'`);
    console.log(`현재 이 비디오가 이 폴더에 북마크되어 있는가? ${currentVideoIsBookmarkedInThisFolder}`);
    console.log(`현재 모든 북마크 상태:`, bookmarkedVideos);


    try {
      if (currentVideoIsBookmarkedInThisFolder) {
        // 이미 이 폴더에 저장되어 있다면 -> 북마크 해제
        console.log(`API 호출: '${videoTitle}' 영상을 '${clickedFolderName}' (ID:${clickedFolderId}) 폴더에서 제거 시도...`);
        await axios.delete(
          `/api/bookmarks/folder/${clickedFolderId}/video/${videoId}`, // 백엔드 BookmarkController 경로
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookmarkedVideos(prev => {
          const updated = { ...prev };
          delete updated[videoId]; // 해당 비디오의 북마크 정보 제거
          return updated;
        });
        console.log(`성공: '${videoTitle}' 영상을 '${clickedFolderName}' 폴더에서 제거했습니다.`);
        alert(`'${videoTitle}' 영상을 '${clickedFolderName}' 폴더에서 제거했습니다.`);

      } else {
        // 이 폴더에 저장되어 있지 않다면 -> 북마크 추가
        console.log(`API 호출: '${videoTitle}' 영상을 '${clickedFolderName}' (ID:${clickedFolderId}) 폴더에 저장 시도...`);
        const requestBody = {
            folderId: clickedFolderId,
            videoId: videoId,
            // 만약 Bookmark 엔티티 및 BookmarkCreateRequestDTO에 videoTitle, thumbnailUrl을 저장한다면:
            // videoTitle: videoTitle, 
            // thumbnailUrl: thumbnailUrl
        };
        const response = await axios.post(
          `/api/bookmarks`, // 백엔드 BookmarkController 경로
          requestBody,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // 백엔드에서 생성된 북마크 정보(bookmarkId 포함)로 상태 업데이트
        setBookmarkedVideos(prev => ({ ...prev, [videoId]: response.data.folderId }));
        console.log(`성공: '${videoTitle}' 영상을 '${clickedFolderName}' 폴더에 저장했습니다. 응답:`, response.data);
        alert(`'${videoTitle}' 영상을 '${clickedFolderName}' 폴더에 저장했습니다.`);
      }
      setIsFolderOpen(false); // 폴더 선택 후 모달 닫기
    } catch (err) {
      console.error("영상 폴더 저장/해제 API 에러:", err.response?.data || err.message, err.response);
      alert(err.response?.data?.message || "영상 저장/해제 중 오류가 발생했습니다.");
      setIsFolderOpen(false); // 오류 발생 시에도 모달은 닫도록 처리
    }
  };
  // --- 👆 폴더 클릭 시 영상 저장/해제 기능 수정 종료 ---

  const handlePrev = () => setCurrentIdx(idx => Math.max(idx - 1, 0));
  const handleNext = () => setCurrentIdx(idx => Math.min(idx + 1, shorts.length - 1));

  const closeLoginModal = () => setIsLoginModalOpen(false);

  const currentVideoBookmarkFolderId = videoId ? bookmarkedVideos[videoId] : null;

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
                  key={videoId} 
                  width="470"
                  height="720"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  title={videoTitle || "short video"}
                  frameBorder="0"
                  allow="autoplay; encrypted-media; accelerometer; clipboard-write; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: 18, boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}
                />
              ) : (
                <p style={{ textAlign: 'center', marginTop: '50%' }}>영상이 없습니다.</p>
              )}
            </div>
            <div className={styles.reactionWrap}>
              <ul>
                <li> <img src={videoId && likes[videoId] ? thumbUpIcon : thumbUpOutlinedIcon} alt="thumbUp" onClick={handleThumbUpClick} className={styles.reactionIcon} /> </li>
                <li> <img src={videoId && dislikes[videoId] ? thumbDownIcon : thumbDownOutlinedIcon} alt="thumbDown" onClick={handleThumbDownClick} className={styles.reactionIcon} /> </li>
                <li> <img src={videoId && currentVideoBookmarkFolderId ? starIcon : starOutlinedIcon} alt="bookmark" onClick={handleStarClick} className={styles.reactionIcon} /> </li>
              </ul>
            </div>
          </div>
          <div className={styles.arrowWrap}>
            {shorts.length > 1 && currentIdx > 0 && (
              <li> <img src={arrowIcon} alt="prev" className={styles.arrowTop} onClick={handlePrev} /> </li>
            )}
             {shorts.length > 1 && currentIdx < shorts.length - 1 && (
               <li> <img src={arrowIcon} alt="next" className={styles.arrowBottom} onClick={handleNext} /> </li>
            )}
          </div>
          {isFolderOpen && videoId && (
            <div className={styles.folderModal} style={{ bottom: '120px' }}>
              <div className={styles.folderInputWrap}>
                <input type="text" className={styles.folderInput} placeholder="새 폴더 이름" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} />
                <button className={styles.folderBtn} onClick={handleAddFolder}>+</button>
              </div>
              <ul className={styles.folderList}>
                {folders.length === 0 ? (
                  <li className={styles.emptyFolder}>폴더가 없습니다.</li>
                ) : (
                  folders.map(folder => (
                    <li key={folder.folderId} className={styles.folderItem} onClick={() => handleFolderClick(folder)}>
                      <span className={styles.folderName}>{folder.folderName}</span>
                      {currentVideoBookmarkFolderId === folder.folderId && <span className={styles.checkmark}>✔</span>}
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