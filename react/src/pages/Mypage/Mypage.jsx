import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Link } from "react-router-dom";
import MypageNav from "../../components/MypageNavBar/MypageNav";
import './MyCalendar.css';
import styles from "./Mypage.module.css";

function Mypage2() {
  const [value, onChange] = useState(new Date());
  return (
    <>
    <MypageNav/>
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.leftWrap}>
          <div className={styles.profileWrap}>
            <div className={styles.profileContent}>
              <div className={styles.profile}>
                <h1 className={styles.profileNickName}>SuMinJi</h1>
                <div className={styles.profileImg}>
                  <img src="/src/assets/images/cute.png" alt="프로필 이미지" />
                </div>
              </div>
              <div className={styles.profileInfo}>
                <p className={styles.profileName}>수민지</p>
                <p className={styles.profileNumber}>010-1234-5678</p>
                <p className={styles.profileEmail}>suminji@gmail.com</p>
              </div>
            </div>
            <div className={styles.profileNavbar}>
              <ul>
                {/* 여기다가 링크 연결하세요 */}
                <li>
                  <Link to="/checkinfo">정보수정</Link>
                </li>
                <li>
                  <Link to="/freeboard">내가쓴글</Link>
                </li>
                <li>
                  <Link to="/qna">나의문의</Link>
                </li>
                <li>
                  <Link to="/bookmark">북마크</Link>
                </li>
                <li>
                  <Link to="/Like">기록</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.planWrap}>
            <div className={styles.planLeftWrap}>
              <div className={styles.calendar}>
                <Calendar
                  locale="en"
                  onChange={onChange}
                  value={value}
                  next2Label={null}
                  prev2Label={null}
                  showNeighboringMonth={false}
                />
              </div>
              <div className={styles.planList}>
                Check-List
                <button className={styles.editButton}>
                  <Link to="/calendar">
                    <img src="/src/assets/images/edit_white.png" alt="list"/>
                  </Link>
                </button>
              </div>
            </div>
            <div className={styles.planRightWrap}>
              <div className={styles.planContext}>
                Plan
                <button className={styles.editButton}>
                  <Link to="/calendar">
                    <img src="/src/assets/images/edit_black.png" alt="일정 수정"/>
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.rightWrap}>
          <div className={styles.mapWrap}>
            <ul>
              <li>
                <Link to="/area/gyeonggido" className={styles.linkStyle}>
                  <img src="/src/assets/images/1.png" alt="맵 경기도" />
                </Link>
              </li>
              <li>
                 <Link to="/area/gangwondo" className={styles.linkStyle}>
                  <img src="/src/assets/images/2.png" alt="맵 강원도" />
                </Link>
              </li>
              <li>
                <Link to="/area/gyeongsandbuk" className={styles.linkStyle}>
                  <img src="/src/assets/images/3.png" alt="맵 경상북도" />
                </Link>
              </li>
              <li>
                <Link to="/area/chungcheongbuk" className={styles.linkStyle}>
                  <img src="/src/assets/images/4.png" alt="맵 충청북도" />
                </Link>
              </li>
              <li>
                <Link to="/area/chungcheongnam" className={styles.linkStyle}>
                  <img src="/src/assets/images/5.png" alt="맵 충청남도" />
                </Link>  
              </li>
              <li>
                <Link to="/area/jeollabuk" className={styles.linkStyle}>
                  <img src="/src/assets/images/6.png" alt="맵 전라북도" />
                </Link>  
              </li>
              <li>
                <img src="/src/assets/images/7.png" alt="맵 " />
              </li>
              <li>
                <Link to="/area/gyeongsangnam" className={styles.linkStyle}>
                  <img src="/src/assets/images/8.png" alt="맵 경상남도" />
                </Link>  
              </li>
              <li>
                <Link to="/area/jeollanam" className={styles.linkStyle}>
                  <img src="/src/assets/images/9.png" alt="맵 전라남도" />
                </Link>
              </li>
              <li>
                <Link to="/area/jeju" className={styles.linkStyle}>
                  <img src="/src/assets/images/10.png" alt="맵 제주도" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default Mypage2;
