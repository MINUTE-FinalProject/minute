import axios from 'axios';
import { useEffect, useState } from "react";
import styles from "../../assets/styles/CampingPage.module.css";
import SearchBar from "../../components/MainSearchBar/SearchBar";

function CampingPage() {
  const [videos,setVideos] = useState([]);
  const [visibleItems, setVisibleItems] = useState(5);

  const totalItems = videos.length;

  useEffect(() => {
    axios.get('http://localhost:8080/api/v1/videos',{
      params:{category:'부산'}
    })
    .then(res =>{
        console.log(res.data);
      if(Array.isArray(res.data)){
        setVideos(res.data);
      } else if (Array.isArray(res.data.content)) {
        setVideos(res.data.content);
      } else {
         console.error('영상 데이터가 배열이 아닙니다.');
      setVideos([]);
      }
    })
    .catch(console.error);
  },[]);

  const handleLoadMore = () => {
    setVisibleItems((prev) => Math.min(prev + 5, totalItems));
  };

  return (
    <div className={styles.container}>
      <SearchBar />
      <div className={styles.videoList}>
        <ul>
          {videos.map(video => (
            <li key={video.videoId} className={styles.videoItem}>
              <img
                className={styles.videoThumbnail}
                src={video.thumbnailUrl}
                alt={video.videoTitle}
              />
              <div className={styles.videoTitle}>{video.videoTitle}</div>
              <p className={styles.videoDescription}>{video.videoDescription}</p>
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
export default CampingPage;
