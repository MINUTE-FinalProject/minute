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

  useEffect(() => {
    const random = Math.floor(Math.random() * backgroundImages.length);
    setSelectImage(backgroundImages[random]);
  }, [backgroundImages]);

  useEffect(() => {
    cities.forEach((city) => {
      fetch(`/api/v1/youtube/region?region=${encodeURIComponent(city)}`)
        .then((res) => {
          // 401 등 비정상 응답시 빈 배열 반환
          if (!res.ok) return [];
          return res.json();
        })
        .then((data) => {
          // 받아온 data가 배열이 아니면 빈 배열 처리
          setCityVideos((prev) => ({
            ...prev,
            [city]: Array.isArray(data) ? data : [],
          }));
        })
        .catch(() => {
          setCityVideos((prev) => ({ ...prev, [city]: [] }));
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
          <RollingCardSlider />
        </div>
      </div>
      {cities.map((city) => (
        <div key={city} className={styles.section}>
          <h3>{city}</h3>
          <div className={styles.cardGrid}>
            {Array.isArray(cityVideos[city]) && cityVideos[city].length > 0
              ? cityVideos[city]
                  .slice(0, visibleRows[city] * 5)
                  .map((item, i) => (
                    <div key={i} className={styles.card}>
                      <a
                        href={`https://youtube.com/watch?v=${item.id?.videoId ?? ""}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "block", height: "100%" }}
                      >
                        <img
                          src={item.snippet?.thumbnails?.medium?.url ?? ""}
                          alt={item.snippet?.title ?? ""}
                          style={{
                            width: "100%",
                            height: "70%",
                            objectFit: "cover",
                            borderRadius: "5px",
                          }}
                        />
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
                      </a>
                    </div>
                  ))
              : [...Array(visibleRows[city] * 5)].map((_, i) => (
                  <div key={i} className={styles.card}>
                    {/* 빈 데이터 안내 메시지 */}
                    <div style={{ color: "gray", fontSize: "13px", padding: "8px" }}>
                      영상을 불러올 수 없습니다.
                    </div>
                  </div>
                ))}
          </div>
          {visibleRows[city] < 3 && (
            <button
              className={styles.moreButton}
              onClick={() => handleLoadMore(city)}
            >
              더보기
            </button>
          )}
        </div>
      ))}
    </>
  );
}

export default RegionPage;
