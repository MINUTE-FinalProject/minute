// src/pages/Notice/NoticeDetail.jsx (또는 해당 파일의 실제 경로)
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'; // useNavigate는 현재 이 로직에선 불필요할 수 있음
import Modal from '../../components/Modal/Modal';
import NoticeDetailStyle from "./noticeDetail.module.css";

// 샘플 데이터베이스
const mockNoticeDatabase = {
    '1': {
        id: '1', isImportant: true, title: '중요 공지사항입니다: 서버 점검 안내',
        author: '관리자', views: 1024, createdAt: '2025.05.10',
        content: "안녕하세요. 사용자 여러분께 안내 말씀드립니다.\n\n보다 안정적인 서비스 제공을 위해 아래와 같이 서버 점검을 실시할 예정입니다.\n점검 시간 동안에는 서비스 이용이 일시적으로 중단될 수 있으니 양해 부탁드립니다.\n\n- 점검 일시: 2025년 5월 15일 (목) 02:00 ~ 04:00 (2시간)\n- 점검 내용: 서버 안정화 및 성능 개선 작업\n\n항상 최선을 다하는 서비스가 되겠습니다.\n감사합니다."
    },
    'another-id': {
        id: 'another-id', isImportant: false, title: '일반 공지사항 테스트',
        author: '운영팀', views: 512, createdAt: '2025.05.11',
        content: "이것은 일반 공지사항의 내용입니다.\n\n테스트 중입니다."
    }
};

// 데이터 로드 실패 또는 ID 없을 시 보여줄 플레이스홀더 공지사항
const PLACEHOLDER_NOTICE = {
    id: 'placeholder',
    isImportant: false,
    title: '샘플 공지사항 제목',
    author: '시스템',
    views: 0,
    createdAt: 'YYYY.MM.DD',
    content: "요청하신 공지사항 정보를 불러올 수 없습니다.\n대신 샘플 공지사항 내용이 표시됩니다.\n\n페이지 구조 및 UI를 확인해주세요."
};

function NoticeDetail() {
    const { noticeId } = useParams();
    const navigate = useNavigate(); // 모달에서 목록 이동 등에 사용될 수 있으므로 유지
    
    console.log("NoticeDetail component rendered. noticeId from URL:", noticeId);

    const [notice, setNotice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalProps, setModalProps] = useState({
        title: '', message: '', onConfirm: null, confirmText: '확인',
        cancelText: null, type: 'default', confirmButtonType: 'primary',
        cancelButtonType: 'secondary'
    });

    useEffect(() => {
        console.log("useEffect started. Current noticeId:", noticeId);
        setIsLoading(true);
        setNotice(null); // 이전 데이터 초기화

        // API 호출 시뮬레이션
        const fetchNoticeById = async (id) => {
            console.log("fetchNoticeById called with id:", id);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // const MOCK_API_DETAIL_SHOULD_FAIL_NETWORK = false; // 네트워크 에러 테스트용
                    // if (MOCK_API_DETAIL_SHOULD_FAIL_NETWORK) {
                    //     reject(new Error("네트워크 오류 발생 (테스트)"));
                    //     return;
                    // }
                    const foundNotice = mockNoticeDatabase[id];
                    if (foundNotice && foundNotice.title) {
                        console.log("Notice found for ID:", id, foundNotice);
                        resolve(foundNotice);
                    } else {
                        console.log("Notice not found or invalid for ID:", id);
                        reject(new Error(`요청하신 공지사항(ID: ${id})을 찾을 수 없습니다.`));
                    }
                }, 300); // 0.3초 딜레이
            });
        };

        if (noticeId && noticeId !== "undefined" && noticeId !== "null") {
            fetchNoticeById(noticeId)
                .then(data => {
                    console.log("Fetch successful, setting notice data.");
                    setNotice(data);
                })
                .catch(err => {
                    console.error("Failed to fetch notice:", err.message, "-- Displaying placeholder.");
                    setNotice(PLACEHOLDER_NOTICE); // 에러 시 플레이스홀더 데이터 설정
                    setModalProps({
                        title: "알림",
                        message: `${err.message}\n샘플 공지사항 내용을 표시합니다.`,
                        confirmText: "확인",
                        type: "warning", // 정보성 경고
                        confirmButtonType: 'blackButton', // 검정색 버튼
                        onConfirm: () => setIsModalOpen(false) // 모달만 닫음
                    });
                    setIsModalOpen(true);
                })
                .finally(() => {
                    setIsLoading(false);
                    console.log("Loading finished.");
                });
        } else { // noticeId가 없거나 유효하지 않은 경우
            console.log("noticeId is missing or invalid. Displaying placeholder.");
            setNotice(PLACEHOLDER_NOTICE); // 플레이스홀더 데이터 설정
            setIsLoading(false);
            setModalProps({
                title: "알림",
                message: "유효한 공지사항 ID가 제공되지 않았습니다.\n샘플 공지사항 내용을 표시합니다.",
                confirmText: "확인",
                type: "warning", // 정보성 경고
                confirmButtonType: 'blackButton',
                onConfirm: () => setIsModalOpen(false) // 모달만 닫음
            });
            setIsModalOpen(true);
            console.log("Loading finished (no valid ID).");
        }
    }, [noticeId]); // navigate는 onConfirm에서 사용 안하므로 일단 제거


    // 로딩 중일 때 표시할 UI
    if (isLoading) {
        return (
            <div className={NoticeDetailStyle.background}>
                <div className={NoticeDetailStyle.title}>
                    <Link to="/notice" className={NoticeDetailStyle.titleLink}>
                        <h1>공지사항</h1>
                    </Link>
                </div>
                <div className={NoticeDetailStyle.contentArea}>
                    <p className={NoticeDetailStyle.loadingMessage}>공지사항을 불러오는 중입니다...</p>
                </div>
            </div>
        );
    }

    // 로딩이 끝났지만 notice 객체가 아직 없을 경우 (useEffect에서 setNotice가 미처 실행되기 전의 순간 등 방어)
    // 또는 PLACEHOLDER_NOTICE 마저도 설정 실패한 극히 예외적인 경우
    if (!notice) {
        return (
            <div className={NoticeDetailStyle.background}>
               <div className={NoticeDetailStyle.title}>
                   <Link to="/notice" className={NoticeDetailStyle.titleLink}>
                       <h1>공지사항</h1>
                   </Link>
               </div>
               <div className={NoticeDetailStyle.contentArea}>
                   <p className={NoticeDetailStyle.errorMessage}>공지사항 정보를 표시할 수 없습니다.</p>
               </div>
           </div>
        );
    }

    // notice 객체가 있으면 (실제 데이터 또는 플레이스홀더) 내용을 렌더링
    return (
        <>
            <div className={NoticeDetailStyle.background}>
                <div className={NoticeDetailStyle.title}>
                    <Link to="/notice" className={NoticeDetailStyle.titleLink}>
                        <h1>공지사항</h1>
                    </Link>
                </div>
                <div className={NoticeDetailStyle.contentArea}>
                    <div className={NoticeDetailStyle.content}>
                        <div className={NoticeDetailStyle.info}>
                            <div className={NoticeDetailStyle.infoLeft}>
                                {notice.isImportant && (
                                    <span className={NoticeDetailStyle.importantTag}>중요</span>
                                )}
                                <span className={NoticeDetailStyle.postTitleText}>{notice.title}</span>
                            </div>
                            <div className={NoticeDetailStyle.infoRight}>
                                <span className={NoticeDetailStyle.author}>작성자: {notice.author}</span>
                                <span className={NoticeDetailStyle.views}>조회수: {notice.views}</span>
                                <span className={NoticeDetailStyle.createdAt}>작성일: {notice.createdAt}</span>
                            </div>
                        </div>
                        <div className={NoticeDetailStyle.textbox}>
                            {notice.content.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                {...modalProps}
            />
        </>
    )
}

export default NoticeDetail;