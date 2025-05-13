import './DeleteAccount.module.css';

function DeleteAccount() {
    return(
    <div className="container">
      <div className="header">

      </div>
      <div className="wrapperD">
        <h1 className="titleD">회원 탈퇴</h1>

        <div className='wrapper2'>
            <div className='wrapper3'>
                <div className='img'><img className='img2' src='img/ex1.jpg'/></div>
                <h1 className='idtext'>yujin0808</h1>
            </div>  

            <h1 className="content">
                아이디를 찾을 수 없습니다<br/>
                010-1234-5678<br/>
                suminji@gmail.com
            </h1>
        </div>
        
        <button className="submit_btnD">회원 탈퇴</button>
      </div>

      <div className='footer'>

      </div>
      
    </div>
    );
} 

export default DeleteAccount;