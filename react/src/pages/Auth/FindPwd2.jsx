import img from '../../assets/images/key.png';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import styles from './FindPwd.module.css';

function FindPwd2() {
    return (
        <>
        <Header/>
        <div className={styles.containerf}>
         

            <div className={styles.boxf}>
                <div className={styles.keyimgf}>
                    <img className={styles.keyimg1f} src={img}/>
                </div>
                
                <h1 className={styles.titlef}>New Password</h1>
                
                <form className={styles.formf}>
                    <label className={styles.labelf}>pw</label>
                    <input type="text" id="name" className={styles.text_boxf} />

                    <label className={styles.labelf}>check pw</label>
                    <input type="text" id="text" className={styles.text_boxf} />
            
                    <button className={styles.submit_btnf}>Reset Password</button>
                </form>
            </div>
        </div>
        <Footer/>
        </>
    );
}

export default FindPwd2;