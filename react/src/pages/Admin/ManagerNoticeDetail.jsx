// src/pages/Admin/Notice/ManagerNoticeDetail.jsx
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from '../../assets/styles/ManagerNoticeDetail.module.css';
import Modal from '../../components/Modal/Modal'; // Modal 컴포넌트 import

const API_BASE_URL = "/api/v1"; // 프록시 설정을 활용하기 위해 상대 경로로 변경

function ManagerNoticeDetail() {
    const { id: noticeId } = useParams(); // URL 파라미터 'id'를 가져와서 'noticeId'라는 변수명으로 사용합니다.
    const navigate = useNavigate();
    const [notice, setNotice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // 모달 상태 관리 (객체 형태로 유지)
    const [isModalOpen, setIsModalOpen] = useState({ state: false, config: {} });

    const getToken = () => localStorage.getItem("token");

    // ⭐ 수정: 실제 공지사항 상세 조회 API 호출
    const fetchNoticeByIdFromAPI = useCallback(async (idToFetch) => {
        setIsLoading(true);
        setNotice(null); // 새로운 데이터 로딩 전 기존 데이터 초기화

        const token = getToken();
        if (!token) {
            setIsLoading(false);
            setIsModalOpen({ 
                state: true, 
                config: { 
                    title: "인증 오류", 
                    message: "관리자 로그인이 필요합니다.", 
                    onConfirm: () => { setIsModalOpen({ state: false, config: {} }); navigate("/login"); }, 
                    type: 'error' 
                } 
            });
            return;
        }

        if (!idToFetch || idToFetch.trim() === "" || isNaN(Number(idToFetch))) {
            console.warn("NoticeId is missing or invalid. Navigating to list.");
            setIsLoading(false);
            setIsModalOpen({
                state: true,
                config: {
                    title: "오류",
                    message: "유효한 공지사항 ID가 제공되지 않았습니다. 목록으로 돌아갑니다.",
                    confirmText: "확인",
                    type: "error",
                    confirmButtonType: 'primary',
                    onConfirm: () => { setIsModalOpen({ state: false, config: {} }); navigate('/admin/managerNotice'); }
                }
            });
            return;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/notices/${idToFetch}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = response.data;
            const dateObj = new Date(data.noticeCreatedAt);
            const formattedDate = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;

            setNotice({
                id: data.noticeId,
                isImportant: data.noticeIsImportant,
                title: data.noticeTitle,
                author: data.authorNickname,
                views: data.noticeViewCount,
                createdAt: formattedDate,
                content: data.noticeContent,
            });

        } catch (err) {
            console.error("Failed to fetch notice for admin:", err);
            const errorMsg = err.response?.data?.message || "공지사항을 불러오는 데 실패했습니다.";
            setIsModalOpen({
                state: true,
                config: {
                    title: "데이터 로드 실패",
                    message: errorMsg,
                    confirmText: "목록으로 돌아가기",
                    type: "error",
                    confirmButtonType: 'primary',
                    onConfirm: () => { setIsModalOpen({ state: false, config: {} }); navigate('/admin/managerNotice'); }
                }
            });
            setNotice(null); // 에러 발생 시 notice를 null로 설정
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        // noticeId가 변경되거나, 컴포넌트가 처음 마운트될 때 데이터 로드
        if (noticeId) {
            fetchNoticeByIdFromAPI(noticeId);
        }
    }, [noticeId, fetchNoticeByIdFromAPI]);

    const handleEdit = () => {
        if (!notice || !notice.id) {
            setIsModalOpen({
                state: true,
                config: {
                    title: "오류",
                    message: "수정할 공지사항 정보가 유효하지 않습니다.",
                    confirmText: "확인",
                    type: "error",
                    confirmButtonType: 'primary'
                }
            });
            return;
        }
        navigate(`/admin/managerNoticeEdit/${notice.id}`);
    };

    // ⭐ 수정: 공지사항 삭제 API 연동
    const processDeleteNotice = async () => {
        if (!notice || !notice.id) return;
        const token = getToken();
        if (!token) {
            setIsModalOpen({ 
                state: true, 
                config: { 
                    title: "인증 오류", 
                    message: "관리자 로그인이 필요합니다.", 
                    onConfirm: () => { setIsModalOpen({ state: false, config: {} }); navigate("/login"); }, 
                    type: 'error' 
                } 
            });
            return;
        }

        try {
            await axios.delete(`${API_BASE_URL}/notices/${notice.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setIsModalOpen({
                state: true,
                config: {
                    title: "삭제 완료",
                    message: `공지사항 "${notice.title}" (ID: ${notice.id})이(가) 성공적으로 삭제되었습니다.`,
                    confirmText: "목록으로 이동",
                    type: "success",
                    confirmButtonType: 'primary',
                    onConfirm: () => { setIsModalOpen({ state: false, config: {} }); navigate('/admin/managerNotice'); }
                }
            });
        } catch (error) {
            console.error("Error deleting notice:", error);
            const errorMsg = error.response?.data?.message || "공지사항 삭제에 실패했습니다.";
            setIsModalOpen({ 
                state: true, 
                config: { 
                    title: "오류", 
                    message: errorMsg, 
                    type: "error", 
                    onConfirm: () => { setIsModalOpen({ state: false, config: {} }); } // 오류 시 모달만 닫기
                } 
            });
        }
    };

    const handleDelete = () => {
        if (!notice || !notice.id) {
            setIsModalOpen({
                state: true,
                config: {
                    title: "오류",
                    message: "삭제할 공지사항 정보가 유효하지 않습니다.",
                    confirmText: "확인",
                    type: "error",
                    confirmButtonType: 'primary'
                }
            });
            return;
        }
        setIsModalOpen({
            state: true,
            config: {
                title: "공지사항 삭제 확인",
                message: `공지사항 "${notice.title}" (ID: ${notice.id})을(를) 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
                onConfirm: () => { setIsModalOpen({ state: false, config: {} }); processDeleteNotice(); }, // 모달 닫고 삭제 실행
                confirmText: "삭제",
                cancelText: "취소",
                type: "warning",
                confirmButtonType: 'danger'
            }
        });
    };

    // 로딩 중일 때 UI
    if (isLoading) {
        return (
            <div className={styles.container}>
                <main className={styles.managerContent}>
                    <p>공지사항을 불러오는 중입니다...</p>
                </main>
            </div>
        );
    }

    // 로딩 완료 후 notice가 null일 때 (데이터 로드 실패 또는 ID 문제)
    // fetchNoticeByIdFromAPI 내에서 이미 모달과 navigate를 처리하므로, 여기서는 단순히 null을 반환하여
    // 모달이 화면을 제어하도록 합니다.
    if (!notice) {
        return null; 
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
                isOpen={isModalOpen.state}
                onClose={() => setIsModalOpen({ state: false, config: {} })}
                {...isModalOpen.config}
            />
        </>
    );
}

export default ManagerNoticeDetail;