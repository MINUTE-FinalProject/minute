// src/pages/Notice/NoticeDetail.jsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import NoticeDetailStyle from "../../assets/styles/noticeDetail.module.css";
import Modal from '../../components/Modal/Modal';

// 데이터 로드 실패 또는 ID 없을 시 보여줄 플레이스홀더 공지사항 (유지)
const PLACEHOLDER_NOTICE = {
    id: 'placeholder',
    isImportant: false,
    title: '샘플 공지사항 제목',
    author: '시스템',
    views: 0,
    createdAt: 'YYYY.MM.DD', // 날짜 형식 예시
    content: "요청하신 공지사항 정보를 불러올 수 없습니다.\n대신 샘플 공지사항 내용이 표시됩니다.\n\n페이지 구조 및 UI를 확인해주세요."
};

function NoticeDetail() {
    const { id: noticeId } = useParams(); // URL 파라미터 'id'를 가져와서 'noticeId'라는 변수명으로 사용합니다.
    const navigate = useNavigate();
    
    console.log("NoticeDetail Component Mounted. noticeId from URL params:", noticeId);

    const [notice, setNotice] = useState(null); // API로부터 받은 공지사항 데이터
    const [isLoading, setIsLoading] = useState(true);

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
        console.log("NoticeDetail useEffect triggered. Current noticeId:", noticeId);

        if (noticeId && noticeId.trim() !== "" && !isNaN(Number(noticeId))) {
            setIsLoading(true);
            setNotice(null); 

            const fetchNoticeByIdFromAPI = async (idToFetch) => { // 파라미터 이름을 idToFetch로 변경하여 명확화
                console.log("Fetching API for noticeId:", idToFetch); 
                try {
                    const response = await fetch(`/api/notices/${idToFetch}`);

                    if (!response.ok) {
                        let errorMsg = `HTTP error! status: ${response.status}`;
                        try {
                            const errorData = await response.json();
                            errorMsg = errorData.message || errorMsg;
                        } catch (jsonError) {
                            const textError = await response.text();
                            console.error("Response was not JSON. Response text:", textError);
                        }
                        throw new Error(errorMsg);
                    }

                    const data = await response.json(); 

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
                    console.error("Failed to fetch notice:", err.message);
                    setNotice(PLACEHOLDER_NOTICE); 
                    setModalProps({
                        title: "데이터 로드 실패",
                        message: `${err.message}\n요청하신 공지사항을 불러올 수 없습니다. 목록으로 돌아가거나 잠시 후 다시 시도해주세요.`,
                        confirmText: "확인",
                        type: "error",
                        confirmButtonType: 'blackButton',
                        onConfirm: () => {
                            setIsModalOpen(false);
                        }
                    });
                    setIsModalOpen(true);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchNoticeByIdFromAPI(noticeId); // useEffect의 noticeId 사용

        } else { 
            console.warn("NoticeId is missing, invalid, or not a number:", noticeId, ". Displaying placeholder.");
            setNotice(PLACEHOLDER_NOTICE);
            setIsLoading(false);
            setModalProps({
                title: "알림",
                message: "유효한 공지사항 ID가 제공되지 않았습니다.\n샘플 공지사항 내용을 표시합니다.",
                confirmText: "확인",
                type: "warning",
                confirmButtonType: 'blackButton',
                onConfirm: () => setIsModalOpen(false)
            });
            setIsModalOpen(true);
        }
    }, [noticeId]); // noticeId가 변경될 때마다 useEffect 재실행

    if (isLoading) {
        return (
            <div className={NoticeDetailStyle.background}>
                <div className={NoticeDetailStyle.title}>
                    <Link to="/notice" className={NoticeDetailStyle.titleLink}><h1>공지사항</h1></Link>
                </div>
                <div className={NoticeDetailStyle.contentArea}>
                    <p className={NoticeDetailStyle.loadingMessage}>공지사항을 불러오는 중입니다...</p>
                </div>
            </div>
        );
    }

    if (!notice) {
        return (
            <div className={NoticeDetailStyle.background}>
                <div className={NoticeDetailStyle.title}>
                    <Link to="/notice" className={NoticeDetailStyle.titleLink}><h1>공지사항</h1></Link>
                </div>
                <div className={NoticeDetailStyle.contentArea}>
                   <p className={NoticeDetailStyle.errorMessage}>공지사항 정보를 표시할 수 없습니다. 문제가 지속되면 관리자에게 문의해주세요.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={NoticeDetailStyle.background}>
                <div className={NoticeDetailStyle.title}>
                    <Link to="/notice" className={NoticeDetailStyle.titleLink}><h1>공지사항</h1></Link>
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
                            {typeof notice.content === 'string' ? notice.content.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            )) : notice.content}
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