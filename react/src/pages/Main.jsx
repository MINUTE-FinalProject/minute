import Footer from "../common/Footer";
import Header from "../common/Header";
import SearchBar from "../common/SearchBar";
import divStyle from "./Main.module.css";

function Main() {
  return (
    <>
      <Header />
      <div className={divStyle.main}>
         <SearchBar/>
          <div className={divStyle.videoList}>
            <ul>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>
      <Footer/>
    </>
  );
}
export default Main;
