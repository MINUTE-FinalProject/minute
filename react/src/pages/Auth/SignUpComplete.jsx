import "./SignUpForm.module.css";

const SignupComplete = () => {
  return (
    <div className="container2">
      <div className="header">
       
      </div>

      <div className="content2">
        <h1 className="title2">Sign Up</h1>

        <div className="progress-bar">
          <div className="circle completed"></div>
          <div className="line"></div>
          <div className="circle completed"></div>
          <div className="line"></div>
          <div className="circle active"></div>
        </div>

        <div className="text_box2">
          <p className="main_text">회원가입이 완료되었습니다.</p>
          <p className="sub_text">로그인 후 MIN:UTE의 다양한 서비스를 이용하실 수 있습니다.</p>
        </div>

        <button className="login_button">Login</button>
      </div>
    </div>
  );
};

export default SignupComplete;
