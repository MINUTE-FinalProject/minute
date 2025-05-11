import './FindPwd.css';

function FindPwd() {
    return (
        <div className="container">
            <div className="header">

            </div>

            <div className="box">
                <div className='keyimg'>
                    <img className='keyimg1' src='img/key.png'/>
                </div>
                
                <h1 className="title">Forget Password?</h1>
                
                <form className="form">
                    <label className="label">id</label>
                    <input type="text" id="name" className="text_box" />

                    <label className="label">본인확인 질문 : "~~~"</label>
                    <input type="text" id="text" className="text_box" />
            
                    <button className="submit_btn">Next</button>
                </form>
            </div>
        </div>
    );
}

export default FindPwd;