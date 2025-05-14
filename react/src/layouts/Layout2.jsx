import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import MypageNav from "../components/MypageNavBar/MypageNav";


function Layout(){
    return(
        <>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <MypageNav/>
                <main style={{ flex: 1,overflowY: "auto"}}>
                    <Outlet/>
                </main>
            <Footer/>
        </div>
        </>
    )
}
export default Layout;