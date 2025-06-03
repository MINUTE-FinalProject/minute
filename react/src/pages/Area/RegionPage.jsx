// src/pages/RegionPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "../../assets/images/searchIcon.png";
import styles from "../../assets/styles/GangwondoPage.module.css";
import Header from "../../components/Header/Header";
import RollingCardSlider from "./RollingCardSlider";

// 민지 - 날씨 이모지 맵
const ICON_MAP = {
  Thunderstorm: "⛈️", Drizzle: "🌦️", Rain: "🌧️", Snow: "❄️",
  Clear: "☀️", Clouds: "☁️", Mist: "🌫️", Smoke: "🌫️",
  Haze: "🌫️", Dust: "🌫️", Fog: "🌫️", Sand: "🌫️",
  Ash: "🌋", Squall: "💨", Tornado: "🌪️"
};
const cityCoords = {
  // 부산
  해운대: { lat: 35.1587, lon: 129.1604 },
  광안리: { lat: 35.1534, lon: 129.1186 },
  서면:   { lat: 35.1550, lon: 129.0595 },

  // 충청
  단양: { lat: 36.9879, lon: 128.2114 },
  청주: { lat: 36.6424, lon: 127.4890 },
  제천: { lat: 37.1307, lon: 128.2009 },

  // 충남
  태안: { lat: 36.7459, lon: 126.3082 },
  공주: { lat: 36.4513, lon: 127.1240 },
  보령: { lat: 36.3504, lon: 126.5930 },

  // 강원
  강릉: { lat: 37.7519, lon: 128.8761 },
  속초: { lat: 38.2078, lon: 128.5912 },
  평창: { lat: 37.367, lon: 128.400 },

  // 경기
  가평: { lat: 37.8268, lon: 127.5073 },
  수원: { lat: 37.2636, lon: 127.0286 },
  파주: { lat: 37.7509, lon: 126.7845 },

  // 경북
  경주: { lat: 35.8562, lon: 129.2244 },
  안동: { lat: 36.5684, lon: 128.7254 },
  포항: { lat: 36.0190, lon: 129.3435 },

  // 경남
  통영: { lat: 34.8496, lon: 128.4345 },
  거제: { lat: 34.8800, lon: 128.6310 },
  진주: { lat: 35.1796, lon: 128.0765 },

  // 전북
  전주: { lat: 35.8252, lon: 127.1480 },
  군산: { lat: 35.9670, lon: 126.7368 },
  남원: { lat: 35.4045, lon: 127.3927 },

  // 전남
  여수: { lat: 34.7604, lon: 127.6620 },
  순천: { lat: 34.9508, lon: 127.4874 },
  담양: { lat: 35.3203, lon: 126.9930 },

  // 제주
  서귀포: { lat: 33.2560, lon: 126.5607 },
  성산:   { lat: 33.4355, lon: 126.9004 },
  애월:   { lat: 33.4850, lon: 126.4940 },

  // 서울
  강남: { lat: 37.4979, lon: 127.0276 },
  종로: { lat: 37.5729, lon: 126.9794 },
  홍대: { lat: 37.5572, lon: 126.9249 },
};

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

  // 민지 - 날씨 로딩 상태 & 데이터
  const [loadingWeather, setLoadingWeather] = useState(
    Object.fromEntries(cities.map(city => [city, true]))
  );
  const [cityWeather, setCityWeather] = useState(
    Object.fromEntries(cities.map(city => [city, null]))
  );

  useEffect(() => {
    const random = Math.floor(Math.random() * backgroundImages.length);
    setSelectImage(backgroundImages[random]);
  }, [backgroundImages]);

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

  // 위도·경도로 날씨 호출
  useEffect(() => {
    cities.forEach(city => {
      setLoadingWeather(prev => ({ ...prev, [city]: true }));
      const { lat, lon } = cityCoords[city];
      fetch(`/api/v1/weather/current?lat=${lat}&lon=${lon}`)
        .then(res => { if (!res.ok) throw new Error(); return res.json() })
        .then(json => {
          setCityWeather(prev => ({
            ...prev,
            [city]: {
              temp: Math.round(json.main.temp),
              main: json.weather[0].main
            }
          }));
        })
        .catch(() => {
          setCityWeather(prev => ({ ...prev, [city]: null }));
        })
        .finally(() => {
          setLoadingWeather(prev => ({ ...prev, [city]: false }));
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

  const handleCardClick = (item, idx, allItems) => {
    navigate("/shorts", {
      state: {
        shorts: allItems,
        startIdx: idx,
      },
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
            setModalVideoId={() => {}}
          />
        </div>
      </div>
      {cities.map((city) => (
        <div key={city} className={styles.section}>
          <h3>
            {city}
            {loadingWeather[city]
              ? " (날씨 로딩…)"
              : cityWeather[city]
                ? <> {ICON_MAP[cityWeather[city].main] || "❔"} {cityWeather[city].temp}°C</>
                : " (날씨 정보 없음)"}
          </h3>
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
                    onClick={() => handleCardClick(item, i, cityVideos[city].slice(0, visibleRows[city] * 5))}
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
