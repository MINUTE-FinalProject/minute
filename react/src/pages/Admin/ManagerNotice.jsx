import { useEffect, useState } from 'react'; // useEffect 추가
import { Link } from 'react-router-dom';
import searchButtonIcon from "../../assets/images/search_icon.png";
import styles from './ManagerNotice.module.css';


// Pagination 컴포넌트 임포트
import Pagination from '../../components/Pagination/Pagination';

// 예시 데이터: isImportant 속성 사용, 데이터 양 증가
const generateInitialNotices = (count = 35) => { // 35개의 목업 데이터 생성
    const notices = [];
    for (let i = 1; i <= count; i++) {
        const isImportant = i % 7 === 0 || i === 1; // 7의 배수 또는 첫번째 공지를 중요 공지로
        notices.push({
            id: i.toString(),
            no: isImportant ? '중요' : i,
            title: `공지사항 제목 ${i} ${isImportant ? "(필독 이벤트 관련 중요 안내입니다)" : "(일반 공지 사항)"}`,
            date: `2025.05.${String(15 - (i % 15)).padStart(2, '0')}`,
            isImportant: isImportant,
        });
    }
    // 중요 공지를 위로, 그 다음 최신순으로 정렬 (예시)
    return notices.sort((a, b) => {
        if (a.isImportant !== b.isImportant) {
            return a.isImportant ? -1 : 1;
        }
        // 날짜 또는 ID로 추가 정렬 가능 (여기서는 ID 역순으로 최신처럼 가정)
        return parseInt(b.id) - parseInt(a.id); 
    }).map((notice, index) => ({ // NO 재정렬 (중요 공지 제외)
        ...notice,
        no: notice.isImportant ? '중요' : (notices.filter(n => !n.isImportant).findIndex(n => n.id === notice.id) + 1)
    }));
};


function ManagerNotice() {
    const [allNotices, setAllNotices] = useState([]); // 원본 또는 필터링될 전체 데이터
    const [noticesToDisplay, setNoticesToDisplay] = useState([]); // 현재 테이블에 표시될 전체 목록 (페이지네이션 전)

    // --- 페이지네이션 상태 ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // 페이지 당 공지사항 수

    // 데이터 초기 로드 및 필터/검색 변경 시 업데이트 로직 (예시)
    useEffect(() => {
        const loadedNotices = generateInitialNotices();
        setAllNotices(loadedNotices);
        // TODO: 여기에 실제 필터링/검색 로직 적용하여 setNoticesToDisplay 호출
        // 지금은 allNotices를 그대로 사용
        setNoticesToDisplay(loadedNotices); 
        setCurrentPage(1); // 데이터 변경 시 1페이지로
    }, []); // 초기 로드 시 한 번만 실행 (실제로는 필터 조건 변경 시에도 실행)


    const handleToggleImportant = (id) => {
        // noticesToDisplay 와 allNotices 둘 다 업데이트 필요할 수 있음 (필터 상태에 따라)
        const updateLogic = (prevNotices) => 
            prevNotices.map(notice =>
                notice.id === id ? { ...notice, isImportant: !notice.isImportant } : notice
            );
        
        setAllNotices(updateLogic);
        setNoticesToDisplay(updateLogic); // 현재 보여주는 목록도 바로 갱신

        // TODO: API 호출로 서버에 실제 중요도 상태 업데이트
        console.log(`Notice ID ${id} importance toggled.`);
    };

    const handleToggleAllImportant = (e) => {
        const newImportance = e.target.checked;
        // 주의: 이 로직은 현재 noticesToDisplay (페이지네이션 되기 전 목록) 전체에 적용됨
        // 페이지네이션 된 currentDisplayedNotices에만 적용하려면 로직 수정 필요
        const updateLogic = (prevNotices) => 
            prevNotices.map(n => ({ ...n, isImportant: newImportance }));

        setAllNotices(updateLogic);
        setNoticesToDisplay(updateLogic);
        console.log(`All displayed notices importance toggled to: ${newImportance}`);
    };
    
    // 헤더 체크박스 상태 결정: 현재 noticesToDisplay 기준
    const areAllCurrentlyImportant = noticesToDisplay.length > 0 && noticesToDisplay.every(n => n.isImportant);

    const handleEdit = (id) => console.log(`Edit notice: ${id}`);
    const handleDelete = (id) => {
        if (window.confirm(`정말로 공지사항(ID: ${id})을 삭제하시겠습니까?`)) {
            const updateLogic = (prevNotices) => prevNotices.filter(n => n.id !== id);
            setAllNotices(updateLogic);
            setNoticesToDisplay(updateLogic);
            console.log(`Delete notice: ${id}`);
            // TODO: API로 서버에서 삭제
        }
    };
    const handleWriteNew = () => {
        // navigate('/admin/notice/write') // 예시: 작성 페이지로 이동
        console.log('Navigate to write new notice page');
    }

    // --- 페이지네이션 로직 ---
    const totalPages = Math.ceil(noticesToDisplay.length / itemsPerPage);
    const indexOfLastNotice = currentPage * itemsPerPage;
    const indexOfFirstNotice = indexOfLastNotice - itemsPerPage;
    const currentDisplayedNotices = noticesToDisplay.slice(indexOfFirstNotice, indexOfLastNotice);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>

            <div className={styles.container}>

                <main className={styles.managerContent}>
                    <h1 className={styles.pageTitle}>공지사항 관리</h1>

                    <div className={styles.filterBar}>
                                            <input type="date" className={styles.filterElement} />
                                            <span className={styles.dateSeparator}>~</span>
                                            <input type="date" className={styles.filterElement} />
                                            <select className={styles.filterElement}>
                                                <option value="all">상태 (전체)</option>
                                                <option value="answered">답변완료</option>
                                                <option value="unanswered">미답변</option>
                                            </select>
                                            <input type="text" placeholder="검색어를 입력하세요" className={`${styles.filterElement} ${styles.filterSearchInput}`} />
                                            <button type="button" className={styles.filterSearchButton}>
                                                <img src={searchButtonIcon} alt="검색" className={styles.searchIcon} />
                                            </button>
                                        </div>

                    <h2 className={styles.subTitle}>공지사항 목록</h2>

                    <table className={styles.noticeTable}>
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        title="현재 목록 전체 중요도 설정/해제"
                                        checked={areAllCurrentlyImportant}
                                        onChange={handleToggleAllImportant}
                                        disabled={noticesToDisplay.length === 0} // 아이템 없으면 비활성화
                                    />
                                </th>
                                <th>NO</th>
                                <th className={styles.titleColumn}>제목</th>
                                <th>작성일</th>
                                <th>수정/삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDisplayedNotices.length > 0 ? (
                                currentDisplayedNotices.map((notice) => (
                                    <tr key={notice.id} className={notice.isImportant ? styles.importantRow : ''}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={notice.isImportant}
                                                onChange={() => handleToggleImportant(notice.id)}
                                                title={notice.isImportant ? "중요 공지 해제" : "중요 공지로 설정"}
                                            />
                                        </td>
                                        <td>{notice.isImportant ? <span className={styles.importantTag}>중요</span> : notice.no}</td>
                                        <td className={styles.tableTitleContent}>
                                            <Link to={`/admin/notice/${notice.id}`} className={styles.titleLink}> {/* 관리자용 상세 경로 */}
                                                {notice.title}
                                            </Link>
                                        </td>
                                        <td>{notice.date}</td>
                                        <td>
                                            <button onClick={() => handleEdit(notice.id)} className={`${styles.actionButton} ${styles.editButton}`}>수정</button>
                                            <button onClick={() => handleDelete(notice.id)} className={`${styles.actionButton} ${styles.deleteButton}`}>삭제</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">표시할 공지사항이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className={styles.bottomActions}>
                        {/* Link 컴포넌트나 navigate 함수를 사용하여 작성 페이지로 이동 */}
                        <Link to="/admin/notice/write" className={`${styles.actionButton} ${styles.writeButton}`}>작성</Link>
                    </div>
                    
                    {/* 페이지네이션 컴포넌트 적용 */}
                    {/* styles.pagination 클래스를 가진 div로 한번 감싸서 기존 CSS의 레이아웃(중앙정렬 등)을 활용 */}
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
        </>
    );
}

export default ManagerNotice;