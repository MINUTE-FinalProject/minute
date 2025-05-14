import SearchBar from "../../components/MainSearchBar/SearchBar";
import styles from "./CampingPage.module.css";

function CampingPage() {
  return (
      <>
      <div className={styles.container}>
        <SearchBar />
        <div className={styles.videoList}>
         <ul>
          {Array.from({ length: 20 }).map((_, index) => (
            <li key={index}></li>
          ))}
        </ul>
        </div>
      </div>
    </>
  );
}
export default CampingPage;
