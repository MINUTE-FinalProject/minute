import styles from './FindID.module.css';

function FindID() {
  return (
    <div className={styles.pageWrapper}>
    <div className={styles.container}>
        
      <div className={styles.wrapper}>
        <h1 className={styles.title}>아이디 찾기</h1>

        <form className={styles.form}>
          <label className={styles.label}>name</label>
          <input type="text" id="name" className={styles.textBox} />

          <label className={styles.label}>email</label>
          <input type="email" id="email" className={styles.textBox} />

          <label className={styles.label}>phone</label>
          <input type="text" id="phone" className={styles.textBox2} />
          <h4 className={styles.forgetmsg}>아이디가 없으신가요? <span className={styles.highlight}>회원가입</span></h4>


          <button className={styles.submitBtn}>아이디 찾기</button>
        </form>

      </div>
    </div>
    </div>
  );
}

export default FindID;
