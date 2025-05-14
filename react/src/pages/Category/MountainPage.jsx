import SearchBar from "../../components/MainSearchBar/SearchBar";
import styles from './MountainPage.module.css';

function MountainPage(){
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
export default MountainPage;