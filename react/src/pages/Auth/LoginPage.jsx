import { Link, useNavigate } from "react-router-dom";
import img from "../../assets/images/loginBg1.png";
import styles from "../../assets/styles/LoginPage.module.css";
import axios from 'axios';
import { useState } from 'react';

function LoginPage() {
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg(""); 

    console.log("로그인 시도:", { userId, userPw });

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/sign-in', {
        userId, 
        userPw, 
      });

      if (response.data && response.data.token) {
        const token = response.data.token;
        alert('로그인 성공!');
        localStorage.setItem('token', token);
        console.log('로그인 성공, 토큰 저장됨:', token);
        navigate("/"); 
      } else {
        console.error("로그인 응답 데이터에 토큰이 없습니다:", response.data);
        setErrorMsg("로그인에 성공했으나, 토큰 정보를 받지 못했습니다.");
      }
      
    } catch (err) {
      console.error("로그인 API 호출 중 전체 에러 객체:", err);

      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;

        console.error(`🛑 백엔드 응답 (상태 코드: ${status}):`, data);

        if (status === 401) { 
          if (data && data.code === "SF") { 
            setErrorMsg("존재하지 않는 아이디입니다.");
          } else if (data && data.code === "IP") { 
            setErrorMsg("비밀번호가 올바르지 않습니다.");
          } else if (data && data.message) { 
            setErrorMsg(`로그인 실패: ${data.message}`);
          } else { 
            setErrorMsg("로그인 실패: 아이디 또는 비밀번호를 확인해주세요. (서버 응답은 콘솔 확인)");
          }
        } else if (status === 400) { 
          setErrorMsg(`로그인 실패: 잘못된 요청입니다. (서버 응답: ${data?.message || '내용 없음'})`);
        } else { 
          setErrorMsg(`로그인 실패: 서버 오류 (상태 코드: ${status})`);
        }
      } else if (err.request) {
        console.error("서버로부터 응답을 받지 못했습니다:", err.request);
        setErrorMsg("서버와 통신할 수 없습니다. 네트워크 연결을 확인해주세요.");
      } else {
        console.error("로그인 요청 설정 중 오류:", err.message);
        setErrorMsg("로그인 요청 중 오류가 발생했습니다.");
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
            <input 
              type="text" 
              value={userId}
              placeholder="Id" 
              onChange={(e) => setUserId(e.target.value)}
              className={styles.input} 
            />
            <input
              type="password"
              value={userPw}
              placeholder="Password"
              onChange={(e) => setUserPw(e.target.value)}
              className={styles.input1}
              required
            />
            {errorMsg && <div className={styles.err}>{errorMsg}</div>} 
            <button type="submit" className={styles.btn}>Login</button>
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