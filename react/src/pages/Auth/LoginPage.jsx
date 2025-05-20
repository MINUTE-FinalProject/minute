import { Link } from "react-router-dom";
import img from "../../assets/images/loginBg1.png";
import styles from "../../assets/styles/LoginPage.module.css";

import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/sign-in', {
        userId,
        userPw,
      });
      const token = response.data.token;
      alert('로그인 성공!');
      localStorage.setItem('token', token);
      navigate("/");
       
    } catch (err) {
    console.error(err);

    if (err.response && err.response.data) {
      const data = err.response.data;
      if (data.code === "SF") {
        setErrorMsg("존재하지 않는 아이디입니다.");
      } else if (data.code === "IP") {
        setErrorMsg("비밀번호가 올바르지 않습니다.");
      } else {
        setErrorMsg("로그인 실패: 알 수 없는 오류입니다.");
      }
    } else {
      setErrorMsg("서버와 통신할 수 없습니다.");
    }
  }
};

  return (
    <form onSubmit={handleSignIn}>
    <div className={styles.loginWrap}>
      <div className={styles.backImg}>
        <img className={styles.img1} src={img} alt="Login Background" />
      </div>
      <div className={styles.loginBox}>
        <Link to="/">
        <h1 className={styles.logo}>MIN:UTE</h1>
        </Link>
        <div className="formGroup">
          <input type="text" 
                 value={userId}
                 placeholder="Id" 
                 onChange={(e) => setUserId(e.target.value)}
                 className={styles.input} />
          <input
            type="password"
            value={userPw}
            placeholder="Password"
            onChange={(e) => setUserPw(e.target.value)}
            className={styles.input1}
            required
          />
          <div className={styles.err}>
            {errorMsg}
          </div>
          <button className={styles.btn}>Login</button>
        </div>
        <div className={styles.links}>
          <Link to="/findid">아이디찾기</Link> |{" "}
          <Link to="/findpwd">비밀번호찾기</Link> |{" "}
          <Link to="/SignUpForm">회원가입</Link>
        </div>
      </div>
    </div>
    </form>

  );
};

export default LoginPage;
