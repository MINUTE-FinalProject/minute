import { useEffect, useState } from 'react'; // useEffect 추가
import { Link, useParams } // useParams 추가 (게시물 ID를 URL에서 가져오기 위함)
    from 'react-router-dom';
import banner from "../../assets/images/banner.png"; // 실제 경로 확인 필요
import freeboardEditStyle from './freeboardEdit.module.css';

function FreeboardEdit() {
    const { postId } = useParams(); // URL에서 postId를 가져옵니다. 예: /edit/123
    const freeboardPath = '/freeboard'; // 실제 자유게시판 경로로 수정

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [originalData, setOriginalData] = useState(null); // 원본 데이터 저장 (선택적)

    // --- 실제 구현 시 ---
    // useEffect를 사용하여 postId에 해당하는 게시물 데이터를 불러와서
    // title과 content 상태를 초기화해야 합니다.
    useEffect(() => {
        // 예시: fetchPostData 함수가 postId를 이용해 데이터를 가져온다고 가정
        const fetchPostData = async (id) => {
            // 이 부분에서 API 호출 등을 통해 실제 데이터를 가져옵니다.
            // 아래는 임시 데이터 예시입니다.
            if (id === "123") { // 실제로는 API 응답을 사용
                return { title: "기존 게시물 제목", content: "기존 게시물 내용입니다." };
            }
            return { title: "", content: "" }; // 해당 ID의 게시물이 없을 경우
        };

        if (postId) {
            fetchPostData(postId).then(data => {
                setTitle(data.title);
                setContent(data.content);
                setOriginalData(data); // 원본 데이터 저장
            }).catch(error => {
                console.error("게시물 데이터를 불러오는 데 실패했습니다.", error);
                // 오류 처리 (예: 사용자를 이전 페이지로 리디렉션)
            });
        }
    }, [postId]); // postId가 변경될 때마다 데이터를 다시 불러옵니다.
    // --- ---

    const handleEditSubmit = () => {
        // 여기에 수정된 제목(title)과 내용(content)을 서버로 전송하는 로직을 추가합니다.
        console.log('수정된 제목:', title);
        console.log('수정된 내용:', content);
        console.log('게시물 ID:', postId);
        // 예를 들어, 성공적으로 수정 후 상세 페이지나 목록으로 이동
        // navigate(`/freeboard/${postId}`); 또는 navigate('/freeboard');
    };

    return (
        <div className={freeboardEditStyle.background}>
            
            <div className={freeboardEditStyle.title}>
                {/* Link 컴포넌트를 사용하여 자유게시판으로 이동 가능하게 */}
                <Link to={freeboardPath} className={freeboardEditStyle.titleLink}>
                    <h1>자유게시판</h1>
                </Link>
            </div>

            <div className={freeboardEditStyle.contentArea}>

                <div className={freeboardEditStyle.img}>
                    <img src={banner} alt="자유게시판배너" />
                </div> 

                <div className={freeboardEditStyle.content}>

                    <label htmlFor="postEditTitle" className={freeboardEditStyle.label}>제목</label> 
                    <input 
                        type="text"
                        id="postEditTitle"
                        className={freeboardEditStyle.info} 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                    />

                    <label htmlFor="postEditContent" className={`${freeboardEditStyle.label} ${freeboardEditStyle.contentLabel}`}>내용</label>
                    <textarea 
                        id="postEditContent"
                        className={freeboardEditStyle.textbox}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 입력하세요"
                        rows="10"
                    />

                    <div className={freeboardEditStyle.edit}> {/* 버튼 컨테이너 클래스명 수정 */}
                        <button 
                            type="button"
                            onClick={handleEditSubmit}
                            className={freeboardEditStyle.submitButton} // 버튼 스타일은 동일하게 적용 가능
                        >
                            수정
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FreeboardEdit;