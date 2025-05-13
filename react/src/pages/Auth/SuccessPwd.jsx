import img from '../../assets/images/key.png';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import styles from './FindPwd.module.css';

function SuccessPwd() {
    return (
        <>
        <Header/>
        <div className={styles.containerf}>
     
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
        <Footer/>
        </>
    );
}

export default SuccessPwd;