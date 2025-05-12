import Header from "../../components/Header/Header";
import styles from "./SignUpForm.module.css";

const SignupComplete = () => {

  return (
    <>
    <Header/>
    <div className={styles.container2}>
  
      <div className={styles.content2}>
        <h1 className={styles.title2}>Sign Up</h1>

        <div className={styles.progressBar}>
          <div className={styles.circle}></div>
          <div className={styles.line}></div>
          <div className={styles.circle}></div>
          <div className={styles.line}></div>
          <div className={styles.circleActive}></div>
        </div>

        <div className={styles.textBox2}>
          <p className={styles.mainText}>회원가입이 완료되었습니다.</p>
          <p className={styles.subText}>로그인 후 MIN:UTE의 다양한 서비스를 이용하실 수 있습니다.</p>
        </div>

        <button className={styles.loginButton}>Login</button>
      </div>
    </div>
    </>
  );
};

export default SignupComplete;
