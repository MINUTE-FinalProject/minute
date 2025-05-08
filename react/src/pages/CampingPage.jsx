import Footer from "../common/Footer";
import Header from "../common/Header";
import SearchBar from "../common/SearchBar";
import styles from "./CampingPage.module.css";

function CampingPage() {
  return (
    <>
      <Header />
      <div className={styles.container}>

        <SearchBar />
      </div>
      <div className={styles.videoList}>
        <ul>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <Footer/>
    </>
  );
}
export default CampingPage;
