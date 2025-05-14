import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header/Header'; // 경로 확인
import Sidebar from '../../components/Sidebar/Sidebar'; // 경로 확인
import styles from './ManagerNoticeDetail.module.css';

// 샘플 데이터 (컴포넌트 외부 또는 최상단에 정의하여 useEffect에서도 접근 가능하도록)
const sampleNotices = {
    'sticky': { id: 'sticky', isImportant: true, title: '이벤트 당첨자 발표 안내 (필독)', author: '관리자', views: 1024, createdAt: '2025.05.10', content: "안녕하세요. 사용자 여러분께 안내 말씀드립니다.\n\n보다 안정적인 서비스 제공을 위해 아래와 같이 서버 점검을 실시할 예정입니다.\n점검 시간 동안에는 서비스 이용이 일시적으로 중단될 수 있으니 양해 부탁드립니다.\n\n- 점검 일시: 2025년 5월 15일 (목) 02:00 ~ 04:00 (2시간)\n- 점검 내용: 서버 안정화 및 성능 개선 작업\n\n항상 최선을 다하는 서비스가 되겠습니다.\n감사합니다." },
    '1': { id: '1', isImportant: false, title: '첫 번째 일반 공지사항입니다.', author: '관리자', views: 123, createdAt: '2025.05.02', content: "첫 번째 공지사항의 내용입니다. \n\n상세 내용을 확인해주세요." },
    '2': { id: '2', isImportant: true, title: '두 번째 중요 공지사항입니다.', author: '관리자', views: 456, createdAt: '2025.05.01', content: "두 번째 중요 공지사항의 내용입니다. \n\n필독 바랍니다." },
    // 다른 공지 데이터 추가 가능
};

const getNoticeById = (id) => {
    return sampleNotices[id] || null;
};

function ManagerNoticeDetail() {
    const { noticeId } = useParams();
    const navigate = useNavigate();
    const [notice, setNotice] = useState(null); // 초기값은 null로 유지
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        console.log("Fetching notice for ID (from URL):", noticeId);
        setTimeout(() => { // API 호출 시뮬레이션
            let fetchedNotice = getNoticeById(noticeId);

            // --- 디자인 확인을 위해 수정된 부분 ---
            if (!fetchedNotice) {
                // URL의 noticeId로 데이터를 찾지 못했거나, noticeId가 없는 경우 기본 공지 표시
                console.warn(`Notice ID "${noticeId}" not found or invalid. Displaying a default notice for design preview.`);
                // 표시할 기본 공지 (예: 'sticky' 또는 목록의 첫 번째 유효한 공지)
                fetchedNotice = sampleNotices['sticky'] || Object.values(sampleNotices).find(n => n !== null);
            }
            // ------------------------------------

            setNotice(fetchedNotice);
            setLoading(false);
        }, 500);
    }, [noticeId]); // noticeId가 변경될 때마다 데이터를 다시 가져옴

    const handleEdit = () => {
        if (!notice) return;
        console.log(`Edit notice ID: ${notice.id}`);
        // navigate(`/admin/notice/edit/${notice.id}`); // 예시 경로
    };

    const handleDelete = () => {
        if (!notice) return;
        if (window.confirm(`공지사항 "${notice.title}"을(를) 정말 삭제하시겠습니까?`)) {
            console.log(`Delete notice ID: ${notice.id}`);
            // API 호출 후 목록 페이지로 이동
            // navigate('/admin/notice'); // 예시 경로
        }
    };

    if (loading) {
        return ( // 로딩 중에도 Layout 적용
            <>
                <Header />
                <div className={styles.container}>
                    <Sidebar />
                    <main className={styles.managerContent}>
                        <p>공지사항을 불러오는 중입니다...</p>
                    </main>
                </div>
            </>
        );
    }

    // useEffect에서 기본값을 설정해주므로, !notice가 뜨는 경우는 sampleNotices가 비었거나 모든 값이 null인 극히 드문 경우
    // 또는 초기 렌더링 시 아주 잠깐일 수 있습니다.
    // 하지만 디자인 확인을 위해, 만약 notice가 그래도 null이면 (예: sampleNotices가 아예 비어있다면) 오류 대신 다른 처리를 할 수도 있습니다.
    // 현재 로직으로는 useEffect에서 defaultNotice를 설정하므로, 이 조건은 거의 발생하지 않습니다.
    if (!notice) {
        return (
            <>
                <Header />
                <div className={styles.container}>
                    <Sidebar />
                    <main className={styles.managerContent}>
                        <div className={styles.titleArea}>
                             <Link to="/admin/notice" className={styles.backToListLink}>&lt; 공지사항 목록</Link>
                        </div>
                        <p>표시할 공지사항 데이터가 없습니다. (예시 데이터 확인 필요)</p>
                    </main>
                </div>
            </>
        );
    }

    // 정상적으로 notice 데이터가 있을 때 렌더링
    return (
        <>
            <Header />
            <div className={styles.container}>
                <Sidebar />
                <main className={styles.managerContent}>
                    <div className={styles.titleArea}>
                        <Link to="/admin/notice" className={styles.backToListLink}>&lt; 공지사항 목록</Link>
                        {/* 실제 공지 제목을 페이지의 주 제목으로 사용하거나, 별도 h1 사용 */}
                        {/* <h1>{notice.title}</h1> */}
                    </div>

                    <div className={styles.noticeDetailCard}>
                        <div className={styles.infoBar}>
                            <div className={styles.infoLeft}>
                                {notice.isImportant && (
                                    <span className={styles.importantTag}>중요</span>
                                )}
                                <h2 className={styles.noticeTitleText}>{notice.title}</h2>
                            </div>
                            <div className={styles.infoRight}>
                                <span className={styles.author}>작성자: {notice.author}</span>
                                <span className={styles.createdAt}>작성일: {notice.createdAt}</span>
                                {notice.views !== undefined && <span className={styles.views}>조회수: {notice.views}</span>}
                            </div>
                        </div>

                        <div className={styles.contentBody}>
                            {notice.content.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className={styles.actionsContainer}>
                        <button onClick={() => navigate('/admin/notice')} className={`${styles.actionButton} ${styles.listButton}`}>목록</button>
                        <div>
                            <button onClick={handleEdit} className={`${styles.actionButton} ${styles.editButton}`}>수정</button>
                            <button onClick={handleDelete} className={`${styles.actionButton} ${styles.deleteButton}`}>삭제</button>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

export default ManagerNoticeDetail;