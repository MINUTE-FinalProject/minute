import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import styles from "./Layout.module.css";


function Layout(){
    return(
        <>
        <div className={styles.layoutStyle}>
            <Header/>
                <main style={{ flex: 1}}>
                    <Outlet/>
                </main>
            <Footer/>
        </div>
        </>
    )
}
export default Layout;