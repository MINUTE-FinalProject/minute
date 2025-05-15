import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import styles from "./GangwondoPage.module.css"; // ✅ 올바른 경로
import RollingCardSlider from "./RollingCardSlider";

function RegionPage({ regionName, backgroundImages, cities }) {
  const [selectImage, setSelectImage] = useState("");
  const [visibleRows, setVisibleRows] = useState(
    Object.fromEntries(cities.map((city) => [city, 1]))
  );

  useEffect(() => {
    const random = Math.floor(Math.random() * backgroundImages.length);
    setSelectImage(backgroundImages[random]);
  }, [backgroundImages]);

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
        // style={{
        //   backgroundImage: selectImage ? `url(${selectImage})` : "none"
        // }}
      >
        <img src={selectImage} className={styles.containerImg}/>
        <h1>{regionName}</h1>
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
        <div className={styles.sliderContainer}>
          <RollingCardSlider />
        </div>
      </div>

      {cities.map((city) => (
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

export default RegionPage;
