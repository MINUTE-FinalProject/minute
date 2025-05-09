import { useRef } from "react";
import styles from "./RollingCardSlider.module.css";

const RollingCardSlider = () => {
  const sliderRef = useRef(null);
  const cards = [...Array(10).keys()].map((i) => `Card ${i + 1}`);
  const repeatedCards = Array.from({ length: 50 }, () => cards).flat();

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
      {/* ✅ 버튼 그룹: 정중앙 위에 위치 */}
      <div className={styles.arrowGroup}>
        <button className={styles.navButton} onClick={handleScrollLeft}>
          ◀
        </button>
        <button className={styles.navButton} onClick={handleScrollRight}>
          ▶
        </button>
      </div>

      {/* ✅ 드래그 가능한 카드 슬라이더 */}
      <div
        className={styles.slider}
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.sliderTrack}>
          {repeatedCards.map((label, i) => (
            <div key={i} className={styles.card}>
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RollingCardSlider;
