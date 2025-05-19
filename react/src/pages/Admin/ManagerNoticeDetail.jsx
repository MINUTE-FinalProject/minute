// ManagerNoticeDetail.jsx (수정 버튼 클릭 시 수정 페이지로 이동 기능 활성화)
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './ManagerNoticeDetail.module.css';

// 샘플 데이터: ManagerNoticeEdit.jsx의 sampleNotices와 키 형식을 일치시키는 것이 중요합니다.
// 여기서는 ManagerNoticeEdit.jsx에서 사용했던 키 형식('sticky', '1', '2')을 따르겠습니다.
// 또는, ManagerNotice.jsx에서 생성된 ID ('notice-1', 'notice-sticky')를 사용하려면
// ManagerNoticeEdit.jsx의 sampleNotices 키도 'notice-1' 등으로 맞춰야 합니다.
// 여기서는 URL 파라미터가 '1', 'sticky' 등으로 온다고 가정하고,
// sampleNotices 키도 그에 맞게 단순화합니다.
const sampleNotices = {
    'sticky': { id: 'sticky', isImportant: true, title: '이벤트 당첨자 발표 안내 (필독)', author: '관리자', views: 1024, createdAt: '2025.05.10', content: "안녕하세요. 사용자 여러분께 안내 말씀드립니다.\n\n보다 안정적인 서비스 제공을 위해 아래와 같이 서버 점검을 실시할 예정입니다.\n점검 시간 동안에는 서비스 이용이 일시적으로 중단될 수 있으니 양해 부탁드립니다.\n\n- 점검 일시: 2025년 5월 15일 (목) 02:00 ~ 04:00 (2시간)\n- 점검 내용: 서버 안정화 및 성능 개선 작업\n\n항상 최선을 다하는 서비스가 되겠습니다.\n감사합니다." },
    '1': { id: '1', isImportant: false, title: '첫 번째 일반 공지사항입니다.', author: '관리자', views: 123, createdAt: '2025.05.02', content: "첫 번째 공지사항의 내용입니다. \n\n상세 내용을 확인해주세요." },
    '2': { id: '2', isImportant: true, title: '두 번째 중요 공지사항입니다.', author: '관리자', views: 456, createdAt: '2025.05.01', content: "두 번째 중요 공지사항의 내용입니다. \n\n필독 바랍니다." },
};

const getNoticeById = (id) => {
    // console.log("ManagerNoticeDetail - getNoticeById called with:", id, "Result:", sampleNotices[id]);
    return sampleNotices[id] || null;
};

function ManagerNoticeDetail() {
    const { id: noticeIdFromUrl } = useParams(); // App.js 라우트가 /:id 이므로 id로 받음
    const navigate = useNavigate();
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // console.log("ManagerNoticeDetail - Fetching notice for ID (from URL):", noticeIdFromUrl);
        setTimeout(() => { 
            let fetchedNotice = getNoticeById(noticeIdFromUrl); // URL에서 받은 ID 그대로 사용
            
            if (!fetchedNotice) { // 데이터를 못 찾으면 기본 공지 (sticky) 표시
                // console.warn(`Notice ID "${noticeIdFromUrl}" not found or invalid. Displaying a default notice.`);
                fetchedNotice = sampleNotices['sticky'] || Object.values(sampleNotices).find(n => n !== null);
                if (!fetchedNotice) { // 그래도 없으면 에러 처리 또는 빈 상태
                    console.error("No notices available in sampleNotices.");
                    // navigate('/admin/notice'); // 또는 오류 메시지 표시
                    // return; 
                }
            }
            setNotice(fetchedNotice);
            setLoading(false);
        }, 300); // 로딩 시간 줄임
    }, [noticeIdFromUrl, navigate]); // navigate를 의존성 배열에 추가 (ESLint 경고 방지)

    const handleEdit = () => {
        if (!notice || !notice.id) {
            alert("수정할 공지사항 정보가 유효하지 않습니다.");
            return;
        }
        // console.log(`Edit notice ID: ${notice.id}`);
        // ManagerNoticeEdit 페이지는 /admin/managerNoticeEdit/:id 경로를 사용합니다.
        // 여기서 notice.id는 'sticky', '1', '2' 와 같은 형태여야 합니다.
        navigate(`/admin/managerNoticeEdit/${notice.id}`); // <<< 수정: 주석 해제 및 경로 확인
    };

    const handleDelete = () => {
        if (!notice || !notice.id) {
            alert("삭제할 공지사항 정보가 유효하지 않습니다.");
            return;
        }
        if (window.confirm(`공지사항 "${notice.title}"을(를) 정말 삭제하시겠습니까?`)) {
            // console.log(`Delete notice ID: ${notice.id}`);
            alert('공지사항이 삭제되었습니다. (실제 삭제는 API 연동 필요)');
            navigate('/admin/notice'); 
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
                    <div className={styles.pageHeader}>
                        <Link to="/admin/notice" className={styles.toListLink}>
                            <h1>공지사항 관리</h1>
                        </Link>
                    </div>
                    <p>표시할 공지사항 데이터가 없습니다. (ID: {noticeIdFromUrl})</p>
                </main>
            </div>
        );
    }

    return (
        <>
            <div className={styles.container}>
                <main className={styles.managerContent}>
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