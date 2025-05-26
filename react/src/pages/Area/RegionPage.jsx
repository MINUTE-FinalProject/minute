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
  const [modalVideoId, setModalVideoId] = useState(null); // 👈 모달 상태

  useEffect(() => {
    const random = Math.floor(Math.random() * backgroundImages.length);
    setSelectImage(backgroundImages[random]);
  }, [backgroundImages]);

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
        <div className={styles.sliderContainer}>
          <RollingCardSlider
            region={regionName}
            setModalVideoId={setModalVideoId} // 👈 슬라이더에도 모달 setter 전달!
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
                    onClick={() => setModalVideoId(item.id?.videoId)} // 👈 카드 클릭시 모달 오픈
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
