import './FailFindID.module.css';

function FailFindID() {
  return (
    <div className="container">
      <div className="header">

      </div>
      <div className="wrapper">
        <h1 className="title">아이디 찾기</h1>

        <h1 className="content">아이디를 찾을 수 없습니다</h1>
          
        <h4 className='forgetmsg'>아이디가 없으신가요? <span className='highlight'>회원가입</span></h4>

        <button className="submit_btn">아이디 찾기</button>
      </div>

        <div className='footer'>

        </div>
      
    </div>
  );
}

export default FailFindID;
