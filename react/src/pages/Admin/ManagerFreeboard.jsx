import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header'; // 실제 경로로 수정해주세요
import Sidebar from '../../components/Sidebar/Sidebar'; // 실제 경로로 수정해주세요
import styles from './ManagerFreeboard.module.css'; // CSS 모듈 파일 이름에 맞게 수정

// 아이콘 import (자유게시판에서 사용했던 아이콘과 동일하게)
import reportOffIcon from "../../assets/images/able-alarm.png"; // 실제 경로로 수정해주세요
import likeOffIcon from "../../assets/images/b_thumbup.png"; // 실제 경로로 수정해주세요
import reportOnIcon from "../../assets/images/disable-alarm.png"; // 실제 경로로 수정해주세요
import searchButtonIcon from "../../assets/images/search_icon.png"; // 검색 버튼용 아이콘, 실제 경로로 수정
import likeOnIcon from "../../assets/images/thumbup.png"; // 실제 경로로 수정해주세요

// 예시 데이터 (실제로는 API를 통해 받아옵니다)
const initialPosts = [
    { id: 1, type: '정보', title: '어디로 가야하죠 - 아조씨패션', author: '닉네임', date: '25.04.21', views: 111, likes: 111, reports: 0, isLiked: false, isReported: false },
    { id: 2, type: '질문', title: '아 여행가고싶다 ㅠㅠ', author: '닉네임', date: '25.04.21', views: 111, likes: 111, reports: 1, isLiked: true, isReported: true },
    { id: 3, type: '후기', title: '여러분은 순대를 뭐 찍어 먹나요?', author: '닉네임', date: '25.04.21', views: 111, likes: 111, reports: 0, isLiked: false, isReported: false },
    // ... 기타 게시물 데이터
];

function ManagerFreeboard() {
    const [activeTab, setActiveTab] = useState('all'); // 'all' 또는 'myPosts'
    const [posts, setPosts] = useState(initialPosts);

    // TODO: 실제 필터링 및 정렬 로직 추가
    // TODO: 좋아요, 신고 토글 로직 추가 (자유게시판 목록 페이지 참고)

    const handleLikeToggle = (postId) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes -1 : post.likes + 1 } : post
            )
        );
    };

    const handleReportToggle = (postId) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId ? { ...post, isReported: !post.isReported } : post
            )
        );
    };

    return (
        <>
            <Header />
            <div className={styles.container}> {/* Sidebar와 메인 콘텐츠를 감싸는 flex 컨테이너 */}
                <Sidebar />
                <main className={styles.managerFreeboardContent}> {/* 메인 콘텐츠 영역 */}
                    <h1 className={styles.pageTitle}>자유게시판</h1>

                    <div className={styles.tabContainer}>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'all' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            전체 목록
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'myPosts' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('myPosts')}
                        >
                            내 글 {/* 또는 다른 기준 */}
                        </button>
                    </div>

                    <div className={styles.filterBar}> {/* 신고관리 페이지 필터바 느낌 */}
                        <input type="date" className={styles.filterInput} />
                        <input type="date" className={styles.filterInput} />
                        <select className={styles.filterSelect}>
                            <option value="">정렬순▼</option>
                            <option value="latest">최신순</option>
                            <option value="views">조회순</option>
                        </select>
                        <select className={styles.filterSelect}>
                            <option value="">정렬순▼</option>
                            <option value="likes">좋아요순</option>
                            <option value="reports">신고순</option>
                        </select>
                        <input type="text" placeholder="검색어를 입력하세요" className={styles.filterSearchInput} />
                        <button type="button" className={styles.filterSearchButton}>
                            <img src={searchButtonIcon} alt="검색" className={styles.filterSearchIcon} />
                        </button>
                    </div>

                    <table className={styles.boardTable}>
                        <thead>
                            <tr>
                                <th>NO</th>
                                <th>타입</th>
                                <th className={styles.titleColumn}>제목</th>
                                <th>작성자</th>
                                <th>작성날짜</th>
                                <th>조회수</th>
                                <th>좋아요</th>
                                <th>신고</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(post => (
                                <tr key={post.id}>
                                    <td>{post.id}</td>
                                    <td>{post.type}</td>
                                    <td className={styles.postTitleCell}> {/* 클래스명 변경 고려 */}
                                        <Link to={`/freeboard/${post.id}`} className={styles.titleLink}> {/* 상세 페이지 경로 확인 */}
                                            {post.title}
                                        </Link>
                                    </td>
                                    <td>{post.author}</td>
                                    <td>{post.date}</td>
                                    <td>{post.views}</td>
                                    <td>
                                        <button onClick={() => handleLikeToggle(post.id)} className={styles.iconButton}>
                                            <img
                                                src={post.isLiked ? likeOnIcon : likeOffIcon}
                                                alt="좋아요"
                                                className={styles.buttonIcon}
                                            />
                                        </button>
                                        <span className={styles.countText}>{post.likes}</span>
                                    </td>
                                    <td>
                                        <button onClick={() => handleReportToggle(post.id)} className={styles.iconButton}>
                                            <img
                                                src={post.isReported ? reportOnIcon : reportOffIcon}
                                                alt="신고"
                                                className={styles.buttonIcon}
                                            />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className={styles.pagination}>
                        <button>&lt;</button>
                        <button className={styles.active}>1</button>
                        <button>2</button>
                        <button>3</button>
                        <button>&gt;</button>
                    </div>
                </main>
            </div>
        </>
    );
}

export default ManagerFreeboard;