import { useState } from 'react';
import { Link } from 'react-router-dom';
import banner from "../assets/banner.png"; // 실제 경로 확인 필요
import freeboardWriteStyle from './freeboardWrite.module.css';

function FreeboardWrite() {
    const freeboardPath = '/freeboard'; // 실제 자유게시판 경로로 수정

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = () => {
        console.log('제목:', title);
        console.log('내용:', content);
        // 실제 제출 로직 추가
    };

    return (
        <div className={freeboardWriteStyle.background}>
            
            <div className={freeboardWriteStyle.title}>
                <Link to={freeboardPath} className={freeboardWriteStyle.titleLink}>
                    <h1>자유게시판</h1>
                </Link>
            </div>

            <div className={freeboardWriteStyle.contentArea}>

                <div className={freeboardWriteStyle.img}>
                    <img src={banner} alt="자유게시판배너" />
                </div>

                <div className={freeboardWriteStyle.content}>

                    <label htmlFor="postTitle" className={freeboardWriteStyle.label}>제목</label> 
                    <input 
                        type="text"
                        id="postTitle"
                        className={freeboardWriteStyle.info} 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                    />

                    <label htmlFor="postContent" className={`${freeboardWriteStyle.label} ${freeboardWriteStyle.contentLabel}`}>내용</label>
                    <textarea 
                        id="postContent"
                        className={freeboardWriteStyle.textbox}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 입력하세요"
                        rows="10"
                    />

                    <div className={freeboardWriteStyle.wirte}> 
                        <button 
                            type="button"
                            onClick={handleSubmit}
                            className={freeboardWriteStyle.submitButton}
                        >
                            작성
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FreeboardWrite;