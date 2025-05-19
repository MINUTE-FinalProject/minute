// ManagerNoticeDetail.jsx (상단 링크 변경, 하단 목록 버튼 제거)
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './ManagerNoticeDetail.module.css';

// 샘플 데이터
const sampleNotices = {
    'sticky': { id: 'sticky', isImportant: true, title: '이벤트 당첨자 발표 안내 (필독)', author: '관리자', views: 1024, createdAt: '2025.05.10', content: "안녕하세요. 사용자 여러분께 안내 말씀드립니다.\n\n보다 안정적인 서비스 제공을 위해 아래와 같이 서버 점검을 실시할 예정입니다.\n점검 시간 동안에는 서비스 이용이 일시적으로 중단될 수 있으니 양해 부탁드립니다.\n\n- 점검 일시: 2025년 5월 15일 (목) 02:00 ~ 04:00 (2시간)\n- 점검 내용: 서버 안정화 및 성능 개선 작업\n\n항상 최선을 다하는 서비스가 되겠습니다.\n감사합니다." },
    '1': { id: '1', isImportant: false, title: '첫 번째 일반 공지사항입니다.', author: '관리자', views: 123, createdAt: '2025.05.02', content: "첫 번째 공지사항의 내용입니다. \n\n상세 내용을 확인해주세요." },
    '2': { id: '2', isImportant: true, title: '두 번째 중요 공지사항입니다.', author: '관리자', views: 456, createdAt: '2025.05.01', content: "두 번째 중요 공지사항의 내용입니다. \n\n필독 바랍니다." },
};

const getNoticeById = (id) => {
    return sampleNotices[id] || null;
};

function ManagerNoticeDetail() {
    const { noticeId } = useParams();
    const navigate = useNavigate();
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // console.log("Fetching notice for ID (from URL):", noticeId); // 디버깅용
        setTimeout(() => { 
            let fetchedNotice = getNoticeById(noticeId);
            if (!fetchedNotice) {
                // console.warn(`Notice ID "${noticeId}" not found or invalid. Displaying a default notice.`);
                fetchedNotice = sampleNotices['sticky'] || Object.values(sampleNotices).find(n => n !== null);
            }
            setNotice(fetchedNotice);
            setLoading(false);
        }, 500);
    }, [noticeId]);

    const handleEdit = () => {
        if (!notice) return;
        // console.log(`Edit notice ID: ${notice.id}`);
        navigate(`/admin/managerNoticeEdit/${notice.id}`); // 실제 수정 페이지 경로로 수정
    };

    const handleDelete = () => {
        if (!notice) return;
        if (window.confirm(`공지사항 "${notice.title}"을(를) 정말 삭제하시겠습니까?`)) {
            // console.log(`Delete notice ID: ${notice.id}`);
            // API 호출 후 목록 페이지로 이동
            alert('공지사항이 삭제되었습니다. (실제 삭제는 API 연동 필요)');
            navigate('/admin/notice'); // 공지사항 목록 페이지 경로로 수정
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <main className={styles.managerContent}>
                    <p>공지사항을 불러오는 중입니다...</p>
                </main>
            </div>
        );
    }

    if (!notice) {
        return (
            <div className={styles.container}>
                <main className={styles.managerContent}>
                     {/* === 상단 링크/제목 영역 (자유게시판 상세와 유사하게) === */}
                    <div className={styles.pageHeader}>
                        <Link to="/admin/notice" className={styles.toListLink}>
                            <h1>공지사항 관리</h1>
                        </Link>
                    </div>
                    <p>표시할 공지사항 데이터가 없습니다.</p>
                </main>
            </div>
        );
    }

    return (
        <>
            <div className={styles.container}>
                <main className={styles.managerContent}>
                    {/* === 상단 링크/제목 영역 (자유게시판 상세와 유사하게) === */}
                    <div className={styles.pageHeader}>
                        <Link to="/admin/notice" className={styles.toListLink}>
                            <h1>공지사항 관리</h1>
                        </Link>
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
                                    {index < notice.content.split('\n').length - 1 && <br />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className={styles.actionsContainer}>
                        {/* 목록 버튼 제거됨, 필요시 Link 태그로 상단과 유사하게 배치 가능하나 현재는 삭제 */}
                        {/* <Link to="/admin/notice" className={`${styles.actionButton} ${styles.listButton}`}>목록</Link> */}
                        <div> {/* 오른쪽 정렬을 위해 div로 그룹핑 */}
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