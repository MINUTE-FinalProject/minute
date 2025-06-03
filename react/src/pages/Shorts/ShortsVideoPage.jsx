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
  // location.state가 undefined일 수 있으므로 || {} 로 기본값 처리
  const { origin: pageOriginFromState, list: incomingListFromState } = location.state || {};

  // 2) 로그인 여부
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 3) 좋아요/싫어요 맵
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});

  // 현재 재생 중인 영상의 좋아요 개수
  const [currentLikeCount, setCurrentLikeCount] = useState(0);

  // ────────────────────────────────────────────────────
  // 4) “원본 숏츠 목록(originalShorts)” + “현재 인덱스(currentOriginalIdx)”
  //    originalShorts는 현재 플레이어가 사용할 영상 목록 (메인 페이지 목록 또는 북마크 목록 등)
  //────────────────────────────────────────────────────
  const [originalShorts, setOriginalShorts] = useState([]);
  // currentOriginalIdx는 originalShorts의 인덱스(0 ~ originalShorts.length-1)를 가리킵니다.
  const [currentOriginalIdx, setCurrentOriginalIdx] = useState(0);

  // ────────────────────────────────────────────────────
  // 5) 북마크(폴더) 관련 상태
  //────────────────────────────────────────────────────
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [folders, setFolders] = useState([]); // 폴더 목록 상태 {folderId, folderName}
  const [newFolderName, setNewFolderName] = useState("");
  const [bookmarkedVideos, setBookmarkedVideos] = useState({}); // 북마크된 비디오 ID 맵 { [videoId]: true }

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
  // (A) originalShorts 목록이 준비되거나 변경되면 YT.Player 생성 또는 비디오 로드
  //────────────────────────────────────────────────────
  useEffect(() => {
    console.log("DEBUG: useEffect[A] - originalShorts 상태 변경 감지:", JSON.parse(JSON.stringify(originalShorts)));
    if (!originalShorts.length) {
      console.log("DEBUG: useEffect[A] - originalShorts가 비어있어 플레이어 관련 작업 안함.");
      // 플레이어가 이미 생성된 상태에서 originalShorts가 비워졌다면 플레이어 파괴
      if (playerRef.current) {
        console.log("DEBUG: useEffect[A] - originalShorts가 비워져서 기존 플레이어 파괴 시도.");
        playerRef.current.destroy();
        playerRef.current = null;
      }
      return;
    }

    // 현재 재생할 videoId 결정 (originalShorts와 currentOriginalIdx 기반)
    const currentVideoToPlayId =
        originalShorts[currentOriginalIdx]?.id?.videoId || // YouTube API 응답 형식
        originalShorts[currentOriginalIdx]?.videoId ||      // VideoResponseDTO 형식
        "";

    console.log("DEBUG: useEffect[A] - 현재 재생할 Video ID:", currentVideoToPlayId, "현재 인덱스:", currentOriginalIdx);

    // YouTube IFrame API 콜백 함수
    function onYouTubeIframeAPIReady() {
      console.log("DEBUG: useEffect[A] - onYouTubeIframeAPIReady 실행됨.");
      if (!playerContainerRef.current) {
        console.error("DEBUG: useEffect[A] - 플레이어 컨테이너 DOM이 없습니다! 플레이어 생성 불가.");
        return;
      }
      if (!currentVideoToPlayId) {
        console.warn("DEBUG: useEffect[A] - 재생할 Video ID가 없습니다. 플레이어 생성/로드 안함.");
        return;
      }

      // 플레이어 인스턴스가 없으면 새로 생성
      if (!playerRef.current) {
        console.log("DEBUG: useEffect[A] - 새 YT.Player 생성:", currentVideoToPlayId);
        playerRef.current = new window.YT.Player(playerContainerRef.current, {
          videoId: currentVideoToPlayId,
          playerVars: { autoplay: 1, rel: 0, modestbranding: 1, playsinline: 1 },
          events: {
            onReady: (event) => {
              console.log("DEBUG: useEffect[A] - 플레이어 onReady. 비디오 재생.");
              event.target.playVideo();
            },
            onStateChange: (evt) => {
              if (evt.data === window.YT.PlayerState.ENDED) {
                console.log("DEBUG: useEffect[A] - 영상 종료, 다시 재생.");
                evt.target.playVideo();
              }
            },
            onError: (err) => console.error("YT Player 에러", err),
          },
        });
      } else {
        // 플레이어 인스턴스가 이미 있으면, 현재 비디오 ID로 로드
        // (useEffect[B]에서도 처리하지만, originalShorts가 바뀌었을 때도 대응하기 위함)
        console.log("DEBUG: useEffect[A] - 기존 플레이어에 새 비디오 로드:", currentVideoToPlayId);
        if (playerRef.current.loadVideoById && typeof playerRef.current.loadVideoById === "function") {
           playerRef.current.loadVideoById({ videoId: currentVideoToPlayId });
        }
      }
    }

    if (window.YT && window.YT.Player) {
      console.log("DEBUG: useEffect[A] - YT API 이미 준비됨. onYouTubeIframeAPIReady 직접 호출.");
      onYouTubeIframeAPIReady();
    } else {
      console.log("DEBUG: useEffect[A] - YT API 아직 준비 안됨. 전역 콜백으로 등록.");
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }

    return () => {
      // 이 useEffect는 originalShorts가 바뀔때마다 실행되므로,
      // 여기서 플레이어를 파괴하면 목록이 바뀔 때마다 플레이어가 깜빡일 수 있음.
      // 컴포넌트가 완전히 언마운트될 때만 파괴하는 것이 일반적.
      // console.log("DEBUG: useEffect[A] - 클린업 실행 (originalShorts 변경 시)");
      // if (playerRef.current) {
      //   playerRef.current.destroy();
      //   playerRef.current = null;
      // }
      // delete window.onYouTubeIframeAPIReady; // 전역 콜백 해제는 언마운트 시에만
    };
  }, [originalShorts]); // originalShorts 목록 자체가 바뀔 때 (예: 북마크 목록 -> 추천 목록)

  // 컴포넌트 언마운트 시 플레이어 정리 (메모리 누수 방지)
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        console.log("DEBUG: ShortsVideoPage 언마운트 - 플레이어 파괴");
        playerRef.current.destroy();
        playerRef.current = null;
      }
      delete window.onYouTubeIframeAPIReady; // 전역 콜백 확실히 해제
    };
  }, []);


  // ────────────────────────────────────────────────────
  // (B) currentOriginalIdx가 바뀔 때마다: playerRef가 유효하면 loadVideoById만 호출
  //────────────────────────────────────────────────────
  useEffect(() => {
    console.log("DEBUG: useEffect[B] - currentOriginalIdx 변경 감지:", currentOriginalIdx);
    if (!originalShorts.length || currentOriginalIdx < 0 || currentOriginalIdx >= originalShorts.length) {
      console.log("DEBUG: useEffect[B] - originalShorts가 비었거나 인덱스가 유효하지 않아 비디오 로드 안함.");
      return;
    }

    const nextVideoId =
      originalShorts[currentOriginalIdx]?.id?.videoId || // YouTube API 응답 형식
      originalShorts[currentOriginalIdx]?.videoId ||      // VideoResponseDTO 형식
      null;

    console.log("DEBUG: useEffect[B] - 다음 재생할 Video ID:", nextVideoId);

    if (playerRef.current && typeof playerRef.current.loadVideoById === "function" && nextVideoId) {
      console.log("DEBUG: useEffect[B] - loadVideoById 호출:", nextVideoId);
      playerRef.current.loadVideoById({ videoId: nextVideoId });
    } else {
      console.log(
        "DEBUG: useEffect[B] - 플레이어가 준비되지 않았거나 다음 Video ID가 없어 로드 안함.",
        "Player Ready:", !!(playerRef.current && typeof playerRef.current.loadVideoById === "function"),
        "Next Video ID:", nextVideoId
      );
    }
  }, [currentOriginalIdx]); // currentOriginalIdx가 바뀔 때만 실행 (originalShorts는 이미 useEffect[A]에서 처리)


  // ────────────────────────────────────────────────────
  // 8) 첫 번째 useEffect: 로그인 여부 확인 + 좋아요·싫어요·북마크 초기 로드
  //────────────────────────────────────────────────────
  useEffect(() => {
    console.log("DEBUG: useEffect[8] - 초기 상태 로드 (로그인, 좋아요 등)");
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
          res.data.forEach((video) => { likeMap[video.videoId] = true; });
          setLikes(likeMap);
        })
        .catch((err) => console.error("초기 좋아요 불러오기 실패", err));

      axios
        .get(`/api/v1/auth/${userId}/dislikes`, { headers })
        .then((res) => {
          const dislikeMap = {};
          res.data.forEach((video) => { dislikeMap[video.videoId] = true; });
          setDislikes(dislikeMap);
        })
        .catch((err) => console.error("초기 싫어요 불러오기 실패", err));

      axios
        .get(`/api/bookmarks/user/mine`, { headers }) // 북마크 목록 API
        .then((res) => {
          const bookmarkMap = {};
          // res.data는 이제 VideoResponseDTO[] 형태임. videoId를 사용해야 함.
          res.data.forEach((videoDto) => { // bookmark 객체가 아닌 videoDto 객체
            bookmarkMap[videoDto.videoId] = true;
          });
          setBookmarkedVideos(bookmarkMap);
          console.log("DEBUG: useEffect[8] - 초기 북마크 상태 로드 완료:", bookmarkMap);
        })
        .catch((err) => console.error("초기 북마크 불러오기 실패", err));
    }
  }, []); // 마운트 시 한 번만 실행

  // ────────────────────────────────────────────────────
  // 9) 두 번째 useEffect: “원본 숏츠 목록(originalShorts)” 초기 로드
  //    이 useEffect는 paramVideoId나 location.state (incomingListFromState, pageOriginFromState)가 바뀔 때 실행
  //────────────────────────────────────────────────────
  useEffect(() => {
    console.log("DEBUG: useEffect[9] - 페이지 진입 또는 상태 변경으로 영상 목록 설정 시작.");
    console.log("DEBUG: useEffect[9] - paramVideoId:", paramVideoId);
    console.log("DEBUG: useEffect[9] - location.state (pageOriginFromState):", pageOriginFromState);
    console.log("DEBUG: useEffect[9] - location.state (incomingListFromState):", JSON.parse(JSON.stringify(incomingListFromState)));


    if (Array.isArray(incomingListFromState) && incomingListFromState.length > 0) {
      console.log("DEBUG: useEffect[9] - incomingListFromState 사용. Origin:", pageOriginFromState);
      setOriginalShorts(incomingListFromState); // ★★★ 여기가 핵심: 북마크 목록이 originalShorts가 됨

      let initialIdx = 0;
      if (paramVideoId) {
        const idx = incomingListFromState.findIndex((item) => {
          const id = item?.id?.videoId || item?.videoId || null; // VideoResponseDTO는 item.videoId로 접근
          return id === paramVideoId;
        });
        initialIdx = idx !== -1 ? idx : 0;
      }
      console.log("DEBUG: useEffect[9] - incomingList 사용 시, 계산된 initialIdx:", initialIdx);
      // setCurrentOriginalIdx를 여기서 바로 호출하면 useEffect[B]가 즉시 반응.
      // originalShorts가 세팅된 후 플레이어가 생성/로드되도록 useEffect[A]와 useEffect[B]의 순서를 고려해야 함.
      // 만약 currentOriginalIdx가 이미 initialIdx와 같다면, useEffect[B]가 실행되지 않을 수 있으므로,
      // 비디오를 명시적으로 로드하거나, 인덱스를 잠시 다른 값으로 바꿨다가 돌리는 트릭이 필요할 수 있음.
      // 그러나 대부분의 경우, originalShorts가 바뀌면 useEffect[A]가, idx가 바뀌면 useEffect[B]가 순차적으로 잘 동작함.
      if (currentOriginalIdx !== initialIdx) {
        setCurrentOriginalIdx(initialIdx);
      } else if (originalShorts.length > 0 && playerRef.current && playerRef.current.loadVideoById) {
        // 인덱스가 같고, 목록이 있고, 플레이어가 준비되었으면 현재 비디오 강제 로드 (플레이어가 생성된 후여야 함)
         const videoToLoad = incomingListFromState[initialIdx]?.id?.videoId || incomingListFromState[initialIdx]?.videoId;
         if (videoToLoad) {
            console.log("DEBUG: useEffect[9] - 인덱스 동일, 강제 비디오 로드:", videoToLoad);
            // playerRef.current.loadVideoById({ videoId: videoToLoad }); // useEffect[B]가 처리하도록 유도하는 것이 나을 수 있음
         }
      }
      return; // incomingList 사용했으므로 아래 fallback 로직 실행 안 함
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
        ? dbVideos.map((v) => ({ // DB 응답이 VideoResponseDTO와 유사한 형태라고 가정
            videoId: v.youtubeVideoId || v.videoId || v.youtube_video_id, // VideoResponseDTO의 videoId 사용
            videoTitle: v.title || v.videoTitle || v.video_title,
            // VideoResponseDTO의 다른 필드들도 필요에 따라 매핑
            // 이 부분은 서버에서 오는 /api/v1/youtube/db/shorts 응답 구조에 맞춰야 합니다.
            // 지금은 VideoResponseDTO와 유사하다고 가정하고, videoId와 videoTitle만 간단히 매핑합니다.
            // snippet, id.videoId 형태가 아니므로 직접 접근합니다.
          }))
        : [];
      
      // const apiItems = Array.isArray(apiVideos) ? apiVideos : []; // YouTube API 직접 호출 시
      // const allItems = [...dbItems, ...apiItems];

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
  //────────────────────────────────────────────────────
  useEffect(() => {
    // if (!isLoggedIn) return;
    if (!originalShorts.length) return;

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const currentItem = originalShorts[currentOriginalIdx];
    const idToRecord = currentItem?.id?.videoId || currentItem?.videoId || null;

    if (!idToRecord || !userId || !token) return;
    console.log("DEBUG: useEffect[10] - 시청 기록 저장 시도:", idToRecord);

    // (1) 로그인 사용자만 시청 기록 저장
    if (isLoggedIn && userId && token) {
    axios
      .post(
        `/api/v1/auth/${userId}/watch-history`,
        { videoId: idToRecord },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      )
      .catch((err) => console.error("시청 기록 저장 실패", err));
    }
     // (2) 조회수 증가 + 좋아요 개수까지 같이 내려주는 GET 요청
     axios
          .get(userId ? `/api/v1/videos/${id}?userId=${userId}` : `/api/v1/videos/${id}`)
          .then((res) => {
            // res.data에 { videoId, videoTitle, …, views, likes, … } 형태로 온다고 가정
            const dto = res.data;
            // 좋아요 개수 저장
            setCurrentLikeCount(dto.likes || 0);
          })
          .catch((err) => {
            console.error("조회수 증가 + 좋아요 개수 API 호출 실패", err);
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
    const token  = localStorage.getItem("token");
    const isNowLiked = !!likes[currentVideoId];
    const isNowDisliked = !!dislikes[currentVideoId];

    try {
      if (!isNowLiked) {
        // ── (A) UI: 좋아요 바로 추가 & 좋아요 개수 +1 ──
        setLikes(prev => ({ ...prev, [currentVideoId]: true }));
        setCurrentLikeCount(prev => prev + 1);

        // (B) API: 실제 좋아요 등록 요청
        await axios.post(
          `/api/v1/auth/${userId}/videos/${currentVideoId}/like`,
          null,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // ── (C) 만약 이전에 싫어요 상태였다면, 싫어요 해제 및 (옵션) 좋아요 개수 조정 ──
        if (isNowDisliked) {
          setDislikes(prev => {
            const copy = { ...prev };
            delete copy[currentVideoId];
            return copy;
          });
        }
        } else {
          // ── (A) UI: 좋아요 해제 & 좋아요 개수 -1 ──
          setLikes(prev => {
            const copy = { ...prev };
            delete copy[currentVideoId];
            return copy;
          });
          setCurrentLikeCount(prev => (prev > 0 ? prev - 1 : 0));

          // (B) API: 실제 좋아요 취소 요청
          await axios.delete(
            `/api/v1/auth/${userId}/videos/${currentVideoId}/like`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      } catch (err) {
        console.error("좋아요 API 에러", err);
        // 실패 시, 로컬 상태 복구
        if (!isNowLiked) {
          // 좋아요 등록 실패 → 다시 좋아요 해제 & 개수 감소
          setLikes(prev => {
            const copy = { ...prev };
            delete copy[currentVideoId];
            return copy;
          });
          setCurrentLikeCount(prev => (prev > 0 ? prev - 1 : 0));
        } else {
          // 좋아요 취소 실패 → 다시 좋아요 추가 & 개수 증가
          setLikes(prev => ({ ...prev, [currentVideoId]: true }));
          setCurrentLikeCount(prev => prev + 1);
        }
        openToast("좋아요 처리 중 오류가 발생했습니다.");
      }
    };

  // ────────────────────────────────────────────────────
  // 12) 싫어요 클릭 핸들러
  //────────────────────────────────────────────────────
  const handleThumbDownClick = async () => {
    const currentItem = originalShorts[currentOriginalIdx];
    if (!currentItem) return;
    const currentVideoId = currentItem.id?.videoId || currentItem.videoId;
    if (!currentVideoId) return;

    if (!isLoggedIn) { setIsLoginModalOpen(true); return; }

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const isNowDisliked = !!dislikes[currentVideoId];
    const isNowLiked = !!likes[currentVideoId];

    try {
      if (!isNowDisliked) {
        await axios.post(`/api/v1/auth/${userId}/videos/${currentVideoId}/dislike`, null, { headers: { Authorization: `Bearer ${token}` } });
        setDislikes((prev) => ({ ...prev, [currentVideoId]: true }));
        if (isNowLiked) {
          setLikes((prev) => { const copy = { ...prev }; delete copy[currentVideoId]; return copy; });
        }
      } else {
        await axios.delete(`/api/v1/auth/${userId}/videos/${currentVideoId}/dislike`, { headers: { Authorization: `Bearer ${token}` } });
        setDislikes((prev) => { const copy = { ...prev }; delete copy[currentVideoId]; return copy; });
      }
    } catch (err) { console.error("싫어요 API 에러", err); openToast("오류가 발생했습니다."); }
  };

  // ────────────────────────────────────────────────────
  // 13) 북마크 관련 핸들러
  //────────────────────────────────────────────────────
  const handleStarClick = () => {
    if (!isLoggedIn) { setIsLoginModalOpen(true); return; }
    if (folders.length === 0) {
      const token = localStorage.getItem("token");
      axios.get(`/api/folder`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => { setFolders(res.data); })
        .catch((err) => { console.error("북마크 폴더 불러오기 실패", err); openToast("폴더를 불러오는 데 실패했습니다."); });
    }
    setIsFolderOpen((prev) => !prev);
  };
  
  const handleAddFolder = async () => {
    if (!newFolderName.trim()) return;
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(`/api/folder`, { folderName: newFolderName.trim() }, { headers: { Authorization: `Bearer ${token}` } });
      const newFolder = res.data; 
      setFolders((prev) => [...prev, newFolder]);
      setNewFolderName("");
      await handleSaveFolder(newFolder); // 새 폴더에 바로 저장
    } catch (err) { console.error("새 폴더 생성 실패", err); openToast("폴더 생성에 실패했습니다."); }
  };

  const handleSaveFolder = async (folder) => {
    const currentItem = originalShorts[currentOriginalIdx];
    if (!currentItem || !folder) return;
    const currentVideoId = currentItem.id?.videoId || currentItem.videoId;
    if (!currentVideoId) { console.error("현재 비디오 ID를 찾을 수 없습니다."); openToast("오류: 비디오 ID 없음"); return; }

    const token = localStorage.getItem("token");
    const requestDto = { folderId: folder.folderId, videoId: currentVideoId };

    try {
      await axios.post(`/api/bookmarks`, requestDto, { headers: { Authorization: `Bearer ${token}` } });
      setBookmarkedVideos((prev) => ({ ...prev, [currentVideoId]: true }));
      setIsFolderOpen(false);
      openToast(`'${folder.folderName}' 폴더에 저장했습니다.`);
    } catch (err) {
      console.error("북마크 저장 실패", err.response?.data || err.message);
      openToast(err.response?.data?.message || "북마크 저장에 실패했습니다.");
    }
  };

  // ────────────────────────────────────────────────────
  // 14) “이전 영상” 이동 핸들러
  //────────────────────────────────────────────────────
  const handlePrev = () => {
    console.log("DEBUG: handlePrev - 호출됨. 현재 인덱스:", currentOriginalIdx, "originalShorts 길이:", originalShorts.length);
    if (!originalShorts.length) return;

    let prevIdx = currentOriginalIdx - 1;
    // '관심 없음' 로직을 북마크 목록에서는 다르게 처리하거나 제거할 수 있습니다.
    // 여기서는 우선 기존 로직을 유지하되, originalShorts가 북마크 목록일 때 어떻게 동작할지 고려해야 합니다.
    // 만약 북마크 목록에서는 '관심 없음'을 무시하고 순수하게 이전/다음으로만 이동하고 싶다면 아래 while 루프 수정 필요.
    while (prevIdx >= 0) {
      const videoIdToCheck = originalShorts[prevIdx]?.id?.videoId || originalShorts[prevIdx]?.videoId || null;
      // pageOriginFromState === 'bookmarks'일 때는 dislikes 검사를 건너뛰도록 할 수 있습니다.
      // if (pageOriginFromState === 'bookmarks' || !dislikes[videoIdToCheck]) {
      if (!dislikes[videoIdToCheck]) { // 현재는 dislikes 검사 유지
        console.log("DEBUG: handlePrev - 이전 인덱스로 설정:", prevIdx);
        setCurrentOriginalIdx(prevIdx);
        return;
      }
      prevIdx--;
    }
    console.log("DEBUG: handlePrev - 더 이상 이전 영상 없음 또는 모두 관심 없음 처리됨.");
    // openToast("이전 영상이 없습니다."); // 필요에 따라 추가
  };

  // ────────────────────────────────────────────────────
  // 15) “다음 영상” 이동 핸들러
  //────────────────────────────────────────────────────
  const handleNext = () => {
    console.log("DEBUG: handleNext - 호출됨. 현재 인덱스:", currentOriginalIdx, "originalShorts 길이:", originalShorts.length);
    if (!originalShorts.length) return;
    
    let nextIdx = currentOriginalIdx + 1;
    while (nextIdx < originalShorts.length) {
      const videoIdToCheck = originalShorts[nextIdx]?.id?.videoId || originalShorts[nextIdx]?.videoId || null;
      // if (pageOriginFromState === 'bookmarks' || !dislikes[videoIdToCheck]) {
      if (!dislikes[videoIdToCheck]) { // 현재는 dislikes 검사 유지
        console.log("DEBUG: handleNext - 다음 인덱스로 설정:", nextIdx);
        setCurrentOriginalIdx(nextIdx);
        return;
      }
      nextIdx++;
    }
    console.log("DEBUG: handleNext - 더 이상 다음 영상 없음 또는 모두 관심 없음 처리됨.");
    // openToast("다음 영상이 없습니다."); // 필요에 따라 추가
  };

  // ────────────────────────────────────────────────────
  // 16) 렌더링
  //────────────────────────────────────────────────────
  const videoObj = originalShorts[currentOriginalIdx];
  const currentVideoId = videoObj?.id?.videoId || videoObj?.videoId || null;

  if (!originalShorts.length && !paramVideoId) { // 초기 로딩 중이거나, 목록도 없고 paramId도 없을 때
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
  
  if (originalShorts.length > 0 && !currentVideoId && currentOriginalIdx >=0 && currentOriginalIdx < originalShorts.length ) {
      // 목록은 있으나 현재 인덱스의 videoId를 못찾는 경우 (데이터 구조 문제 가능성)
      console.error("DEBUG: 렌더링 - currentVideoId를 찾을 수 없습니다. videoObj:", videoObj, "currentOriginalIdx:", currentOriginalIdx, "originalShorts:", originalShorts);
      // return <div>오류: 현재 비디오 정보를 찾을 수 없습니다. 콘솔을 확인해주세요.</div>;
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
              id="player-container" // ref 대신 id 사용 가능 (YT API는 id로도 동작)
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
                <button className={styles.folderBtn} onClick={handleAddFolder}>+</button>
              </div>
              <ul className={styles.folderList}>
                {folders.length === 0 ? (
                  <li className={styles.emptyFolder}>폴더가 없습니다.</li>
                ) : (
                  folders.map((folder) => (
                    <li
                      key={folder.folderId}
                      className={styles.folderItem}
                      onClick={() => handleSaveFolder(folder)}
                    >
                      <span className={styles.folderName}>{folder.folderName}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

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