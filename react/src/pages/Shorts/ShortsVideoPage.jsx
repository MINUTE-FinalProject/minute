import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import arrowIcon from "../../assets/images/arrow.png";
import starOutlinedIcon from "../../assets/images/b_star.png";
import thumbDownOutlinedIcon from "../../assets/images/b_thumbdowm.png";
import thumbUpOutlinedIcon from "../../assets/images/b_thumbup.png";
import starIcon from "../../assets/images/star.png";
import thumbDownIcon from "../../assets/images/thumbdowm.png";
import thumbUpIcon from "../../assets/images/thumbup.png";
import styles from "../../assets/styles/ShortsVideoPage.module.css";
import Header from "../../components/Header/Header";
import SearchBar from "../../components/MainSearchBar/SearchBar";

function ShortsVideoPage() {
  const { videoId: paramVideoId } = useParams();
  const location = useLocation();

  // 리스트 메모이제이션
  const incomingListFromState = useMemo(() => {
    return location.state?.shorts || location.state?.list || [];
  }, [location.state]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const [currentLikeCount, setCurrentLikeCount] = useState(0);
  const [originalShorts, setOriginalShorts] = useState([]);
  const [currentOriginalIdx, setCurrentOriginalIdx] = useState(0);
  const [bookmarkedVideos, setBookmarkedVideos] = useState({});
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const openToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);

  // 유튜브 플레이어 생성/로드
  useEffect(() => {
    if (!originalShorts.length) {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      return;
    }
    const currentVideoToPlayId =
      originalShorts[currentOriginalIdx]?.id?.videoId ||
      originalShorts[currentOriginalIdx]?.videoId ||
      "";

    function onYouTubeIframeAPIReady() {
      if (!playerContainerRef.current) return;
      if (!currentVideoToPlayId) return;
      if (!playerRef.current) {
        playerRef.current = new window.YT.Player(playerContainerRef.current, {
          videoId: currentVideoToPlayId,
          playerVars: { autoplay: 1, rel: 0, modestbranding: 1, playsinline: 1 },
          events: {
            onReady: (event) => event.target.playVideo(),
            onStateChange: (evt) => {
              if (evt.data === window.YT.PlayerState.ENDED) {
                evt.target.playVideo();
              }
            },
            onError: () => {}, // 사용 안함!
          },
        });
      } else {
        if (
          playerRef.current.loadVideoById &&
          typeof playerRef.current.loadVideoById === "function"
        ) {
          playerRef.current.loadVideoById({ videoId: currentVideoToPlayId });
        }
      }
    }
    if (window.YT && window.YT.Player) {
      onYouTubeIframeAPIReady();
    } else {
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }
  }, [originalShorts, currentOriginalIdx]);

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      delete window.onYouTubeIframeAPIReady;
    };
  }, []);

  // 좋아요/싫어요/북마크 상태 초기화
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const loggedIn = Boolean(token && userId);
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      const headers = { Authorization: `Bearer ${token}` };
      axios
        .get(`/api/v1/auth/${userId}/likes`, { headers })
        .then((res) => {
          const likeMap = {};
          res.data.forEach((video) => {
            likeMap[video.videoId] = true;
          });
          setLikes(likeMap);
        });
      axios
        .get(`/api/v1/auth/${userId}/dislikes`, { headers })
        .then((res) => {
          const dislikeMap = {};
          res.data.forEach((video) => {
            dislikeMap[video.videoId] = true;
          });
          setDislikes(dislikeMap);
        });
      axios
        .get(`/api/bookmarks/user/mine`, { headers })
        .then((res) => {
          const bookmarkMap = {};
          res.data.forEach((videoDto) => {
            bookmarkMap[videoDto.videoId] = true;
          });
          setBookmarkedVideos(bookmarkMap);
        });
    }
  }, []);

  // 1. 영상 목록 세팅(최초 진입시 카드 순서 그대로 세팅)
  useEffect(() => {
    if (Array.isArray(incomingListFromState) && incomingListFromState.length > 0) {
      setOriginalShorts(incomingListFromState);
      let initialIdx = 0;
      if (paramVideoId) {
        const idx = incomingListFromState.findIndex((item) => {
          const id = item?.id?.videoId || item?.videoId || null;
          return id === paramVideoId;
        });
        initialIdx = idx !== -1 ? idx : 0;
      } else if (location.state?.startIdx != null) {
        initialIdx = location.state.startIdx;
      }
      setCurrentOriginalIdx(initialIdx);
      return;
    }
    // fallback: DB + API 목록(잘 안 씀)
    setOriginalShorts([]);
    setCurrentOriginalIdx(0);
  }, [paramVideoId, incomingListFromState, location.state]);

  // 시청 기록/좋아요 수
  useEffect(() => {
    if (!originalShorts.length) return;
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const currentItem = originalShorts[currentOriginalIdx];
    const idToRecord = currentItem?.id?.videoId || currentItem?.videoId || null;
    if (!idToRecord) return;

    if (isLoggedIn && userId && token) {
      axios
        .post(
          `/api/v1/auth/${userId}/watch-history`,
          { videoId: idToRecord },
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        )
        .catch(() => {});
    }
    axios
      .get(userId ? `/api/v1/videos/${idToRecord}?userId=${userId}` : `/api/v1/videos/${idToRecord}`)
      .then((res) => {
        setCurrentLikeCount(res.data.likes || 0);
      })
      .catch(() => {});
  }, [currentOriginalIdx, originalShorts, isLoggedIn]);

  // 좋아요 클릭
  const handleThumbUpClick = () => {
    if (!isLoggedIn) {
      openToast("로그인이 필요합니다");
      return;
    }
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const video = originalShorts[currentOriginalIdx];
    const videoId = video?.id?.videoId || video?.videoId;
    if (!videoId) return;

    if (likes[videoId]) {
      // 좋아요 취소
      axios
        .delete(`/api/v1/auth/${userId}/likes/${videoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setLikes((prev) => ({ ...prev, [videoId]: false }));
          setCurrentLikeCount((count) => (count > 0 ? count - 1 : 0));
          openToast("좋아요를 취소했습니다.");
        });
    } else {
      // 좋아요
      axios
        .post(
          `/api/v1/auth/${userId}/likes`,
          { videoId },
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        )
        .then(() => {
          setLikes((prev) => ({ ...prev, [videoId]: true }));
          setCurrentLikeCount((count) => count + 1);
          openToast("좋아요!");
        });
    }
  };

  // 싫어요 클릭
  const handleThumbDownClick = () => {
    if (!isLoggedIn) {
      openToast("로그인이 필요합니다");
      return;
    }
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const video = originalShorts[currentOriginalIdx];
    const videoId = video?.id?.videoId || video?.videoId;
    if (!videoId) return;

    if (dislikes[videoId]) {
      // 싫어요 취소
      axios
        .delete(`/api/v1/auth/${userId}/dislikes/${videoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setDislikes((prev) => ({ ...prev, [videoId]: false }));
          openToast("관심없음을 취소했습니다.");
        });
    } else {
      // 싫어요
      axios
        .post(
          `/api/v1/auth/${userId}/dislikes`,
          { videoId },
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        )
        .then(() => {
          setDislikes((prev) => ({ ...prev, [videoId]: true }));
          openToast("관심 없음 처리!");
        });
    }
  };

  // 북마크 클릭
  const handleStarClick = () => {
    if (!isLoggedIn) {
      openToast("로그인이 필요합니다");
      return;
    }
    const token = localStorage.getItem("token");
    const video = originalShorts[currentOriginalIdx];
    const videoId = video?.id?.videoId || video?.videoId;
    if (!videoId) return;

    if (bookmarkedVideos[videoId]) {
      // 북마크 해제
      axios
        .delete(`/api/bookmarks/video/${videoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setBookmarkedVideos((prev) => ({ ...prev, [videoId]: false }));
          openToast("북마크 해제!");
        });
    } else {
      // 북마크 추가
      axios
        .post(
          `/api/bookmarks`,
          { videoId },
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        )
        .then(() => {
          setBookmarkedVideos((prev) => ({ ...prev, [videoId]: true }));
          openToast("북마크 추가!");
        });
    }
  };

  // 순환(Loop)되는 handlePrev/handleNext
  const handlePrev = () => {
    if (!originalShorts.length) return;
    setCurrentOriginalIdx((prev) => {
      let newIdx = prev - 1;
      if (newIdx < 0) newIdx = originalShorts.length - 1;
      return newIdx;
    });
  };
  const handleNext = () => {
    if (!originalShorts.length) return;
    setCurrentOriginalIdx((prev) => {
      let newIdx = prev + 1;
      if (newIdx >= originalShorts.length) newIdx = 0;
      return newIdx;
    });
  };

  const videoObj = originalShorts[currentOriginalIdx];
  const currentVideoId = videoObj?.id?.videoId || videoObj?.videoId || null;

  if (!originalShorts.length && !paramVideoId) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <SearchBar showTitle={false} compact className={styles.searchCompact} textboxClassName={styles.textboxCompact} />
          <div className={styles.loadingMessage}>영상 목록을 불러오는 중입니다...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <SearchBar
          showTitle={false}
          compact
          className={styles.searchCompact}
          textboxClassName={styles.textboxCompact}
        />
        <div className={styles.mainContent}>
          <div className={styles.contentWrap}>
            <div
              className={styles.shortVideo}
              id="player-container"
              ref={playerContainerRef}
            ></div>
            <div className={styles.reactionWrap}>
              <ul>
                <li>
                  <img
                    src={currentVideoId && likes[currentVideoId] ? thumbUpIcon : thumbUpOutlinedIcon}
                    alt="thumbUp"
                    onClick={handleThumbUpClick}
                    className={styles.reactionIcon}
                  />
                  {currentLikeCount > 0 ? (
                    <span className={styles.reactionLabel}>
                      {currentLikeCount.toLocaleString()}
                    </span>
                  ) : (
                    <span className={styles.reactionLabel}>좋아요</span>
                  )}
                </li>
                <li>
                  <img
                    src={currentVideoId && dislikes[currentVideoId] ? thumbDownIcon : thumbDownOutlinedIcon}
                    alt="thumbDown"
                    onClick={handleThumbDownClick}
                    className={styles.reactionIcon}
                  />
                  <span className={styles.reactionLabel}>관심 없음</span>
                </li>
                <li>
                  <img
                    src={currentVideoId && bookmarkedVideos[currentVideoId] ? starIcon : starOutlinedIcon}
                    alt="bookmark"
                    onClick={handleStarClick}
                    className={styles.reactionIcon}
                  />
                  <span className={styles.reactionLabel}>북마크</span>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.arrowWrap}>
            <ul>
              <li>
                <img
                  src={arrowIcon}
                  alt="prev"
                  className={styles.arrowTop}
                  onClick={handlePrev}
                />
              </li>
              <li>
                <img
                  src={arrowIcon}
                  alt="next"
                  className={styles.arrowBottom}
                  onClick={handleNext}
                />
              </li>
            </ul>
          </div>
        </div>
        {showToast && (
          <div className={styles.toastWrapper}>
            <div className={styles.toast}>{toastMsg}</div>
          </div>
        )}
      </div>
    </>
  );
}

export default ShortsVideoPage;
