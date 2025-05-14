import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";


function Layout(){
    return(
        <>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header/>
                <main style={{ flex: 1,overflowY: "auto"}}>
                    <Outlet/>
                </main>
            <Footer/>
        </div>
        </>
    )
}
export default Layout;