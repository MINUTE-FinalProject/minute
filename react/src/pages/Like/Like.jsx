import axios from "axios";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"; // 이 컴포넌트에서는 현재 사용되지 않음
import styles from "../../assets/styles/Like.module.css"; // likeStyle -> styles로 변경 (일관성)
import Modal from "../../components/Modal/Modal";
import MypageNav from "../../components/MypageNavBar/MypageNav";

const VIDEO_WIDTH = 220;
const GAP = 20;
const VISIBLE_COUNT = 6;
const SCROLL_STEP = VIDEO_WIDTH + GAP;

const Like = () => {
  const [likedVideos, setLikedVideos] = useState([]);
  const [recentWatched, setRecentWatched] = useState([]);
  const [filter, setFilter] = useState("전체");

  // 삭제 모달 상태 정의: type으로 리스트 구분
  const [modal, setModal] = useState({ show: false, index: -1, type: null, videoId: null }); // videoId 추가

  // --- 👇 북마크 및 폴더 관련 상태 및 함수 제거 또는 주석 처리 ---
  // const [folderModal, setFolderModal] = useState(false);
  // const [createFolderModal, setCreateFolderModal] = useState(false);
  // const [folders, setFolders] = useState([]);
  // const [selectedFolderId, setSelectedFolderId] = useState(null);
  // const [bookmarkMsg, setBookmarkMsg] = useState(false);
  // const [newFolderName, setNewFolderName] = useState("");
  // --- ---------------------------------------------- ---

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // userId를 localStorage에서 가져오는 것은 보안상 권장되지 않습니다.
                                              // 실제로는 백엔드에서 토큰을 통해 userId를 식별해야 합니다.
                                              // 현재 코드 구조를 유지하기 위해 그대로 두지만, 개선이 필요합니다.

    if (!token || !userId) {
      console.warn("로그인 정보가 없습니다. 로그인 후 이용해주세요.");
      // TODO: 로그인 페이지로 리다이렉트 또는 로그인 유도 UI 표시
      return;
    }

    // 좋아요 한 영상 목록 API 호출
    axios
      .get(`http://localhost:8080/api/v1/auth/${userId}/likes`, { // 백엔드 API 경로가 userId를 포함하는지 확인 필요
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setLikedVideos(res.data || [])) // res.data가 null일 경우 대비
      .catch((err) => console.error("좋아요 영상 API 에러:", err));

    // 최근 시청한 영상 목록 API 호출
    axios
      .get(`http://localhost:8080/api/v1/auth/${userId}/watch-history`, { // 백엔드 API 경로가 userId를 포함하는지 확인 필요
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRecentWatched(res.data || [])) // res.data가 null일 경우 대비
      .catch((err) => console.error("시청 기록 API 에러:", err));
  }, []);

  const scroll = (containerId, direction) => {
    const container = document.getElementById(containerId);
    if (container) {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      let newScrollLeft = container.scrollLeft + direction * SCROLL_STEP;
      container.scrollTo({
        left: Math.min(Math.max(newScrollLeft, 0), maxScrollLeft),
        behavior: "smooth",
      });
    }
  };

  // "옵션" 모달 닫기
  const closeModal = () => {
    setModal({ show: false, index: -1, type: null, videoId: null });
    // --- 👇 북마크 관련 모달 상태 초기화 부분 제거 ---
    // setFolderModal(false);
    // setCreateFolderModal(false);
    // setBookmarkMsg(false);
    // setSelectedFolderId(null);
    // setNewFolderName("");
    // --- ------------------------------------ ---
  };

  // 좋아요/시청 기록 삭제 핸들러
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // 위와 동일하게 userId를 localStorage에서 가져오는 부분 개선 필요
    const { index, type, videoId: currentVideoId } = modal; // videoId를 modal 상태에서 가져옴

    if (currentVideoId == null || index === -1 || !type) {
        console.error("삭제할 아이템 정보가 유효하지 않습니다.");
        closeModal();
        return;
    }

    // const list = type === "like" ? likedVideos : recentWatched;
    // const item = list[index]; // index로 접근하는 것은 정렬 시 문제가 될 수 있으므로 videoId를 직접 사용
    // const videoIdToDelete = item?.videoId; // 옵셔널 체이닝 사용

    try {
      if (type === "like") {
        console.log(`좋아요 영상 삭제 API 호출: userId=${userId}, videoId=${currentVideoId}`);
        await axios.delete(
          `http://localhost:8080/api/v1/auth/${userId}/videos/${currentVideoId}/like`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLikedVideos((prev) => prev.filter(video => video.videoId !== currentVideoId));
        alert("좋아요 목록에서 삭제되었습니다.");
      } else if (type === "history") {
        console.log(`시청 기록 삭제 API 호출: userId=${userId}, videoId=${currentVideoId}`);
        await axios.delete(
          `http://localhost:8080/api/v1/auth/${userId}/watch-history/${currentVideoId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecentWatched((prev) => prev.filter(video => video.videoId !== currentVideoId));
        alert("시청 기록에서 삭제되었습니다.");
      }
    } catch (err) {
      console.error("삭제 API 에러:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
    closeModal();
  };

  // --- 👇 북마크 관련 함수들 제거 또는 주석 처리 ---
  /*
  const openFolderModal = () => {
    closeModal(); // 기존 옵션 모달은 닫고
    // if (folders.length === 0) setCreateFolderModal(true); // 폴더 없으면 생성 모달
    // else setFolderModal(true); // 폴더 있으면 선택 모달
    console.log("북마크 저장 기능은 현재 비활성화되어 있습니다.");
    alert("북마크 저장 기능은 현재 사용할 수 없습니다.");
  };

  const handleSaveBookmark = () => {
    // 북마크 로직 (제거됨)
    console.log("북마크 저장 로직 (제거됨)");
  };
  const handleCreateFolder = () => {
    // 폴더 생성 로직 (제거됨)
    console.log("폴더 생성 로직 (제거됨)");
  };
  */
  // --- ------------------------------------ ---

  const getFilteredVideos = () =>
    filter === "최근"
      ? [...likedVideos].sort((a, b) => new Date(b.likedAt) - new Date(a.likedAt)) // likedAt 필드가 있다고 가정
      : likedVideos;

  const renderVideos = (videoList, containerId, type) => (
    <div className={styles.videoListWrapper}> {/* likeStyle -> styles */}
      {videoList.length > VISIBLE_COUNT && (
        <button className={styles.arrow} onClick={() => scroll(containerId, -1)}>‹</button>
      )}
      <div className={styles.videoList} id={containerId}>
        {videoList.map((video, index) => ( // video 객체에 videoId가 있다고 가정
          <div key={video.videoId || index} className={styles.videoItem}> {/* videoId를 key로 사용 */}
            <div className={styles.thumbnailWrapper}>
              <img
                src={video.thumbnailUrl || "https://via.placeholder.com/220x124"}
                alt={video.videoTitle || "No Title"}
                className={styles.thumbnail}
                loading="lazy"
              />
            </div>
            <div className={styles.textWrapper}>
              <span className={styles.videoTitleText}>{video.videoTitle || "No Title"}</span>
              <button
                className={styles.moreBtn}
                onClick={() => setModal({ show: true, index, type, videoId: video.videoId })} // videoId를 모달 상태에 포함
              >⋯</button>
            </div>
          </div>
        ))}
      </div>
      {videoList.length > VISIBLE_COUNT && (
        <button className={styles.arrow} onClick={() => scroll(containerId, 1)}>›</button>
      )}
    </div>
  );

  return (
    <div className={styles.wrapper}> {/* likeStyle -> styles */}
      <MypageNav />
      <div className={styles.mainContent}>
        <h1 className={styles.header}>좋아요 한 영상</h1>
        <div className={styles.filterMenu}>
          {["전체", "최근"].map((type) => (
            <button
              key={type}
              className={`${styles.filterButton} ${filter === type ? styles.active : ""}`} onClick={() => setFilter(type)}>
              {type}
            </button>
          ))}
        </div>
        {getFilteredVideos().length > 0 ? renderVideos(getFilteredVideos(), "likedVideoList", "like")
          : <p className={styles.noData}>좋아요 한 영상이 없습니다.</p>}

        <h2 className={styles.sectionTitle}>최근 시청한 영상</h2>
        {recentWatched.length > 0 ? renderVideos(recentWatched, "recentVideoList", "history")
          : <p className={styles.noData}>최근 시청한 영상이 없습니다.</p>}

        {/* 옵션 모달: "북마크에 저장" 버튼 제거 */}
        <Modal 
          isOpen={modal.show} 
          onClose={closeModal} 
          title="옵션"
          // confirmText 와 onConfirm 은 필요 없으므로 제거하거나, 삭제 버튼만 남길 경우 수정
          cancelText="취소" // "취소" 버튼만 남기거나, "삭제" 버튼을 confirm으로 이동
          onCancel={closeModal}
          // confirmText="삭제" // 삭제 버튼을 모달의 기본 confirm 버튼으로 사용하고 싶다면
          // onConfirm={handleDelete}
        >
          <div className={styles.optionsContainer}>
            {/* "북마크에 저장" 버튼은 이 기능을 제거하므로 삭제 또는 주석 처리 */}
            {/* <button className={styles.optionButton} onClick={openFolderModal}>북마크에 저장</button> */}
            <button className={styles.optionButton} onClick={handleDelete}>
              {modal.type === "like" ? "좋아요 목록에서 삭제" : "시청 기록에서 삭제"}
            </button>
          </div>
        </Modal>

        {/* --- 👇 북마크 관련 모달들 제거 또는 주석 처리 --- */}
        {/* <Modal isOpen={folderModal} onClose={closeModal} title="폴더 선택" confirmText="저장" onConfirm={handleSaveBookmark}>
          <p>저장할 폴더를 선택하세요.</p>
          { folders.length > 0 ? folders.map(f => <div key={f.id} onClick={() => setSelectedFolderId(f.id)}>{f.name}</div>) : <p>폴더 없음</p> }
          <button onClick={() => { setFolderModal(false); setCreateFolderModal(true); }}>새 폴더 만들기</button>
        </Modal>

        <Modal isOpen={createFolderModal} onClose={closeModal} title="새 폴더 생성" confirmText="만들기" onConfirm={handleCreateFolder}>
          <input type="text" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} placeholder="폴더 이름" />
        </Modal>

        <Modal isOpen={bookmarkMsg} onClose={closeModal} title="알림" confirmText="확인" onConfirm={closeModal}>
          <p>북마크에 저장되었습니다!</p>
        </Modal>
        */}
        {/* --- ------------------------------------- --- */}
      </div>
    </div>
  );
};

export default Like;