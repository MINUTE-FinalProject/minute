import React from "react";
import "./SignUpForm.css";

function SignUpForm() {
  return (
    <div className="container">
      <div className="header">
        
      </div>

      <div className="form-wrapper">
        <h1 className="title">Sign Up</h1>

        <div className="progress-bar">
          <div className="circle active"></div>
          <div className="line"></div>
          <div className="circle"></div>
          <div className="line"></div>
          <div className="circle"></div>
        </div>

        <form className="form">
          <div>
            <label className="label">id</label>
            <input type="text" className="text_box" />
          </div>
          <div>
            <label className="label">pw</label>
            <input type="password" className="text_box" />
          </div>
          <div>
            <label className="label">pw check</label>
            <input type="password" className="text_box" />
          </div>

          <button type="submit" className="submit_btn" disabled>
            다음
          </button>
        </form>
      </div>
    </div>
  );
}
export default SignUpForm