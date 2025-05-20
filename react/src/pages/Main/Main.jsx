import divStyle from "../../assets/styles/Main.module.css";
import Header from "../../components/Header/Header";
import SearchBar from "../../components/MainSearchBar/SearchBar";

function Main() {
  return (
    <>
      <Header />
      <div className={divStyle.main}>
        <SearchBar />
        <div className={divStyle.videoList}>
          <ul>
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
export default Main;
