import { useState } from 'react';
import { Link } from 'react-router-dom';
import searchButtonIcon from "../../assets/images/search_icon.png"; // 경로 확인
import Header from '../../components/Header/Header'; // 경로 확인
import Sidebar from '../../components/Sidebar/Sidebar'; // 경로 확인
import styles from './ManagerNotice.module.css';

// 예시 데이터: isImportant 속성 사용
const initialNotices = [
    { id: 'sticky', no: '중요', title: '이벤트 당첨자 발표 안내 (필독)', date: '2025-04-24', isImportant: true },
    { id: 1, no: 1, title: '문의 제목 (일반 공지 1)', date: '2025-04-23', isImportant: false },
    { id: 2, no: 2, title: '문의 제목 (일반 공지 2)', date: '2025-04-22', isImportant: true }, // 예시: 중요 공지
    { id: 3, no: 3, title: '문의 제목 (일반 공지 3)', date: '2025-04-21', isImportant: false },
    // ...더 많은 공지사항 데이터
];

function ManagerNotice() {
    const [notices, setNotices] = useState(initialNotices);
    // const [isAllImportant, setIsAllImportant] = useState(false); // 헤더 체크박스용 (선택적 기능)

    // 각 공지사항의 중요도 상태를 토글하는 함수
    const handleToggleImportant = (id) => {
        setNotices(
            notices.map(notice =>
                notice.id === id ? { ...notice, isImportant: !notice.isImportant } : notice
            )
        );
        // TODO: API 호출로 서버에 실제 중요도 상태 업데이트
        console.log(`Notice ID ${id} importance toggled to: ${!notices.find(n => n.id === id)?.isImportant}`);
    };

    // 헤더 체크박스 핸들러 (선택적: 모든 공지 중요도 일괄 변경 기능)
    // 현재는 단순히 모든 로컬 상태의 isImportant를 바꾸는 예시입니다.
    // 실제 사용 시에는 현재 페이지의 공지만 변경하거나, API와 연동해야 합니다.
    const handleToggleAllImportant = (e) => {
        const newImportance = e.target.checked;
        // setIsAllImportant(newImportance); // 헤더 체크박스 자체의 상태
        setNotices(notices.map(n => ({ ...n, isImportant: newImportance })));
        console.log(`All notices importance toggled to: ${newImportance}`);
        // TODO: API 호출 (일괄 변경은 신중해야 함)
    };
    
    // 현재 페이지의 모든 아이템이 important인지 확인 (헤더 체크박스 상태 동기화용)
    const areAllCurrentlyImportant = notices.length > 0 && notices.every(n => n.isImportant);


    // TODO: 실제 수정, 삭제, 작성 기능 구현
    const handleEdit = (id) => console.log(`Edit notice: ${id}`);
    const handleDelete = (id) => console.log(`Delete notice: ${id}`);
    const handleWriteNew = () => console.log('Navigate to write new notice page');

    return (
        <>
            <Header />
            <div className={styles.container}>
                <Sidebar />
                <main className={styles.managerContent}>
                    <h1 className={styles.pageTitle}>공지사항</h1>

                    <div className={styles.filterBar}>
                        <input type="date" className={styles.filterDate} />
                        <input type="date" className={styles.filterDate} />
                        <div className={styles.searchContainer}>
                            <input type="text" placeholder="검색어를 입력하세요" className={styles.filterSearchInput} />
                            <button type="button" className={styles.filterSearchButton}>
                                <img src={searchButtonIcon} alt="검색" className={styles.filterSearchIcon} />
                            </button>
                        </div>
                    </div>

                    <h2 className={styles.subTitle}>공지사항 목록</h2>

                    <table className={styles.noticeTable}>
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        title="모든 공지 중요도 설정/해제"
                                        checked={areAllCurrentlyImportant} // 모든 항목이 중요하면 체크됨
                                        onChange={handleToggleAllImportant}
                                    />
                                </th>
                                <th>NO</th>
                                <th className={styles.titleColumn}>제목</th>
                                <th>작성일</th>
                                <th>수정/삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notices.map((notice) => (
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
                                        <Link to={`/notice/${notice.id}`} className={styles.titleLink}> {/* 실제 상세 페이지 경로로 수정 */}
                                            {notice.title}
                                        </Link>
                                    </td>
                                    <td>{notice.date}</td>
                                    <td>
                                        <button onClick={() => handleEdit(notice.id)} className={`${styles.actionButton} ${styles.editButton}`}>수정</button>
                                        <button onClick={() => handleDelete(notice.id)} className={`${styles.actionButton} ${styles.deleteButton}`}>삭제</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className={styles.bottomActions}>
                        <button onClick={handleWriteNew} className={`${styles.actionButton} ${styles.writeButton}`}>작성</button>
                    </div>

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

export default ManagerNotice;