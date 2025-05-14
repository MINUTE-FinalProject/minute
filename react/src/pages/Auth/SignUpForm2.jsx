import { useState } from "react";
import styles from "./SignUpForm2.module.css";

function SignUpForm2() {
  const [gender, setGender] = useState("");
  return (
    <div className={styles.container}>
      <div className={styles.header}></div>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Sign Up</h1>

        <div className={styles.progressBar}>
                  <div className={styles.circle}></div>
                  <div className={styles.line}></div>
                  <div className={styles.circleActive}></div>
                  <div className={styles.line}></div>
                  <div className={styles.circle}></div>
                </div>

        <form className={styles.form}>
          <label className={styles.label}>name</label>
          <input type="text" id="name" className={styles.textBox} />
        </form>
        <form className={styles.form}>
          <label className={styles.label}>gender</label>
          <div className={styles.genderGroup}>
            <label className={styles.genderOption}>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === "male"}
                onChange={() => setGender("male")}
                className={styles.hiddenRadio}
              />
              <span
                className={`${styles.genderIndicator} ${
                  gender === "male" ? "selected" : ""
                }`}
              />
              Men
            </label>

            <label className={styles.genderOption}>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === "female"}
                onChange={() => setGender("female")}
                className={styles.hiddenRadio}
              />
              <span
                className={`${styles.genderIndicator} ${
                  gender === "female" ? "selected" : ""
                }`}
              />
              Female
            </label>
          </div>
        </form>

        <form className={styles.form}>
          <label className={styles.label}>phone</label>
          <input type="text" id="phone" className={styles.textBox} />
        </form>

        <form className={styles.form}>
          <label className={styles.label}>email</label>
          <input type="email" id="email" className={styles.textBox} />
        </form>

        <form className={styles.form}>
          <label className={styles.label}>nickname</label>
          <input type="text" id="nickname" className={styles.textBox} />
        </form>

        <form className={styles.form}>
          <label className={styles.label}>birth</label>
          <input type="text" id="birth" className={styles.textBox} />
        </form>

        <form className={styles.form}>
          <div className={styles.checkboxGroup}>
            <label>
              <input type="checkbox" />
              약관전체동의
            </label>
          </div>

          <div className={styles.agreebox}>
            <input type="checkbox" />
            &nbsp;&nbsp;(필수) <span className={styles.arrow}>▼</span>
          </div>
          <div className={styles.agreebox}>
            <input type="checkbox" />
            &nbsp;&nbsp;(필수) <span className={styles.arrow}>▼</span>
          </div>
          <div className={styles.agreebox}>
            <input type="checkbox" />
            &nbsp;&nbsp;(선택) 마케팅 수신 동의 <span className={styles.arrow}>▼</span>
          </div>
        </form>

        <form className={styles.form}>
          <button className={styles.submitBtn}>다음</button>
        </form>

        
      </div>
    </div>
  );
}

export default SignUpForm2;
