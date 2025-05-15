import img from '../../assets/images/key.png';
import styles from './FindPwd.module.css';

function FindPwd2() {
    return (
        <div className={styles.pageWrapper}>
        <div className={styles.container}>
         

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
        </div>
    );
}

export default FindPwd2;