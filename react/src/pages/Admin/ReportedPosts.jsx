import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import searchButtonIcon from "../../assets/images/search_icon.png"; // 실제 경로로 수정해주세요
import Header from '../../components/Header/Header'; // 실제 경로로 수정해주세요
import Sidebar from '../../components/Sidebar/Sidebar'; // 실제 경로로 수정해주세요
import styles from './ReportedPosts.module.css';

// 예시 데이터
const initialReportedItems = [
    { 
        id: 1, postType: '게시글', originalPostId: 'fp101', titleOrContentSnippet: '이 여행지 정말 최악이네요 (욕설 포함)...', authorId: 'userA', authorNickname: '여행가고파', reportCount: 5, originalPostDate: '2025-05-01', hiddenStatus: '공개' 
    },
    { 
        id: 2, postType: '댓글', originalPostId: 'fc205', titleOrContentSnippet: 'Re: 맛집 추천 좀... (광고성 댓글 의심)', authorId: 'userB', authorNickname: '맛집킬러', reportCount: 2, originalPostDate: '2025-04-28', hiddenStatus: '숨김'
    },
    { 
        id: 3, postType: '게시글', originalPostId: 'fp102', titleOrContentSnippet: '특정 사용자 저격 및 비방하는 글입니다.', authorId: 'userC', authorNickname: '정의의사도', reportCount: 3, originalPostDate: '2025-04-23', hiddenStatus: '공개'
    },
    { 
        id: 4, postType: '댓글', originalPostId: 'fc208', titleOrContentSnippet: 'Re: 같이 갈 사람 구해요 (불쾌감을 유발하는 내용)', authorId: 'userD', authorNickname: '친구찾기', reportCount: 1, originalPostDate: '2025-04-22', hiddenStatus: '숨김'
    },
];

// 숨김 상태에 따른 스타일을 위한 헬퍼 함수
const getHiddenStatusStyle = (status) => {
    if (status === '숨김') {
        return styles.statusHidden;
    }
    return styles.statusPublic;
};

function ReportedPosts() {
    const [allReportedItems, setAllReportedItems] = useState(initialReportedItems);
    const [filteredReportedItems, setFilteredReportedItems] = useState(initialReportedItems);
    
    // "전체" 탭이 없어지므로, 초기 선택 탭을 '게시글' 또는 '댓글' 중 하나로 설정
    const [activeContentTypeTab, setActiveContentTypeTab] = useState('post'); // 예: '게시글'을 기본으로

    const toggleHiddenStatus = (reportId) => {
        setAllReportedItems(prevItems =>
            prevItems.map(item =>
                item.id === reportId ? { ...item, hiddenStatus: item.hiddenStatus === '공개' ? '숨김' : '공개' } : item
            )
        );
    };
    
    useEffect(() => {
        let itemsToFilter = allReportedItems;
        
        // "전체" 탭이 없으므로 해당 조건 제거, '게시글' 또는 '댓글'에 따라 필터링
        if (activeContentTypeTab === 'post') {
            itemsToFilter = allReportedItems.filter(item => item.postType === '게시글');
        } else if (activeContentTypeTab === 'comment') {
            itemsToFilter = allReportedItems.filter(item => item.postType === '댓글');
        }
        // else { 
             // 초기 상태나 예외 처리 (현재는 'post' 또는 'comment'만 가능)
             // itemsToFilter = []; // 또는 기본값으로 게시글을 보여줄 수 있음
        // }

        // TODO: 여기에 날짜, 숨김상태, 검색어 등 다른 필터 로직 추가
        setFilteredReportedItems(itemsToFilter);
    }, [activeContentTypeTab, allReportedItems]); // 의존성 배열에 activeContentTypeTab, allReportedItems 포함

    return (
        <>
            <Header />
            <div className={styles.container}>
                <Sidebar />
                <main className={styles.reportedPostsContent}>
                    <h1 className={styles.pageTitle}>신고된 게시물 관리</h1>

                    {/* --- "전체" 탭 제거된 게시글/댓글 탭 --- */}
                    <div className={styles.tabContainer}>
                        <button
                            className={`${styles.tabButton} ${activeContentTypeTab === 'post' ? styles.activeTab : ''}`}
                            onClick={() => setActiveContentTypeTab('post')}
                        >
                            게시글
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeContentTypeTab === 'comment' ? styles.activeTab : ''}`}
                            onClick={() => setActiveContentTypeTab('comment')}
                        >
                            댓글
                        </button>
                    </div>
                    {/* ------------------------------------ */}

                    <div className={styles.filterBar}>
                        <input type="date" className={styles.filterInput} aria-label="시작일"/>
                        <input type="date" className={styles.filterInput} aria-label="종료일"/>
                        <select className={styles.filterSelect} aria-label="숨김상태 필터">
                            <option value="">숨김상태▼</option>
                            <option value="public">공개</option>
                            <option value="hidden">숨김</option>
                        </select>
                        <select className={styles.filterSelect} aria-label="정렬순서">
                            <option value="">정렬순▼</option>
                            <option value="reportCount_desc">신고횟수 많은 순</option>
                            <option value="date_desc">최근 작성일 순</option>
                        </select>
                        <input type="text" placeholder="ID, 닉네임, 제목/내용 검색" className={styles.filterSearchInput} />
                        <button type="button" className={styles.filterSearchButton} aria-label="검색">
                            <img src={searchButtonIcon} alt="검색" className={styles.filterSearchIcon} />
                        </button>
                    </div>

                    <table className={styles.reportsTable}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>신고횟수</th>
                                <th>ID</th>
                                <th>닉네임</th>
                                <th className={styles.titleColumn}>제목/내용(일부)</th>
                                <th>작성일</th>
                                <th>숨김상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReportedItems.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.reportCount}</td>
                                    <td>{item.authorId}</td>
                                    <td>{item.authorNickname}</td>
                                    <td className={styles.contentSnippetCell}>
                                        <Link 
                                            to={`/${item.postType === '게시글' ? 'freeboard' : 'comment'}/${item.originalContentId}`} // 실제 경로로 수정 필요
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            title="원본 콘텐츠 보기"
                                            className={styles.contentLink}
                                        >
                                            {item.titleOrContentSnippet.length > 25 ? `${item.titleOrContentSnippet.substring(0, 25)}...` : item.titleOrContentSnippet}
                                        </Link>
                                    </td>
                                    <td>{item.originalPostDate}</td>
                                    <td>
                                        <button 
                                            onClick={() => toggleHiddenStatus(item.id)} 
                                            className={`${styles.statusButton} ${getHiddenStatusStyle(item.hiddenStatus)}`}
                                            title={`${item.hiddenStatus} 상태 (클릭하여 변경)`}
                                        >
                                            {item.hiddenStatus}
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
                        <button>&gt;</button>
                    </div>
                </main>
            </div>
        </>
    );
}

export default ReportedPosts;