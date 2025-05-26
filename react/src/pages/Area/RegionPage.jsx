import { useEffect, useState } from "react";
import searchIcon from "../../assets/images/searchIcon.png";
import styles from "../../assets/styles/GangwondoPage.module.css";
import Header from "../../components/Header/Header";
import RollingCardSlider from "./RollingCardSlider";

function RegionPage({ regionName, backgroundImages, cities }) {
  // ⬇ 상단 대표 영상(DB 기반)
  const [regionShorts, setRegionShorts] = useState([]);
  // 기존 도시별 등등
  const [selectImage, setSelectImage] = useState("");
  const [visibleRows, setVisibleRows] = useState(
    Object.fromEntries(cities.map((city) => [city, 1]))
  );
  const [cityVideos, setCityVideos] = useState({});
  const [loading, setLoading] = useState(
    Object.fromEntries(cities.map((city) => [city, true]))
  );
  const [modalVideoId, setModalVideoId] = useState(null);

  // 배경이미지 랜덤
  useEffect(() => {
    const random = Math.floor(Math.random() * backgroundImages.length);
    setSelectImage(backgroundImages[random]);
  }, [backgroundImages]);

  // ⬇⬇ [NEW] 지역별 대표영상: 자동 저장 + DB 조회
  useEffect(() => {
    // (1) DB 저장(최초 1회/이미 있으면 그냥 ok)
    fetch(`/api/v1/youtube/shorts/save?region=${regionName}&maxResults=10`, {
      method: "POST",
    })
      .then(() =>
        // (2) 저장 후, DB에서 영상 리스트 불러오기!
        fetch(`/api/v1/youtube/db/shorts?region=${regionName}&maxResults=10`)
      )
      .then((res) => res.json())
      .then((data) => setRegionShorts(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [regionName]);
  // ⬆⬆

  // 기존: 도시별 영상 불러오기
  useEffect(() => {
    cities.forEach((city) => {
      setLoading((prev) => ({ ...prev, [city]: true }));
      fetch(`/api/v1/youtube/region?region=${encodeURIComponent(city)}`)
        .then((res) => {
          if (!res.ok) return [];
          return res.json();
        })
        .then((data) => {
          setCityVideos((prev) => ({
            ...prev,
            [city]: Array.isArray(data) ? data : [],
          }));
          setLoading((prev) => ({ ...prev, [city]: false }));
        })
        .catch(() => {
          setCityVideos((prev) => ({ ...prev, [city]: [] }));
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

        {/* 상단 대표 영상(자동 DB저장 & 조회) */}
        <div style={{ margin: "32px 0 20px 0" }}>
          <h2 style={{ fontWeight: "bold", fontSize: 23, margin: "10px 0 8px" }}>
            {regionName} 인기 쇼츠
          </h2>
          <div style={{
            display: "flex",
            gap: 15,
            flexWrap: "wrap",
            minHeight: 210
          }}>
            {regionShorts.length === 0 ? (
              <div style={{ color: "#888", fontSize: 17, margin: "30px 0" }}>로딩중...</div>
            ) : (
              regionShorts.map((item, i) => (
                <div
                  key={item.youtubeVideoId || i}
                  style={{
                    width: 250,
                    background: "#f5f5f5",
                    borderRadius: 12,
                    boxShadow: "0 2px 7px #0002",
                    padding: 10,
                    cursor: "pointer"
                  }}
                  onClick={() => setModalVideoId(item.youtubeVideoId)}
                >
                  <iframe
                    width="220"
                    height="124"
                    src={`https://www.youtube.com/embed/${item.youtubeVideoId}`}
                    title={item.title}
                    allowFullScreen
                    style={{ borderRadius: "10px" }}
                  />
                  <div style={{
                    marginTop: 7,
                    fontWeight: "bold",
                    fontSize: 15,
                    minHeight: 34,
                    lineHeight: 1.1,
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {item.title}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* 기존 롤링 슬라이더 등등 ↓ */}
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
