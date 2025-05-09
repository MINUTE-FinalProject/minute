import { Link } from "react-router-dom";
import mypageStyle from "./Mypage.module.css";
import MypageNav from './MypageNav';

function Mypage() {
    return (
        <>
            <MypageNav />
            <div className={mypageStyle.contents_wrap}>
                <div className={mypageStyle.all_wrap}>
                    <div className={mypageStyle.profileWrap}>
                        <div className={mypageStyle.profileSection}>
                            <div className={mypageStyle.profileName}>SuMinji</div>
                            <div className={mypageStyle.profileRow}>
                                <div className={mypageStyle.profileEdit}>
                                    <img src="/src/images/cute.png" className={mypageStyle.profileImg} alt="프로필" />
                                    <ul className={mypageStyle.edit_pencil}>
                                        <li>
                                            <img src="/src/images/edit_pencil.png" alt="" />
                                        </li>
                                    </ul>
                                </div>

                                <div className={mypageStyle.profileInfo}>
                                    <p>수민지</p>
                                    <p>010-1234-5678</p>
                                    <p>suminji@gmail.com</p>
                                </div>
                            </div>

                            <div className={mypageStyle.buttonSection}>
                                <button>정보수정</button>
                                <button>내가쓴글</button>
                                <button>나의 문의</button>
                                <Link to="/bookmark">
                                    <button>북마크</button>
                                </Link>
                            </div>
                        </div>

                        <div className={mypageStyle.gridSection}>
                            <div className={mypageStyle.gridLeft}>
                                <div className={mypageStyle.calendarBox}>
                                    <p>2025년 5월</p>
                                </div>

                                <div className={mypageStyle.checklistBox}>
                                    <h4>list</h4>
                                    <Link to="/calendar"><img src="/src/images/edit_white.png" className={mypageStyle.editIcon} alt="" /></Link>
                                    <ul>
                                        <li><input type="checkbox" /><p>충전기 챙기기!!</p></li>
                                        <li><input type="checkbox" /> <p>충전기 챙기기!!</p></li>
                                        <li><input type="checkbox" /><p>충전기 챙기기!!</p></li>
                                        <li><input type="checkbox" /><p>충전기 챙기기!!</p></li>
                                    </ul>
                                </div>
                            </div>

                            <div className={mypageStyle.gridRight}>
                                <div className={mypageStyle.title}>
                                    <h4>plan</h4>
                                    <Link to="/calendar"><img src="/src/images/edit_black.png" className={mypageStyle.editIcon} alt="" /></Link>
                                </div>
                                <p>부산여행!!!</p>
                                <p>밥</p>
                                <p>산책</p>
                                <p>바다</p>
                                <p>카페</p>
                            </div>
                        </div>

                    </div>

                    <div className={mypageStyle.mapBox}>

                        <div className={mypageStyle.map}>
                            <ul>
                                <li><img src="/src/images/1.png" alt="" /></li>
                                <li><img src="/src/images/2.png" alt="" /></li>
                                <li><img src="/src/images/3.png" alt="" /></li>
                                <li><img src="/src/images/4.png" alt="" /></li>
                                <li><img src="/src/images/5.png" alt="" /></li>
                                <li><img src="/src/images/6.png" alt="" /></li>
                                <li><img src="/src/images/7.png" alt="" /></li>
                                <li><img src="/src/images/8.png" alt="" /></li>
                                <li><img src="/src/images/9.png" alt="" /></li>
                                <li><img src="/src/images/10.png" alt="" /></li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Mypage;
