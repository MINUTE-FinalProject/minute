import img from '../../assets/images/loginBg.png';
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  return (
    <div className={styles.loginWrap}>
        <div className={styles.keyimg}>
        <img className={styles.img1} src={img} alt="Login Background" />
      </div>
      <div className={styles.loginBox}>
        <h1 className={styles.logo}>MIN:UTE</h1>
        <input type="text" placeholder="UserName" className={styles.input} />
        <input type="password" placeholder="Password" className={styles.input} />
        <button className={styles.btn}>Login</button>
        <div className={styles.links}>
          <a href="#">아이디찾기</a> | <a href="#">비밀번호찾기</a> | <a href="#">회원가입</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
