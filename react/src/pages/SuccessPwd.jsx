import './FindPwd.css';

function SuccessPwd() {
    return (
        <div className="container">
            <div className="header">

            </div>

            <div className="box">
                <div className='keyimg'>
                    <img className='keyimg1' src='img/key.png'/>
                </div>
                
                <h1 className="title2">비밀번호가 재설정 되었습니다!</h1>
                <h1 className="title3">로그인 후 MIN:UTE의 다양한 서비스를 이용하세요🍀</h1>

                <form className="form">
                    <button className="login_btn">Login</button>
                </form>
            </div>
        </div>
    );
}

export default SuccessPwd;