import { useState } from "react";
import styles from "./ShortsList.module.css"; // CSS 모듈 방식 (추천)

function VideoModal({ videoId, onClose }) {
  if (!videoId) return null;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <iframe
          width="760"
          height="427"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`}
          title="YouTube Shorts Player"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default function ShortsList({ shorts }) {
  // shorts: [{id: {videoId: "xxxx"}, snippet: {title, thumbnails, ...}}, ...]
  const [modalVideoId, setModalVideoId] = useState(null);

  return (
    <div className={styles.shortsGrid}>
      {shorts && shorts.length > 0 ? (
        shorts.map((item, i) => {
          const videoId = item.id?.videoId;
          return (
            <div
              className={styles.card}
              key={videoId || i}
              onClick={() => setModalVideoId(videoId)}
            >
              {item.snippet?.thumbnails?.medium ? (
                <img
                  src={item.snippet.thumbnails.medium.url}
                  alt={item.snippet.title}
                  className={styles.thumbnail}
                />
              ) : (
                <div className={styles.noThumbnail}>No Image</div>
              )}
              <div className={styles.title}>{item.snippet?.title}</div>
            </div>
          );
        })
      ) : (
        <div className={styles.noData}>영상을 불러올 수 없습니다.</div>
      )}

      {/* 영상 모달 */}
      <VideoModal videoId={modalVideoId} onClose={() => setModalVideoId(null)} />
    </div>
  );
}
