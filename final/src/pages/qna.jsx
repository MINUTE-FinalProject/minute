import Pagination from "../common/Pagination";

import qnaStyle from "./qna.module.css";

function Qna() {

    return (
        <div className={qnaStyle.background}>
    
            {/* 제목 섹션: className={qnaStyle.title} 유지 */}
            <div className={qnaStyle.title}>
                <h1>Q&A</h1>
            </div>
    
            {/* 검색창 섹션: className={qnaStyle.searchbar} 유지 */}
            <div className={qnaStyle.searchbar}>
                {/* 날짜 선택 버튼들 */}
                <button type="button">날짜 선택</button>
                <button type="button">날짜 선택</button>
                {/* 상태 선택 드롭다운 */}
                <select>
                    <option value="">상태</option>
                    <option value="completed">완료</option>
                    <option value="pending">대기</option>
                </select>
                {/* 검색 입력창 */}
                <input type="text" placeholder="검색어를 입력하세요" />
                {/* 검색 버튼 (돋보기 아이콘은 텍스트 또는 이미지로 대체 가능) */}
                <button type="button">🔍</button>
            </div>
    
            {/* Q&A 목록 테이블 섹션: className={qnaStyle.table} 유지 */}
            <table className={qnaStyle.table}>
                <thead>
                    <tr>
                        <th>상태</th>
                        <th>작성자</th>
                        <th>제목</th>
                        <th>날짜</th>
                    </tr>
                </thead>
                <tbody>
                    {/* 예시 데이터 행들 (실제 데이터는 map 함수를 통해 동적으로 생성) */}
                    <tr>
                        <td><span>완료</span></td>
                        <td>김*</td>
                        <td>첫 번째 문의 제목입니다.</td>
                        <td>25.03.04</td>
                    </tr>
                    <tr>
                        <td><span>대기</span></td>
                        <td>이*</td>
                        <td>두 번째 문의사항입니다. 내용이 조금 길어질 수 있습니다.</td>
                        <td>25.03.04</td>
                    </tr>
                    <tr>
                        <td><span>완료</span></td>
                        <td>박*</td>
                        <td>세 번째 문의입니다.</td>
                        <td>25.03.04</td>
                    </tr>
                    <tr>
                        <td><span>대기</span></td>
                        <td>최*</td>
                        <td>네 번째 문의사항입니다.</td>
                        <td>25.03.04</td>
                    </tr>
                    <tr>
                        <td><span>완료</span></td>
                        <td>정*</td>
                        <td>다섯 번째 문의입니다.</td>
                        <td>25.03.04</td>
                    </tr>
                    <tr>
                        <td><span>대기</span></td>
                        <td>강*</td>
                        <td>여섯 번째 문의입니다. 조금 더 긴 문의 내용이 여기에 들어갈 수 있습니다.</td>
                        <td>25.03.04</td>
                    </tr>
                    {/* 실제 데이터에 따라 추가적인 행들이 여기에 들어갑니다. */}
                </tbody>
            </table>
    
            {/* 글쓰기 버튼 섹션: className={qnaStyle.wirte} 유지 */}
            <div className={qnaStyle.write}>
                <button>작성</button>
            </div>
    
            {/* 페이지네이션 섹션: className={qnaStyle.Pagination} 유지 */}
            <div className={qnaStyle.pagination}>
                <Pagination /> {/* 이 컴포넌트는 이미 import 되어 있다고 가정합니다. */}
            </div>
        </div>
    );
}


export default Qna