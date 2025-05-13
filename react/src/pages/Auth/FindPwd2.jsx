import './FindPwd.module.css';

function FindPwd2() {
    return (
        <div className="container">
            <div className="header">

            </div>

            <div className="box">
                <div className='keyimg'>
                    <img className='keyimg1' src='img/key.png'/>
                </div>
                
                <h1 className="title">New Password</h1>
                
                <form className="form">
                    <label className="label">pw</label>
                    <input type="text" id="name" className="text_box" />

                    <label className="label">check pw</label>
                    <input type="text" id="text" className="text_box" />
            
                    <button className="submit_btn">Reset Password</button>
                </form>
            </div>
        </div>
    );
}

export default FindPwd2;