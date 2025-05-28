import { useEffect, useState } from "react";
import searchIcon from "../../assets/images/searchIcon.png";
import styles from "../../assets/styles/GangwondoPage.module.css";
import Header from "../../components/Header/Header";
import RollingCardSlider from "./RollingCardSlider";

function RegionPage({ regionName, backgroundImages, cities }) {
  const [selectImage, setSelectImage] = useState("");
  const [visibleRows, setVisibleRows] = useState(
    Object.fromEntries(cities.map((city) => [city, 1]))
  );
  const [cityVideos, setCityVideos] = useState({});
  const [loading, setLoading] = useState(
    Object.fromEntries(cities.map((city) => [city, true]))
  );
  const [modalVideoId, setModalVideoId] = useState(null);

  useEffect(() => {
    const random = Math.floor(Math.random() * backgroundImages.length);
    setSelectImage(backgroundImages[random]);
  }, [backgroundImages]);

  // 🚩 DB + 유튜브 API 영상 합치기
  useEffect(() => {
    cities.forEach((city) => {
      setLoading((prev) => ({ ...prev, [city]: true }));

      // DB에서 영상 가져오기
      const dbFetch = fetch(`/api/v1/youtube/db/shorts?region=${encodeURIComponent(city)}&maxResults=20`)
        .then((res) => res.ok ? res.json() : [])
        .catch(() => []);

      // 유튜브 API에서 영상 가져오기
      const ytFetch = fetch(`/api/v1/youtube/region?region=${encodeURIComponent(city)}`)
        .then((res) => res.ok ? res.json() : [])
        .catch(() => []);

      Promise.all([dbFetch, ytFetch]).then(([dbVideos, ytVideos]) => {
        // DB 데이터를 유튜브API 데이터 구조로 변환!
        const dbItems = Array.isArray(dbVideos)
          ? dbVideos.map((v) => ({
              id: { videoId: v.youtubeVideoId || v.videoId || v.youtube_video_id || v.video_id },
              snippet: {
                title: v.title || v.videoTitle || v.video_title,
                description: v.description || v.videoDescription || v.video_description,
                thumbnails: {
                  medium: { url: v.thumbnailUrl || v.thumbnail_url }
                }
              }
            }))
          : [];

        const ytItems = Array.isArray(ytVideos) ? ytVideos : [];
        const allVideos = [...dbItems, ...ytItems];

        setCityVideos((prev) => ({
          ...prev,
          [city]: allVideos,
        }));
        setLoading((prev) => ({ ...prev, [city]: false }));
      });
    });
  }, [cities]);

  const handleLoadMore = (city) => {
    setVisibleRows((prev) => {
      if (prev[city] < 3) {
        return { ...prev, [city]: prev[city] + 1 };
      }
      return prev;
    });
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <img src={selectImage} className={styles.containerImg} alt={`${regionName} 배경`} />
        <h1>{regionName}</h1>
        <div className={styles.searchbar}>
          <input type="text" className={styles.searchInput} />
          <button className={styles.searchButton}>
            <img src={searchIcon} alt="검색" className={styles.searchIcon} />
          </button>
        </div>
        <div className={styles.sliderContainer}>
          <RollingCardSlider
            region={regionName}
            setModalVideoId={setModalVideoId}
          />
        </div>
      </div>
      {cities.map((city) => (
        <div key={city} className={styles.section}>
          <h3>{city}</h3>
          <div className={styles.cardGrid}>
            {loading[city] ? (
              [...Array(visibleRows[city] * 5)].map((_, i) => (
                <div key={i} className={styles.card}>
                  <div style={{ color: "gray", fontSize: "13px", padding: "8px" }}>로딩중...</div>
                </div>
              ))
            ) : cityVideos[city] && cityVideos[city].length > 0 ? (
              cityVideos[city]
                .slice(0, visibleRows[city] * 5)
                .map((item, i) => (
                  <div
                    key={i}
                    className={styles.card}
                    style={{ cursor: "pointer" }}
                    onClick={() => setModalVideoId(item.id?.videoId)}
                  >
                    {item.snippet?.thumbnails?.medium?.url ? (
                      <img
                        src={item.snippet.thumbnails.medium.url}
                        alt={item.snippet.title ?? ""}
                        style={{
                          width: "100%",
                          height: "70%",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "70%", background: "#ccc", borderRadius: "5px" }} />
                    )}
                    <div
                      style={{
                        fontSize: "15px",
                        marginTop: "7px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {(item.snippet?.title ?? "").length > 35
                        ? item.snippet?.title.slice(0, 35) + "..."
                        : item.snippet?.title}
                    </div>
                  </div>
                ))
            ) : (
              [...Array(visibleRows[city] * 5)].map((_, i) => (
                <div key={i} className={styles.card} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {i === 0 && (
                    <span style={{ color: "gray", fontSize: "14px", padding: "7px", textAlign: "center" }}>
                      영상을 불러올 수 없습니다.
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
          {/* 더보기 버튼 */}
          {cityVideos[city] && cityVideos[city].length > visibleRows[city] * 5 && visibleRows[city] < 3 && (
            <button
              className={styles.moreButton}
              onClick={() => handleLoadMore(city)}
            >
              더보기
            </button>
          )}
        </div>
      ))}
      {/* 공통 모달 */}
      {modalVideoId && (
        <div className={styles.modalBackdrop} onClick={() => setModalVideoId(null)}>
          <div
            className={styles.modalContent}
            onClick={e => e.stopPropagation()}
          >
            <button className={styles.modalCloseBtn} onClick={() => setModalVideoId(null)}>
              &times;
            </button>
            <iframe
              width="450"
              height="800"
              src={`https://www.youtube.com/embed/${modalVideoId}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}

export default RegionPage;
