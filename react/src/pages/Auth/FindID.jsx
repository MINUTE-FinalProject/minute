import './FindID.css';

function FindID() {
  return (
    <div className="container">
      <div className="header">

      </div>
      
      <div className="wrapper">
        <h1 className="title">아이디 찾기</h1>

        <form className="form">
          <label className="label">name</label>
          <input type="text" id="name" className="text_box" />

          <label className="label">email</label>
          <input type="email" id="email" className="text_box" />

          <label className="label">phone</label>
          <input type="text" id="phone" className="text_box2" />
          <h4 className='forgetmsg'>아이디가 없으신가요? <span className='highlight'>회원가입</span></h4>


          <button className="submit_btn">아이디 찾기</button>
        </form>

        <div className='footer'>

        </div>
      </div>
    </div>
  );
}

export default FindID;
