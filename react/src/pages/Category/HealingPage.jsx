import { useState } from "react";
import styles from "../../assets/styles/HealingPage.module.css";
import SearchBar from "../../components/MainSearchBar/SearchBar";

function HealingPage() {
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
              <div className={styles.videoTitle}>캠핑 영상 {index + 1}</div>
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
export default HealingPage;
