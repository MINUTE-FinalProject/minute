// src/pages/Admin/ReportedPosts.jsx (또는 해당 파일의 실제 경로)
import { useEffect, useState } from 'react'; // React import 추가
import { useNavigate } from 'react-router-dom';
import searchButtonIcon from "../../assets/images/search_icon.png";
import Modal from '../../components/Modal/Modal'; // Modal 컴포넌트 import
import Pagination from '../../components/Pagination/Pagination';
import styles from './ReportedPosts.module.css';

const generateInitialReportedItems = (count = 45) => {
    // ... (기존 generateInitialReportedItems 함수 내용 유지)
    const items = [];
    const postTypes = ['게시글', '댓글'];
    const userNicknames = ['여행가고파', '맛집킬러', '정의의사도', '친구찾기', '새로운유저', '익명123'];
    const hiddenStatuses = ['공개', '숨김'];
    for (let i = 0; i < count; i++) {
        const postType = postTypes[i % postTypes.length];
        items.push({
            id: `reportItem-${i + 1}`,
            postType: postType,
            originalPostId: `${postType === '게시글' ? 'fp' : 'fc'}${100 + i}`,
            titleOrContentSnippet: `${postType} 내용 ${i + 1} - ${i % 3 === 0 ? '약간 긴 내용으로 테스트합니다. 잘리는지 확인해보세요.' : '짧은 내용.'} (신고 사유: ${i % 4 === 0 ? '욕설' : (i % 4 === 1 ? '광고' : '비방')})`,
            authorId: `user${String.fromCharCode(65 + (i % 10))}${i}`,
            authorNickname: userNicknames[i % userNicknames.length],
            originalPostDate: `2025.0${(i % 6) + 1}.${String(25 - (i % 25) + 1).padStart(2, '0')}`,
            reportCount: Math.floor(Math.random() * 10) + (i % 7 === 0 ? 5 : 0),
            hiddenStatus: hiddenStatuses[i % hiddenStatuses.length],
        });
    }
    return items;
};

function ReportedPosts() {
    const navigate = useNavigate();
    const [allReportedItems, setAllReportedItems] = useState([]);
    const [filteredReportedItems, setFilteredReportedItems] = useState([]);
    const [activeContentTypeTab, setActiveContentTypeTab] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [hideFilter, setHideFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 모달 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalProps, setModalProps] = useState({
        title: '',
        message: '',
        onConfirm: null,
        confirmText: '확인',
        cancelText: null,
        type: 'default',
        confirmButtonType: 'primary',
        cancelButtonType: 'secondary'
    });

    useEffect(() => {
        const initialItems = generateInitialReportedItems().map(item => ({
            ...item,
            reportCount: item.reportCount === undefined ? (Math.floor(Math.random() * 5) + (parseInt(item.id.split('-')[1] || 0) % 3 === 0 ? 3:0) ) : item.reportCount
        }));
        setAllReportedItems(initialItems);
    }, []);

    useEffect(() => {
        let itemsToFilter = [...allReportedItems];
        if (activeContentTypeTab === 'post') {
            itemsToFilter = itemsToFilter.filter(item => item.postType === '게시글');
        } else if (activeContentTypeTab === 'comment') {
            itemsToFilter = itemsToFilter.filter(item => item.postType === '댓글');
        }
        if (hideFilter !== 'all') {
            itemsToFilter = itemsToFilter.filter(item => item.hiddenStatus === hideFilter);
        }
        if (searchTerm.trim() !== '') {
            const lowercasedFilter = searchTerm.toLowerCase();
            itemsToFilter = itemsToFilter.filter(item =>
                item.authorId.toLowerCase().includes(lowercasedFilter) ||
                item.authorNickname.toLowerCase().includes(lowercasedFilter) ||
                item.titleOrContentSnippet.toLowerCase().includes(lowercasedFilter)
            );
        }
        setFilteredReportedItems(itemsToFilter);
        setCurrentPage(1);
    }, [activeContentTypeTab, allReportedItems, dateRange, hideFilter, searchTerm]);

    // --- 숨김/공개 상태 변경 처리 (Modal 적용) ---
    const processToggleHiddenStatus = (reportId, currentStatus) => {
        const newStatus = currentStatus === '공개' ? '숨김' : '공개';
        setAllReportedItems(prevItems =>
            prevItems.map(item =>
                item.id === reportId
                    ? { ...item, hiddenStatus: newStatus }
                    : item
            )
        );
        // TODO: API로 실제 상태 업데이트

        setModalProps({
            title: "상태 변경 완료",
            message: `항목 ID '${reportId}'의 상태가 "${newStatus}"(으)로 성공적으로 변경되었습니다.`,
            confirmText: "확인",
            type: "adminSuccess", // 핑크 버튼을 원하시면 'success'
            confirmButtonType: 'primary'
        });
        setIsModalOpen(true);
    };

    const handleToggleHiddenStatus = (e, reportId, currentStatus, itemSnippet) => {
        e.stopPropagation(); // 행 클릭 이벤트 전파 방지
        const newStatus = currentStatus === '공개' ? '숨김' : '공개';
        const snippetToShow = itemSnippet.length > 20 ? `${itemSnippet.substring(0, 20)}...` : itemSnippet;

        setModalProps({
            title: "숨김 상태 변경 확인",
            message: `"${snippetToShow}" (ID: ${reportId}) 항목의 상태를 \n"${currentStatus}"에서 "${newStatus}"(으)로 변경하시겠습니까?`,
            onConfirm: () => processToggleHiddenStatus(reportId, currentStatus),
            confirmText: "변경",
            cancelText: "취소",
            type: "adminConfirm",
            confirmButtonType: newStatus === '숨김' ? 'danger' : 'primary' // 숨김 처리 시 버튼 강조
        });
        setIsModalOpen(true);
    };

    const totalPages = Math.ceil(filteredReportedItems.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDisplayedItems = filteredReportedItems.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRowClick = (item) => {
        navigate(`/admin/managerFreeboardDetail/${item.originalPostId}${item.postType === '댓글' ? `?commentFocusId=${item.id}`: ''}`);
    };

    return (
        <>
            <div className={styles.container}>
                <main className={styles.reportedPostsContentCard}>
                    <h1 className={styles.pageTitle}>신고된 게시물 관리</h1>

                    <div className={styles.tabContainer}>
                        <button className={`${styles.tabButton} ${activeContentTypeTab === 'all' ? styles.activeTab : ''}`} onClick={() => setActiveContentTypeTab('all')}>전체</button>
                        <button className={`${styles.tabButton} ${activeContentTypeTab === 'post' ? styles.activeTab : ''}`} onClick={() => setActiveContentTypeTab('post')}>게시글</button>
                        <button className={`${styles.tabButton} ${activeContentTypeTab === 'comment' ? styles.activeTab : ''}`} onClick={() => setActiveContentTypeTab('comment')}>댓글</button>
                    </div>

                    <div className={styles.filterBar}>
                        <input type="date" className={styles.filterElement} value={dateRange.start} onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}/>
                        <span className={styles.dateSeparator}>~</span>
                        <input type="date" className={styles.filterElement} value={dateRange.end} onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}/>
                        <select className={`${styles.filterElement} ${styles.filterSelect}`} value={hideFilter} onChange={(e) => setHideFilter(e.target.value)}>
                            <option value="all">숨김상태 (전체)</option>
                            <option value="공개">공개</option>
                            <option value="숨김">숨김</option>
                        </select>
                        <input type="text" placeholder="ID, 닉네임, 내용 검색" className={`${styles.filterElement} ${styles.filterSearchInput}`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                        <button type="button" className={styles.filterSearchButton}><img src={searchButtonIcon} alt="검색" className={styles.searchIcon} /></button>
                    </div>

                    <table className={styles.reportsTable}>
                        <thead>
                            <tr>
                                <th>NO</th>
                                <th>ID</th>
                                <th>닉네임</th>
                                <th className={styles.titleColumn}>제목/내용일부</th>
                                <th>작성일</th>
                                <th>누적횟수</th>
                                <th>숨김상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDisplayedItems.length > 0 ? (
                                currentDisplayedItems.map((item, index) => (
                                    <tr key={item.id} onClick={() => handleRowClick(item)} className={styles.clickableRow}>
                                        <td>{indexOfFirstItem + index + 1}</td>
                                        <td>{item.authorId}</td>
                                        <td>{item.authorNickname}</td>
                                        <td className={styles.contentSnippetCell}>
                                            {item.titleOrContentSnippet.length > 30
                                                ? `${item.titleOrContentSnippet.substring(0, 30)}...`
                                                : item.titleOrContentSnippet}
                                        </td>
                                        <td>{item.originalPostDate}</td>
                                        <td>{item.reportCount}</td>
                                        <td>
                                            <button
                                                onClick={(e) => handleToggleHiddenStatus(e, item.id, item.hiddenStatus, item.titleOrContentSnippet)}
                                                className={`${styles.status} ${item.hiddenStatus === '공개' ? styles.activeStatus : styles.inactiveStatus}`}
                                                title={`${item.hiddenStatus} 상태 (클릭하여 변경)`}
                                            >
                                                {item.hiddenStatus}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">표시할 신고된 항목이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className={styles.pagination}>
                        {totalPages > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </main>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                {...modalProps}
            />
        </>
    );
}

export default ReportedPosts;