import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { data, Link } from "react-router-dom";
import '../../assets/styles/MyCalendar.css';
import styles from "../../assets/styles/Mypage.module.css";
import MypageNav from "../../components/MypageNavBar/MypageNav";
import FiveDayForecast from '../Calendar/FiveDayForecast';

function Mypage2() {
  // 선택된 날짜
  const [value, onChange] = useState(new Date());
  // 보이는 달(월 초)가 바뀔 때 업데이트
  const [activeStartDate, setActiveStartDate] = useState(value);
  // dot 데이터
  const [dotData, setDotData] = useState({});
  // 선택된 날짜의 Plan / Checklist 내용
  const [dailyData, setDailyData] = useState({plan: null, checklist: []});

  // 날짜 포맷 맞춰주는 함수 (yyyy-mm-dd)
  const formatDate = date => date.toLocaleDateString('en-CA');

  // 달 변경 시 dotData 가져오기
  useEffect(() => {
    const yearMonth = `${activeStartDate.getFullYear()}-${String(activeStartDate.getMonth()+1).padStart(2,'0')}`;

    fetch(`http://localhost:8080/mypage/dots?userId=test123&yearMonth=${yearMonth}`)
      .then(res => res.json())
      .then(data => {
        console.log("dotData 확인:", data); // 데이터 확인
        setDotData(data);
      })
      .catch(err => console.error("dot 불러오기 실패", err));
  }, [activeStartDate]);

  // 선택된 날짜 변경 시 dailyData 가져오기
  useEffect(() => {
    const dateStr = formatDate(value);
    fetch(`http://localhost:8080/mypage/data?userId=test123&date=${dateStr}`)
      .then(res => res.json())
      .then(data => {
        console.log("dailyData 확인: ", data);
        setDailyData(data);
      })
      .catch(err => console.log("dailyData 불러오기 실패", err));
  }, [value]);

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
                  // ② 달 네비게이션(<,>) 클릭 시 호출
                  onActiveStartDateChange={({ activeStartDate }) => {
                    setActiveStartDate(activeStartDate);
                  }}
                  next2Label={null}
                  prev2Label={null}
                  showNeighboringMonth={false}
                  tileContent={({ date, view }) => {
                    if (view !== 'month') return null;
                    const key = formatDate(date);
                    const type = dotData[key];
                    if (!type) return null;

                    return (
                      <div className="dot-container">
                        { (type === 'plan' || type === 'both') && <div className="dot plan-dot" /> }
                        { (type === 'checklist' || type === 'both') && <div className="dot checklist-dot" /> }
                      </div>
                    );
                  }}
                />
              </div>
              <div className={styles.planList}>
                <FiveDayForecast/>
              </div>
            </div>
            <div className={styles.planRightWrap}>
              <div className={styles.sectionTitle}>Plan</div>
                <button className={styles.editButton}>
                  <Link to="/calendar">
                    <img src="/src/assets/images/edit_black.png" alt="일정 수정"/>
                  </Link>
                </button>
                <div className={styles.planContext}>
                  {dailyData.plan
                    ? <p className={styles.planPreview}>{dailyData.plan.planContent}</p>
                    : <p className={styles.empty}>등록된 플랜이 없습니다.</p>
                  }
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
