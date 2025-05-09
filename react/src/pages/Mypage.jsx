import MypageNav from './MypageNav';

import styles from './Mypage.module.css';

function Mypage(){
    return(
        <>
        <MypageNav/>
        <div className={styles.container}>
            <div className={styles.leftWrap}>
                <div className={styles.profileWrap}>
                    <div className={styles.profileContent}>
                        <div className={styles.profile}>
                        <h1 className={styles.profileNickName}>SuMinJi</h1>
                            <div className={styles.profileImg}>
                                <img src="src/images/cute.png" alt="프로필 이미지" />
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
                            <li>정보수정</li>
                            <li>내가쓴글</li>
                            <li>나의문의</li>
                            <li>북마크</li>
                        </ul>
                    </div>
                </div>
                <div className={styles.planWrap}>
                    <div className={styles.planLeftWrap}>
                        <div className={styles.calendar}>달력</div>
                        <div className={styles.planList}>list</div>
                    </div>
                    <div className={styles.planRightWrap}>
                        <div className={styles.planContext}>일정</div>
                    </div>
                </div>
            </div>
            <div className={styles.rightWrap}>
                <div className={styles.mapWrap}>
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
        </>
    )
}

export default Mypage;
