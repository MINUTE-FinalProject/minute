import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import styles from './SuccessID.module.css';


function SuccessID() {
  return (
    <>
    <Header/>
    <div className={styles.container}>
    
      <div className={styles.wrapper}>
        <h1 className={styles.title}>아이디 찾기 성공!</h1>

        <h1 className={styles.content}>회원님의 아이디</h1>
        <h1 className={styles.content2}>yujin881023</h1>

        <button className={styles.submitBtn}>Login</button>
        <button className={styles.pwdBtn}>비밀번호 찾기</button>

      </div>
    </div>
    <Footer/>
    </>
  );
}

export default SuccessID;
