import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../../assets/styles/search.module.css";
import SearchBar from "../../components/MainSearchBar/SearchBar";

function Search() {
  const [videos, setVideos] = useState([]); // 영상
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // 페이지 수 기본 첫번째
  const itemsPerPage = 20; // 20개씩 보여주고

  // url 쿼리에서 검색어 추출
  const queryParams = new URLSearchParams(window.location.search);
  const query = queryParams.get("query") || "";

  // 검색어가 바뀔 때마다 API 호출
  useEffect(() => {
    if (!query) {
      setVideos([]);
      return;
    }
    setLoading(true);
    axios
      .get("/api/v1/videos", { params: { keyword: query } })
        const token = localStorage.getItem("accessToken");
        axios.get("/api/v1/videos", {
          params: { keyword: query },
          headers: { Authorization: `Bearer ${token}` }
        })
      .then((res) => setVideos(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
    setCurrentPage(1);
  }, [query]);

  const totalItems = videos.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = videos.slice(startIdx, startIdx + itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <SearchBar
            showTitle={false}
            compact={true}
            className={styles.searchCompact}
            textboxClassName={styles.textboxCompact}
          />

          {loading && <div className={styles.status}>로딩 중...</div>}
          {error && (
            <div className={styles.status}>에러 발생: {error.message}</div>
          )}

          {!loading && !error && (
            <>
              {query && (
                <h2 className={styles.title}>
                  “{query}” 검색 결과 ({totalItems})
                </h2>
              )}
              <div className={styles.grid}>
                {currentItems.map((video) => (
                  <div key={video.videoId} className={styles.gridItem}>
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
    </>
  );
}

export default Search;
