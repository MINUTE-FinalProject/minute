import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import SearchBar from "../../components/MainSearchBar/SearchBar";
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
