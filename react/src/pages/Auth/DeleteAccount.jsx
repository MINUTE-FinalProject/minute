import img from '../../assets/images/ex1.jpg';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import styles from './DeleteAccount.module.css';

function DeleteAccount() {
    return(
      <>
      <Header/>
    <div className={styles.container}>
      <div className={styles.header}>

      </div>
      <div className={styles.wrapperD}>
        <h1 className={styles.titleD}>회원 탈퇴</h1>

        <div className={styles.wrapper2}>
            <div className={styles.wrapper3}>
                <div className={styles.img}><img className={styles.img2} src={img}/></div>
                <h1 className={styles.idtext}>yujin0808</h1>
            </div>  

            <h1 className={styles.content}>
                아이디를 찾을 수 없습니다<br/>
                010-1234-5678<br/>
                suminji@gmail.com
            </h1>
        </div>
        
        <button className={styles.submitBtnD}>회원 탈퇴</button>
      </div>
    </div>
    <Footer/>
    </>
    );
} 

export default DeleteAccount;