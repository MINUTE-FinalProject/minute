import { useEffect, useRef, useState } from "react";
import styles from "../../assets/styles/RollingCardSlider.module.css";

const RollingCardSlider = () => {
  const sliderRef = useRef(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/youtube/slider")
      .then((res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .then((data) => {
        setVideos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setVideos([]);
        setLoading(false);
      });
  }, []);

  // 샘플 카드(로딩/에러시)
  const EMPTY_CARD_COUNT = 10;

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleScrollLeft = () => {
    sliderRef.current.scrollBy({
      left: -180,
      behavior: "smooth",
    });
  };

  const handleScrollRight = () => {
    sliderRef.current.scrollBy({
      left: 180,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.sliderWrapper}>
      <div className={styles.arrowGroup}>
        <button className={styles.navButton} onClick={handleScrollLeft}>
          ◀
        </button>
        <button className={styles.navButton} onClick={handleScrollRight}>
          ▶
        </button>
      </div>
      <div
        className={styles.slider}
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.sliderTrack}>
          {/* 1. 로딩 중엔 빈 카드들 */}
          {loading ? (
            [...Array(EMPTY_CARD_COUNT)].map((_, i) => (
              <div key={i} className={styles.card}></div>
            ))
          )
          // 2. 정상 데이터 있으면 영상 카드들
          : Array.isArray(videos) && videos.length > 0 ? (
            videos.map((item, i) => (
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
                  <div style={{ fontSize: "13px", marginTop: "7px" }}>
                    {(item.snippet?.title ?? "").length > 40
                      ? item.snippet?.title.slice(0, 40) + "..."
                      : item.snippet?.title}
                  </div>
                </a>
              </div>
            ))
          )
          // 3. 실패(에러/빈 배열): 빈 카드 + 안내문구
          : (
            [...Array(EMPTY_CARD_COUNT)].map((_, i) => (
              <div key={i} className={styles.card} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                {i === 0 && (
                  <span style={{ color: "gray", fontSize: "14px", padding: "7px", textAlign: "center" }}>
                    유튜브 영상을 불러올 수 없습니다.
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RollingCardSlider;
