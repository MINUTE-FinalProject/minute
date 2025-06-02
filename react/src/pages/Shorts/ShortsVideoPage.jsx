import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import apiClient from "../../api/apiClient";
import styles from "../../assets/styles/ShortsVideoPage.module.css";
import Header from "../../components/Header/Header";
import SearchBar from "../../components/MainSearchBar/SearchBar";

// Icon imports (기존과 동일)
import arrowIcon from "../../assets/images/arrow.png";
import starOutlinedIcon from "../../assets/images/b_star.png";
import thumbDownOutlinedIcon from "../../assets/images/b_thumbdowm.png";
import thumbUpOutlinedIcon from "../../assets/images/b_thumbup.png";
import starIcon from "../../assets/images/star.png";
import thumbDownIcon from "../../assets/images/thumbdowm.png";
import thumbUpIcon from "../../assets/images/thumbup.png";

function ShortsVideoPage() {
    const { videoId: paramVideoId } = useParams();
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        isLoggedIn: false,
        userId: null,
    });

    const [shorts, setShorts] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [likes, setLikes] = useState({});
    const [dislikes, setDislikes] = useState({});
    const [bookmarks, setBookmarks] = useState({});
    const [folders, setFolders] = useState([]);

    // UI 상태
    const [isFolderOpen, setIsFolderOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // 컴포넌트가 처음 로드될 때 한 번만 사용자 정보를 설정합니다.
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (token && userId) {
            setUserInfo({ isLoggedIn: true, userId: userId });
        }
    }, []);

    // 로그인 상태가 확인되면 필요한 모든 데이터를 한 번에 불러옵니다.
    useEffect(() => {
        if (!userInfo.isLoggedIn) return;
        const { userId } = userInfo;

        Promise.all([
            apiClient.get(`/v1/auth/${userId}/likes`),
            apiClient.get(`/v1/auth/${userId}/dislikes`),
            apiClient.get(`/folder`),
            apiClient.get(`/bookmarks/user/mine`),
        ]).then(([likesRes, dislikesRes, foldersRes, bookmarksRes]) => {
            const likeMap = likesRes.data.reduce((acc, video) => ({...acc, [video.videoId]: true }),{});
            setLikes(likeMap);

            const dislikeMap = dislikesRes.data.reduce((acc, video) => ({...acc, [video.videoId]: true }),{});
            setDislikes(dislikeMap);

            if (Array.isArray(foldersRes.data)) setFolders(foldersRes.data);

            if (Array.isArray(bookmarksRes.data)) {
                const bookmarkMap = bookmarksRes.data.reduce((acc, bookmark) => {
                    if (bookmark.videoId && bookmark.folderId) {
                        acc[bookmark.videoId] = bookmark.folderId;
                    }
                    return acc;
                }, {});
                setBookmarks(bookmarkMap);
            }
        }).catch(err => console.error("초기 데이터 로딩 실패:", err));
    }, [userInfo.isLoggedIn, userInfo.userId]);

    // 영상 목록 불러오기
    useEffect(() => {
        Promise.all([
             apiClient.get(`/v1/youtube/db/shorts?maxResults=15`),
             apiClient.get(`/v1/youtube/shorts?maxResults=15&region=KR`)
         ]).then(([dbRes, apiRes]) => {
            const dbVideos = dbRes.data;
            const apiVideos = apiRes.data;

            const dbItems = Array.isArray(dbVideos) ? dbVideos.map(v => ({ id: { videoId: v.youtubeVideoId || v.videoId || v.youtube_video_id || v.video_id }, snippet: { title: v.title, description: v.description, thumbnails: { medium: { url: v.thumbnailUrl || v.thumbnail_url } } } })) : [];
            const apiItems = Array.isArray(apiVideos) ? apiVideos : [];
            
            const allItems = [...dbItems, ...apiItems];
            const uniqueItems = allItems.filter((item, index, self) => item?.id?.videoId && index === self.findIndex((t) => t?.id?.videoId === item.id.videoId));
            
            let filtered = uniqueItems;
            if (userInfo.isLoggedIn) {
                filtered = uniqueItems.filter(video => !dislikes[video.id.videoId]);
            }
            
            setShorts(filtered);

            if (paramVideoId) {
                const idx = uniqueItems.findIndex(video => video.id.videoId === paramVideoId);
                setCurrentIdx(idx !== -1 ? idx : 0);
            } else {
                setCurrentIdx(0);
            }
        }).catch(err => console.error("영상 목록 불러오기 실패", err));
    }, [paramVideoId, dislikes, userInfo.isLoggedIn]);

    const video = shorts[currentIdx];
    const videoId = video?.id?.videoId || null;
    const currentVideoBookmarkFolderId = videoId ? bookmarks[videoId] : null;

    // 시청 기록 저장
    useEffect(() => {
        if (!userInfo.isLoggedIn || !videoId) return;
        apiClient.post(`/v1/auth/${userInfo.userId}/watch-history`, { videoId })
            .catch(err => console.error("시청 기록 저장 실패", err));
    }, [currentIdx, shorts, userInfo, videoId]);

    const handleReaction = async (type) => {
        if (!videoId) return;
        if (!userInfo.isLoggedIn) {
            setIsLoginModalOpen(true);
            return;
        }

        const { userId } = userInfo;
        const isLiked = !!likes[videoId];
        const isDisliked = !!dislikes[videoId];
        
        try {
            if (type === 'like') {
                if (isLiked) {
                    await apiClient.delete(`/v1/auth/${userId}/videos/${videoId}/like`);
                } else {
                    await apiClient.post(`/v1/auth/${userId}/videos/${videoId}/like`);
                }
                setLikes(prev => ({ ...prev, [videoId]: !isLiked }));
                if (!isLiked && isDisliked) setDislikes(prev => ({ ...prev, [videoId]: false }));
            } else if (type === 'dislike') {
                if (isDisliked) {
                    await apiClient.delete(`/v1/auth/${userId}/videos/${videoId}/dislike`);
                } else {
                    await apiClient.post(`/v1/auth/${userId}/videos/${videoId}/dislike`);
                }
                setDislikes(prev => ({ ...prev, [videoId]: !isDisliked }));
                if (!isDisliked && isLiked) setLikes(prev => ({ ...prev, [videoId]: false }));
            }
        } catch (err) {
            console.error(`${type} 처리 실패`, err);
        }
    };
    
    const handleStarClick = () => {
        if (!videoId) return;
        if (!userInfo.isLoggedIn) {
            setIsLoginModalOpen(true);
            return;
        }
        setIsFolderOpen(prev => !prev);
    };

    const handleAddFolder = async () => {
        if (!newFolderName.trim()) return;
        try {
            const res = await apiClient.post(`/folder`, { folderName: newFolderName.trim() });
            setFolders(prev => [...prev, res.data]);
            setNewFolderName("");
        } catch (err) {
            console.error("폴더 추가 실패", err);
            alert(err.response?.data?.message || "폴더 추가에 실패했습니다.");
        }
    };

    // ✨ [수정됨] 400 에러 해결을 위해 요청 데이터에서 userId 제거
    const handleFolderClick = async (folder) => {
        if (!videoId || !userInfo.isLoggedIn) return;

        const isAlreadyBookmarkedInThisFolder = currentVideoBookmarkFolderId === folder.folderId;

        try {
            if (isAlreadyBookmarkedInThisFolder) {
                // 북마크 삭제
                await apiClient.delete(`/bookmarks/folder/${folder.folderId}/video/${videoId}`);
                setBookmarks(prev => {
                    const newBookmarks = { ...prev };
                    delete newBookmarks[videoId];
                    return newBookmarks;
                });
            } else {
                // 북마크 추가
                const requestBody = {
                    folderId: folder.folderId,
                    videoId: videoId,
                };
                await apiClient.post(`/bookmarks`, requestBody);
                setBookmarks(prev => ({ ...prev, [videoId]: folder.folderId }));
            }
            setIsFolderOpen(false);
        } catch (err) {
            console.error("북마크 처리 실패", err);
            alert(err.response?.data?.message || "북마크 처리에 실패했습니다.");
        }
    };

    const handlePrev = () => {
        if (currentIdx > 0) {
            setCurrentIdx(currentIdx - 1);
        }
    };
    const handleNext = () => {
        if (currentIdx < shorts.length - 1) {
            setCurrentIdx(currentIdx + 1);
        }
    };
    const closeLoginModal = () => setIsLoginModalOpen(false);
    const redirectToLogin = () => navigate("/login");

    return (
        <>
            <Header />
            <div className={styles.container}>
                <SearchBar showTitle={false} compact className={styles.searchCompact} textboxClassName={styles.textboxCompact} />
                <div className={styles.mainContent}>
                    <div className={styles.contentWrap}>
                        <div className={styles.shortVideo}>
                            {videoId ? (
                                <iframe
                                    key={videoId} 
                                    width="470" height="720"
                                    // ✨ [수정됨] 올바른 유튜브 embed URL로 수정
                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`}
                                    title={video.snippet?.title || "short video"}
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media; accelerometer; clipboard-write; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{ borderRadius: 18, boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}
                                />
                            ) : ( <p style={{ textAlign: 'center', marginTop: '50%' }}>영상을 불러오는 중이거나, 표시할 영상이 없습니다.</p> )}
                        </div>
                        <div className={styles.reactionWrap}>
                            <ul>
                                <li><img src={videoId && likes[videoId] ? thumbUpIcon : thumbUpOutlinedIcon} alt="thumbUp" onClick={() => handleReaction('like')} className={styles.reactionIcon} /></li>
                                <li><img src={videoId && dislikes[videoId] ? thumbDownIcon : thumbDownOutlinedIcon} alt="thumbDown" onClick={() => handleReaction('dislike')} className={styles.reactionIcon} /></li>
                                <li>
                                    <img src={currentVideoBookmarkFolderId ? starIcon : starOutlinedIcon} alt="bookmark" onClick={handleStarClick} className={styles.reactionIcon} />
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={styles.arrowWrap}>
                        <ul>
                            <li><img src={arrowIcon} alt="prev" className={`${styles.arrowTop} ${currentIdx === 0 ? styles.disabled : ''}`} onClick={handlePrev} /></li>
                            <li><img src={arrowIcon} alt="next" className={`${styles.arrowBottom} ${currentIdx === shorts.length - 1 ? styles.disabled : ''}`} onClick={handleNext} /></li>
                        </ul>
                    </div>
                    {isFolderOpen && (
                        <div className={styles.folderModal} style={{ bottom: '120px' }}>
                            <div className={styles.folderInputWrap}>
                                <input type="text" className={styles.folderInput} placeholder="새 폴더 이름" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddFolder()} />
                                <button className={styles.folderBtn} onClick={handleAddFolder}>+</button>
                            </div>
                            <ul className={styles.folderList}>
                                {folders.length === 0 ? (<li className={styles.emptyFolder}>폴더가 없습니다.</li>) 
                                : (
                                    folders.map(folder => (
                                        <li key={folder.folderId} className={styles.folderItem} onClick={() => handleFolderClick(folder)}>
                                            <span className={styles.folderName}>{folder.folderName}</span>
                                            {currentVideoBookmarkFolderId === folder.folderId && <span className={styles.checkmark}>✔</span>}
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    )}
                </div>
                {isLoginModalOpen && (
                    <div className={styles.loginModalOverlay} onClick={closeLoginModal}>
                        <div className={styles.loginModal} onClick={e => e.stopPropagation()}>
                            <h2>로그인이 필요합니다</h2>
                            <button onClick={redirectToLogin}>로그인</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ShortsVideoPage;