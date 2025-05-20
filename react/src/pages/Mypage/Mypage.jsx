import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Link } from "react-router-dom";
import '../../assets/styles/MyCalendar.css';
import styles from "../../assets/styles/Mypage.module.css";
import MypageNav from "../../components/MypageNavBar/MypageNav";

function Mypage2() {
  const [value, onChange] = useState(new Date());
  const [dotData, setDotData] = useState({});

  useEffect(() => {
    const yearMonth = value.toISOString().slice(0, 7); // yyyy-MM

    fetch(`http://localhost:8080/mypage/dots?userId=test123&yearMonth=${yearMonth}`)
      .then(res => res.json())
      .then(data => {
        console.log("📌 dotData 확인:", data); // ← 이거로 진짜 오는지 체크
        setDotData(data);
      })
      .catch(err => console.error("dot 불러오기 실패", err));
  }, [value]);

  // 날짜 포맷 맞춰주는 함수 (yyyy-mm-dd)
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };


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
                  tileContent={({ date }) => {
                    const dateStr = formatDate(date);
                    const dotType = dotData[dateStr];

                    if (dotType === 'plan') {
                      return <div className="dot plan-dot" />;
                    } else if (dotType === 'checklist') {
                      return <div className="dot checklist-dot" />;
                    } else if (dotType === 'both') {
                      return (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2px' }}>
                          <div className="dot plan-dot" />
                          <div className="dot checklist-dot" />
                        </div>
                      );
                    }
                    return null;
                  }}

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
