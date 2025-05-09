import React, { useState } from 'react';
import './SignUpForm2.css';
import './index.css';

function SignUpForm2() {
const [gender, setGender] = useState('');
  return (
    <div className="container">
      <div className="header">
    
      </div>
      <div className="form-wrapper">
        <h1 className="title">Sign Up</h1>

        <div className="progress-bar">
          <div className="circle" />
          <div className="line" />
          <div className="circle active" />
          <div className="line" />
          <div className="circle" />
        </div>

        <form className="form">
          <label className="label">name</label>
          <input type="text" id="name" className="text_box" />
        </form>
          <form className="form">
          <label className="label">gender</label>
          <div className="gender-group">
            <label className="gender-option">
            <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === 'male'}
                onChange={() => setGender('male')}
                className="hidden-radio"
            />
            <span className={`gender-indicator ${gender === 'male' ? 'selected' : ''}`} />
            Men
      </label>

      <label className="gender-option">
        <input
          type="radio"
          name="gender"
          value="female"
          checked={gender === 'female'}
          onChange={() => setGender('female')}
          className="hidden-radio"
        />
        <span className={`gender-indicator ${gender === 'female' ? 'selected' : ''}`} />
        Female
            </label>
            
          </div>
        </form>

        <form className="form">
          <label className="label">phone</label>
          <input type="text" id="phone" className="text_box" />
        </form>

        <form className="form">
          <label className="label">email</label>
          <input type="email" id="email" className="text_box" />
        </form>

        <form className="form">
          <label className="label">nickname</label>
          <input type="text" id="nickname" className="text_box" />
        </form>

        <form className="form">
          <label className="label">birth</label>
          <input type="text" id="birth" className="text_box" />
        </form>

        <form className="form">
          <div className="checkbox-group">
            <label>
              <input type="checkbox" />
              약관전체동의
            </label>
          </div>

          <div className="agreebox"><input type="checkbox" />&nbsp;&nbsp;(필수) <span className="arrow">▼</span></div>
          <div className="agreebox"><input type="checkbox" />&nbsp;&nbsp;(필수) <span className="arrow">▼</span></div>
          <div className="agreebox"><input type="checkbox" />&nbsp;&nbsp;(선택) 마케팅 수신 동의 <span className="arrow">▼</span></div>
        </form>

        <form className="form">
          <button className="submit_btn">다음</button>
        </form>

        <div className='footer'>

        </div>
      </div>
    </div>
  );
}

export default SignUpForm2;
