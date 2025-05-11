import React from "react";
import "./LoginRequired.css";

const LoginRequired = () => {
  return (
    <div className="login_required_container">
      <h1 className="login_required_logo">MIN:UTE</h1>
      <div className='keyimg'>
            <img className='img1' src='images/waring.png'/>
        </div>
      <h2 className="login_required_title">로그인이 필요합니다</h2>
      <div className="login_required_box">
        <p>해당 서비스는 로그인이 필요합니다.<br />
        MIN:UTE 에 가입하여 다양한 서비스를 이용하세요.</p>
      </div>
      <button className="login_required_button">Login</button>
    </div>
  );
};

export default LoginRequired;