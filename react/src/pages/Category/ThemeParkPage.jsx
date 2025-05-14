import SearchBar from "../../components/MainSearchBar/SearchBar";
import styles from './ThemeParkPage.module.css';

function ThemeParkPage(){
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
export default ThemeParkPage;