import React from "react";
import "./LoginPage.css";

const LoginPage = () => {
  return (
    <div className="login-wrap">
        <div className="keyimg">
        <img className="img1" src="/images/login.png" alt="Login Background" />
      </div>
      <div className="login-box">
        <h1 className="logo">MIN:UTE</h1>
        <input type="text" placeholder="UserName" className="input" />
        <input type="password" placeholder="Password" className="input" />
        <button className="btn">Login</button>
        <div className="links">
          <a href="#">아이디찾기</a> | <a href="#">비밀번호찾기</a> | <a href="#">회원가입</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
