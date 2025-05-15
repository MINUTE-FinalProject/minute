import { Link } from 'react-router-dom'; // Link import 추가
import MypageNav from '../../components/MypageNavBar/MypageNav';
import qnaWriteStyle from './qnaWrite.module.css';
// import { useState } from 'react'; // 실제 상태 관리 시 필요

function QnaWrite() {
    // const [title, setTitle] = useState('');
    // const [content, setContent] = useState('');
    // const [images, setImages] = useState([]);

    // const handleFileSelect = (event) => { /* ... */ };
    // const handleSubmit = (event) => { /* ... */ };

    return (
        // <form onSubmit={handleSubmit}>
        <>
            <MypageNav/>
            <div className={qnaWriteStyle.layout}>
                <div className={qnaWriteStyle.container}>
                    <div className={qnaWriteStyle.background}>

                        <div className={qnaWriteStyle.title}>
                            <Link to="/qna" className={qnaWriteStyle.pageTitleLink}> {/* Link 컴포넌트 및 클래스 적용 */}
                                <h1>Q&A</h1>
                            </Link>
                        </div>

                        <div className={qnaWriteStyle.contentArea}>
                            <div className={qnaWriteStyle.info}>
                                <label htmlFor="qnaFormTitle" className={qnaWriteStyle.label}>제목</label>
                                <input
                                    type="text"
                                    id="qnaFormTitle"
                                    className={qnaWriteStyle.inputField} // CSS 모듈 클래스 적용
                                    placeholder="제목을 입력해주세요"
                                    // value={title}
                                    // onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className={qnaWriteStyle.textbox}>
                                <label htmlFor="qnaFormContent" className={qnaWriteStyle.label}>내용</label>
                                <textarea
                                    id="qnaFormContent"
                                    className={qnaWriteStyle.textareaField} // CSS 모듈 클래스 적용
                                    placeholder="내용을 입력해주세요."
                                    // value={content}
                                    // onChange={(e) => setContent(e.target.value)}
                                ></textarea>
                            </div>

                            <div className={qnaWriteStyle.img}>
                                <label htmlFor="qnaFormImages" className={qnaWriteStyle.label}>이미지 첨부</label>
                                <input
                                    type="file"
                                    id="qnaFormImages"
                                    multiple
                                    accept="image/*"
                                    // onChange={handleFileSelect}
                                    style={{ display: 'none' }}
                                />
                                <div className={qnaWriteStyle.imagePreviewContainer}>
                                    <div
                                        className={qnaWriteStyle.imagePlaceholder}
                                        onClick={() => document.getElementById('qnaFormImages').click()}
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={(e) => { if (e.key === 'Enter') document.getElementById('qnaFormImages').click(); }}
                                    >
                                        이미지 1
                                    </div>
                                    <div
                                        className={qnaWriteStyle.imagePlaceholder}
                                        onClick={() => document.getElementById('qnaFormImages').click()}
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={(e) => { if (e.key === 'Enter') document.getElementById('qnaFormImages').click(); }}
                                    >
                                        이미지 2
                                    </div>
                                    <div
                                        className={qnaWriteStyle.imagePlaceholder}
                                        onClick={() => document.getElementById('qnaFormImages').click()}
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={(e) => { if (e.key === 'Enter') document.getElementById('qnaFormImages').click(); }}
                                    >
                                        이미지 3
                                    </div>
                                </div>
                            </div>

                            <div className={qnaWriteStyle.buttons}>
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('qnaFormImages').click()}
                                >
                                    업로드
                                </button>
                                <button
                                    type="submit" // 또는 type="button"
                                >
                                    작성
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
        // </form>
    );
}

export default QnaWrite;