import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // useNavigate 추가
import styles from "../../assets/styles/search.module.css";
import SearchBar from "../../components/MainSearchBar/SearchBar";

function Search() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const location = useLocation();
  const navigate = useNavigate(); // 추가

  // url 쿼리에서 검색어 추출
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";

  useEffect(() => {
    if (!query) {
      setVideos([]);
      return;
    }

    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    const config = {
      params: { keyword: query },
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    };

    axios
      .get("/api/v1/videos", config)
      .then((res) => {
        setVideos(res.data || []);
      })
      .catch((err) => {
        console.error("검색 API 호출 실패:", err);
        setError(err);
        setVideos([]);
      })
      .finally(() => {
        setLoading(false);
        setCurrentPage(1);
      });
  }, [query]);

  // 페이지네이션 계산
  const totalItems = videos.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = videos.slice(startIdx, startIdx + itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCardClick = (video, idx, allItems) => {
    const formattedList = allItems.map(v => ({
      id: { videoId: v.videoId },
      snippet: {
        title: v.videoTitle,
        description: v.videoDescription || "",
        thumbnails: {
          medium: { url: v.thumbnailUrl }
        }
      }
    }));
    navigate("/shorts", {
      state: {
        shorts: formattedList,
        startIdx: idx,
      },
    });
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <SearchBar
          showTitle={false}
          compact={true}
          className={styles.searchCompact}
          textboxClassName={styles.textboxCompact}
        />

        {loading && <div className={styles.status}>로딩 중...</div>}
        {error && <div className={styles.status}>에러 발생: {error.message}</div>}

        {!loading && !error && (
          <>
            {query && (
              <h2 className={styles.title}>
                “{query}” 검색 결과 ({totalItems})
              </h2>
            )}
            <div className={styles.grid}>
              {currentItems.map((video, idx) => (
                <div
                  key={video.videoId}
                  className={styles.gridItem}
                  onClick={() => handleCardClick(video, idx + startIdx, videos)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.thumbnailWrapper}>
                    <img
                      src={video.thumbnailUrl}
                      alt={video.videoTitle}
                      className={styles.thumbnail}
                    />
                  </div>
                  <div className={styles.textWrapper}>
                    <h3>{video.videoTitle}</h3>
                    <p>{video.channelName}</p>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={currentPage === number ? styles.active : ""}
                    >
                      {number}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Search;
