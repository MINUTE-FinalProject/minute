
import img from "../../assets/images/ex1.jpg";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./ManagerMyPage.module.css";

const ManagerMyPage = () => {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.main}>
          <Sidebar />
          <main className={styles.mypage}>
            <h2>마이페이지</h2>
            <div className={styles.box}>
             <div className={styles.img}><img className={styles.img2} src={img}/></div>
              <div>
                <p>관리자 님</p>
                <p>admin01@gmail.com</p>
                <p>010-1234-4567</p>
                <button>정보수정</button>
              </div>
            </div>
            <div className={styles.stats}>
              <div>회원수<br /><strong>52명</strong></div>
              <div>문의수<br /><strong>19건</strong></div>
              <div>답변대기<br /><strong>3건</strong></div>
              <div>신고회원<br /><strong>5명</strong></div>
            </div>
            
          </main>
        </div>
      </div>
      <footer>Minute 2025</footer>
</>

  );
};

export default ManagerMyPage;
