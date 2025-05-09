import Searchbar from "../common/boardsearchbar"
import Pagination from "../common/Pagination"
import noticeStyle from "./notice.module.css"
function Notice() {

    return (
        <div className={noticeStyle.background}>
            <div className={noticeStyle.title}>
                <h1>공지사항</h1>
            </div>
            <div className={noticeStyle.contentArea}>

            <div className={noticeStyle.searchbar}>
                <Searchbar />
            </div>
            <table className={noticeStyle.table}>
                <thead>
                    <tr>
                        <th scope="col">NO</th>
                        <th scope="col">제목</th>
                        <th scope="col">작성자</th>
                        <th scope="col">조회수</th>
                        <th scope="col">작성날짜</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className={noticeStyle.important}>
                        <td>중요</td>
                        <td>상단고정공지</td>
                        <td>관리자</td>
                        <td>777</td>
                        <td>25.05.03</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>게시글</td>
                        <td>이민지</td>
                        <td>777</td>
                        <td>25.05.03</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>게시글</td>
                        <td>조수민</td>
                        <td>777</td>
                        <td>25.05.03</td>
                    </tr>
                </tbody>
            </table>
            </div>
            <div className={noticeStyle.pagination}>
                <Pagination />
            </div>
        </div>
    )
}
export default Notice