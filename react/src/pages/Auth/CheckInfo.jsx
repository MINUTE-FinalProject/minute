import { useState } from 'react';
import Header from "../../components/Header/Header";
import styles from './CheckInfo.module.css';

function CheckInfo() {
  const [gender, setGender] = useState('');

  return (
    <>
    <Header />
    <div className={styles.container}>
      
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>정보 조회</h1>

        <div className={styles.form}>
          <label className={styles.label}>name</label>
          <input type="text" id="name" className={styles.textBox} />
        </div>

        <div className={styles.form}>
          <label className={styles.label}>id</label>
          <div className={styles.form2}>
            <input type="text" id="id" className={styles.textBox} />
            <button className={styles.modibtn}>수정</button>
          </div>
        </div>

        <div className={styles.form}>
          <label className={styles.label}>gender</label>
          <div className={styles.genderGroup}>
            <label className={styles.genderOption}>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === 'male'}
                onChange={() => setGender('male')}
                className={styles.hiddenRadio}
              />
              <span className={`${styles.genderIndicator} ${gender === 'male' ? styles.selected : ''}`} />
              Men
            </label>

            <label className={styles.genderOption}>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === 'female'}
                onChange={() => setGender('female')}
                className={styles.hiddenRadio}
              />
              <span className={`${styles.genderIndicator} ${gender === 'female' ? styles.selected : ''}`} />
              Female
            </label>
          </div>
        </div>

        <div className={styles.form}>
          <label className={styles.label}>phone</label>
          <div className={styles.form2}>
            <input type="text" id="phone" className={styles.textBox} />
            <button className={styles.modibtn}>수정</button>
          </div>
        </div>

        <div className={styles.form}>
          <label className={styles.label}>email</label>
          <div className={styles.form2}>
            <input type="email" id="email" className={styles.textBox} />
            <button className={styles.modibtn}>수정</button>
          </div>
        </div>

        <div className={styles.form}>
          <label className={styles.label}>nickname</label>
          <div className={styles.form2}>
            <input type="text" id="nickname" className={styles.textBox} />
            <button className={styles.modibtn}>수정</button>
          </div>
        </div>

        <div className={styles.form}>
          <label className={styles.label}>birth</label>
          <div className={styles.form2}>
            <input type="text" id="birth" className={styles.textBox} />
            <button className={styles.modibtn}>수정</button>
          </div>
        </div>

        <h1 className={styles.foottext}>회원탈퇴</h1>

        <div className={styles.footer}></div>
      </div>
    </div>
    </>
  );
}

export default CheckInfo;
