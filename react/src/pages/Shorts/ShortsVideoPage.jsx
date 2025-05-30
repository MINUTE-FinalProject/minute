import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const {videoId:paramVideoId} = useParams(); // URL에서 videoId 파라미터 받음 
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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 로그인이 필요합니다 로그인 버튼 클릭시 로그인 페이지로 이동
  const redirectToLogin = () => {
    setIsLoginModalOpen(false);
    navigate("/login");
  };

  // 좋아요, 싫어요 상태 초기 로드
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!token);
  
    if (token && userId) {
      // 좋아요 불러오기
      axios.get(`/api/v1/auth/${userId}/likes`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const likeMap = {};
        res.data.forEach(video => {
          likeMap[video.videoId] = true;
        });
        setLikes(likeMap);
      })
      .catch(err => {
        console.error("초기 좋아요 불러오기 실패", err);
      });
  
      // 싫어요 불러오기
      axios.get(`/api/v1/auth/${userId}/dislikes`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const dislikeMap = {};
        res.data.forEach(video => {
          console.log("불러온 싫어요 videoId:", video.videoId); 
          dislikeMap[video.videoId] = true;
        });
        console.log("초기 싫어요 맵:", dislikeMap);
        setDislikes(dislikeMap);
      })
      .catch(err => {
        console.error("초기 싫어요 불러오기 실패", err.response?.status, err.response?.data);
      });
    }
  }, []);

  // 영상 API 불러오기 및 필터링
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
      const allItems = [...dbItems, ...apiItems];

       // 싫어요한 영상은 필터링
       let filtered = allItems;
       if (isLoggedIn) {
          filtered = allItems.filter(video => {
           const id = video?.id?.videoId || video?.videoId || null;
           return !dislikes[id];
         });
       }
  
      setShorts(allItems);
     
      // URL 파라미터 videoId가 있으면 해당 영상 인덱스 찾기
      if(paramVideoId) {
        const idx = allItems.findIndex(video => {
          const id = video?.id?.videoId || video?.videoId || video?.youtubeVideoId || null;
          return id === paramVideoId;
        });
        setCurrentIdx(idx !== -1 ? idx : 0);
      } else {
        setCurrentIdx(0);
      }
    });
  }, [paramVideoId, dislikes, isLoggedIn]);
  
  const filteredShorts = shorts; // 이미 필터링된 shorts를 사용
  const video = filteredShorts[currentIdx];
  const videoId = video?.id?.videoId || video?.videoId || null;

   // 시청 기록 저장
  useEffect(() => {
    if (!isLoggedIn) return;
    if (!filteredShorts.length) return;
  
    
    const video = filteredShorts[currentIdx];
    const videoId = video?.id?.videoId || video?.videoId || null;
    if (!videoId) return;
  
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
  
    axios.post(
      `/api/v1/auth/${userId}/watch-history`,
      { videoId },
      { headers: { Authorization: `Bearer ${token}`,
      "Content-Type": "application/json" } }
    ).catch(err => {
      console.error("시청 기록 저장 실패", err);
    });
  
  }, [currentIdx, shorts, isLoggedIn]);

  // 좋아요 처리
  const handleThumbUpClick = async () => {
    // const video = shorts[currentIdx];
    // const videoId = video?.id?.videoId || null;
  
    if (!videoId || videoId === "null") {
      console.error("videoId가 null이거나 유효하지 않음:", videoId);
      return;
    }
  
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
  
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const isNowLiked = !!likes[videoId];
  
    console.log("좋아요 요청 URL:", `/api/v1/auth/${userId}/videos/${videoId}/like`);
    console.log("현재 videoId:", videoId);
  
    try {
      if (!isNowLiked) {
        await axios.post(
          `/api/v1/auth/${userId}/videos/${videoId}/like`,
          null,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.delete(
          `/api/v1/auth/${userId}/videos/${videoId}/like`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
  
      setLikes(prev => ({ ...prev, [videoId]: !isNowLiked }));
      setDislikes(prev => ({ ...prev, [videoId]: false }));
    } catch (err) {
      console.error("좋아요 API 에러:", err.response?.data || err.message);
    }
  };

  const handleThumbDownClick = async () => {
    if (!videoId) return;
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
  
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const isNowDisliked = !!dislikes[videoId];
    const isNowLiked = !!likes[videoId];
  
    try {
      if (!isNowDisliked) {
        await axios.post(
          `/api/v1/auth/${userId}/videos/${videoId}/dislike`,
          null,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDislikes(prev => ({ ...prev, [videoId]: true }));
        if (isNowLiked) {
          setLikes(prev => ({ ...prev, [videoId]: false }));
        }
      } else {
        await axios.delete(
          `/api/v1/auth/${userId}/videos/${videoId}/dislike`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDislikes(prev => ({ ...prev, [videoId]: false }));
      }
    } catch (err) {
      console.error("싫어요 API 에러:", err.response?.data || err.message);
    }
  };
  
  // 북마크 클릭
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
  // --- 👆 폴더 클릭 시 영상 저장/해제 기능 수정 종료 ---

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
                  key={videoId} 
                  width="470"
                  height="720"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  title={video.snippet?.title || "short video"}
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
                <li>
                  <img
                    src={videoId && likes[videoId] ? thumbUpIcon : thumbUpOutlinedIcon}
                    alt="thumbUp"
                    onClick={handleThumbUpClick}
                    className={styles.reactionIcon}
                  />
                  {/* <span>{video.likes}</span> 좋아요 숫자 반영할 거 */}
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