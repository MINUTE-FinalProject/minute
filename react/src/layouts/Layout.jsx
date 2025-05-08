import { Outlet } from "react-router-dom";
import Footer from "../common/Footer";
import Header from "../common/Header";

function Layout(){
    return(
        <>
            <Header/>
            <main>
                <Outlet/>
            </main>
            <Footer/>
        </>
    )
}
export default Layout;