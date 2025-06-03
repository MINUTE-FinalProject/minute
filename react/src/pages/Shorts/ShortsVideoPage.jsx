// src/pages/ShortsVideoPage.jsx

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styles from "../../assets/styles/ShortsVideoPage.module.css";
import Header from "../../components/Header/Header";
import SearchBar from "../../components/MainSearchBar/SearchBar";

// 아이콘 임포트
import arrowIcon from "../../assets/images/arrow.png";
import starOutlinedIcon from "../../assets/images/b_star.png";
import thumbDownOutlinedIcon from "../../assets/images/b_thumbdowm.png";
import thumbUpOutlinedIcon from "../../assets/images/b_thumbup.png";
import starIcon from "../../assets/images/star.png";
import thumbDownIcon from "../../assets/images/thumbdowm.png";
import thumbUpIcon from "../../assets/images/thumbup.png";

function ShortsVideoPage() {
  // 1) URL param에서 videoId를 받아옵니다.
  const { videoId: paramVideoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { origin, list: incomingList } = location.state || {};

  // 2) 로그인 여부
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 3) 좋아요/싫어요 맵
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});

  // ────────────────────────────────────────────────────
  // 4) “원본 숏츠 목록(originalShorts)” + “현재 인덱스(currentOriginalIdx)”
  //────────────────────────────────────────────────────
  const [originalShorts, setOriginalShorts] = useState([]);
  // currentOriginalIdx는 originalShorts의 인덱스(0 ~ originalShorts.length-1)를 가리킵니다.
  const [currentOriginalIdx, setCurrentOriginalIdx] = useState(0);

  // ────────────────────────────────────────────────────
  // 5) 북마크(폴더) 관련 상태
  //────────────────────────────────────────────────────
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);

  // ────────────────────────────────────────────────────
  // 6) 로그인 모달
  //────────────────────────────────────────────────────
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // ────────────────────────────────────────────────────
  // 7) 토스트(간단히 상태 표시)
  //────────────────────────────────────────────────────
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const openToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // ────────────────────────────────────────────────────
  // playerRef: 실제 YT.Player 인스턴스를 담는 ref
  // playerContainerRef: DOM 상의 <div> 컨테이너 ref
  //────────────────────────────────────────────────────
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);

  // ────────────────────────────────────────────────────
  // (A) originalShorts가 로드된 다음에만 YT.Player 생성
  //────────────────────────────────────────────────────
  useEffect(() => {
    // 아직 영상 목록이 없으면 실행하지 않음
    if (!originalShorts.length) return;

    // 콜백: YouTube IFrame API가 준비되면 실행됨
    function onYouTubeIframeAPIReady() {
      // 현재 재생할 videoId
      const initVideoId =
        originalShorts[currentOriginalIdx]?.id?.videoId ||
        originalShorts[currentOriginalIdx]?.videoId ||
        "";

      // 이미 playerRef에 인스턴스가 있으면 다시 생성하지 않음
      if (playerRef.current) return;

      // YT.Player 생성
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId: initVideoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1
        },
        events: {
          onReady: (event) => {
            // 준비되면 바로 재생
            event.target.playVideo();
          },
          onStateChange: (evt) => {
            if (evt.data === window.YT.PlayerState.ENDED) {
              // ENDED 상태가 되면 동일 영상을 다시 재생
              evt.target.playVideo();
            }
          },
          onError: (err) => {
            console.error("YT Player 에러", err);
          },
        },
      });
    }

    // (1) 외부 <script src="https://www.youtube.com/iframe_api"></script> 가 이미 로드되어 있다면 바로 콜백 실행
    if (window.YT && window.YT.Player) {
      onYouTubeIframeAPIReady();
    } else {
      // (2) 아직 로드되지 않은 상태라면 전역 콜백으로 등록
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }

    // 언마운트 시 플레이어 파기
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      delete window.onYouTubeIframeAPIReady;
    };
  }, [originalShorts]); // originalShorts가 채워지는 순간에 한 번 실행

  // ────────────────────────────────────────────────────
  // (B) currentOriginalIdx가 바뀔 때마다: playerRef가 유효하면 loadVideoById만 호출
  //────────────────────────────────────────────────────
  useEffect(() => {
    const nextVideoId =
      originalShorts[currentOriginalIdx]?.id?.videoId ||
      originalShorts[currentOriginalIdx]?.videoId ||
      null;

    if (
      playerRef.current &&
      typeof playerRef.current.loadVideoById === "function" &&
      nextVideoId
    ) {
      // loadVideoById가 자동으로 재생(autoplay=1) 처리
      playerRef.current.loadVideoById({
        videoId: nextVideoId,
        suggestedQuality: "default",
      });
    }
  }, [currentOriginalIdx, originalShorts]);

  // ────────────────────────────────────────────────────
  // 8) 첫 번째 useEffect: 로그인 여부 확인 + 좋아요·싫어요 초기 로드
  //────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const loggedIn = Boolean(token && userId);
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      // (1) 좋아요 상태 가져오기
      axios
        .get(`/api/v1/auth/${userId}/likes`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const likeMap = {};
          res.data.forEach((video) => {
            likeMap[video.videoId] = true;
          });
          setLikes(likeMap);
        })
        .catch((err) => console.error("초기 좋아요 불러오기 실패", err));

      // (2) 싫어요 상태 가져오기
      axios
        .get(`/api/v1/auth/${userId}/dislikes`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const dislikeMap = {};
          res.data.forEach((video) => {
            dislikeMap[video.videoId] = true;
          });
          setDislikes(dislikeMap);
        })
        .catch((err) => console.error("초기 싫어요 불러오기 실패", err));
    }
  }, []);

  // ────────────────────────────────────────────────────
  // 9) 두 번째 useEffect: “원본 숏츠 목록(originalShorts)” 초기 로드
  //    • Main.jsx에서 넘어온 incomingList가 있으면 그대로 사용
  //    • 아니면 DB/API에서 가져오기
  //    • paramVideoId가 있으면 그 인덱스로, 없으면 0으로 세팅
  //────────────────────────────────────────────────────
  useEffect(() => {
    // (1) Main.jsx에서 넘어온 리스트가 배열로 있으면 우선 사용
    if (Array.isArray(incomingList) && incomingList.length) {
      setOriginalShorts(incomingList);

      if (paramVideoId) {
        const idx = incomingList.findIndex((item) => {
          const id = item?.id?.videoId || item?.videoId || null;
          return id === paramVideoId;
        });
        setCurrentOriginalIdx(idx !== -1 ? idx : 0);
      } else {
        setCurrentOriginalIdx(0);
      }
      return;
    }

    // (2) incomingList 없으면, DB/API에서 가져오기
    const dbFetch = fetch(`/api/v1/youtube/db/shorts?maxResults=20`)
      .then((res) => (res.ok ? res.json() : []))
      .catch(() => []);

    const apiFetch = fetch(`/api/v1/youtube/shorts?maxResults=20`)
      .then((res) => (res.ok ? res.json() : []))
      .catch(() => []);

    Promise.all([dbFetch, apiFetch]).then(([dbVideos, apiVideos]) => {
      // DB 결과를 YouTube API와 동일한 형태로 매핑
      const dbItems = Array.isArray(dbVideos)
        ? dbVideos.map((v) => ({
            id: {
              videoId: v.youtubeVideoId || v.videoId || v.youtube_video_id || v.video_id,
            },
            snippet: {
              title: v.title || v.videoTitle || v.video_title,
              description: v.description || v.videoDescription || v.video_description,
              thumbnails: {
                medium: { url: v.thumbnailUrl || v.thumbnail_url },
              },
            },
          }))
        : [];

      // YouTube API 결과 (이미 {id:{videoId}, snippet:{…}} 형태라고 가정)
      const apiItems = Array.isArray(apiVideos) ? apiVideos : [];

      const allItems = [...dbItems, ...apiItems];

     // paramVideoId가 있는데 allItems 안에 없다면, 강제로 맨 앞에 추가
      if (paramVideoId) {
        const idx = allItems.findIndex((item) => {
          const id = item?.id?.videoId || item?.videoId || null;
          return id === paramVideoId;
        });

        if (idx === -1) {
          // “videoId:paramVideoId”만으로 최소한 플레어가 로드되도록 빈 틀 하나 생성
          allItems.unshift({
            id: { videoId: paramVideoId },
            snippet: {
              title: "",
              description: "",
              thumbnails: { medium: { url: "" } },
            },
          });
          setOriginalShorts(allItems);
          setCurrentOriginalIdx(0);
          return;
        } else {
          setOriginalShorts(allItems);
          setCurrentOriginalIdx(idx);
          return;
        }
      }

      // paramVideoId가 없으면 그냥 0으로 세팅
      setOriginalShorts(allItems);
      setCurrentOriginalIdx(0);
    });
  }, [paramVideoId, incomingList]);


  // ────────────────────────────────────────────────────
  // 10) 세 번째 useEffect: “시청 기록 저장”
  //     • isLoggedIn && originalShorts 준비된 상태에서, currentOriginalIdx 변화 시마다 호출
  //────────────────────────────────────────────────────
  useEffect(() => {
    // if (!isLoggedIn) return;
    if (!originalShorts.length) return;

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const id =
      originalShorts[currentOriginalIdx]?.id?.videoId ||
      originalShorts[currentOriginalIdx]?.videoId ||
      null;
    if (!id) return;

    // (1) 로그인 사용자만 시청 기록 저장
    if (isLoggedIn && userId && token) {
    axios
      .post(
        `/api/v1/auth/${userId}/watch-history`,
        { videoId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .catch((err) => console.error("시청 기록 저장 실패", err));
    }
     // (2) 조회수 증가용 GET 요청 (로그인 여부 상관없이 보냄)
      axios
     .get(userId ? `/api/v1/videos/${id}?userId=${userId}` : `/api/v1/videos/${id}`)
     .then((res) => {
       // 증가된 views 값이 포함된 응답 DTO가 돌아옵니다.
       console.log("[조회수 증가 후 DTO]", res.data);
     })
     .catch((err) => {
       console.error("조회수 증가 API 호출 실패", err);
     });
  }, [currentOriginalIdx, originalShorts]);

  // ────────────────────────────────────────────────────
  // 11) 좋아요 클릭 핸들러
  //────────────────────────────────────────────────────
  const handleThumbUpClick = async () => {
    const currentItem = originalShorts[currentOriginalIdx];
    if (!currentItem) return;
    const currentVideoId = currentItem.id?.videoId || currentItem.videoId;
    if (!currentVideoId) return;

    // 로그인 상태 체크
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const isNowLiked = !!likes[currentVideoId];

    try {
      if (!isNowLiked) {
        // 좋아요 추가
        await axios.post(
          `/api/v1/auth/${userId}/videos/${currentVideoId}/like`,
          null,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLikes((prev) => ({ ...prev, [currentVideoId]: true }));

        // 이미 싫어요(관심 없음) 상태였다면 해제
        if (dislikes[currentVideoId]) {
          setDislikes((prev) => {
            const copy = { ...prev };
            delete copy[currentVideoId];
            return copy;
          });
        }
      } else {
        // 좋아요 해제
        await axios.delete(
          `/api/v1/auth/${userId}/videos/${currentVideoId}/like`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLikes((prev) => {
          const copy = { ...prev };
          delete copy[currentVideoId];
          return copy;
        });
      }
    } catch (err) {
      console.error("좋아요 API 에러", err);
    }
  };

  // ────────────────────────────────────────────────────
  // 12) 싫어요 클릭 핸들러 (비파괴적으로 동작)
  //     • 눌러도 즉시 영상이 바뀌지 않고, next/prev로 이동할 때만 필터링
  //────────────────────────────────────────────────────
  const handleThumbDownClick = async () => {
    const currentItem = originalShorts[currentOriginalIdx];
    if (!currentItem) return;
    const currentVideoId = currentItem.id?.videoId || currentItem.videoId;
    if (!currentVideoId) return;

    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const isNowDisliked = !!dislikes[currentVideoId];
    const isNowLiked = !!likes[currentVideoId];

    try {
      if (!isNowDisliked) {
        // 관심 없음 추가
        await axios.post(
          `/api/v1/auth/${userId}/videos/${currentVideoId}/dislike`,
          null,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDislikes((prev) => ({ ...prev, [currentVideoId]: true }));

        // 만약 좋아요가 켜져 있으면, 싫어요 누를 때 좋아요 해제
        if (isNowLiked) {
          setLikes((prev) => {
            const copy = { ...prev };
            delete copy[currentVideoId];
            return copy;
          });
        }

        // openToast("관심 없음 표시됨");
      } else {
        // 관심 없음 해제
        await axios.delete(
          `/api/v1/auth/${userId}/videos/${currentVideoId}/dislike`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDislikes((prev) => {
          const copy = { ...prev };
          delete copy[currentVideoId];
          return copy;
        });
        // openToast("관심 없음 해제됨");
      }
    } catch (err) {
      console.error("싫어요 API 에러", err);
      openToast("오류가 발생했습니다.");
    }
  };

  // ────────────────────────────────────────────────────
  // 13) 북마크(폴더) 클릭 핸들러
  //────────────────────────────────────────────────────
  const handleStarClick = () => {
    const currentItem = originalShorts[currentOriginalIdx];
    if (!currentItem) return;
    const currentVideoId = currentItem.id?.videoId || currentItem.videoId;
    if (!currentVideoId) return;

    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsFolderOpen((prev) => !prev);
  };
  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      setFolders((prev) => [...prev, newFolderName.trim()]);
      setNewFolderName("");
    }
  };
  const handleFolderClick = (name) => {
    setSelectedFolder(name);
    setIsFolderOpen(false);
  };

  // ────────────────────────────────────────────────────
  // 14) “이전 영상” 이동 핸들러
  //     • disliked(관심 없음) 처리된 영상은 건너뛰고, 이전 인덱스 중 첫 번째 비-disliked 영상으로 이동
  //────────────────────────────────────────────────────
  const handlePrev = () => {
    let idx = currentOriginalIdx - 1;
    while (idx >= 0) {
      const id = originalShorts[idx]?.id?.videoId || originalShorts[idx]?.videoId || null;
      if (!dislikes[id]) {
        setCurrentOriginalIdx(idx);
        return;
      }
      idx--;
    }
    // 앞에 더 이상의 비-disliked 영상이 없으면 아무 것도 안 함
  };

  // ────────────────────────────────────────────────────
  // 15) “다음 영상” 이동 핸들러
  //     • disliked(관심 없음) 처리된 영상은 건너뛰고, 다음 인덱스 중 첫 번째 비-disliked 영상으로 이동
  //────────────────────────────────────────────────────
  const handleNext = () => {
    let idx = currentOriginalIdx + 1;
    while (idx < originalShorts.length) {
      const id = originalShorts[idx]?.id?.videoId || originalShorts[idx]?.videoId || null;
      if (!dislikes[id]) {
        setCurrentOriginalIdx(idx);
        return;
      }
      idx++;
    }
    // 뒤쪽에 더 이상의 비-disliked 영상이 없으면 아무 것도 안 함
  };

  // ────────────────────────────────────────────────────
  // 16) 렌더링
  //────────────────────────────────────────────────────
  const videoObj = originalShorts[currentOriginalIdx];
  const currentVideoId =
    videoObj?.id?.videoId ||
    videoObj?.videoId ||
    null;

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
            {/* ── 16-1) YouTube IFrame API가 마운트될 <div> ───────── */}
            <div
              className={styles.shortVideo}
              ref={playerContainerRef} // 이곳에 YT.Player가 삽입됩니다.
            >
              {/* 빈 상태로 두시면 됩니다. useEffect에서 playerRef.current = new YT.Player(...) */}
            </div>

            {/* ── 16-2) 좋아요·싫어요·북마크 버튼 (아이콘 + 레이블) ───── */}
            <div className={styles.reactionWrap}>
              <ul>
                {/* 좋아요 */}
                <li>
                  <img
                    src={
                      currentVideoId && likes[currentVideoId]
                        ? thumbUpIcon
                        : thumbUpOutlinedIcon
                    }
                    alt="thumbUp"
                    onClick={handleThumbUpClick}
                    className={styles.reactionIcon}
                  />
                  <span className={styles.reactionLabel}>좋아요</span>
                </li>

                {/* 관심 없음(싫어요) */}
                <li>
                  <img
                    src={
                      currentVideoId && dislikes[currentVideoId]
                        ? thumbDownIcon
                        : thumbDownOutlinedIcon
                    }
                    alt="thumbDown"
                    onClick={handleThumbDownClick}
                    className={styles.reactionIcon}
                  />
                  <span className={styles.reactionLabel}>관심 없음</span>
                </li>

                {/* 북마크 */}
                <li>
                  <img
                    src={
                      currentVideoId && selectedFolder ? starIcon : starOutlinedIcon
                    }
                    alt="bookmark"
                    onClick={handleStarClick}
                    className={styles.reactionIcon}
                  />
                  <span className={styles.reactionLabel}>북마크</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ── 16-3) 이전/다음 화살표 ──────────────────────────── */}
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

          {/* ── 16-4) 북마크 폴더 모달 ───────────────────────────── */}
          {isFolderOpen && (
            <div className={styles.folderModal} style={{ bottom: "120px" }}>
              <div className={styles.folderInputWrap}>
                <input
                  type="text"
                  className={styles.folderInput}
                  placeholder="새 폴더 이름"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
                <button className={styles.folderBtn} onClick={handleAddFolder}>
                  +
                </button>
              </div>
              <ul className={styles.folderList}>
                {folders.length === 0 ? (
                  <li className={styles.emptyFolder}>폴더가 없습니다.</li>
                ) : (
                  folders.map((name) => (
                    <li
                      key={name}
                      className={styles.folderItem}
                      onClick={() => handleFolderClick(name)}
                    >
                      <span className={styles.folderName}>{name}</span>
                      {selectedFolder === name && (
                        <span className={styles.checkmark}>✔</span>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* ── 16-5) 로그인 유도 모달 ──────────────────────────── */}
        {isLoginModalOpen && (
          <div className={styles.loginModalOverlay} onClick={() => setIsLoginModalOpen(false)}>
            <div className={styles.loginModal} onClick={(e) => e.stopPropagation()}>
              <h2>로그인이 필요합니다</h2>
              <button
                onClick={() =>
                  navigate("/login", {
                    state: { from: location.pathname + location.search },
                  })
                }
              >로그인</button>
            </div>
          </div>
        )}

        {/* ── 16-6) 간단한 토스트 메시지 표시 ───────────────────── */}
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
