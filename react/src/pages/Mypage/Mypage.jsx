import { Link } from "react-router-dom";
import styles from "./Mypage.module.css";

function Mypage() {
  return (
    <>
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
                  <Link to="/freeboardDetail">내가쓴글</Link>
                </li>
                <li>
                  <Link to="/qnaDetail">나의문의</Link>
                </li>
                <li>
                  <Link to="/bookmark">북마크</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.planWrap}>
            <div className={styles.planLeftWrap}>
              <div className={styles.calendar}>달력</div>
              <div className={styles.planList}>
                list
                <button className={styles.editButton}>
                  <Link to="/calendar">
                    <img src="/src/assets/images/edit_white.png" alt="list"/>
                  </Link>
                </button>
              </div>
            </div>
            <div className={styles.planRightWrap}>
              <div className={styles.planContext}>
                일정
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
                <img src="/src/assets/images/1.png" alt="맵 1" />
              </li>
              <li>
                <img src="/src/assets/images/2.png" alt="맵 2" />
              </li>
              <li>
                <img src="/src/assets/images/3.png" alt="맵 3" />
              </li>
              <li>
                <img src="/src/assets/images/4.png" alt="맵 4" />
              </li>
              <li>
                <img src="/src/assets/images/5.png" alt="맵 5" />
              </li>
              <li>
                <img src="/src/assets/images/6.png" alt="맵 6" />
              </li>
              <li>
                <img src="/src/assets/images/7.png" alt="맵 7" />
              </li>
              <li>
                <img src="/src/assets/images/8.png" alt="맵 8" />
              </li>
              <li>
                <img src="/src/assets/images/9.png" alt="맵 9" />
              </li>
              <li>
                <img src="/src/assets/images/10.png" alt="맵 10" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Mypage;
