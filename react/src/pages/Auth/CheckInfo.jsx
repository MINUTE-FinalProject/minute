import { useState } from 'react';
import './SignUpForm2.module.css';

function CheckInfo() {
const [gender, setGender] = useState('');
  return (
    <div className="container">
      <div className="header">
    
      </div>
      <div className="form-wrapper">
        <h1 className="title">정보 조회</h1>

        <form className="form">
          <label className="label">name</label>
          <input type="text" id="name" className="text_box" />
        </form>

        <form className="form">
          <label className="label">id</label>
          <form className='form2'>
          <input type="text" id="name" className="text_box" />
          <button className='modibtn'>수정</button>
          </form>
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
          <form className='form2'>
          <input type="text" id="phone" className="text_box" />
          <button className='modibtn'>수정</button>
          </form>
        </form>

        <form className="form">
          <label className="label">email</label>
          <form className='form2'>
          <input type="email" id="email" className="text_box" />
          <button className='modibtn'>수정</button>
          </form>
        </form>

        <form className="form">
          <label className="label">nickname</label>
          <form className='form2'>
          <input type="text" id="nickname" className="text_box" />
          <button className='modibtn'>수정</button>
          </form>
        </form>

        <form className="form">
          <label className="label">birth</label>
          <form className='form2'>
          <input type="text" id="birth" className="text_box" />
          <button className='modibtn'>수정</button>
          </form>
        </form>

        
          <h1 className='foottext'>회원탈퇴</h1>
        

        <div className='footer'>

        </div>
        
      </div>
    </div>
  );
}

export default CheckInfo;
