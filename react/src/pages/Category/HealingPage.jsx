import SearchBar from "../../components/MainSearchBar/SearchBar";
import styles from './HealingPage.module.css';

function HealingPage(){
  return (
     <>
      <div className={styles.container}>
        <SearchBar />
        <div className={styles.videoList}>
          <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </div>
    </>
  );
}
export default HealingPage;