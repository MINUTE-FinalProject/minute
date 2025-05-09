import NoticeDetailStyle from "./noticeDetail.module.css"

function NoticeDetail() {
    return (
        <div className={NoticeDetailStyle.background}>

            <div className={NoticeDetailStyle.title}>
                <h1>공지사항</h1>
            </div>

            <div className={NoticeDetailStyle.contentArea}>

                <div className={NoticeDetailStyle.content}>

                    <div className={NoticeDetailStyle.info}>

                        <div className={NoticeDetailStyle.infoLeft}>
                            <span>중요</span>
                            <span>제목</span>
                        </div>

                        <div className={NoticeDetailStyle.infoRight}>
                            <span>관리자</span>
                            <span>조회수</span>
                            <span>작성날짜</span>
                        </div>
                    </div>

                    <div className={NoticeDetailStyle.textbox}>
                        <p>내용</p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default NoticeDetail