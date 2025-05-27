import { useState } from "react";
import styles from '../../assets/styles/ThemeParkPage.module.css';
import SearchBar from "../../components/MainSearchBar/SearchBar";

function ThemeParkPage(){
 const [visibleItems, setVisibleItems] = useState(5);
  const totalItems = 15;

  const handleLoadMore = () => {
    setVisibleItems((prev) => Math.min(prev + 5, totalItems));
  };

  return (
    <div className={styles.container}>
      <SearchBar />
      <div className={styles.videoList}>
        <ul>
          {Array.from({ length: visibleItems }).map((_, index) => (
            <li key={index} className={styles.videoItem}>
              <img
                className={styles.videoThumbnail}
                src=""
                alt=""
              />
              <div className={styles.videoTitle}>영상제목 {index + 1}</div>
              <p className={styles.videoDescription}>영상설명</p>
            </li>
          ))}
        </ul>
        {visibleItems < totalItems && (
          <button className={styles.loadMoreButton} onClick={handleLoadMore}>
            더보기
          </button>
        )}
      </div>
    </div>
  );
}
export default ThemeParkPage;