import banner from "../assets/banner.png"
import Searchbar from "../common/boardsearchbar"
import Pagination from "../common/Pagination"
import freeBoardStyle from "./freeboard.module.css"

function FreeBoard() {
    return (
        <div className={freeBoardStyle.background}>

            <div className={freeBoardStyle.totaltitle}>

                <div className={freeBoardStyle.title}>
                    <h1>자유게시판</h1>
                </div>

                <div className={freeBoardStyle.subtitle}>
                    <h2>전체목록</h2>
                    <h2>내 글</h2>
                </div>

            </div>

            <div className={freeBoardStyle.contentArea}>

                <div className={freeBoardStyle.img}>
                    <img src={banner} alt="자유게시판배너" />
                </div>

                <div className={freeBoardStyle.controls}>

                    <div className={freeBoardStyle.options}>

                        <select>
                            <option value="최신순">최신순</option>
                            <option value="조회순">조회순</option>
                            <option value="좋아요순">좋아요순</option>
                        </select>

                        <select>
                            <option value="글">글</option>
                            <option value="댓글">댓글</option>
                            <option value="전체">전체</option>
                        </select>
                    </div>

                    <div className={freeBoardStyle.searchbar}>
                        <Searchbar />
                    </div>
                </div>
                <table className={freeBoardStyle.table}>
                    <thead>
                        <tr>
                            <th scope="col">NO</th>
                            <th scope="col">타입</th>
                            <th scope="col">제목</th>
                            <th scope="col">작성자</th>
                            <th scope="col">작성날짜</th>
                            <th scope="col">조회수</th>
                            <th scope="col">좋아요수</th>
                            <th scope="col">신고</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>글</td>
                            <td>어디로 가야하죠~ 아조씨</td>
                            <td>조수민</td>
                            <td>25.05.05</td>
                            <td>777</td>
                            <td>777</td>
                            <td>신고</td>
                        </tr>
                    </tbody>
                </table>

                <div className={freeBoardStyle.write}>
                    <button>작성</button>
                </div>
            </div>

            <div className={freeBoardStyle.pagination}>
                <Pagination />
            </div>

        </div>
    )
}

export default FreeBoard