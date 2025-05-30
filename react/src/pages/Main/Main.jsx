import { useState } from "react";
import divStyle from "../../assets/styles/Main.module.css";
import Header from "../../components/Header/Header";
import SearchBar from "../../components/MainSearchBar/SearchBar";

function Main() {

  const [visibleItems, setVisibleItems] = useState(5);
  const totalItems = 15;

    const handleLoadMore = () => {
    setVisibleItems((prev) => Math.min(prev + 5, totalItems));
  };
  
  return (
    <>
      <Header />
      <div className={divStyle.main}>
        <SearchBar />
        <div className={divStyle.videoList}>
            <ul>
              {Array.from({ length: visibleItems }).map((_, index) => (
                <li key={index} className={divStyle.videoItem}>
                  <img
                    className={divStyle.videoThumbnail}
                    src=""
                    alt=""
                  />
                  <div className={divStyle.videoTitle}>영상제목 {index + 1}</div>
                  <p className={divStyle.videoDescription}>영상설명</p>
                </li>
              ))}
            </ul>
            {visibleItems < totalItems && (
              <button className={divStyle.loadMoreButton} onClick={handleLoadMore}>
                더보기
              </button>
            )}
        </div>
      </div>
    </>
  );
}
export default Main;
