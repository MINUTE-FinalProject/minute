// src/pages/Admin/Notice/ManagerNoticeDetail.jsx (또는 해당 파일의 실제 경로)
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Modal from '../../components/Modal/Modal'; // Modal 컴포넌트 import
import styles from './ManagerNoticeDetail.module.css';

const sampleNotices = {
    'sticky': { id: 'sticky', isImportant: true, title: '이벤트 당첨자 발표 안내 (필독)', author: '관리자', views: 1024, createdAt: '2025.05.10', content: "안녕하세요. 사용자 여러분께 안내 말씀드립니다.\n\n보다 안정적인 서비스 제공을 위해 아래와 같이 서버 점검을 실시할 예정입니다.\n점검 시간 동안에는 서비스 이용이 일시적으로 중단될 수 있으니 양해 부탁드립니다.\n\n- 점검 일시: 2025년 5월 15일 (목) 02:00 ~ 04:00 (2시간)\n- 점검 내용: 서버 안정화 및 성능 개선 작업\n\n항상 최선을 다하는 서비스가 되겠습니다.\n감사합니다." },
    '1': { id: '1', isImportant: false, title: '첫 번째 일반 공지사항입니다.', author: '관리자', views: 123, createdAt: '2025.05.02', content: "첫 번째 공지사항의 내용입니다. \n\n상세 내용을 확인해주세요." },
    '2': { id: '2', isImportant: true, title: '두 번째 중요 공지사항입니다.', author: '관리자', views: 456, createdAt: '2025.05.01', content: "두 번째 중요 공지사항의 내용입니다. \n\n필독 바랍니다." },
};

const getNoticeById = (id) => {
    return sampleNotices[id] || null;
};

function ManagerNoticeDetail() {
    const { id: noticeIdFromUrl } = useParams();
    const navigate = useNavigate();
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);

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
        setLoading(true);
        setTimeout(() => { 
            let fetchedNotice = getNoticeById(noticeIdFromUrl);
            
            if (!fetchedNotice) {
                fetchedNotice = sampleNotices['sticky'] || Object.values(sampleNotices).find(n => n !== null);
                if (!fetchedNotice) {
                    console.error("No notices available in sampleNotices.");
                }
            }
            setNotice(fetchedNotice);
            setLoading(false);
        }, 300);
    }, [noticeIdFromUrl]);

    const handleEdit = () => {
        if (!notice || !notice.id) {
            setModalProps({
                title: "오류",
                message: "수정할 공지사항 정보가 유효하지 않습니다.",
                confirmText: "확인",
                type: "adminError", // 관리자용 에러 타입
                confirmButtonType: 'primary'
            });
            setIsModalOpen(true);
            return;
        }
        navigate(`/admin/managerNoticeEdit/${notice.id}`);
    };

    // --- 공지사항 삭제 처리 (Modal 적용) ---
    const processDeleteNotice = () => {
        console.log(`Delete notice ID: ${notice.id}, Title: ${notice.title}`);
        // TODO: API로 실제 삭제 요청

        setModalProps({
            title: "삭제 완료",
            message: `공지사항 "${notice.title}" (ID: ${notice.id})이(가) 성공적으로 삭제되었습니다.`,
            confirmText: "목록으로 이동",
            type: "adminSuccess", // 관리자용 성공 타입 (핑크 버튼을 원하시면 'success')
            confirmButtonType: 'primary',
            onConfirm: () => navigate('/admin/notice')
        });
        setIsModalOpen(true); // 성공 알림 모달 다시 열기
    };

    const handleDelete = () => {
        if (!notice || !notice.id) {
            setModalProps({
                title: "오류",
                message: "삭제할 공지사항 정보가 유효하지 않습니다.",
                confirmText: "확인",
                type: "adminError",
                confirmButtonType: 'primary'
            });
            setIsModalOpen(true);
            return;
        }
        setModalProps({
            title: "공지사항 삭제 확인",
            message: `공지사항 "${notice.title}" (ID: ${notice.id})을(를) 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
            onConfirm: processDeleteNotice,
            confirmText: "삭제",
            cancelText: "취소",
            type: "adminConfirm", // 또는 'adminWarning'
            confirmButtonType: 'danger'
        });
        setIsModalOpen(true);
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
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                {...modalProps}
            />
        </>
    );
}

export default ManagerNoticeDetail;