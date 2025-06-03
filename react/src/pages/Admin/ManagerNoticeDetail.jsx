// src/pages/Admin/Notice/ManagerNoticeDetail.jsx
import axios from 'axios'; // axios import
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
// 경로 확인: 현재 파일 위치에 따라 ../../../assets/... 등으로 변경될 수 있습니다.
import styles from '../../assets/styles/ManagerNoticeDetail.module.css';
import Modal from '../../components/Modal/Modal';

// 데이터 로드 실패 또는 ID 없을 시 보여줄 기본값 (오류 상황 대체용)
const FALLBACK_NOTICE = {
    id: 'error',
    isImportant: false,
    title: '오류',
    author: '시스템',
    views: 0,
    createdAt: 'N/A',
    content: "공지사항 정보를 불러오는 데 실패했습니다."
};

function ManagerNoticeDetail() {
    const { id: noticeIdFromUrl } = useParams();
    const navigate = useNavigate();
    
    const [notice, setNotice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false); // 수정/삭제 액션 로딩

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalProps, setModalProps] = useState({
        title: '', message: '', onConfirm: null, confirmText: '확인',
        cancelText: null, type: 'default', confirmButtonType: 'primary',
        cancelButtonType: 'secondary', onClose: () => setIsModalOpen(false)
    });

    const getToken = () => localStorage.getItem('token');

    useEffect(() => {
        setIsLoading(true);
        if (noticeIdFromUrl && !isNaN(Number(noticeIdFromUrl))) {
            const fetchNoticeDetail = async () => {
                try {
                    // GET /api/notices/{id}는 permitAll이므로 토큰 없이 요청 가능
                    const response = await axios.get(`/api/notices/${noticeIdFromUrl}`);
                    const data = response.data; // NoticeDetailResponseDTO

                    const dateObj = new Date(data.noticeCreatedAt);
                    const formattedDate = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;

                    setNotice({
                        id: data.noticeId,
                        isImportant: data.noticeIsImportant,
                        title: data.noticeTitle,
                        author: data.authorNickname, // 또는 data.authorId
                        views: data.noticeViewCount,
                        createdAt: formattedDate,
                        content: data.noticeContent,
                        rawCreatedAt: data.noticeCreatedAt // 수정 페이지로 넘길 원본 날짜 (필요시)
                    });
                } catch (error) {
                    console.error("Error fetching notice detail:", error);
                    setNotice(FALLBACK_NOTICE);
                    setModalProps({
                        title: "데이터 로드 실패",
                        message: error.response?.data?.message || "공지사항 정보를 불러오는 데 실패했습니다.",
                        type: "error",
                        confirmText: "목록으로",
                        confirmButtonType: 'blackButton',
                        onConfirm: () => { setIsModalOpen(false); navigate('/admin/managerNotice'); },
                        onClose: () => { setIsModalOpen(false); navigate('/admin/managerNotice'); }
                    });
                    setIsModalOpen(true);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchNoticeDetail();
        } else {
            console.warn("Invalid noticeIdFromUrl:", noticeIdFromUrl);
            setNotice(FALLBACK_NOTICE);
            setIsLoading(false);
            setModalProps({
                title: "잘못된 접근",
                message: "유효하지 않은 공지사항 ID 입니다.",
                type: "warning",
                confirmText: "목록으로",
                confirmButtonType: 'blackButton',
                onConfirm: () => { setIsModalOpen(false); navigate('/admin/managerNotice'); },
                onClose: () => { setIsModalOpen(false); navigate('/admin/managerNotice'); }
            });
            setIsModalOpen(true);
        }
    }, [noticeIdFromUrl, navigate]);

    const handleEdit = () => {
        if (!notice || notice.id === 'error') {
            setModalProps({
                title: "오류", message: "수정할 공지사항 정보가 유효하지 않습니다.",
                type: "error", confirmButtonType: 'blackButton', onConfirm: () => setIsModalOpen(false), onClose: () => setIsModalOpen(false)
            });
            setIsModalOpen(true);
            return;
        }
        // 수정 페이지로 상태 전달 (선택적, API 재호출이 일반적)
        navigate(`/admin/managerNoticeEdit/${notice.id}`, { state: { noticeData: notice } });
    };

    const processDeleteNotice = async () => {
        if (!notice || notice.id === 'error') return;

        const token = getToken();
        if (!token) {
            setModalProps({ title: "인증 오류", message: "로그인이 필요합니다. 다시 로그인해주세요.", type: "error", confirmButtonType: 'blackButton', onConfirm: () => {setIsModalOpen(false); navigate('/login');}, onClose: () => setIsModalOpen(false) });
            setIsModalOpen(true);
            return;
        }
        
        setIsActionLoading(true);
        try {
            await axios.delete(`/api/notices/${notice.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setModalProps({
                title: "삭제 완료",
                message: `공지사항 "${notice.title}" (ID: ${notice.id})이(가) 성공적으로 삭제되었습니다.`,
                type: "success", // Modal 컴포넌트가 success 타입 스타일을 지원해야 함
                confirmText: "목록으로 이동",
                confirmButtonType: 'blackButton',
                onConfirm: () => { setIsModalOpen(false); navigate('/admin/managerNotice'); },
                onClose: () => { setIsModalOpen(false); navigate('/admin/managerNotice'); }
            });
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error deleting notice:", error);
            setModalProps({
                title: "삭제 실패",
                message: error.response?.data?.message || "공지사항 삭제 중 오류가 발생했습니다.",
                type: "error",
                confirmText: "확인",
                confirmButtonType: 'blackButton',
                onConfirm: () => setIsModalOpen(false),
                onClose: () => setIsModalOpen(false)
            });
            setIsModalOpen(true);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDelete = () => {
        if (!notice || notice.id === 'error') {
             setModalProps({
                title: "오류", message: "삭제할 공지사항 정보가 유효하지 않습니다.",
                type: "error", confirmButtonType: 'blackButton', onConfirm: () => setIsModalOpen(false), onClose: () => setIsModalOpen(false)
            });
            setIsModalOpen(true);
            return;
        }
        setModalProps({
            title: "공지사항 삭제 확인",
            message: `공지사항 "${notice.title}" (ID: ${notice.id})을(를) 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
            type: "warning", // Modal 컴포넌트가 warning 타입 스타일을 지원해야 함
            confirmText: "삭제",
            cancelText: "취소",
            confirmButtonType: 'redButton',
            cancelButtonType: 'grayButton',
            onConfirm: () => { 
                // setIsModalOpen(false); // processDeleteNotice에서 다시 모달을 띄우므로, 여기서는 닫지 않음.
                processDeleteNotice();
            },
            onClose: () => setIsModalOpen(false)
        });
        setIsModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <main className={styles.managerContent}><p>공지사항을 불러오는 중입니다...</p></main>
            </div>
        );
    }

    if (!notice || notice.id === 'error') { // 로딩 완료 후에도 notice가 없거나 FALLBACK_NOTICE인 경우
        return (
            <div className={styles.container}>
                <main className={styles.managerContent}>
                    <div className={styles.pageHeader}>
                        <Link to="/admin/managerNotice" className={styles.toListLink}><h1>공지사항 관리</h1></Link>
                    </div>
                    <p>공지사항 정보를 찾을 수 없거나 불러오는 데 실패했습니다. (ID: {noticeIdFromUrl || 'N/A'})</p>
                </main>
            </div>
        );
    }

    return (
        <>
            <div className={styles.container}>
                <main className={styles.managerContent}>
                    <div className={styles.pageHeader}>
                        <Link to="/admin/managerNotice" className={styles.toListLink}>
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
                            {typeof notice.content === 'string' ? notice.content.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    {index < notice.content.split('\n').length - 1 && <br />}
                                </React.Fragment>
                            )) : notice.content}
                        </div>
                    </div>

                    <div className={styles.actionsContainer}>
                        <div> 
                            <button onClick={handleEdit} className={`${styles.actionButton} ${styles.editButton}`} disabled={isActionLoading}>수정</button>
                            <button onClick={handleDelete} className={`${styles.actionButton} ${styles.deleteButton}`} disabled={isActionLoading}>삭제</button>
                        </div>
                    </div>
                </main>
            </div>
            <Modal
                isOpen={isModalOpen}
                // onClose는 modalProps에 포함되어 있음
                {...modalProps}
            />
        </>
    );
}

export default ManagerNoticeDetail;