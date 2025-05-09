import { useEffect, useState } from "react";
import bg1 from '../images/gangwondo_bg1.png';
import bg2 from '../images/gangwondo_bg2.png';
import bg3 from '../images/gangwondo_bg3.png';
import styles from './GangwondoPage.module.css';
import Header from "./Header";
import RollingCardSlider from "./RollingCardSlider";

function GangwondoPage() {
  const images = [bg1,bg2,bg3];
  const [selectImage, setSelectImage] = useState("");
  const [visibleRows, setVisibleRows] = useState({
    강릉: 1,
    속초: 1,
    평창: 1
  });

  useEffect(() => {
    const random = Math.floor(Math.random() * images.length);
    setSelectImage(images[random]);
  }, []);

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
      <div
        className={styles.container}
        style={{
          backgroundImage: selectImage ? `url(${selectImage})` : "none"
        }}
      >
        <h1>강원도</h1>
        <div className={styles.searchbar}>
          <input type="text" className={styles.searchInput} />
          <button className={styles.searchButton}>
            <img
              src="/images/search_icon.png"
              alt="검색"
              className={styles.searchIcon}
            />
          </button>
        </div>

        {/* ✅ 슬라이더 삽입 위치 (기존 리스트 자리) */}
        <div className={styles.sliderContainer}>
          <RollingCardSlider />
        </div>
      </div>

      {["강릉", "속초", "평창"].map((city) => (
        <div key={city} className={styles.section}>
          <h3>{city}</h3>
          <div className={styles.cardGrid}>
            {[...Array(visibleRows[city] * 5)].map((_, i) => (
              <div key={i} className={styles.card}></div>
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

export default GangwondoPage;
