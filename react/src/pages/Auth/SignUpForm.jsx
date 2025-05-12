import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import styles from "./SignUpForm.module.css";

function SignUpForm() {
  return (
    <>
    <Header/>
    <div className={styles.container}>

      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Sign Up</h1>

        <div className={styles.progressBar}>
          <div className={styles.circleActive}></div>
          <div className={styles.line}></div>
          <div className={styles.circle}></div>
          <div className={styles.line}></div>
          <div className={styles.circle}></div>
        </div>

        <form className={styles.form}>
          <div>
            <label className={styles.label}>id</label>
            <input type="text" className={styles.textBox} />
          </div>
          <div>
            <label className={styles.label}>pw</label>
            <input type="password" className={styles.textBox} />
          </div>
          <div>
            <label className={styles.label}>pw check</label>
            <input type="password" className={styles.textBox} />
          </div>

          <button type="submit" className={styles.submitBtn} disabled>
            다음
          </button>
        </form>
      </div>
    </div>
    <Footer/>
    </>
  );
}
export default SignUpForm;