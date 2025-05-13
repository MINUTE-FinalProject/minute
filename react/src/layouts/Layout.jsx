import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import layoutStyle from './Layout.module.css';


function Layout(){
    return(
        <>
            <Header/>
            <main className={layoutStyle.mainContentWithFixedHeader}>
                <Outlet/>
            </main>
            <Footer/>
        </>
    )
}
export default Layout;