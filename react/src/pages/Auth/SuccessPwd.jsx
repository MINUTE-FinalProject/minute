import img from '../../assets/images/key.png';
import styles from './FindPwd.module.css';

function SuccessPwd() {
    return (
         <div className={styles.pageWrapper}>
        <div className={styles.container}>
     
            <div className={styles.boxf}>
                <div className={styles.keyimgf}>
                    <img className={styles.keyimg1f} src={img}/>
                </div>
                
                <h1 className={styles.title2f}>비밀번호가 재설정 되었습니다!</h1>
                <h1 className={styles.title3f}>로그인 후 MIN:UTE의 다양한 서비스를 이용하세요🍀</h1>

                <form className={styles.formf}>
                    <button className={styles.login_btn}>Login</button>
                </form>
            </div>
        </div>
        </div>
    );
}

export default SuccessPwd;