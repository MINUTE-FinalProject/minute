import keyImage from '../../assets/images/key.png';
import Header from "../../components/Header/Header";
import styles from './FindPwd.module.css';

function FindPwd() {
    return (
        <div className={styles.containerf}>
            <Header />
            <div className={styles.boxf}>
                <div className={styles.keyimgf}>
                    <img className={styles.keyimg1f} src={keyImage} alt="key image" />
                </div>
                
                <h1 className={styles.titlef}>Forget Password?</h1>
                
                <form className={styles.formf}>
                    <label className={styles.labelf}>id</label>
                    <input type="text" id="name" className={styles.text_boxf} />

                    <label className={styles.labelf}>본인확인 질문 : "~~~"</label>
                    <input type="text" id="text" className={styles.text_boxf} />
            
                    <button className={styles.submit_btnf}>Next</button>
                </form>
            </div>
        </div>
    );
}

export default FindPwd;
