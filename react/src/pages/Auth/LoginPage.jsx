import { Link } from "react-router-dom";
import img from "../../assets/images/loginBg.png";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  return (
    <div className={styles.loginWrap}>
      <div className={styles.backImg}>
        <img className={styles.img1} src={img} alt="Login Background" />
      </div>
      <div className={styles.loginBox}>
        <h1 className={styles.logo}>MIN:UTE</h1>
        <div className="formGroup">
          <input type="text" placeholder="UserName" className={styles.input} />
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
          />
          <button className={styles.btn}>Login</button>
        </div>
        <div className={styles.links}>
          <Link to="/findid">아이디찾기</Link> |{" "}
          <Link to="/findpwd">비밀번호찾기</Link> |{" "}
          <Link to="/SignUpForm">회원가입</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
